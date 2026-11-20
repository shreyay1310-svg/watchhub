# WATCHHUB PHASE 2 – VERCEL PRODUCTION ENVIRONMENT CONFIGURATION
## Comprehensive Environment Variable Setup Guide

**Target Vercel Project:** `watchhub-store` (`prj_U15BE0GMlmSs8u0dL4L99hXV8M6L`)  
**Production Domain:** `https://watchhub-store-silk.vercel.app`  
**Configuration Location:** Vercel Dashboard $\rightarrow$ **watchhub-store** $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**

---

### 1. ENVIRONMENT VARIABLE INVENTORY

| Variable Name | Required / Optional | Target Environments | Consuming Modules | Description & Safe Value Guidance | Requires Redeploy |
|---|---|---|---|---|---|
| `DATABASE_URL` | **REQUIRED** | Production, Preview, Development | `server/src/config/prisma.js`<br>`server/prisma/schema.prisma` | Microsoft SQL Server 2025 / Azure SQL connection string. **Must be accessible from Vercel's cloud IP addresses.**<br>Format: `sqlserver://<cloud-host>:1433;database=WatchHubDB;user=<db-user>;password=<db-pass>;encrypt=true;trustServerCertificate=true` *(Local `127.0.0.1:1433` cannot be reached from Vercel cloud serverless containers).* | **YES** |
| `NODE_ENV` | **REQUIRED** | Production (`production`), Preview (`preview`), Dev (`development`) | `server/src/app.js`<br>`server/src/server.js` | Sets operational mode. In production, enables strict security headers, secure cookie transmission, and suppresses internal error stack traces. Value: `production`. | **YES** |
| `CLIENT_URL` | **REQUIRED** | Production, Preview | `server/src/app.js`<br>`server/src/server.js` | Canonical frontend origin for CORS verification. Value: `https://watchhub-store-silk.vercel.app`. | **YES** |
| `JWT_ACCESS_SECRET` | **REQUIRED** | Production, Preview, Development | `server/src/middleware/auth.js`<br>`server/src/controllers/authController.js`<br>`server/src/routes/authRoutes.js` | 64+ character high-entropy cryptographic secret for signing customer and administrator access tokens (1-hour validity). | **YES** |
| `JWT_REFRESH_SECRET` | **REQUIRED** | Production, Preview, Development | `server/src/controllers/authController.js`<br>`server/src/routes/authRoutes.js` | 64+ character high-entropy cryptographic secret for signing 7-day session refresh tokens stored in HTTP-only cookies. | **YES** |
| `OTP_HASH_SECRET_CURRENT` | **REQUIRED** | Production, Preview, Development | `server/src/services/otpService.js` | Dedicated HMAC-SHA256 secret for one-way hashing of 6-digit verification codes. Decoupled from JWT secrets to prevent privilege coupling. | **YES** |
| `OTP_HASH_SECRET_PREVIOUS` | **OPTIONAL** | Production, Preview | `server/src/services/otpService.js` | Optional secondary secret used exclusively during zero-downtime key rotation windows. Leave unset during normal operations. | **YES** |
| `GMAIL_USER` | **REQUIRED** (Primary Email) | Production, Preview, Development | `server/src/services/googleEmailService.js`<br>`server/src/services/otpService.js` | Verified Google Workspace / Gmail address used for primary SMTP OTP dispatch (e.g. `concierge@watchhub.luxury` or verified Gmail). | **YES** |
| `GMAIL_APP_PASSWORD` | **REQUIRED** (If `GMAIL_USER` set) | Production, Preview, Development | `server/src/services/googleEmailService.js`<br>`server/src/services/otpService.js` | 16-character Google App Password generated under Google Account Security $\rightarrow$ 2-Step Verification $\rightarrow$ App Passwords. | **YES** |
| `RESEND_API_KEY` | **OPTIONAL** (Fallback Email) | Production, Preview, Development | `server/src/services/resendService.js`<br>`server/src/services/otpService.js` | Resend API Key (`re_...`) for fallback email delivery if Gmail SMTP is unreachable. Requires a verified domain in Resend. | **YES** |
| `EMAIL_FROM` | **OPTIONAL** | Production, Preview | `server/src/services/resendService.js`<br>`server/src/services/otpService.js` | Verified custom domain sender header (e.g. `WatchHub Concierge <no-reply@watchhub.in>`). Defaults to Resend sandbox if unset. | **YES** |
| `RAZORPAY_KEY_ID` | **REQUIRED** (For Payments) | Production, Preview, Development | `server/src/services/razorpayService.js` | Official Razorpay key ID for payment order creation and checkout processing. | **YES** |
| `RAZORPAY_KEY_SECRET` | **REQUIRED** (For Payments) | Production, Preview, Development | `server/src/services/razorpayService.js` | Razorpay webhook and checkout signature verification secret. | **YES** |

---

### 2. CRITICAL DATABASE ARCHITECTURE NOTICE

> [!IMPORTANT]
> **Vercel Serverless Function Database Connectivity Requirement**
> The local Microsoft SQL Server 2025 (`127.0.0.1:1433`) is hosted on the local development machine. Serverless functions executing in Vercel's AWS Mumbai (`bom1`) microVMs cannot connect to `127.0.0.1:1433` directly.
> 
> To enable live production database operations on `https://watchhub-store-silk.vercel.app`, one of the following must be provisioned:
> 1. **Cloud SQL Server / Azure SQL**: Deploy `WatchHubDB` to Azure SQL Database or an AWS RDS for SQL Server instance, and configure `DATABASE_URL` with the cloud host address.
> 2. **Secure Tunnel / Reverse Proxy**: Forward port 1433 via a secure tunnel (e.g. Cloudflare Tunnel, ngrok TCP, or a VPS with static IP).
> 3. **Standalone Dedicated Backend**: Host the Node.js Express server on a cloud provider (e.g. Render, Railway, DigitalOcean, AWS EC2) and point `VITE_API_URL` to that deployed URL.

---

### 3. VERCEL DASHBOARD CONFIGURATION STEPS

1. Open your browser and navigate to:
   `https://vercel.com/13shreyayadav/watchhub-store/settings/environment-variables`
2. For each variable in Section 1, click **Add Variable**:
   * Enter the **Key**.
   * Paste the **Value**.
   * Select environments: **Production**, **Preview**, and **Development**.
   * Click **Save**.
3. Once all variables are configured, trigger a new deployment from the latest Git commit:
   `npx vercel --prod`
   or click **Redeploy** on the latest deployment in the Vercel dashboard.
