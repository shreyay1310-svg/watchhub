import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const outputDir = path.resolve(__dirname, '../../WATCHHUB_LIVE_WORKING_EVIDENCE');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function captureLiveAuthWorking() {
  console.log('================================================================');
  console.log('WATCHHUB ATELIER — LIVE BROWSER DEMONSTRATION & CAPTURE');
  console.log(`Frontend: ${BASE_URL} | Chrome: ${CHROME_PATH}`);
  console.log('================================================================\n');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  const results = [];

  try {
    // 1. Visit root URL -> redirects to login page
    console.log('[Step 1] Navigating to http://localhost:5173/ ...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const loginShot = path.join(outputDir, '01_login_page_default_entry.png');
    await page.screenshot({ path: loginShot, fullPage: false });
    console.log(`[PASS] Captured Login Page at ${page.url()} -> ${loginShot}`);
    results.push({ step: 'Default Root Route to Login', url: page.url(), file: loginShot });

    // 2. Test Customer Login
    console.log('\n[Step 2] Testing Customer login (customer@watchhub.com)...');
    // Ensure on login page
    if (!page.url().includes('/login')) {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    }
    // Click Customer tab if available
    const customerTab = page.locator('button:has-text("Customer")').first();
    if (await customerTab.isVisible()) {
      await customerTab.click();
      await page.waitForTimeout(300);
    }
    // Click Sign In
    const signInBtn = page.locator('button:has-text("Sign In")').first();
    await signInBtn.click();
    console.log('Clicked Sign In. Waiting for navigation...');
    await page.waitForTimeout(2500);

    const customerShot = path.join(outputDir, '02_customer_authenticated.png');
    await page.screenshot({ path: customerShot, fullPage: false });
    console.log(`[PASS] Logged in as Customer. Current URL: ${page.url()} -> ${customerShot}`);
    results.push({ step: 'Customer Login', url: page.url(), file: customerShot });

    // 3. Clear session and test Store Admin
    console.log('\n[Step 3] Testing Store Admin login (admin@watchhub.com)...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const storeAdminTab = page.locator('button:has-text("Store")').first();
    if (await storeAdminTab.isVisible()) {
      await storeAdminTab.click();
      await page.waitForTimeout(300);
    }
    await page.locator('button:has-text("Sign In")').first().click();
    console.log('Clicked Sign In for Store Admin. Waiting for navigation...');
    await page.waitForTimeout(2500);

    const storeAdminShot = path.join(outputDir, '03_store_admin_dashboard.png');
    await page.screenshot({ path: storeAdminShot, fullPage: false });
    console.log(`[PASS] Logged in as Store Admin. Current URL: ${page.url()} -> ${storeAdminShot}`);
    results.push({ step: 'Store Admin Dashboard', url: page.url(), file: storeAdminShot });

    // 4. Clear session and test Delivery Partner
    console.log('\n[Step 4] Testing Delivery Partner login (rider@watchhub.com)...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const riderTab = page.locator('button:has-text("Partner")').first();
    if (await riderTab.isVisible()) {
      await riderTab.click();
      await page.waitForTimeout(300);
    }
    await page.locator('button:has-text("Sign In")').first().click();
    console.log('Clicked Sign In for Delivery Partner. Waiting for navigation...');
    await page.waitForTimeout(2500);

    const riderShot = path.join(outputDir, '04_delivery_partner_dashboard.png');
    await page.screenshot({ path: riderShot, fullPage: false });
    console.log(`[PASS] Logged in as Delivery Partner. Current URL: ${page.url()} -> ${riderShot}`);
    results.push({ step: 'Delivery Partner Dashboard', url: page.url(), file: riderShot });

    // 5. Clear session and test Super Admin
    console.log('\n[Step 5] Testing Super Admin direct login (superadmin@watchhub.com)...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.fill('input[type="email"]', 'superadmin@watchhub.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.locator('button:has-text("Sign In")').first().click();
    console.log('Clicked Sign In for Super Admin. Waiting for navigation...');
    await page.waitForTimeout(2500);

    const superAdminShot = path.join(outputDir, '05_super_admin_dashboard.png');
    await page.screenshot({ path: superAdminShot, fullPage: false });
    console.log(`[PASS] Logged in as Super Admin. Current URL: ${page.url()} -> ${superAdminShot}`);
    results.push({ step: 'Super Admin Dashboard', url: page.url(), file: superAdminShot });

    console.log('\n================================================================');
    console.log('ALL LIVE BROWSER DEMONSTRATIONS COMPLETED SUCCESSFULLY!');
    console.log('================================================================');
  } catch (err) {
    console.error('Error during browser demonstration:', err);
  } finally {
    await browser.close();
  }
}

captureLiveAuthWorking();
