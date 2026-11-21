import { chromium } from 'playwright-core';

const ROLES_TO_TEST = [
  { name: 'Customer', tabText: 'Customer', expectedUrl: '/customer/dashboard' },
  { name: 'Store Admin', tabText: 'Store', expectedUrl: '/store-admin/dashboard' },
  { name: 'Inventory Manager', tabText: 'Inventory', expectedUrl: '/inventory-manager/dashboard' },
  { name: 'Delivery Manager', tabText: 'Delivery\nManager', expectedUrl: '/delivery-manager/dashboard' },
  { name: 'Delivery Partner', tabText: 'Delivery\nPartner', expectedUrl: '/delivery-partner/dashboard' },
  { name: 'Customer Support', tabText: 'Customer\nSupport', expectedUrl: '/customer-support/dashboard' },
];

async function testAllRolesLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  for (const r of ROLES_TO_TEST) {
    const page = await browser.newPage();
    console.log(`\nTesting role: ${r.name}`);
    await page.goto('https://watchhub-store-silk.vercel.app/login', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    // Click tab
    const tabBtn = page.locator(`button:has-text("${r.tabText.split('\n')[0]}")`).filter({ hasText: r.tabText.split('\n')[1] || '' }).first();
    if (await tabBtn.isVisible()) {
      await tabBtn.click();
      await page.waitForTimeout(200);
    } else {
      console.log(`Tab button for ${r.name} not found!`);
    }

    const email = await page.inputValue('input[type="email"]');
    const pass = await page.inputValue('input[type="password"]');
    console.log(`Role tab set: email=${email}, passLength=${pass.length}`);

    await page.locator('button:has-text("Sign In")').first().click();
    await page.waitForTimeout(2000);

    const err = page.locator('.bg-rose-50');
    if (await err.isVisible()) {
      console.log(`[FAIL] ${r.name} error:`, await err.innerText());
    } else {
      console.log(`[PASS] ${r.name} navigated to:`, page.url());
    }
    await page.close();
  }

  await browser.close();
}

testAllRolesLive().catch(console.error);
