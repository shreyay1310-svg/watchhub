# WatchHub — Vercel Environment Variables Specification & Configuration

**Document:** `WATCHHUB_CLOUD_DATABASE_MIGRATION_PLAN/05_VERCEL_ENVIRONMENT_VARIABLES_SPECIFICATION.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Backend Security Specialist  
**Target:** Vercel Dashboard (`watchhub-store` / `prj_U15BE0GMlmSs8u0dL4L99hXV8M6L`)  
**Scope:** Source-code-verified environment variables, scoping, and input instructions.

---

## 1. Inventory of Required Environment Variables

A thorough audit of `server/src/app.js`, `server/src/routes/*.js`, `server/src/services/*.js`, and `server/prisma/schema.prisma` identified the following runtime environment variables:

| Variable Name | Required Scope | Functional Classification | Code Reference |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Production, Preview | **Required for Startup** | `schema.prisma` L12, `prisma.js` L10 |
| `NODE_ENV` | Production, Preview | **Required for Startup** | `app.js` L33, `authController.js` L101 |
| `CLIENT_URL` | Production | **Optional / Recommended** | `app.js` L19 |
| `JWT_ACCESS_SECRET` | Production, Preview | **Required for Auth** | `authRoutes.js` L11, `auth.js` L20 |
| `JWT_REFRESH_SECRET` | Production, Preview | **Required for Auth** | `authRoutes.js` L12, `authController.js` L15 |
| `OTP_HASH_SECRET_CURRENT`| Production, Preview, Dev | **Required for Auth** | `otpService.js` L17 |
| `OTP_HASH_SECRET_PREVIOUS`| Production | **Optional** (Key Rotation) | `otpService.js` L21 |
| `GMAIL_USER` | Production, Preview | **Required for Email** | `googleEmailService.js` L18 |
| `GMAIL_APP_PASSWORD` | Production, Preview | **Required for Email** | `googleEmailService.js` L19 |
| `RESEND_API_KEY` | Production, Preview | **Required for Email** (Fallback) | `resendService.js` L11 |
| `EMAIL_FROM` | Production, Preview | **Required for Email** | `resendService.js` L12 |
| `RAZORPAY_KEY_ID` | Production, Preview | **Required for Payments** | `razorpayService.js` L9 |
| `RAZORPAY_KEY_SECRET` | Production, Preview | **Required for Payments** | `razorpayService.js` L10 |

---

## 2. Safe Value Generation for Cryptographic Secrets

Do not invent predictable passwords or reuse existing personal strings. Use cryptographically random 256-bit (64-character hexadecimal) keys:

```powershell
# Run in PowerShell to generate random 256-bit keys for JWT and HMAC secrets:
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('OTP_HASH_SECRET_CURRENT=' + require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3. Step-by-Step Vercel Dashboard Configuration Procedure

To input these variables without exposing them in git history:

1. Open your web browser and sign in to Vercel.
2. Navigate directly to the project settings page:
   ```text
   https://vercel.com/13shreyayadav/watchhub-store/settings/environment-variables
   ```
3. In the **Key** field, enter the exact variable name (e.g. `DATABASE_URL`).
4. In the **Value** field, paste the corresponding secret or connection string.
5. In the **Environment** checkboxes:
   - Check **Production** for all variables.
   - Check **Preview** for all variables (except `CLIENT_URL` which automatically defaults to `*.vercel.app`).
   - Check **Development** only if team members pull envs locally via `vercel env pull`.
6. Click **Save**.
7. Repeat for each of the 12 variables in the inventory table.

---

## 4. Secret Scoping & Isolation Best Practice

* **Zero Production Credentials in Git:** The `.env` files inside `server/` and `client/` are ignored by `.gitignore`. Never commit `.env.production` or raw secrets to any branch.
* **Separation of Environments:** Preview deployments should use a dedicated staging database or distinct database user where possible.
* **Redeployment Requirement:** Adding or modifying environment variables in Vercel does not affect currently running functions until a new deployment is triggered via `npx vercel --prod`.
