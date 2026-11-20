# WatchHub — Cloud Database Gate & Reachability Status

**Document:** `CLOUD_DATABASE_STATUS.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Database Administrator & DevOps Engineer  
**Scope:** Cloud Database Gate Assessment for Vercel Serverless Deployment.

---

## 1. Cloud Database Gate Verdict

### **GATE STATUS: ⛔ BLOCKED (Localhost Configuration Detected)**

> [!CAUTION]
> **Blocking Condition:**  
> The active `DATABASE_URL` currently configured in the project points to the local loopback address `127.0.0.1:1433`.  
> Deploying to Vercel production without a cloud-accessible database will cause an immediate `HTTP 500` outage across all API routes.

---

## 2. Technical Evidence & Inspection Data

### 2.1 Active Connection String Inspection
Inspection of `server/.env` reveals:
```text
DATABASE_URL="sqlserver://127.0.0.1:1433;database=WatchHubDB;integratedSecurity=true;trustServerCertificate=true"
```

### 2.2 Network Boundary Analysis
* **Local Environment:** The Microsoft SQL Server 2025 instance is running on host `Shreya` bound strictly to `127.0.0.1:1433`.
* **Vercel Runtime:** Vercel functions execute in ephemeral, sandboxed Linux microVMs within AWS Mumbai (`bom1`).
* **The Disconnect:** When code on Vercel attempts to connect to `127.0.0.1:1433`, it probes the microVM's own internal loopback interface, where no SQL Server exists.
* **Execution Failure:** This produces an immediate fatal crash:
  ```text
  PrismaClientInitializationError: Can't reach database server at 127.0.0.1:1433
  ```

---

## 3. Cloud Database Requirements for Production

To unblock deployment, the database must meet the following criteria:

| Requirement | Specification | Rationale |
| :--- | :--- | :--- |
| **Engine Compatibility** | Microsoft SQL Server (Azure SQL Database recommended) | 100% compatible with existing Prisma 6.19.3 schema and T-SQL features. |
| **Public CA TLS Trust** | Valid public certificate (`*.database.windows.net`) | Enables secure connections with `encrypt=true;trustServerCertificate=false`. |
| **Network Accessibility**| Public endpoint with IP firewall allowlist | Vercel serverless containers require inbound connectivity over port 1433. |
| **Region** | `Central India` (Pune) or `South India` (Chennai) | Ensures sub-15ms latency to Vercel's Mumbai (`bom1`) containers. |
| **Cost Profile** | Azure SQL Serverless (Free tier) or Basic 5 DTU (~$5/mo) | Zero up-front infrastructure cost; predictable scaling. |

---

## 4. Unblocking Procedure

The Cloud Database Gate will transition to **`PASSED`** once the following steps are performed:

1. **Provision Database:** Create Azure SQL Database `WatchHubDB` in Central India.
2. **Configure Firewall:** Enable *"Allow Azure services and resources to access this server"*, and add your local IP.
3. **Deploy Schema:** Run `npx prisma db push --schema=server/prisma/schema.prisma` against the cloud database.
4. **Apply V3 OTP Indexes:** Run `node server/scripts/apply_v3_otp_migration.mjs` against the cloud database.
5. **Seed Baseline Data:** Run `node server/scripts/seed_mssql_prisma.mjs` against the cloud database.
6. **Prisma Connection Test:** Execute a non-destructive query (`SELECT 1 AS healthy, DB_NAME()`) confirming TLS and data presence.
7. **Configure Vercel:** Save the verified cloud `DATABASE_URL` in Vercel Project Settings.
