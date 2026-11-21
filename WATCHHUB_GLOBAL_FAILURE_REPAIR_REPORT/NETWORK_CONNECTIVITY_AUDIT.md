# NETWORK CONNECTIVITY AUDIT

## 1. Network Health Architecture
WatchHub uses a dedicated network health provider (`client/src/context/NetworkStatusContext.jsx`) managing 5 distinct connectivity states:
1. `ONLINE`: Full bidirectional connectivity to local REST backend at `http://localhost:5000/api/health`.
2. `BACKEND_UNAVAILABLE`: Local Express server offline; app retains authenticated state and cart locally.
3. `REQUEST_TIMEOUT`: Backend request exceeded the 4000ms threshold.
4. `INTERNET_OFFLINE`: Physical device network adapter disconnected (`navigator.onLine === false`).
5. `AUTHENTICATION_EXPIRED`: JWT token revoked or expired (401 response).

## 2. Axios Interceptor Health Signals
In `client/src/services/api.js`:
- Timeout events emit `watchhub-network-issue` with type `REQUEST_TIMEOUT`.
- Connection drops emit `BACKEND_UNAVAILABLE`.
- 401 Unauthorized signals emit `AUTHENTICATION_EXPIRED`.

## 3. Safe Failure Handling
The network monitor runs asynchronously and never halts the UI or prevents local interactions. When network fluctuates, the application preserves user state without flashing errors or collapsing views.
