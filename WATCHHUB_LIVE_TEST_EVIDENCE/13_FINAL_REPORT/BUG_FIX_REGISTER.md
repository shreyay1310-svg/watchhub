# WATCHHUB ATELIER — BUG FIX REGISTER

This register records all confirmed defects diagnosed during live browser and API testing, along with root cause analyses, exact code remediation, and verification status.

---

### Remediated Defect Ledger

#### Defect 01: `ReferenceError: setSelectedProduct is not defined`
- **Component**: `client/src/pages/customer/ProductsPage.jsx` (Lines 526–534)
- **Severity**: Critical (React Component Boundary Crash)
- **Root Cause**: The catalog grid mapped product items to `<ProductCard>` and passed `onQuickView={setSelectedProduct}` and `onNavigate={(prod) => setSelectedProduct(prod)}`, but `selectedProduct` state and `setSelectedProduct` setter were omitted from the component declaration, and `useNavigate` was not imported.
- **Remediation**:
  1. Imported `useNavigate` from `react-router-dom`.
  2. Declared `const navigate = useNavigate();` and `const [selectedProduct, setSelectedProduct] = useState(null);`.
  3. Updated `ProductCard` callbacks to `onQuickView={(prod) => setSelectedProduct(prod)}` and `onNavigate={(prod) => navigate('/product/' + prod.id)}`.
- **Verification**: Zero console errors during catalog navigation and quick view clicks. Status: **RESOLVED & VERIFIED**.

---

#### Defect 02: `TypeError: getCartTotal is not a function`
- **Component**: `client/src/pages/customer/CheckoutPage.jsx` & `client/src/context/CartContext.jsx`
- **Severity**: High (Checkout Page Crash on Render)
- **Root Cause**: `CheckoutPage.jsx` invoked `const subtotal = getCartTotal()`, but `CartContext.Provider` only exported `subtotal` as a numeric value rather than exposing `getCartTotal` as a callable helper.
- **Remediation**:
  1. Added `getCartTotal = () => subtotal;` and exported it through `CartContext.Provider`.
  2. Added defensive fallback in `CheckoutPage.jsx`: `const subtotal = typeof getCartTotal === 'function' ? getCartTotal() : (cart || []).reduce(...)`.
- **Verification**: `/checkout` renders smoothly without error boundary catches. Status: **RESOLVED & VERIFIED**.

---

#### Defect 03: Missing `/api` Prefix in Client API Base URL
- **Component**: `client/src/services/api.js` & `client/.env`
- **Severity**: Medium (HTTP 404 on `/auth/login`)
- **Root Cause**: `client/.env` set `VITE_API_URL=http://localhost:5000` without the `/api` prefix, causing Axios requests targeting `/auth/login` to fail with HTTP 404 on the Express server.
- **Remediation**:
  1. Normalized `client/src/services/api.js` to ensure `baseURL` automatically appends `/api` if not already present.
  2. Updated `client/.env` to `VITE_API_URL=http://localhost:5000/api`.
  3. Added root compatibility aliases in `server/src/app.js`: `app.use('/auth', authRoutes)` and `app.use('/products', productRoutes)`.
- **Verification**: Auth routes correctly resolve on both `/api/auth/*` and `/auth/*`. Status: **RESOLVED & VERIFIED**.

---

#### Defect 04: HTTP 404 on `/favicon.ico`
- **Component**: `server/src/app.js`
- **Severity**: Low (Harmless Console Warning)
- **Root Cause**: Browser requested `/favicon.ico` against the backend server during direct API endpoint visits, triggering the Express 404 catch-all.
- **Remediation**: Added `app.get('/favicon.ico', (req, res) => res.status(204).end())` to `server/src/app.js`.
- **Verification**: Favicon requests return HTTP 204 No Content. Status: **RESOLVED & VERIFIED**.

---

#### Defect 05: Product Route Alias Discrepancy
- **Component**: `client/src/routes/AppRoutes.jsx`
- **Severity**: Low (Potential 404 on Plural Route)
- **Root Cause**: Routes only configured `<Route path="/product/:id" ... />`, whereas certain UI navigation links targeted `/products/:id`.
- **Remediation**: Added `<Route path="/products/:id" element={<ProductDetailsPage />} />` alongside `/product/:id`.
- **Verification**: Both singular and plural routes render the product details page. Status: **RESOLVED & VERIFIED**.

---

### Bug Summary
- **Total Defects Identified**: 5
- **Total Defects Resolved**: 5
- **Unresolved Defects**: 0
- **Regressions Introduced**: 0
