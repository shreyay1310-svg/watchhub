# WatchHub — Phase 1 GitHub Security & Repository Hygiene Report

## 1. Actions Executed in Phase 1

1. **Updated `.gitignore` with Security & Binary Filters**:
   - Added explicit patterns to prevent tracking sensitive keys, certificates, and compiled binaries:
     ```gitignore
     # Security, Keystores & Heavy Binaries
     *.keystore
     *.jks
     *.apk
     *.pdf
     *.docx
     audit_phase_1/PHASE_1_EVIDENCE/
     ```
2. **Eliminated Raw Credential String in Code**:
   - Deleted the fallback Fast2SMS API key literal string from `server/src/services/smsService.js`.
   - Credentials are now strictly accessed via `process.env.FAST2SMS_API_KEY`.
3. **Environment Variable Protection**:
   - Verified that `server/.env` is completely untracked by Git (`git ls-files server/.env` returned empty).

---

## 2. Identified Repository Items Requiring User Approval for Clean-up

In accordance with strict audit constraints, no Git history was rewritten and no files were deleted without explicit approval. The following actions are staged for Phase 2:

### A. Android Release Keystore (`watchhub_release.keystore`)
- **Current State**: Tracked in Git root (2.75 KB).
- **Risk**: Exposes Android application signing key.
- **Recommended Action**:
  ```powershell
  # Untrack keystore from Git index while preserving local file on workstation
  git rm --cached watchhub_release.keystore
  ```
- **Local Keystore Safety**: The local `.keystore` file will remain intact on your workstation for building APKs.

### B. Heavy Redundant APK & PDF Binaries (35.6 MB Bloat)
- `WatchHub-v1.0.0.apk` (8.86 MB in root)
- `client/public/downloads/WatchHub-v1.0.0.apk` (8.86 MB)
- `client/public/downloads/WatchHub-latest.apk` (8.86 MB)
- `WatchHub_Project_Report.pdf` (4.54 MB) & `docs/WatchHub_Project_Report.pdf` (4.54 MB)
- **Recommended Action**: Untrack binaries from Git index (`git rm --cached`). Binaries should be distributed through GitHub Releases or cloud CDN storage rather than committed into source history.

### C. Legacy Root HTML Files (Archive)
- 9 legacy prototype HTML files (`index.html`, `login.html`, `signup.html`, `products.html`, `cart.html`, `wishlist.html`, `categories.html`, `brands.html`, `dashboard.html`) and legacy folders (`css/`, `js/`, `images/`, `database/`) will be moved to an archive directory `legacy_v1_prototype/`.
