# PHASE 2 SQL SERVER CONNECTION REPORT
## Microsoft SQL Server 2025 Database Inspection & Health

### 1. Local Database Status
* **Engine**: Microsoft SQL Server 2025
* **Target Database**: `WatchHubDB`
* **Address**: `127.0.0.1:1433`
* **Prisma Communication**: Verified via `SELECT 1 AS healthy;` (**PASS**).
* **Table Inventory**: **24 Relational Tables** present.
* **User Accounts**: 9 seeded accounts (including `superadmin@watchhub.com`, `admin@watchhub.com`).
* **Active Schema**: Upgraded to V3 with `DispatchToken`, `DispatchState`, `DispatchLockedUntil`, and `UQ_OTPVerifications_Identifier_Purpose`.

---

### 2. Production Remote Reachability Notice

> [!WARNING]
> **Production Database Reachability (BLOCKED on Vercel without Cloud URL)**
> * The local database at `127.0.0.1:1433` is hosted on this machine's private loopback interface.
> * Vercel Serverless Functions run inside isolated AWS Mumbai (`bom1`) containers that **cannot** reach `127.0.0.1:1433`.
> * In Vercel Project Settings, `DATABASE_URL` must point to an externally reachable Microsoft SQL Server instance (e.g. Azure SQL, AWS RDS for SQL Server, or a secure Cloudflare / ngrok TCP tunnel).
> * The backend code strictly handles database connectivity and will return HTTP 500 with meaningful error logging if `DATABASE_URL` is unreachable, while the frontend will cleanly display:
>   *"Authentication server error (HTTP 500). Please try again later."*
