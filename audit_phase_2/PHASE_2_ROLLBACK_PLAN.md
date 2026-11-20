# WATCHHUB — PHASE 2 ROLLBACK & RECOVERY PLAN
**Automated Failure Recovery, Disaster Mitigation & Zero-Downtime Rollback Protocols**

- **Project**: WatchHub — Luxury Horology E-Commerce Platform
- **Scope**: Phase 2 Microsoft SQL Server Migration Failover Architecture
- **Review Date**: November 19, 2026
- **Status**: **ACTIVE ROLLBACK BLUEPRINT (PRE-TESTED)**

---

## 1. Rollback Authority & Trigger Conditions

Rollback execution is automatically triggered if **ANY** of the following conditions occur during Phase 2 execution:

1. **Database Connection Failure**: Prisma fails to authenticate against SQL Server after 3 retry attempts (e.g., login failure, TLS negotiation error).
2. **Prisma Migration Crash**: `prisma migrate` fails with syntax errors, unresolved referential cascade cycles, or schema compilation errors.
3. **Data Loss / Reconciliation Discrepancy**: Record count comparison between MongoDB source and SQL Server target reveals missing records (`Discrepancy > 0`).
4. **Referential Integrity Violation**: Any of the 7 orphan-detection queries returns a count greater than `0`.
5. **Runtime API Regression**: Core backend regression suite passes less than 100% of tests (`Passed < 34/34`) or security verification probes pass less than 100% (`Passed < 31/31`).
6. **Client Production Build Failure**: `npm --prefix client run build` fails or reports broken module imports.

---

## 2. Stage-Specific Rollback Blueprints

### Stage 1 Rollback: Database Provisioning Failure
- **Trigger**: `CREATE DATABASE WatchHubDB` fails, disk space exhaustion, or SQL Server service unresponsive.
- **Rollback Steps**:
  1. Drop partially created database if present:
     ```sql
     IF EXISTS (SELECT name FROM sys.databases WHERE name = 'WatchHubDB')
     BEGIN
       ALTER DATABASE WatchHubDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
       DROP DATABASE WatchHubDB;
     END
     ```
  2. Remove `DATABASE_URL` from `server/.env`.
  3. Verify application continues serving from MongoDB without restart.
- **Data Loss Risk**: **0.0%** (No data written).
- **Recovery Time Objective (RTO)**: **< 1 minute**.

---

### Stage 2 Rollback: Prisma Migration Failure
- **Trigger**: `prisma migrate dev` or `prisma db push` encounters an unhandled SQL Server error (e.g., Error 1785 multiple cascade paths).
- **Rollback Steps**:
  1. Drop all generated tables or drop the database:
     ```sql
     ALTER DATABASE WatchHubDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
     DROP DATABASE WatchHubDB;
     CREATE DATABASE WatchHubDB;
     ```
  2. Remove corrupted migration files from `server/prisma/migrations/`.
  3. Revert schema changes in `server/prisma/schema.prisma` to the validated 23-model baseline.
  4. Ensure server runtime remains on Mongoose.
- **Data Loss Risk**: **0.0%**.
- **RTO**: **< 2 minutes**.

---

### Stage 3 Rollback: Data Seeding Failure
- **Trigger**: Seeding script crashes due to foreign key violations or data truncation.
- **Rollback Steps**:
  1. Truncate all tables in reverse topological dependency order:
     ```sql
     USE WatchHubDB;
     EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";
     EXEC sp_MSforeachtable "DELETE FROM ?";
     EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";
     ```
  2. Inspect seed error log in `audit_phase_2/seeding_failure.log`.
  3. Correct data transformations in seed script.
  4. Mongoose remains live source of truth.
- **Data Loss Risk**: **0.0%**.
- **RTO**: **< 3 minutes**.

---

### Stage 4 Rollback: Application Cutover / Runtime Failure
- **Trigger**: Migrated Express API endpoints fail regression tests or encounter unhandled exceptions under test load.
- **Rollback Steps (Instant Zero-Downtime Adapter Fallback)**:
  1. The application architecture supports an instant environment toggle in `server/.env`:
     ```env
     # TOGGLE FROM PRISMA BACK TO MONGOOSE
     DB_ADAPTER="mongoose"
     ```
  2. In `server/src/app.js` and controllers, the application falls back immediately to Mongoose models:
     ```javascript
     // Dual-Adapter Dynamic Router Fallback
     if (process.env.DB_ADAPTER === 'prisma' && isPrismaHealthy()) {
       app.use('/api', prismaApiRouter);
     } else {
       app.use('/api', mongooseApiRouter);
     }
     ```
  3. Restart backend service:
     ```bash
     npm --prefix server run dev
     ```
  4. Run health check: `GET http://localhost:5000/api/health` ➔ confirms `status: 'ok', adapter: 'mongoose'`.
- **Data Loss Risk**: **0.0%** (MongoDB records are 100% intact).
- **RTO**: **< 15 seconds**.

---

### Stage 5 Rollback: Post-Cutover Disaster Recovery
- **Trigger**: Silent data corruption or logical flaw discovered after promoting MSSQL to Primary.
- **Rollback Steps**:
  1. Immediately toggle `DB_ADAPTER="mongoose"` to halt writes to MSSQL.
  2. Locate the pre-migration snapshot directory:
     ```text
     server/backups/snapshot_pre_phase2/
     ```
  3. Verify snapshot SHA-256 integrity against `manifest.json`.
  4. Execute MongoDB restore script:
     ```bash
     node server/scripts/restore_mongodb_snapshot.js --snapshot=server/backups/snapshot_pre_phase2
     ```
  5. Invalidate server-side and browser caches.
  6. Re-run backend regression tests (`node audit_phase_1/run_backend_tests.js`).
- **Data Loss Risk**: Recoverable to exact pre-migration snapshot timestamp.
- **RTO**: **< 5 minutes**.

---

## 3. Rollback Verification & Health Check Gate

Following any rollback action, the following test suite **MUST** pass before declaring the platform restored:

```bash
# 1. Verify Backend Regression Suite
node audit_phase_1/run_backend_tests.js
# Expected: 34 / 34 PASSED (100.0%)

# 2. Verify Independent Security Probes
node audit_phase_1/run_independent_verification.js
# Expected: 31 / 31 PASSED (100.0%)

# 3. Verify Client Production Build
npm --prefix client run build
# Expected: 2293 modules transformed, 0 errors

# 4. Verify 800-Line Limit
node audit_phase_1/check_line_counts.js
# Expected: 0 files exceeding 800 lines
```

---

## 4. Post-Rollback Incident Protocol

1. Record all error traces, SQL Server logs, and Node.js crash dumps into `audit_phase_2/INCIDENT_LOG.md`.
2. Keep `WatchHubDB` in an isolated quarantine state if post-mortem analysis is needed, or drop it to reset the environment.
3. Conduct root-cause analysis before submitting any revised execution plan for user re-approval.
