# WATCHHUB ATELIER — ADMIN RBAC REPORT

This report details the role-based access control (RBAC) security enforcement across WatchHub's 5 operational administrative dashboards.

---

### 1. Role Definitions & Permissions

WatchHub enforces 7 distinct roles stored in the Microsoft SQL Server `Roles` table:
1. `SUPER_ADMIN`: Unrestricted global system management, audit access, financial metrics.
2. `STORE_ADMIN`: Store-level operations, POS sales processing, daily revenue.
3. `INVENTORY_MANAGER`: Stock inbound/outbound adjustments, warehouse management, reorder points.
4. `DELIVERY_PARTNER`: Consignment dispatch, route optimization, delivery status update.
5. `CUSTOMER_SUPPORT`: Customer ticketing, dispute management, return and refund approvals.
6. `CUSTOMER`: E-commerce catalog browsing, order placement, personal account management.
7. `GUEST`: Read-only public catalog browsing.

---

### 2. Operational Dashboard Verification

| Dashboard | Target URL | Authorized Role | Metric Verified | Screenshot Proof |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `/dashboard/super-admin` | `SUPER_ADMIN` | Gross Revenue: ₹44,76,397, 33 Watches, 9 System Users. | [01_super_admin_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/01_super_admin_dashboard.png) |
| **Store Admin** | `/dashboard/store-admin` | `STORE_ADMIN` | Daily sales, retail store shift management, terminal launcher. | [02_store_admin_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/02_store_admin_dashboard.png) |
| **Inventory** | `/inventory` | `INVENTORY_MANAGER` | 36 warehouse stock allocations, restock threshold triggers. | [03_inventory_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/03_inventory_dashboard.png) |
| **Delivery** | `/delivery` | `DELIVERY_PARTNER` | Real-time rider GPS tracking, active courier partner routes. | [04_delivery_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/04_delivery_dashboard.png) |
| **Support** | `/support` | `CUSTOMER_SUPPORT` | 6 Open client tickets, dispute mediation, refund processing. | [05_support_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/05_support_dashboard.png) |

---

### 3. Security Boundary & Privilege Escalation Tests

The automated security test suite verified server-side middleware enforcement (`authorizeRole` / `requirePermission`):

```bash
# Automated Test TC_P7_012: Customer attempts Super Admin KPI access
GET /api/dashboard/super-admin
Authorization: Bearer <Customer_JWT_Token>
HTTP/1.1 403 Forbidden
{"status":"fail","message":"Access denied: insufficient permissions for this resource."}

# Automated Test TC_P7_013: Customer attempts stock modification
POST /api/inventory/add-stock
Authorization: Bearer <Customer_JWT_Token>
HTTP/1.1 403 Forbidden
{"status":"fail","message":"Access denied: insufficient permissions for this resource."}
```

- **Unauthenticated Requests**: Blocked with `HTTP 401 Unauthorized`.
- **Cross-Role Tampering**: Blocked with `HTTP 403 Forbidden`.
- **JWT Tampering**: HMAC signature validation failures rejected immediately without database query.
