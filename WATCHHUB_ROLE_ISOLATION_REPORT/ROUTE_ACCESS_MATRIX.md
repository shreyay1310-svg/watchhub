# WATCHHUB ATELIER — ROUTE ACCESS MATRIX

| Route Path | Customer | Store Admin | Inventory Manager | Delivery Manager | Delivery Partner | Customer Support | Super Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/customer/dashboard` | **ALLOW** | Access Denied | Access Denied | Access Denied | Access Denied | Access Denied | **ALLOW** |
| `/store-admin/dashboard` | Access Denied | **ALLOW** | Access Denied | Access Denied | Access Denied | Access Denied | **ALLOW** |
| `/inventory-manager/dashboard` | Access Denied | Access Denied | **ALLOW** | Access Denied | Access Denied | Access Denied | **ALLOW** |
| `/delivery-manager/dashboard` | Access Denied | Access Denied | Access Denied | **ALLOW** | Access Denied | Access Denied | **ALLOW** |
| `/delivery-partner/dashboard` | Access Denied | Access Denied | Access Denied | Access Denied | **ALLOW** | Access Denied | **ALLOW** |
| `/customer-support/dashboard` | Access Denied | Access Denied | Access Denied | Access Denied | Access Denied | **ALLOW** | **ALLOW** |
| `/super-admin/dashboard` | Access Denied | Access Denied | Access Denied | Access Denied | Access Denied | Access Denied | **ALLOW** |
