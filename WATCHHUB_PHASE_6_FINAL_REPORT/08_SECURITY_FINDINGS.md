# WatchHub — Phase 6: Application Security Findings

**Document:** `WATCHHUB_PHASE_6_FINAL_REPORT/08_SECURITY_FINDINGS.md`  
**Date:** November 20, 2026  
**Auditor:** Application Security & Cryptography Specialist  
**Scope:** Authentication, cryptographic integrity, side-channel protection, RBAC isolation, and data exposure audits.

---

## 1. Cryptographic Safeguards & Side-Channel Defense

| Security Subsystem | Design & Implementation | Threat Mitigated | Verified Status |
| :--- | :--- | :--- | :---: |
| **Password Storage** | `bcryptjs` with 10 salt rounds | Rainbow table & plaintext theft | **SECURE** |
| **OTP Hashing** | Dedicated HMAC-SHA256 bound to identifier & purpose | Database credential theft | **SECURE** |
| **Secret Decoupling** | `getCurrentOtpSecret()` with zero JWT fallback | Cross-system key compromise | **SECURE** |
| **Digest Comparison** | `crypto.timingSafeEqual()` on 32-byte buffers | Timing side-channel attacks | **SECURE** |
| **Replay Prevention** | Atomic single-use consumption (`IsVerified = 1 WHERE IsVerified = 0`)| Parallel verification replay | **SECURE** |
| **Brute-Force Guard** | Max 5 failed verification attempts per OTP | Online brute-force enumeration | **SECURE** |
| **Rate-Limiting Cooldown**| Strict 60-second cooldown per identifier & purpose | SMS/Email flood & resource exhaustion | **SECURE** |
| **Logging Privacy** | `maskEmail()` utility (`sh***10@gmail.com`) | PII leakage in stdout & logging | **SECURE** |

---

## 2. Role-Based Access Control (RBAC) Isolation Audit

During Phase 6 testing, we explicitly tested unauthorized privilege escalation:

1. **Customer Elevation Attack Simulation:**
   - A valid customer access token attempted to access administrative endpoints:
     - `GET /api/dashboard/super-admin` $\rightarrow$ `HTTP 403 Forbidden` (`TC_RBAC_015`)
     - `GET /api/dashboard/store-admin` $\rightarrow$ `HTTP 403 Forbidden` (`TC_RBAC_016`)
     - `POST /api/products` $\rightarrow$ `HTTP 403 Forbidden` (`TC_RBAC_017`)
     - `POST /api/inventory/add-stock` $\rightarrow$ `HTTP 403 Forbidden` (`TC_RBAC_018`)
2. **Finding:** The authorization middleware `authorizeRoles` in `server/src/middleware/auth.js` enforces strict checks on `req.user.role`. Access is denied regardless of frontend routing manipulation or query parameter injection.

---

## 3. Account Enumeration Prevention

In `POST /api/auth/forgot-password`:
- Regardless of whether an email address exists in Microsoft SQL Server, the API responds with a generic message:
  ```json
  {
    "status": "success",
    "message": "If an account is associated with ..., a password recovery code has been sent.",
    "cooldownSeconds": 60
  }
  ```
- This prevents external adversaries from discovering registered collector email addresses.
