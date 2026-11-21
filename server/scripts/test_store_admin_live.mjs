import { chromium } from 'playwright-core';

async function testStoreAdminLogoutAndRefresh() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Navigating to login...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

  // Store Admin tab
  const storeTab = page.locator('button[title*="Store"]').first();
  await storeTab.click();
  await page.waitForTimeout(300);

  // Click Sign In
  await page.locator('button:has-text("Sign In")').first().click();
  await page.waitForURL('**/store-admin/dashboard', { timeout: 8000 });
  console.log('2. Successfully reached Store Admin Dashboard:', page.url());

  // Test Refresh while on Dashboard
  console.log('3. Refreshing the dashboard page...');
  await page.reload({ waitUntil: 'networkidle' });
  console.log('   URL after refresh:', page.url());
  const offlineCheck = await page.locator('text=Time Standstill, text=Connection Offline').count();
  console.log('   Offline screen visible?', offlineCheck > 0 ? 'YES (BUG)' : 'NO (PASSED)');

  // Test Top Navbar Sign Out Button
  console.log('4. Testing top navbar Sign Out button...');
  const signOutBtn = page.locator('button[title="Sign Out"]').first();
  if (await signOutBtn.count() > 0) {
    await signOutBtn.click();
    await page.waitForURL('**/login', { timeout: 5000 });
    console.log('   Successfully signed out and redirected to:', page.url());
  } else {
    console.error('   Sign Out button not found!');
  }

  await browser.close();
  console.log('TEST COMPLETE!');
}

testStoreAdminLogoutAndRefresh().catch(console.error);
