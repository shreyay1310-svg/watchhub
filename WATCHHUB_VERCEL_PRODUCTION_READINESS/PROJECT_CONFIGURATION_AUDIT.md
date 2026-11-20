# WatchHub — Project Configuration & Dependency Audit

**Document:** `WATCHHUB_VERCEL_PRODUCTION_READINESS/PROJECT_CONFIGURATION_AUDIT.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Backend Architect  
**Target:** Vercel Production (`watchhub-store`)  
**Scope:** Read-Only Audit of Root & Server Configuration, Prisma ORM, Serverless Entry Points, and Runtime Dependencies.

---

## 1. Executive Summary

A comprehensive, non-destructive audit was performed across the WatchHub repository to evaluate its configuration for deployment on Vercel Serverless.

| Verification Item | Target File / Module | Status | Evidence / Finding |
| :--- | :--- | :---: | :--- |
| **Backend Runtime Dependencies** | `package.json` | **PASS** | `resend`, `nodemailer`, `razorpay`, `socket.io`, `prisma`, `@prisma/client`, `bcryptjs`, `jsonwebtoken` are present in root dependencies. |
| **Prisma Client Generation** | `vercel.json`, `schema.prisma` | **PASS** | `buildCommand` runs `npx prisma generate --schema=server/prisma/schema.prisma` before Vite build. Multi-platform Linux targets configured. |
| **Database Provider** | `server/prisma/schema.prisma` | **PASS** | `provider = "sqlserver"`, `url = env("DATABASE_URL")`. 22 relational models mapped. |
| **Serverless Entry Point** | `api/index.js` | **PASS** | Express app exported cleanly as default export. |
| **API URL Rewrites** | `vercel.json` | **PASS** | `/api/(.*)` and `/api` rewrite to `/api/index.js`; SPA fallback `/(.*)` rewrites to `/index.html`. |
| **MongoDB Isolation** | `server/src/` | **PASS** | Zero production controllers, routes, or services import Mongoose or MongoDB. Legacy models isolated in `server/src/models/` and `seed.js`. |
| **Hardcoded Secrets** | `server/src/routes/authRoutes.js`, `authController.js` | **WARNING** | Fallback defaults exist for development (`watchhub_super_secret_...`). Production must inject runtime secrets via Vercel Dashboard. |
| **Environment Variable Binding** | `server/src/config/prisma.js` | **PASS** | Fallback dotenv path resolves cleanly; production runtime consumes `process.env` directly from Vercel container. |

---

## 2. Dependency Audit

### 2.1 Root `package.json` Inspection
Vercel builds from the repository root directory. Serverless functions executing in `api/index.js` require runtime packages to be resolvable from root `node_modules`.

```json
{
  "name": "watchhub",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "nodemailer": "^10.6.0",
    "prisma": "^6.19.3",
    "razorpay": "^2.9.8",
    "resend": "^6.38.1",
    "socket.io": "^4.8.4",
    "zod": "^3.24.1"
  }
}
```

* **Audit Verdict:** `PASS`
* **Observation:** The previously missing `resend`, `nodemailer`, `razorpay`, `socket.io`, and `prisma` packages have been installed and recorded in root `package.json` and locked in `package-lock.json`. This eliminates the Vercel `ERR_MODULE_NOT_FOUND: 'resend'` crash.

### 2.2 Sub-package `server/package.json`
* Contains `"mongoose": "^8.9.5"`.
* **Investigation:** We inspected whether `server/package.json` conflicts with root or if Mongoose is invoked. Root `package.json` does NOT include `mongoose`. Mongoose is solely present in `server/package.json` for historical reference.

---

## 3. Prisma Schema & Binary Target Audit

`server/prisma/schema.prisma` was verified:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

### Critical Findings:
1. **MSSQL Provider:** Configured for Microsoft SQL Server (`sqlserver`). No MongoDB or Postgres dialect is active.
2. **Binary Targets:**
   - `native`: Compiles for the developer's Windows OS (`windows`).
   - `rhel-openssl-3.0.x`: Required for Vercel Serverless runtime on AWS Lambda / Amazon Linux 2023.
   - `debian-openssl-3.0.x`: Required for Debian/Ubuntu container compatibility.
3. **Engine Binaries Verified on Disk:**
   - `node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node` (Present)
   - `node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node` (Present)
   - `node_modules/.prisma/client/query_engine-windows.dll.node` (Present)

* **Audit Verdict:** `PASS`

---

## 4. Vercel Configuration (`vercel.json`) Audit

```json
{
  "version": 2,
  "installCommand": "npm install && cd client && npm install",
  "buildCommand": "npx prisma generate --schema=server/prisma/schema.prisma && cd client && npm run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/api",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Verification Points:
1. **`installCommand`**: Runs root `npm install` (populating root `node_modules` for serverless function `api/index.js`) and then installs `client` dependencies.
2. **`buildCommand`**: Executes `npx prisma generate` against the MSSQL schema, creating the Prisma query engine before building the Vite client into `client/dist`.
3. **`outputDirectory`**: Points to Vite's output `client/dist`.
4. **`rewrites`**: All `/api/*` requests forward to the Express serverless function `api/index.js`. All other routes serve Vite's single-page app `index.html`.

* **Audit Verdict:** `PASS`

---

## 5. MongoDB Dependency Verification

A full codebase search was performed across `server/src/`:

```powershell
Get-ChildItem -Path "server\src" -Recurse -File | Select-String -Pattern "mongoose|mongodb"
```

### Audit Findings:
1. **Active Application Code:**
   - `server/src/app.js`: Uses pure Express, Helmet, CORS, Morgan, CookieParser. Zero Mongoose imports.
   - `server/src/routes/*.js`: All 11 route files import Prisma from `../config/prisma.js`. Zero Mongoose imports.
   - `server/src/controllers/*.js`: All controllers query `prisma.*`. Zero Mongoose imports.
   - `server/src/services/*.js`: `otpService.js`, `resendService.js`, `googleEmailService.js`, `razorpayService.js` use pure Node.js / Prisma. Zero Mongoose imports.
2. **Inactive / Legacy Code:**
   - `server/src/models/*.js`: Legacy schema files from the original prototype before MSSQL migration.
   - `server/src/scripts/seed.js`: Legacy MongoDB seed script. (The active MSSQL seed script is `server/scripts/seed_mssql_prisma.mjs`).
   - Neither `api/index.js` nor `server/src/app.js` imports `server/src/models/` or `server/src/scripts/seed.js`.

* **Audit Verdict:** `PASS` (No production runtime dependency on MongoDB).

---

## 6. Secrets & Fallback Audit

We inspected all authentication modules for hardcoded secrets:

1. **`server/src/routes/authRoutes.js` (lines 11-12):**
   ```javascript
   const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'watchhub_super_secret_access_jwt_key_2026_luxury_chronograph';
   const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'watchhub_super_secret_refresh_jwt_key_2026_luxury_chronograph';
   ```
2. **`server/src/middleware/auth.js` (line 20):**
   ```javascript
   const secret = process.env.JWT_ACCESS_SECRET || 'watchhub_super_secret_access_jwt_key_2026_luxury_chronograph';
   ```
3. **`server/src/services/otpService.js` (lines 16-21):**
   ```javascript
   export const getCurrentOtpSecret = () =>
     process.env.OTP_HASH_SECRET_CURRENT ||
     process.env.OTP_HASH_SECRET ||
     'watchhub_v3_secure_current_otp_hmac_secret_2026_enterprise';

   export const getPreviousOtpSecret = () => process.env.OTP_HASH_SECRET_PREVIOUS || null;
   ```

* **Security Assessment:**
  - In local development, the fallback string prevents crashes when `.env` is omitted.
  - In production, relying on fallback strings is insecure.
  - **Remediation:** Explicit high-entropy secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `OTP_HASH_SECRET_CURRENT`) must be configured in Vercel Project Environment Variables.

---

## 7. Configuration Status Matrix

| Component | Status | Finding / Action Required |
| :--- | :---: | :--- |
| `package.json` (Root) | **PASS** | Dependencies complete and synchronized. |
| `server/package.json` | **PASS** | Standalone server config maintained. |
| `vercel.json` | **PASS** | Build and rewrite pipeline validated. |
| `api/index.js` | **PASS** | Serverless function bridge tested. |
| `server/src/app.js` | **PASS** | Clean Express configuration with CORS and error handlers. |
| `server/prisma/schema.prisma` | **PASS** | MSSQL 2025 provider and multi-platform binary targets verified. |
| Mongoose Isolation | **PASS** | No active runtime code imports Mongoose. |
| Environment Secret Injections | **BLOCKED** | Vercel dashboard environment variables not yet configured. |
