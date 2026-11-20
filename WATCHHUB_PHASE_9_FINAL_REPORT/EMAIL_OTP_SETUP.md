# WATCHHUB ATELIER — CUSTOMER EMAIL OTP ARCHITECTURE & SETUP
**Phase 9 Final Report — Authentication, Mobile OTP & Razorpay Setup**  
**Mode:** 100% LOCAL DEVELOPMENT ONLY | **Status:** REAL PROVIDER VERIFIED (Gmail SMTP) & LOCAL TESTED (SQL Server OTP V3)

---

## 1. Executive Summary & Status Classification

| Capability | Implementation Layer | Operational Status | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **Dynamic Email Recipient** | `SignupPage.jsx` & `authRoutes.js` | **REAL PROVIDER VERIFIED** | Dispatches to exact user input; no hardcoded addresses |
| **UUID Dispatch Lease** | `otpService.js` & `OTPVerifications` table | **LOCAL TESTED** | 20/20 V3 concurrence and lease recovery tests passed |
| **HMAC-SHA256 Secret Rotation** | `crypto.timingSafeEqual` + dual-key support | **LOCAL TESTED** | Validates against `OTP_SECRET_CURRENT` & `OTP_SECRET_PREVIOUS` |
| **Atomic Single-Use Verification** | SQL Server conditional `UPDATE` | **LOCAL TESTED** | Replay attacks rejected; consumed flag enforced |
| **Cooldown & Expiration Guard** | 60s cooldown, 300s expiration | **LOCAL TESTED** | 429 Rate limit enforced on premature resend |
| **Luxury Email Presentation** | `emailTemplates.js` | **REAL PROVIDER VERIFIED** | #111111 charcoal, #FAF8F3 card, #B99A5B gold, zero emojis |

---

## 2. Dynamic Email Delivery Flow

```
[Customer Enters Email] 
         │ (e.g., customer@example.com)
         ▼
[Frontend: SignupPage.jsx]
         │ Validates syntax, prevents duplicate submit
         ▼
[POST /api/auth/send-email-otp]
         │ Payload: { email: "customer@example.com", purpose: "registration" }
         ▼
[Backend: otpService.js]
         │ 1. Generates 6-digit cryptographic OTP via crypto.randomInt(100000, 1000000)
         │ 2. Hashes OTP with HMAC-SHA256(identifier + purpose + secret)
         │ 3. Acquires UUID dispatch lease in SQL Server OTPVerifications table
         ▼
[Gmail SMTP Service: googleEmailService.js]
         │ 1. Transports luxury HTML template via nodemailer
         │ 2. Preserves exact dynamic recipient address
         │ 3. Fails closed: Never reports success if SMTP connection or handshake fails
         ▼
[Customer Inbox / Verification Screen]
         │ Customer enters received code
         ▼
[POST /api/auth/verify-email-otp]
         │ 1. Verifies timingSafeEqual HMAC hash
         │ 2. Atomically marks record as verified and consumed
         │ 3. Issues 15-minute JWT Access Token & HTTP-only Refresh Token
```

---

## 3. Cryptographic Implementation Details

### A. HMAC-SHA256 Hashing (`otpService.js`)
Plaintext OTPs are never stored in the database or written to server logs. The digest is derived through:
$$\text{Digest} = \text{HMAC-SHA256}(K, \text{Identifier} \parallel \text{Purpose} \parallel \text{OTP})$$
Where:
- $K$: Current or previous server secret key (`OTP_SECRET_CURRENT`, `OTP_SECRET_PREVIOUS`).
- $\text{Identifier}$: Lowercased, trimmed recipient email.
- $\text{Purpose}$: Bound strictly to `'registration'`, `'login'`, or `'reset_password'`.
- Comparison: Conducted via `crypto.timingSafeEqual` with buffer length validation.

### B. Distributed Dispatch Leases
To prevent race conditions across server workers or multiple user clicks:
- Each dispatch generates a unique UUID (`dispatchToken`).
- A 15-second reservation lease (`DispatchLockedUntil`) is acquired atomically via SQL Server conditional queries.
- If a delivery process crashes, new requests can take over the reservation once the 15-second lease expires without corrupting active verification records.

---

## 4. Key Source Code References
- **Email Dispatch Controller:** [authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L350-L420)
- **OTP V3 Cryptographic Engine:** [otpService.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/services/otpService.js#L1-L320)
- **Gmail SMTP Service:** [googleEmailService.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/services/googleEmailService.js#L1-L180)
- **Luxury Email Templates:** [emailTemplates.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/services/emailTemplates.js#L1-L240)
- **Automated Verification Suite:** [test_phase9_auth_payment_suite.mjs](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/scripts/test_phase9_auth_payment_suite.mjs#L100-L165)
