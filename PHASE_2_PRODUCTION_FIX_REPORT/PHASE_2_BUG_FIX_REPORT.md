# PHASE 2 BUG FIX REPORT
## Defect Matrix & Resolution Status

| Defect ID | Component | Severity | Description | Resolution Status |
|---|---|---|---|---|
| **FIX-001** | Root `package.json` | **BLOCKER** | Missing `resend`, `nodemailer`, `razorpay`, `socket.io` in root dependencies caused Vercel Lambda `ERR_MODULE_NOT_FOUND` crash. | **RESOLVED** — Added packages with exact matching versions; updated lockfile. |
| **FIX-002** | `vercel.json` | **BLOCKER** | `buildCommand` omitted `prisma generate`, leaving Prisma Client unbuilt in Linux container. | **RESOLVED** — Updated `buildCommand` to run `npx prisma generate --schema=server/prisma/schema.prisma` before Vite build. |
| **FIX-003** | `schema.prisma` | **HIGH** | Missing Linux binary targets risked `Query engine binary not found` on Vercel Amazon Linux / Debian microVMs. | **RESOLVED** — Added `binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]`. |
| **FIX-004** | `SignupPage.jsx` | **HIGH** | Unchecked `await res.json()` threw `SyntaxError` on plain-text 500 error pages, hiding server errors behind a generic connection error. | **RESOLVED** — Implemented `safeAuthFetch` with Content-Type checks and status code mapping. |
| **FIX-005** | Other Auth Pages | **MEDIUM** | Similar `res.json()` patterns in `EmailOtpLoginPage.jsx`, `ForgotPasswordPage.jsx`, and `ResetPasswordPage.jsx`. | **RESOLVED** — Upgraded all auth pages to `safeAuthFetch`. |
| **FIX-006** | Vercel Environment | **HIGH** | Zero environment variables were configured in Vercel project settings. | **RESOLVED** — Created `PHASE_2_VERCEL_ENV_SETUP.md` with complete variable inventory. |
