# WatchHub — Production Deployment & Verification Checklist

**Document:** `WATCHHUB_VERCEL_PRODUCTION_READINESS/DEPLOYMENT_CHECKLIST.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Quality Assurance Specialist  
**Target:** Vercel Production (`watchhub-store`)  
**Scope:** Pre-Deployment, Deployment Execution, and Post-Deployment Smoke Test Runbook.

---

## 1. Pre-Deployment Verification Checklist

Every item in this section must be verified before executing `npx vercel --prod`.

| Phase | Check Item | Status | Verification Detail |
| :--- | :--- | :---: | :--- |
| **Codebase** | No uncommitted experimental edits | **PASS** | Clean working tree; all modified files validated. |
| **Codebase** | File size compliance ($\le 800$ lines) | **PASS** | All source code files comply with strict line limits. |
| **Dependencies** | Root `package.json` synchronized | **PASS** | `resend`, `nodemailer`, `razorpay`, `socket.io`, `prisma` present. |
| **Build** | Frontend Vite production build | **PASS** | `client/dist` compiles in ~12 seconds with 0 errors. |
| **Prisma** | Multi-platform query engines generated | **PASS** | `rhel-openssl-3.0.x` and `debian-openssl-3.0.x` binaries verified. |
| **Prisma** | Database provider configuration | **PASS** | `sqlserver` dialect with `url = env("DATABASE_URL")`. |
| **Routing** | `vercel.json` rewrites and entry point | **PASS** | `/api/*` routed to `api/index.js`; SPA routed to `index.html`. |
| **Tests** | V3 Distributed OTP Test Suite | **PASS** | 20 / 20 tests passing (`test_v3_otp_suite.mjs`). |
| **Tests** | Phase 2 Authentication Suite | **PASS** | 8 / 8 tests passing (`test_phase2_auth_verification.mjs`). |
| **Tests** | Android Native App Unit Tests | **PASS** | 15 / 15 tests passing (`testDebugUnitTest`). |
| **Cloud DB** | Cloud SQL Server Provisioned | **BLOCKED** | Target Azure SQL instance `WatchHubDB` not yet provisioned. |
| **Secrets** | Vercel Project Environment Variables | **BLOCKED** | `DATABASE_URL`, `JWT_...`, `OTP_...`, `GMAIL_...` not yet set in dashboard. |

---

## 2. Deployment Execution Runbook (Post-Approval)

> [!CAUTION]
> Do NOT execute these steps until:
> 1. The Cloud SQL Server database is provisioned and seeded.
> 2. All 12 production environment variables are added to Vercel Project Settings.
> 3. The user has given explicit written authorization to deploy.

### Step 1: Deploy to Vercel Production
From the repository root directory on Windows:

```powershell
# Authenticate & deploy directly to production without prompting for re-linking
npx vercel --prod
```

### Step 2: Inspect Deployment Build Output
Verify in terminal or Vercel Deployment Dashboard:
1. `npm install` runs and installs root dependencies.
2. `npx prisma generate` succeeds:
   ```text
   ✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client
   ```
3. Vite build succeeds:
   ```text
   ✔ built in 12.04s
   ```
4. Deployment completes with status `READY` at `https://watchhub-store-silk.vercel.app`.

---

## 3. Post-Deployment Verification Smoke Test Matrix

Immediately following deployment, execute these end-to-end verification tests against the live URL:

### Test 1: API Health Probe
```powershell
curl.exe -i "https://watchhub-store-silk.vercel.app/api/health"
```
* **Expected Result:** `HTTP/2 200 OK`, `{"status":"success","message":"WatchHub E-Commerce REST API is live and operational."}`.

### Test 2: CORS Preflight Verification
```powershell
curl.exe -i -X OPTIONS "https://watchhub-store-silk.vercel.app/api/auth/me" `
  -H "Origin: https://watchhub-store-silk.vercel.app" `
  -H "Access-Control-Request-Method: GET"
```
* **Expected Result:** `HTTP/2 204 No Content` or `200 OK`, `Access-Control-Allow-Origin: https://watchhub-store-silk.vercel.app`, `Access-Control-Allow-Credentials: true`.

### Test 3: Live Email OTP Dispatch
```powershell
curl.exe -i -X POST "https://watchhub-store-silk.vercel.app/api/auth/send-email-otp" `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"approved_test@yourdomain.com\",\"purpose\":\"registration\",\"name\":\"Test Collector\"}"
```
* **Expected Result:** `HTTP/2 200 OK`, `{"status":"success","identifier":"...","cooldownSeconds":60}`. Check real inbox for delivery.

### Test 4: Rate Limiting & Cooldown Protection
Immediately repeat the command from Test 3 within 60 seconds:
* **Expected Result:** `HTTP/2 429 Too Many Requests`, `{"status":"fail","waitSeconds":...}`.

### Test 5: End-to-End Registration & Verification
Open the live browser at `https://watchhub-store-silk.vercel.app/signup`:
1. Enter name, test email, and password.
2. Click **Create Collector Account**.
3. Verify OTP modal displays without error.
4. Input received 6-digit OTP.
5. Verify account creation, redirect to customer dashboard, and presence of auth token.

### Test 6: Authenticated `/api/auth/me` Check
```powershell
curl.exe -i "https://watchhub-store-silk.vercel.app/api/auth/me" `
  -H "Authorization: Bearer <RECEIVED_ACCESS_TOKEN>"
```
* **Expected Result:** `HTTP/2 200 OK`, user object matches registered account.
