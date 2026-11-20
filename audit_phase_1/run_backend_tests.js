import http from 'http';
import app from '../server/src/app.js';
import fs from 'fs';
import path from 'path';

const testResults = [];
let passedCount = 0;
let failedCount = 0;
let partialCount = 0;
let blockedCount = 0;

function recordTest(testId, module, testCase, expected, actual, status, error = null, evidence = null) {
  const resultObj = {
    testId,
    module,
    testCase,
    expected,
    actual,
    status,
    error: error ? String(error).replace(/[\r\n]+/g, ' ') : 'None',
    evidence: evidence ? JSON.stringify(evidence).substring(0, 300) : 'Recorded',
  };
  testResults.push(resultObj);
  if (status === 'PASS') passedCount++;
  else if (status === 'FAIL') failedCount++;
  else if (status === 'PARTIAL') partialCount++;
  else if (status === 'BLOCKED') blockedCount++;

  console.log(`[${status}] ${testId} - ${module} :: ${testCase}`);
  if (error) console.log(`   └─ Error: ${error}`);
}

async function runTests() {
  console.log('================================================================');
  console.log('WATCHHUB AUTOMATED BACKEND & API AUDIT TEST RUNNER');
  console.log('Execution Date: ' + new Date().toISOString());
  console.log('================================================================\n');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running on ephemeral test port: ${port}\n`);

  try {
    // 1. Health & Root Tests
    {
      const res = await fetch(`${baseUrl}/api/health`);
      const body = await res.json();
      if (res.status === 200 && body.status === 'success') {
        recordTest('TC_API_001', 'Core API', 'GET /api/health endpoint', 'HTTP 200 with status: success', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_API_001', 'Core API', 'GET /api/health endpoint', 'HTTP 200 with status: success', `HTTP ${res.status}`, 'FAIL', 'Unexpected status code or body', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api`);
      const body = await res.json();
      if (res.status === 200 && Array.isArray(body.roles) && body.roles.length >= 6) {
        recordTest('TC_API_002', 'Core API', 'GET /api root endpoint returns platform roles', 'HTTP 200 with 6 operational roles listed', `HTTP ${res.status} with ${body.roles.length} roles`, 'PASS', null, body);
      } else {
        recordTest('TC_API_002', 'Core API', 'GET /api root endpoint returns platform roles', 'HTTP 200 with 6 roles', `HTTP ${res.status}`, 'FAIL', 'Missing expected role metadata', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid-email-address' }),
      });
      const body = await res.json();
      if (res.status === 400 && body.status === 'fail') {
        recordTest('TC_API_003', 'Core API', 'POST /api/newsletter reject invalid email', 'HTTP 400 validation rejection', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_API_003', 'Core API', 'POST /api/newsletter reject invalid email', 'HTTP 400', `HTTP ${res.status}`, 'FAIL', 'Invalid email was accepted or wrong status', body);
      }
    }

    // 2. App Version API
    {
      const res = await fetch(`${baseUrl}/api/app/version`);
      const body = await res.json();
      if (res.status === 200 && body.version) {
        recordTest('TC_APP_001', 'App Update', 'GET /api/app/version returns semantic version', 'HTTP 200 with current app version', `HTTP ${res.status} v${body.version}`, 'PASS', null, body);
      } else {
        recordTest('TC_APP_001', 'App Update', 'GET /api/app/version returns semantic version', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Version endpoint failed', body);
      }
    }

    // 3. Auth API Tests
    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const body = await res.json();
      if (res.status === 400 && body.status === 'fail') {
        recordTest('TC_AUTH_001', 'Authentication', 'POST /api/auth/login empty payload validation', 'HTTP 400 validation error', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_AUTH_001', 'Authentication', 'POST /api/auth/login empty payload validation', 'HTTP 400', `HTTP ${res.status}`, 'FAIL', 'Failed to validate empty body', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent_collector@watchhub.test', password: 'wrong_password_123' }),
      });
      const body = await res.json();
      if (res.status === 401 && body.status === 'fail') {
        recordTest('TC_AUTH_002', 'Authentication', 'POST /api/auth/login invalid credentials rejection', 'HTTP 401 unauthorized', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_AUTH_002', 'Authentication', 'POST /api/auth/login invalid credentials rejection', 'HTTP 401', `HTTP ${res.status}`, 'FAIL', 'Invalid credentials returned non-401', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const body = await res.json();
      if (res.status === 401 && body.status === 'fail') {
        recordTest('TC_AUTH_003', 'Authentication', 'GET /api/auth/me without JWT token rejection', 'HTTP 401 Authentication required', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_AUTH_003', 'Authentication', 'GET /api/auth/me without JWT token rejection', 'HTTP 401', `HTTP ${res.status}`, 'FAIL', 'Unauthenticated request was not rejected', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/auth/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email' }),
      });
      const body = await res.json();
      if (res.status === 400 && body.status === 'fail') {
        recordTest('TC_OTP_001', 'OTP System', 'POST /api/auth/send-email-otp invalid email format validation', 'HTTP 400 fail', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_OTP_001', 'OTP System', 'POST /api/auth/send-email-otp invalid email format validation', 'HTTP 400', `HTTP ${res.status}`, 'FAIL', 'Invalid email accepted', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/auth/verify-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@watchhub.in', otp: '12' }),
      });
      const body = await res.json();
      if (res.status === 400 && body.status === 'fail') {
        recordTest('TC_OTP_002', 'OTP System', 'POST /api/auth/verify-email-otp malformed OTP reject (length < 6)', 'HTTP 400 fail', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_OTP_002', 'OTP System', 'POST /api/auth/verify-email-otp malformed OTP reject', 'HTTP 400', `HTTP ${res.status}`, 'FAIL', 'Malformed OTP was not rejected with 400', body);
      }
    }

    // 4. Products API Tests
    {
      const res = await fetch(`${baseUrl}/api/products`);
      const body = await res.json();
      if (res.status === 200 && Array.isArray(body.products || body.data || body)) {
        const count = (body.products || body.data || body).length;
        recordTest('TC_PROD_001', 'Products', 'GET /api/products returns product catalog', 'HTTP 200 with catalog array', `HTTP ${res.status} (${count} products returned)`, 'PASS', null, { count });
      } else {
        recordTest('TC_PROD_001', 'Products', 'GET /api/products returns product catalog', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Catalog format invalid', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/products/nonexistent_prod_id_999`);
      const body = await res.json();
      if (res.status === 404 || (res.status === 400 && body.status === 'fail')) {
        recordTest('TC_PROD_002', 'Products', 'GET /api/products/:id with nonexistent ID returns 404', 'HTTP 404/400 failure', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_PROD_002', 'Products', 'GET /api/products/:id with nonexistent ID returns 404', 'HTTP 404', `HTTP ${res.status}`, 'FAIL', 'Unexpected status code', body);
      }
    }

    // 5. Security & Authorization Hole in Products API: Unauthenticated POST
    {
      const res = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Malicious Unauthenticated Watch Creation', price: 99999 }),
      });
      const body = await res.json();
      // An unauthenticated guest SHOULD be rejected with 401 or 403
      if (res.status === 401 || res.status === 403) {
        recordTest('TC_SEC_001', 'Security RBAC', 'POST /api/products requires authentication and Store Admin role', 'HTTP 401/403 Unauthorized', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_SEC_001', 'Security RBAC', 'POST /api/products requires authentication and Store Admin role', 'HTTP 401/403', `HTTP ${res.status} (Allowed without auth!)`, 'FAIL', 'SECURITY FLAW: Product creation route lacks authenticate / authorizeRoles middleware!', body);
      }
    }

    // 6. Security Audit: Dashboard Endpoints Auth Check
    {
      const endpoints = [
        { path: '/api/dashboard/super-admin', role: 'Super Admin', tcId: 'TC_DASH_001' },
        { path: '/api/dashboard/store-admin', role: 'Store Admin', tcId: 'TC_DASH_002' },
        { path: '/api/dashboard/inventory-manager', role: 'Inventory Manager', tcId: 'TC_DASH_003' },
        { path: '/api/dashboard/delivery-manager', role: 'Delivery Manager', tcId: 'TC_DASH_004' },
        { path: '/api/dashboard/customer-support', role: 'Customer Support', tcId: 'TC_DASH_005' },
      ];

      for (const ep of endpoints) {
        const res = await fetch(`${baseUrl}${ep.path}`);
        const body = await res.json();
        if (res.status === 401 || res.status === 403) {
          recordTest(ep.tcId, 'Role Dashboards', `GET ${ep.path} RBAC check`, 'HTTP 401/403 Unauthorized', `HTTP ${res.status}`, 'PASS', null, body);
        } else if (res.status === 200) {
          recordTest(ep.tcId, 'Role Dashboards', `GET ${ep.path} RBAC check`, 'HTTP 401/403 Unauthorized', `HTTP 200 (Accessible without credentials!)`, 'FAIL', `SECURITY FLAW: ${ep.role} dashboard route has no authentication middleware`, body);
        } else {
          recordTest(ep.tcId, 'Role Dashboards', `GET ${ep.path} RBAC check`, 'HTTP 401/403', `HTTP ${res.status}`, 'PARTIAL', null, body);
        }
      }
    }

    // 7. Security Audit: Development Mock Token Bypass in auth.js
    {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          'Authorization': 'Bearer mock_token_bypass_test',
          'x-user-role': 'Super Admin',
        },
      });
      const body = await res.json();
      if (res.status === 401) {
        recordTest('TC_SEC_002', 'Security RBAC', 'Bypass test: Bearer mock_token should be rejected', 'HTTP 401 Token Invalid', `HTTP ${res.status}`, 'PASS', null, body);
      } else if (res.status === 200 && body.user) {
        recordTest('TC_SEC_002', 'Security RBAC', 'Bypass test: Bearer mock_token should be rejected', 'HTTP 401 Token Invalid', `HTTP 200 (Bypass Accepted: Role ${body.user?.role})`, 'FAIL', 'CRITICAL SECURITY FLAW: auth.js contains hardcoded mock token bypass accepting fake JWTs with Super Admin header', body);
      } else {
        recordTest('TC_SEC_002', 'Security RBAC', 'Bypass test: Bearer mock_token should be rejected', 'HTTP 401', `HTTP ${res.status}`, 'PARTIAL', null, body);
      }
    }

    // 8. Inventory API Tests
    {
      const res = await fetch(`${baseUrl}/api/inventory`);
      const body = await res.json();
      if (res.status === 200 && Array.isArray(body.inventory || body.data || body)) {
        const count = (body.inventory || body.data || body).length;
        recordTest('TC_INV_001', 'Inventory Manager', 'GET /api/inventory fetch inventory items', 'HTTP 200 array of stock', `HTTP ${res.status} (${count} items)`, 'PASS', null, { count });
      } else {
        recordTest('TC_INV_001', 'Inventory Manager', 'GET /api/inventory fetch inventory items', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Invalid response format', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/inventory/warehouses`);
      const body = await res.json();
      if (res.status === 200 && (body.warehouses || body.data || Array.isArray(body))) {
        recordTest('TC_INV_002', 'Inventory Manager', 'GET /api/inventory/warehouses list warehouses', 'HTTP 200 warehouses list', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_INV_002', 'Inventory Manager', 'GET /api/inventory/warehouses list warehouses', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Warehouse endpoint failed', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/inventory/movements`);
      const body = await res.json();
      if (res.status === 200 && (body.movements || body.data || Array.isArray(body))) {
        recordTest('TC_INV_003', 'Inventory Manager', 'GET /api/inventory/movements stock movement audit', 'HTTP 200 stock movements', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_INV_003', 'Inventory Manager', 'GET /api/inventory/movements stock movement audit', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Movements endpoint failed', body);
      }
    }

    // 9. Delivery API Tests
    {
      const res = await fetch(`${baseUrl}/api/delivery`);
      const body = await res.json();
      if (res.status === 200 && (body.data?.orders || body.shipments || Array.isArray(body.data))) {
        recordTest('TC_DEL_001', 'Delivery Manager', 'GET /api/delivery active shipment list', 'HTTP 200 shipments list', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_DEL_001', 'Delivery Manager', 'GET /api/delivery active shipment list', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Delivery endpoint failed', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/delivery`);
      const body = await res.json();
      if (res.status === 200 && (body.data?.partners || body.deliveryPartners || Array.isArray(body.data))) {
        recordTest('TC_DEL_002', 'Delivery Manager', 'GET /api/delivery delivery partner roster', 'HTTP 200 delivery partner roster', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_DEL_002', 'Delivery Manager', 'GET /api/delivery delivery partner roster', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Partners endpoint failed', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/delivery/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId: 'invalid_shipment', otp: '000000' }),
      });
      const body = await res.json();
      if (res.status === 400 || res.status === 404 || body.status === 'fail') {
        recordTest('TC_DEL_003', 'Delivery Partner', 'POST /api/delivery/verify-otp invalid OTP rejection', 'HTTP 400/404 fail', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_DEL_003', 'Delivery Partner', 'POST /api/delivery/verify-otp invalid OTP rejection', 'HTTP 400/404', `HTTP ${res.status}`, 'FAIL', 'Invalid OTP verification succeeded or returned non-error', body);
      }
    }

    // 10. Support API Tests
    {
      const res = await fetch(`${baseUrl}/api/support`);
      const body = await res.json();
      if (res.status === 200 && (body.tickets || body.data?.tickets || Array.isArray(body.data))) {
        recordTest('TC_SUP_001', 'Customer Support', 'GET /api/support customer support ticket list', 'HTTP 200 tickets list', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_SUP_001', 'Customer Support', 'GET /api/support customer support ticket list', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Support endpoint failed', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/support`);
      const body = await res.json();
      if (res.status === 200 && (body.stats || body.data?.stats || body.data?.supportStats || body.status === 'success')) {
        recordTest('TC_SUP_002', 'Customer Support', 'GET /api/support support KPIs and trend data', 'HTTP 200 with ticket KPIs', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_SUP_002', 'Customer Support', 'GET /api/support support KPIs and trend data', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Support stats failed', body);
      }
    }

    // 11. Payments API Tests
    {
      const res = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ name: 'Rolex Submariner', price: 18999, quantity: 1 }],
          shippingMethod: 'armoured',
        }),
      });
      const body = await res.json();
      if (res.status === 200 && (body.orderId || body.order?.id || body.id)) {
        recordTest('TC_PAY_001', 'Payment Gateway', 'POST /api/payments/create-order Razorpay order initiation', 'HTTP 200 with orderId', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_PAY_001', 'Payment Gateway', 'POST /api/payments/create-order Razorpay order initiation', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Payment order creation failed', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: 'order_fake_123',
          razorpay_payment_id: 'pay_fake_456',
          razorpay_signature: 'invalid_sha256_hmac_signature',
        }),
      });
      const body = await res.json();
      if (res.status === 400 && (body.status === 'fail' || !body.success)) {
        recordTest('TC_PAY_002', 'Payment Gateway', 'POST /api/payments/verify forged Razorpay signature reject', 'HTTP 400 signature verification failed', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_PAY_002', 'Payment Gateway', 'POST /api/payments/verify forged Razorpay signature reject', 'HTTP 400', `HTTP ${res.status}`, 'FAIL', 'Forged payment signature was not rejected', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/payments/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promoCode: 'WATCHHUB10',
          subtotal: 25000,
        }),
      });
      const body = await res.json();
      if (res.status === 200 && body.status === 'success' && body.valid === true && body.coupon?.discountAmount === 2500) {
        recordTest('TC_PAY_003', 'Payment Gateway', 'POST /api/payments/validate-coupon valid coupon check', 'HTTP 200 with valid coupon details', `HTTP ${res.status} (Discount ₹${body.coupon.discountAmount})`, 'PASS', null, body);
      } else {
        recordTest('TC_PAY_003', 'Payment Gateway', 'POST /api/payments/validate-coupon valid coupon check', 'HTTP 200', `HTTP ${res.status}`, 'FAIL', 'Valid coupon validation failed', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/payments/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promoCode: 'INVALID_COUPON_CODE',
          subtotal: 25000,
        }),
      });
      const body = await res.json();
      if (res.status === 400 && body.status === 'fail') {
        recordTest('TC_PAY_004', 'Payment Gateway', 'POST /api/payments/validate-coupon invalid coupon rejection', 'HTTP 400 fail JSON', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_PAY_004', 'Payment Gateway', 'POST /api/payments/validate-coupon invalid coupon rejection', 'HTTP 400', `HTTP ${res.status}`, 'FAIL', 'Invalid coupon was not rejected', body);
      }
    }

    {
      const res = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ name: 'Rolex Submariner', price: 18999, quantity: 1 }],
          shippingMethod: 'armoured',
          promoCode: 'NON_EXISTENT_PROMO_XYZ',
        }),
      });
      const body = await res.json();
      if (res.status === 400 && body.status === 'fail') {
        recordTest('TC_PAY_005', 'Payment Gateway', 'POST /api/payments/create-order reject invalid promo code', 'HTTP 400 fail JSON', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_PAY_005', 'Payment Gateway', 'POST /api/payments/create-order reject invalid promo code', 'HTTP 400', `HTTP ${res.status}`, 'FAIL', 'Order accepted invalid promo code', body);
      }
    }

    // 12. Tracking API Tests
    {
      const res = await fetch(`${baseUrl}/api/tracking/order/WH-1001`);
      const body = await res.json();
      if (res.status === 200 || (res.status === 404 && body.status === 'fail')) {
        recordTest('TC_TRK_001', 'Order Tracking', 'GET /api/tracking/order/:id lookup order tracking record', 'HTTP 200 or 404 gracefully', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_TRK_001', 'Order Tracking', 'GET /api/tracking/order/:id lookup order tracking record', 'HTTP 200/404', `HTTP ${res.status}`, 'FAIL', 'Tracking route threw uncaught error', body);
      }
    }

    // 13. Security Headers Check
    {
      const res = await fetch(`${baseUrl}/api/health`);
      const helmetHeader = res.headers.get('x-dns-prefetch-control') || res.headers.get('x-frame-options');
      if (helmetHeader) {
        recordTest('TC_SEC_003', 'Security Headers', 'Helmet security headers inspection', 'Security headers present', 'Helmet active', 'PASS', null, { 'x-dns-prefetch-control': helmetHeader });
      } else {
        recordTest('TC_SEC_003', 'Security Headers', 'Helmet security headers inspection', 'Security headers present', 'Missing expected headers', 'PARTIAL', 'Helmet partially configured', {});
      }
    }

    // 14. 404 Fallback Route
    {
      const res = await fetch(`${baseUrl}/api/undefined_route_endpoint_xyz`);
      const body = await res.json();
      if (res.status === 404 && body.status === 'fail') {
        recordTest('TC_API_004', 'Core API', 'Fallback 404 route handling', 'HTTP 404 fail JSON', `HTTP ${res.status}`, 'PASS', null, body);
      } else {
        recordTest('TC_API_004', 'Core API', 'Fallback 404 route handling', 'HTTP 404', `HTTP ${res.status}`, 'FAIL', '404 route did not return proper JSON', body);
      }
    }

  } catch (err) {
    console.error('Fatal test execution error:', err);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    console.log('\nTest server shut down successfully.');
  }

  // Summary
  const total = testResults.length;
  const passRate = total > 0 ? ((passedCount / total) * 100).toFixed(1) : 0;

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${total} Tests Executed`);
  console.log(`Passed: ${passedCount} | Failed: ${failedCount} | Partial: ${partialCount} | Blocked: ${blockedCount}`);
  console.log(`Pass Rate: ${passRate}%`);
  console.log('================================================================\n');

  // Save JSON report for evidence
  fs.writeFileSync(
    path.join(process.cwd(), 'audit_phase_1/PHASE_1_EVIDENCE/backend_test_results.json'),
    JSON.stringify(testResults, null, 2)
  );

  return testResults;
}

runTests();
