# WatchHub — Phase 6: API Endpoint Verification Matrix

**Document:** `WATCHHUB_PHASE_6_FINAL_REPORT/04_API_VERIFICATION_MATRIX.md`  
**Date:** November 20, 2026  
**Auditor:** QA Automation & Integration Lead  
**Scope:** Complete verification matrix of all active REST API routes.

---

## 1. Master REST API Verification Matrix

| Route Path | Method | Auth Guard | Role Required | Live SQL Query / Handler | Verified Status |
| :--- | :---: | :---: | :---: | :--- | :---: |
| `/api/health` | `GET` | None | Public | Health probe | `200 OK` |
| `/api/auth/register` | `POST` | None | Public | Inserts into `Users` & `UserRoles` via bcrypt | `201 Created` |
| `/api/auth/login` | `POST` | None | Public | Bcrypt compare; signs JWT + refresh cookie | `200 OK` |
| `/api/auth/send-email-otp` | `POST` | None | Public | V3 atomic lease in `OTPVerifications` | `200 OK` |
| `/api/auth/send-otp` (Alias) | `POST` | None | Public | Forwarding alias to email OTP handler | `200 OK` |
| `/api/auth/verify-email-otp` | `POST` | None | Public | Atomic single-use verify (`IsVerified = 1`) | `200 OK` |
| `/api/auth/email-login` | `POST` | None | Public | Passwordless OTP login & user provisioning | `200 OK` |
| `/api/auth/forgot-password` | `POST` | None | Public | Recovery OTP dispatch with generic response | `200 OK` |
| `/api/auth/reset-password` | `POST` | None | Public | Recovery code verify & password re-hash | `200 OK` |
| `/api/auth/me` | `GET` | Bearer | Any Auth | Cryptographic token decode & profile return | `200 OK` |
| `/api/users/profile` | `GET` | Bearer | Customer | Queries `prisma.user.findUnique` | `200 OK` |
| `/api/users/profile` | `PUT` | Bearer | Customer | Updates `fullName`, `phone`, `avatarUrl` | `200 OK` |
| `/api/users/addresses` | `GET` | None / Auth | Any | Queries `prisma.address.findMany` | `200 OK` |
| `/api/users/addresses` | `POST` | Bearer | Customer | Inserts new delivery address with coordinates | `201 Created` |
| `/api/products` | `GET` | None | Public | Catalog retrieval with brand, category, specs | `200 OK` |
| `/api/products/:id` | `GET` | None | Public | Single product details by UUID or SKU | `200 OK` |
| `/api/products/categories` | `GET` | None | Public | Taxonomy query: `prisma.category.findMany` | `200 OK` |
| `/api/products/brands` | `GET` | None | Public | Brand query: `prisma.brand.findMany` | `200 OK` |
| `/api/payments/validate-coupon` | `POST` | None | Public | Evaluates `prisma.coupon.findUnique` | `200 OK` |
| `/api/payments/create-order` | `POST` | None / Auth | Public | Calculates subtotal, fee, discount, Razorpay | `200 OK` |
| `/api/tracking/:query` | `GET` | None | Public | Logistics tracking lookup from MSSQL `Orders` | `200 OK` |
| `/api/dashboard/super-admin` | `GET` | Bearer | Super Admin | Aggregated revenue, orders, staff metrics | `200 OK` / `403` |
| `/api/dashboard/store-admin` | `GET` | Bearer | Store Admin | Store order status & catalog statistics | `200 OK` / `403` |
| `/api/dashboard/inventory-manager` | `GET` | Bearer | Inventory | Warehouse stock levels & replenishment | `200 OK` / `403` |
| `/api/inventory` | `GET` | None / Auth | Any | Inward stock ledger & warehouse inventory | `200 OK` |
