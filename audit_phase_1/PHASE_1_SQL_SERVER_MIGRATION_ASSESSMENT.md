# WatchHub — Phase 1 Microsoft SQL Server Migration Assessment

## 1. Mongoose Schema & Query Audit

### Existing Schemas (`server/src/models/`):
1. **`User.js`**:
   - *Current Queries*: `User.findOne({ email })`, `User.findById(id)`, `new User(...).save()`.
   - *Issues*: Embedded addresses array (`addresses: [...]`), single enum string for roles, plaintext avatar default.
2. **`Product.js`**:
   - *Current Queries*: `Product.find(filter).sort(...).skip(...).limit(...)`, `Product.findById(id)`, `Product.findByIdAndUpdate(id, ...)`.
   - *Issues*: Unnormalized `variants` array and nested `specifications` map.
3. **`Order.js`**:
   - *Current Queries*: `Order.findOne({ orderId })`, `Order.find({ customer })`, `Order.findOneAndUpdate(...)`.
   - *Issues*: Embedded line items (`items: [...]`) prevent SQL index utilization for individual product sales reporting.
4. **`Payment.js`**:
   - *Current Queries*: `Payment.findOne({ razorpayOrderId })`, `Payment.findOneAndUpdate(...)`.
5. **`OtpVerification.js`**:
   - *Current Queries*: `OtpVerification.findOne({ identifier, purpose })`, `OtpVerification.findOneAndUpdate(...)`.
6. **`LocationHistory.js`**:
   - *Current Queries*: `LocationHistory.find({ orderId }).sort({ timestamp: 1 })`.
7. **`AuditLog.js`**:
   - *Current Queries*: `AuditLog.create(...)`.

---

## 2. Normalized Relational Schema & Foreign Keys

### Table Relationship Topology:
```
[Roles] 1---N [UserRoles] N---1 [Users]
                                  |
            +---------------------+---------------------+
            | 1:N                 | 1:N                 | 1:N
        [Addresses]            [Orders]           [SupportTickets]
                                  | 1:N                 | 1:N
                             [OrderItems]        [SupportMessages]
                                  | N:1
                             [Products] N---1 [Brands]
                                  |     N---1 [Categories]
            +---------------------+
            | 1:N                 | 1:N
     [ProductImages]         [Inventory] N---1 [Warehouses]
                                  | 1:N
                        [StockTransactions]
```

### Relational Foreign Key Integrity Matrix:
1. `FK_UserRoles_Users`: `UserRoles.UserId` ➔ `Users.UserId` (`ON DELETE CASCADE`)
2. `FK_UserRoles_Roles`: `UserRoles.RoleId` ➔ `Roles.RoleId` (`ON DELETE CASCADE`)
3. `FK_Addresses_Users`: `Addresses.UserId` ➔ `Users.UserId` (`ON DELETE CASCADE`)
4. `FK_Products_Brands`: `Products.BrandId` ➔ `Brands.BrandId` (`ON DELETE RESTRICT`)
5. `FK_Products_Categories`: `Products.CategoryId` ➔ `Categories.CategoryId` (`ON DELETE RESTRICT`)
6. `FK_ProductImages_Products`: `ProductImages.ProductId` ➔ `Products.ProductId` (`ON DELETE CASCADE`)
7. `FK_Inventory_Products`: `Inventory.ProductId` ➔ `Products.ProductId` (`ON DELETE RESTRICT`)
8. `FK_Inventory_Warehouses`: `Inventory.WarehouseId` ➔ `Warehouses.WarehouseId` (`ON DELETE RESTRICT`)
9. `FK_StockTransactions_Products`: `StockTransactions.ProductId` ➔ `Products.ProductId`
10. `FK_Orders_Users`: `Orders.CustomerId` ➔ `Users.UserId` (`ON DELETE RESTRICT`)
11. `FK_Orders_Addresses`: `Orders.ShippingAddressId` ➔ `Addresses.AddressId` (`ON DELETE RESTRICT`)
12. `FK_OrderItems_Orders`: `OrderItems.OrderId` ➔ `Orders.OrderId` (`ON DELETE CASCADE`)
13. `FK_OrderItems_Products`: `OrderItems.ProductId` ➔ `Products.ProductId` (`ON DELETE RESTRICT`)
14. `FK_Payments_Orders`: `Payments.OrderId` ➔ `Orders.OrderId` (`ON DELETE RESTRICT`)
15. `FK_Deliveries_Orders`: `Deliveries.OrderId` ➔ `Orders.OrderId` (`ON DELETE RESTRICT`)
16. `FK_DeliveryLocationPings_Deliveries`: `DeliveryLocationPings.DeliveryId` ➔ `Deliveries.DeliveryId` (`ON DELETE CASCADE`)
17. `FK_SupportTickets_Users`: `SupportTickets.CustomerId` ➔ `Users.UserId`
18. `FK_SupportMessages_Tickets`: `SupportMessages.TicketId` ➔ `SupportTickets.TicketId` (`ON DELETE CASCADE`)

---

## 3. Node.js SQL Server Driver & ORM Recommendation

### Final Recommendation: **Prisma ORM (`@prisma/client` + `prisma`)**
- **Justification**:
  1. **Strict Type Safety**: Generates TypeScript/JavaScript types directly from `schema.prisma`.
  2. **Automated Migration Pipeline**: `prisma migrate dev` automatically creates version-controlled `.sql` migration files matching enterprise DDL standards.
  3. **High Performance Connection Pooling**: Built-in connection pooler using Microsoft SQL Server native TDS protocol.
  4. **Declarative Relations**: Nested queries (e.g. Fetch Order with Customer, Address, OrderItems, and Product details in a single query) avoid N+1 query bottlenecks.
  5. **Transaction Integrity**: Native `prisma.$transaction([ ... ])` allows seamless atomic checkout operations.

---

## 4. API Endpoints Requiring Database Changes

Every API controller currently referencing Mongoose models or in-memory arrays must be refactored in Phase 2:

| Route File | Affected Endpoints | Required Refactoring |
|---|---|---|
| `server/src/controllers/authController.js` | `POST /api/auth/register`<br>`POST /api/auth/login`<br>`GET /api/auth/me` | Replace `User.findOne` with `prisma.user.findUnique`. Remove in-memory user synthesis backdoor. Query `userRoles` relation. |
| `server/src/routes/authRoutes.js` | `POST /api/auth/send-email-otp`<br>`POST /api/auth/verify-email-otp` | Replace `OtpVerification.findOne` with `prisma.oTPVerification.findFirst`. |
| `server/src/controllers/productController.js` | `GET /api/products`<br>`GET /api/products/:id`<br>`POST /api/products`<br>`PUT /api/products/:id`<br>`DELETE /api/products/:id` | Replace `Product.find` with `prisma.product.findMany` with pagination and relation joins to `Brands`, `Categories`, and `ProductImages`. |
| `server/src/routes/paymentRoutes.js` | `POST /api/payments/create-order`<br>`POST /api/payments/verify`<br>`POST /api/payments/webhook` | Replace `Order.create` and `Payment.create` with `prisma.$transaction`. Enforce HMAC signature check. |
| `server/src/routes/inventoryRoutes.js` | All 7 routes (`/`, `/movements`, `/warehouses`, `/add-stock`, `/adjust-stock`, `/transfer`, `/reorder`) | Discard `INVENTORY_DATABASE` in-memory array. Query `prisma.inventory`, `prisma.warehouse`, and `prisma.stockTransaction`. |
| `server/src/routes/deliveryRoutes.js` | All 8 routes (`/`, `/create-shipment`, `/assign`, `/update-status`, `/partner`, `/attempt-failure`, `/return-pickup`, `/reports`) | Discard `DELIVERY_PARTNERS` and `SHIPMENTS` arrays. Query `prisma.delivery` and `prisma.deliveryLocationPing`. |
| `server/src/routes/supportRoutes.js` | All 7 routes (`/`, `/ticket`, `/ticket/reply`, `/ticket/update-status`, `/chat/send`, `/refund`, `/reports`) | Discard `SUPPORT_STATS` and `TICKETS` arrays. Query `prisma.supportTicket` and `prisma.supportMessage`. |
| `server/src/routes/trackingRoutes.js` | `GET /api/tracking/order/:id` | Replace `MOCK_TRACKING_ORDERS` array with live queries to `Orders` and `Deliveries`. |

---

## 5. Migration Complexity, Risks & Rollback Plan

### Complexity Assessment: **Medium-High**
- **Effort Breakdown**:
  - Schema definition & migration script creation: 10%
  - Controller refactor (8 controller/route files): 50%
  - Data seeding & catalog population: 20%
  - Integration testing & transaction validation: 20%

### Technical Risks & Mitigations:
1. **Risk: Connection Timeout on Windows localhost**:
   - *Mitigation*: Ensure SQL Server TCP/IP is enabled on port 1433 in SQL Server Configuration Manager with Firewall rule for TCP 1433.
2. **Risk: Data Type Incompatibilities on Large Monetary Values**:
   - *Mitigation*: Explicitly define all prices as `DECIMAL(12, 2)` instead of `FLOAT` or `REAL` to prevent floating-point discrepancies on luxury timepieces.
3. **Risk: Breaking In-Memory Development Workflow**:
   - *Mitigation*: Develop against a dedicated feature branch (`feature/mssql-migration`) and run end-to-end integration tests prior to merging into `main`.

### Rollback Plan:
- Git branch isolation ensures that the current codebase remains 100% intact until the SQL Server pipeline is verified.
- Database rollback is handled natively via `prisma migrate resolve --rolled-back <migration_name>` or restoring a snapshot `.bak` file.
