# WatchHub — Microsoft SQL Server Cloud Hosting Feasibility Analysis

**Document:** `WATCHHUB_VERCEL_PRODUCTION_READINESS/SQL_SERVER_CLOUD_HOSTING_OPTIONS.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Microsoft SQL Server Deployment Specialist  
**Current State:** Microsoft SQL Server 2025 Developer/Enterprise on `127.0.0.1:1433` (`WatchHubDB`)  
**Objective:** Independent Feasibility Analysis and Cloud Database Recommendations for Vercel Serverless Integration.

---

## 1. Problem Statement: Vercel to Localhost Incompatibility

The WatchHub production frontend and API endpoints are hosted on Vercel:
- **Live URL:** `https://watchhub-store-silk.vercel.app`
- **Vercel Region:** AWS Mumbai (`bom1`) / Serverless MicroVMs (Firecracker)

Vercel functions execute in isolated, ephemeral Linux containers in public AWS cloud data centers.
- The local database URL: `sqlserver://127.0.0.1:1433;database=WatchHubDB;integratedSecurity=true;trustServerCertificate=true` references the loopback address of the execution environment.
- On Vercel, `127.0.0.1` points to the ephemeral container itself, which has no SQL Server running.
- Consequently, all attempts to invoke database queries from Vercel crash immediately with:
  ```text
  PrismaClientInitializationError: Can't reach database server at 127.0.0.1:1433
  ```
- **Architectural Imperative:** A cloud-accessible, TLS-secured Microsoft SQL Server instance must be provisioned.

---

## 2. Cloud Hosting Options Feasibility Analysis

We evaluated three architectural options for running Microsoft SQL Server in the cloud with Prisma 6.19.3:

| Criterion | Option 1: Azure SQL Database (PaaS Serverless / Basic) | Option 2: AWS RDS for SQL Server (Express / Web) | Option 3: Cloud VM with Docker SQL Server 2025 |
| :--- | :--- | :--- | :--- |
| **Service Model** | Managed PaaS (Serverless or Provisioned) | Managed DBaaS on AWS | Self-managed IaaS VM / Container |
| **Engine Compatibility** | Microsoft SQL Server (100% T-SQL compatible) | Microsoft SQL Server (100% compatible) | Microsoft SQL Server 2025 Developer/Express |
| **Prisma MSSQL Support** | Fully certified by Prisma Team | Fully certified by Prisma Team | Supported |
| **Approximate Cost** | **Free Tier Eligible** (100k vCore-sec/mo) or ~$5.00/mo (Basic 5 DTU) | ~$18 - $25/month (db.t3.micro / db.t4g.micro) | ~$6 - $12/month (DigitalOcean / Hetzner / AWS EC2) |
| **Network & Firewall** | Built-in Azure firewall with IP whitelisting | AWS Security Groups + VPC peering / public IP | Manual UFW firewall / Reverse Proxy |
| **TLS Certificate** | **Native trusted public CA certificate** (DigiCert / Microsoft IT TLS CA) | AWS RDS public CA certificate | Self-signed (requires Let's Encrypt or private CA) |
| **`trustServerCertificate`**| `false` (Industry standard production TLS) | `false` (when RDS root CA bundle installed) | Requires `true` unless custom CA configured |
| **Automated Backups** | Continuous Point-in-time restore (1 to 35 days) | Automated daily snapshots | Manual cron `BACKUP DATABASE` to S3 / Blob |
| **Maintenance Burden** | Zero OS or patching maintenance | Zero OS maintenance, minor engine patching | High (OS updates, Docker daemon, storage volume scaling) |

---

## 3. Recommended Safest Practical Option: Azure SQL Database

### Why Azure SQL Database is the Recommended Choice:
1. **First-Party Microsoft Engineering:** Azure SQL is built directly by Microsoft's SQL Server engineering team, ensuring 100% parity with SQL Server 2025 features (e.g., compound unique constraints, clustered indexes, temporal tables).
2. **Native TLS with Public CA Trust:** Azure SQL certificates are issued by universally trusted public Certificate Authorities (`*.database.windows.net`). This allows WatchHub to enforce:
   ```text
   encrypt=true;trustServerCertificate=false
   ```
   This prevents Man-in-the-Middle (MITM) attacks and complies with strict financial/e-commerce security standards.
3. **Cost Efficiency:**
   - **Azure Free Account:** Azure provides 12 months of free services with **100,000 vCore seconds of Azure SQL Database Serverless every month** and 32 GB storage.
   - **Predictable Low-Cost Tier (Basic):** If continuous uptime without auto-pause latency is preferred, the **Azure SQL Basic Tier (5 DTUs, 2 GB storage)** costs approximately **$4.99 to $5.40 USD per month**.
4. **Vercel Serverless Connection Scalability:** Azure SQL Serverless handles connection spikes seamlessly with automatic scaling.

---

## 4. Technical Implementation & Provisioning Guide

### 4.1 Provisioning Azure SQL Database via Azure Portal

1. Log into the [Azure Portal](https://portal.azure.com).
2. Search for **SQL databases** and click **Create**.
3. Configure the **Basics** tab:
   - **Subscription:** Select active subscription (or Azure Free Account).
   - **Resource Group:** Create `rg-watchhub-production`.
   - **Database Name:** `WatchHubDB`.
   - **Server:** Click **Create new**:
     - *Server name:* `watchhub-sql-server` (resolves to `watchhub-sql-server.database.windows.net`).
     - *Location:* `Central India` (Pune) or `South India` (Chennai) — closest to Vercel's AWS Mumbai region for sub-10ms latency.
     - *Authentication:* Use **SQL and Microsoft Entra authentication** (or SQL authentication only).
     - *Server Admin Login:* `watchhub_admin`.
     - *Password:* Use a strong 24-character generated password.
4. Configure **Compute + Storage**:
   - For Free Tier / Low Traffic: Select **General Purpose - Serverless** (Auto-pause after 1 hour).
   - For Persistent Low Latency: Select **Standard** or **Basic** (5 DTU, ~$5/mo).
5. Configure **Networking**:
   - **Connectivity method:** *Public endpoint*.
   - **Allow Azure services and resources to access this server:** Set to **Yes** (enables cloud connectivity).
   - **Add current client IP address:** Set to **Yes** (allows your local machine to migrate schema and seed data).

---

### 4.2 Network & TLS Configuration

#### Crucial Security Rule:
> [!IMPORTANT]
> Never set `trustServerCertificate=true` in production!
> `trustServerCertificate=true` disables certificate validation, allowing any attacker on the network path to impersonate the database.

In Azure SQL Database, the server presents a valid certificate for `*.database.windows.net`.
The Prisma connection string in production must be:

```text
DATABASE_URL="sqlserver://watchhub-sql-server.database.windows.net:1433;database=WatchHubDB;user=watchhub_admin;password=<SECURE_PASSWORD>;encrypt=true;trustServerCertificate=false"
```

* `encrypt=true`: Enforces TLS 1.2+ encryption for all transit packets.
* `trustServerCertificate=false`: Validates that the server's certificate is legitimately signed by Microsoft's public root CA.

---

## 5. Alternative Options Evaluated

### Option 2: AWS RDS for SQL Server Express
* **Pros:** Resides in AWS Mumbai (`ap-south-1`), within the exact same physical cloud facility as Vercel's Mumbai edge servers.
* **Cons:**
  - SQL Server licensing on AWS has a higher minimum monthly cost (~$18 to $25/mo for `db.t3.micro`).
  - No permanent free tier for SQL Server on RDS.
* **Verdict:** Feasible, but 4x the cost of Azure SQL Basic.

### Option 3: Self-Hosted Docker SQL Server 2025 on a Linux VPS
* **Pros:** Can run SQL Server 2025 Developer Edition (free for dev/testing) on an inexpensive VPS ($5/mo from Hetzner or DigitalOcean).
* **Cons:**
  - Production licensing requires SQL Server Standard/Enterprise license or SQL Server Express Edition (limited to 1.4 GB RAM and 10 GB DB).
  - Requires setting up a reverse proxy (e.g. NGINX with stream TLS proxy or Let's Encrypt certificate) to avoid `trustServerCertificate=true`.
  - Manual backup and failover management.
* **Verdict:** Not recommended for production e-commerce.

---

## 6. Migration Feasibility & Data Protection

* **Safety Guarantee:** The existing local `WatchHubDB` on `127.0.0.1:1433` remains **untouched** during provisioning.
* **Execution:** Once the cloud database is created, the Prisma schema is deployed using forward-only DDL (`npx prisma db push`), and existing seed accounts are populated safely via script.
* Detailed steps are documented in `DATABASE_MIGRATION_PLAN.md`.
