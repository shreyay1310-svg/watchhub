# WATCHHUB ATELIER — FORGOT PASSWORD IMPLEMENTATION & SECURITY
**Phase 9 Final Report — Authentication, Mobile OTP & Razorpay Setup**  
**Mode:** 100% LOCAL DEVELOPMENT ONLY | **Status:** LOCAL TESTED (SQL Server + Timing-Safe Verification)

---

## 1. Executive Summary & Status Classification

| Feature | Endpoint / Mechanism | Security Standard | Operational Status |
| :--- | :--- | :--- | :--- |
| **Anti-Enumeration** | `POST /api/auth/forgot-password` | Consistent generic response for existing & non-existent emails | **LOCAL TESTED** |
| **Purpose Isolation** | Purpose: `reset_password` | HMAC digest binds OTP strictly to reset purpose; registration OTPs rejected | **LOCAL TESTED** |
| **OTP Verification & Token** | `POST /api/auth/verify-reset-otp` | Issues short-lived (15 min) HMAC resetToken upon OTP validation | **LOCAL TESTED** |
| **Password Reset Finalization** | `POST /api/auth/reset-password` | Bcrypt hashing (10 rounds), session cookie invalidation, DB update | **LOCAL TESTED** |
| **Validation Controls** | Passwords $\ge 8$ chars, confirmation match | Client & server validation with explicit error responses | **LOCAL TESTED** |

---

## 2. Secure Forgot Password Lifecycle

```
[Customer Enters Email] (e.g. collector@domain.com)
         │
         ▼
[POST /api/auth/forgot-password]
         ├─ User exists? ────► Generates reset-purpose OTP & dispatches via Gmail SMTP
         └─ User missing? ───► Simulates equivalent processing time (prevents timing oracle)
         │
         ▼
[Generic HTTP 200 Response]
"If an account is associated with this email, a verification code has been dispatched."
         │
         ▼
[Customer Receives Reset Code]
         │
         ▼
[POST /api/auth/verify-reset-otp]
         │ Validates OTP against identifier & purpose: "reset_password"
         │ Marks OTP as verified
         ▼
[Returns Short-Lived resetToken]
Expires in 15 minutes. Cryptographically bound to user email.
         │
         ▼
[Customer Enters New Password + Confirmation]
         │
         ▼
[POST /api/auth/reset-password]
         │ 1. Validates password length >= 8 characters
         │ 2. Validates newPassword === confirmPassword
         │ 3. Verifies resetToken or direct unconsumed OTP
         │ 4. Hashes password using bcrypt.hash(newPassword, 10)
         │ 5. Updates PasswordHash & IsEmailVerified in SQL Server WatchHubDB
         │ 6. Clears refreshToken HTTP-only cookie
         ▼
[HTTP 200 Confirmation]
Customer is redirected to Login page with success toast.
```

---

## 3. Anti-Enumeration & Cross-Purpose Attack Defenses

### A. Anti-Enumeration Protection
Attackers cannot probe whether an email address exists in the WatchHub database:
- Regardless of whether `prisma.user.findUnique({ where: { email } })` returns a record or null, the HTTP status is consistently `200 OK`.
- The response body always returns:
  ```json
  {
    "status": "success",
    "message": "If an account is associated with this email, a verification code has been dispatched.",
    "channel": "email",
    "purpose": "password_reset"
  }
  ```

### B. Cross-Purpose Replay Prevention
Because HMAC-SHA256 hashes the code as:
$$\text{HMAC-SHA256}(K, \text{Identifier} \parallel \text{"reset\_password"} \parallel \text{OTP})$$
An OTP generated for account registration (`purpose: "registration"`) produces a completely different digest than an OTP for password reset (`purpose: "reset_password"`).
Submitting a registration OTP to `/api/auth/reset-password` fails immediately with `HTTP 400: Invalid or expired verification code`.

---

## 4. Key Source Code References
- **Forgot Password Endpoints:** [authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L440-L560)
- **Reset Token & Hashing Logic:** [authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L500-L555)
- **Automated Test Scenarios (Tests 3, 4, 5):** [test_phase9_auth_payment_suite.mjs](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/scripts/test_phase9_auth_payment_suite.mjs#L170-L260)
