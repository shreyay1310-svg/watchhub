# ALL EXISTING ROLES IN WATCHHUB ATELIER

## 1. Discovered Database Roles (SQL Server WatchHubDB)
Audited directly against Microsoft SQL Server 2025 (`127.0.0.1:1433`) via Prisma ORM:

| Role ID | Database Role Name | Assigned Active Accounts | Description & Authority Scope |
|---|---|---|---|
| **1** | **Super Admin** | `superadmin@watchhub.com` (Vikram Malhotra) | Unrestricted system-wide governance, infrastructure telemetry, database roles, OTA releases |
| **2** | **Store Admin** | `admin@watchhub.com` (Aanya Singhania) | Store operations, product catalog, orders, promotions, reviews, POS terminal, inventory |
| **3** | **Inventory Manager** | `inventory@watchhub.com` (Rajesh Mehta) | Stock replenishment, warehouse logistics, low-stock reorder thresholds, audit movements |
| **4** | **Delivery Manager** | `delivery@watchhub.com` (Karan Verma) | Order dispatch, fulfillment, courier assignment, live shipment tracking, returns |
| **5** | **Customer Support Executive** | `support@watchhub.com` (Pooja Sharma) | Ticketing helpdesk, escalation matrix, live chat, customer profiles, refunds |
| **6** | **Customer** | `customer@watchhub.com` (Arjun Kapoor) + 8 verified accounts | Luxury horology storefront, cart, dummy checkout, order history, wishlist, warranty |
| **7** | **Delivery Partner** | `rider@watchhub.com` (Rohan Singh) + 3 riders | Last-mile delivery portal, assigned orders, OTP verification, delivery completion |

## 2. Integrity Verification
- **Zero invented, merged, or renamed roles**: All 7 roles reflect the canonical SQL Server `Role` and `User` tables.
- **Authentication**: JWT cryptographic tokens are issued by `POST /api/auth/login` and verified by `GET /api/auth/me`.
