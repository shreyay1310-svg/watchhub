# WatchHub — Phase 1 MongoDB to Microsoft SQL Server Data Mapping

## 1. Entity and Collection-to-Table Mapping

| MongoDB Source Entity / Collection | Proposed SQL Server Target Table(s) | Structural Transformation Strategy |
|---|---|---|
| `users` collection | `Users`<br>`Addresses`<br>`UserRoles` | **Normalized**: User identity stored in `Users`. Embedded `addresses: [...]` array extracted into relational `Addresses` table with foreign key `UserId`. Single role string mapped into `Roles` + `UserRoles` join table. |
| `products` collection | `Products`<br>`ProductImages`<br>`Brands`<br>`Categories` | **Normalized**: Embedded `images: [...]` array extracted into `ProductImages`. Brand and category strings converted to foreign keys referencing `Brands` and `Categories`. Specifications mapped to structured columns. |
| `orders` collection | `Orders`<br>`OrderItems` | **Normalized**: Embedded `items: [...]` array split into master `Orders` and detail `OrderItems` records with referential foreign keys and cascading delete rules. |
| `payments` collection | `Payments` | **1:1 Mapping**: Relational foreign key `OrderId` references `Orders(OrderId)`. Amount stored as high-precision `DECIMAL(12,2)`. |
| `otpverifications` collection | `OTPVerifications` | **Temporal Mapping**: TTL auto-cleanup replaced with explicit index on `(Identifier, Purpose, ExpiresAt)` and query-level expiry checks. |
| `locationhistories` collection | `DeliveryLocationPings` | **Relational Geospatial**: Links directly to `Deliveries(DeliveryId)` with `BIGINT IDENTITY` sequential clustering. |
| `auditlogs` collection | `AuditLogs` | **Structured Auditing**: User metadata mapped to `PerformedByUserId` with details serialized to `NVARCHAR(MAX)` JSON. |
| In-Memory Inventory State | `Warehouses`<br>`Inventory`<br>`StockTransactions` | **Persistence Realization**: Replaces volatile Node process arrays with double-entry stock transaction ledger. |
| In-Memory Delivery State | `Deliveries`<br>`DeliveryAssignments` | **Persistence Realization**: Formalizes rider assignments and delivery status progression. |
| In-Memory Support State | `SupportTickets`<br>`SupportMessages` | **Persistence Realization**: Persists tickets, live chat threads, and agent responses. |

---

## 2. Data Type Conversion Matrix

| MongoDB BSON Type | Microsoft SQL Server (T-SQL) Type | Conversion Rules & Notes |
|---|---|---|
| `ObjectId` (`_id`) | `UNIQUEIDENTIFIER` | Stored as standard GUID (`NEWID()`). Converts hex string `507f191e810c19729de860ea` to deterministic UUID if migrating existing data. |
| `String` (short) | `NVARCHAR(50)` – `NVARCHAR(255)` | Supports Unicode characters (Indian names, Swiss accents, brand symbols). |
| `String` (long / text) | `NVARCHAR(MAX)` | Product long descriptions, HTML articles, JSON logs. |
| `Number` (Monetary / Price) | `DECIMAL(12, 2)` | Eliminates floating-point rounding errors on currency calculations. |
| `Number` (Integer / Qty) | `INT` / `BIGINT` | Stock quantities, order counts, auto-increment primary keys. |
| `Boolean` | `BIT` | Stored as `0` or `1`. |
| `Date` (ISO timestamp) | `DATETIME2(7)` | Microsecond precision UTC timestamps (`SYSUTCDATETIME()`). |
| `Array of Strings` | Separate Child Table (e.g. `ProductImages`) | 1st Normal Form compliance. |
| `Subdocument Object` | Foreign Key Relation (e.g. `Addresses`) | Normalized with foreign key constraints. |

---

## 3. Index & Constraint Conversion Matrix

| MongoDB Indexing Pattern | SQL Server Equivalent | Purpose & Performance Impact |
|---|---|---|
| `{ email: 1 }, { unique: true }` | `CREATE UNIQUE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);` | Ensures single account per email address. |
| `{ sku: 1 }, { unique: true }` | `CREATE UNIQUE NONCLUSTERED INDEX IX_Products_Sku ON Products(Sku);` | Enforces global uniqueness across watch models. |
| `{ expiresAt: 1 }, { expireAfterSeconds: 300 }` | Filtered index: `CREATE NONCLUSTERED INDEX IX_OTP ON OTPVerifications(Identifier, ExpiresAt);` + scheduled cleanup job | Replaces MongoDB background TTL thread with high-performance index and query filter. |
| Compound index on `{ orderId: 1, timestamp: -1 }` | `CREATE NONCLUSTERED INDEX IX_Pings ON DeliveryLocationPings(DeliveryId, PingTimestamp DESC);` | Fast live tracking queries for Socket.IO clients. |
