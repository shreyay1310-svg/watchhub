# WATCHHUB ATELIER — GLOBAL APPLICATION FAILURE ROOT CAUSE ANALYSIS
**Date:** 2026-11-21  
**Environment:** 100% Local Development (Frontend: http://localhost:5173, Backend: http://localhost:5000, SQL Server: 127.0.0.1:1433)  
**Database:** WatchHubDB (Microsoft SQL Server 2025)

---

## 1. EXECUTIVE SUMMARY

Two critical application failure screens were reported across role dashboards:
1. **Screen 1 — WatchHub Portal Recovery (`selectedPaymentMethod is not defined`)**:
   Triggered as a React `ReferenceError` inside POS Terminal and checkout modules when accessed from role dashboards (such as Store Admin or RoleDashboard POS tabs).
2. **Screen 2 — WatchHub Offline Recovery (`CONNECTION OFFLINE — Time Standstill`)**:
   Triggered by Service Worker Workbox navigation fallback interception (`navigateFallback: '/offline.html'`) and absence of a granular, state-driven React network connectivity monitor.

---

## 2. ROOT CAUSE 1: `selectedPaymentMethod is not defined` (ReferenceError)

### Exact Location
- **File:** `client/src/components/dashboards/modules/POSTerminalModule.jsx`
- **Lines:** 733–734

### Code Analysis
In `client/src/components/dashboards/modules/POSTerminalModule.jsx`:
- Line 117 defined state as:
  ```javascript
  const [paymentMethod, setPaymentMethod] = useState('Card');
  ```
- However, at line 733, when mounting the sub-component `<POSCheckoutModals>`:
  ```jsx
  <POSCheckoutModals
    paymentModalOpen={paymentModalOpen}
    setPaymentModalOpen={setPaymentModalOpen}
    selectedPaymentMethod={selectedPaymentMethod} // <-- ReferenceError!
    setSelectedPaymentMethod={setSelectedPaymentMethod} // <-- ReferenceError!
    grandTotal={grandTotal}
    ...
  />
  ```
- Because `selectedPaymentMethod` was never declared in `POSTerminalModule.jsx`, React threw:
  `ReferenceError: selectedPaymentMethod is not defined`
- This uncaught runtime exception bubbled up to the top-level `GlobalErrorBoundary` in `client/src/App.jsx` (lines 13–62), causing the entire dashboard to unmount and render the **WatchHub Portal Recovery** screen.

### Secondary Payment Context Finding
In `client/src/pages/customer/CheckoutPage.jsx` and `client/src/components/checkout/CheckoutPaymentSection.jsx`:
- Razorpay was previously loaded dynamically via `checkout.razorpay.com/v1/checkout.js`.
- The active checkout must strictly use the local dummy payment architecture (`"Demo Payment Mode — No real money will be charged"`: Cash, UPI, Card, NetBanking, COD) and persist real transactional records in SQL Server `WatchHubDB` without external cloud gateway dependencies.
- Dashboard modules must never crash due to checkout payment variables being uninitialized.

---

## 3. ROOT CAUSE 2: `CONNECTION OFFLINE — Time Standstill`

### Exact Location
- **File:** `client/vite.config.js` (line 49)
- **File:** `client/public/sw.js` (lines 11–22)
- **File:** `client/public/offline.html`

### Code Analysis
1. In `client/vite.config.js`:
   ```javascript
   workbox: {
     navigateFallback: '/offline.html',
   }
   ```
   In a Single Page Application (SPA), the service worker navigation fallback must ALWAYS be `/index.html` (the SPA shell so React Router handles routing). Setting `navigateFallback: '/offline.html'` instructed Workbox to serve the static offline page whenever an internal route fetch encountered a network timeout or when a user browsed on a disconnected/misconfigured host (e.g. cloud preview URL).
2. When the user visited `watchhub-store-silk.vercel.app`, the local backend on `localhost:5000` and SQL Server on `127.0.0.1:1433` were unreachable from the cloud domain. The browser's active Service Worker intercepted navigation and returned the cached `offline.html` ("Time Standstill").
3. In the React frontend, there was no granular `NetworkStatusProvider` to differentiate between:
   - `ONLINE`
   - `BACKEND_UNAVAILABLE`
   - `REQUEST_TIMEOUT`
   - `INTERNET_OFFLINE`
   - `AUTHENTICATION_EXPIRED`
   Any generic fetch error was either swallowed or misclassified.

---

## 4. ROOT CAUSE 3: GLOBAL ERROR BOUNDARY BEHAVIOR

### Exact Location
- **File:** `client/src/App.jsx` (lines 13–62)

### Code Analysis
- `GlobalErrorBoundary` intercepted all rendering errors and displayed a single generic message with two buttons:
  - `Reload Page`
  - `Go to Storefront` (`window.location.href = '/'`)
- When a Store Admin, Inventory Manager, Delivery Manager, or Customer Support executive experienced a component error, clicking `Go to Storefront` discarded their role context and navigated them to the customer storefront, creating role confusion.
- The Error Boundary lacked technical error telemetry, retry with role preservation, and isolation of module crashes.

---

## 5. COMPREHENSIVE ACTION PLAN

| Phase | Scope | Objective |
| :--- | :--- | :--- |
| **Phase 2** | `POSTerminalModule.jsx` & `CheckoutPage.jsx` | Fix `selectedPaymentMethod` ReferenceError; harmonize payment state; standardize local dummy payment methods. |
| **Phase 3 & 4** | `NetworkStatusContext.jsx` & `WatchHubOfflineRecovery.jsx` | Create 5-state network monitor; ping `/api/health`; provide working Reconnect & Refresh with route preservation. |
| **Phase 5** | `App.jsx` (GlobalErrorBoundary) | Enhance Error Boundary with role-aware return button and clean diagnostics. |
| **Phase 6** | All 7 Database Roles | Validate isolation, login, me check, dashboard, logout, and cross-role switching. |
| **Phase 7** | SQL Server & Express API | Verify Prisma connectivity, dummy order checkout endpoint, and `/api/health`. |
| **Phase 8** | Service Worker & Workbox | Ensure `navigateFallback: '/index.html'`; activate kill-switch; unregister stale workers. |
| **Phase 9** | Automated Testing | Run Playwright browser tests across viewports, network states, and roles. |
| **Phase 10** | Documentation | Generate full report suite in `WATCHHUB_GLOBAL_FAILURE_REPAIR_REPORT/`. |

---
*Report generated and verified against local source tree.*
