# WATCHHUB ATELIER — DATABASE INTEGRITY REPORT

This report certifies the state, record counts, and relational integrity of the local Microsoft SQL Server 2025 instance.

---

### 1. Database Environment Specification

- **Host**: `127.0.0.1:1433`
- **Database Name**: `WatchHubDB`
- **RDBMS Engine**: Microsoft SQL Server 2025
- **ORM / Provider**: Prisma 6.19.3 (`provider = "sqlserver"`)
- **Connection Mode**: Windows Integrated Security (`integratedSecurity=true;trustServerCertificate=true`)
- **Isolation Level**: READ COMMITTED / SNAPSHOT
- **Integrity Rule**: Zero DROP, zero TRUNCATE, zero schema reset.

---

### 2. Live Relational Table Inventory & Record Counts

A live system query executed directly against `INFORMATION_SCHEMA.TABLES` verified all 24 relational tables:

| # | Table Name | Verified Record Count | Relational Purpose & Integrity Constraints |
| :--- | :--- | :--- | :--- |
| **01** | `_prisma_migrations` | 1 | Schema migration ledger. |
| **02** | `Roles` | 7 | System role taxonomy (Super Admin, Store Admin, etc.). |
| **03** | `Permissions` | 21 | Granular security permissions. |
| **04** | `RolePermissions` | 22 | Many-to-many role permission mappings with cascading FKs. |
| **05** | `Users` | 9 | Collector & staff credentials with bcrypt password hashes. |
| **06** | `UserRoles` | 9 | Active user role assignments. |
| **07** | `Addresses` | 3 | Collector shipping addresses with GPS geocodes. |
| **08** | `Categories` | 8 | Chronograph, Tourbillon, Automatic, etc. |
| **09** | `Brands` | 28 | Horology maisons (Patek, Rolex, Audemars Piguet, Omega). |
| **10** | `Products` | 33 | Active luxury timepieces with mechanical specs. |
| **11** | `ProductImages` | 33 | Uncropped horology photography assets. |
| **12** | `Warehouses` | 3 | Regional vaults (Mumbai Central, Delhi NCR, Bangalore). |
| **13** | `Inventory` | 36 | Stock ledger per SKU and warehouse location. |
| **14** | `StockTransactions` | 5 | Inbound restocks and adjustments ledger. |
| **15** | `Orders` | 6 | Customer purchase orders with status lifecycle. |
| **16** | `OrderItems` | 3 | Line-item pricing, quantities, and discounts. |
| **17** | `Payments` | 3 | Razorpay transaction records and payment status. |
| **18** | `Deliveries` | 3 | Armoured & express courier consignments. |
| **19** | `DeliveryLocationPings` | 3 | Live GPS telemetry pings for transit tracking. |
| **20** | `SupportTickets` | 6 | Customer inquiry and dispute tickets. |
| **21** | `SupportMessages` | 14 | Bi-directional communication transcripts. |
| **22** | `Coupons` | 3 | Promotional discount codes (`WATCHLUX40`, etc.). |
| **23** | `OTPVerifications` | 0 | Ephemeral OTP storage (expired codes auto-purged). |
| **24** | `AuditLogs` | 0 | Security event audit trails. |

**Total Monitored Records**: **259 Records**  
**Data Loss / Leakage**: **0 Records (100% Data Preservation Verified)**  
**Evidence Proof**: [sql_server_table_verification.txt](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/10_DATABASE_VERIFICATION/sql_server_table_verification.txt)

---

### 3. Cryptographic Storage & Purge Engine

1. **Password Protection**: Passwords stored as one-way salted hashes using `bcrypt` (10 rounds). Plaintext passwords are never logged or stored.
2. **OTP V3 Cryptographic Engine**: OTPs are hashed using HMAC-SHA256 with `OTP_HASH_SECRET`.
3. **Automated Cleanup Worker**: The background OTP cleanup worker (`otpCleanupWorker.js`) runs periodically and purges expired records in batches:
   ```
   [OTP Cleanup Worker] Purged 8 expired records across 1 batch(es) in 95ms.
   ```
