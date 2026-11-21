# 8. AUDIT & SECURITY REPORT

## Security Audit Trail Architecture
- **Storage**: Microsoft SQL Server `AuditLogs` table.
- **Attributes Tracked**:
  - `AuditId`: Monotonic BigInt identifier.
  - `Action`: Upper-case event descriptor (`STAFF_MEMBER_CREATED`, `USER_ACCOUNT_ACTIVATED`, `USER_ACCOUNT_DEACTIVATED`).
  - `ModuleName`: Calling module identifier (`SuperAdminUsers`).
  - `TargetEntityId`: Identifier of affected user or entity.
  - `DetailsJson`: Structured payload parameters.
  - `IpAddress`: Network origin IP address.
  - `CreatedAt`: UTC timestamp.
- **Data Protection**:
  - Passwords, tokens, OTPs, and payment secrets are strictly excluded and never persisted to audit logs.
