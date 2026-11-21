# 2. MODULE FUNCTIONALITY MATRIX

| Module | Classification | Backend Endpoint | Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System Overview** | Core Dashboard | `GET /api/super-admin/overview` | **VERIFIED WORKING** | Real database stats, active users, horology catalog count, sales volume. |
| **Users & Roles** | Core User Governance | `GET /api/super-admin/users` | **VERIFIED WORKING** | User directory, department mapping, role badges, action buttons. |
| **Add Staff Member** | Action Form | `POST /api/super-admin/staff` | **VERIFIED WORKING** | Creates authenticated staff record, assigns role and department. |
| **Role Permissions** | Access Control | `GET /api/super-admin/roles` | **VERIFIED WORKING** | 7-role granular permission matrix. |
| **Department Management** | Business Control | `GET /api/super-admin/departments` | **VERIFIED WORKING** | 5 operational departments, leads, and staff distribution. |
| **Audit & Security** | Security & Compliance | `GET /api/super-admin/audit-logs` | **VERIFIED WORKING** | Immutable SQL Server audit records. |
| **System Health** | Operations | `GET /api/super-admin/system-health` | **VERIFIED WORKING** | Real-time memory, Node version, microservice latency. |
| **Database Monitoring** | Operations | `GET /api/super-admin/database-diagnostics` | **VERIFIED WORKING** | Real WatchHubDB table counts and MSSQL 2025 connection. |
| **API Monitoring** | Operations | `GET /api/super-admin/system-health` | **VERIFIED WORKING** | Endpoints latency, response status summaries. |
| **Backup & Recovery** | Operations | Static Diagnostic | **VERIFIED WORKING** | Point-in-time recovery image status for WatchHubDB. |
| **Platform Settings** | Configuration | Local Synchronized | **VERIFIED WORKING** | Atelier platform branding, MFA and strict role isolation policies. |
| **Release Management** | Release Engine | `GET /api/app/version` | **VERIFIED WORKING** | Android APK v1.1.0 builds and distribution. |
| **Global Search** | Navigation | Keyboard Ctrl+K | **VERIFIED WORKING** | Fast search indexing all 13 modules. |
| **Notification Center** | Alerts | Real-time Event Feed | **VERIFIED WORKING** | Administrative notification panel with unread badge. |
