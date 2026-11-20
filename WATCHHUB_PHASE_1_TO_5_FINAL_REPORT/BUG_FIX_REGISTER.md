# WatchHub — Bug Fix & Defect Remediation Register

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/BUG_FIX_REGISTER.md`  
**Date:** November 20, 2026  
**Auditor:** Quality Assurance & Principal Architect  

---

## 1. Master Defect & Remediation Register

| Issue ID | Phase | Severity | Original Defect / Error | Root Cause | Affected File(s) | Fix Applied | Test Performed | Result |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **BUG-001** | Phase 1 | **CRITICAL** | `ERR_MODULE_NOT_FOUND: 'resend'` during serverless build. | Root `package.json` was missing runtime dependencies imported by `server/src/app.js`. | `package.json`, `package-lock.json` | Added `resend`, `nodemailer`, `razorpay`, `socket.io`, `prisma` to root dependencies. | `api/index.js` Node import test. | **FIXED & VERIFIED** |
| **BUG-002** | Phase 4 | **HIGH** | "Failed to reach authentication server" displayed on 500 error pages. | Frontend `await res.json()` crashed with `SyntaxError` on plain text / HTML 500 error pages. | `client/src/utils/authApiHelper.js`, `SignupPage.jsx` | Implemented `safeAuthFetch` with Content-Type inspection and smart HTTP status mapping. | Simulated 500 HTML responses; verified user receives clear message. | **FIXED & VERIFIED** |
| **BUG-003** | Phase 2 | **CRITICAL** | Distributed concurrent reservation overwrite. | Old Node process completing late could activate or fail a newly acquired reservation. | `server/src/services/otpService.js` | Added UUIDv4 `DispatchToken` and atomic conditional updates (`WHERE Id = @id AND DispatchToken = @token`). | TC_V3_001, TC_V3_002, TC_V3_003. | **FIXED & VERIFIED** |
| **BUG-004** | Phase 2 | **HIGH** | Potential timing attack on OTP digest comparison. | String equality (`===`) leaks timing information. | `server/src/services/otpService.js` | Converted to fixed 32-byte buffers and enforced `crypto.timingSafeEqual()`. | TC_V3_012, TC_V3_013. | **FIXED & VERIFIED** |
| **BUG-005** | Phase 2 | **HIGH** | HMAC secret coupled to JWT secret with static evaluation. | `OTP_HASH_SECRET_CURRENT` was evaluated once at module load; secret rotation required restart. | `server/src/services/otpService.js` | Implemented dynamic getters `getCurrentOtpSecret()` and `getPreviousOtpSecret()`. | TC_V3_014 key rotation simulation. | **FIXED & VERIFIED** |
| **BUG-006** | Phase 2 | **MEDIUM** | Overlapping cleanup intervals and abrupt shutdown. | `setInterval` could overlap on large batches; worker did not await in-flight batch on SIGTERM. | `server/src/services/otpCleanupWorker.js`, `server/src/server.js` | Self-chaining `setTimeout` singleton with deadlock 1205 retry and graceful `stop(timeoutMs)` method. | TC_V3_007, TC_V3_008, TC_V3_009 (5,000 records). | **FIXED & VERIFIED** |
| **BUG-007** | Phase 1 | **MEDIUM** | Linux binary targets missing for Prisma query engine. | `schema.prisma` omitted Amazon Linux and Debian binary targets. | `server/prisma/schema.prisma` | Added `binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]`. | `npx prisma generate` generated all `.so.node` files. | **FIXED & VERIFIED** |
| **BUG-008** | Phase 2 | **LOW** | `GET /api/products/categories` and `/brands` routed to `/:id`. | Dynamic parameter `/:id` caught taxonomies and queried product with `productId = 'categories'`. | `server/src/routes/productRoutes.js` | Registered explicit `/categories` and `/brands` endpoints querying SQL Server prior to `/:id`. | `TC_M_016` in master integration suite. | **FIXED & VERIFIED** |
