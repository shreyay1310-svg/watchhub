# WatchHub — Complete Phase 1 Issue Tracker & Resolution Registry

This tracker records the verified resolution of all Phase 1 issues. Every issue below has been fixed in code, re-tested via automated harnesses, and formally marked **CLOSED**.

---

## Issue Resolution Status Table

| Issue ID | Severity | Module | Original Finding | Affected File & Lines | Required Fix | Actual Fix Performed | Retest Result | Final Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ISSUE-CRIT-001** | **Critical** | Authentication | Passwordless login backdoor / in-memory Super Admin auto-synthesis | `server/src/controllers/authController.js` (Lines 39–65) | Remove fallback completely; return `401 Unauthorized` on non-existent user or invalid password | Deleted fallback block in `authController.js`; enforced strict `bcrypt.compare` and `401` rejection | `TC_AUTH_002` returned `HTTP 401 Unauthorized` | **CLOSED** |
| **ISSUE-CRIT-002** | **Critical** | Auth Middleware | Mock token bypass accepting fake JWTs and trusting `x-user-role` header | `server/src/middleware/auth.js` (Lines 27–35) | Remove mock token branch; enforce cryptographic `jwt.verify` on all tokens | Removed lines 26–35 from `auth.js`; all requests without a cryptographically valid signed JWT are rejected | `TC_SEC_002` returned `HTTP 401 Invalid or expired authentication token` | **CLOSED** |
| **ISSUE-CRIT-003** | **Critical** | Product Catalog API | Unauthenticated Product Creation, Update, and Deletion | `server/src/routes/productRoutes.js` (Lines 13–18) | Add `authenticate` and `authorizeRoles('Store Admin', 'Super Admin')` | Protected `POST /`, `PUT /:id`, `DELETE /:id`, `POST /bulk` with `authenticate` & `authorizeRoles` | `TC_SEC_001` returned `HTTP 401 Authentication required` | **CLOSED** |
| **ISSUE-HIGH-001** | **High** | Frontend RBAC | Unprotected Inventory Manager Routes | `client/src/routes/AppRoutes.jsx` (Lines 257–316) | Wrap all routes in `<RoleProtectedRoute allowedRoles={['Inventory Manager', 'Super Admin']}>` | Wrapped all 15 `/inventory-manager/*` routes in `<RoleProtectedRoute>` | Direct URL navigation redirects unauthenticated users to `/login` | **CLOSED** |
| **ISSUE-HIGH-002** | **High** | Frontend RBAC | Unprotected Delivery Manager Routes | `client/src/routes/AppRoutes.jsx` (Lines 319–378) | Wrap all routes in `<RoleProtectedRoute allowedRoles={['Delivery Manager', 'Super Admin']}>` | Wrapped all 15 `/delivery-manager/*` routes in `<RoleProtectedRoute>` | Direct URL navigation redirects unauthenticated users to `/login` | **CLOSED** |
| **ISSUE-HIGH-003** | **High** | Dashboard APIs | Unauthenticated Dashboard Statistics Endpoints | `server/src/routes/dashboardRoutes.js` (Lines 12–16) | Add `authenticate` and appropriate `authorizeRoles(...)` to each endpoint | Added `authenticate` and `authorizeRoles` to all 5 dashboard statistics endpoints | `TC_DASH_001` through `TC_DASH_005` returned `HTTP 401 Unauthorized` | **CLOSED** |
| **ISSUE-HIGH-004** | **High** | Payment Gateway | Insecure Razorpay Sandbox Signature Verification Bypass | `server/src/services/razorpayService.js` (Lines 55–65) & `server/src/routes/paymentRoutes.js` | Enforce strict HMAC-SHA256 signature calculation against `RAZORPAY_KEY_SECRET` | Removed sandbox bypass in `verifyRazorpayPaymentSignature`; strictly validates HMAC SHA-256 against secret | `TC_PAY_002` returned `HTTP 400 Cryptographic signature verification failed` | **CLOSED** |
| **ISSUE-MED-002** | **Medium** | Secret Hygiene | Hardcoded Fast2SMS API key in source code | `server/src/services/smsService.js` (Line 4) | Remove string fallback; require `process.env.FAST2SMS_API_KEY` exclusively | Removed raw API key fallback string; service now requires environment variable | Service logs warning when env variable absent; zero source-code leakage | **CLOSED** |
| **ISSUE-LOW-002** | **Low** | Frontend Bundle Size | Monolithic JS chunk exceeding 2.65 MB | `client/vite.config.js` | Configure Rollup `output.manualChunks` for vendor, charts, and icons splitting | Configured `vendor`, `charts`, and `icons` manualChunks in `vite.config.js` | Production build generated separate modular chunks (`vendor`, `charts`, `icons`) | **CLOSED** |

---

## Retest Verification Summary (Automated Backend Suite)

- **Total Probes Executed**: **31 Tests**
- **Passed**: **31 Tests (100.0%)**
- **Failed**: **0 Tests (0.0%)**
- **Evidence Log**: [backend_api_tests.log](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/audit_phase_1/PHASE_1_EVIDENCE/backend_api_tests.log)
