# WatchHub — Phase 1 Database Test Results & Connectivity Audit

## 1. Actual Database Tests Executed

| Test ID | Target Database | Test Scenario | Execution Command / Script | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC_DB_MONGO_001** | MongoDB (Local) | Verify local MongoDB instance on default port `27017` | Node.js script connecting to `mongodb://127.0.0.1:27017/watchhub` with 2000ms timeout | Successful MongoDB connection | `connect EACCES 127.0.0.1:27017` (No Windows MongoDB service installed or running) | **BLOCKED** |
| **TC_DB_MSSQL_001** | Microsoft SQL Server | Verify local SQL Server instance (`localhost`) | `sqlcmd -S localhost -E -l 2 -Q "SELECT @@VERSION"` | SQL Server version string returned | `Named Pipes Provider: Could not open a connection to SQL Server [5]. Server is not found or not accessible.` | **BLOCKED** |
| **TC_DB_MSSQL_002** | Microsoft SQL Server | Verify local SQL Server Express instance (`.\SQLEXPRESS`) | `sqlcmd -S ".\SQLEXPRESS" -E -l 2 -Q "SELECT @@VERSION"` | SQL Server Express version string returned | `SQL Server Network Interfaces: Error Locating Server/Instance Specified [xFFFFFFFF].` | **BLOCKED** |
| **TC_DB_TOOLS_001** | SQL Server Tools | Verify presence of `sqlcmd` command line utility | `Get-Command sqlcmd` | `sqlcmd.exe` located in system PATH | `sqlcmd.exe v15.0.1300.359` detected in `C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\` | **PASS** |

---

## 2. Analysis of Test Results

### 1. MongoDB Status:
- The existing codebase was scaffolded with Mongoose expecting a local or Atlas MongoDB connection.
- Local MongoDB connection timed out. User was in the process of provisioning a MongoDB Atlas cloud cluster.
- In accordance with the new project mandate: **Microsoft SQL Server is the official target database; MongoDB will be decommissioned in Phase 2.**

### 2. Microsoft SQL Server Status:
- The command-line client utility `sqlcmd.exe` (ODBC Driver 17) is already installed on the system.
- However, no active local SQL Server database engine service (`MSSQLSERVER` or `MSSQL$SQLEXPRESS`) is currently started or responding on localhost ports.
- In strict adherence to Phase 1 Audit Rules:
  - **No SQL Server software was installed.**
  - **No packages or dependencies were modified.**
  - **The test status is officially marked as BLOCKED.**

---

## 3. Prerequisite Steps to Unblock SQL Server in Phase 2

To establish full operational connectivity to Microsoft SQL Server in Phase 2, execute one of the following two approved paths:

### Option A: Local Development Setup (SQL Server Express — Free)
1. Download and install **Microsoft SQL Server 2022 Express** from Microsoft's official portal.
2. Select **Basic** installation type (instance name: `SQLEXPRESS` or default `MSSQLSERVER`).
3. Enable **TCP/IP** protocol in *SQL Server Configuration Manager* on port `1433`.
4. Ensure *SQL Server Browser* service is started if using named instances.
5. Create a dedicated database:
   ```sql
   CREATE DATABASE WatchHubDB;
   ```
6. Set the backend connection string in `server/.env`:
   ```env
   MSSQL_CONNECTION_STRING="Server=localhost;Database=WatchHubDB;Trusted_Connection=True;Encrypt=False;"
   ```

### Option B: Cloud Database (Azure SQL Database / AWS RDS for SQL Server)
1. Provision a serverless Azure SQL Database (`WatchHubDB`).
2. Add client IP address to the Azure SQL Server firewall allowlist.
3. Configure the secure connection string in `server/.env`:
   ```env
   MSSQL_CONNECTION_STRING="Server=tcp:watchhub.database.windows.net,1433;Initial Catalog=WatchHubDB;Persist Security Info=False;User ID=watchhub_admin;Password=<StrongPassword>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
   ```
