# WATCHHUB ATELIER — BACKEND PERMISSION AUDIT

## 1. API Security Guards
- **`authenticate` Middleware**: Enforces signed JWT verification from `Authorization: Bearer <token>`.
- **`requireRole` Guard**: Restricts sensitive administrative and staff endpoints to explicitly authorized roles.
- **Granular Database Permissions**:
  - `Super Admin`: `all`
  - `Store Admin`: `manage_products`, `manage_orders`, `view_analytics`, `manage_discounts`
  - `Inventory Manager`: `manage_stock`, `receive_shipments`, `update_low_stock`, `view_reports`
  - `Delivery Manager`: `assign_courier`, `update_tracking`, `manage_returns`, `confirm_dispatch`
  - `Customer Support Executive`: `view_tickets`, `resolve_complaints`, `initiate_refund`, `live_chat`
  - `Customer`: `shop`, `review`, `track_orders`, `wishlist`
  - `Delivery Partner`: `update_tracking`, `confirm_delivery`, `verify_otp`
