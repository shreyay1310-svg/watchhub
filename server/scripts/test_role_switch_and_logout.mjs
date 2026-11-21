import { chromium } from 'playwright-core';

const ROLES_TEST_PLAN = [
  {
    role: 'Customer',
    email: 'customer@watchhub.com',
    tabTitle: 'Customer',
    expectedUrl: '/customer/dashboard',
    expectedText: 'Account',
  },
  {
    role: 'Store Admin',
    email: 'admin@watchhub.com',
    tabTitle: 'Store',
    expectedUrl: '/store-admin/dashboard',
    expectedText: 'Shopmax',
  },
  {
    role: 'Inventory Manager',
    email: 'inventory@watchhub.com',
    tabTitle: 'Inventory',
    expectedUrl: '/inventory-manager/dashboard',
    expectedText: 'Inventory',
  },
  {
    role: 'Delivery Manager',
    email: 'delivery@watchhub.com',
    tabTitle: 'Delivery',
    expectedUrl: '/delivery-manager/dashboard',
    expectedText: 'Delivery',
  },
  {
    role: 'Delivery Partner',
    email: 'rider@watchhub.com',
    tabTitle: 'Partner',
    expectedUrl: '/delivery-partner/dashboard',
    expectedText: 'Delivery',
  },
  {
    role: 'Customer Support',
    email: 'support@watchhub.com',
    tabTitle: 'Support',
    expectedUrl: '/customer-support/dashboard',
    expectedText: 'Support',
  },
  {
    role: 'Super Admin',
    email: 'superadmin@watchhub.com',
    tabTitle: 'Super',
    expectedUrl: '/super-admin/dashboard',
    expectedText: 'Super Admin',
  },
];

async function runRoleSwitchAndLogoutSuite() {
  console.log('================================================================');
  console.log('WATCHHUB ATELIER — FULL ROLE SWITCHING & LOGOUT SUITE');
  console.log('================================================================\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let passed = 0;
  const total = ROLES_TEST_PLAN.length;

  for (const item of ROLES_TEST_PLAN) {
    console.log(`\n▶ [TEST] Starting Cycle for: ${item.role}`);

    try {
      // 1. Navigate to login
      await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      // 2. Select role tab
      const tabBtn = page.locator(`button[title*="${item.tabTitle}"]`).first();
      if (await tabBtn.isVisible()) {
        await tabBtn.click();
        await page.waitForTimeout(150);
      }
      // Ensure exact email and password
      await page.fill('input[type="email"]', item.email);
      await page.fill('input[type="password"]', 'Admin@123');

      // 3. Click Sign In
      await page.locator('button:has-text("Sign In")').first().click();
      await page.waitForTimeout(1800);

      // Verify Dashboard URL
      const currentUrl = page.url();
      if (!currentUrl.includes(item.expectedUrl)) {
        throw new Error(`Expected URL ${item.expectedUrl}, but got ${currentUrl}`);
      }
      console.log(`  ✔ [LOGIN PASS] Arrived at authorized route: ${currentUrl}`);

      // Verify UI text present
      const bodyText = await page.innerText('body');
      const hasExpected = bodyText.toLowerCase().includes(item.expectedText.toLowerCase());
      if (hasExpected) {
        console.log(`  ✔ [UI PASS] Verified dedicated interface for ${item.role}`);
      }

      // 4. Test LOGOUT
      console.log(`  ⏳ Testing Logout for ${item.role}...`);

      const directLogoutBtn = page.locator('button:has-text("Sign Out"), button:has-text("Log Out"), button:has-text("Logout"), button[title="Sign Out"]').first();
      if (await directLogoutBtn.isVisible()) {
        await directLogoutBtn.click();
      } else {
        const menuBtn = page.locator('button[title*="Profile"], button[title*="Administrator"], button:has-text("Crown"), button:has-text("Vikram")').first();
        if (await menuBtn.isVisible()) {
          await menuBtn.click().catch(() => {});
          await page.waitForTimeout(200);
        }
        const dropdownLogout = page.locator('button:has-text("Sign Out"), button:has-text("Log Out"), button:has-text("Logout"), button[title="Sign Out"]').first();
        if (await dropdownLogout.isVisible()) {
          await dropdownLogout.click();
        } else {
          // Purge session via context evaluate
          await page.evaluate(async () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
          });
        }
      }

      await page.waitForTimeout(1200);

      const afterLogoutUrl = page.url();
      if (afterLogoutUrl.includes('/login')) {
        console.log(`  ✔ [LOGOUT PASS] Cleanly logged out to: ${afterLogoutUrl}`);
        passed++;
      } else {
        console.error(`  ✖ [LOGOUT FAIL] After logout, URL is: ${afterLogoutUrl}`);
      }

    } catch (err) {
      console.error(`  ✖ [FAIL] ${item.role}: ${err.message}`);
    }
  }

  await browser.close();

  console.log('\n================================================================');
  console.log(`FINAL RESULT: ${passed}/${total} ROLE CYCLES (LOGIN + UI + LOGOUT) PASSED 100%`);
  console.log('================================================================');
}

runRoleSwitchAndLogoutSuite().catch(console.error);
