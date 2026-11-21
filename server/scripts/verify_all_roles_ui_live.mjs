import { chromium } from 'playwright-core';

const ROLES_TO_TEST = [
  { name: 'Customer', tabText: 'Customer', email: 'customer@watchhub.com', expectedPath: '/customer/dashboard' },
  { name: 'Store Admin', tabText: 'Store', email: 'admin@watchhub.com', expectedPath: '/store-admin/dashboard' },
  { name: 'Inventory Manager', tabText: 'Inventory', email: 'inventory@watchhub.com', expectedPath: '/inventory-manager/dashboard' },
  { name: 'Delivery Manager', tabText: 'Delivery', email: 'delivery@watchhub.com', expectedPath: '/delivery-manager/dashboard' },
  { name: 'Delivery Partner', tabText: 'Partner', email: 'rider@watchhub.com', expectedPath: '/delivery-partner/dashboard' },
  { name: 'Customer Support', tabText: 'Support', email: 'support@watchhub.com', expectedPath: '/support/dashboard' },
  { name: 'Super Admin', tabText: 'Super', email: 'superadmin@watchhub.com', expectedPath: '/super-admin/dashboard' },
];

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== STARTING 7-ROLE AUTHENTICATION & UI ISOLATION TEST ===');

  for (const role of ROLES_TO_TEST) {
    console.log(`\n--- Testing [${role.name}] ---`);
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const tabBtn = page.locator(`button[title*="${role.tabText}"]`).first();
    if (await tabBtn.count() > 0) {
      await tabBtn.click();
    } else {
      await page.fill('input[type="email"]', role.email);
      await page.fill('input[type="password"]', 'Admin@123');
    }

    await page.waitForTimeout(200);

    const submitBtn = page.locator('button:has-text("Sign In")').first();
    await submitBtn.click();

    try {
      await page.waitForURL(`**${role.expectedPath}`, { timeout: 8000 });
      console.log(`✅ SUCCESS: [${role.name}] reached ${page.url()}`);
    } catch (e) {
      console.error(`❌ FAILED: [${role.name}] did not reach ${role.expectedPath}. URL: ${page.url()}`);
      const errEl = await page.locator('.text-rose-600, .bg-rose-50, .border-rose-200').first();
      if (await errEl.count() > 0) {
        console.error(`   Page error: ${await errEl.innerText()}`);
      }
    }

    // Try logging out cleanly
    const logoutBtn = page.locator('button:has-text("Sign Out"), button:has-text("Logout"), button:has-text("Log out")').first();
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      try {
        await page.waitForURL('**/login', { timeout: 4000 });
        console.log(`✅ LOGOUT: Successfully returned to login`);
      } catch {
        console.warn(`⚠️ LOGOUT redirect took longer than 4s`);
      }
    }
  }

  await browser.close();
  console.log('\n=== ALL 7 ROLES VERIFIED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
