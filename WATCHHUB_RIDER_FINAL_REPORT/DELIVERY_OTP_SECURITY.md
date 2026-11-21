# WATCHHUB PARTNER — DELIVERY OTP SECURITY

## 1. Handover Verification Lifecycle
1. Rider arrives at customer destination.
2. Rider opens assigned parcel and taps `Enter Delivery OTP`.
3. Modal displays customer name, watch model, and prompts for the 4-digit token sent to customer's mobile.
4. Input enforces numeric 4-digit validation.
5. POST request dispatched to `/api/rider/deliveries/:id/verify-otp`.
6. Backend validates token against database record (`prisma.delivery.deliveryHandoverOtp`).
7. Transactional update transitions `deliveryStatus` and `orderStatus` to `Delivered`.
8. Handover timestamp is permanently recorded; token expires immediately preventing replay.

## 2. Security Safeguards
- Plaintext OTPs are never exposed in production logs.
- Handover denied on mismatch.
- Prevents unassigned riders from validating non-assigned orders.

## 3. Status Classification
- **VERIFIED WORKING**: Successfully verified with automated Playwright browser test.
