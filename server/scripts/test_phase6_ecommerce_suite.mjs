import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/config/prisma.js';
import authRoutes from '../src/routes/authRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';
import paymentRoutes from '../src/routes/paymentRoutes.js';
import trackingRoutes from '../src/routes/trackingRoutes.js';
import userRoutes from '../src/routes/userRoutes.js';
import dashboardRoutes from '../src/routes/dashboardRoutes.js';
import inventoryRoutes from '../src/routes/inventoryRoutes.js';

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
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/inventory', inventoryRoutes);

  return new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

const results = [];
function record(testId, category, name, passed, details = '') {
  results.push({ testId, category, name, status: passed ? 'PASS' : 'FAIL', details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] [${category}] ${testId}: ${name}${details ? ' - ' + details : ''}`);
}

async function runPhase6Suite() {
  console.log('========================================================================');
  console.log('WATCHHUB PHASE 6 — LOCAL E-COMMERCE FUNCTIONAL VALIDATION SUITE');
  console.log('========================================================================\n');

  let testCustomerToken = null;
  let testAdminToken = null;
  const testCustomerEmail = `phase6_collector_${Date.now()}@watchhub.test`;
  let createdAddressId = null;

  try {
    await setupServer();
    console.log(`Test Gateway active at: ${baseUrl}\n`);

    // ========================================================================
    // TASK 1: CUSTOMER WORKFLOWS
    // ========================================================================
    console.log('--- TASK 1: CUSTOMER WORKFLOW VALIDATION ---');

    // 1. Customer Registration
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Phase6 Customer',
        email: testCustomerEmail,
        password: 'Password123!',
        phone: '9123456789',
      }),
    });
    const regJson = await regRes.json();
    testCustomerToken = regJson.accessToken;
    record(
      'TC_CUST_001',
      'Customer',
      'Registration & Customer Profile Provisioning',
      regRes.status === 201 && !!testCustomerToken,
      `User ID: ${regJson.user?.id}`
    );

    // 2. Customer Login
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testCustomerEmail,
        password: 'Password123!',
      }),
    });
    const loginJson = await loginRes.json();
    record(
      'TC_CUST_002',
      'Customer',
      'Customer Password Authentication',
      loginRes.status === 200 && loginJson.user?.role === 'Customer'
    );

    // 3. Customer Profile Inspection
    const profileRes = await fetch(`${baseUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${testCustomerToken}` },
    });
    const profileJson = await profileRes.json();
    record(
      'TC_CUST_003',
      'Customer',
      'GET /api/users/profile Account Details',
      profileRes.status === 200 && profileJson.user?.email === testCustomerEmail
    );

    // 4. Customer Profile Update
    const updateProfileRes = await fetch(`${baseUrl}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testCustomerToken}`,
      },
      body: JSON.stringify({
        name: 'Phase6 Customer Updated',
        phone: '9988776655',
      }),
    });
    const updateProfileJson = await updateProfileRes.json();
    record(
      'TC_CUST_004',
      'Customer',
      'PUT /api/users/profile Account Details Update',
      updateProfileRes.status === 200 && updateProfileJson.user?.name === 'Phase6 Customer Updated'
    );

    // 5. Add Delivery Address
    const addAddrRes = await fetch(`${baseUrl}/api/users/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testCustomerToken}`,
      },
      body: JSON.stringify({
        email: testCustomerEmail,
        fullName: 'Phase6 Customer',
        street: 'Penthouse 22, Skyline Towers',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        phone: '9988776655',
        isDefault: true,
      }),
    });
    const addAddrJson = await addAddrRes.json();
    createdAddressId = addAddrJson.address?.addressId;
    record(
      'TC_CUST_005',
      'Customer',
      'POST /api/users/addresses Add Shipping Address',
      addAddrRes.status === 201 && !!createdAddressId
    );

    // 6. Product Catalog Browsing
    const catalogRes = await fetch(`${baseUrl}/api/products`);
    const catalogJson = await catalogRes.json();
    const productList = catalogJson.data || [];
    const sampleProduct = productList[0];
    record(
      'TC_CUST_006',
      'Customer',
      'GET /api/products Catalog Retrieval',
      catalogRes.status === 200 && productList.length >= 30,
      `Retrieved ${productList.length} luxury timepieces`
    );

    // 7. Product Details Lookup
    let singleProdOk = false;
    if (sampleProduct) {
      const singleRes = await fetch(`${baseUrl}/api/products/${sampleProduct.id}`);
      const singleJson = await singleRes.json();
      singleProdOk = singleRes.status === 200 && singleJson.data?.name === sampleProduct.name;
    }
    record(
      'TC_CUST_007',
      'Customer',
      'GET /api/products/:id Single Product Specifications',
      singleProdOk,
      sampleProduct?.name
    );

    // 8. Catalog Filtering by Search
    const searchRes = await fetch(`${baseUrl}/api/products?search=Rolex`);
    const searchJson = await searchRes.json();
    record(
      'TC_CUST_008',
      'Customer',
      'GET /api/products?search=Rolex Brand & Name Filter',
      searchRes.status === 200 && (searchJson.data?.length > 0)
    );

    // 9. Checkout Voucher Validation
    const voucherRes = await fetch(`${baseUrl}/api/payments/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promoCode: 'WATCHHUB10', subtotal: 50000 }),
    });
    const voucherJson = await voucherRes.json();
    record(
      'TC_CUST_009',
      'Customer',
      'POST /api/payments/validate-coupon Voucher Evaluation',
      voucherRes.status === 200 && voucherJson.valid === true,
      `Discount Percentage: ${voucherJson.discountPercentage}%`
    );

    // 10. Razorpay Checkout Order Creation
    const checkoutOrderRes = await fetch(`${baseUrl}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ price: 18999, quantity: 1, name: sampleProduct?.name || 'Watch' }],
        shippingMethod: 'armoured',
        promoCode: 'WATCHHUB10',
      }),
    });
    const checkoutOrderJson = await checkoutOrderRes.json();
    record(
      'TC_CUST_010',
      'Customer',
      'POST /api/payments/create-order Order & Amount Calculation',
      checkoutOrderRes.status === 200 && !!checkoutOrderJson.orderId,
      `Calculated Payable: ₹${checkoutOrderJson.calculatedAmount}`
    );

    // 11. Delivery Consignment Tracking
    const trackingRes = await fetch(`${baseUrl}/api/tracking/WH20261125`);
    const trackingJson = await trackingRes.json();
    record(
      'TC_CUST_011',
      'Customer',
      'GET /api/tracking/:orderId Real-time Logistics Status',
      trackingRes.status === 200 && trackingJson.status === 'success',
      `Status: ${trackingJson.data?.orderStatus || 'Confirmed'}`
    );

    // ========================================================================
    // TASK 2: ADMIN WORKFLOWS & RBAC
    // ========================================================================
    console.log('\n--- TASK 2: ADMIN WORKFLOW & RBAC VALIDATION ---');

    // Generate Super Admin Token for verification
    const superAdminUser = await prisma.user.findFirst({
      where: { userRoles: { some: { role: { roleName: 'Super Admin' } } } },
    });
    testAdminToken = jwt.sign(
      {
        id: superAdminUser.userId,
        name: superAdminUser.fullName,
        email: superAdminUser.email,
        role: 'Super Admin',
        permissions: ['all'],
      },
      process.env.JWT_ACCESS_SECRET || 'watchhub_super_secret_access_jwt_key_2026_luxury_chronograph',
      { expiresIn: '1h' }
    );

    // 12. Super Admin Dashboard Telemetry
    const superAdminStatsRes = await fetch(`${baseUrl}/api/dashboard/super-admin`, {
      headers: { Authorization: `Bearer ${testAdminToken}` },
    });
    const superAdminStatsJson = await superAdminStatsRes.json();
    record(
      'TC_ADMIN_012',
      'Admin',
      'GET /api/dashboard/super-admin SQL Server Live KPIs',
      superAdminStatsRes.status === 200 && superAdminStatsJson.kpis?.totalProducts >= 30,
      `Total Revenue: ₹${superAdminStatsJson.kpis?.totalRevenue}, Products: ${superAdminStatsJson.kpis?.totalProducts}`
    );

    // 13. Store Admin Dashboard Telemetry
    const storeAdminStatsRes = await fetch(`${baseUrl}/api/dashboard/store-admin`, {
      headers: { Authorization: `Bearer ${testAdminToken}` },
    });
    record(
      'TC_ADMIN_013',
      'Admin',
      'GET /api/dashboard/store-admin Store KPIs & Sales Matrix',
      storeAdminStatsRes.status === 200
    );

    // 14. Inventory Manager Telemetry
    const inventoryStatsRes = await fetch(`${baseUrl}/api/dashboard/inventory-manager`, {
      headers: { Authorization: `Bearer ${testAdminToken}` },
    });
    record(
      'TC_ADMIN_014',
      'Admin',
      'GET /api/dashboard/inventory-manager Stock Balances',
      inventoryStatsRes.status === 200
    );

    // 15. RBAC Protection: Customer Forbidden from Super Admin API (403)
    const rbacSuperAdminRes = await fetch(`${baseUrl}/api/dashboard/super-admin`, {
      headers: { Authorization: `Bearer ${testCustomerToken}` },
    });
    record(
      'TC_RBAC_015',
      'RBAC',
      'Customer Denied Super Admin Dashboard (HTTP 403)',
      rbacSuperAdminRes.status === 403
    );

    // 16. RBAC Protection: Customer Forbidden from Store Admin API (403)
    const rbacStoreAdminRes = await fetch(`${baseUrl}/api/dashboard/store-admin`, {
      headers: { Authorization: `Bearer ${testCustomerToken}` },
    });
    record(
      'TC_RBAC_016',
      'RBAC',
      'Customer Denied Store Admin Dashboard (HTTP 403)',
      rbacStoreAdminRes.status === 403
    );

    // 17. RBAC Protection: Customer Forbidden from Product Mutation (403)
    const rbacProdCreateRes = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testCustomerToken}`,
      },
      body: JSON.stringify({ name: 'Unauthorized Watch' }),
    });
    record(
      'TC_RBAC_017',
      'RBAC',
      'Customer Denied Product Creation POST /api/products (HTTP 403)',
      rbacProdCreateRes.status === 403
    );

    // 18. RBAC Protection: Customer Forbidden from Inventory Stock Ingestion (403)
    const rbacStockRes = await fetch(`${baseUrl}/api/inventory/add-stock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testCustomerToken}`,
      },
      body: JSON.stringify({ productId: 'prod_1', quantity: 50 }),
    });
    record(
      'TC_RBAC_018',
      'RBAC',
      'Customer Denied Inventory Ingestion POST /api/inventory/add-stock (HTTP 403)',
      rbacStockRes.status === 403
    );

    // ========================================================================
    // TASK 3: CLEANUP ISOLATED TEST ARTIFACTS
    // ========================================================================
    console.log('\n--- CLEANING UP TEST RECORDS ---');
    if (createdAddressId) {
      await prisma.address.deleteMany({ where: { addressId: createdAddressId } });
    }
    await prisma.userRole.deleteMany({ where: { user: { email: testCustomerEmail } } });
    await prisma.user.deleteMany({ where: { email: testCustomerEmail } });
    record(
      'TC_CLEAN_019',
      'Cleanup',
      'Disposable Test Records Cleaned (0 Baseline Impact)',
      true
    );

  } catch (err) {
    console.error('Phase 6 Test Failure:', err);
    record('TC_FATAL', 'Fatal', 'Suite Execution', false, err.message);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }

  console.log('\n========================================================================');
  const passedCount = results.filter(r => r.status === 'PASS').length;
  console.log(`PHASE 6 VALIDATION: ${results.length} TESTS | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
  console.log('========================================================================');
}

runPhase6Suite();
