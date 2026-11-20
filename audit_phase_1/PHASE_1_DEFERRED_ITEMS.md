# WATCHHUB — PHASE 1 FORMALLY DEFERRED ITEMS REGISTER

## 1. Boundary & Governance

In accordance with user instructions, Phase 1 focuses exclusively on security remediation, authentication and authorization lockdown, 800-line modularity enforcement, Git repository sanitation, and Microsoft SQL Server / Prisma schema preparation.

The following **5 persistence items** are formally classified as **DEFERRED TO PHASE 2 (DATABASE MIGRATION & PERSISTENCE)**. Their deferral is intentional and mandatory to avoid executing premature database migrations (`prisma db push`, `CREATE DATABASE WatchHubDB`, or replacing Mongoose models) before Phase 1 is officially closed.

---

## 2. Register of Deferred Persistence Items

### Finding HD-007: Dashboard KPI and Revenue Dynamic Aggregations
- **Module**: `server/src/controllers/dashboardController.js`
- **Phase 1 Implementation**:
  - Protected with strict JWT and role-based access control (`authenticate`, `authorizeRoles`).
  - Utilizes MongoDB/Mongoose aggregation pipelines (`Order.aggregate()`, `User.countDocuments()`, `Product.countDocuments()`) with error fallback to preserve server uptime during test cycles.
- **Reason for Deferral to Phase 2**:
  - Target persistence layer is Microsoft SQL Server with Prisma ORM.
  - Converting Mongoose aggregations to Prisma raw SQL queries (`$queryRaw`) or relational group-by aggregates requires an active, migrated MSSQL `WatchHubDB` instance.
- **Phase 2 Plan**:
  - Implement Prisma aggregations (`prisma.order.aggregate()`, `prisma.order.groupBy()`, `prisma.user.count()`) connected to `WatchHubDB`.

---

### Finding HD-008: Inventory & Warehouse Stock Persistence
- **Module**: `server/src/controllers/inventoryController.js` & `server/src/services/inventoryData.js`
- **Phase 1 Implementation**:
  - Protected with role-based authorization for Inventory Manager role.
  - Serves inventory items, warehouse listings, and stock movements via robust in-memory mock services.
- **Reason for Deferral to Phase 2**:
  - Relational tables (`Inventory`, `Warehouse`, `StockTransaction`) are defined in `server/prisma/schema.prisma` but cannot be written to until Phase 2 database push.
- **Phase 2 Plan**:
  - Implement `prisma.inventory.findMany()`, `prisma.stockTransaction.create()`, and link to warehouse models in `WatchHubDB`.

---

### Finding HD-009: Logistics, Shipment & Courier Delivery Persistence
- **Module**: `server/src/controllers/deliveryController.js` & `server/src/services/deliveryData.js`
- **Phase 1 Implementation**:
  - Protected with role-based authorization for Delivery Manager and Delivery Partner roles.
  - Implements cryptographic OTP verification endpoint (`POST /api/delivery/verify-otp`) to authorize parcel handover.
  - Stores shipment manifests, rider locations, and delivery attempts in memory.
- **Reason for Deferral to Phase 2**:
  - Relational tables (`Delivery`, `DeliveryLocationPing`, `DeliveryAttempt`) are defined in `server/prisma/schema.prisma` awaiting Phase 2 migration.
- **Phase 2 Plan**:
  - Connect delivery endpoints to `prisma.delivery` and `prisma.deliveryLocationPing` tables in `WatchHubDB`.

---

### Finding HD-010: Customer Support Tickets & Conversation Audit Persistence
- **Module**: `server/src/controllers/supportController.js` & `server/src/services/supportData.js`
- **Phase 1 Implementation**:
  - Protected with role-based authorization for Customer Support Executive role.
  - Returns support tickets, priority distributions, and conversational messages via in-memory data structures.
- **Reason for Deferral to Phase 2**:
  - Relational tables (`SupportTicket`, `SupportMessage`) are defined in `server/prisma/schema.prisma` awaiting Phase 2 migration.
- **Phase 2 Plan**:
  - Implement Prisma service layer for tickets and audit logs.

---

### Finding HD-012: Dynamic Voucher & Promotional Coupon Persistence
- **Module**: `server/src/routes/paymentRoutes.js`
- **Phase 1 Implementation**:
  - Dynamic rule-based validation engine in `POST /api/payments/validate-coupon` and `POST /api/payments/create-order`.
  - Supports configurable promo codes (`WATCHHUB10`, `HOROLOGYVIP`, `FIRSTLUXURY`) with percentage discounts, maximum caps, and minimum order thresholds.
  - Rejects invalid or expired promo codes with `400 Bad Request`.
  - Coupon persistence is currently rule-based in memory rather than a database table.
- **Reason for Deferral to Phase 2**:
  - Relational tables (`Coupon`, `CouponUsage`) are defined in `server/prisma/schema.prisma`.
  - Storing coupons in MSSQL requires the migrated database table.
- **Phase 2 Plan**:
  - Implement `prisma.coupon.findUnique()` and record redemptions in `prisma.couponUsage`.

---

## 3. Impact Assessment & Risk Mitigation

| Finding ID | Scope | Current Phase 1 Impact | Phase 1 Mitigation in Place | Risk in Phase 1 |
| :--- | :--- | :--- | :--- | :--- |
| **HD-007** | Dashboard KPIs | Non-breaking | Mongoose pipelines with graceful fallback | None (Auth secured) |
| **HD-008** | Inventory | Non-breaking | In-memory state preserved during process lifetime | None (Auth secured) |
| **HD-009** | Delivery | Non-breaking | In-memory state with strict OTP validation | None (Auth secured) |
| **HD-010** | Support | Non-breaking | In-memory mock service | None (Auth secured) |
| **HD-012** | Coupons | Non-breaking | Strict dictionary algorithm rejecting invalid codes | None (Input validated) |

**Conclusion**: All 5 deferred items have verified Phase 1 mitigations in place (role authorization, input validation, and graceful fallbacks). Their database persistence will be implemented in Phase 2 upon user approval to migrate MSSQL.
