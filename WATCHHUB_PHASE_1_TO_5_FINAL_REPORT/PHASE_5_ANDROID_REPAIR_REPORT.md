# WatchHub — Phase 5: Native Android Repair Report

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/PHASE_5_ANDROID_REPAIR_REPORT.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Android Engineer & Security Specialist  
**Project Directory:** `android-native/`  
**Package Name:** `com.watchhub.nativeapp`  
**Architecture:** Jetpack Compose + MVVM + Retrofit + OkHttp + Android Keystore  

---

## 1. Native Android Architecture Verification

The `android-native/` codebase was inspected and audited:

* **UI Layer:** Jetpack Compose (Material 3), Navigation Compose, unidirectional data flow.
* **ViewModel Layer:** AndroidX Lifecycle ViewModels, StateFlow, Coroutines.
* **Domain / Repository Layer:** Clean repository interfaces with mock and remote implementations (`AuthRepositoryImpl`).
* **Remote Network Layer:** Retrofit 2.11.0, OkHttp 4.12.0, Gson converter.
* **Security & Tokens:** `EncryptedTokenManager` backed by `EncryptedSharedPreferences` and hardware-backed Android Keystore keys (AES-256-GCM).
* **Legacy Directories Preserved:** `android/` and `android_legacy_backup/` were left completely untouched.

---

## 2. Network Configuration & Local Development Support

In `android-native/app/build.gradle.kts`:
```kotlin
debug {
    isMinifyEnabled = false
    // Configurable base URL: Emulator uses 10.0.2.2:5000 by default.
    // Physical devices can override via -PapiHost=192.168.x.x:5000
    val apiHost = project.findProperty("apiHost") as? String ?: "10.0.2.2:5000"
    buildConfigField("String", "BASE_URL", "\"http://$apiHost/api/\"")
    buildConfigField("Boolean", "IS_DEBUG", "true")
}
release {
    isMinifyEnabled = true
    buildConfigField("String", "BASE_URL", "\"https://api.watchhub.atelier.com/api/\"")
    buildConfigField("Boolean", "IS_DEBUG", "false")
}
```

* **Local Emulator:** Automatically connects to host machine's Express server via Android emulator loopback alias `http://10.0.2.2:5000/api/`.
* **Physical Device Over Wi-Fi:** Overridable at compile time:
  ```powershell
  .\gradlew.bat assembleDebug -PapiHost=192.168.1.50:5000
  ```
* **Cleartext Traffic Control:** `android:usesCleartextTraffic="true"` is restricted to debug builds in `src/debug/AndroidManifest.xml`. Release builds strictly enforce HTTPS.

---

## 3. Automated Unit Test Execution & Verification

Gradle unit test suite was executed against repository and authentication flows:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\openjdk\jdk-21.0.8"
cd android-native
.\gradlew.bat testDebugUnitTest
```

### Verified Test Cases:
1. `testSuccessfulLoginReturnsSuccess` — **PASS**
2. `testInvalidCredentialsReturnsFailure` — **PASS**
3. `testNetworkErrorReturnsFailure` — **PASS**
4. `testRegistrationSuccess` — **PASS**
5. `testRegistrationDuplicateEmail` — **PASS**
6. `testSendEmailOtpSuccess` — **PASS**
7. `testSendEmailOtpCooldown` — **PASS**
8. `testVerifyEmailOtpSuccess` — **PASS**
9. `testVerifyEmailOtpInvalidCode` — **PASS**
10. `testEmailLoginSuccess` — **PASS**
11. `testForgotPasswordSuccess` — **PASS**
12. `testResetPasswordSuccess` — **PASS**
13. `testGetCurrentUserWithValidToken` — **PASS**
14. `testHttp401ClearsToken` — **PASS**
15. `testLogoutClearsCredentials` — **PASS**

* **Execution Result:** **`BUILD SUCCESSFUL in 14s`** (24 actionable tasks, 0 test failures).
* **Test Report:** Verified in `android-native/app/build/reports/tests/testDebugUnitTest/index.html`.
