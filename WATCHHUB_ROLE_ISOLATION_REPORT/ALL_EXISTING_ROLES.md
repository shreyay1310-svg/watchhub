# WATCHHUB ATELIER — DISCOVERED DATABASE ROLES

## 1. Overview
Audit performed on Microsoft SQL Server 2025 `WatchHubDB` via Prisma ORM schema and database queries. Exactly **7 roles** exist. There are no `Seller`, `Vendor`, or arbitrary roles.

---

## 2. Exhaustive Role Registry

| Role ID | Role Name | System Code | Permitted Privileges | Seed / Primary User |
|---|---|---|---|---|
| **1** | **Super Admin** | `super_admin` | `all` (Full platform administrative privileges) | `superadmin@watchhub.com` |
| **2** | **Store Admin** | `store_admin` | `manage_products`, `manage_orders`, `view_analytics`, `manage_discounts` | `admin@watchhub.com` |
| **3** | **Inventory Manager** | `inventory_manager` | `manage_stock`, `receive_shipments`, `update_low_stock`, `view_reports` | `inventory@watchhub.com` |
| **4** | **Delivery Manager** | `delivery_manager` | `assign_courier`, `update_tracking`, `manage_returns`, `confirm_dispatch` | `delivery@watchhub.com` |
| **5** | **Customer Support Executive** | `customer_support` | `view_tickets`, `resolve_complaints`, `initiate_refund`, `live_chat` | `support@watchhub.com` |
| **6** | **Customer** | `customer` | `shop`, `review`, `track_orders`, `wishlist` | `customer@watchhub.com` |
| **7** | **Delivery Partner** | `delivery_partner` | `update_tracking`, `confirm_delivery`, `verify_otp` | `rider@watchhub.com`, `rohan.singh@watchhub.com` |

---

## 3. Database Schema Verification
- **Table**: `dbo.Roles`
- **Columns**: `RoleId` (INT, PK), `RoleName` (NVARCHAR(50)), `Description` (NVARCHAR(255)), `CreatedAt` (DATETIME2)
- **Relationship**: M:N mapped via `dbo.UserRoles` (`UserId` -> `RoleId`).
