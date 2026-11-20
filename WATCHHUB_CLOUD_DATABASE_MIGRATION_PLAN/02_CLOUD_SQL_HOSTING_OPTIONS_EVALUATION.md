# WatchHub — Cloud SQL Server Hosting Options & Recommendation

**Document:** `WATCHHUB_CLOUD_DATABASE_MIGRATION_PLAN/02_CLOUD_SQL_HOSTING_OPTIONS_EVALUATION.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Microsoft SQL Server Deployment Engineer  
**Objective:** Independent architectural evaluation of cloud database platforms for WatchHub Vercel deployment.

---

## 1. Cloud Database Hosting Comparison Matrix

We evaluated four candidate cloud deployment architectures against strict production criteria:
1. **Engine Compatibility:** Full support for Microsoft SQL Server 2025 T-SQL, compound indexes, and foreign keys.
2. **Prisma 6.19.3 Certification:** Certified connection handling and transaction isolation support.
3. **TLS & Public Root CA:** Support for `trustServerCertificate=false` with publicly trusted certificates.
4. **Monthly Cost & Free Tiers:** Minimum running costs for development and small-to-medium production.
5. **Latency to Vercel:** Network proximity to Vercel's Mumbai (`bom1`) AWS edge containers.

| Architecture Option | Service Model | Prisma Certified | Public CA TLS (`trustServerCertificate=false`) | Free Tier Available | Estimated Monthly Cost | Latency to Vercel (Mumbai) | Maintenance Burden |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Azure SQL Database** | Managed PaaS (Serverless / Provisioned) | **YES** (1st Party) | **YES** (DigiCert / Microsoft IT CA) | **YES** (100k vCore-sec/mo free for 12 mos) | **Free** or **~$5.00/mo** (Basic 5 DTU) | **< 15 ms** (Central India / Pune) | Zero (Automated backups, patching, scaling) |
| **2. AWS RDS for SQL Server** | Managed DBaaS on AWS | **YES** | **YES** (Amazon Root CA) | **NO** (SQL Server excluded from permanent free tier) | **~$18 - $28/mo** (`db.t3.micro` Express) | **< 5 ms** (AWS `ap-south-1` Mumbai) | Low (Automated backups, minor engine updates) |
| **3. Google Cloud SQL for SQL Server** | Managed DBaaS on GCP | **YES** | **YES** (Google Trust Services CA) | **NO** | **~$22 - $35/mo** (`db-custom-1-3840` Express) | **< 15 ms** (`asia-south1` Mumbai) | Low |
| **4. Cloud VPS with Docker SQL Server 2025** | Self-Managed IaaS (DigitalOcean, Hetzner, AWS EC2) | Supported | **NO** (Requires self-signed cert or complex Let's Encrypt reverse proxy) | **NO** | **~$6 - $12/mo** (2GB RAM VPS) | **Variable** (depends on region) | High (Manual OS updates, disk scaling, manual backups) |

---

## 2. Definitive Recommendation: Azure SQL Database

### **Primary Recommendation: Azure SQL Database (Serverless or Basic Tier)**

Azure SQL Database is recommended as the optimal production hosting platform for WatchHub for the following reasons:

### 2.1 First-Party Microsoft Architecture
* Developed and maintained directly by Microsoft SQL Server engineering.
* Guarantees 100% dialect and syntax compatibility with the existing local SQL Server 2025 Developer instance.
* Full support for compound unique indexes (`UQ_OTPVerifications_Identifier_Purpose`), cascading deletes, and snapshot isolation.

### 2.2 Enterprise TLS Security Without Insecure Flags
* Azure SQL Database endpoints (`*.database.windows.net`) are provisioned with valid public SSL/TLS certificates signed by trusted public root authorities (DigiCert / Microsoft).
* WatchHub can configure its production connection string with:
  ```text
  encrypt=true;trustServerCertificate=false
  ```
* This completely eliminates Man-in-the-Middle (MITM) vulnerabilities without requiring custom CA certificate installation on Vercel's serverless containers.

### 2.3 Transparent & Predictable Cost Structure
* **Azure Free Account:** Azure offers 12 months of popular free services, which includes **100,000 vCore-seconds per month free** of Azure SQL Database Serverless with 32 GB storage.
* **Basic Tier (Low-Cost Alternative):** If serverless auto-pause wake latency (approx. 20–30 seconds after 1 hour of inactivity) is undesirable, the **Basic Tier (5 DTUs, 2 GB storage)** provides 100% continuous uptime for **$4.99 to $5.40 USD per month**.

### 2.4 Low Latency to Vercel Mumbai
* Azure provides first-party data centers in **Central India (Pune)** and **South India (Chennai)**.
* Round-trip query latency between Vercel serverless functions in AWS Mumbai (`bom1`) and Azure Central India is typically between **8ms and 15ms**, ensuring fast API response times.

---

## 3. Security & Network Configuration Guidelines

When provisioning Azure SQL Database, the following security baseline must be enforced:

1. **Firewall Rules:**
   - Set **"Allow Azure services and resources to access this server"** to `Yes`.
   - Add your local administrative workstation IP to the firewall allowlist to perform the initial schema push and data seeding.
   - Do NOT open IP range `0.0.0.0` to `255.255.255.255`.
2. **Authentication Method:**
   - Select **SQL and Microsoft Entra authentication** (or SQL authentication only).
   - Create a dedicated non-sa database user (e.g. `watchhub_app`) with minimal necessary permissions (`db_datareader`, `db_datawriter`, `db_ddladmin`).
3. **Connection Encryption:**
   - Azure SQL Database enforces TLS 1.2 minimum on all inbound TDS (Tabular Data Stream) connections.

---

## 4. Connection String Architecture

The production Prisma connection string for Azure SQL Database must adhere to this exact format:

```text
DATABASE_URL="sqlserver://<server-name>.database.windows.net:1433;database=WatchHubDB;user=<db-user>;password=<db-password>;encrypt=true;trustServerCertificate=false"
```

* Zero credentials or passwords should be hardcoded in repository source files.
