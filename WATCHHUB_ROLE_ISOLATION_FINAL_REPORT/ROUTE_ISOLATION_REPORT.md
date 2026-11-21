# WATCHHUB ATELIER — ROUTE ISOLATION REPORT

## 1. Centralized Route Registry in AppRoutes.jsx

All protected routes are mapped with strict role arrays enforced by `RoleProtectedRoute`:

- `/customer/*` -> Requires `[ROLES.CUSTOMER, 'Customer', ROLES.SUPER_ADMIN, 'Super Admin']`
- `/store-admin/*` -> Requires `[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']`
- `/super-admin/*` -> Requires `[ROLES.SUPER_ADMIN, 'Super Admin']`
- `/inventory-manager/*` -> Requires `[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']`
- `/delivery-manager/*` -> Requires `[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']`
- `/delivery-partner/*` -> Requires `[ROLES.DELIVERY_PARTNER, 'Delivery Partner', ROLES.SUPER_ADMIN, 'Super Admin']`
- `/customer-support/*` -> Requires `[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', ROLES.SUPER_ADMIN, 'Super Admin']`

---

## 2. Elimination of Cross-Role Bouncing
- Fixed `fromPath` bouncing in `LoginPage.jsx`:
  - `location.state.from` was previously redirecting Store Admin to `/customer/dashboard` after a previous Customer logout.
  - Restricted `fromPath` so that dashboard routes are never preserved across role boundaries. Logging in as any role navigates directly to that role's primary authorized dashboard.
