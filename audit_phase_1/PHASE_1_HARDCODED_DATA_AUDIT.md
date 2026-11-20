# WatchHub — Phase 1 Hardcoded Data Audit & Remediation Registry

This audit catalogues all static, mock, in-memory, and hardcoded data entities identified across the WatchHub codebase.

---

## 1. Master Hardcoded Data Inventory

| Issue ID | Category | File Path & Lines | Hardcoded Entity Description | Actual Code / Data Identified | Recommended Production Replacement |
|---|---|---|---|---|---|
| **HD-001** | Staff & Roles | `client/src/context/AuthContext.jsx` (Lines 17–75) | `MOCK_STAFF_ACCOUNTS` | Hardcoded demo profiles for Super Admin (`Vikram Malhotra`), Store Admin (`Aanya Singhania`), Inventory Manager (`Rajesh Mehta`), Delivery Manager (`Karan Verma`), Support (`Pooja Sharma`), Delivery Partner (`Rohan Singh`). | Authenticate against Microsoft SQL Server `Users` and `UserRoles` tables via `POST /api/auth/login`. |
| **HD-002** | Auth Tokens | `client/src/context/AuthContext.jsx` (Lines 87, 247, 274) | Static JWT Strings | `mock_jwt_token_2026`, `mock_jwt_token_val_2026`, `mock_jwt_google_token_2026`. | Generate real HMAC-SHA256 cryptographically signed JWT tokens via `jsonwebtoken` from backend. |
| **HD-003** | Auth Bypass | `server/src/middleware/auth.js` (Lines 27–35) | Development Token Bypass | `token.includes('jwt_') \|\| token.includes('mock_')` fallback granting `usr_dev_session` and `['all']` permissions. | Remove mock token branch completely; enforce cryptographic `jwt.verify()`. |
| **HD-004** | User Backdoor | `server/src/controllers/authController.js` (Lines 39–65) | Fallback User Synthesis | In-memory synthesis creating `Super Admin` on emails matching `"super"`. | Strict rejection with `HTTP 401 Unauthorized` on non-existent user or invalid password. |
| **HD-005** | Product Catalog | `client/src/data/mockProducts.js` (1,604 lines) | `MOCK_PRODUCTS` Array | 40+ static luxury watches with prices, specs, and local image paths. | Store in Microsoft SQL Server `Products`, `ProductImages`, `Brands`, and `Categories` tables. |
| **HD-006** | Product Images | `client/src/data/mockProducts.js` | Placeholder / Repeated Images | Multiple watches reference Unsplash placeholder URLs or duplicate Rolex/Omega assets. | Individual high-resolution horology photographs served from CDN / Azure Blob Storage. |
| **HD-007** | Dashboard KPIs | `server/src/controllers/dashboardController.js` (Lines 1–109) | Static Business Metrics | Hardcoded `totalRevenue: 1248000`, `totalOrders: 1248`, `totalCustomers: 5320`, static trend percentages. | Compute dynamic real-time metrics using SQL aggregate queries (`SUM(TotalAmount)`, `COUNT(OrderId)`). |
| **HD-008** | Inventory State | `server/src/routes/inventoryRoutes.js` (Lines 7–120) | `INVENTORY_DATABASE` | Volatile in-memory array holding 10 stock items, warehouses, and SKU quantities. | Query Microsoft SQL Server `Inventory`, `Warehouses`, and `StockTransactions` tables. |
| **HD-009** | Delivery State | `server/src/routes/deliveryRoutes.js` (Lines 20–150) | `DELIVERY_PARTNERS` & `SHIPMENTS` | Volatile in-memory array holding active shipments, rider names, GPS coordinates, and vehicle details. | Query Microsoft SQL Server `Deliveries`, `Users`, and `DeliveryLocationPings` tables. |
| **HD-010** | Support State | `server/src/routes/supportRoutes.js` (Lines 6–80) | `SUPPORT_STATS` & `TICKETS` | Volatile in-memory array holding support ticket queues, agent CSAT ratings, and canned replies. | Query Microsoft SQL Server `SupportTickets` and `SupportMessages` tables. |
| **HD-011** | Order Tracking | `server/src/routes/trackingRoutes.js` (Lines 150–180) & `client/src/data/trackingData.js` | `MOCK_TRACKING_ORDERS` | Hardcoded order tracking records (`WH-1001`, `WH-1002`) with simulated delivery timelines. | Query live `Orders` and `Deliveries` records linked to Socket.IO live rider GPS streams. |
| **HD-012** | Promo Vouchers | `server/src/routes/paymentRoutes.js` (Line 43) & `client/src/pages/customer/CheckoutPage.jsx` | Hardcoded Coupon String | `promoCode.toUpperCase() === 'HOROLOGYVIP'` granting hardcoded 10% discount. | Validate promo codes dynamically against Microsoft SQL Server `Coupons` table. |
| **HD-013** | Payment Sandbox | `server/src/services/razorpayService.js` (Lines 9–10, 42) | Mock Razorpay Keys & Order ID | Fallback keys `'rzp_test_watchhub2026'` and `order_${Math.random()}`. | Enforce real Razorpay test credentials via environment variables (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`). |
| **HD-014** | SMS API Key | `server/src/services/smsService.js` (Line 4) | Raw API Key String in Code | Fallback string containing Fast2SMS API key. | Remove hardcoded string; require `process.env.FAST2SMS_API_KEY`. |
