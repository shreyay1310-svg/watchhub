# WatchHub — Local Development & Run Guide

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/LOCAL_RUN_GUIDE.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Full-Stack Developer  
**Scope:** Developer manual for local environment setup, startup, and testing.

---

## 1. System Requirements

* **Operating System:** Windows 10/11 x64
* **Node.js:** v20.x or v22.x+ (Currently verified on Node v26.4.0)
* **Database:** Microsoft SQL Server 2025 on `127.0.0.1:1433` (Database name: `WatchHubDB`)
* **Java SDK:** OpenJDK 21 (for Android native Gradle builds)
* **Android SDK:** API Level 35, Build Tools 35.0.0

---

## 2. Daily Local Development Workflow

### Step 1: Start the Backend API Server
```powershell
# In terminal 1 (Project Root):
npm run dev:server
```
* **Runs:** `node --watch src/server.js` inside `server/`.
* **URL:** `http://localhost:5000`
* **Health Check:** `http://localhost:5000/api/health`

### Step 2: Start the React Frontend Application
```powershell
# In terminal 2 (Project Root):
npm run dev:client
```
* **Runs:** `vite` inside `client/`.
* **URL:** `http://localhost:5173`
* **Proxy Behavior:** Requests to `/api/*` automatically forward to `http://localhost:5000/api/*`.

### Step 3: Run the Native Android Application
* **In Android Studio:** Open directory `android-native/`.
* **Android Emulator:** Automatically connects to host machine backend at `http://10.0.2.2:5000/api/`.
* **Physical Device over Wi-Fi:**
  ```powershell
  cd android-native
  .\gradlew.bat installDebug -PapiHost=<YOUR_PC_LAN_IP>:5000
  ```

---

## 3. Running Automated Test Suites

```powershell
# 1. Master Local Integration Suite (15 tests: auth, DB, OTP, catalog):
node server/scripts/test_master_local_suite.mjs

# 2. V3 Distributed OTP Concurrency Suite (20 tests: leases, rotation, timingSafeEqual):
node server/scripts/test_v3_otp_suite.mjs

# 3. Android Native Unit Tests (15 tests: MVVM, Keystore, Interceptors):
cd android-native
$env:JAVA_HOME = "C:\Program Files\Android\openjdk\jdk-21.0.8"
.\gradlew.bat testDebugUnitTest
```
