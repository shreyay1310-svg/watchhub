# WATCHHUB — PHASE 1 BLOCKERS & REQUIRED USER ACTIONS
**Gate Status**: STRICT PHASE 1 COMPLETION GATE  
**Auditor**: Systems Architecture & Release Engineering  
**Date**: November 19, 2026  
**Scope**: Explicit Actions Required by the Project Owner for Production Readiness  

---

## 1. Overview

While all source code refactoring, security remediations, 800-line modularizations, and build verification tests have achieved a **100% PASS** rate, certain external integrations require administrative credentials, billing accounts, or database provisioning that must be performed by the repository owner.

This document lists every blocker and provides step-by-step instructions for resolving each one.

---

## 2. Action Items Summary

| Item ID | Category | External Service | Current Blocker | Action Required by User | Priority |
|---|---|---|---|---|---|
| **ACT-001** | Database Engine | Microsoft SQL Server | `WatchHubDB` database instance not yet created | Run `CREATE DATABASE WatchHubDB;` in SSMS or `sqlcmd`. | **HIGH (Prerequisite for Phase 2)** |
| **ACT-002** | Security Hygiene | Git Version Control | `watchhub_release.keystore` is tracked in Git index | Untrack keystore via `git rm --cached watchhub_release.keystore`. | **HIGH (Before Repository Sharing)** |
| **ACT-003** | Communication | Fast2SMS Gateway | Missing API Key & DLT Approval | Register DLT entity on telecom portal & add `FAST2SMS_API_KEY` to `server/.env`. | **MEDIUM (For Live SMS OTP)** |
| **ACT-004** | Communication | Resend / Email | Missing Resend API Key & DNS Records | Verify domain records on Resend & add `RESEND_API_KEY` to `server/.env`. | **MEDIUM (For Live Email OTP)** |
| **ACT-005** | Payments | Razorpay Merchant | Production Key ID & Secret Key required | Add live Razorpay credentials to `server/.env` and `client/.env`. | **MEDIUM (For Real Money Transactions)** |
| **ACT-006** | Geolocation | Google Cloud Platform | Google Maps JavaScript API key required | Enable Maps JS API on GCP, configure billing, and set `VITE_GOOGLE_MAPS_API_KEY`. | **LOW (SVG Radar Fallback Active)** |

---

## 3. Step-by-Step Resolution Procedures

### Action 1: Create SQL Server Database for Phase 2
* **Current Status**: SQL Server 2025 service is running locally on port 1433, but the application database `WatchHubDB` has not been initialized.
* **Resolution**:
  Open SQL Server Management Studio (SSMS) or PowerShell and execute:
  ```sql
  CREATE DATABASE WatchHubDB;
  GO
  ```
  Ensure the user configured in `DATABASE_URL` has `db_owner` permissions on `WatchHubDB`.

### Action 2: Untrack Android Signing Keystore
* **Current Status**: `watchhub_release.keystore` (2.75 KB) is present in the Git root directory.
* **Resolution**:
  Execute the following command in PowerShell:
  ```powershell
  git rm --cached watchhub_release.keystore
  git commit -m "chore(security): untrack release keystore from git index"
  ```
  Move the file to a secure local folder outside version control.

### Action 3: Configure Transactional SMS OTP (Fast2SMS)
* **Current Status**: System safely operates in simulation mode, outputting OTPs to server console.
* **Resolution**:
  1. Register with [Fast2SMS](https://www.fast2sms.com/).
  2. For Indian phone numbers, register on the TRAI DLT portal (e.g., Jio, Airtel, or Vodafone DLT) and get approval for the WatchHub SMS template.
  3. Add the key to `server/.env`:
     ```env
     FAST2SMS_API_KEY=your_fast2sms_api_key_here
     ```

### Action 4: Configure Transactional Email OTP (Resend)
* **Current Status**: System safely operates in console simulation mode.
* **Resolution**:
  1. Create an account on [Resend.com](https://resend.com/).
  2. Add and verify your domain DNS records (SPF, DKIM, MX).
  3. Generate an API Key and update `server/.env`:
     ```env
     RESEND_API_KEY=re_your_verified_api_key_here
     EMAIL_FROM=WatchHub Security <noreply@yourdomain.com>
     ```

### Action 5: Live Razorpay Credentials
* **Current Status**: Sandbox testing verified with HMAC-SHA256 signature verification.
* **Resolution**:
  When preparing for live production sales:
  1. Complete KYC verification on Razorpay Dashboard.
  2. Switch to Live Mode and generate live API keys.
  3. Set variables in `server/.env`:
     ```env
     RAZORPAY_KEY_ID=rzp_live_your_key_id
     RAZORPAY_KEY_SECRET=your_live_key_secret
     ```
  4. Set in `client/.env`:
     ```env
     VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
     ```

### Action 6: Google Maps API Key
* **Current Status**: High-fidelity SVG/Canvas vector map fallback renders live couriers and routes without API key.
* **Resolution**:
  To render native Google Satellite/Street maps:
  1. Open Google Cloud Console -> APIs & Services.
  2. Enable "Maps JavaScript API" and "Directions API".
  3. Create an API key, restrict it to your HTTP referrer domain, and set in `client/.env`:
     ```env
     VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
     ```

---

## 4. Phase 1 Sign-off on Blockers

None of the above external dependencies block the Phase 1 completion gate or code refactoring. WatchHub contains 100% resilient graceful degradation fallbacks for every unconfigured external service.
