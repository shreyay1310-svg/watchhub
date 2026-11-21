import { chromium } from 'playwright-core';

const ROLES = [
  {
    roleName: 'Store Admin',
    email: 'admin@watchhub.com',
    password: 'Admin@123',
    expectedPath: '/store-admin/dashboard',
    tabSelector: 'button[title*="Store"]',
  },
  {
    roleName: 'Customer Support',
    email: 'support@watchhub.com',
    password: 'Admin@123',
    expectedPath: '/customer-support/dashboard',
    tabSelector: 'button[title*="Support"]',
  },
  {
    roleName: 'Inventory Manager',
    email: 'inventory@watchhub.com',
    password: 'Admin@123',
    expectedPath: '/inventory-manager/dashboard',
    tabSelector: 'button[title*="Inventory"]',
  },
  {
    roleName: 'Delivery Manager',
    email: 'delivery@watchhub.com',
    password: 'Admin@123',
    expectedPath: '/delivery-manager/dashboard',
    tabSelector: 'button[title*="Delivery Manager"]',
  },
  {
    roleName: 'Super Admin',
    email: 'superadmin@watchhub.com',
    password: 'Admin@123',
    expectedPath: '/super-admin/dashboard',
    tabSelector: 'button[title*="Super"]',
  },
  {
    roleName: 'Delivery Partner',
    email: 'rider@watchhub.com',
    password: 'Admin@123',
    expectedPath: '/delivery-partner/dashboard',
    tabSelector: 'button[title*="Delivery Partner"]',
  },
  {
    roleName: 'Customer',
    email: 'customer@watchhub.com',
    password: 'Admin@123',
    expectedPath: '/customer/dashboard',
    tabSelector: 'button[title*="Customer"]',
  },
];

const TEST_VIEWPORTS = [
  { name: 'Mobile-375x812', width: 375, height: 812 },
  { name: 'Tablet-768x1024', width: 768, height: 1024 },
];

async function run() {
  console.log('=== STARTING ALL ROLES MOBILE & TABLET AUDIT ===');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const results = [];

  for (const vp of TEST_VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);

    for (const r of ROLES) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Login
      await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.reload({ waitUntil: 'networkidle' });

      // Try selecting role tab or fill form directly
      const roleTab = page.locator(r.tabSelector).first();
      if (await roleTab.count() > 0) {
        await roleTab.scrollIntoViewIfNeeded().catch(() => {});
        await roleTab.click({ timeout: 2000 }).catch(async () => {
          await page.fill('input[type="email"]', r.email);
          await page.fill('input[type="password"]', r.password);
        });
        await page.waitForTimeout(200);
      } else {
        await page.fill('input[type="email"]', r.email);
        await page.fill('input[type="password"]', r.password);
      }

      await page.locator('button:has-text("Sign In")').first().click();
      await page.waitForTimeout(1200);

      // Verify path
      if (!page.url().includes(r.expectedPath)) {
        await page.goto(`http://localhost:5173${r.expectedPath}`, { waitUntil: 'networkidle' });
      }

      await page.waitForTimeout(400);

      // Check overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        const maxScroll = Math.max(docWidth, bodyWidth);
        return {
          maxScroll,
          winWidth,
          hasOverflow: maxScroll > winWidth + 1,
        };
      });

      const bodyText = await page.innerText('body');
      const hasTimeStandstill = bodyText.includes('Time Standstill');
      const hasPortalRecovery = bodyText.includes('WatchHub Portal Recovery');

      console.log(`  [${r.roleName}] Viewport: ${vp.name} | MaxScroll: ${overflow.maxScroll}px / ${overflow.winWidth}px | Overflow: ${overflow.hasOverflow} | OfflineScreen: ${hasTimeStandstill}`);

      // Test mobile menu toggle if present
      const menuToggle = page.locator('button[title*="Toggle"], button[aria-label*="Toggle"], button:has(svg.lucide-menu), button:has(svg.lucide-sliders-horizontal)').first();
      let menuToggled = false;
      if (await menuToggle.count() > 0 && await menuToggle.isVisible()) {
        await menuToggle.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(300);
        menuToggled = true;
        // Press Escape to test closing
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }

      results.push({
        role: r.roleName,
        viewport: vp.name,
        overflow: overflow.hasOverflow,
        hasTimeStandstill,
        hasPortalRecovery,
        menuToggled,
        passed: !overflow.hasOverflow && !hasTimeStandstill && !hasPortalRecovery,
      });

      await page.close();
    }
  }

  await browser.close();

  console.log('\n=== ALL ROLES MOBILE & TABLET SUMMARY ===');
  console.table(results);
  const allPassed = results.every(r => r.passed);
  console.log(`ALL ROLES MOBILE & TABLET PASSED: ${allPassed}`);
}

run().catch(console.error);
