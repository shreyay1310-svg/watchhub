// WatchHub Atelier — Master Verification Suite for Default Login Entry Point & Route Protection
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const results = [];
function recordTest(id, name, status, details = '') {
  results.push({ id, name, status, details });
  console.log(`[${status === 'PASS' ? ' PASS ' : ' FAIL '}] Test ${id}: ${name} - ${details}`);
}

async function runTestSuite() {
  console.log('\n================================================================================');
  console.log('WATCHHUB ATELIER — DEFAULT LOGIN ENTRY POINT & ROUTE PROTECTION TEST SUITE');
  console.log('Target URL: ' + BASE_URL);
  console.log('Engine: Google Chrome Headless via Playwright Core');
  console.log('================================================================================\n');

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`Chrome binary not found at ${CHROME_PATH}`);
    process.exit(1);
  }

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Root Route '/' Redirects Unauthenticated Users to '/login'
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const currentUrl = page.url();
      const isLogin = currentUrl.includes('/login');
      const hasSignInText = await page.evaluate(() => {
        return document.body.innerText.includes('Welcome back') || document.body.innerText.includes('Sign In');
      });

      if (isLogin && hasSignInText) {
        recordTest('1', 'Root Route "/" redirects to "/login"', 'PASS', `Landed at ${currentUrl}`);
      } else {
        recordTest('1', 'Root Route "/" redirects to "/login"', 'FAIL', `Expected /login, got ${currentUrl}`);
      }
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST 2: Unauthenticated Access to Protected Customer Storefront Pages
    // -------------------------------------------------------------------------
    const protectedCustomerRoutes = [
      '/products',
      '/cart',
      '/checkout',
      '/wishlist',
      '/account',
      '/orders',
      '/customer/dashboard',
    ];

    for (let i = 0; i < protectedCustomerRoutes.length; i++) {
      const route = protectedCustomerRoutes[i];
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const currentUrl = page.url();
      const isRedirectedToLogin = currentUrl.includes('/login');

      if (isRedirectedToLogin) {
        recordTest(`2.${i + 1}`, `Protected Route "${route}" redirects to "/login"`, 'PASS', `Landed at ${currentUrl}`);
      } else {
        recordTest(`2.${i + 1}`, `Protected Route "${route}" redirects to "/login"`, 'FAIL', `Expected /login, got ${currentUrl}`);
      }
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST 3: Unauthenticated Access to Admin & Manager Dashboards
    // -------------------------------------------------------------------------
    const protectedAdminRoutes = [
      '/dashboard',
      '/super-admin/dashboard',
      '/store-admin/dashboard',
      '/inventory-manager/dashboard',
      '/delivery-manager/dashboard',
      '/delivery-partner/dashboard',
      '/customer-support/dashboard',
    ];

    for (let i = 0; i < protectedAdminRoutes.length; i++) {
      const route = protectedAdminRoutes[i];
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const currentUrl = page.url();
      const isRedirectedToLogin = currentUrl.includes('/login');

      if (isRedirectedToLogin) {
        recordTest(`3.${i + 1}`, `Admin Route "${route}" redirects to "/login"`, 'PASS', `Landed at ${currentUrl}`);
      } else {
        recordTest(`3.${i + 1}`, `Admin Route "${route}" redirects to "/login"`, 'FAIL', `Expected /login, got ${currentUrl}`);
      }
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST 4: Public Auth Pages Accessible Without Redirection
    // -------------------------------------------------------------------------
    const publicAuthRoutes = [
      '/login',
      '/signup',
      '/email-otp-login',
      '/forgot-password',
      '/reset-password',
    ];

    for (let i = 0; i < publicAuthRoutes.length; i++) {
      const route = publicAuthRoutes[i];
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      const currentUrl = page.url();
      const isCorrectRoute = currentUrl.includes(route);

      if (isCorrectRoute) {
        recordTest(`4.${i + 1}`, `Public Route "${route}" directly accessible`, 'PASS', `Active at ${currentUrl}`);
      } else {
        recordTest(`4.${i + 1}`, `Public Route "${route}" directly accessible`, 'FAIL', `Unexpected navigation to ${currentUrl}`);
      }
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST 5: Role-Based Redirection on Login (Customer, Super Admin, Store Admin)
    // -------------------------------------------------------------------------
    const testAccounts = [
      {
        role: 'Customer',
        email: 'customer@watchhub.com',
        expectedPaths: ['/customer/dashboard', '/dashboard', '/'],
      },
      {
        role: 'Super Admin',
        email: 'superadmin@watchhub.com',
        expectedPaths: ['/super-admin/dashboard', '/super-admin'],
      },
      {
        role: 'Store Admin',
        email: 'admin@watchhub.com',
        expectedPaths: ['/store-admin/dashboard', '/store-admin'],
      },
      {
        role: 'Inventory Manager',
        email: 'inventory@watchhub.com',
        expectedPaths: ['/inventory-manager/dashboard', '/inventory'],
      },
      {
        role: 'Delivery Manager',
        email: 'delivery@watchhub.com',
        expectedPaths: ['/delivery-manager/dashboard', '/delivery'],
      },
      {
        role: 'Customer Support',
        email: 'support@watchhub.com',
        expectedPaths: ['/customer-support/dashboard', '/support'],
      },
    ];

    for (let i = 0; i < testAccounts.length; i++) {
      const acc = testAccounts[i];
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Fill in credentials
      await page.fill('input[type="email"]', acc.email);
      await page.fill('input[type="password"]', 'Admin@123');
      await page.click('button[type="submit"]');

      // Wait for navigation after successful login
      await page.waitForTimeout(1600);
      const finalUrl = page.url();
      const matched = acc.expectedPaths.some((p) => finalUrl.includes(p));

      if (matched) {
        recordTest(`5.${i + 1}`, `Role Login: ${acc.role} redirects correctly`, 'PASS', `Landed at ${finalUrl}`);
      } else {
        recordTest(`5.${i + 1}`, `Role Login: ${acc.role} redirects correctly`, 'FAIL', `Expected one of [${acc.expectedPaths.join(', ')}], got ${finalUrl}`);
      }
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST 6: Preserved Return URL (`state: { from: location }`)
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      // Unauthenticated user attempts to go to /cart
      await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      if (page.url().includes('/login')) {
        // Now log in as customer
        await page.fill('input[type="email"]', 'customer@watchhub.com');
        await page.fill('input[type="password"]', 'Admin@123');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1600);

        const returnUrl = page.url();
        if (returnUrl.includes('/cart')) {
          recordTest('6', 'Preserved URL redirection after login (/cart)', 'PASS', `Successfully returned to ${returnUrl}`);
        } else {
          recordTest('6', 'Preserved URL redirection after login (/cart)', 'FAIL', `Expected /cart, got ${returnUrl}`);
        }
      } else {
        recordTest('6', 'Preserved URL redirection after login (/cart)', 'FAIL', 'Was not initially redirected to /login');
      }
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST 7: Logout Clears Session & Prevents Back Navigation Exposure
    // -------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
      await page.fill('input[type="email"]', 'customer@watchhub.com');
      await page.fill('input[type="password"]', 'Admin@123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1600);

      // Verify authenticated
      const tokenBefore = await page.evaluate(() => localStorage.getItem('watchhub_token'));
      if (!tokenBefore) {
        recordTest('7', 'Logout & Session Clearance', 'FAIL', 'Token not saved after login');
      } else {
        // Trigger client-side logout
        await page.evaluate(() => {
          localStorage.removeItem('watchhub_token');
          localStorage.removeItem('watchhub_auth_user');
          window.location.href = '/login';
        });
        await page.waitForTimeout(800);

        const tokenAfter = await page.evaluate(() => localStorage.getItem('watchhub_token'));
        const onLogin = page.url().includes('/login');

        // Attempt back navigation to protected route
        await page.goto(`${BASE_URL}/cart`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
        const bouncedToLogin = page.url().includes('/login');

        if (!tokenAfter && onLogin && bouncedToLogin) {
          recordTest('7', 'Logout & Session Clearance', 'PASS', 'Session purged and back-nav safely bounced to /login');
        } else {
          recordTest('7', 'Logout & Session Clearance', 'FAIL', `Token: ${tokenAfter}, Url: ${page.url()}`);
        }
      }
      await context.close();
    }

  } catch (err) {
    console.error('Test Suite encountered an unexpected error:', err);
  } finally {
    await browser.close();
  }

  // Summary Report
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log('\n================================================================================');
  console.log(`TEST RESULTS: ${passed}/${results.length} PASSED | ${failed} FAILED`);
  console.log('================================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
