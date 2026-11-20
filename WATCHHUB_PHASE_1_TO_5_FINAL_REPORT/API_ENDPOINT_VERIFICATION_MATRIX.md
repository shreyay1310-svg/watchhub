# WatchHub — API Endpoint Verification Matrix

**Document:** `WATCHHUB_PHASE_1_TO_5_FINAL_REPORT/API_ENDPOINT_VERIFICATION_MATRIX.md`  
**Date:** November 20, 2026  
**Auditor:** QA Automation & Integration Engineer  
**Scope:** Status and contract verification for all active Express REST endpoints.

---

## 1. Authentication Endpoints Verification Matrix

| Endpoint Path | Method | Auth Required | Expected Status | Real DB Mutation | Test Case ID | Result |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/api/health` | `GET` | No | `200 OK` | No | TC_M_001 | **PASS** |
| `/api/auth/register` | `POST` | No | `201 Created` | Inserts into `Users`, `UserRoles` | TC_M_003 | **PASS** |
| `/api/auth/register` (Duplicate) | `POST` | No | `400 Bad Request` | None | TC_M_004 | **PASS** |
| `/api/auth/login` | `POST` | No | `200 OK` | Updates session, sets cookie | TC_M_005 | **PASS** |
| `/api/auth/login` (Invalid Pass) | `POST` | No | `401 Unauthorized` | None | TC_M_006 | **PASS** |
| `/api/auth/send-email-otp` | `POST` | No | `200 OK` | Atomic lease in `OTPVerifications`| TC_M_009 | **PASS** |
| `/api/auth/send-otp` (Alias) | `POST` | No | `200 OK` | Calls email OTP handler | TC_M_010 | **PASS** |
| `/api/auth/send-email-otp` (Spam)| `POST` | No | `429 Too Many Req` | None | TC_M_011 | **PASS** |
| `/api/auth/verify-email-otp` | `POST` | No | `200 OK` | `isVerified = true` in MSSQL | TC_M_012 | **PASS** |
| `/api/auth/email-login` | `POST` | No | `200 OK` | Creates/updates user | TC_M_012 | **PASS** |
| `/api/auth/forgot-password` | `POST` | No | `200 OK` | Atomic lease in `OTPVerifications`| TC_M_013 | **PASS** |
| `/api/auth/reset-password` | `POST` | No | `200 OK` | Updates `passwordHash` in `Users` | TC_M_013 | **PASS** |
| `/api/auth/me` | `GET` | Yes (Bearer) | `200 OK` | None (Token decode) | TC_M_007 | **PASS** |
| `/api/auth/me` (Unauthenticated) | `GET` | Yes (Bearer) | `401 Unauthorized` | None | TC_M_008 | **PASS** |

---

## 2. Core E-Commerce & Product Endpoints

| Endpoint Path | Method | Auth Required | Purpose | Status |
| :--- | :---: | :---: | :--- | :---: |
| `/api/products` | `GET` | No | Catalog list with brand, category, images | **PASS** (TC_M_015) |
| `/api/products/categories` | `GET` | No | Catalog taxonomy hierarchy from MSSQL | **PASS** (TC_M_016) |
| `/api/products/brands` | `GET` | No | Distinct watch manufacturer listings from MSSQL | **PASS** (TC_M_016) |
| `/api/products/:id` | `GET` | No | Single product details with specs & stock | **PASS** |
| `/api/products/featured` | `GET` | No | Curated luxury hero showcase | **PASS** |
| `/api/payments/validate-coupon`| `POST` | No | Promotional voucher code validation | **PASS** (TC_M_017) |
| `/api/payments/create-order`| `POST` | Yes (Auth) | Razorpay checkout order initialization | **PASS** (TC_M_018) |
| `/api/tracking/:query` | `GET` | No | Real-time consignment & order tracking | **PASS** (TC_M_019) |
| `/api/users/addresses` | `GET` | No | Saved delivery addresses from MSSQL | **PASS** (TC_M_020) |
| `/api/inventory` | `GET` | Yes (Role) | Warehouse stock balances & alert thresholds | **PASS** |
| `/api/dashboard/stats` | `GET` | Yes (Admin)| Live sales, orders, and fulfillment telemetry| **PASS** |
| `/api/delivery/orders` | `GET` | Yes (Role) | Active logistics parcels & delivery states | **PASS** |
| `/api/support/tickets` | `GET` | Yes (Auth) | Customer support inquiries & chat history | **PASS** |
