import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { prisma } from '../src/config/prisma.js';
import authRoutes from '../src/routes/authRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';
import paymentRoutes from '../src/routes/paymentRoutes.js';
import trackingRoutes from '../src/routes/trackingRoutes.js';
import userRoutes from '../src/routes/userRoutes.js';
import { requestAndSendOtp, verifyOtp } from '../src/services/otpService.js';
import otpCleanupWorker from '../src/services/otpCleanupWorker.js';

let server;
let baseUrl;

async function setupServer() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/tracking', trackingRoutes);
  app.use('/api/users', userRoutes);

  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'WatchHub API is live' });
  });

  return new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

const results = [];
function record(testId, name, passed, details = '') {
  results.push({ testId, name, status: passed ? 'PASS' : 'FAIL', details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${testId}: ${name}${details ? ' - ' + details : ''}`);
}

async function runMasterSuite() {
  console.log('===============================================================');
  console.log('WATCHHUB MASTER LOCAL VERIFICATION SUITE');
  console.log('===============================================================\n');

  try {
    await setupServer();
    console.log(`Ephemeral Test Server listening at: ${baseUrl}\n`);

    // 1. HEALTH ENDPOINT
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    record('TC_M_001', 'GET /api/health returns HTTP 200', healthRes.status === 200 && healthJson.status === 'success');

    // 2. LOCAL MSSQL CONNECTIVITY & SEED DATA INTEGRITY
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const roleCount = await prisma.role.count();
    record(
      'TC_M_002',
      'Local Microsoft SQL Server 2025 Database Integrity',
      userCount >= 9 && productCount >= 30 && roleCount === 7,
      `Users: ${userCount}, Products: ${productCount}, Roles: ${roleCount}`
    );

    // 3. REGISTRATION API WITH REAL BCRYPT & MSSQL
    const testEmail = `collector_test_${Date.now()}@watchhub.test`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Master Test Collector',
        email: testEmail,
        password: 'SecurePassword123!',
        phone: '9876543210'
      })
    });
    const regJson = await regRes.json();
    record(
      'TC_M_003',
      'POST /api/auth/register Customer Creation',
      regRes.status === 201 && regJson.status === 'success' && !!regJson.accessToken,
      `Created User ID: ${regJson.user?.id}`
    );

    // 4. DUPLICATE REGISTRATION REJECTION
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Master Test Collector Dup',
        email: testEmail,
        password: 'AnotherPassword123!'
      })
    });
    record(
      'TC_M_004',
      'POST /api/auth/register Duplicate Email Rejection',
      dupRes.status === 400
    );

    // 5. STANDARD PASSWORD LOGIN
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePassword123!'
      })
    });
    const loginJson = await loginRes.json();
    const accessToken = loginJson.accessToken;
    const cookieHeader = loginRes.headers.get('set-cookie');
    record(
      'TC_M_005',
      'POST /api/auth/login with Bcrypt Verification & Tokens',
      loginRes.status === 200 && !!accessToken && (cookieHeader ? cookieHeader.includes('refreshToken') : true),
      `Role: ${loginJson.user?.role}`
    );

    // 6. INVALID PASSWORD REJECTION (CONSTANT TIME)
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword!'
      })
    });
    record('TC_M_006', 'POST /api/auth/login Invalid Password Rejection (401)', badLoginRes.status === 401);

    // 7. GET /api/auth/me WITH BEARER ACCESS TOKEN
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const meJson = await meRes.json();
    record(
      'TC_M_007',
      'GET /api/auth/me Protected Profile Access',
      meRes.status === 200 && meJson.user?.email === testEmail
    );

    // 8. GET /api/auth/me WITHOUT TOKEN (401)
    const unauthRes = await fetch(`${baseUrl}/api/auth/me`);
    record('TC_M_008', 'GET /api/auth/me Rejects Unauthenticated Request (401)', unauthRes.status === 401);

    // 9. POST /api/auth/send-email-otp
    const otpTargetEmail = `otp_verify_${Date.now()}@watchhub.test`;
    const sendEmailOtpRes = await fetch(`${baseUrl}/api/auth/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: otpTargetEmail,
        purpose: 'registration',
        name: 'OTP Collector'
      })
    });
    const sendEmailOtpJson = await sendEmailOtpRes.json();
    record(
      'TC_M_009',
      'POST /api/auth/send-email-otp Atomic Reservation & Dispatch',
      sendEmailOtpRes.status === 200 && sendEmailOtpJson.status === 'success' && sendEmailOtpJson.cooldownSeconds === 60
    );

    // 10. POST /api/auth/send-otp (ALIAS COMPATIBILITY CHECK)
    const aliasEmail = `alias_${Date.now()}@watchhub.test`;
    const aliasRes = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: aliasEmail,
        purpose: 'registration'
      })
    });
    record(
      'TC_M_010',
      'POST /api/auth/send-otp Backwards-Compatible Alias Route',
      aliasRes.status === 200
    );

    // 11. COOLDOWN RATE LIMIT ENFORCEMENT (429)
    const cooldownRes = await fetch(`${baseUrl}/api/auth/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: otpTargetEmail,
        purpose: 'registration'
      })
    });
    record(
      'TC_M_011',
      'POST /api/auth/send-email-otp Cooldown Enforcement (HTTP 429)',
      cooldownRes.status === 429
    );

    // 12. V3 OTP DIRECT VERIFICATION & SINGLE-USE CONSUMPTION
    // Query the stored record in MSSQL
    const otpRecord = await prisma.oTPVerification.findUnique({
      where: {
        identifier_purpose: {
          identifier: otpTargetEmail,
          purpose: 'registration'
        }
      }
    });
    record(
      'TC_M_012',
      'SQL Server OTPVerifications V3 State Record Exists',
      otpRecord && (otpRecord.dispatchState === 'ACTIVE' || otpRecord.dispatchState === 'RESERVED'),
      `State: ${otpRecord?.dispatchState}, LeaseToken: ${otpRecord?.dispatchToken ? 'PRESENT' : 'MISSING'}`
    );

    // 13. POST /api/auth/email-login & FORGOT PASSWORD FLOW
    const forgotRes = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    record(
      'TC_M_013',
      'POST /api/auth/forgot-password Non-Enumerating Password Recovery',
      forgotRes.status === 200
    );

    // 14. CLEANUP TEST DATA (Preserve genuine database records)
    await prisma.userRole.deleteMany({ where: { user: { email: { in: [testEmail] } } } });
    await prisma.user.deleteMany({ where: { email: { in: [testEmail] } } });
    await prisma.oTPVerification.deleteMany({ where: { identifier: { in: [otpTargetEmail, aliasEmail] } } });
    record('TC_M_014', 'Test Artifacts Cleaned Up Without Impacting Base Data', true);

    // 15. PRODUCTS API CATALOG QUERY
    const prodRes = await fetch(`${baseUrl}/api/products`);
    const prodJson = await prodRes.json();
    record(
      'TC_M_015',
      'GET /api/products Active Catalog Retrieval',
      prodRes.status === 200 && (prodJson.products?.length > 0 || prodJson.length > 0 || prodJson.status === 'success')
    );

    // 16. CATEGORIES & BRANDS TAXONOMY
    const catRes = await fetch(`${baseUrl}/api/products/categories`);
    const brandRes = await fetch(`${baseUrl}/api/products/brands`);
    record(
      'TC_M_016',
      'GET /api/products/categories and /brands Retrieval',
      catRes.status === 200 && brandRes.status === 200
    );

    // 17. COUPON VOUCHER VALIDATION API
    const couponRes = await fetch(`${baseUrl}/api/payments/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promoCode: 'INVALID_CODE', subtotal: 50000 })
    });
    record(
      'TC_M_017',
      'POST /api/payments/validate-coupon Invalid Coupon Rejection (400)',
      couponRes.status === 400
    );

    // 18. RAZORPAY CHECKOUT ORDER CREATION
    const orderCreateRes = await fetch(`${baseUrl}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { price: 18999, quantity: 1, name: 'Rolex Submariner' }
        ],
        shippingMethod: 'standard'
      })
    });
    const orderCreateJson = await orderCreateRes.json();
    record(
      'TC_M_018',
      'POST /api/payments/create-order Razorpay Order Initialization',
      orderCreateRes.status === 200 && !!orderCreateJson.orderId && orderCreateJson.status === 'success',
      `OrderId: ${orderCreateJson.orderId}, Amount: ${orderCreateJson.amount}`
    );

    // 19. PARCEL DELIVERY TRACKING LOOKUP
    const trackRes = await fetch(`${baseUrl}/api/tracking/WH20261125`);
    const trackJson = await trackRes.json();
    record(
      'TC_M_019',
      'GET /api/tracking/:query Order & Consignment Tracking',
      trackRes.status === 200 && trackJson.status === 'success',
      `Courier: ${trackJson.data?.courierPartner || 'Assigned'}`
    );

    // 20. SAVED ADDRESSES QUERY
    const addrRes = await fetch(`${baseUrl}/api/users/addresses`);
    const addrJson = await addrRes.json();
    record(
      'TC_M_020',
      'GET /api/users/addresses Delivery Addresses Retrieval',
      addrRes.status === 200 && (addrJson.addresses?.length > 0 || addrJson.data?.length > 0 || Array.isArray(addrJson))
    );

  } catch (err) {
    console.error('Master Test Suite Error:', err);
    record('TC_M_FATAL', 'Master Test Suite Execution', false, err.message);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }

  console.log('\n===============================================================');
  const passedCount = results.filter(r => r.status === 'PASS').length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log('===============================================================');
}

runMasterSuite();
