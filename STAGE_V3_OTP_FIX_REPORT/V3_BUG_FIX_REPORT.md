# V3 BUG FIX REPORT
## Resolved Vulnerabilities & Architectural Defects

| Bug / Finding ID | Severity | Component | Root Cause Description | Resolution Implemented |
|---|---|---|---|---|
| **BUG-V3-001** | **CRITICAL** | `otpService.js` | Single-instance in-memory lock (`Set`) failed across multi-instance clusters; delayed SMTP could activate expired reservations. | Implemented distributed `DispatchToken` (UUID) with conditional SQL atomic update (`WHERE DispatchToken = @token`). |
| **BUG-V3-002** | **HIGH** | `schema.prisma` / SQL Server | Inconsistent compound unique selector naming prevented atomic compound upserts in Prisma Client. | Standardized `@@unique([identifier, purpose], name: "identifier_purpose", map: "UQ_OTPVerifications_Identifier_Purpose")`. |
| **BUG-V3-003** | **HIGH** | `otpService.js` | `===` string equality comparison exposed hash validation to timing side-channel attacks. | Implemented `crypto.timingSafeEqual()` with strict 32-byte length validation. |
| **BUG-V3-004** | **HIGH** | `server.js` | Shutdown sequence severed database connections without waiting for background cleanup batch completion. | Implemented `otpCleanupWorker.stop()` with `inFlightPromise` drain and wired `SIGTERM`/`SIGINT` handlers. |
| **BUG-V3-005** | **MEDIUM** | `otpService.js` | Fallback to `JWT_ACCESS_SECRET` coupled independent security mechanisms. | Removed JWT fallback; introduced `OTP_HASH_SECRET_CURRENT` and `OTP_HASH_SECRET_PREVIOUS`. |
| **BUG-V3-006** | **MEDIUM** | SQL Server Cleanup | Unbounded bulk deletion risked table-level lock escalation on busy production databases. | Parameterized `DELETE TOP (500)` with 50ms inter-batch yield delay. |
