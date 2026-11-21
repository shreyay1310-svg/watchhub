import { chromium } from 'playwright-core';

const ALL_ROLES = [
  { role: 'Customer', email: 'customer@watchhub.com', expected: '/customer/dashboard' },
  { role: 'Store Admin', email: 'admin@watchhub.com', expected: '/store-admin/dashboard' },
  { role: 'Inventory Manager', email: 'inventory@watchhub.com', expected: '/inventory-manager/dashboard' },
  { role: 'Delivery Manager', email: 'delivery@watchhub.com', expected: '/delivery-manager/dashboard' },
  { role: 'Delivery Partner', email: 'rider@watchhub.com', expected: '/delivery-partner/dashboard' },
  { role: 'Customer Support', email: 'support@watchhub.com', expected: '/customer-support/dashboard' },
  { role: 'Super Admin', email: 'superadmin@watchhub.com', expected: '/super-admin/dashboard' },
];

async function verifyAll7Roles() {
  console.log('====================================================');
  console.log('WATCHHUB — BROWSER LIVE ACCEPTANCE OF ALL 7 ROLES');
  console.log('====================================================\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  let passCount = 0;

  for (const item of ALL_ROLES) {
    const context = await browser.newContext();
    const page = await context.newPage();

    let pageError = null;
    page.on('pageerror', (err) => {
      pageError = err.message;
    });

    try {
      await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      // Click role tab or fill email & password
      const tab = page.locator(`button[title*="${item.role}"]`).first();
      if (await tab.isVisible()) {
        await tab.click();
        await page.waitForTimeout(150);
      } else {
        await page.fill('input[type="email"]', item.email);
        await page.fill('input[type="password"]', 'Admin@123');
      }

      // Click Sign In
      await page.locator('button:has-text("Sign In")').first().click();
      await page.waitForTimeout(1800);

      const currentUrl = page.url();
      const errBanner = page.locator('.bg-rose-50');
      const hasError = await errBanner.isVisible();

      if (hasError) {
        const errorText = await errBanner.innerText();
        console.error(`[FAIL] ${item.role.padEnd(25)}: Error displayed -> "${errorText}"`);
      } else if (currentUrl.includes(item.expected)) {
        console.log(`[PASS] ${item.role.padEnd(25)}: ${item.email} -> Logged In -> ${currentUrl}`);
        passCount++;
      } else {
        console.error(`[FAIL] ${item.role.padEnd(25)}: Wrong URL -> ${currentUrl} (expected ${item.expected})`);
      }

      if (pageError) {
        console.error(`       [Console Error in ${item.role}]:`, pageError);
      }
    } catch (e) {
      console.error(`[FAIL] ${item.role}: Exception:`, e.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  console.log('\n====================================================');
  console.log(`FINAL RESULT: ${passCount}/${ALL_ROLES.length} ROLES PASSED BROWSER AUTHENTICATION`);
  console.log('====================================================');
}

verifyAll7Roles().catch(console.error);
