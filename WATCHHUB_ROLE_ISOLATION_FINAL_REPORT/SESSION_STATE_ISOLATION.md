# WATCHHUB ATELIER — SESSION & STATE ISOLATION

## 1. Synchronous Logout & Cache Purging
- **Old Defect**: `logout()` was asynchronous, awaiting `api.post('/auth/logout')` before updating React state. Fast navigation to `/login` caused `LoginPage` to see `isAuthenticated === true` and redirect back to the previous dashboard.
- **New Architecture**:
```javascript
  const logout = async () => {
    // 1. Immediately synchronously purge client-side authentication state
    setUser(null);
    setToken(null);
    localStorage.removeItem('watchhub_token');
    localStorage.removeItem('watchhub_auth_user');
    sessionStorage.clear();

    // 2. Clear backend session cookie asynchronously
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('[AuthContext] Backend logout notice:', err.message);
    }
  };
```

## 2. Cross-Role Login Sanitization
- When a user logs in as another role:
  - Any remaining session storage is purged.
  - Fresh identity is fetched and verified against cryptographic JWT.
  - Role-specific UI and navigation bars are rebuilt from scratch without reusing the previous role's cached DOM state.
