import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getRoleDashboardPath = (role) => {
  const norm = (role || '').trim().toLowerCase();
  if (norm === 'super admin' || norm === 'super_admin') {
    return '/super-admin/dashboard';
  }
  if (norm === 'store admin' || norm === 'store_admin') {
    return '/store-admin/dashboard';
  }
  if (norm === 'inventory manager' || norm === 'inventory_manager') {
    return '/inventory-manager/dashboard';
  }
  if (norm === 'delivery manager' || norm === 'delivery_manager') {
    return '/delivery-manager/dashboard';
  }
  if (norm === 'delivery partner' || norm === 'delivery_partner') {
    return '/delivery-partner/dashboard';
  }
  if (norm.includes('support')) {
    return '/customer-support/dashboard';
  }
  return '/customer/dashboard';
};

async function testAllRoleAuthentication() {
  console.log('====================================================');
  console.log('WATCHHUB — COMPREHENSIVE ALL-ROLE AUTHENTICATION TEST');
  console.log('====================================================\n');

  const testAccounts = [
    { role: 'Customer', email: 'customer@watchhub.com', pass: 'Admin@123', expectedPath: '/customer/dashboard' },
    { role: 'Store Admin', email: 'admin@watchhub.com', pass: 'Admin@123', expectedPath: '/store-admin/dashboard' },
    { role: 'Inventory Manager', email: 'inventory@watchhub.com', pass: 'Admin@123', expectedPath: '/inventory-manager/dashboard' },
    { role: 'Delivery Manager', email: 'delivery@watchhub.com', pass: 'Admin@123', expectedPath: '/delivery-manager/dashboard' },
    { role: 'Delivery Partner (rider)', email: 'rider@watchhub.com', pass: 'Admin@123', expectedPath: '/delivery-partner/dashboard' },
    { role: 'Delivery Partner (rohan)', email: 'rohan.singh@watchhub.com', pass: 'Admin@123', expectedPath: '/delivery-partner/dashboard' },
    { role: 'Customer Support', email: 'support@watchhub.com', pass: 'Admin@123', expectedPath: '/customer-support/dashboard' },
    { role: 'Super Admin', email: 'superadmin@watchhub.com', pass: 'Admin@123', expectedPath: '/super-admin/dashboard' },
  ];

  let passed = 0;
  let total = testAccounts.length + 2;

  for (const acc of testAccounts) {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: acc.email,
        password: acc.pass,
      });

      if (res.status === 200 && res.data.status === 'success' && res.data.accessToken) {
        const destPath = getRoleDashboardPath(res.data.user.role);
        const pathMatches = destPath === acc.expectedPath;
        if (pathMatches) {
          console.log(`[PASS] ${acc.role.padEnd(26)}: ${acc.email} -> Logged In -> ${destPath}`);
          passed++;
        } else {
          console.error(`[FAIL] ${acc.role}: Path mismatch! Got ${destPath}, expected ${acc.expectedPath}`);
        }
      } else {
        console.error(`[FAIL] ${acc.role}: Unexpected response:`, res.data);
      }
    } catch (err) {
      console.error(`[FAIL] ${acc.role}: Error:`, err.response?.data || err.message);
    }
  }

  // Test Invalid Password rejection
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'customer@watchhub.com',
      password: 'WrongPassword!999',
    });
    console.error('[FAIL] Invalid password test should have rejected!');
  } catch (err) {
    if (err.response?.status === 401) {
      console.log('[PASS] Invalid password rejected correctly (HTTP 401)');
      passed++;
    } else {
      console.error('[FAIL] Invalid password returned non-401:', err.response?.status);
    }
  }

  // Test Non-existent user rejection
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'nonexistent_ghost@watchhub.com',
      password: 'Admin@123',
    });
    console.error('[FAIL] Nonexistent user test should have rejected!');
  } catch (err) {
    if (err.response?.status === 401) {
      console.log('[PASS] Nonexistent user rejected correctly (HTTP 401)');
      passed++;
    } else {
      console.error('[FAIL] Nonexistent user returned non-401:', err.response?.status);
    }
  }

  console.log('\n====================================================');
  console.log(`FINAL RESULT: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

testAllRoleAuthentication().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
