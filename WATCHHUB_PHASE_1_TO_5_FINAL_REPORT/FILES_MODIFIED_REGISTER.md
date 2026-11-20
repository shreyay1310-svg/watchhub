# WatchHub — Files Modified & Created Register

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/FILES_MODIFIED_REGISTER.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Software Architect  

---

## 1. Register of Core Modified Files

All source files comply with the project constraint: **$\le 800$ lines per file**.

| File Path | Type | Line Count | Key Modification Applied |
| :--- | :---: | :---: | :--- |
| `package.json` | Configuration | 51 | Added `resend`, `nodemailer`, `razorpay`, `socket.io`, `prisma` to root runtime dependencies. |
| `package-lock.json` | Lockfile | Synchronized | Locked verified package dependency tree. |
| `server/prisma/schema.prisma` | Schema | 429 | Added `binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]`, V3 columns (`dispatchToken`, `dispatchState`, `dispatchLockedUntil`), compound unique constraint `UQ_OTPVerifications_Identifier_Purpose`. |
| `server/src/services/otpService.js` | Backend Service | 582 | V3 distributed lease architecture, dynamic secret getters, constant-time `crypto.timingSafeEqual`, atomic single-use consumption. |
| `server/src/services/otpCleanupWorker.js`| Backend Service | 231 | Self-chaining batch worker, bounded exponential backoff on SQL deadlock 1205, graceful `stop(timeoutMs)` method. |
| `server/src/routes/productRoutes.js`| Backend Routes | 45 | Added explicit `/categories` and `/brands` endpoints to query SQL Server taxonomies before `/:id`. |
| `server/src/server.js` | Server Entry | 148 | Wired graceful drain (`server.close() -> await otpCleanupWorker.stop() -> await disconnectDB()`) on SIGTERM and SIGINT. |
| `client/src/utils/authApiHelper.js` | Frontend Utility | 70 | Created `safeAuthFetch` to handle non-JSON 500 error pages without throwing `SyntaxError`. |
| `client/src/pages/auth/SignupPage.jsx` | Frontend Page | 679 | Upgraded registration submit to use `safeAuthFetch`. |
| `client/src/pages/auth/EmailOtpLoginPage.jsx`| Frontend Page | 260 | Upgraded passwordless OTP login to use `safeAuthFetch`. |
| `client/src/pages/auth/ForgotPasswordPage.jsx`| Frontend Page| 195 | Upgraded password recovery request to use `safeAuthFetch`. |
| `client/src/pages/auth/ResetPasswordPage.jsx`| Frontend Page | 215 | Upgraded password reset confirmation to use `safeAuthFetch`. |

---

## 2. Register of New Test Scripts & Verification Tools

| File Path | Purpose |
| :--- | :--- |
| `server/scripts/test_master_local_suite.mjs` | Master 15-test end-to-end integration suite for local auth, DB, OTP, and catalog. |
| `server/scripts/test_v3_otp_suite.mjs` | 20-test distributed concurrency, race-condition, HMAC rotation, and batch purge suite. |
| `server/scripts/apply_v3_otp_migration.mjs` | Non-destructive forward DDL for V3 compound and nonclustered indexes in SQL Server. |
| `server/scripts/test_phase2_auth_verification.mjs` | 8-test authentication verification suite. |
