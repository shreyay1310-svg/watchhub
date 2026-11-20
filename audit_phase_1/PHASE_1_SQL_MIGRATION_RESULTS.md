# WatchHub — Phase 1 Microsoft SQL Server Setup & Migration Assessment Report

## 1. Executive Summary & Mandatory Decision
The WatchHub enterprise luxury platform target database is **Microsoft SQL Server (MSSQL)** using **Prisma ORM**. MongoDB Atlas and Mongoose will NOT be used for production persistence.

---

## 2. Infrastructure & Connectivity Audit

### Local Machine Port 1433 Inspection
* **Command Executed**: `powershell -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port 1433"`
* **Raw Output**:
  ```text
  ComputerName     : 127.0.0.1
  RemoteAddress    : 127.0.0.1
  RemotePort       : 1433
  TcpTestSucceeded : False
  ```
* **Status**: **BLOCKED — SQL Server Service Unavailable Locally**
* **Finding**: `sqlcmd.exe (v15.0.2000.5)` is installed on the host machine, but no local SQL Server service (`MSSQLSERVER` or `SQLEXPRESS`) is actively listening on standard port 1433. Docker daemon is not running on the machine.

---

## 3. Relational Schema Architecture (22 Models Implemented)

The complete enterprise relational schema has been authored and saved to `server/prisma/schema.prisma` with `provider = "sqlserver"`.

### Relational Table Inventory & Constraints:
1. **Roles**: `RoleId` INT IDENTITY PRIMARY KEY, `RoleName` NVARCHAR(50) UNIQUE.
2. **Permissions**: `PermissionId` INT IDENTITY PRIMARY KEY, `PermissionCode` NVARCHAR(100) UNIQUE.
3. **RolePermissions**: Composite PK (`RoleId`, `PermissionId`), Foreign Keys with ON DELETE CASCADE.
4. **Users**: `UserId` UUID PK, `Email` NVARCHAR(255) UNIQUE, `Phone` UNIQUE, `PasswordHash` (Bcrypt), IX_Users_Email.
5. **UserRoles**: Composite PK (`UserId`, `RoleId`), Foreign Keys with ON DELETE CASCADE.
6. **Addresses**: `AddressId` UUID PK, `UserId` FK to Users, Geo coordinates (Latitude, Longitude), IX_Addresses_UserId.
7. **OTPVerifications**: `OtpId` UUID PK, `Identifier`, `OtpHash` (HMAC-SHA256), Channel, Purpose, IX_OTP_Identifier_Purpose.
8. **Brands**: `BrandId` INT IDENTITY PK, `Slug` UNIQUE, `Name` UNIQUE, `IsLuxuryTier` BIT.
9. **Categories**: `CategoryId` INT IDENTITY PK, `CategorySlug` UNIQUE, self-referencing `ParentCategoryId` FK.
10. **Products**: `ProductId` UUID PK, `Sku` UNIQUE, `BrandId` FK, `CategoryId` FK, Decimal price fields, Check constraints.
11. **ProductImages**: `ImageId` INT IDENTITY PK, `ProductId` FK ON DELETE CASCADE, `ImageUrl`, `IsPrimary`.
12. **Warehouses**: `WarehouseId` INT IDENTITY PK, `WarehouseCode` UNIQUE, `ManagerId` FK to Users.
13. **Inventory**: `InventoryId` UUID PK, `ProductId` FK, `WarehouseId` FK, UQ_Product_Warehouse UNIQUE.
14. **StockTransactions**: `TransactionId` UUID PK, `ProductId` FK, `WarehouseId` FK, `PerformedByUserId` FK, QuantityChange ledger.
15. **Coupons**: `CouponId` INT IDENTITY PK, `Code` UNIQUE, Discount percentage, usage limits and date windows.
16. **Orders**: `OrderId` UUID PK, `OrderNumber` UNIQUE, `CustomerId` FK, `ShippingAddressId` FK, TotalAmount Decimal.
17. **OrderItems**: `OrderItemId` UUID PK, `OrderId` FK ON DELETE CASCADE, `ProductId` FK, UnitPrice, Quantity.
18. **Payments**: `PaymentId` UUID PK, `OrderId` FK, `RazorpayOrderId` UNIQUE, `RazorpayPaymentId` UNIQUE, `RazorpaySignature`.
19. **Deliveries**: `DeliveryId` UUID PK, `OrderId` FK, `TrackingNumber` UNIQUE, `AssignedRiderId` FK, `DeliveryHandoverOtp`.
20. **DeliveryLocationPings**: `PingId` BIGINT IDENTITY PK, `DeliveryId` FK ON DELETE CASCADE, `RiderId` FK, Geo coordinates, Speed, Heading.
21. **SupportTickets**: `TicketId` UUID PK, `TicketNumber` UNIQUE, `CustomerId` FK, `AssignedAgentId` FK, Priority, Status.
22. **SupportMessages**: `MessageId` UUID PK, `TicketId` FK ON DELETE CASCADE, `SenderUserId` FK, `MessageText`.
23. **AuditLogs**: `AuditId` BIGINT IDENTITY PK, `PerformedByUserId` FK, `Action`, `ModuleName`, JSON metadata.

---

## 4. Exact Prerequisites for Database Migration Execution
To execute `npx prisma db push` or `npx prisma migrate dev`, the user must provide one of the following:

### Option A: Azure SQL Database (Recommended for Cloud Development)
1. Create a free/serverless Azure SQL Database on Azure Portal.
2. In `server/.env`, set:
   ```env
   DATABASE_URL="sqlserver://watchhub-server.database.windows.net:1433;database=watchhub_db;user=watchhub_admin;password=YourPassword123!;encrypt=true;trustServerCertificate=false;"
   ```

### Option B: Local SQL Server Express
1. Start the SQL Server service via Windows Services (`SQL Server (SQLEXPRESS)`).
2. Enable TCP/IP in SQL Server Configuration Manager under Network Configuration.
3. In `server/.env`, set:
   ```env
   DATABASE_URL="sqlserver://localhost:1433;database=watchhub_dev;user=sa;password=YourPassword123!;trustServerCertificate=true;"
   ```

---

## 5. Migration Conclusion
* **Relational Schema Status**: **100% DESIGNED & ARCHITECTED (`server/prisma/schema.prisma`)**
* **Live Database Migration**: **BLOCKED** on SQL Server connection credentials.
* Per strict execution rule: **No database migration was fabricated or claimed complete without an active database connection.**
