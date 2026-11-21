# 15. BACKEND API MATRIX

| Route | HTTP Verb | Middleware | Controller Action | Test Status |
| :--- | :--- | :--- | :--- | :--- |
| `/api/super-admin/overview` | `GET` | `authenticate`, `authorizeRoles('Super Admin')` | `getSuperAdminOverview` | **VERIFIED (200)** |
| `/api/super-admin/users` | `GET` | `authenticate`, `authorizeRoles('Super Admin')` | `getUsersAndRoles` | **VERIFIED (200)** |
| `/api/super-admin/staff` | `POST` | `authenticate`, `authorizeRoles('Super Admin')` | `createStaffMember` | **VERIFIED (201)** |
| `/api/super-admin/users/:userId/status` | `PUT` | `authenticate`, `authorizeRoles('Super Admin')` | `toggleUserStatus` | **VERIFIED (200)** |
| `/api/super-admin/users/:userId/role` | `PUT` | `authenticate`, `authorizeRoles('Super Admin')` | `updateUserRole` | **VERIFIED (200)** |
| `/api/super-admin/roles` | `GET` | `authenticate`, `authorizeRoles('Super Admin')` | `getRolesAndPermissions` | **VERIFIED (200)** |
| `/api/super-admin/departments` | `GET` | `authenticate`, `authorizeRoles('Super Admin')` | `getDepartmentsList` | **VERIFIED (200)** |
| `/api/super-admin/audit-logs` | `GET` | `authenticate`, `authorizeRoles('Super Admin')` | `getAuditLogs` | **VERIFIED (200)** |
| `/api/super-admin/database-diagnostics` | `GET` | `authenticate`, `authorizeRoles('Super Admin')` | `getDatabaseDiagnostics` | **VERIFIED (200)** |
| `/api/super-admin/system-health` | `GET` | `authenticate`, `authorizeRoles('Super Admin')` | `getSystemHealth` | **VERIFIED (200)** |
