# WatchHub — Phase 1 800-Line Codebase Audit & Modularization Plan

This audit reviews every source code file in the repository exceeding **800 lines** and outlines logical component decomposition for Phase 2.

---

## 1. Inventory of Files Exceeding 800 Lines (22 Files Identified)

| # | File Path | Exact Line Count | Primary Functionality | Architectural Risk / Code Smells |
|---|---|---|---|---|
| 1 | `client/src/components/dashboards/modules/ProductsManagementModule.jsx` | **2,038 lines** | Store Admin Product Catalog CRUD | Massive monolithic component containing modal dialogs, SKU generators, image uploaders, and variant matrices in a single file. |
| 2 | `client/src/components/dashboards/modules/POSTerminalModule.jsx` | **1,996 lines** | Physical Boutique POS Terminal | Combines barcode scanner, live register cart, discount manager, cash/card calculator, and printable thermal receipt HTML. |
| 3 | `client/src/pages/customer/CustomerOrdersTrackingPage.jsx` | **1,636 lines** | Collector Order History & Live GPS Tracking | Mixes order list rendering, return RMA forms, timeline steppers, and Socket.IO rider listeners. |
| 4 | `client/src/data/mockProducts.js` | **1,604 lines** | Static Horology Catalog Data | Enormous static JavaScript object array holding 40+ luxury watches. Should be in database. |
| 5 | `client/src/components/inventory/InventoryManagerDashboard.jsx` | **1,495 lines** | Inventory Operations Dashboard | Redundant dashboard parent mixing KPI charts, low stock alerts, warehouse transfer dialogs, and table filters. |
| 6 | `client/src/components/dashboards/modules/CustomerSupportModule.jsx` | **1,239 lines** | Support Concierge & Live Chat | Combines ticket queue, real-time chat bubble UI, customer 360 card, and refund authorization dialog. |
| 7 | `client/src/components/inventory/modules/InventoryStockModule.jsx` | **1,237 lines** | Warehouse Bin & Stock Manager | Inline modal dialogs for stock adjustment, batch transfers, and barcode generation. |
| 8 | `server/src/routes/deliveryRoutes.js` | **1,155 lines** | Delivery Dispatch & Logistics REST API | Overloaded route file containing massive mock database arrays, reporting aggregations, and OTP validation logic. |
| 9 | `client/src/components/dashboards/StoreAdminShopmaxDashboard.jsx` | **1,154 lines** | Store Admin Layout & Navigation Shell | Multiple embedded sub-components, chart views, and redundant state handlers. |
| 10 | `client/src/components/dashboards/modules/DeliveryModule.jsx` | **1,141 lines** | Delivery Manager Fleet Control | Rider roster, live map canvas, consignment status update forms, and attempt logging modals. |
| 11 | `client/src/components/dashboards/modules/ManufacturingHubModule.jsx` | **1,106 lines** | Atelier Watchmaking Hub | Assembly bench schedule, Swiss parts checklist, artisan quality inspection workflow. |
| 12 | `client/src/pages/auth/LoginPage.jsx` | **951 lines** | User Authentication Page | Bundles password login, email OTP login, phone OTP login, role selector, and Google OAuth buttons. |
| 13 | `client/src/components/support/modules/SupportTicketsModule.jsx` | **940 lines** | Support Ticket Queue & Modals | Duplicates ticket list logic from `CustomerSupportModule.jsx`. |
| 14 | `client/src/data/brandsData.js` | **928 lines** | Luxury Brand Metadata | Static brand heritage and collection data. |
| 15 | `client/src/pages/customer/CategoryCatalogPage.jsx` | **899 lines** | Category Catalog Page | Contains duplicate filter and card rendering logic matching `ProductsPage.jsx`. |
| 16 | `client/src/pages/customer/CheckoutPage.jsx` | **890 lines** | Multi-Step Collector Checkout | Shipping address forms, Razorpay script loader, VIP voucher validation, order summary. |
| 17 | `client/src/pages/dashboards/DeliveryManagerDashboardPage.jsx` | **887 lines** | Delivery Manager Page Shell | Redundant layout logic wrapping `DeliveryModule.jsx`. |
| 18 | `client/src/data/supportData.js` | **881 lines** | Static Support FAQ & Knowledge Base | Static articles and canned responses. |
| 19 | `client/src/data/deliveryData.js` | **867 lines** | Static Logistics Data | Mock delivery routes and delivery agent data. |
| 20 | `client/src/components/dashboards/modules/InventoryManagementModule.jsx` | **834 lines** | Inventory Module Wrapper | Redundant code overlapping with `InventoryStockModule.jsx`. |
| 21 | `client/src/pages/customer/CartPage.jsx` | **823 lines** | Shopping Cart Page | Luxury gift box selectors, shipping rates, subtotal calculator, promo validator. |
| 22 | `client/src/pages/customer/TrackParcelPage.jsx` | **810 lines** | Parcel Tracking Page | Overlaps with `CustomerOrdersTrackingPage.jsx`. |

---

## 2. Recommended Component & Service Modularization Plan (Phase 2)

### A. Decomposition of `ProductsManagementModule.jsx` (2,038 lines ➔ 4 Focused Sub-components):
1. `ProductTableList.jsx`: Table rendering, pagination, and search filters (~400 lines).
2. `ProductFormModal.jsx`: Create/Edit form with validation (~450 lines).
3. `ProductVariantMatrix.jsx`: Dial color, strap, and size combination builder (~350 lines).
4. `ProductImageUploader.jsx`: Drag-and-drop image gallery manager (~250 lines).

### B. Decomposition of `POSTerminalModule.jsx` (1,996 lines ➔ 3 Sub-components):
1. `POSProductGrid.jsx`: Visual touch catalog & barcode scanner (~400 lines).
2. `POSCartRegister.jsx`: Active cart, customer assignment, manual discount (~450 lines).
3. `POSReceiptModal.jsx`: Thermal receipt styling & printing logic (~300 lines).

### C. Decomposition of `CustomerSupportModule.jsx` (1,239 lines ➔ 3 Sub-components):
1. `SupportTicketQueue.jsx`: Filterable list of open/pending/escalated tickets (~350 lines).
2. `SupportLiveChatThread.jsx`: Real-time chat stream with canned responses (~400 lines).
3. `Customer360Drawer.jsx`: Customer order history and VIP tier snapshot (~300 lines).

### D. Server Route Decomposition for `deliveryRoutes.js` (1,155 lines ➔ 3 Clean Modules):
1. `server/src/controllers/deliveryController.js`: Pure request/response handlers (~300 lines).
2. `server/src/services/deliveryService.js`: Business logic and database operations (~350 lines).
3. `server/src/routes/deliveryRoutes.js`: Clean Express router registering routes and middleware (~150 lines).

### E. Static Data Decommissioning (`mockProducts.js`, `brandsData.js`, `supportData.js`):
- All 4,000+ lines of static JavaScript data will be migrated into Microsoft SQL Server database seed files (`server/prisma/seed.js`).
