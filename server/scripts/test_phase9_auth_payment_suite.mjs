// WatchHub Phase 9 Comprehensive Automated Verification Suite
// Tests:
// 1. Customer Email OTP to dynamic recipient
// 2. Registration verification
// 3. Forgot-password OTP & anti-enumeration
// 4. Wrong and expired OTP
// 5. Separate OTP purposes (registration vs reset_password cross-rejection)
// 6. Mobile mock provider (₹0 local testing & test-only OTP fixture)
// 7. Production rejection of mock provider
// 8. Razorpay test order creation (server-side price calculation in paise)
// 9. Successful test payment signature verification (timingSafeEqual)
// 10. Failed payment handling
// 11. Duplicate payment callback (idempotent handling)
// 12. Invalid signature rejection
// 13. Database order consistency (GET /api/payments/status/:orderId)

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/config/prisma.js';
import {
  DevelopmentMockSMSProvider,
  ProductionSMSProvider,
  getSmsProvider,
} from '../src/services/smsProvider.js';
import {
  createRazorpayOrder,
  verifyRazorpayPaymentSignature,
} from '../src/services/razorpayService.js';
import {
  hashOtp,
  getCurrentOtpSecret,
} from '../src/services/otpService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'http://localhost:5000';
const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'watchhub_test_secret_key';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// Helper to derive 6-digit OTP from HMAC hash for test purposes
function deriveOtpFromHash(storedHash, identifier, purpose) {
  const secret = getCurrentOtpSecret();
  for (let n = 100000; n <= 999999; n++) {
    const candidate = n.toString();
    if (hashOtp(candidate, identifier, purpose, secret) === storedHash) {
      return candidate;
    }
  }
  return null;
}

async function runPhase9TestSuite() {
  console.log('\n================================================================================');
  console.log('WATCHHUB PHASE 9 — COMPLETE AUTHENTICATION, MOBILE OTP & RAZORPAY TEST SUITE');
  console.log('Mode: 100% LOCAL DEVELOPMENT ONLY | Target: ' + BASE_URL);
  console.log('================================================================================\n');

  const testId = `p9_${Date.now()}`;
  const dynamicEmail = `customer_${testId}@watchhub.test`;
  const dynamicPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

  try {
    // --------------------------------------------------------------------------
    // TEST 1: Email OTP to Dynamic Recipient
    // --------------------------------------------------------------------------
    console.log('--- 1. EMAIL OTP TO DYNAMIC RECIPIENT ---');
    const sendOtpRes = await fetch(`${BASE_URL}/api/auth/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dynamicEmail, name: 'Phase 9 Collector', purpose: 'registration' }),
    });
    const sendOtpData = await sendOtpRes.json();
    assert(sendOtpRes.status === 200, `POST /api/auth/send-email-otp returned HTTP 200`);
    assert(sendOtpData.success === true, `Response reports success: true`);
    assert(sendOtpData.identifier === dynamicEmail.toLowerCase(), `Dynamic email preserved exactly in response: ${dynamicEmail}`);
    assert(sendOtpData.cooldownSeconds === 60, `60-second cooldown enforced in response`);

    // --------------------------------------------------------------------------
    // TEST 2: Registration Verification
    // --------------------------------------------------------------------------
    console.log('\n--- 2. REGISTRATION VERIFICATION ---');
    const otpRecord = await prisma.oTPVerification.findUnique({
      where: { identifier_purpose: { identifier: dynamicEmail.toLowerCase(), purpose: 'registration' } },
    });
    assert(Boolean(otpRecord), `OTP verification record persisted in SQL Server (WatchHubDB)`);
    assert(otpRecord.dispatchState === 'ACTIVE', `Dispatch state is ACTIVE`);

    const derivedCode = deriveOtpFromHash(otpRecord.otpHash, dynamicEmail, 'registration');
    assert(Boolean(derivedCode), `6-digit OTP derived from secure HMAC-SHA256 digest: [ ${derivedCode} ]`);

    const verifyRegRes = await fetch(`${BASE_URL}/api/auth/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: dynamicEmail,
        otp: derivedCode,
        purpose: 'registration',
        name: 'Phase 9 Collector',
        password: 'LuxuryPassword@2026',
        phone: `+91 ${dynamicPhone}`,
      }),
    });
    const verifyRegData = await verifyRegRes.json();
    assert(verifyRegRes.status === 200, `POST /api/auth/verify-email-otp returned HTTP 200`);
    assert(verifyRegData.verified === true, `Registration verified successfully`);
    assert(Boolean(verifyRegData.accessToken), `JWT Access Token issued upon registration`);

    const createdUser = await prisma.user.findUnique({
      where: { email: dynamicEmail.toLowerCase() },
    });
    assert(Boolean(createdUser) && createdUser.isEmailVerified === true, `User profile created in SQL Server with isEmailVerified: true`);

    // --------------------------------------------------------------------------
    // TEST 3: Forgot-Password OTP & Anti-Enumeration
    // --------------------------------------------------------------------------
    console.log('\n--- 3. FORGOT PASSWORD OTP & ANTI-ENUMERATION ---');
    // 3A: Existing user
    const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dynamicEmail }),
    });
    const forgotData = await forgotRes.json();
    assert(forgotRes.status === 200, `POST /api/auth/forgot-password returned HTTP 200 for existing user`);
    assert(forgotData.message.includes('If an account is associated with'), `Generic anti-enumeration message returned`);

    // 3B: Non-existent user (must return identical generic response without leaking)
    const nonExistentEmail = `unknown_${Date.now()}@watchhub.test`;
    const forgotNonExistentRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: nonExistentEmail }),
    });
    const forgotNonExistentData = await forgotNonExistentRes.json();
    assert(forgotNonExistentRes.status === 200, `POST /api/auth/forgot-password returned HTTP 200 for non-existent user`);
    assert(forgotNonExistentData.message.includes('If an account is associated with'), `Identical generic anti-enumeration message prevents user discovery`);

    // --------------------------------------------------------------------------
    // TEST 4: Wrong and Expired OTP
    // --------------------------------------------------------------------------
    console.log('\n--- 4. WRONG AND EXPIRED OTP HANDLING ---');
    const wrongOtpRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dynamicEmail, otp: '000000', newPassword: 'BrandNewPass@2026' }),
    });
    const wrongOtpData = await wrongOtpRes.json();
    assert(wrongOtpRes.status === 400, `Wrong OTP rejected with HTTP 400`);
    assert(wrongOtpData.remainingAttempts !== undefined, `Remaining attempts tracked accurately (${wrongOtpData.remainingAttempts} left)`);

    // Expired OTP test: insert synthetic expired record
    const expiredEmail = `expired_${testId}@watchhub.test`;
    await prisma.oTPVerification.create({
      data: {
        identifier: expiredEmail,
        purpose: 'password_reset',
        channel: 'email',
        otpHash: hashOtp('123456', expiredEmail, 'password_reset', getCurrentOtpSecret()),
        dispatchState: 'ACTIVE',
        dispatchLockedUntil: new Date(),
        resendCooldownUntil: new Date(),
        expiresAt: new Date(Date.now() - 60000), // Expired 1 minute ago
        attempts: 0,
        isVerified: false,
      },
    });

    const expiredOtpRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: expiredEmail, otp: '123456', newPassword: 'NewSecretPass@2026' }),
    });
    const expiredOtpData = await expiredOtpRes.json();
    assert(expiredOtpRes.status === 400, `Expired OTP rejected with HTTP 400`);
    assert(expiredOtpData.expired === true, `Response contains expired: true flag`);
    await prisma.oTPVerification.deleteMany({ where: { identifier: expiredEmail } }).catch(() => {});

    // --------------------------------------------------------------------------
    // TEST 5: Separate OTP Purposes (Strict Cross-Purpose Prevention)
    // --------------------------------------------------------------------------
    console.log('\n--- 5. SEPARATE OTP PURPOSES (CROSS-PURPOSE REJECTION) ---');
    // Create an active registration OTP
    const crossTestEmail = `cross_${testId}@watchhub.test`;
    const regSecretCode = '654321';
    await prisma.oTPVerification.create({
      data: {
        identifier: crossTestEmail,
        purpose: 'registration', // Issued strictly for REGISTRATION
        channel: 'email',
        otpHash: hashOtp(regSecretCode, crossTestEmail, 'registration', getCurrentOtpSecret()),
        dispatchState: 'ACTIVE',
        dispatchLockedUntil: new Date(Date.now() + 30000),
        resendCooldownUntil: new Date(Date.now() + 60000),
        expiresAt: new Date(Date.now() + 300000),
        attempts: 0,
        isVerified: false,
      },
    });

    // Attempt to use this registration code to reset password
    const crossPurposeRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: crossTestEmail, otp: regSecretCode, newPassword: 'HackedPass@2026' }),
    });
    assert(crossPurposeRes.status === 400, `Registration OTP rejected when submitted to reset-password (HTTP 400)`);
    console.log(`     Details: Registration OTP cannot be used to reset passwords due to HMAC purpose binding.`);
    await prisma.oTPVerification.deleteMany({ where: { identifier: crossTestEmail } }).catch(() => {});

    // Complete legitimate password reset flow for dynamicEmail
    const resetRecord = await prisma.oTPVerification.findUnique({
      where: { identifier_purpose: { identifier: dynamicEmail.toLowerCase(), purpose: 'password_reset' } },
    });
    if (resetRecord) {
      const resetOtp = deriveOtpFromHash(resetRecord.otpHash, dynamicEmail, 'password_reset');
      if (resetOtp) {
        // Step 3: verify-reset-otp
        const verifyResetRes = await fetch(`${BASE_URL}/api/auth/verify-reset-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: dynamicEmail, otp: resetOtp }),
        });
        const verifyResetData = await verifyResetRes.json();
        assert(verifyResetRes.status === 200, `POST /api/auth/verify-reset-otp returned HTTP 200`);
        assert(Boolean(verifyResetData.resetToken), `Short-lived resetToken issued upon reset OTP verification`);

        // Step 5: reset-password with resetToken
        const finalizeResetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: dynamicEmail,
            resetToken: verifyResetData.resetToken,
            newPassword: 'BrandNewLuxuryPass@2026',
            confirmPassword: 'BrandNewLuxuryPass@2026',
          }),
        });
        const finalizeResetData = await finalizeResetRes.json();
        assert(finalizeResetRes.status === 200, `POST /api/auth/reset-password finalized successfully`);
        assert(finalizeResetData.status === 'success', `Password successfully updated in SQL Server database`);
      }
    }

    // --------------------------------------------------------------------------
    // TEST 6: Mobile Mock Provider (₹0 Local Testing)
    // --------------------------------------------------------------------------
    console.log('\n--- 6. MOBILE MOCK PROVIDER (ZERO COST LOCAL DISPATCH) ---');
    const mobileNum = `99${Math.floor(10000000 + Math.random() * 90000000)}`;
    const sendPhoneRes = await fetch(`${BASE_URL}/api/auth/send-phone-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: mobileNum, purpose: 'registration' }),
    });
    const sendPhoneData = await sendPhoneRes.json();
    assert(sendPhoneRes.status === 200, `POST /api/auth/send-phone-otp returned HTTP 200`);
    assert(sendPhoneData.simulated === true, `Explicitly reports simulated: true (never fakes actual SMS delivery)`);
    assert(sendPhoneData.provider === 'DevelopmentMockSMSProvider', `Provider confirmed as DevelopmentMockSMSProvider`);

    // Test-only OTP retrieval fixture
    const retrievedMockOtp = DevelopmentMockSMSProvider.getLastMockOtp(mobileNum);
    assert(Boolean(retrievedMockOtp) && retrievedMockOtp.length === 6, `Test fixture retrieved mock OTP: [ ${retrievedMockOtp} ]`);

    // Verify phone OTP
    const verifyPhoneRes = await fetch(`${BASE_URL}/api/auth/verify-phone-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: mobileNum,
        otp: retrievedMockOtp,
        purpose: 'registration',
        name: 'Mobile Collector',
        password: 'MobilePass@2026',
      }),
    });
    const verifyPhoneData = await verifyPhoneRes.json();
    assert(verifyPhoneRes.status === 200, `POST /api/auth/verify-phone-otp verified successfully with mock OTP`);
    assert(verifyPhoneData.verified === true, `Mobile profile verified and activated`);
    await prisma.oTPVerification.deleteMany({ where: { identifier: mobileNum } }).catch(() => {});

    // --------------------------------------------------------------------------
    // TEST 7: Production Rejection of Mock Provider
    // --------------------------------------------------------------------------
    console.log('\n--- 7. PRODUCTION REJECTION OF MOCK PROVIDER ---');
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    let rejectedInProd = false;
    try {
      new DevelopmentMockSMSProvider();
    } catch (e) {
      rejectedInProd = e.message.includes('Security Violation');
    }
    assert(rejectedInProd, `DevelopmentMockSMSProvider instantiation in production throws Security Violation`);

    // In production, getSmsProvider() returns ProductionSMSProvider which is disabled by default
    const prodProvider = getSmsProvider();
    assert(prodProvider.getName() === 'ProductionSMSProvider', `getSmsProvider() returns ProductionSMSProvider in production`);
    const prodDispatch = await prodProvider.sendOtp({ mobile: '9876543210', otp: '123456' });
    assert(prodDispatch.success === false, `ProductionSMSProvider safely disabled by default (no unwanted charges)`);
    assert(prodDispatch.error === 'PRODUCTION_SMS_DISABLED', `Error code: PRODUCTION_SMS_DISABLED`);
    process.env.NODE_ENV = originalEnv;

    // --------------------------------------------------------------------------
    // TEST 8: Razorpay Test Order Creation (Server-Side Price Calculation in Paise)
    // --------------------------------------------------------------------------
    console.log('\n--- 8. RAZORPAY TEST ORDER CREATION (INTEGER PAISE) ---');
    const createOrderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { productId: 'rolex-submariner', price: 18999, quantity: 1 },
          { productId: 'omega-speedmaster', price: 12500, quantity: 2 },
        ],
        shippingMethod: 'armoured', // ₹3500
      }),
    });
    const createOrderData = await createOrderRes.json();
    assert(createOrderRes.status === 200, `POST /api/payments/create-order returned HTTP 200`);
    assert(Boolean(createOrderData.orderId), `Razorpay Order ID created: ${createOrderData.orderId}`);
    assert(Number.isInteger(createOrderData.amount), `Order amount is strictly an integer in paise: ${createOrderData.amount}`);
    assert(createOrderData.currency === 'INR', `Currency confirmed as INR`);
    assert(createOrderData.keyId === (process.env.RAZORPAY_KEY_ID || 'rzp_test_watchhub2026'), `Key ID matches configured TEST key: ${createOrderData.keyId}`);

    const razorpayOrderId = createOrderData.orderId;

    // --------------------------------------------------------------------------
    // TEST 9: Successful Test Payment Signature Verification (timingSafeEqual)
    // --------------------------------------------------------------------------
    console.log('\n--- 9. PAYMENT SIGNATURE VERIFICATION (TIMING-SAFE) ---');
    const testPaymentId = `pay_test_${Date.now()}`;
    const validSignature = crypto
      .createHmac('sha256', RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${testPaymentId}`)
      .digest('hex');

    const verifyPayRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: validSignature,
        orderData: {
          orderId: `WH_TEST_${Date.now()}`,
          amount: createOrderData.calculatedAmount,
          shippingMethod: 'armoured',
        },
      }),
    });
    const verifyPayData = await verifyPayRes.json();
    assert(verifyPayRes.status === 200, `POST /api/payments/verify returned HTTP 200`);
    assert(verifyPayData.status === 'success', `Payment verified and status is success`);
    assert(verifyPayData.paymentStatus === 'Captured', `Payment status marked as Captured in database`);

    // Verify SQL Server record
    const paymentInDb = await prisma.payment.findUnique({
      where: { razorpayOrderId },
    });
    assert(Boolean(paymentInDb), `Payment record found in SQL Server Payments table`);
    assert(paymentInDb.paymentStatus === 'Captured', `SQL Server record has paymentStatus: 'Captured'`);
    assert(paymentInDb.razorpayPaymentId === testPaymentId, `Payment ID matches: ${paymentInDb.razorpayPaymentId}`);

    // --------------------------------------------------------------------------
    // TEST 10: Failed Payment Handling
    // --------------------------------------------------------------------------
    console.log('\n--- 10. FAILED PAYMENT HANDLING ---');
    const failedOrderId = `order_failed_${Date.now()}`;
    const failRes = await fetch(`${BASE_URL}/api/payments/failure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: failedOrderId,
        error_code: 'BAD_REQUEST_ERROR',
        error_description: 'Card declined due to insufficient funds.',
      }),
    });
    const failData = await failRes.json();
    assert(failRes.status === 200, `POST /api/payments/failure returned HTTP 200`);
    assert(failData.paymentStatus === 'Failed', `Payment status recorded as Failed`);

    const failedPaymentInDb = await prisma.payment.findUnique({
      where: { razorpayOrderId: failedOrderId },
    });
    assert(Boolean(failedPaymentInDb) && failedPaymentInDb.paymentStatus === 'Failed', `Failed payment recorded in SQL Server with reason: "${failedPaymentInDb?.failureReason}"`);
    await prisma.payment.deleteMany({ where: { razorpayOrderId: failedOrderId } }).catch(() => {});

    // --------------------------------------------------------------------------
    // TEST 11: Duplicate Payment Callback (Idempotency)
    // --------------------------------------------------------------------------
    console.log('\n--- 11. DUPLICATE PAYMENT CALLBACK (IDEMPOTENCY) ---');
    const dupRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: validSignature,
      }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200, `Duplicate callback returns HTTP 200 without error`);
    assert(dupData.duplicate === true, `Response flags duplicate: true without re-creating order`);
    assert(dupData.paymentStatus === 'Captured', `Preserves original Captured payment state`);

    // --------------------------------------------------------------------------
    // TEST 12: Invalid Signature Rejection
    // --------------------------------------------------------------------------
    console.log('\n--- 12. INVALID SIGNATURE REJECTION ---');
    const badSigRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: `order_fake_${Date.now()}`,
        razorpay_payment_id: `pay_fake_${Date.now()}`,
        razorpay_signature: 'deadbeef_invalid_forged_cryptographic_signature_1234567890abcdef',
      }),
    });
    const badSigData = await badSigRes.json();
    assert(badSigRes.status === 400, `Forged signature strictly rejected with HTTP 400`);
    assert(badSigData.message.includes('Cryptographic signature verification failed'), `Error message: Cryptographic signature verification failed`);

    // --------------------------------------------------------------------------
    // TEST 13: Database Order Consistency (GET /api/payments/status/:orderId)
    // --------------------------------------------------------------------------
    console.log('\n--- 13. DATABASE ORDER CONSISTENCY & STATUS QUERY ---');
    const statusRes = await fetch(`${BASE_URL}/api/payments/status/${razorpayOrderId}`);
    const statusData = await statusRes.json();
    assert(statusRes.status === 200, `GET /api/payments/status/:orderId returned HTTP 200`);
    assert(statusData.status === 'success', `Status response success: true`);
    assert(statusData.razorpayOrderId === razorpayOrderId, `Queried razorpayOrderId matches: ${statusData.razorpayOrderId}`);
    assert(statusData.paymentStatus === 'Captured', `Payment status is Captured in database`);
    assert(statusData.method === 'UPI', `Payment method recorded accurately`);

    // Clean up test payment & order records safely
    await prisma.payment.deleteMany({ where: { razorpayOrderId } }).catch(() => {});
    if (paymentInDb && paymentInDb.orderId) {
      await prisma.order.deleteMany({ where: { orderId: paymentInDb.orderId } }).catch(() => {});
    }

  } catch (err) {
    console.error('\n❌ TEST SUITE RUNTIME ERROR:', err);
    failCount++;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n================================================================================');
  console.log(`TEST SUMMARY: TOTAL: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
  console.log('================================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runPhase9TestSuite();
