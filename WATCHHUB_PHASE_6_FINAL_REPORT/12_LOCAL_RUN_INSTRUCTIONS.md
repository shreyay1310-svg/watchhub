# WatchHub — Phase 6: Local Run Instructions

**Document:** `WATCHHUB_PHASE_6_FINAL_REPORT/12_LOCAL_RUN_INSTRUCTIONS.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Full-Stack Developer  
**Scope:** Developer manual for running backend, frontend, local database, and Android.

---

## 1. System Requirements

* **Operating System:** Windows 10/11 x64
* **Node.js:** v20.x or v22.x+ (Verified on Node v26.4.0)
* **Database:** Microsoft SQL Server 2025 on `127.0.0.1:1433` (`WatchHubDB`)
* **Java SDK:** OpenJDK 21 (for Android native Gradle builds)
* **Android SDK:** API Level 35, Build Tools 35.0.0

---

## 2. Daily Local Development Commands

### Step 1: Start Express Backend API Server
```powershell
# In terminal 1 (Project Root):
npm run dev:server
```
* **Runs:** `node --watch src/server.js` inside `server/`.
* **URL:** `http://localhost:5000`
* **Health Endpoint:** `http://localhost:5000/api/health`

### Step 2: Start React Frontend Application
```powershell
# In terminal 2 (Project Root):
npm run dev:client
```
* **Runs:** `vite` inside `client/`.
* **URL:** `http://localhost:5173`
* **Proxy Behavior:** Automatically proxies `/api/*` requests to `http://localhost:5000/api/*`.

### Step 3: Run Native Android Application
* **In Android Studio:** Open directory `android-native/`.
* **Android Emulator:** Automatically targets `http://10.0.2.2:5000/api/` (mapping to `localhost:5000`).
* **Physical Device over Wi-Fi:**
  ```powershell
  cd android-native
  .\gradlew.bat installDebug -PapiHost=<YOUR_PC_LAN_IP>:5000
  ```

---

## 3. Running Automated Test Suites

```powershell
# 1. Phase 6 E-Commerce & RBAC Validation Suite (19 tests):
node server/scripts/test_phase6_ecommerce_suite.mjs

# 2. Master Local Integration Suite (20 tests):
node server/scripts/test_master_local_suite.mjs

# 3. V3 Distributed OTP Concurrency Suite (20 tests):
node server/scripts/test_v3_otp_suite.mjs

# 4. Android Native Unit Tests (15 tests):
cd android-native
$env:JAVA_HOME = "C:\Program Files\Android\openjdk\jdk-21.0.8"
.\gradlew.bat testDebugUnitTest
```
