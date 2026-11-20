# WatchHub — Authentication Readiness & Endpoint Contract Audit

**Document:** `WATCHHUB_VERCEL_PRODUCTION_READINESS/AUTHENTICATION_READINESS_REPORT.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Node.js Backend Architect & Security Specialist  
**Scope:** Rigorous, non-destructive audit of all 8 core authentication endpoints against real Microsoft SQL Server models and cryptographic services.

---

## 1. Authentication Endpoints Overview

The WatchHub authentication system is powered by Express, Prisma ORM 6.19.3, Microsoft SQL Server 2025, and the V3 Distributed OTP engine (`otpService.js`).

| Endpoint | Method | Route Handler | Database Persistence | Email / SMS Provider | Auth Tokens Issued |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `/api/auth/register` | `POST` | `authController.register` | MSSQL `Users`, `UserRoles` | None (Direct registration) | Access Token (1h) |
| `/api/auth/send-email-otp` | `POST` | `authRoutes.js` (L36-88) | MSSQL `OTPVerifications` | Gmail SMTP / Resend | None |
| `/api/auth/verify-email-otp` | `POST` | `authRoutes.js` (L94-198) | MSSQL `OTPVerifications`, `Users` | None (Verification) | Access Token + Cookie |
| `/api/auth/login` | `POST` | `authController.login` | MSSQL `Users`, `UserRoles`, `Roles` | None (Password check) | Access Token + Cookie |
| `/api/auth/email-login` | `POST` | `authRoutes.js` (L244-333) | MSSQL `OTPVerifications`, `Users` | None (OTP check) | Access Token + Cookie |
| `/api/auth/forgot-password`| `POST` | `authRoutes.js` (L339-386) | MSSQL `OTPVerifications` | Gmail SMTP / Resend | None |
| `/api/auth/reset-password` | `POST` | `authRoutes.js` (L392-448) | MSSQL `OTPVerifications`, `Users` | None (Password update)| None |
| `/api/auth/me` | `GET` | `auth.authenticate` $\rightarrow$ `getMe` | Token validation (Middleware) | None | Verified User Payload |

---

## 2. Granular Endpoint Audit Findings

### 2.1 `POST /api/auth/register`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L29) $\rightarrow$ [server/src/controllers/authController.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/controllers/authController.js#L118-L173)
* **Contract Verification:**
  - Validates `name`, `email`, and `password`. Returns `HTTP 400` if missing.
  - Queries `prisma.user.findUnique({ where: { email: cleanEmail } })`. Returns `HTTP 400` if duplicate.
  - Hashes password using `bcrypt.hash(password, 10)` (salt rounds = 10).
  - Assigns default `'Customer'` role via foreign key relation in `UserRoles`.
  - Signs JWT payload with `id`, `name`, `email`, `role`, `permissions`.
  - Returns `HTTP 201 Created` with accessToken and clean user payload.
* **Database Mutation:** Real row inserted into `[Users]` table with `CreatedAt`, `UpdatedAt`.
* **Verdict:** **PASS** (Zero mocking, real bcrypt, real database persistence).

---

### 2.2 `POST /api/auth/send-email-otp`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L36-L88)
* **Contract Verification:**
  - Sanitizes and lowercases email: `cleanEmail = email.toLowerCase().trim()`.
  - For `purpose === 'registration'`, proactively checks if account already exists.
  - Calls `requestAndSendOtp()` with 30-second atomic reservation lease (`DispatchToken = UUIDv4`).
  - **Cooldown Protection:** Rejects subsequent requests within 60 seconds with `HTTP 429 Too Many Requests` and exact `waitSeconds`.
  - **Email Dispatch:** Dispatches via primary Gmail SMTP (`googleEmailService.js`) or fallback Resend API (`resendService.js`).
  - Returns `HTTP 200 OK` with `expiresInSeconds: 300` (5 minutes) and `cooldownSeconds: 60`.
* **Security Check:** Does NOT return the OTP code in response payload.
* **Verdict:** **PASS** (V3 distributed locking verified, 60s cooldown enforced).

---

### 2.3 `POST /api/auth/verify-email-otp`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L94-L198)
* **Contract Verification:**
  - Validates `email` and `otp` format (returns `HTTP 400` if missing).
  - Calls `verifyOtp()`: hashes received OTP with `OTP_HASH_SECRET_CURRENT` and compares against stored hash using `crypto.timingSafeEqual` to eliminate timing attacks.
  - Replays/double-submits are prevented via atomic single-use consumption (`isVerified: true` update).
  - Attempt counter increments atomically; after 5 failures, OTP is locked.
  - When registration payload (`name`, `password`, `phone`) is provided, automatically provisions user account in MSSQL, sets `isEmailVerified: true`, issues JWT tokens, and sets HTTP-only `refreshToken` cookie.
* **Verdict:** **PASS** (Constant-time comparison, atomic single-use, account auto-activation).

---

### 2.4 `POST /api/auth/login`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L28) $\rightarrow$ [server/src/controllers/authController.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/controllers/authController.js#L24-L115)
* **Contract Verification:**
  - Queries user by email with nested relations: `include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } }`.
  - Constant-time password validation via `bcrypt.compare(password, user.passwordHash)`.
  - Returns `HTTP 401 Unauthorized` for both invalid email and invalid password (prevents username enumeration).
  - Checks `user.isActive`. If `false`, returns `HTTP 403 Forbidden`.
  - Resolves primary role and aggregates permissions.
  - Generates `accessToken` (1 hour) and sets `refreshToken` (7 days) in HTTP-only, SameSite cookie.
* **Verdict:** **PASS** (Enterprise RBAC resolution, secure cookies, generic auth errors).

---

### 2.5 `POST /api/auth/email-login`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L244-L333)
* **Contract Verification:**
  - Validates 6-digit OTP for `purpose === 'login'`.
  - Verifies OTP via `verifyOtp()`. Returns `HTTP 400` with remaining attempts if invalid.
  - If user exists, marks `isEmailVerified: true` and generates auth tokens.
  - If user does not exist, provisions a new Customer profile on the fly (passwordless onboarding).
  - Sets HTTP-only `refreshToken` cookie and returns accessToken + user profile.
* **Verdict:** **PASS** (Seamless passwordless flow, real DB user binding).

---

### 2.6 `POST /api/auth/forgot-password`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L339-L386)
* **Contract Verification:**
  - Accepts `email`, lowercases and sanitizes it.
  - Dispatches OTP with `purpose === 'password_reset'`.
  - Generic success response pattern: *"If an account is associated with ..., a password recovery code has been sent."* This prevents external adversaries from enumerating registered user emails.
  - Enforces strict 60-second cooldown (`HTTP 429` on spam requests).
* **Verdict:** **PASS** (Zero enumeration leakage, cooldown protection).

---

### 2.7 `POST /api/auth/reset-password`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L392-L448)
* **Contract Verification:**
  - Validates `email`, `otp`, and `newPassword`.
  - Enforces minimum password length (must be at least 6 characters; returns `HTTP 400` if shorter).
  - Verifies recovery OTP code with constant-time comparison.
  - Re-hashes new password using `bcrypt.hash(newPassword, 10)`.
  - Updates database record in `Users` with new hash: `passwordHash: hashedPassword, isEmailVerified: true`.
  - Returns `HTTP 200 OK` confirming password update.
* **Verdict:** **PASS** (Secure hashing, validation against real recovery code).

---

### 2.8 `GET /api/auth/me`
* **Route Location:** [server/src/routes/authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L30) $\rightarrow$ [server/src/middleware/auth.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/middleware/auth.js#L4-L30)
* **Contract Verification:**
  - Inspects `Authorization: Bearer <token>` header or `req.cookies.accessToken`.
  - Returns `HTTP 401 Unauthorized` if token is missing.
  - Verifies cryptographic signature using `jwt.verify(token, JWT_ACCESS_SECRET)`.
  - Returns `HTTP 401 Unauthorized` if token is expired or tampered with.
  - Attaches decoded user payload to `req.user`.
  - Controller returns `HTTP 200 OK` with user details.
* **Verdict:** **PASS** (Protected route guard, dual bearer/cookie token resolution).

---

## 3. Error Handling & Fake Response Audit

We audited the backend to ensure no routes return mock or fake success responses:

1. **Database Failure Behavior:**
   - In `login` and `register`, database connection failures throw clean exceptions caught by Express error handlers, returning `HTTP 500` with status `"error"`.
   - In `send-email-otp`, failure to acquire reservation or dispatch email rolls back the reservation state to `FAILED` and returns `HTTP 400` or `HTTP 429` with descriptive message.
2. **Timing Attack Protection:**
   - Digest comparisons strictly use `crypto.timingSafeEqual` with 32-byte SHA-256 buffers.
3. **No Hardcoded Tokens:**
   - All tokens are generated live via `jsonwebtoken.sign()` using cryptographically random payloads and system timestamps.
