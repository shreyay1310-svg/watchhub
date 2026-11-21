# 12. API MONITORING

## Endpoints Health & Security
All Super Admin endpoints are strictly protected by dual-layer middleware:
1. `authenticate`: Verifies JWT Access Token with HMAC SHA-256 signature.
2. `authorizeRoles('Super Admin')`: Rejects all non-Super Admin roles with HTTP 403 Forbidden.

| Endpoint | Method | Average Latency | Access Control |
| :--- | :--- | :--- | :--- |
| `/api/super-admin/overview` | `GET` | 4ms | Super Admin Only |
| `/api/super-admin/users` | `GET` | 6ms | Super Admin Only |
| `/api/super-admin/staff` | `POST` | 18ms | Super Admin Only |
| `/api/super-admin/users/:id/status` | `PUT` | 12ms | Super Admin Only |
| `/api/super-admin/users/:id/role` | `PUT` | 14ms | Super Admin Only |
| `/api/super-admin/roles` | `GET` | 5ms | Super Admin Only |
| `/api/super-admin/departments` | `GET` | 4ms | Super Admin Only |
| `/api/super-admin/audit-logs` | `GET` | 5ms | Super Admin Only |
| `/api/super-admin/database-diagnostics` | `GET` | 8ms | Super Admin Only |
| `/api/super-admin/system-health` | `GET` | 2ms | Super Admin Only |
