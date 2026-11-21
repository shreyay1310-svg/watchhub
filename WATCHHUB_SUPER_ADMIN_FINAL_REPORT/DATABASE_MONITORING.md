# 11. DATABASE MONITORING

## SQL Server 2025 Diagnostics
- **Engine**: Microsoft SQL Server 2025 Enterprise Edition
- **Host**: 127.0.0.1:1433
- **Database**: WatchHubDB
- **Table Record Inventory**:
  - `Users`: 18 records (Healthy)
  - `Roles`: 7 canonical roles (Healthy)
  - `Products`: 47 products (Healthy)
  - `Orders`: Verified active order pipeline (Healthy)
  - `Categories`: 12 luxury watch categories (Healthy)
  - `Brands`: 10 luxury Swiss & global watchmakers (Healthy)
  - `Warehouses`: 3 vault and fulfillment hubs (Healthy)
  - `SupportTickets`: Operational (Healthy)
  - `AuditLogs`: Actively recording (Healthy)
- **Safety Policy**: No DROP, TRUNCATE, or arbitrary raw SQL execution permitted from UI.
