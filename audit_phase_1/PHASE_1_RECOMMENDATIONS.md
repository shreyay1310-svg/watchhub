# WatchHub — Phase 1 Recommendations & Phase 2 Action Plan

## Priority 1: Critical Security Remediations (Must Fix Immediately in Phase 2)

1. **Eliminate Passwordless Backdoor in `authController.js`**:
   - Remove the fallback block (Lines 39–65) that generates mock user accounts for invalid credentials.
   - Strictly return `HTTP 401 Unauthorized` whenever `User.findOne()` fails or `user.comparePassword()` returns false.

2. **Remove Mock Token Bypass in `auth.js`**:
   - Delete `token.includes('mock_') || token.includes('jwt_')` from `server/src/middleware/auth.js`.
   - Never trust request headers (`x-user-role`) for role escalation.
   - Require a cryptographically valid signed JWT token for all authenticated endpoints.

3. **Secure Mutating Product Routes**:
   - Add `authenticate` and `authorizeRoles('Store Admin', 'Super Admin')` to `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`, and `POST /api/products/bulk` in `server/src/routes/productRoutes.js`.

4. **Protect Dashboard Statistics Endpoints**:
   - Attach `authenticate` and `authorizeRoles(...)` to `/api/dashboard/super-admin`, `/store-admin`, `/inventory-manager`, `/delivery-manager`, and `/customer-support`.

5. **Enforce Cryptographic Razorpay Signature Verification**:
   - Ensure `POST /api/payments/verify` computes HMAC SHA-256 against `RAZORPAY_KEY_SECRET` and strictly rejects any mismatch.

---

## Priority 2: Frontend Route Protection (High Priority)

1. **Wrap Missing Routes in `AppRoutes.jsx`**:
   - Wrap all `/inventory-manager/*` routes inside `<RoleProtectedRoute allowedRoles={['Inventory Manager', 'Super Admin']}>`.
   - Wrap all `/delivery-manager/*` routes inside `<RoleProtectedRoute allowedRoles={['Delivery Manager', 'Super Admin']}>`.

---

## Priority 3: Database & Persistence Architecture (High Priority)

1. **Connect MongoDB Atlas Cloud Database**:
   - Once the user creates the M0 Free cluster in MongoDB Atlas, copy the connection URI into `server/.env`:
     `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/watchhub?retryWrites=true&w=majority`
   - Run `node server/src/scripts/seed.js` to populate initial products, demo admin accounts, and store settings.

2. **Implement Missing Mongoose Models**:
   - Create `Warehouse.js` & `StockMovement.js` to persist inventory movements.
   - Create `Shipment.js` & `DeliveryPartner.js` to persist delivery orders and assignments.
   - Create `Ticket.js` & `ChatMessage.js` to persist customer support tickets and live chats.

---

## Priority 4: Performance & Production Optimization

1. **Frontend Code Splitting**:
   - In `client/vite.config.js`, configure Rollup `manualChunks` to split heavy dashboards (`POSTerminalModule`, `ProductsManagementModule`, `ManufacturingHubModule`) from the main customer bundle, reducing initial bundle size from 2.65 MB to under 500 kB.

2. **Fast2SMS IP Allowlist**:
   - On `fast2sms.com` Dev API settings, whitelist the server IP address to resolve error 414 and enable real mobile SMS OTP delivery.
