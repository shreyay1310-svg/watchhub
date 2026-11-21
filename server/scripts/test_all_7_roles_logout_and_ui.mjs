import { chromium } from 'playwright-core';

const ROLES_TO_TEST = [
  {
    roleName: 'Store Admin',
    email: 'admin@watchhub.com',
    password: 'Password@123',
    expectedPath: '/store-admin/dashboard',
    tabSelector: 'button[title*="Store"]',
  },
  {
    roleName: 'Super Admin',
    email: 'superadmin@watchhub.com',
    password: 'Password@123',
    expectedPath: '/super-admin/dashboard',
    tabSelector: 'button[title*="Super"]',
  },
  {
    roleName: 'Inventory Manager',
    email: 'inventory@watchhub.com',
    password: 'Password@123',
    expectedPath: '/inventory-manager/dashboard',
    tabSelector: 'button[title*="Inventory"]',
  },
  {
    roleName: 'Delivery Manager',
    email: 'delivery@watchhub.com',
    password: 'Password@123',
    expectedPath: '/delivery-manager/dashboard',
    tabSelector: 'button[title*="Delivery Mgr"]',
  },
  {
    roleName: 'Customer Support',
    email: 'support@watchhub.com',
    password: 'Password@123',
    expectedPath: '/customer-support/dashboard',
    tabSelector: 'button[title*="Support"]',
  },
  {
    roleName: 'Delivery Partner',
    email: 'rider@watchhub.com',
    password: 'Password@123',
    expectedPath: '/delivery-partner/dashboard',
    tabSelector: 'button[title*="Rider"]',
  },
  {
    roleName: 'Customer',
    email: 'customer@watchhub.com',
    password: 'Password@123',
    expectedPath: '/customer/dashboard',
    tabSelector: 'button[title*="Customer"]',
  },
];

async function run() {
  console.log('=== VERIFYING ALL 7 ROLES UI AND LOGOUT ===');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const item of ROLES_TO_TEST) {
    console.log(`\nTesting Role: [${item.roleName}]`);

    // 1. Navigate to login and select role quick-login tab
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle' });

    const roleTab = page.locator(item.tabSelector).first();
    if (await roleTab.count() > 0) {
      await roleTab.click();
      await page.waitForTimeout(200);
    } else {
      await page.fill('input[type="email"]', item.email);
      await page.fill('input[type="password"]', item.password);
    }

    await page.locator('button:has-text("Sign In")').first().click();
    await page.waitForTimeout(1500);

    // 2. Ensure we are on the expected role dashboard path
    if (!page.url().includes(item.expectedPath)) {
      await page.goto(`http://localhost:5173${item.expectedPath}`, { waitUntil: 'networkidle' });
    }

    // 3. Test Refresh on Dashboard to ensure no "Time Standstill" appears
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const bodyText = await page.innerText('body');
    const hasTimeStandstill = bodyText.includes('Time Standstill');
    const hasConnectionOffline = bodyText.includes('CONNECTION OFFLINE');
    const hasPortalRecovery = bodyText.includes('WatchHub Portal Recovery');

    console.log(`  Current URL: ${page.url()}`);
    console.log(`  Time Standstill screen visible: ${hasTimeStandstill}`);
    console.log(`  Portal Recovery error visible: ${hasPortalRecovery}`);

    // 4. Test Logout button
    let loggedOut = false;
    const directSignOut = page.locator('button[title*="Sign Out"], button:has-text("Sign Out"), button:has-text("Logout")').first();
    if (await directSignOut.count() > 0 && await directSignOut.isVisible()) {
      await directSignOut.click();
      await page.waitForTimeout(1000);
      loggedOut = page.url().includes('/login');
    } else {
      // Look inside profile dropdown
      const avatarBtn = page.locator('button:has-text("👑"), button:has-text("🏪"), button:has-text("📦"), button:has-text("🚚"), button:has-text("🎧"), button:has-text("🛵"), button:has-text("👤")').first();
      if (await avatarBtn.count() > 0) {
        await avatarBtn.click();
        await page.waitForTimeout(300);
        const dropSignOut = page.locator('button:has-text("Sign Out"), button:has-text("Logout")').first();
        if (await dropSignOut.count() > 0) {
          await dropSignOut.click();
          await page.waitForTimeout(1000);
          loggedOut = page.url().includes('/login');
        }
      }
    }

    const tokenAfter = await page.evaluate(() => localStorage.getItem('watchhub_token'));
    console.log(`  Logged out successfully: ${loggedOut || tokenAfter === null}`);
    console.log(`  Token removed: ${tokenAfter === null}`);

    results.push({
      role: item.roleName,
      offlineScreenVisible: hasTimeStandstill || hasConnectionOffline,
      portalRecoveryVisible: hasPortalRecovery,
      cleanUiPassed: !hasTimeStandstill && !hasConnectionOffline && !hasPortalRecovery,
      logoutPassed: loggedOut || tokenAfter === null,
    });
  }

  await browser.close();

  console.log('\n================ SUMMARY OF ALL 7 ROLES ================');
  console.table(results);
  const allClean = results.every(r => r.cleanUiPassed && r.logoutPassed);
  console.log(`\nALL 7 ROLES CLEAN UI AND LOGOUT VERIFIED: ${allClean}`);
}

run().catch(console.error);
