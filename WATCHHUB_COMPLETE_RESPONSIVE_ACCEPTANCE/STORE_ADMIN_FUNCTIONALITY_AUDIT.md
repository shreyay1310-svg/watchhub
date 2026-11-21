# STORE ADMIN FUNCTIONALITY AUDIT

## 1. Module Verification Matrix

| Module ID | Module Label | Frontend Component | Database Operations | Real API Endpoint | Status |
|---|---|---|---|---|---|
| `dashboard` | Dashboard Overview | `StoreAdminShopmaxDashboard.jsx` | Read KPIs, Top Watches, Recent Orders | `GET /api/store-admin/overview` | **VERIFIED** |
| `pos` | POS Terminal | `POSTerminalModule.jsx` | Create in-store invoice, update stock | `POST /api/store-admin/pos/checkout` | **VERIFIED** |
| `orders` | Orders Management | `OrdersManagementModule.jsx` | Read order records, update status | `GET /api/orders`, `PUT /api/orders/:id` | **VERIFIED** |
| `products` | Products Catalog | `ProductsManagementModule.jsx` | Create, edit, list, filter watches | `GET/POST /api/products` | **VERIFIED** |
| `categories` | Categories & Brands | `CategoriesBrandsModule.jsx` | Create/edit luxury brands and categories | `GET/POST /api/categories` | **VERIFIED** |
| `customers` | Customers | `CustomerSupportModule.jsx` (Sub-view) | Read registered collector profiles | `GET /api/users?role=Customer` | **VERIFIED** |
| `inventory` | Inventory | `InventoryManagementModule.jsx` | Read stock levels, adjust warehouse units | `GET /api/inventory` | **VERIFIED** |
| `offers` | Offers & Coupons | `OffersCouponsModule.jsx` | Create coupons, set discount percentages | `GET/POST /api/offers` | **VERIFIED** |
| `banners` | Banners & Promotions | `BannersPromotionsModule.jsx` | Manage promotional hero media | `GET/POST /api/banners` | **VERIFIED** |
| `reviews` | Reviews & Ratings | `ReviewsRatingsModule.jsx` | Approve customer horology ratings | `GET /api/reviews` | **VERIFIED** |
| `reports` | Reports & Analytics | `ReportsAnalyticsModule.jsx` | Aggregate revenue by category | `GET /api/store-admin/reports` | **VERIFIED** |
| `manufacturing_hub` | Manufacturing Hub | `ManufacturingHubModule.jsx` | Assembly and craftsmanship tracking | `GET /api/manufacturing/orders` | **VERIFIED** |
| `releases` | Release Management | `ReleaseManagementModule.jsx` | Inspect platform versions and APK OTA | `GET /api/releases` | **VERIFIED** |
| `settings` | Store Settings | `SettingsAuditModule.jsx` | Store operating hours, audit logs | `GET/POST /api/settings` | **VERIFIED** |

## 2. Global Actions
- **Global Search**: Search bar in top navbar dynamically filters products, orders, and customers.
- **Top Navbar Logout**: Instant purge of tokens and redirect to `/login`.
- **Modals**: Add Product modal, POS Checkout modal, and View Order details modal fit within viewports.
