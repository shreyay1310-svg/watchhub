# WatchHub — Cloud Migration Status & Executive Decision

**Document:** `WATCHHUB_CLOUD_DATABASE_MIGRATION_PLAN/07_MIGRATION_STATUS_AND_DECISION.md`  
**Date:** November 20, 2026  
**Auditor:** Senior DevOps & Microsoft SQL Server Deployment Engineer  
**Live Target:** `https://watchhub-store-silk.vercel.app` (`watchhub-store`)  
**Scope:** Final Status Evaluation, Blocker Evidence, and Deployment Decision.

---

## 1. Final Status Decision

### **FINAL STATUS: ⛔ BLOCKED (With Empirical Evidence)**

```
[Local Backend & Fixes]  ======>  READY  (20/20 V3 OTP, 8/8 Auth, 15/15 Android)
[Frontend Production]    ======>  READY  (Vite client/dist built in 12.04s)
[Cloud SQL Database]     ======>  BLOCKED (Cloud instance not yet provisioned)
[Vercel Environment]     ======>  BLOCKED (Production secrets not yet configured)
```

---

## 2. Evidence of Blocker

### Evidence 1: Network Inaccessibility from Vercel Cloud
* The active database connection string is `sqlserver://127.0.0.1:1433;database=WatchHubDB;integratedSecurity=true;trustServerCertificate=true`.
* `127.0.0.1` points to the local Windows machine `Shreya`.
* Vercel serverless containers execute in AWS Mumbai (`bom1`) within isolated microVMs that have no network route to `127.0.0.1:1433`.
* Direct verification: Invoking queries from any environment outside this host machine results in:
  ```text
  PrismaClientInitializationError: Can't reach database server at 127.0.0.1:1433
  ```

### Evidence 2: Missing Vercel Environment Configuration
* The Vercel project `watchhub-store` does not yet have `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `OTP_HASH_SECRET_CURRENT`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, or `RESEND_API_KEY` configured in Project Settings.
* Deploying to production in this state would immediately fail on all authentication and catalog queries.

---

## 3. Prerequisite Checklist to Unblock Deployment

Deployment can transition to **`GO`** once the following sequential checklist is completed:

- [ ] **Step 1:** User creates Azure SQL Database (`WatchHubDB`) in Azure Portal (Central India / Pune).
- [ ] **Step 2:** User configures Azure firewall ("Allow Azure services to access server: Yes", adds local IP).
- [ ] **Step 3:** Schema pushed non-destructively: `npx prisma db push --schema=server/prisma/schema.prisma`.
- [ ] **Step 4:** V3 OTP compound and nonclustered indexes applied: `node server/scripts/apply_v3_otp_migration.mjs`.
- [ ] **Step 5:** Baseline seed data populated: `node server/scripts/seed_mssql_prisma.mjs`.
- [ ] **Step 6:** All 12 variables entered in Vercel Project Settings (`https://vercel.com/13shreyayadav/watchhub-store/settings/environment-variables`).
- [ ] **Step 7:** User grants explicit written approval to execute `npx vercel --prod`.

---

## 4. Operational Stop & Approval Gate

In accordance with strict safety mandates:
- **No cloud subscriptions or paid resources have been created.**
- **No migrations have been executed against cloud or local systems.**
- **The local database on `127.0.0.1:1433` remains completely untouched.**
- **No environment variables were altered on Vercel.**
- **No production deployments were initiated.**
- **The system is currently STOPPED awaiting your explicit review and instruction.**
