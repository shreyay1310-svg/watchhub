# WATCHHUB ATELIER — API ENDPOINT VERIFICATION REPORT

**Base URL:** `http://localhost:5000/api`  
**Protocol:** RESTful JSON  
**Authentication Standard:** JWT (Bearer Scheme) & HttpOnly Cookies  
**Verification Method:** Live HTTP invocation tests  

---

## 1. AUTHENTICATION ENDPOINTS VERIFICATION TABLE

| Endpoint | HTTP Method | Expected Input Payload | Response Status | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | `{ name, email, password, phone }` | 201 Created | Created user in SQL Server with Customer role |
| `/api/auth/login` | POST | `{ email, password }` | 200 OK | Returns signed JWT accessToken + user object |
| `/api/auth/login` (Invalid) | POST | `{ email, password: "wrong" }` | 401 Unauthorized | Rejects with `Invalid email or password.` |
| `/api/auth/logout` | POST | None (Bearer header optional) | 200 OK | Clears refreshToken & accessToken cookies |
| `/api/auth/me` | GET | `Authorization: Bearer <token>` | 200 OK | Resolves user profile, role & permissions |
| `/api/auth/me` (Unauth) | GET | None | 401 Unauthorized | Rejects with `Authentication required.` |
| `/api/auth/send-email-otp` | POST | `{ email, purpose: "registration" }` | 200 OK | Enforces lease, HMAC hash & 60s cooldown |
| `/api/auth/verify-email-otp`| POST | `{ email, otp, name, password }` | 200 OK | Atomic single-use verification, issues JWT |
| `/api/auth/email-login` | POST | `{ email, otp }` | 200 OK | Passwordless sign-in confirmed |
| `/api/auth/forgot-password` | POST | `{ email }` | 200 OK | Anti-enumeration generic response |
| `/api/auth/verify-reset-otp`| POST | `{ email, otp }` | 200 OK | Issues short-lived resetToken |
| `/api/auth/reset-password` | POST | `{ email, otp, newPassword }` | 200 OK | Hashes password with bcrypt in DB |
| `/api/auth/send-phone-otp` | POST | `{ phone, purpose: "registration" }` | 200 OK | Simulated: true via DevelopmentMockSMSProvider |
| `/api/auth/verify-phone-otp`| POST | `{ phone, otp }` | 200 OK | Verifies mock OTP & activates phone |
| `/api/auth/send-otp` | POST | `{ email }` | 200 OK | Backwards-compatible alias route |
| `/api/auth/verify-otp` | POST | `{ email, otp }` | 200 OK | Backwards-compatible alias route |

---

## 2. API ERROR RESILIENCE
- **400 Bad Request:** Malformed email syntax, missing required fields, or wrong OTP attempts.
- **401 Unauthorized:** Invalid password, forged JWT signature, expired token.
- **403 Forbidden:** Deactivated user account or accessing a role-restricted endpoint.
- **429 Too Many Requests:** Rapid OTP requests violating 60-second cooldown period.
- **500 Internal Error:** Safely caught with JSON response; no server crash or raw stack trace leak.
