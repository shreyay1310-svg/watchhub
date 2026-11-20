# WatchHub — Database Integrity & Schema Audit Report

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/DATABASE_INTEGRITY_REPORT.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Database Administrator & SQL Server Specialist  
**Database:** Microsoft SQL Server 2025 (`WatchHubDB` on `127.0.0.1:1433`)  

---

## 1. Relational Schema & Partition Statistics

A complete scan of `sys.partitions` and `sys.indexes` yielded the exact live baseline:

```sql
SELECT t.TABLE_NAME, CAST(COALESCE(p.[rows], 0) AS INT) AS [rowCount]
FROM INFORMATION_SCHEMA.TABLES t
LEFT JOIN (
  SELECT OBJECT_NAME(object_id) AS tblName, SUM(rows) AS [rows]
  FROM sys.partitions
  WHERE index_id IN (0, 1)
  GROUP BY object_id
) p ON t.TABLE_NAME = p.tblName
WHERE t.TABLE_TYPE = 'BASE TABLE'
ORDER BY t.TABLE_NAME;
```

### Table Record Inventory:
1. `_prisma_migrations`: 1
2. `Addresses`: 3
3. `AuditLogs`: 0
4. `Brands`: 28
5. `Categories`: 8
6. `Coupons`: 3
7. `Deliveries`: 3
8. `DeliveryLocationPings`: 3
9. `Inventory`: 36
10. `OrderItems`: 3
11. `Orders`: 6
12. `OTPVerifications`: 7
13. `Payments`: 3
14. `Permissions`: 21
15. `ProductImages`: 33
16. `Products`: 33
17. `RolePermissions`: 22
18. `Roles`: 7
19. `StockTransactions`: 5
20. `SupportMessages`: 14
21. `SupportTickets`: 6
22. `UserRoles`: 9
23. `Users`: 9
24. `Warehouses`: 3

---

## 2. Integrity Validation Results

| Integrity Test | Target Table(s) | Verification Query / Logic | Finding | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Email Uniqueness** | `Users` | `SELECT email, count(*) FROM Users GROUP BY email HAVING count(*) > 1` | 0 duplicate emails found. | **PASS** |
| **Orphaned User Roles** | `UserRoles` $\rightarrow$ `Users` | Left join matching `UserId` | Zero orphaned relations. | **PASS** |
| **Orphaned Order Items** | `OrderItems` $\rightarrow$ `Orders` | Left join matching `OrderId` | All line items match valid orders. | **PASS** |
| **Product Stock Integrity**| `Products` $\leftrightarrow$ `Inventory` | Foreign key matching `ProductId` | Stock tracked across 3 warehouses. | **PASS** |
| **OTP Compound Selector**| `OTPVerifications` | Index: `UQ_OTPVerifications_Identifier_Purpose` | Enforces 1 active code per user/purpose. | **PASS** |
| **Deadlock Resilience** | `OTPVerifications` | Background worker deadlock 1205 retry logic | Tested in TC_V3_011 with bounded backoff. | **PASS** |

---

## 3. Preservation of Historical Data

* **Zero Deletions:** No baseline user accounts, orders, inventory stock, or watch specifications were truncated or dropped.
* **Disposable Test Data Handling:** In all automated test suites (`test_master_local_suite.mjs`, `test_v3_otp_suite.mjs`), test records use distinct prefixes (`collector_test_*`, `tc_v3_*`) and are cleaned up at test completion using explicit `WHERE email IN (...)` filters, ensuring baseline data remains 100% pristine.
