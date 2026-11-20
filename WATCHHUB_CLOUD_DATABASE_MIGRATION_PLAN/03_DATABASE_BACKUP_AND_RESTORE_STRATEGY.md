# WatchHub — Database Backup & Disaster Recovery Strategy

**Document:** `WATCHHUB_CLOUD_DATABASE_MIGRATION_PLAN/03_DATABASE_BACKUP_AND_RESTORE_STRATEGY.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Database Administrator & DevOps Specialist  
**Source Database:** Local Microsoft SQL Server 2025 (`127.0.0.1:1433 / WatchHubDB`)  
**Target Environment:** Cloud Microsoft SQL Server (Azure SQL Database)  
**Objective:** Non-destructive local backup, export procedures, and cloud disaster recovery runbook.

---

## 1. Safety Mandate: Preserving Local Source Database

Before any cloud provisioning or data migration activity occurs, the local database on `127.0.0.1:1433` must be backed up as an immutable historical snapshot.

> [!IMPORTANT]
> The local SQL Server database will **NEVER** be dropped, modified, or used as a migration test sandbox. All export actions are strictly read-only.

---

## 2. Local Database Backup Procedures

Two backup formats are supported for Microsoft SQL Server:

### 2.1 Procedure A: Native T-SQL Full Database Backup (`.bak`)
Native SQL Server backups produce a byte-for-byte binary copy of data and transaction logs on disk.

#### T-SQL Execution (Read-Only to Source Database):
```sql
-- Run in SSMS or sqlcmd against 127.0.0.1:1433
BACKUP DATABASE [WatchHubDB]
TO DISK = N'C:\WatchHub_Backups\WatchHubDB_PreCloudMigration_20261120.bak'
WITH FORMAT, 
     MEDIANAME = 'WatchHubLocalBackup', 
     NAME = 'WatchHubDB Full Backup Before Cloud Migration',
     COMPRESSION,
     STATS = 10;
```

* **Storage:** Store the generated `.bak` file in a dedicated local backup directory (e.g. `C:\WatchHub_Backups\`).
* **Verification:** Run `RESTORE VERIFYONLY FROM DISK = N'C:\WatchHub_Backups\WatchHubDB_PreCloudMigration_20261120.bak';` to ensure binary integrity.

---

### 2.2 Procedure B: BACPAC Export (Schema + Data for Cloud Portability)
Azure SQL Database does not allow direct restoration of traditional `.bak` files from an on-premise filesystem. Instead, Microsoft provides the **BACPAC** (Data-Tier Application Export) format, which packages schema DDL and table data into an encrypted archive.

#### Command-Line Export via `sqlpackage.exe`:
```powershell
# Export local WatchHubDB to a portable BACPAC file
sqlpackage.exe /Action:Export `
  /SourceServerName:"127.0.0.1,1433" `
  /SourceDatabaseName:"WatchHubDB" `
  /TargetFile:"C:\WatchHub_Backups\WatchHubDB_Production_Export.bacpac"
```

#### Alternative: Export via SQL Server Management Studio (SSMS):
1. Open SSMS and connect to `127.0.0.1:1433`.
2. Expand **Databases** > Right-click **WatchHubDB**.
3. Select **Tasks** > **Export Data-tier Application...**.
4. In the wizard, select save destination: `C:\WatchHub_Backups\WatchHubDB_Production_Export.bacpac`.
5. Complete export.

---

## 3. Cloud Database Restore Procedure

When importing the baseline into Azure SQL Database:

### Command-Line Import via `sqlpackage.exe`:
```powershell
sqlpackage.exe /Action:Import `
  /TargetServerName:"<your-azure-server>.database.windows.net" `
  /TargetDatabaseName:"WatchHubDB" `
  /TargetUser:"<admin-user>" `
  /TargetPassword:"<secure-password>" `
  /SourceFile:"C:\WatchHub_Backups\WatchHubDB_Production_Export.bacpac"
```

* **Result:** Azure SQL Database provisions all 24 tables, schemas, clustered/nonclustered indexes, and populates existing data in a single automated step.

---

## 4. Cloud Disaster Recovery & Automated Backups

Once WatchHub is hosted on Azure SQL Database, Microsoft automatically manages database protection:

| Backup Type | Frequency | Retention Window | Storage Tier |
| :--- | :--- | :---: | :--- |
| **Full Backups** | Every 7 days | 7 to 35 days (Configurable) | Azure Read-Access Geo-Redundant Storage (RA-GRS) |
| **Differential Backups**| Every 12 to 24 hours | 7 to 35 days | RA-GRS |
| **Transaction Log Backups**| Every 5 to 10 minutes | 7 to 35 days | RA-GRS |

### Point-in-Time Restore (PITR) Capability
If corrupt data or accidental deletion occurs in production, Azure SQL Database allows restoring the database to **any second within the retention window** (e.g., restoring to 5 minutes prior to an incident).

---

## 5. Rollback Runbook

If any operational issue arises during or after cloud migration:
1. **Local System Remains Operational:** The local backend pointing to `127.0.0.1:1433` remains completely untouched and immediately runnable.
2. **Cloud Teardown:** The cloud database instance can be paused or dropped in Azure Portal without any risk to local developer assets.
3. **Frontend Fallback:** The Vercel deployment can be pointed back to an authorized staging proxy or kept on maintenance mode until resolution.
