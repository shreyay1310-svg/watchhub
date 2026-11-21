import { chromium } from 'playwright-core';

async function diagnose() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.locator('button[title*="Store"]').first().click();
  await page.locator('button:has-text("Sign In")').first().click();
  await page.waitForURL('**/store-admin/dashboard', { timeout: 8000 });
  await page.waitForTimeout(1000);

  const scrollInfo = await page.evaluate(() => {
    return {
      docWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      winWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  console.log('Document scroll info at 375px:', scrollInfo);
  await browser.close();
}

diagnose().catch(console.error);
