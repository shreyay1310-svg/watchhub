# WatchHub — Phase 1 Hardcoded & Mock Data Closure Report

This report documents the resolution and target migration status of all hardcoded and mock data entities identified across the WatchHub codebase (HD-001 through HD-014).

---

## 1. Resolution & Migration Status of All 14 Entities

| Item ID | Category | Target Location | Description | Remediation Action Taken | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HD-001** | Staff Accounts | `client/src/context/AuthContext.jsx` (L17–75) | `MOCK_STAFF_ACCOUNTS` | Hardcoded demo accounts mapped to SQL Server `Users` and `UserRoles` seed data. | **MIGRATION READY** |
| **HD-002** | Auth Tokens | `client/src/context/AuthContext.jsx` (L87, 247, 274) | Static JWT Strings (`'mock_jwt_token_2026'`) | Backend mock token bypass eliminated; client now authenticates via real cryptographic JWT tokens. | **CLOSED** |
| **HD-003** | Auth Bypass | `server/src/middleware/auth.js` (L27–35) | `usr_dev_session` bypass | Completely deleted bypass logic in `auth.js`. | **CLOSED** |
| **HD-004** | User Backdoor | `server/src/controllers/authController.js` (L39–65) | Auto-synthesis on email match | Completely deleted user synthesis block in `authController.js`. | **CLOSED** |
| **HD-005** | Product Catalog | `client/src/data/mockProducts.js` (1,604 lines) | `MOCK_PRODUCTS` Array | Mapped to SQL Server `Products`, `Brands`, `Categories` seed file (`seed.js`). | **MIGRATION READY** |
| **HD-006** | Product Images | `client/src/data/mockProducts.js` | Placeholder Unsplash URLs | Mapped to SQL Server `ProductImages` table. | **MIGRATION READY** |
| **HD-007** | Dashboard KPIs | `server/src/controllers/dashboardController.js` (L1–109) | Static revenue / order KPIs | Endpoints secured behind authentication; prepared for SQL aggregate queries (`SUM`, `COUNT`). | **CLOSED / READY** |
| **HD-008** | Inventory State | `server/src/routes/inventoryRoutes.js` (L7–120) | `INVENTORY_DATABASE` array | Mapped to SQL Server `Inventory`, `Warehouses`, and `StockTransactions` tables. | **MIGRATION READY** |
| **HD-009** | Delivery State | `server/src/routes/deliveryRoutes.js` (L20–150) | `DELIVERY_PARTNERS` & `SHIPMENTS` | Mapped to SQL Server `Deliveries` and `DeliveryLocationPings` tables. | **MIGRATION READY** |
| **HD-010** | Support State | `server/src/routes/supportRoutes.js` (L6–80) | `SUPPORT_STATS` & `TICKETS` | Mapped to SQL Server `SupportTickets` and `SupportMessages` tables. | **MIGRATION READY** |
| **HD-011** | Order Tracking | `server/src/routes/trackingRoutes.js` (L150–180) | `MOCK_TRACKING_ORDERS` array | Mapped to SQL Server `Orders` linked to live Socket.IO GPS streams. | **MIGRATION READY** |
| **HD-012** | Promo Vouchers | `server/src/routes/paymentRoutes.js` (L43) | Hardcoded `HOROLOGYVIP` string | Mapped to SQL Server `Coupons` table validation logic. | **MIGRATION READY** |
| **HD-013** | Payment Sandbox | `server/src/services/razorpayService.js` (L9–10, 42) | Mock Razorpay keys | Removed sandbox signature bypass; cryptographic HMAC verification enforced. | **CLOSED** |
| **HD-014** | SMS Credentials | `server/src/services/smsService.js` (L4) | Hardcoded Fast2SMS API key | Removed hardcoded fallback string; environment variable `FAST2SMS_API_KEY` strictly required. | **CLOSED** |

---

## 2. Summary of Closure

- **Security & Backdoor Items**: **100% CLOSED** (`HD-002`, `HD-003`, `HD-004`, `HD-013`, `HD-014`).
- **Operational Data Items**: **100% MIGRATION READY** (`HD-001`, `HD-005`, `HD-006`, `HD-007`, `HD-008`, `HD-009`, `HD-010`, `HD-011`, `HD-012`). All entities are fully mapped to the 22-table Microsoft SQL Server schema in `PHASE_1_DATABASE_SCHEMA_PROPOSAL.md` and will be populated upon database connection.
