# WatchHub — Phase 1 GitHub Cleanup & Repository Hygiene Results

This report documents the security untracking, keystore backup, secret detection in Git history, and repository cleanup actions taken for Phase 1.

---

## 1. Keystore Safe Backup & Untracking

### Action Performed:
1. **Physical Backup Created**:
   * Keystore file `watchhub_release.keystore` was safely copied to `keystores_backup/watchhub_release.keystore`.
   * Verified existence: `Test-Path keystores_backup\watchhub_release.keystore` returns `True`.
2. **Git Cache Removal (`git rm --cached`)**:
   * Executed: `git rm --cached watchhub_release.keystore`
   * Git Status Evidence:
     ```text
     Changes to be committed:
       deleted: watchhub_release.keystore
     ```
   * Result: The keystore will never be pushed to remote GitHub repositories in future commits, while the physical signing key is safely preserved locally on the developer machine.

---

## 2. Redundant Heavy Binaries Untracking

### Action Performed:
Untracked production APK binaries that were previously committed into Git:
* `WatchHub-v1.0.0.apk`
* `client/public/downloads/WatchHub-latest.apk`
* `client/public/downloads/WatchHub-v1.0.0.apk`

### Git Staging Evidence:
```text
Changes to be committed:
  deleted: WatchHub-v1.0.0.apk
  deleted: client/public/downloads/WatchHub-latest.apk
  deleted: client/public/downloads/WatchHub-v1.0.0.apk
  deleted: watchhub_release.keystore
```
Updated `.gitignore` to strictly exclude all `*.apk` and `*.keystore` files without exceptions.

---

## 3. Active Secret Remediation & Git History Audit

### Active Source Code Scrubbing:
* **Finding**: Hardcoded Google Maps API key `'AIzaSyAK25btTdE6-2bU8D1K51pY1m3StDOSC-U'` was detected in:
  - `client/src/components/common/GoogleMapAddressPicker.jsx`
  - `client/src/components/common/GoogleMapLiveTracking.jsx`
* **Remediation**: Replaced with `import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''`.
* **Verification**: `git grep 'AIzaSyAK25btTdE6-2bU8D1K51pY1m3StDOSC-U'` returns 0 occurrences across active working tree.

### Historical Commit Audit:
* **Command Executed**: `git log -S "AIzaSyAK25btTdE6-2bU8D1K51pY1m3StDOSC-U" --oneline`
* **Finding**:
  ```text
  7ff2b2d feat(maps): configure production Google Maps API key for address picker and live GPS tracking
  ```
* **Security Recommendation**: Key in commit `7ff2b2d` should be regenerated/rotated on Google Cloud Console. Per strict execution instruction *"Do not rewrite Git history or push changes without approval"*, Git commit history was preserved intact until formal user authorization.

---

## 4. Root HTML Prototypes Dependency Audit & Archival

* **Inventory**: 9 legacy static prototypes found in root: `brands.html`, `cart.html`, `categories.html`, `dashboard.html`, `index.html`, `login.html`, `products.html`, `signup.html`, `wishlist.html`.
* **Dependency Check**: Verified zero imports or references across `client/src/` and `server/src/`.
* **Vite React Architecture**: Production application runs exclusively out of `client/index.html` with React Router.
* **Status**: Prototypes documented for safe archiving to `archive/html_prototypes/`.

---

## 5. Verification Checklist
- [x] Android Keystore physically backed up before cache removal.
- [x] `git rm --cached` executed for keystore and APK binaries.
- [x] Hardcoded secrets removed from active codebase.
- [x] Exposed secret in Git history identified (`commit 7ff2b2d`).
- [x] `.env` files and binaries strictly excluded in `.gitignore`.
- [x] Zero Git history rewrites or unauthorized pushes performed.
