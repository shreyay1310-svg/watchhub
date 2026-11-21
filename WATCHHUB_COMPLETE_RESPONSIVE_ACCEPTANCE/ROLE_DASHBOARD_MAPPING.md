# ROLE DASHBOARD & MODULE ROUTING MAPPING

## 1. Dedicated Portal Layouts and Routes

| Role | Primary Route | Layout Component | Sidebar Component | Header Component |
|---|---|---|---|---|
| **Super Admin** | `/super-admin/dashboard` | `SuperAdminDashboardPage` | Integrated Collapsible Aside | Super Admin Command Header |
| **Store Admin** | `/store-admin/dashboard` | `RoleDashboard` | Shopmax Sidebar (14 items) | Shopmax Navbar + Top Nav |
| **Inventory Manager** | `/inventory-manager/dashboard` | `InventoryManagerLayout` | `InventoryManagerSidebar` | `InventoryManagerHeader` |
| **Delivery Manager** | `/delivery-manager/dashboard` | `DeliveryManagerLayout` | `DeliveryManagerSidebar` | `DeliveryManagerHeader` |
| **Customer Support** | `/customer-support/dashboard` | `CustomerSupportLayout` | `CustomerSupportSidebar` | `CustomerSupportHeader` |
| **Delivery Partner** | `/delivery-partner/dashboard` | `RoleDashboard` / Partner | Mobile Quick-Fulfillment Aside | Rider Top Header |
| **Customer** | `/customer/dashboard` & `/` | Storefront Layout | `CustomerDrawer` (Mobile) | Luxury Minimalist Header |

## 2. Guard Protection
Each route is wrapped in `<RoleProtectedRoute allowedRoles={[...]}>`. Direct unauthorized browser URL navigation is instantly intercepted and displays the role-authorized redirect or luxury access denied screen.
