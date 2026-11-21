# WATCHHUB ATELIER — ROLE TO DASHBOARD MAPPING

## 1. Dedicated Dashboard Route Architecture

Each of the 7 authenticated roles has its own exclusive dashboard URL, layout, and component tree:

| Role Name | Primary Route | Permitted Route Scope | Primary Layout / Page Component |
|---|---|---|---|
| **Customer** | `/customer/dashboard` | `/customer/*`, `/account`, `/orders`, `/cart`, `/checkout` | `CustomerAccountPage.jsx` |
| **Store Admin** | `/store-admin/dashboard` | `/store-admin/*`, `/admin/products`, `/pos` | `RoleDashboard.jsx` (StoreAdminShopmaxDashboard) |
| **Super Admin** | `/super-admin/dashboard` | `/super-admin/*`, `/admin/releases` | `SuperAdminDashboardPage.jsx` |
| **Inventory Manager** | `/inventory-manager/dashboard` | `/inventory-manager/*`, `/inventory` | `InventoryManagerDashboardPage.jsx` (11 Modules) |
| **Delivery Manager** | `/delivery-manager/dashboard` | `/delivery-manager/*`, `/delivery` | `DeliveryManagerDashboardPage.jsx` (11 Modules) |
| **Delivery Partner** | `/delivery-partner/dashboard` | `/delivery-partner/*` | `DeliveryPartnerDashboardPage.jsx` |
| **Customer Support Executive** | `/customer-support/dashboard` | `/customer-support/*` | `CustomerSupportDashboardPage.jsx` |
