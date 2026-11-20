# WatchHub Phase 7 — Local Operations & Developer Manual

**Document:** `WATCHHUB_PHASE_7_FINAL_REPORT/12_LOCAL_OPERATIONS_MANUAL.md`  
**Date:** November 20, 2026  
**Audience:** Developers, DevOps Engineers, and Quality Assurance Specialists  
**Operating Mode:** 100% Local Development Only  

---

## 1. Prerequisites & Environment Setup

Ensure the following local runtimes are operational on your Windows workstation:
1. **Node.js:** v20+ / v22+ / v26+ (ES Modules enabled).
2. **Microsoft SQL Server 2025 Developer Edition:** Active on `127.0.0.1:1433`.
3. **Database Name:** `WatchHubDB`.
4. **Java Development Kit:** OpenJDK 21.0.8 (installed at `C:\Program Files\Android\openjdk\jdk-21.0.8`).
5. **Android SDK:** Installed at `C:\Users\shrey\AppData\Local\Android\Sdk`.

---

## 2. Launching the Local Full-Stack Application

### 2.1. Start the Express Backend API
```powershell
# In PowerShell terminal 1:
cd c:\Users\shrey\OneDrive\Desktop\watchHub\server
npm run dev
# Server initializes at http://localhost:5000
# Connected to Microsoft SQL Server 2025 via Prisma 6.19.3
```

### 2.2. Start the React Frontend Application
```powershell
# In PowerShell terminal 2:
cd c:\Users\shrey\OneDrive\Desktop\watchHub\client
npm run dev
# Frontend initializes at http://localhost:5173
# Automatically proxies /api requests to http://localhost:5000
```

### 2.3. Run the Native Android Application (`android-native/`)
```powershell
# Set Java environment and compile:
$env:JAVA_HOME = "C:\Program Files\Android\openjdk\jdk-21.0.8"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
cd c:\Users\shrey\OneDrive\Desktop\watchHub\android-native

# Run unit tests:
.\gradlew.bat testDebugUnitTest

# Assemble debug APK:
.\gradlew.bat assembleDebug

# For physical devices over local Wi-Fi:
.\gradlew.bat assembleDebug -PapiHost=192.168.1.100:5000
```

---

## 3. Running Automated Test Suites

To execute the test suites and verify local system health:

### 3.1. Phase 7 Release Readiness Suite (14 Tests)
```powershell
node server/scripts/test_phase7_release_readiness_suite.mjs
```
* Validates Razorpay HMAC signatures, server price calculation, coupon thresholds, negative stock defense, and customer RBAC.

### 3.2. Luxury Email Template Suite (17 Tests)
```powershell
node server/scripts/test_luxury_email_suite.mjs
```
* Validates Swiss luxury HTML and plain-text template rendering, XSS sanitization, dynamic OTP injection, and RFC 2606 test domain sandbox interception.

### 3.3. Master Local Integration Suite (20 Tests)
```powershell
node server/scripts/test_master_local_suite.mjs
```
* Validates full customer authentication, live SQL Server connectivity, OTP cooldowns (429), and non-enumerating password recovery.

### 3.4. V3 Distributed OTP Concurrency Suite (20 Tests)
```powershell
node server/scripts/test_v3_otp_suite.mjs
```
* Validates distributed lease tokens, crash recovery, HMAC key rotation, timing-safe equality, and 5,000-record batch cleanup.

---

## 4. Default Seeded Credentials for Testing

| Role | Email Address | Password | Permissions & Dashboard |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@watchhub.luxury` | `Password123!` | `/dashboard/super-admin` (Full platform KPIs) |
| **Store Admin** | `storeadmin@watchhub.luxury` | `Password123!` | `/dashboard/store-admin` (POS & Order terminal) |
| **Inventory Manager** | `inventory@watchhub.luxury` | `Password123!` | `/inventory` (Stock balancing & movements) |
| **Delivery Manager** | `delivery@watchhub.luxury` | `Password123!` | `/delivery` (Logistics & courier dispatch) |
| **Customer Support** | `support@watchhub.luxury` | `Password123!` | `/support` (Customer ticketing & refunds) |
| **Customer** | `collector@watchhub.luxury` | `Password123!` | `/products`, `/cart`, `/checkout`, `/account` |

---

## 5. Maintenance & Troubleshooting Rules

1. **Never run `prisma migrate reset` or `db push --force-reset`:** This will erase customer records and inventory.
2. **Local SMTP Test Sandbox:** Any email dispatched to `@watchhub.test`, `.example`, `.invalid`, or `.localhost` is captured locally with zero outbound MX requests and zero bounce notifications.
3. **Real Customer Email Testing:** To deliver test emails to a real inbox during local development, set `DEV_TEST_EMAIL_RECIPIENT=your_email@gmail.com` in `server/.env`.
