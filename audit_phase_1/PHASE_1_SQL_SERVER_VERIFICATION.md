# WatchHub — Phase 1 Microsoft SQL Server Verification & Connectivity Status

## 1. Official Database Architecture Decision

**Target Database**: **Microsoft SQL Server (MSSQL)**  
**ORM / Data Access Layer**: **Prisma ORM (`@prisma/client` + `prisma`)**  
**Decommissioned Datastore**: MongoDB Atlas is discontinued as the target database.

---

## 2. Actual Connectivity Tests Executed

| Test ID | Database Instance Tested | Execution Command | Result & Terminal Output | Official Status |
|---|---|---|---|---|
| **TC_DB_MSSQL_001** | Localhost default instance (`1433`) | `sqlcmd -S localhost -E -l 2 -Q "SELECT @@VERSION"` | `Sqlcmd: Error: Named Pipes Provider: Could not open a connection to SQL Server [5]. Server is not found or not accessible.` | **BLOCKED** |
| **TC_DB_MSSQL_002** | Local Named Instance (`.\SQLEXPRESS`) | `sqlcmd -S ".\SQLEXPRESS" -E -l 2 -Q "SELECT @@VERSION"` | `Sqlcmd: Error: SQL Server Network Interfaces: Error Locating Server/Instance Specified [xFFFFFFFF].` | **BLOCKED** |
| **TC_DB_LOCALDB_001** | SQL Server LocalDB (`sqllocaldb`) | `sqllocaldb info` | `Unexpected error occurred while trying to access the LocalDB instance registry configuration.` | **BLOCKED** |
| **TC_DB_TOOLS_001** | SQL Server CLI Utility (`sqlcmd.exe`) | `Get-Command sqlcmd` | `sqlcmd.exe v15.0.1300.359` detected in `C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\` | **PASS** |

---

## 3. Root Cause Analysis of BLOCKED Status

1. **Client Utility vs Database Service**:
   - The Microsoft SQL Server client CLI utility (`sqlcmd.exe`) and ODBC Driver 17 are installed on this Windows workstation.
   - However, no active SQL Server database engine service (`MSSQLSERVER` or `MSSQL$SQLEXPRESS`) is currently installed, configured, or running on port `1433`.
2. **Docker Not Available**:
   - `docker` is not installed on the workstation, preventing containerized SQL Server execution (`mcr.microsoft.com/mssql/server`).
3. **Audit Execution Rule Honored**:
   - In accordance with the strict Phase 1 constraints:
     - No database software was downloaded or silently installed.
     - No system configuration was modified.
     - Database status is accurately reported as **BLOCKED (Awaiting Service Startup / Cloud Instance)**.

---

## 4. Prerequisite Steps to Unblock SQL Server Migration

To execute the Prisma migration and seed the 22 relational tables, the user must provide one of the following:

### Option 1: Provide an Azure SQL Database Connection String (Recommended)
1. Provision a Serverless Azure SQL Database (`WatchHubDB`).
2. Whitelist your current IP address in Azure SQL Server Firewall.
3. Provide the connection string for `server/.env`:
   ```env
   DATABASE_URL="sqlserver://<server>.database.windows.net:1433;database=WatchHubDB;user=<username>;password=<password>;encrypt=true;trustServerCertificate=false"
   ```

### Option 2: Start Local SQL Server Express Service
1. Install **Microsoft SQL Server 2022 Express** (Free).
2. Open *SQL Server Configuration Manager*, enable **TCP/IP** on port `1433`, and start the **SQL Server (SQLEXPRESS)** service.
3. Create database: `CREATE DATABASE WatchHubDB;`
4. Provide the local connection string:
   ```env
   DATABASE_URL="sqlserver://localhost:1433;database=WatchHubDB;integratedSecurity=true;trustServerCertificate=true"
   ```
