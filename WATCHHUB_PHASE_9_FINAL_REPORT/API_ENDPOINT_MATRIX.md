# WATCHHUB ATELIER — API ENDPOINT MATRIX
**Phase 9 Final Report — Authentication, Mobile OTP & Razorpay Setup**  
**Mode:** 100% LOCAL DEVELOPMENT ONLY | **Base URL:** `http://localhost:5000`

---

## 1. Authentication & OTP Endpoints

| HTTP Method | Route Path | Purpose / Description | Auth Required | Key Request Parameters | Expected Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-email-otp` | Dispatch 6-digit email OTP via Gmail SMTP | None | `email`, `purpose` (`registration` \| `login`) | `200 OK` `{ status: "success", identifier, expiresInSeconds: 300 }` |
| `POST` | `/api/auth/verify-email-otp` | Verify email OTP & issue JWT access token | None | `email`, `otp`, `purpose`, `name`, `password` | `200 OK` `{ status: "success", token, user }` |
| `POST` | `/api/auth/forgot-password` | Dispatch password reset OTP (anti-enumeration) | None | `email` | `200 OK` `{ status: "success", message }` |
| `POST` | `/api/auth/verify-reset-otp` | Verify reset OTP & issue short-lived reset token | None | `email`, `otp` | `200 OK` `{ status: "success", resetToken }` |
| `POST` | `/api/auth/reset-password` | Finalize password reset with new bcrypt hash | None | `email`, `newPassword`, `confirmPassword`, `resetToken` \| `otp` | `200 OK` `{ status: "success", message }` |
| `POST` | `/api/auth/send-phone-otp` | Dispatch mobile OTP via provider architecture | None | `phone`, `purpose` | `200 OK` `{ status: "success", simulated: true, provider }` |
| `POST` | `/api/auth/verify-phone-otp` | Verify mobile OTP & activate customer account | None | `phone`, `otp`, `name`, `password` | `200 OK` `{ status: "success", token, verified: true }` |
| `POST` | `/api/auth/login` | Traditional customer password login | None | `email`, `password` | `200 OK` `{ status: "success", token, user }` |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Bearer JWT | None | `200 OK` `{ status: "success", user }` |
| `POST` | `/api/auth/logout` | Clear refresh token session cookie | None | None | `200 OK` `{ status: "success", message }` |

---

## 2. Razorpay Payment Endpoints

| HTTP Method | Route Path | Purpose / Description | Auth Required | Key Request Parameters | Expected Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-order` | Calculate server price in paise & create Razorpay order | None (Guest/Auth) | `items` `[]`, `shippingMethod`, `promoCode` | `200 OK` `{ status: "success", orderId, amount, currency: "INR", keyId }` |
| `POST` | `/api/payments/verify` | Verify HMAC-SHA256 signature & mark order Captured | None | `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` | `200 OK` `{ status: "success", paymentStatus: "Captured", orderId }` |
| `POST` | `/api/payments/failure` | Record payment decline/cancellation in SQL Server | None | `razorpay_order_id`, `error_code`, `error_description` | `200 OK` `{ status: "success", paymentStatus: "Failed" }` |
| `GET` | `/api/payments/status/:orderId` | Query payment status by Order ID or Razorpay ID | None | Route parameter `:orderId` | `200 OK` `{ status: "success", razorpayOrderId, paymentStatus, amount }` |
| `POST` | `/api/payments/validate-coupon` | Validate promo code against minimum order rules | None | `promoCode`, `subtotal` | `200 OK` `{ status: "success", valid: true, coupon }` |

---

## 3. Database Schema Mapping
- All authentication sessions map to `dbo.Users` and `dbo.UserRoles`.
- All OTP verification cycles map to `dbo.OTPVerifications`.
- All payments map to `dbo.Payments` linked via foreign key to `dbo.Orders`.
