# WatchHub — Phase 1 Bug Report & Vulnerability Registry

| Bug ID | Severity | Module | Description | Root Cause | Affected Files | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-CRIT-001** | **Critical** | Authentication | Passwordless Backdoor / In-Memory Mock User Escalation | `authController.js` creates a mock user for any non-existent email rather than rejecting with HTTP 401, granting `Super Admin` if email contains "super" with any password. | `server/src/controllers/authController.js` (Lines 39–65) | OPEN |
| **BUG-CRIT-002** | **Critical** | Security / RBAC | Development Mock Token Bypass in Auth Middleware | `auth.js` checks if token contains `mock_` or `jwt_`, and if so, completely skips cryptographic verification, trusting `x-user-role` header to grant full permissions (`['all']`). | `server/src/middleware/auth.js` (Lines 27–35) | OPEN |
| **BUG-CRIT-003** | **Critical** | Products API | Unauthenticated Product Creation, Update & Deletion | `productRoutes.js` routes (`POST /`, `PUT /:id`, `DELETE /:id`, `POST /bulk`) lack `authenticate` and `authorizeRoles('Store Admin')` guards. Any anonymous internet user can modify the store catalog. | `server/src/routes/productRoutes.js` (Lines 13–18) | OPEN |
| **BUG-HIGH-001** | **High** | Frontend RBAC | Unprotected Inventory Manager Routes | Routes under `/inventory-manager/*` in `AppRoutes.jsx` are rendered directly without wrapping in `<RoleProtectedRoute>`, allowing unauthenticated guests to access stock management. | `client/src/routes/AppRoutes.jsx` (Lines 257–316) | OPEN |
| **BUG-HIGH-002** | **High** | Frontend RBAC | Unprotected Delivery Manager Routes | Routes under `/delivery-manager/*` in `AppRoutes.jsx` are rendered directly without wrapping in `<RoleProtectedRoute>`, allowing unauthenticated guests to view shipment assignments and partner routes. | `client/src/routes/AppRoutes.jsx` (Lines 319–378) | OPEN |
| **BUG-HIGH-003** | **High** | Dashboards API | Unprotected Dashboard Metrics API Endpoints | `/api/dashboard/super-admin`, `/store-admin`, `/inventory-manager`, `/delivery-manager`, `/customer-support` have no authentication or authorization middleware attached. | `server/src/routes/dashboardRoutes.js` (Lines 12–16) | OPEN |
| **BUG-HIGH-004** | **High** | Payments | Insecure Razorpay Sandbox Signature Verification | `razorpayService.js` / `paymentRoutes.js` accepts forged/mock payment signatures without validating cryptographic HMAC SHA-256 against secret when sandbox flag is active. | `server/src/services/razorpayService.js` & `server/src/routes/paymentRoutes.js` | OPEN |
| **BUG-HIGH-005** | **High** | Database | Lack of MongoDB Schemas for Inventory, Delivery & Support | Inventory, Delivery shipments, and Support tickets are stored in in-memory JavaScript variables inside route files. All operational data is wiped whenever the server restarts. | `server/src/routes/inventoryRoutes.js`, `deliveryRoutes.js`, `supportRoutes.js` | OPEN |
| **BUG-MED-001** | **Medium** | Database Connectivity | MongoDB Local Database Inaccessible | No local MongoDB daemon is installed or running on Windows `127.0.0.1:27017`. Database operations buffer and time out after 10,000ms. | `server/.env`, `server/src/config/db.js` | BLOCKED |
| **BUG-MED-002** | **Medium** | SMS OTP | Fast2SMS IP Restriction (HTTP 414) | Fast2SMS API requires developer IP address whitelisting on their portal. SMS dispatch fails with code 414 until the server IP is added to the allowlist. | `server/src/services/smsService.js` | BLOCKED / PARTIAL |
| **BUG-MED-003** | **Medium** | Frontend Performance | Single Monolithic Vendor Bundle (> 2.65 MB) | Vite production build produces a single `index-CCEviKe1.js` chunk of 2,655 kB due to lack of dynamic code splitting on dashboard modules. | `client/vite.config.js` | OPEN |
| **BUG-LOW-001** | **Low** | Core API | User Model Role Enum Inconsistency | `User.js` enum contains `Customer Support Executive`, while frontend components and routes alternate between `Customer Support`, `Customer Support Manager`, and `Customer Support Executive`. | `server/src/models/User.js` (Line 18) | OPEN |

---

## Detailed Bug Reports & Reproduction Steps

### BUG-CRIT-001: Passwordless Backdoor in `authController.js`
- **Severity**: Critical
- **Module**: Authentication
- **Affected File**: `server/src/controllers/authController.js#L39-L65`
- **Steps to Reproduce**:
  1. Send `POST /api/auth/login` with body `{"email": "super_hacker@test.com", "password": "anypassword"}`.
  2. Observe HTTP response status code is `200 OK`.
  3. Response contains a valid signed JWT access token for user `Vikram Malhotra` with role `Super Admin` and permissions `['all']`.
- **Root Cause**: A prototyping fallback was left in place when user lookup fails.
- **Recommended Fix**: Return `res.status(401).json({ status: 'fail', message: 'Invalid email or password' })` whenever `User.findOne()` returns null or password verification fails.

---

### BUG-CRIT-002: Mock Token Bypass in `auth.js`
- **Severity**: Critical
- **Module**: Security / RBAC
- **Affected File**: `server/src/middleware/auth.js#L27-L35`
- **Steps to Reproduce**:
  1. Send `GET /api/auth/me` with header `Authorization: Bearer mock_token_bypass` and `x-user-role: Super Admin`.
  2. Observe that JWT cryptographic verification is bypassed.
  3. Server sets `req.user` to `{ id: 'usr_dev_session', role: 'Super Admin', permissions: ['all'] }` and returns 200 OK.
- **Root Cause**: Offline mock bypass was committed into the production auth middleware.
- **Recommended Fix**: Completely remove the `token.includes('mock_')` condition from `auth.js`.

---

### BUG-CRIT-003: Unauthenticated Product CRUD Operations
- **Severity**: Critical
- **Module**: Products Catalog
- **Affected File**: `server/src/routes/productRoutes.js#L13-L18`
- **Steps to Reproduce**:
  1. Send `POST /api/products` or `DELETE /api/products/:id` with no headers and no credentials.
  2. The server processes the request directly without authenticating the caller.
- **Root Cause**: Route definitions directly call `createProduct`, `updateProduct`, `deleteProduct` without `authenticate` and `authorizeRoles('Store Admin', 'Super Admin')`.
- **Recommended Fix**: Add `authenticate` and `authorizeRoles('Store Admin', 'Super Admin')` to all mutating routes.

---

### BUG-HIGH-001 & BUG-HIGH-002: Missing Frontend Route Protection
- **Severity**: High
- **Module**: Frontend Routing / RBAC
- **Affected File**: `client/src/routes/AppRoutes.jsx#L257-L378`
- **Steps to Reproduce**:
  1. Open an incognito browser window without logging into WatchHub.
  2. Navigate directly to `http://localhost:5173/inventory-manager/dashboard` or `http://localhost:5173/delivery-manager/dashboard`.
  3. The full dashboard with navigation, controls, and sensitive logistics metrics loads without redirecting to `/login`.
- **Root Cause**: Route declarations omit `<RoleProtectedRoute allowedRoles={[...]}>`.
- **Recommended Fix**: Wrap all `/inventory-manager/*` and `/delivery-manager/*` routes in `<RoleProtectedRoute>` specifying appropriate roles.
