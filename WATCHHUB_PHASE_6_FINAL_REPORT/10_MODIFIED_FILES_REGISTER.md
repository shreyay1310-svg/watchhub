# WatchHub — Phase 6: Modified Files Register

**Document:** `WATCHHUB_PHASE_6_FINAL_REPORT/10_MODIFIED_FILES_REGISTER.md`  
**Date:** November 20, 2026  
**Auditor:** Principal Software Architect  

---

## 1. Register of Modified & Created Source Files

All modified files strictly adhere to the project constraint: **$\le 800$ lines per file**.

| File Path | Type | Lines | Modifications Applied |
| :--- | :---: | :---: | :--- |
| `server/src/routes/userRoutes.js` | Backend Route | 249 | Added `GET /api/users/profile` and `PUT /api/users/profile` endpoints with authentication guards to support customer profile management in SQL Server. |
| `server/src/routes/productRoutes.js` | Backend Route | 45 | Added explicit `GET /api/products/categories` and `GET /api/products/brands` endpoints ahead of `/:id` to enable catalog taxonomy queries directly from Microsoft SQL Server. |
| `server/src/services/otpService.js` | Backend Service | 582 | V3 distributed lease architecture, dynamic HMAC getters, constant-time `crypto.timingSafeEqual()`, atomic single-use OTP verification. |
| `server/src/services/otpCleanupWorker.js` | Backend Service | 231 | Self-chaining batch worker, bounded exponential backoff on SQL deadlock 1205, graceful `stop(timeoutMs)` method. |
| `server/src/server.js` | Server Entry | 148 | Graceful shutdown wiring (`server.close() -> await otpCleanupWorker.stop() -> await disconnectDB()`) on SIGTERM and SIGINT. |
| `package.json` | Configuration | 51 | Added `resend`, `nodemailer`, `razorpay`, `socket.io`, `prisma` to root runtime dependencies. |
| `package-lock.json` | Lockfile | Locked | Synchronized with root `package.json`. |
| `server/prisma/schema.prisma` | Schema | 429 | Added `binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]`, V3 columns, compound unique constraint `UQ_OTPVerifications_Identifier_Purpose`. |
| `client/src/utils/authApiHelper.js` | Frontend Utility | 70 | Implemented `safeAuthFetch` to handle non-JSON 500 error pages without throwing `SyntaxError`. |
| `client/src/pages/auth/SignupPage.jsx` | Frontend Page | 679 | Upgraded registration submit to use `safeAuthFetch`. |
| `client/src/pages/auth/EmailOtpLoginPage.jsx` | Frontend Page | 260 | Upgraded passwordless OTP login to use `safeAuthFetch`. |
| `client/src/pages/auth/ForgotPasswordPage.jsx` | Frontend Page | 195 | Upgraded password recovery request to use `safeAuthFetch`. |
| `client/src/pages/auth/ResetPasswordPage.jsx` | Frontend Page | 215 | Upgraded password reset confirmation to use `safeAuthFetch`. |

---

## 2. Test Scripts Created & Maintained

| Script Path | Purpose |
| :--- | :--- |
| `server/scripts/test_phase6_ecommerce_suite.mjs` | Phase 6 automated validation suite covering 19 e-commerce & RBAC workflows. |
| `server/scripts/test_master_local_suite.mjs` | Master 20-test integration suite covering auth, products, coupons, tracking, and addresses. |
| `server/scripts/test_v3_otp_suite.mjs` | 20-test distributed concurrency, race-condition, HMAC rotation, and batch purge suite. |
