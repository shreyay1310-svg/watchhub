# WatchHub — Application Security & Cryptographic Audit Report

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/SECURITY_AUDIT_REPORT.md`  
**Date:** November 20, 2026  
**Auditor:** Application Security & Cryptography Specialist  
**Scope:** Password hashing, JWT signing, OTP persistence, HMAC digests, side-channel defense, and sensitive data leakage.

---

## 1. Cryptographic Safeguards & Side-Channel Defense

| Security Control | Implementation Detail | Audit Finding | Status |
| :--- | :--- | :--- | :---: |
| **Password Hashing** | `bcryptjs` with 10 salt rounds | Passwords never stored in plaintext. Constant-time `bcrypt.compare()` used in login. | **SECURE** |
| **OTP Generation** | `crypto.randomInt(100000, 1000000)` | Cryptographically strong pseudo-random 6-digit codes. | **SECURE** |
| **OTP Storage** | Dedicated HMAC-SHA256 (`otpService.js`) | Plaintext OTP is never stored in SQL Server. Stored as HMAC bound to `identifier:purpose:otp`. | **SECURE** |
| **Secret Decoupling** | `getCurrentOtpSecret()` | Zero JWT fallback. HMAC secret is completely decoupled from JWT signing keys. | **SECURE** |
| **Timing-Attack Defense**| `crypto.timingSafeEqual()` | Constant-time buffer comparison on 32-byte digests prevents timing side-channels. | **SECURE** |
| **Replay Prevention** | Atomic single-use consumption | Conditional update (`IsVerified = 1 WHERE IsVerified = 0`) prevents parallel reuse. | **SECURE** |
| **Brute-Force Guard** | Max 5 failed verification attempts | Records purged/locked after 5 failed attempts. | **SECURE** |
| **Rate-Limiting Cooldown**| Strict 60-second cooldown | Repeated requests within 60s return `HTTP 429 Too Many Requests`. | **SECURE** |
| **Email Privacy Logging**| `maskEmail()` utility | Emails logged as `sh***10@gmail.com` in diagnostics. Zero PII leakage in stdout. | **SECURE** |

---

## 2. Authentication & Session Security

1. **Access Tokens:** Signed with `JWT_ACCESS_SECRET` using HS256 algorithm with 1-hour expiration. Payload contains user ID, role, and granular permissions.
2. **Refresh Tokens:** Signed with separate `JWT_REFRESH_SECRET` with 7-day expiration. Stored in HTTP-only, `SameSite=Strict` cookies.
3. **RBAC Enforcement:**
   - Middleware `authenticate` verifies cryptographic signature and expiration.
   - Middleware `authorizeRoles('Super Admin', 'Store Admin')` verifies role capabilities.
   - Middleware `checkPermission('inventory.manage')` enforces granular privileges.
4. **Non-Enumerating Recovery Responses:**
   - `POST /api/auth/forgot-password` returns generic success message: *"If an account is associated with ..., a password recovery code has been sent."* This prevents external attackers from discovering valid customer emails.

---

## 3. Native Android Security Controls

* **Token Storage:** Android Keystore master key (AES-256-GCM) manages `EncryptedSharedPreferences`. Access tokens are never stored in plain XML or unencrypted SQLite databases.
* **HTTP 401 Interception:** `AuthInterceptor` detects HTTP 401 Unauthorized responses and immediately clears stored tokens from memory and Keystore.
* **Network Security Config:** Release builds prohibit cleartext HTTP. Debug cleartext traffic is restricted strictly to development hosts.
