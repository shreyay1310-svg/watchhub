# 3. USER & ROLE MANAGEMENT

## Overview
All user accounts and role assignments are backed by Microsoft SQL Server (`WatchHubDB`) via Prisma ORM:
- **Database Tables**: `Users`, `Roles`, `UserRoles`
- **Security Guard**: Password hashes computed using `bcryptjs` with salt rounds = 10.
- **Role Isolation**: 7 canonical database roles strictly maintained without merging.

## Operations Implemented & Tested
1. **User Discovery & Filtering**:
   - Filter by canonical roles: `Super Admin`, `Store Admin`, `Inventory Manager`, `Delivery Manager`, `Customer Support Executive`, `Delivery Partner`, `Customer`.
   - Filter by operational departments.
   - Filter by account status (`Active` / `Inactive`).
2. **Account Status Toggle**:
   - `PUT /api/super-admin/users/:userId/status`
   - Real-time status update with immediate database commit.
   - Guard: Super Admin accounts cannot be deactivated.
3. **Role Re-assignment**:
   - `PUT /api/super-admin/users/:userId/role`
   - Replaces user role mapping safely without data corruption.
4. **Audit Trail**:
   - Every status change and role change is logged to the `AuditLog` table.
