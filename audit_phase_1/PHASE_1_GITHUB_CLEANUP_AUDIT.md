# WatchHub — Phase 1 GitHub Repository Audit & Cleanup Proposal

This audit inspects the Git repository hygiene, tracked binary artifacts, sensitive configuration files, and exposed credentials.

---

## 1. Tracked Binary & Large File Audit

Git repositories are designed for text-based source code. Storing compiled binaries, Android APKs, and heavy PDFs in the Git tree bloats repository clone sizes and degrades DevOps CI/CD performance.

### Large Tracked Files Identified:
1. `WatchHub-v1.0.0.apk` (**8.86 MB**) — Root compiled Android binary.
2. `client/public/downloads/WatchHub-v1.0.0.apk` (**8.86 MB**) — Duplicate public download binary.
3. `client/public/downloads/WatchHub-latest.apk` (**8.86 MB**) — Duplicate public download binary.
4. `WatchHub_Project_Report.pdf` (**4.54 MB**) — Compiled binary PDF in root.
5. `docs/WatchHub_Project_Report.pdf` (**4.54 MB**) — Duplicate compiled PDF in `docs/`.
6. `watchhub_release.keystore` (**2.75 KB**) — **CRITICAL**: Android production signing keystore committed to Git root!

**Total Tracked Binary Bloat**: **~35.6 MB** across redundant copies.

---

## 2. Sensitive Credentials & Secrets Audit

### ⚠️ Real Exposed Secrets & Sensitive Keys Identified:

1. **Android Production Signing Keystore (`watchhub_release.keystore`)**:
   - *Status*: Committed to Git root.
   - *Risk*: Anyone with repository access possesses the cryptographic signing key for the Android application.
   - *Remediation*: Untrack file from Git (`git rm --cached watchhub_release.keystore`), add to `.gitignore`, and store keystore in a secure vault (Azure Key Vault / GitHub Actions Secret).
2. **Fast2SMS API Key**:
   - *Status*: Hardcoded as a fallback string literal in `server/src/services/smsService.js` (Line 4).
   - *Risk*: Public exposure if repository is pushed to a public remote.
   - *Remediation*: Immediately rotate the Fast2SMS API key on the Fast2SMS developer dashboard. Remove the fallback string literal from source code.
3. **Google App Password & Gmail User**:
   - *Status*: Stored in `server/.env`.
   - *Risk*: Fortunately, `server/.env` is ignored by `.gitignore` and is **NOT** tracked by Git (`git ls-files server/.env` returned empty). However, verify that no commit history contains `.env`.
   - *Remediation*: Keep `.env` strictly in `.gitignore`. Ensure production deployments inject credentials via Render/Vercel environment variables.
4. **Razorpay Fallback Test Keys**:
   - *Status*: `rzp_test_watchhub2026` / `watchhub_test_secret_key` present in `razorpayService.js` and `SettingsAuditModule.jsx`.
   - *Remediation*: Remove fallback test secret keys from source code.

---

## 3. Legacy & Redundant File Audit

The root directory contains legacy standalone HTML/CSS/JS files from an earlier prototyping phase that are completely superseded by the React Vite frontend in `client/`:
- `brands.html` (76.6 KB)
- `cart.html` (22.5 KB)
- `categories.html` (47.7 KB)
- `dashboard.html` (84.5 KB)
- `index.html` (149.8 KB)
- `login.html` (37.9 KB)
- `products.html` (47.9 KB)
- `signup.html` (35.1 KB)
- `wishlist.html` (11.8 KB)
- Legacy directories: `css/`, `js/`, `images/`, `database/` in root.

---

## 4. Proposed Repository Cleanup Plan (For Phase 2)

> **Phase 1 Restriction Respected**: In strict adherence to audit rules, **NO files were deleted, no git history was altered, and no commits or pushes were made during this audit.**

### Proposed Safe Cleanup Actions for Phase 2:
1. **Move Android Keystore to Secure Local Path**:
   ```powershell
   git rm --cached watchhub_release.keystore
   ```
   Add `*.keystore` and `*.jks` to `.gitignore`.
2. **Remove Redundant APK Binaries from Git**:
   ```powershell
   git rm --cached WatchHub-v1.0.0.apk
   git rm --cached client/public/downloads/*.apk
   ```
   Release binaries should be distributed via GitHub Releases or CDN, not tracked in source control.
3. **Archive Legacy HTML Files**:
   Create a `legacy_v1_prototype/` archive folder or safely remove the unused root `.html` files.
4. **Update `.gitignore`**:
   Add explicit rules:
   ```gitignore
   *.keystore
   *.jks
   *.apk
   *.pdf
   *.docx
   audit_phase_1/PHASE_1_EVIDENCE/
   ```
