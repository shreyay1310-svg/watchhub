# WATCHHUB ATELIER — ROLE TO DASHBOARD MAPPING

## 1. Dedicated Dashboard Route Architecture

Each of the 7 authenticated roles has its own exclusive dashboard URL and layout structure:

| Role Name | Primary Route | Permitted Route Scope | Primary Layout / Page Component |
|---|---|---|---|
| **Customer** | `/customer/dashboard` | `/customer/*`, `/account`, `/orders`, `/cart`, `/checkout` | `CustomerAccountPage.jsx` |
| **Store Admin** | `/store-admin/dashboard` | `/store-admin/*`, `/admin/products`, `/pos` | `RoleDashboard.jsx` (StoreAdminShopmaxDashboard) |
| **Super Admin** | `/super-admin/dashboard` | `/super-admin/*`, `/admin/releases` | `RoleDashboard.jsx` (SuperAdmin Releases & Platform Control) |
| **Inventory Manager** | `/inventory-manager/dashboard` | `/inventory-manager/*`, `/inventory` | `InventoryManagerDashboardPage.jsx` (11 Modules) |
| **Delivery Manager** | `/delivery-manager/dashboard` | `/delivery-manager/*`, `/delivery` | `DeliveryManagerDashboardPage.jsx` (11 Modules) |
| **Delivery Partner** | `/delivery-partner/dashboard` | `/delivery-partner/*` | `DeliveryPartnerDashboardPage.jsx` |
| **Customer Support Executive** | `/customer-support/dashboard` | `/customer-support/*` | `CustomerSupportDashboardPage.jsx` |

---

## 2. Dispatcher Logic
In `client/src/routes/ProtectedRoute.jsx`:
```javascript
export const getRoleDashboardPath = (role) => {
  const norm = (role || '').trim().toLowerCase();
  if (norm === 'super admin' || norm === 'super_admin') return '/super-admin/dashboard';
  if (norm === 'store admin' || norm === 'store_admin') return '/store-admin/dashboard';
  if (norm === 'inventory manager' || norm === 'inventory_manager') return '/inventory-manager/dashboard';
  if (norm === 'delivery manager' || norm === 'delivery_manager') return '/delivery-manager/dashboard';
  if (norm === 'delivery partner' || norm === 'delivery_partner') return '/delivery-partner/dashboard';
  if (norm.includes('support')) return '/customer-support/dashboard';
  return '/customer/dashboard';
};
```
