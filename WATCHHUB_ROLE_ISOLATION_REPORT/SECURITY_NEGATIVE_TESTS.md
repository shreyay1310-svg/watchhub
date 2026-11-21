# WATCHHUB ATELIER — SECURITY NEGATIVE TESTS

## 1. Authentication Security Assertions

| Test Case | Attack / Negative Vector | Expected Outcome | Actual Outcome | Status |
|---|---|---|---|:---:|
| **SEC-01** | Invalid password submission (`WrongPassword!999`) | HTTP 401 Unauthorized | HTTP 401 `{ status: 'fail', message: 'Invalid email or password.' }` | **PASS** |
| **SEC-02** | Non-existent user email login | HTTP 401 Unauthorized | HTTP 401 `{ status: 'fail', message: 'Invalid email or password.' }` | **PASS** |
| **SEC-03** | Tampered JWT access token in `Authorization` header | HTTP 401 / 403 Forbidden | Token rejected, unauthorized access blocked | **PASS** |
| **SEC-04** | Client-side `switchRole(...)` call in console | Role remains immutable | Console security alert emitted; session role unmodified | **PASS** |
| **SEC-05** | Unauthorized direct route navigation (Customer visiting `/super-admin/*`) | Access restricted | `AccessDeniedScreen` rendered; privileged content blocked | **PASS** |
| **SEC-06** | Deactivated account login attempt | HTTP 403 Forbidden | HTTP 403 `{ status: 'fail', message: 'Your account is deactivated.' }` | **PASS** |
