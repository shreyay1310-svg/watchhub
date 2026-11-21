# WATCHHUB ATELIER — DATABASE ROLE CONSISTENCY

## 1. Relational Integrity in Microsoft SQL Server 2025

- **Database**: `WatchHubDB`
- **Tables**: `Users`, `Roles`, `UserRoles`, `Permissions`, `RolePermissions`
- **Foreign Keys**:
  - `UserRoles.UserId` -> `Users.UserId` (ON DELETE CASCADE)
  - `UserRoles.RoleId` -> `Roles.RoleId` (ON DELETE NO ACTION)
  - `RolePermissions.RoleId` -> `Roles.RoleId` (ON DELETE CASCADE)
  - `RolePermissions.PermissionId` -> `Permissions.PermissionId` (ON DELETE CASCADE)

## 2. Seed Accounts Integrity Verification
Every primary role has a dedicated seed user in `WatchHubDB` verified with bcrypt hash for `Admin@123`:

- `superadmin@watchhub.com` -> Role: `Super Admin` (ID 1)
- `admin@watchhub.com` -> Role: `Store Admin` (ID 2)
- `inventory@watchhub.com` -> Role: `Inventory Manager` (ID 3)
- `delivery@watchhub.com` -> Role: `Delivery Manager` (ID 4)
- `support@watchhub.com` -> Role: `Customer Support Executive` (ID 5)
- `customer@watchhub.com` -> Role: `Customer` (ID 6)
- `rider@watchhub.com` -> Role: `Delivery Partner` (ID 7)
- `rohan.singh@watchhub.com` -> Role: `Delivery Partner` (ID 7)
