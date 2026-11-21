# SERVICE WORKER AUDIT & CACHE PURGE

## 1. Audit Findings
The legacy Service Worker (`sw.js`) and PWA configuration registered an aggressive offline cache that intercepted HTML navigation requests. When an API call timed out or failed, it served a static `offline.html` ("Time Standstill") document, replacing the live React app shell and trapping users.

## 2. Hardened Service Worker Kill-Switch
1. `client/public/sw.js`:
   - Listens to `activate` event, deletes all caches via `caches.delete()`, and calls `self.registration.unregister()`.
   - `fetch` event passes all requests directly to `fetch(event.request)` without caching.
2. `client/index.html`:
   - Executes an immediate self-invoking function in `<head>` to unregister all active service workers across all scopes and wipe cache storage.
3. `client/src/utils/pwaRegister.js`:
   - Exports an uninstaller that sweeps for active worker registrations and disables offline interception.
