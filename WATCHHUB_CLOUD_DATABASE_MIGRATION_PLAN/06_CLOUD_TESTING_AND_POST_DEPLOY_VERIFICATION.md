# WatchHub — Cloud Connection Testing & Post-Deploy Verification

**Document:** `WATCHHUB_CLOUD_DATABASE_MIGRATION_PLAN/06_CLOUD_TESTING_AND_POST_DEPLOY_VERIFICATION.md`  
**Date:** November 20, 2026  
**Auditor:** Senior QA & DevOps Engineer  
**Scope:** Non-destructive pre-deployment cloud database verification and post-deployment live API smoke tests.

---

## 1. Non-Destructive Cloud Connection Tests (Pre-Deploy)

Before updating Vercel or deploying any code, execute these non-destructive tests to verify the cloud database from your workstation:

### Test 1A: TLS Handshake & Port Reachability
```powershell
# Verify that Azure SQL Database port 1433 is reachable over the internet
Test-NetConnection -ComputerName "<your-server>.database.windows.net" -Port 1433
```
* **Expected Output:** `TcpTestSucceeded : True`

### Test 1B: Prisma TLS & Connection String Verification
```powershell
# Run a non-destructive query to verify TLS certificate validation and server version
node -e "
import dotenv from 'dotenv';
dotenv.config({ path: './.env.cloud_migrate' });
import('./server/src/config/prisma.js').then(async ({ prisma }) => {
  const result = await prisma.\$queryRaw\`
    SELECT 1 AS [healthy], 
           @@VERSION AS [sql_version], 
           DB_NAME() AS [active_db];
  \`;
  console.log('--- TLS CONNECTION TEST ---');
  console.log(result);
  process.exit(0);
}).catch(err => {
  console.error('[Connection Error]', err.message);
  process.exit(1);
});
"
```
* **Expected Output:** `healthy: 1`, `active_db: WatchHubDB`, zero certificate validation errors.

---

## 2. Post-Deployment Authentication Smoke Tests (Live Production)

Once Vercel has been deployed with `npx vercel --prod`, execute these 6 smoke tests against the live endpoint `https://watchhub-store-silk.vercel.app`:

### Test 2A: REST API Health & Routing
```powershell
curl.exe -s -i "https://watchhub-store-silk.vercel.app/api/health"
```
* **Expected Status:** `HTTP/2 200 OK`
* **Expected Payload:**
  ```json
  {
    "status": "success",
    "message": "WatchHub E-Commerce REST API is live and operational.",
    "version": "1.1.0"
  }
  ```

### Test 2B: CORS Origin & Header Inspection
```powershell
curl.exe -s -i -X OPTIONS "https://watchhub-store-silk.vercel.app/api/auth/me" `
  -H "Origin: https://watchhub-store-silk.vercel.app" `
  -H "Access-Control-Request-Method: GET"
```
* **Expected Status:** `HTTP/2 200 OK` or `HTTP/2 204 No Content`
* **Expected Header:** `Access-Control-Allow-Origin: https://watchhub-store-silk.vercel.app`

### Test 2C: Live Email OTP Dispatch
```powershell
curl.exe -s -i -X POST "https://watchhub-store-silk.vercel.app/api/auth/send-email-otp" `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"shreya.collector@example.com\",\"purpose\":\"registration\",\"name\":\"Shreya\"}"
```
* **Expected Status:** `HTTP/2 200 OK`
* **Expected Payload:**
  ```json
  {
    "status": "success",
    "message": "A verification code has been dispatched to shreya.collector@example.com.",
    "identifier": "shreya.collector@example.com",
    "channel": "email",
    "purpose": "registration",
    "expiresInSeconds": 300,
    "cooldownSeconds": 60
  }
  ```

### Test 2D: Cooldown & Rate Limiting Enforcement
Immediately re-run Test 2C within 60 seconds:
* **Expected Status:** `HTTP/2 429 Too Many Requests`
* **Expected Payload:** `"status": "fail"`, `"message": "Please wait ... seconds before requesting a new verification code."`

### Test 2E: Customer Login with Seeded Account
```powershell
curl.exe -s -i -X POST "https://watchhub-store-silk.vercel.app/api/auth/login" `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"customer@watchhub.com\",\"password\":\"Customer@123\"}"
```
* **Expected Status:** `HTTP/2 200 OK`
* **Expected Response:** `accessToken` returned, `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict`.

### Test 2F: Authenticated `/api/auth/me` Profile Check
```powershell
curl.exe -s -i -X GET "https://watchhub-store-silk.vercel.app/api/auth/me" `
  -H "Authorization: Bearer <ACCESS_TOKEN_FROM_TEST_2E>"
```
* **Expected Status:** `HTTP/2 200 OK`
* **Expected Payload:** Authenticated user details matching `customer@watchhub.com`.
