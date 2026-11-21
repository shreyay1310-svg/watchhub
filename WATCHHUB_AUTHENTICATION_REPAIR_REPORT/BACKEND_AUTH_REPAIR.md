# WATCHHUB ATELIER — BACKEND AUTHENTICATION REPAIR REPORT

**Platform:** Node.js + Express 4.21.2 + Prisma ORM 6.19.3  
**Files Audited:**
- `server/src/routes/authRoutes.js`
- `server/src/controllers/authController.js`
- `server/src/middleware/auth.js`
- `server/src/services/otpService.js`
- `server/src/services/googleEmailService.js`
- `server/src/services/smsService.js`
- `server/src/services/smsProvider.js`
- `server/src/config/prisma.js`

---

## 1. BACKEND REPAIRS & VERIFICATIONS

### 1.1 Password Authentication (`POST /api/auth/login`)
- **Controller:** `server/src/controllers/authController.js`
- **Database Lookup:** Prisma query against `dbo.Users` with relational `dbo.UserRoles` and `dbo.RolePermissions`.
- **Bcrypt Comparison:** `await bcrypt.compare(password, user.passwordHash)`.
- **Status Check:** Enforces `user.isActive === true`. Deactivated accounts rejected with HTTP 403 Forbidden.
- **Role & Permission Resolution:** Primary role resolved server-side from `user.userRoles[0]?.role?.roleName`. Granular permission codes mapped. Frontend cannot override role.
- **Token Minting:** Issues 1-hour signed JWT access token and 7-day refresh token.
- **Cookie Security:** Writes `refreshToken` as HttpOnly cookie:
  ```javascript
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  ```

### 1.2 Customer Registration (`POST /api/auth/register`)
- **Controller:** `server/src/controllers/authController.js`
- **Validation:** Enforces name, valid email format, and minimum 6-character password.
- **Uniqueness:** Rejects duplicate email addresses with HTTP 400.
- **Role Assignment:** Automatically queries and attaches `Customer` role via `dbo.UserRoles`. Public signup CANNOT create administrative roles.
- **Password Security:** Salted and hashed with bcrypt (cost factor 10).

### 1.3 Logout & Session Termination (`POST /api/auth/logout`) — *NEWLY REPAIRED*
- **Controller:** `server/src/controllers/authController.js`
- **Implementation:**
  ```javascript
  export const logout = async (req, res) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('accessToken');
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully.',
    });
  };
  ```
- **Route:** Registered at `router.post('/logout', logout)` in `server/src/routes/authRoutes.js`.

### 1.4 Profile & Session Verification (`GET /api/auth/me`)
- **Middleware:** `authenticate` in `server/src/middleware/auth.js`.
- **Verification:** Inspects `Authorization: Bearer <token>` or `req.cookies.accessToken`. Verifies signature using `JWT_ACCESS_SECRET`.
- **Rejection:** Missing tokens return HTTP 401 (`Authentication required. No token provided.`). Tampered or expired tokens return HTTP 401 (`Invalid or expired authentication token.`).

### 1.5 OTP V3 Infrastructure (`otpService.js`)
- **HMAC-SHA256 Hashing:** OTPs are never stored in plaintext. Hashed with dynamic salt: `HMAC-SHA256(secret, `${identifier}:${otp}:${purpose}`)`.
- **Timing-Safe Comparison:** Compares cryptographic buffers via `crypto.timingSafeEqual` to eliminate side-channel timing attacks.
- **Purpose Binding:** Registration OTPs cannot be used to reset passwords or log in.
- **UUID Dispatch Leases:** Prevents two worker processes from concurrently claiming the same dispatch slot.

---

## 2. VERDICT
**BACKEND AUTHENTICATION AUDIT: VERIFIED & FULLY OPERATIONAL**
