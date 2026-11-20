# WatchHub — Phase 3: Database & SQL Server Repair Report

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/PHASE_3_DATABASE_REPAIR_REPORT.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Database Administrator & SQL Server Specialist  
**Database:** Microsoft SQL Server 2025 Standard Developer Edition (`WatchHubDB`)  
**Host / Port:** `127.0.0.1:1433`  

---

## 1. Database Health & Connection Audit

A non-destructive diagnostic query verified the Microsoft SQL Server instance:

```text
Server Version: Microsoft SQL Server 2025 (RTM) - 17.0.1000.7 (X64)
Server Machine: Shreya (Windows 10 Home, Build 26300, 64-bit Hypervisor)
Active Database: WatchHubDB
Collation: SQL_Latin1_General_CP1_CI_AS
```

---

## 2. Table Catalog & Record Counts Audit

All 24 base tables were audited from `sys.partitions` and `INFORMATION_SCHEMA`:

| Table Name | Active Rows | Key Type | Nullability & Constraints | Status |
| :--- | :---: | :--- | :--- | :---: |
| `_prisma_migrations` | 1 | Clustered PK (`id`) | Migration state recorded | **HEALTHY** |
| `Addresses` | 3 | Clustered PK (`AddressId`) | Foreign key to `Users.UserId` | **HEALTHY** |
| `AuditLogs` | 0 | Clustered PK (`LogId`) | Optional audit trail | **HEALTHY** |
| `Brands` | 28 | Clustered PK (`BrandId`) | Luxury brand taxonomies | **HEALTHY** |
| `Categories` | 8 | Clustered PK (`CategoryId`) | Watch categories | **HEALTHY** |
| `Coupons` | 3 | Clustered PK (`CouponId`) | Promotional discount vouchers | **HEALTHY** |
| `Deliveries` | 3 | Clustered PK (`DeliveryId`) | Rider dispatch logs | **HEALTHY** |
| `DeliveryLocationPings` | 3 | Clustered PK (`PingId`) | Courier GPS telemetry | **HEALTHY** |
| `Inventory` | 36 | Clustered PK (`InventoryId`) | Warehouse stock levels | **HEALTHY** |
| `OrderItems` | 3 | Clustered PK (`OrderItemId`) | Line items linked to orders | **HEALTHY** |
| `Orders` | 6 | Clustered PK (`OrderId`) | Customer purchase records | **HEALTHY** |
| `OTPVerifications` | 7 | Clustered PK (`Id`) | V3 compound unique & indexes | **HEALTHY** |
| `Payments` | 3 | Clustered PK (`PaymentId`) | Razorpay order references | **HEALTHY** |
| `Permissions` | 21 | Clustered PK (`PermissionId`) | System capabilities | **HEALTHY** |
| `ProductImages` | 33 | Clustered PK (`ImageId`) | Timepiece imagery URLs | **HEALTHY** |
| `Products` | 33 | Clustered PK (`ProductId`) | Timepiece catalog & specs | **HEALTHY** |
| `RolePermissions` | 22 | Compound PK `[RoleId, PermissionId]` | Permission matrix | **HEALTHY** |
| `Roles` | 7 | Clustered PK (`RoleId`) | System security roles | **HEALTHY** |
| `StockTransactions` | 5 | Clustered PK (`TransactionId`) | Ledger entries | **HEALTHY** |
| `SupportMessages` | 14 | Clustered PK (`MessageId`) | Customer support messages | **HEALTHY** |
| `SupportTickets` | 6 | Clustered PK (`TicketId`) | Customer tickets | **HEALTHY** |
| `UserRoles` | 9 | Compound PK `[UserId, RoleId]` | User-to-role mappings | **HEALTHY** |
| `Users` | 9 | Clustered PK (`UserId`) | 9 Admin & Customer accounts | **HEALTHY** |
| `Warehouses` | 3 | Clustered PK (`WarehouseId`) | Physical fulfillment hubs | **HEALTHY** |

---

## 3. Data Integrity & Referential Integrity Checks

1. **Zero Duplicate User Emails:**
   - Query: `SELECT email, COUNT(*) FROM Users GROUP BY email HAVING COUNT(*) > 1;`
   - Result: 0 duplicate rows.
2. **Zero Orphaned UserRoles:**
   - Query: `SELECT ur.* FROM UserRoles ur LEFT JOIN Users u ON ur.UserId = u.UserId WHERE u.UserId IS NULL;`
   - Result: 0 orphaned rows.
3. **Compound Unique Selector on OTPs:**
   - Constraint: `UQ_OTPVerifications_Identifier_Purpose` on `[Identifier, Purpose]`.
   - Verified: Prevents duplicate in-flight registrations for the same user identifier.
4. **V3 Performance Indexes:**
   - `IX_OTP_ExpiresAt` on `[ExpiresAt]` allows batch purges without scanning active records.
   - `IX_OTP_DispatchLockedUntil` on `[DispatchLockedUntil]` allows rapid lease takeover on crashed processes.

---

## 4. Database CRUD & Rollback Verification

In `test_master_local_suite.mjs`:
- Real user registered with bcrypt hash and default Customer role.
- Duplicate email insert rejected with HTTP 400.
- Test records cleanly removed after test execution without affecting the 9 baseline user accounts or 33 catalog products.
- Zero destructive SQL (`DROP`, `TRUNCATE`, `migrate reset`) was executed.
