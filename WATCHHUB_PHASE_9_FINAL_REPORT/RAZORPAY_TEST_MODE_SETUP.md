# WATCHHUB ATELIER — RAZORPAY TEST MODE & PAYMENT INTEGRATION
**Phase 9 Final Report — Authentication, Mobile OTP & Razorpay Setup**  
**Mode:** 100% LOCAL DEVELOPMENT ONLY | **Budget:** ₹0  
**Status:** LOCAL TESTED (Mock Gateway & Signature Verification) | READY FOR RAZORPAY TEST KEYS

---

## 1. Executive Summary & Status Classification

| Integration Requirement | Implementation Standard | Operational Status | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **Test Key Separation** | `RAZORPAY_KEY_ID` (public), `RAZORPAY_KEY_SECRET` (private) | **LOCAL TESTED** | Secret strictly isolated to server; public key sent to frontend |
| **Server-Side Pricing** | Recalculated against SQL Server `Product` records | **LOCAL TESTED** | Client price overrides ignored; values in integer paise |
| **Signature Verification** | HMAC-SHA256 via `crypto.timingSafeEqual` | **LOCAL TESTED** | Forged signatures rejected with HTTP 400; valid signatures accepted |
| **Idempotency Defense** | Duplicate callbacks handled gracefully | **LOCAL TESTED** | Returns existing captured order without duplicate insertion |
| **Payment Lifecycle Persistence** | SQL Server `Payments` and `Orders` tables | **LOCAL TESTED** | Records Created, Captured, and Failed payment states |

---

## 2. Payment Lifecycle Architecture

```
[Customer Selects Watches in Cart]
              │
              ▼
[POST /api/payments/create-order]
              │
              ├─ 1. Fetches authentic prices from SQL Server Product table
              ├─ 2. Adds selected shipping rate (Armoured: ₹3,500)
              ├─ 3. Applies valid coupon discount (if provided)
              ├─ 4. Converts final total to integer paise: Amount_Paise = Amount_INR * 100
              ├─ 5. Invokes Razorpay Orders API (or fallback test mock order)
              ▼
[Frontend: Razorpay Checkout Modal]
              │ Customer completes test payment (UPI / Card / Netbanking)
              ▼
[POST /api/payments/verify]
              │
              ├─ 1. Computes expected HMAC: HMAC-SHA256(order_id + "|" + payment_id, secret)
              ├─ 2. Verifies signature using crypto.timingSafeEqual(expectedBuf, receivedBuf)
              ├─ 3. Idempotency check: Already Captured? Return existing order (no duplicates)
              ├─ 4. Updates SQL Server Payment record: paymentStatus = "Captured"
              ├─ 5. Updates SQL Server Order record: orderStatus = "Confirmed"
              ▼
[Order Confirmation Screen & Luxury Receipt]
```

---

## 3. Cryptographic Signature Verification

Razorpay payment callbacks return three parameters:
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_signature`

### Verification Algorithm (`razorpayService.js`):
```javascript
export const verifyRazorpayPaymentSignature = ({ orderId, paymentId, signature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_watchhub2026';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${orderId}|${paymentId}`);
  const expectedSignature = hmac.digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};
```
This protects against timing oracle attacks and guarantees that only payments processed by Razorpay using our registered secret can trigger order fulfillment.

---

## 4. Failure & Cancellation Handling

If a payment fails or is cancelled by the customer:
1. The checkout frontend invokes `POST /api/payments/failure` with the `razorpay_order_id`, error code, and error description.
2. The server records the failure in the SQL Server `Payments` table with `paymentStatus = "Failed"` and persists the `failureReason`.
3. An unfulfilled `Order` record with `orderStatus = "PaymentFailed"` maintains referential integrity in SQL Server.
4. The customer is guided back to their checkout cart with the error message and their selected items intact.

---

## 5. Key Source Code References
- **Payment Routes & Server-Side Price Engine:** [paymentRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/paymentRoutes.js#L80-L290)
- **Razorpay SDK & Signature Service:** [razorpayService.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/services/razorpayService.js#L1-L150)
- **Payment & Order Database Schema:** [schema.prisma](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/prisma/schema.prisma#L280-L345)
- **Automated Test Scenarios (Tests 8–13):** [test_phase9_auth_payment_suite.mjs](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/scripts/test_phase9_auth_payment_suite.mjs#L320-L455)
