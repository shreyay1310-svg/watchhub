# PHASE 2 ROOT CAUSE RESOLUTION REPORT
## WatchHub Production Authentication Failure Remediation

**Target Environment:** `https://watchhub-store-silk.vercel.app`  
**Vercel Project:** `watchhub-store` (`prj_U15BE0GMlmSs8u0dL4L99hXV8M6L`)  
**Deployment Region:** AWS Mumbai (`bom1`)  
**Error Remediated:** `ERR_MODULE_NOT_FOUND: Cannot find package 'resend'` (HTTP 500 `FUNCTION_INVOCATION_FAILED`)

---

### 1. Root Cause Breakdown

#### A. Root Cause 1: Missing Root Runtime Dependencies
* **Diagnostic Trace**:
  ```text
  Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'resend' imported from /var/task/server/src/services/resendService.js
      at Object.getPackageJSONURL (node:internal/modules/package_json_reader:343:9)
  Node.js process exited with exit status: 1.
  500 POST /api/auth/send-email-otp
  ```
* **Mechanism**: In `vercel.json`, `/api/(.*)` rewrites to `/api/index.js`, which imports `server/src/app.js`. Vercel builds from the repository root using `npm install` against the root `package.json`. The root `package.json` omitted `resend`, `nodemailer`, `razorpay`, and `socket.io`.
* **Resolution**: Added exact matching dependency versions (`resend: ^6.38.1`, `nodemailer: ^10.6.0`, `razorpay: ^2.9.8`, `socket.io: ^4.8.4`, `prisma: ^6.19.3`) to root `package.json` and executed `npm install`. Verified `api/index.js` imports without error.

#### B. Root Cause 2: Omission of Prisma Generation in Vercel Build
* **Mechanism**: `vercel.json` executed only `cd client && npm run build`. It never triggered `npx prisma generate` in the cloud Linux build container.
* **Resolution**: Updated `buildCommand` in `vercel.json` to:
  `npx prisma generate --schema=server/prisma/schema.prisma && cd client && npm run build`.

#### C. Root Cause 3: Missing Linux Engine Binaries
* **Mechanism**: `server/prisma/schema.prisma` lacked `binaryTargets`, risking `Query engine binary not found` on Vercel's Amazon Linux and Debian runtimes.
* **Resolution**: Configured `binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]`. Verified compiled engine binaries present in `node_modules/.prisma/client`.

#### D. Root Cause 4: Frontend Error Masking & Misleading UI
* **Mechanism**: When Vercel returned plain-text 500 error pages, `await res.json()` in `SignupPage.jsx` threw `SyntaxError`, caught and disguised as `"Failed to reach authentication server"`.
* **Resolution**: Created `client/src/utils/authApiHelper.js` with `safeAuthFetch` and upgraded `SignupPage.jsx`, `EmailOtpLoginPage.jsx`, `ForgotPasswordPage.jsx`, and `ResetPasswordPage.jsx` to cleanly parse non-JSON responses and map HTTP 400, 401, 429, 500, and network failures.

#### E. Root Cause 5: Zero Vercel Environment Variables Configured
* **Mechanism**: `npx vercel env ls` showed zero environment variables in project settings.
* **Resolution**: Authored `PHASE_2_VERCEL_ENV_SETUP.md` specifying all 12 backend variables, their targets, and the remote database connectivity requirements.
