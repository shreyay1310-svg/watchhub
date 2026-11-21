# WATCHHUB ATELIER — SECURITY & CRYPTOGRAPHY REVIEW

**Assessment Scope:** Authentication, Session Security, Cryptography, Password Handling & Anti-Enumeration  
**Compliance Standard:** OWASP Top 10 API Security & Luxury Horology Security Standards  
**Status:** COMPLIANT  

---

## 1. PASSWORD STORAGE & VERIFICATION
- **Algorithm:** bcrypt with cost factor 10.
- **Salt Generation:** Unique per-user random cryptographic salt generated during registration/password reset.
- **Timing Attacks:** bcrypt password comparison execution uses consistent iterative expansion, mitigating timing attacks.

---

## 2. JWT TOKEN SECURITY & REVOCATION
- **Access Token:** HMAC-SHA256 signed using high-entropy secret (`JWT_ACCESS_SECRET`). Short expiration (1 hour).
- **Refresh Token:** Stored in HttpOnly, SameSite=strict cookie with 7-day expiration.
- **Logout Cleansing:** `POST /api/auth/logout` explicitly clears both cookies on the client browser.
- **Tampering Resistance:** Signature validation strictly rejects modified payloads, algorithm spoofing (`none`), or wrong signing keys.

---

## 3. OTP V3 CRYPTOGRAPHIC CONTROLS
- **Zero Plaintext Storage:** Neither the SQL Server database nor debug logs store the 6-digit verification code.
- **HMAC-SHA256 Derivation:** Stored as `HMAC-SHA256(secret, `${identifier}:${otp}:${purpose}`)`.
- **Constant-Time Comparison:** Uses Node.js `crypto.timingSafeEqual` over raw byte buffers to eliminate timing leakages.
- **Atomic Single-Use Invalidation:** Once verified, `IsVerified` is marked 1 and code cannot be replayed.
- **Purpose Binding:** An OTP dispatched for `registration` cannot be verified for `password_reset` or `login`.
- **Brute-Force Lockout:** Rejects attempts after 5 consecutive failures, invalidating the session.

---

## 4. ANTI-USER ENUMERATION PROTECTION
- **Forgot Password Workflow:** `POST /api/auth/forgot-password` returns an identical success message regardless of whether the submitted email address exists in the database:
  `"If an account exists with this email address, a luxury verification code has been dispatched."`
- **Timing Normalization:** Dummy cryptographic work performed if user is not found, preventing response timing discovery.

---

## 5. LOCAL SECRETS HYGIENE
- Zero secrets committed to Git history.
- `.env` and `server/.env` files safely tracked in `.gitignore`.
- Mobile SMS testing uses `DevelopmentMockSMSProvider`, preventing external paid SMS leakage.
- Production environment rejects mock SMS execution by design.
