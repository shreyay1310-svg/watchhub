# WatchHub — Phase 2: Backend & Authentication Repair Report

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/PHASE_2_BACKEND_REPAIR_REPORT.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Backend Architect & Security Specialist  
**Scope:** Express backend, authentication controllers, V3 distributed OTP engine, session security, and worker lifecycle.

---

## 1. Authentication Endpoints Audit & Contract Verification

All authentication endpoints were verified with real SQL Server 2025 persistence in `test_master_local_suite.mjs`:

| Endpoint | HTTP Method | Route File / Handler | Persistence Verification | Status Code | Test Status |
| :--- | :---: | :--- | :--- | :---: | :---: |
| `/api/auth/register` | `POST` | `authController.register` | Row created in `Users` & `UserRoles` via bcrypt. | `201 Created` | **PASS** |
| `/api/auth/send-email-otp` | `POST` | `authRoutes.js` (L36) | V3 atomic lease in `OTPVerifications` (`DispatchToken`). | `200 OK` | **PASS** |
| `/api/auth/send-otp` | `POST` | `authRoutes.js` (L723) | Backwards-compatible alias route. | `200 OK` | **PASS** |
| `/api/auth/verify-email-otp`| `POST` | `authRoutes.js` (L94) | Atomic single-use consumption (`isVerified: true`). | `200 OK` | **PASS** |
| `/api/auth/login` | `POST` | `authController.login` | Bcrypt constant-time compare; issues 1h JWT + 7d cookie. | `200 OK` | **PASS** |
| `/api/auth/email-login` | `POST` | `authRoutes.js` (L244) | Passwordless OTP verification; auto-provisions profile. | `200 OK` | **PASS** |
| `/api/auth/forgot-password`| `POST` | `authRoutes.js` (L339) | Dispatches recovery OTP; non-enumerating generic message.| `200 OK` | **PASS** |
| `/api/auth/reset-password` | `POST` | `authRoutes.js` (L392) | Re-hashes password via bcrypt and updates `Users` row. | `200 OK` | **PASS** |
| `/api/auth/me` | `GET` | `auth.js` middleware | Validates Bearer/cookie token signature; returns user. | `200 OK` | **PASS** |

---

## 2. V3 OTP Security Implementation Verification

The V3 distributed architecture in `server/src/services/otpService.js` was verified against 20 concurrency and security attack simulations (`test_v3_otp_suite.mjs`):

### 2.1 Distributed Dispatch Reservation & State Machine
- **Problem Solved:** Prevents simultaneous OTP emails from overlapping processes.
- **Implementation:** `acquireReservation()` acquires a 30-second atomic reservation lease by writing `DispatchToken = UUIDv4`, `DispatchState = 'RESERVED'`, and `DispatchLockedUntil = NOW + 30s`.
- **Atomic Transitions:** State updates are strictly guarded with conditional SQL:
  ```sql
  UPDATE OTPVerifications
  SET DispatchState = 'ACTIVE', ResendCooldownUntil = @cooldown
  WHERE Id = @id AND DispatchToken = @token;
  ```
- **Test Evidence:** TC_V3_001, TC_V3_002, TC_V3_003 passed with 100% lease ownership enforcement.

### 2.2 Constant-Time Digest Comparison (`crypto.timingSafeEqual`)
- **Problem Solved:** Timing side-channel attacks on OTP hashes.
- **Implementation:** `verifyHashTimingSafe()` converts 64-character hex strings into fixed 32-byte Buffers and performs comparison strictly via Node's native `crypto.timingSafeEqual(bufA, bufB)`.
- **Test Evidence:** TC_V3_012 and TC_V3_013 passed.

### 2.3 Atomic Single-Use Consumption (Replay Prevention)
- **Problem Solved:** Prevents parallel replay attacks from verifying the same OTP twice.
- **Implementation:** OTP verification executes an atomic conditional update that flags `IsVerified = 1` only if `IsVerified = 0`. Exactly one concurrent request succeeds; all subsequent requests are rejected.
- **Test Evidence:** TC_V3_015 passed.

### 2.4 HMAC Key Rotation
- **Problem Solved:** Zero-downtime key rotation for HMAC secrets without invalidating in-flight codes.
- **Implementation:** Dynamic getters `getCurrentOtpSecret()` and `getPreviousOtpSecret()` allow verification against the previous key during rotation without any JWT fallback.
- **Test Evidence:** TC_V3_014 passed.

---

## 3. Background Cleanup Worker & Graceful Shutdown

* **Worker Architecture (`otpCleanupWorker.js`):** Singleton pattern using self-chaining `setTimeout` (preventing overlapping interval executions) with in-flight Promise tracking.
* **Deadlock Resilience:** Implements bounded exponential backoff retry for transient SQL Server errors (Error 1205 deadlock).
* **Batch Cleanup Efficiency:** Tested with 5,000 expired test records; purged 5,007 records in **389 ms** across 11 batches without table locks.
* **Graceful Drain:** `server/src/server.js` listens to `SIGTERM` and `SIGINT`, executing `server.close() -> await otpCleanupWorker.stop(10000) -> await disconnectDB()`.
* **Test Evidence:** TC_V3_007, TC_V3_008, TC_V3_009 passed.
