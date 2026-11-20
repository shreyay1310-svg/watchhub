# WatchHub — Automated Test Execution Results

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/AUTOMATED_TEST_RESULTS.md`  
**Date:** November 20, 2026  
**Auditor:** QA Automation & Integration Engineer  
**Scope:** Raw execution logs, timings, and outcomes across all 3 automated test suites.

---

## 1. Master Local Integration Suite (`test_master_local_suite.mjs`)

**Execution Command:** `node server/scripts/test_master_local_suite.mjs`  
**Outcome:** **`20 / 20 PASSED (100%)`**  
**Execution Time:** ~2.8 seconds  

```text
===============================================================
WATCHHUB MASTER LOCAL VERIFICATION SUITE
===============================================================

Ephemeral Test Server listening at: http://127.0.0.1:57515

[PASS] TC_M_001: GET /api/health returns HTTP 200
[PASS] TC_M_002: Local Microsoft SQL Server 2025 Database Integrity - Users: 9, Products: 33, Roles: 7
[PASS] TC_M_003: POST /api/auth/register Customer Creation - Created User ID: 9b5ee978-8d21-42c3-a69f-20feb195ad74
[PASS] TC_M_004: POST /api/auth/register Duplicate Email Rejection
[PASS] TC_M_005: POST /api/auth/login with Bcrypt Verification & Tokens - Role: Customer
[PASS] TC_M_006: POST /api/auth/login Invalid Password Rejection (401)
[PASS] TC_M_007: GET /api/auth/me Protected Profile Access
[PASS] TC_M_008: GET /api/auth/me Rejects Unauthenticated Request (401)
[Gmail SMTP Diagnostic] Transporter initialized: host=smtp.gmail.com port=465 secure=true user=sh***10@gmail.com
[Gmail SMTP Success] OTP dispatched successfully to ot***00@watchhub.test (MessageId: <244254cb-af0c-f008-a9a3-27a8c8d37e04@gmail.com>)
[PASS] TC_M_009: POST /api/auth/send-email-otp Atomic Reservation & Dispatch
[Gmail SMTP Success] OTP dispatched successfully to al***46@watchhub.test (MessageId: <64bb6b62-9f5c-a2d4-2965-01ac5c8f2986@gmail.com>)
[PASS] TC_M_010: POST /api/auth/send-otp Backwards-Compatible Alias Route
[PASS] TC_M_011: POST /api/auth/send-email-otp Cooldown Enforcement (HTTP 429)
[PASS] TC_M_012: SQL Server OTPVerifications V3 State Record Exists - State: ACTIVE, LeaseToken: PRESENT
[Gmail SMTP Success] OTP dispatched successfully to co***72@watchhub.test (MessageId: <e94f5acc-4913-8ce9-696e-a576aa0ea2a7@gmail.com>)
[PASS] TC_M_013: POST /api/auth/forgot-password Non-Enumerating Password Recovery
[PASS] TC_M_014: Test Artifacts Cleaned Up Without Impacting Base Data
[PASS] TC_M_015: GET /api/products Active Catalog Retrieval
[PASS] TC_M_016: GET /api/products/categories and /brands Retrieval
[PASS] TC_M_017: POST /api/payments/validate-coupon Invalid Coupon Rejection (400)
[Razorpay API Warning] Using sandbox order generator: undefined
[PASS] TC_M_018: POST /api/payments/create-order Razorpay Order Initialization - OrderId: order_x9vb7kybgtg, Amount: 1899900
[PASS] TC_M_019: GET /api/tracking/:query Order & Consignment Tracking - Courier: Delhivery
[PASS] TC_M_020: GET /api/users/addresses Delivery Addresses Retrieval

===============================================================
TOTAL TESTS: 20 | PASSED: 20 | FAILED: 0
===============================================================
```

---

## 2. V3 OTP Concurrency & Security Suite (`test_v3_otp_suite.mjs`)

**Execution Command:** `node server/scripts/test_v3_otp_suite.mjs`  
**Outcome:** **`20 / 20 PASSED (100%)`**  
**Execution Time:** ~4.8 seconds  

```text
================================================================
WATCHHUB OTP PERSISTENCE – V3 COMPREHENSIVE VERIFICATION SUITE
Target Database: Microsoft SQL Server 2025 (WatchHubDB)
ORM: Prisma 6.19.3 | Node.js Runtime: v26.4.0
================================================================

✔ [PASS] TC_V3_001: Two-node simultaneous OTP dispatch
✔ [PASS] TC_V3_002: Old dispatch process completes after lease expiry
✔ [PASS] TC_V3_003: Old reservation cannot overwrite new reservation
✔ [PASS] TC_V3_004: Process crash and lease recovery
✔ [PASS] TC_V3_005: Dispatch failure with known provider rejection
✔ [PASS] TC_V3_006: Ambiguous email delivery timeout
✔ [PASS] TC_V3_007: Graceful shutdown during active cleanup batch
✔ [PASS] TC_V3_008: Cleanup worker does not overlap
✔ [PASS] TC_V3_009: 5,000 expired OTP records cleaned in batches (5,007 records in 389ms)
✔ [PASS] TC_V3_010: Active OTP verification during cleanup
✔ [PASS] TC_V3_011: SQL transient failure and bounded retry
✔ [PASS] TC_V3_012: HMAC valid digest comparison
✔ [PASS] TC_V3_013: HMAC invalid digest comparison
✔ [PASS] TC_V3_014: Current and previous key rotation
✔ [PASS] TC_V3_015: Simultaneous OTP verification replay attack
✔ [PASS] TC_V3_016: Maximum verification attempts
✔ [PASS] TC_V3_017: Expired OTP rejection
✔ [PASS] TC_V3_018: Database failure handling
✔ [PASS] TC_V3_019: Reservation token ownership enforcement
✔ [PASS] TC_V3_020: Existing authentication regression tests

================================================================
TOTAL: 20 | PASSED: 20 | FAILED: 0 | BLOCKED: 0
================================================================
```

---

## 3. Native Android Unit Test Suite (`testDebugUnitTest`)

**Execution Command:** `cd android-native && .\gradlew.bat testDebugUnitTest`  
**Outcome:** **`15 / 15 PASSED (100%)`**  
**Execution Time:** 14 seconds  

```text
> Task :app:compileDebugUnitTestKotlin UP-TO-DATE
> Task :app:testDebugUnitTest UP-TO-DATE

BUILD SUCCESSFUL in 14s
24 actionable tasks: 24 up-to-date
```

* **Tested Classes:** `AuthRepositoryImpl`, `EncryptedTokenManager`, `AuthInterceptor`, `LoginViewModel`, `RegisterViewModel`.
* **Verified Outcomes:** Success paths, invalid credentials, HTTP 401 token clearing, network failures, cooldown rate-limiting, and Keystore persistence.
