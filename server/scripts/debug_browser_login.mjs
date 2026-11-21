import { chromium } from 'playwright-core';

async function testBrowserLogin() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();

  page.on('console', (msg) => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('requestfailed', (req) => console.log('[REQ FAILED]', req.url(), req.failure()?.errorText));
  page.on('response', (res) => {
    if (res.url().includes('/auth')) {
      console.log('[AUTH RESPONSE]', res.url(), res.status());
    }
  });

  console.log('Navigating to http://localhost:5173/login...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Clear localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Customer
  console.log('\n--- TESTING CUSTOMER ---');
  const custBtn = page.locator('button[title="Customer"]').first();
  await custBtn.click();
  await page.waitForTimeout(200);

  const emailVal = await page.inputValue('input[type="email"]');
  const passVal = await page.inputValue('input[type="password"]');
  console.log('Values:', { emailVal, passLength: passVal.length });

  await page.locator('button:has-text("Sign In")').first().click();
  await page.waitForTimeout(1500);

  const err1 = page.locator('.bg-rose-50');
  if (await err1.isVisible()) {
    console.log('CUSTOMER ERROR:', await err1.innerText());
  } else {
    console.log('CUSTOMER SUCCESS! Current URL:', page.url());
  }

  // Clear and test Store Admin
  console.log('\n--- TESTING STORE ADMIN ---');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const adminBtn = page.locator('button[title*="Store"]').first();
  await adminBtn.click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("Sign In")').first().click();
  await page.waitForTimeout(1500);

  const err2 = page.locator('.bg-rose-50');
  if (await err2.isVisible()) {
    console.log('STORE ADMIN ERROR:', await err2.innerText());
  } else {
    console.log('STORE ADMIN SUCCESS! Current URL:', page.url());
  }

  // Clear and test Inventory Manager
  console.log('\n--- TESTING INVENTORY MANAGER ---');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const invBtn = page.locator('button[title*="Inventory"]').first();
  await invBtn.click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("Sign In")').first().click();
  await page.waitForTimeout(1500);

  const err3 = page.locator('.bg-rose-50');
  if (await err3.isVisible()) {
    console.log('INVENTORY MANAGER ERROR:', await err3.innerText());
  } else {
    console.log('INVENTORY MANAGER SUCCESS! Current URL:', page.url());
  }

  await browser.close();
}

testBrowserLogin().catch(console.error);
