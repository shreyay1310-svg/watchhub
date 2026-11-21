# 4. PERMISSION MATRIX

## Canonical Roles & Authority Scopes
1. **Super Admin (Role ID: 1)**:
   - Authority: Unrestricted system-wide governance.
   - Access: All 13 command modules, security audit logs, database diagnostics, role management.
2. **Store Admin (Role ID: 2)**:
   - Authority: E-Commerce store operations, luxury catalog, orders, and promotions.
3. **Inventory Manager (Role ID: 3)**:
   - Authority: Stock control, warehouse operations, procurement requests.
4. **Delivery Manager (Role ID: 4)**:
   - Authority: Logistics dispatch, delivery partner assignment, tracking.
5. **Customer Support Executive (Role ID: 5)**:
   - Authority: Ticketing, customer support resolutions, order inquiries.
6. **Customer (Role ID: 6)**:
   - Authority: Retail consumer, shopping, cart, orders, wishlist.
7. **Delivery Partner (Role ID: 7)**:
   - Authority: Mobile rider portal, delivery status updates, GPS location pings.

## Granular Action Permissions
- `VIEW_DASHBOARD`: Access role-specific dashboard.
- `MANAGE_INVENTORY`: Create, update, or adjust watch products.
- `PROCESS_ORDERS`: Transition order status through fulfillment pipeline.
- `SUPPORT_TICKETS`: Respond to customer inquiries.
- `AUDIT_LOGS_VIEW`: Inspect operational logs.
- `MANAGE_USERS`: Create, modify, and assign staff members.
