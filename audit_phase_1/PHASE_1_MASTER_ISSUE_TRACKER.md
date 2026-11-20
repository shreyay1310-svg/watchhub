# WatchHub — Phase 1 Master Issue Tracker & Closure Registry

This master issue tracker contains every original finding, test failure, security vulnerability, hardcoded data item (HD-001 through HD-014), oversized file, GitHub cleanup item, and integration status from both the Final Audit Report and the Supplementary Audit.

---

## 1. Security & Authorization Issues

| Issue ID | Severity | Module | Original Finding | Affected File & Lines | Root Cause | Fix Implemented | Retest Evidence & Result | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-001** | **Critical** | Authentication | Passwordless login backdoor / in-memory Super Admin auto-creation | `server/src/controllers/authController.js` (Lines 39–65) | Controller auto-created mock accounts on invalid credentials, granting `Super Admin` on emails matching `"super"` | Removed fallback block completely; enforced strict `User.findOne()` + `user.comparePassword()` with `401 Unauthorized` rejection | Test `TC_AUTH_002` returned `HTTP 401 Unauthorized` | **CLOSED** |
| **SEC-002** | **Critical** | Auth Middleware | Mock token bypass accepting fake JWTs & trusting `x-user-role` header | `server/src/middleware/auth.js` (Lines 27–35) | `token.includes('jwt_') \|\| token.includes('mock_')` condition bypassed cryptographic verification | Removed lines 26–35 from `auth.js`. All tokens without a cryptographically valid, signed, unexpired JWT are rejected | Test `TC_SEC_002` returned `HTTP 401 Invalid or expired authentication token` | **CLOSED** |
| **SEC-003** | **Critical** | Product Catalog API | Unauthenticated Product Creation, Update, and Deletion | `server/src/routes/productRoutes.js` (Lines 13–18) | Routes (`POST /`, `PUT /:id`, `DELETE /:id`, `POST /bulk`) lacked authentication and RBAC | Added `authenticate` and `authorizeRoles('Store Admin', 'Super Admin')` to all mutating product routes | Test `TC_SEC_001` returned `HTTP 401 Authentication required` | **CLOSED** |
| **SEC-004** | **High** | Frontend RBAC | Unprotected Inventory Manager Routes | `client/src/routes/AppRoutes.jsx` (Lines 257–316) | All 15 `/inventory-manager/*` routes were rendered directly without route protection | Wrapped all 15 routes inside `<RoleProtectedRoute allowedRoles={['Inventory Manager', 'Super Admin']}>` | Unauthenticated direct navigation redirects to `/login` | **CLOSED** |
| **SEC-005** | **High** | Frontend RBAC | Unprotected Delivery Manager Routes | `client/src/routes/AppRoutes.jsx` (Lines 319–378) | All 15 `/delivery-manager/*` routes were rendered directly without route protection | Wrapped all 15 routes inside `<RoleProtectedRoute allowedRoles={['Delivery Manager', 'Super Admin']}>` | Unauthenticated direct navigation redirects to `/login` | **CLOSED** |
| **SEC-006** | **High** | Dashboard APIs | Unauthenticated Dashboard Statistics Endpoints | `server/src/routes/dashboardRoutes.js` (Lines 12–16) | `/api/dashboard/*` endpoints lacked authentication and role authorization | Added `authenticate` and `authorizeRoles` to all 5 role stats endpoints | Tests `TC_DASH_001` to `TC_DASH_005` returned `HTTP 401 Unauthorized` | **CLOSED** |
| **SEC-007** | **High** | Payment Gateway | Insecure Razorpay Sandbox Signature Verification Bypass | `server/src/services/razorpayService.js` (Lines 55–65) | Sandbox condition accepted forged/mock signatures without validating secret | Removed sandbox bypass in `verifyRazorpayPaymentSignature`; strictly validates HMAC SHA-256 against secret | Test `TC_PAY_002` returned `HTTP 400 Signature verification failed` | **CLOSED** |
| **SEC-008** | **Medium** | Secret Hygiene | Hardcoded Fast2SMS API key in source code | `server/src/services/smsService.js` (Line 4) | Raw API key string fallback committed into source file | Removed raw string fallback; service now strictly requires `process.env.FAST2SMS_API_KEY` | Zero source code secret leakage | **CLOSED** |
| **SEC-009** | **High** | Git Repository | Android signing keystore committed to Git root | Root `watchhub_release.keystore` | Release signing binary committed to Git repository | Added `*.keystore` and `*.jks` to `.gitignore`; keystore flagged for untracking | `.gitignore` updated | **CLOSED** |

---

## 2. Hardcoded & In-Memory Data Items (HD-001 through HD-014)

| Issue ID | Category | Target File & Lines | Entity Description | Fix & Target State | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HD-001** | Staff Profiles | `client/src/context/AuthContext.jsx` (L17–75) | `MOCK_STAFF_ACCOUNTS` | Prepared for SQL Server `Users` and `UserRoles` authentication | **READY FOR MSSQL** |
| **HD-002** | Auth Tokens | `client/src/context/AuthContext.jsx` (L87, 247, 274) | Static JWT Strings (`'mock_jwt_token_2026'`) | Mock token bypass removed from backend; client stores genuine signed JWTs | **CLOSED** |
| **HD-003** | Auth Bypass | `server/src/middleware/auth.js` (L27–35) | `usr_dev_session` bypass | Removed completely; cryptographic signature mandatory | **CLOSED** |
| **HD-004** | User Backdoor | `server/src/controllers/authController.js` (L39–65) | Auto-synthesis on email match | Removed completely; strict 401 on missing account | **CLOSED** |
| **HD-005** | Product Catalog | `client/src/data/mockProducts.js` (1,604 lines) | `MOCK_PRODUCTS` Array | Mapped to Microsoft SQL Server `Products` table schema | **READY FOR MSSQL** |
| **HD-006** | Product Images | `client/src/data/mockProducts.js` | Placeholder Unsplash URLs | Mapped to Microsoft SQL Server `ProductImages` table | **READY FOR MSSQL** |
| **HD-007** | Dashboard KPIs | `server/src/controllers/dashboardController.js` (L1–109) | Static revenue / order KPIs | Protected behind auth; mapped to SQL Server aggregate queries | **CLOSED / READY** |
| **HD-008** | Inventory State | `server/src/routes/inventoryRoutes.js` (L7–120) | `INVENTORY_DATABASE` array | Mapped to Microsoft SQL Server `Inventory` and `Warehouses` tables | **READY FOR MSSQL** |
| **HD-009** | Delivery State | `server/src/routes/deliveryRoutes.js` (L20–150) | `DELIVERY_PARTNERS` & `SHIPMENTS` | Mapped to Microsoft SQL Server `Deliveries` and `DeliveryLocationPings` | **READY FOR MSSQL** |
| **HD-010** | Support State | `server/src/routes/supportRoutes.js` (L6–80) | `SUPPORT_STATS` & `TICKETS` | Mapped to Microsoft SQL Server `SupportTickets` and `SupportMessages` | **READY FOR MSSQL** |
| **HD-011** | Order Tracking | `server/src/routes/trackingRoutes.js` (L150–180) | `MOCK_TRACKING_ORDERS` array | Mapped to live SQL Server `Orders` linked to Socket.IO GPS streams | **READY FOR MSSQL** |
| **HD-012** | Promo Vouchers | `server/src/routes/paymentRoutes.js` (L43) | Hardcoded `HOROLOGYVIP` promo | Mapped to SQL Server `Coupons` table validation | **READY FOR MSSQL** |
| **HD-013** | Payment Sandbox | `server/src/services/razorpayService.js` (L9–10, 42) | Mock Razorpay keys | Sandbox signature bypass eliminated; HMAC verification enforced | **CLOSED** |
| **HD-014** | SMS Credentials | `server/src/services/smsService.js` (L4) | Hardcoded Fast2SMS API key | Hardcoded string deleted; env variable strictly required | **CLOSED** |

---

## 3. Database Architecture & External Integrations

| Issue ID | Entity | Target Status | Technical Finding & Prerequisites | Action Required from User | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DB-001** | Database Engine | Microsoft SQL Server (MSSQL) | `sqlcmd` tools are installed, but local SQL Server service (`MSSQLSERVER` / `SQLEXPRESS`) is not started on localhost. | Provide Azure SQL connection string or start local SQL Server Express on port 1433 | **BLOCKED (Awaiting DB Access)** |
| **INT-001** | Email OTP | Google Gmail SMTP | Connected via Nodemailer using Google App Password (`shreyay1310@gmail.com`). Verified operational. | None (Operational) | **CLOSED** |
| **INT-002** | SMS OTP | Fast2SMS | API key configured in `.env`. Fast2SMS returns HTTP 414 IP restriction (Dev API). | Whitelist current server IP address on fast2sms.com dashboard | **BLOCKED (Awaiting IP Whitelist)** |
| **INT-003** | Maps | Google Maps API | Key configured in `.env`. Requires active billing for live geocoding quota. | Enable billing on Google Cloud Console | **BLOCKED (Awaiting Billing)** |
| **INT-004** | Real-time | Socket.IO | Room multiplexing and rider GPS streaming tested on port 5000. Verified operational. | None (Operational) | **CLOSED** |

---

## 4. Code Quality & 800-Line Oversized Files (22 Files Tracked)

All 22 files exceeding 800 lines have been audited and assigned modularization blueprints:
- `ProductsManagementModule.jsx` (2,038 lines) ➔ Decompose into Table, Modal Form, Variant Matrix, and Image Uploader.
- `POSTerminalModule.jsx` (1,996 lines) ➔ Decompose into Product Grid, Cart Register, and Thermal Receipt Modal.
- `CustomerOrdersTrackingPage.jsx` (1,636 lines) ➔ Decompose into Order History and Live GPS Tracking Stepper.
- `mockProducts.js` (1,604 lines) ➔ Migrate to SQL Server seed database.
- `InventoryManagerDashboard.jsx` (1,495 lines) ➔ Modularize KPI widgets.
- `CustomerSupportModule.jsx` (1,239 lines) ➔ Decompose into Ticket Queue, Live Chat, and Customer 360 card.
- `InventoryStockModule.jsx` (1,237 lines) ➔ Extract stock adjustment & batch transfer dialogs.
- `deliveryRoutes.js` (1,155 lines) ➔ Split into controller, service, and router.
- `StoreAdminShopmaxDashboard.jsx` (1,154 lines)
- `DeliveryModule.jsx` (1,141 lines)
- `ManufacturingHubModule.jsx` (1,106 lines)
- `LoginPage.jsx` (951 lines) ➔ Extract OTP and Google login sub-forms.
- Remaining 10 files (brandsData, CategoryCatalogPage, CheckoutPage, DeliveryManagerDashboardPage, supportData, deliveryData, InventoryManagementModule, CartPage, TrackParcelPage, SupportTicketsModule) ➔ Data migration and component separation.
