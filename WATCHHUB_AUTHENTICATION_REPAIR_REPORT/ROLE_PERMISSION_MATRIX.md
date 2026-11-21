# WATCHHUB ATELIER — ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSION MATRIX

**Platform:** WatchHub Atelier Horology Architecture  
**Database Authority:** Microsoft SQL Server 2025 (`WatchHubDB`)  
**Middleware Enforcement:** `server/src/middleware/auth.js` (`authenticate`, `authorizeRoles`, `checkPermission`)  
**Frontend Guard:** `client/src/routes/ProtectedRoute.jsx` (`ProtectedRoute`, `RoleProtectedRoute`, `getRoleDashboardPath`)  

---

## 1. OFFICIAL ROLE DISCOVERY

From `dbo.Roles` and `server/prisma/schema.prisma`, 7 primary roles exist in the WatchHub Atelier architecture:

1. **Super Admin** (`roleName: 'Super Admin'`)
2. **Store Admin** (`roleName: 'Store Admin'`)
3. **Inventory Manager** (`roleName: 'Inventory Manager'`)
4. **Delivery Manager** (`roleName: 'Delivery Manager'`)
5. **Delivery Partner** (`roleName: 'Delivery Partner'`)
6. **Customer Support Executive** (`roleName: 'Customer Support Executive'`)
7. **Customer** (`roleName: 'Customer'`)

---

## 2. ROLE-TO-DASHBOARD & PERMISSION MATRIX

| Role Name | Seeded Test Account | Primary Dashboard Path | Authorized Modules & Routes | Disallowed Modules (Blocked) |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@watchhub.com` | `/super-admin/dashboard` | All system modules (`['all']`), System Releases (`/super-admin/releases`), POS, Warehouses, Logs, System Settings | None (Full Atelier Authority) |
| **Store Admin** | `admin@watchhub.com` | `/store-admin/dashboard` | Products (`/admin/products`), POS (`/store-admin/pos`), Categories, Offers, Store Inventory (`/store-admin/inventory`), Store Deliveries (`/store-admin/delivery`) | Super Admin System Settings, Global Release Manager |
| **Inventory Manager** | `inventory@watchhub.com` | `/inventory-manager/dashboard` | 11 Modules: Stock Overview, Inventory, Movements, Adjustments, Warehouses, Reorder Alerts, Purchase Requests, Reports, History, Settings | Customer Orders Management, Payment Gateway Configuration, Store POS |
| **Delivery Manager** | `delivery@watchhub.com` | `/delivery-manager/dashboard` | 11 Modules: Dispatch Orders, Rider Assignment, Live GPS Tracking, Fleet Partners, Delivery Routes, Delivery Attempts, Returns, Reports, Areas, Settings | Product Pricing, Inventory Purchase Approvals, User Role Administration |
| **Delivery Partner** | `rider@watchhub.com` / `rohan.singh@watchhub.com` | `/delivery-partner/dashboard` | Assigned Parcels, Live Turn-by-Turn GPS Navigation, Order Delivery Completion, Customer OTP Delivery Verification | Admin Portals, Inventory Management, Storewide Order Editing |
| **Customer Support** | `support@watchhub.com` | `/customer-support/dashboard` | 12 Modules: Tickets, Live Chat, Customer Lookup, Orders & Returns Lookup, Refunds, Escalations, Knowledge Base, Canned Responses, Reports, Team, Settings | Product Inventory Adjustments, Delivery Route Planning, Database Administration |
| **Customer** | `customer@watchhub.com` | `/customer/dashboard` | Storefront (`/`), Luxury Catalog (`/products`), Watch Customizer (`/customize-watch`), Cart (`/cart`), Checkout (`/checkout`), Wishlist (`/wishlist`), Order History & Tracking (`/orders`) | All Administrative & Operations Dashboards (`/store-admin/*`, `/super-admin/*`, `/inventory-manager/*`, `/delivery-manager/*`, `/customer-support/*`) |

---

## 3. SECURITY & ESCALATION CONTROLS

1. **Horizontal Privilege Escalation (User vs User):**
   - Customer orders and cart APIs strictly filter by `req.user.id` resolved from verified JWT.
   - A customer cannot view or modify another customer's orders or profile by tampering with route parameters.

2. **Vertical Privilege Escalation (Role vs Role):**
   - The user role is resolved exclusively on the server from `dbo.UserRoles` in SQL Server.
   - Public customer signup endpoint (`POST /api/auth/register`) strictly assigns the `Customer` role and ignores any client-supplied role parameter.
   - Protected dashboard routes (`RoleProtectedRoute`) verify the JWT token role and reject unauthorized access, redirecting unauthorized users back to `/login` or their authorized home.
