# WATCHHUB ATELIER — LOCAL RUN GUIDE
**Phase 9 Final Report — Authentication, Mobile OTP & Razorpay Setup**  
**Mode:** 100% LOCAL DEVELOPMENT ONLY | **Cost:** ₹0

---

## 1. Prerequisites
- **Node.js:** v20.x or higher (tested on v26.4.0)
- **Database:** Microsoft SQL Server 2025 Express / Developer Edition running on `127.0.0.1:1433`
- **Database Name:** `WatchHubDB`
- **Tools:** PowerShell / Windows Terminal, Git

---

## 2. Environment Configuration

Verify that `server/.env` contains the required local development settings:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="sqlserver://127.0.0.1:1433;database=WatchHubDB;integratedSecurity=true;trustServerCertificate=true;"

# Authentication Secrets
JWT_SECRET=watchhub_jwt_super_secret_local_dev_2026
JWT_REFRESH_SECRET=watchhub_refresh_super_secret_local_dev_2026
OTP_SECRET_CURRENT=c4a9f3b8e7d210563489abcef123456789abcdef0123456789abcdef01234567
OTP_SECRET_PREVIOUS=a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0

# Email Delivery (Gmail SMTP)
EMAIL_SERVICE=gmail
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password

# Mobile SMS Configuration (₹0 Local Mock)
ENABLE_PRODUCTION_SMS=false

# Razorpay Test Mode Configuration
RAZORPAY_KEY_ID=rzp_test_watchhub2026
RAZORPAY_KEY_SECRET=rzp_test_secret_watchhub2026
```

---

## 3. Starting the Services

### Terminal 1: Backend Server (Node.js + Express)
```powershell
cd server
node src/server.js
```
*Expected Output:*
```
[Database] Microsoft SQL Server 2025 (WatchHubDB) connected successfully via Prisma.
[OTP Cleanup Worker] Started with batchSize=500, interval=60000ms.
[WatchHub Server] Running on http://localhost:5000
```

### Terminal 2: Frontend Client (React 18 + Vite)
```powershell
cd client
npm run dev
```
*Expected Output:*
```
VITE v6.x ready in 350 ms
➜  Local:   http://localhost:5173/
```

---

## 4. Running the Automated Test Suites

### Run Phase 9 Authentication & Payment Suite
```powershell
node server/scripts/test_phase9_auth_payment_suite.mjs
```

### Run OTP V3 Concurrency & Resilience Suite
```powershell
node server/scripts/test_v3_otp_suite.mjs
```

### Run Luxury Email Security Suite
```powershell
node server/scripts/test_luxury_email_suite.mjs
```

### Verify Strict Line Limits (< 800 lines/file)
```powershell
node server/scripts/check_line_limits.mjs
```
