# WATCHHUB — PHASE 2 RISK REGISTER
**Comprehensive Risk Analysis, Mitigation Strategies & Contingency Planning**

- **Project**: WatchHub — Luxury Horology E-Commerce Platform
- **Scope**: Phase 2 Microsoft SQL Server Migration & Persistence Architecture
- **Review Date**: November 19, 2026
- **Status**: **ACTIVE ASSESSMENT — ALL MITIGATIONS DOCUMENTED**

---

## 1. Risk Evaluation Methodology

Risks are assessed based on **Probability (1–5)** and **Impact (1–5)** to compute a Risk Severity Score (**Probability × Impact = 1–25**):
- **Critical (20–25)**: Unacceptable risk requiring mandatory architectural correction prior to approval.
- **High (12–19)**: Significant risk requiring automated safeguards, validation gates, and pre-tested rollback plans.
- **Medium (6–11)**: Moderate risk managed through operational procedures and testing suites.
- **Low (1–5)**: Minor risk managed through standard engineering hygiene.

---

## 2. Risk Register Matrix

| Risk ID | Category | Risk Description | Pre-Prob | Pre-Imp | Pre-Score | Mitigation Strategy | Contingency & Trigger Point | Post-Prob | Post-Imp | Post-Score | Status |
|:---:|---|---|:---:|:---:|:---:|---|---|:---:|:---:|:---:|:---:|
| **RSK-001** | Authentication | **Prisma Connector Incompatibility with Windows Integrated Auth (`integratedSecurity=true`)**: Prisma's Rust engine lacks SSPI/NTLM support; passing this parameter fails connection initialization. | 5 | 5 | **25 (Crit)** | Adopt SQL Server Authentication (Mixed Mode). Provision dedicated service account (`watchhub_app`) with `db_owner` permissions on `WatchHubDB`. Keep credentials exclusively in untracked `server/.env`. | If connection fails at init, immediately verify SQL Server mixed-mode state and SQL Browser service; verify credentials with `sqlcmd -U`. | 1 | 4 | **4 (Low)** | **MITIGATED** |
| **RSK-002** | Data Integrity | **Dual-Stack Split-Brain Inconsistency**: Live writes occurring simultaneously across MongoDB and MSSQL without designated authority leads to inventory drift and ghost orders. | 4 | 5 | **20 (Crit)** | Enforce strict 4-stage Source-of-Truth rules. MongoDB remains 100% authoritative during Stages 1–3. Stage 4 uses asynchronous shadow writes with error isolation. MSSQL only promoted after 100% reconciliation. | If record counts diverge during shadow mode, halt promotion; re-sync from MongoDB primary snapshot; investigate failed write queue. | 1 | 5 | **5 (Low)** | **MITIGATED** |
| **RSK-003** | Relational Schema | **MSSQL Error 1785 (Referential Cascade Cycles)**: Multiple cascade paths on tables like `OrderItems`, `Deliveries`, and `SupportMessages` cause migration crashes in SQL Server. | 5 | 4 | **20 (Crit)** | Resolved in `server/prisma/schema.prisma` by setting `onDelete: NoAction, onUpdate: NoAction` on secondary relational paths. Validated with `prisma validate`. | Schema validation command automated in CI/CD pipeline. Halts execution if referential cycles are detected. | 1 | 3 | **3 (Low)** | **MITIGATED** |
| **RSK-004** | Disaster Recovery | **Corrupted or Incomplete MongoDB Backup**: Migration proceeds without a verified, restorable snapshot, preventing rollback in the event of migration failure. | 3 | 5 | **15 (High)** | Mandatory Pre-Migration Snapshot script exporting all collections with SHA-256 checksums and automated dry-run restore into an isolated verification namespace (`WatchHub_Backup_Verification`). | Migration is blocked until dry-run restore passes with 100% record match. If restore fails, abort Phase 2 immediately. | 1 | 5 | **5 (Low)** | **MITIGATED** |
| **RSK-005** | Seeding Safety | **Duplicate Records & Primary Key Violations on Re-seeding**: Non-idempotent seed scripts crash on re-runs or generate duplicate admin users, products, and categories. | 4 | 4 | **16 (High)** | Enforce strict `upsert` semantics across all seeders: Roles by `roleName`, Permissions by `permissionCode`, Users by `email`, Brands/Categories by `slug`, Products by `sku`, Coupons by `code`. | Running seed scripts 1 time or 10 times produces identical database state without duplicate key errors or ghost rows. | 1 | 2 | **2 (Low)** | **MITIGATED** |
| **RSK-006** | Schema Governance | **Schema Drift and Untracked State from `prisma db push`**: Ephemeral schema pushes bypass migration history, preventing reproducibility and CI/CD automation. | 4 | 4 | **16 (High)** | Formally designate `prisma migrate dev` / `prisma migrate deploy` as the mandatory schema lifecycle standard. Create timestamped migration files tracked in `_prisma_migrations`. | Prohibit `prisma db push` in all production scripts and README documentation. | 1 | 3 | **3 (Low)** | **MITIGATED** |
| **RSK-007** | Client Stability | **API Contract Mutation Breaking Frontend**: Refactoring controllers from Mongoose to Prisma alters JSON key casing or response envelopes, breaking client UI components. | 3 | 4 | **12 (High)** | Enforce API Contract Invariance: All Prisma query results must be mapped to exact existing response shapes (`{ status: 'success', data: { ... } }`) and identical HTTP status codes. | Run 34 backend API regression tests and 31 independent verification probes against migrated endpoints; zero client regressions allowed. | 1 | 4 | **4 (Low)** | **MITIGATED** |
| **RSK-008** | Security & RBAC | **Accidental RBAC Bypass or Secret Leakage**: Refactoring controllers omits `authenticate` or `authorizeRoles`, or exposes database passwords in Git tracking. | 4 | 5 | **20 (Crit)** | Maintain route-level middleware declarations completely untouched. Verify zero database credentials in Git tracking (`git ls-files .env` empty). | Independent security harness (`run_independent_verification.js`) tests all 5 dashboards and product mutations for 401/403 enforcement. | 1 | 5 | **5 (Low)** | **MITIGATED** |
| **RSK-009** | Engine Protocol | **TLS/SSL Certificate Handshake Failure on SQL Server 2025**: SQL Server 2025 enforces encryption by default, dropping connections with self-signed certificates. | 4 | 3 | **12 (High)** | Configure `encrypt=true;trustServerCertificate=true` in `DATABASE_URL` query string. | Real-time TCP probe `SELECT 'TCP_1433_CONNECTED'` verifies handshake parameters before running application server. | 1 | 2 | **2 (Low)** | **MITIGATED** |
| **RSK-010** | Operational Scale | **Connection Pool Exhaustion**: Prisma client creating multiple unmanaged instances during server reloads, exhausting SQL Server worker threads. | 3 | 3 | **9 (Med)** | Implement Prisma Client Singleton pattern in `server/src/config/prisma.js` attaching instance to `globalThis` in development. | Configure connection pool limits in connection string: `connection_limit=20`. Add graceful shutdown handlers on `SIGINT`/`SIGTERM`. | 1 | 2 | **2 (Low)** | **MITIGATED** |

---

## 3. High-Priority Risk Action Plans

### Action Plan 1: SQL Server Authentication Setup (RSK-001)
1. In SQL Server Management Studio (SSMS), right-click Server ➔ Properties ➔ Security ➔ select **SQL Server and Windows Authentication mode**.
2. Create dedicated login:
   ```sql
   CREATE LOGIN watchhub_app WITH PASSWORD = '<StrongPassword2026!>';
   ```
3. Grant access to `WatchHubDB`:
   ```sql
   USE WatchHubDB;
   CREATE USER watchhub_app FOR LOGIN watchhub_app;
   ALTER ROLE db_owner ADD MEMBER watchhub_app;
   ```
4. Set in `server/.env`:
   ```env
   DATABASE_URL="sqlserver://127.0.0.1:1433;database=WatchHubDB;user=watchhub_app;password=<StrongPassword2026!>;encrypt=true;trustServerCertificate=true"
   ```

### Action Plan 2: Zero Data Loss Dual-Stack Governance (RSK-002)
- Under no circumstances will MongoDB data be dropped or truncated during migration.
- Both MongoDB and MSSQL run side-by-side during validation.
- Rollback can be triggered within 15 seconds by updating the single `DB_ADAPTER` environment toggle from `prisma` to `mongoose`.
