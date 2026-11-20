# WatchHub — Phase 6: Customer Workflow Test Matrix

**Document:** `WATCHHUB_PHASE_6_FINAL_REPORT/02_CUSTOMER_WORKFLOW_TEST_MATRIX.md`  
**Date:** November 20, 2026  
**Auditor:** QA Automation & Integration Lead  
**Scope:** Functional end-to-end verification of all customer e-commerce flows against local services.

---

## 1. Customer Workflow Test Results

| Test Case ID | Workflow Stage | Endpoint / Action | Input Payload / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC_CUST_001** | Account Registration | `POST /api/auth/register` | Name, email, password, phone | User created in SQL Server, JWT issued | Created User ID: `7f02657e-...`, HTTP 201 | **PASS** |
| **TC_CUST_002** | Password Login | `POST /api/auth/login` | Registered email & password | Bcrypt verified, 1h access token + 7d cookie | Token issued, Role: `'Customer'`, HTTP 200 | **PASS** |
| **TC_CUST_003** | Profile Retrieval | `GET /api/users/profile` | Bearer Authorization header | Returns profile and associated addresses | Matches authenticated user, HTTP 200 | **PASS** |
| **TC_CUST_004** | Profile Update | `PUT /api/users/profile` | Updated name & phone | Record updated in MSSQL `Users` table | Returns updated profile data, HTTP 200 | **PASS** |
| **TC_CUST_005** | Address Management | `POST /api/users/addresses` | Street, city, state, pincode, GPS | Row inserted into MSSQL `Addresses` table | Address ID generated, HTTP 201 | **PASS** |
| **TC_CUST_006** | Catalog Browsing | `GET /api/products` | None (Public read) | Returns all active products with specs & stock | Retrieved 33 luxury timepieces, HTTP 200 | **PASS** |
| **TC_CUST_007** | Product Details | `GET /api/products/:id` | Valid Product ID / SKU | Returns full timepiece specifications | Retreived single product object, HTTP 200 | **PASS** |
| **TC_CUST_008** | Catalog Filtering | `GET /api/products?search=Rolex` | Query parameter: `search` | Filters catalog by brand/model name | Filtered results returned, HTTP 200 | **PASS** |
| **TC_CUST_009** | Voucher Validation | `POST /api/payments/validate-coupon` | Code: `WATCHHUB10`, Subtotal: ₹50,000 | Evaluates active coupons in MSSQL `Coupons` | Valid voucher confirmed, 10% discount, HTTP 200 | **PASS** |
| **TC_CUST_010** | Checkout Order Init | `POST /api/payments/create-order` | Items, shipping method, promo code | Calculates subtotal, shipping fee, discount | Razorpay Order ID created, HTTP 200 | **PASS** |
| **TC_CUST_011** | Delivery Tracking | `GET /api/tracking/:orderId` | Order ID: `WH20261125` | Returns real-time logistics milestones | Confirmed order status & tracking, HTTP 200 | **PASS** |

---

## 2. Customer Workflow Observations

1. **Cart & Session Persistence:** Frontend state retains cart items in `localStorage` across page reloads. Once authenticated, checkout seamlessly pre-populates shipping addresses from `GET /api/users/addresses`.
2. **Dynamic Voucher Engine:** Disallowance of invalid coupons is enforced strictly at the database layer (preventing client-side tampering).
3. **Tracking Transparency:** Tracking endpoint correctly binds orders to logistics milestones and courier tracking numbers without fabricating fake delivered states.
