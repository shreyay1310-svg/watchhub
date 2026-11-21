# WATCHHUB ATELIER — BACKEND AUTHORIZATION AUDIT

## 1. Authentication Middleware & Security Guards

All protected backend APIs verify cryptographic JWTs via `server/src/middleware/auth.js`:

### A. `authenticate` Middleware
- Extracts `Bearer <token>` from HTTP `Authorization` header.
- Decodes and verifies token signature using `JWT_ACCESS_SECRET`.
- Verifies that `req.user` contains `id`, `email`, and `role`.

### B. `requireRole(...roles)` Guard
- Rejects any request where `req.user.role` is not explicitly in `roles` (with Super Admin bypass).
- Returns HTTP 403 Forbidden: `{ status: 'fail', message: 'Access denied: insufficient permissions.' }`.

### C. `requirePermission(...permissions)` Guard
- Inspects user's granular database permissions (e.g. `manage_stock`, `view_tickets`).
- Rejects missing permissions with HTTP 403 Forbidden.

### D. Account Active Status Guard
- Inspects `user.isActive` in database before granting access or issuing tokens.
