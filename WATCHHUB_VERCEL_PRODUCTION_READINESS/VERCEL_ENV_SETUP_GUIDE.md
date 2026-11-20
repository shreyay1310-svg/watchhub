# WatchHub — Vercel Environment Setup & Configuration Guide

**Document:** `WATCHHUB_VERCEL_PRODUCTION_READINESS/VERCEL_ENV_SETUP_GUIDE.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Backend Architect  
**Target:** Vercel Dashboard Environment Variables (`watchhub-store`)  
**Scope:** Strict Specification, Classification, Procurement, and Secret Management Guide.

---

## 1. Environment Variable Classification

Every environment variable utilized by WatchHub has been evaluated from source code and classified into its exact operational tier:

| Environment Variable | Operational Tier | Criticality | Default Fallback if Omitted |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | **Required for Startup** | **CRITICAL** | None. Prisma crashes with `PrismaClientInitializationError`. |
| `NODE_ENV` | **Required for Startup** | **HIGH** | Defaults to `development`. Controls cookie security and stack traces. |
| `CLIENT_URL` | **Optional / Recommended** | **MEDIUM** | Defaults to standard array (`watchhub-store-silk.vercel.app`, `localhost:5173`). |
| `JWT_ACCESS_SECRET` | **Required for Authentication** | **CRITICAL** | Hardcoded dev string. Insecure if omitted in production. |
| `JWT_REFRESH_SECRET` | **Required for Authentication** | **CRITICAL** | Hardcoded dev string. Insecure if omitted in production. |
| `OTP_HASH_SECRET_CURRENT`| **Required for Authentication** | **CRITICAL** | Hardcoded dev string. Insecure if omitted in production. |
| `OTP_HASH_SECRET_PREVIOUS`| **Optional** | **LOW** | `null`. Only needed during live HMAC key rotation. |
| `GMAIL_USER` | **Required for Email Delivery** (Option A) | **HIGH** | None. Email OTP dispatch fails if Resend also missing. |
| `GMAIL_APP_PASSWORD` | **Required for Email Delivery** (Option A) | **HIGH** | None. Email OTP dispatch fails if Resend also missing. |
| `RESEND_API_KEY` | **Required for Email Delivery** (Option B) | **HIGH** | None. Acts as fallback if Gmail SMTP not configured. |
| `EMAIL_FROM` | **Required for Email Delivery** (Option B) | **MEDIUM** | Defaults to `WatchHub <onboarding@resend.dev>`. |
| `RAZORPAY_KEY_ID` | **Required for Payments Only** | **MEDIUM** | Mock sandbox keys (`rzp_test_watchhub2026`). Payment creation fails live. |
| `RAZORPAY_KEY_SECRET` | **Required for Payments Only** | **MEDIUM** | Mock sandbox key. Webhook signature verification fails live. |

---

## 2. Complete Variable Specification & Procurement Guide

### 2.1 Core Platform & Startup Variables

#### 1. `DATABASE_URL`
* **Purpose:** Prisma ORM connection string for Microsoft SQL Server.
* **Tier:** **Required for Startup**
* **Recommended Scopes:** `Production`, `Preview`, `Development` (Separate DB instances recommended for Production vs Dev).
* **Format:**
  ```text
  sqlserver://<server-host>.database.windows.net:1433;database=WatchHubDB;user=<db-user>;password=<db-password>;encrypt=true;trustServerCertificate=false
  ```
* **Procurement:**
  1. Provision a cloud-hosted Microsoft SQL Server (e.g. Azure SQL Database).
  2. Create an administrative or dedicated app login: `CREATE LOGIN watchhub_app WITH PASSWORD = '...'`.
  3. Grant `db_owner` or `db_datareader, db_datawriter, db_ddladmin` on `WatchHubDB`.
  4. Ensure server allows TLS 1.2+ encryption (`encrypt=true`).
* **Validation Method:** Run a one-line query test: `npx prisma db pull` or `SELECT 1` without echoing the connection string.

#### 2. `NODE_ENV`
* **Purpose:** Sets the Node.js runtime environment. When set to `production`, cookie flags enforce `secure: true`, stack traces are stripped from 500 responses, and Prisma reduces debug logging.
* **Tier:** **Required for Startup**
* **Recommended Scopes:** `Production` (set to `production`), `Preview` (set to `production`), `Development` (set to `development`).
* **Value:** `production`
* **Validation Method:** Verify `GET /api/health` response does not expose error stack traces on bad requests.

#### 3. `CLIENT_URL`
* **Purpose:** Configures primary CORS origin and password reset redirect links.
* **Tier:** **Optional / Recommended**
* **Recommended Scopes:**
  - `Production`: `https://watchhub-store-silk.vercel.app`
  - `Preview`: Automatically handled by wildcard `*.vercel.app` in `app.js`.
* **Validation Method:** Check `Access-Control-Allow-Origin` header in response to `OPTIONS /api/auth/me`.

---

### 2.2 Cryptographic Authentication Variables

#### 4. `JWT_ACCESS_SECRET`
* **Purpose:** Signs short-lived (1-hour) JSON Web Tokens for API authorization and RBAC verification.
* **Tier:** **Required for Authentication**
* **Recommended Scopes:** `Production`, `Preview` (Distinct random secrets per environment).
* **Generation Command (Safe):**
  ```bash
  # Generate a cryptographically secure 256-bit (64-character hex) secret:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
* **Validation Method:** Sign a dummy token and verify it against the secret in Node.js.

#### 5. `JWT_REFRESH_SECRET`
* **Purpose:** Signs long-lived (7-day) HTTP-only refresh tokens stored in cookies. Must be completely independent of `JWT_ACCESS_SECRET`.
* **Tier:** **Required for Authentication**
* **Recommended Scopes:** `Production`, `Preview`.
* **Generation Command (Safe):**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
* **Validation Method:** Ensure the token cannot be verified with `JWT_ACCESS_SECRET`.

#### 6. `OTP_HASH_SECRET_CURRENT`
* **Purpose:** Dedicated HMAC-SHA256 key used by V3 OTP persistence (`otpService.js`) to hash OTPs before storing them in SQL Server `OTPVerifications`. Zero fallback to JWT secret ensures zero security coupling.
* **Tier:** **Required for Authentication**
* **Recommended Scopes:** `Production`, `Preview`, `Development`.
* **Generation Command (Safe):**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
* **Validation Method:** Verified by test suite `test_v3_otp_suite.mjs` (TC_V3_013 passed).

#### 7. `OTP_HASH_SECRET_PREVIOUS`
* **Purpose:** Graceful zero-downtime key rotation. When rotating `OTP_HASH_SECRET_CURRENT`, old active OTPs hashed under the previous key remain verifiable during their 5-minute validity window.
* **Tier:** **Optional**
* **Recommended Scopes:** `Production`. Leave empty unless executing key rotation.
* **Validation Method:** Verified by test suite `test_v3_otp_suite.mjs` (TC_V3_014 passed).

---

### 2.3 Email Delivery Variables (Dual-Provider Strategy)

WatchHub implements a resilient dual-provider architecture in `otpService.js`:
- **Primary:** Google Gmail SMTP via Nodemailer (`smtp.gmail.com:465`).
- **Fallback:** Resend HTTP API (`https://api.resend.com/emails`).

#### 8. `GMAIL_USER`
* **Purpose:** The Gmail address used to authenticate outbound SMTP connections.
* **Tier:** **Required for Email Delivery** (Option A)
* **Recommended Scopes:** `Production`, `Preview`.
* **Procurement:** Use the designated notification mailbox (e.g. `watchhub.atelier@gmail.com`).
* **Validation Method:** Log check masks user identity: `sh***10@gmail.com`.

#### 9. `GMAIL_APP_PASSWORD`
* **Purpose:** A dedicated 16-character Google App Password (not the user's primary account password).
* **Tier:** **Required for Email Delivery** (Option A)
* **Recommended Scopes:** `Production`, `Preview`.
* **Procurement:**
  1. Open Google Account Security: `https://myaccount.google.com/security`.
  2. Ensure **2-Step Verification** is turned ON.
  3. Navigate to **App passwords** (`https://myaccount.google.com/apppasswords`).
  4. Create app named `WatchHub Production`.
  5. Copy the 16-character generated key (spaces are automatically stripped by `googleEmailService.js`).
* **Validation Method:** Run `verifyGmailSmtp()` from `googleEmailService.js`.

#### 10. `RESEND_API_KEY`
* **Purpose:** API key for Resend email dispatch.
* **Tier:** **Required for Email Delivery** (Option B / Fallback)
* **Recommended Scopes:** `Production`, `Preview`.
* **Procurement:**
  1. Register at `https://resend.com`.
  2. Navigate to **API Keys** > **Create API Key**.
  3. Copy `re_...` key.
* **Validation Method:** Verify HTTP 200 from `POST https://api.resend.com/emails` with a sandbox address.

#### 11. `EMAIL_FROM`
* **Purpose:** Sender envelope and header displayed to collectors.
* **Tier:** **Required for Email Delivery** (Option B)
* **Recommended Scopes:** `Production`, `Preview`.
* **Procurement:**
  - If using Resend with custom verified domain: `"WatchHub Atelier <concierge@watchhub.luxury>"`.
  - If using Resend sandbox: `"WatchHub <onboarding@resend.dev>"`.
* **Validation Method:** Sent emails reflect sender name and reply-to address correctly.

---

### 2.4 Payment Gateway Variables

#### 12. `RAZORPAY_KEY_ID`
* **Purpose:** Razorpay Public Key ID passed to client checkout and order creation.
* **Tier:** **Required for Payments Only**
* **Recommended Scopes:** `Production` (Live mode key), `Preview` / `Development` (Test mode key).
* **Procurement:**
  1. Log into Razorpay Dashboard: `https://dashboard.razorpay.com/app/keys`.
  2. In Test/Live mode, generate API Keys. Key starts with `rzp_test_...` or `rzp_live_...`.
* **Validation Method:** Request `POST /api/payments/create-order` with ₹1.00 amount.

#### 13. `RAZORPAY_KEY_SECRET`
* **Purpose:** HMAC-SHA256 signature verification key for payments and refunds.
* **Tier:** **Required for Payments Only**
* **Recommended Scopes:** `Production` (Live secret), `Preview` (Test secret).
* **Validation Method:** Signature validation passes against known payment signature in unit test.

---

## 3. Step-by-Step Vercel Dashboard Configuration Procedure

To securely input these values into Vercel without exposing secrets in logs or git:

1. Open your browser and navigate to:
   ```text
   https://vercel.com/13shreyayadav/watchhub-store/settings/environment-variables
   ```
2. For each variable in the table below, enter the **Key** and **Value**:

| Key | Value Source | Production | Preview | Development |
| :--- | :--- | :---: | :---: | :---: |
| `DATABASE_URL` | Cloud SQL Server Connection String | Checked | Checked | Optional |
| `NODE_ENV` | `production` | Checked | Checked | Unchecked |
| `CLIENT_URL` | `https://watchhub-store-silk.vercel.app` | Checked | Unchecked | Unchecked |
| `JWT_ACCESS_SECRET` | 32-byte crypto hex | Checked | Checked | Checked |
| `JWT_REFRESH_SECRET` | 32-byte crypto hex | Checked | Checked | Checked |
| `OTP_HASH_SECRET_CURRENT`| 32-byte crypto hex | Checked | Checked | Checked |
| `GMAIL_USER` | Gmail address | Checked | Checked | Checked |
| `GMAIL_APP_PASSWORD` | 16-char Google App Password | Checked | Checked | Checked |
| `RESEND_API_KEY` | Resend API key (`re_...`) | Checked | Checked | Checked |
| `EMAIL_FROM` | Sender address string | Checked | Checked | Checked |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | Checked | Checked | Checked |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Checked | Checked | Checked |

3. Click **Save** after adding each variable.
4. **Important:** Environment variables do not take effect on currently deployed serverless functions until a new deployment is triggered.
