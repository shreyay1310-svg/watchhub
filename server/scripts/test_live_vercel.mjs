import { chromium } from 'playwright-core';

async function testVercelLiveLogin() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();

  page.on('console', (msg) => console.log('[LIVE CONSOLE]', msg.type(), msg.text()));
  page.on('requestfailed', (req) => console.log('[LIVE REQ FAILED]', req.url(), req.failure()?.errorText));
  page.on('response', (res) => {
    if (res.url().includes('/auth') || res.url().includes('/api')) {
      console.log('[LIVE API RES]', res.url(), res.status(), res.headers()['content-type']);
    }
  });

  console.log('Navigating to https://watchhub-store-silk.vercel.app/login...');
  await page.goto('https://watchhub-store-silk.vercel.app/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click Customer tab
  const custBtn = page.locator('button:has-text("Customer")').first();
  if (await custBtn.isVisible()) {
    await custBtn.click();
  }
  await page.waitForTimeout(300);

  // Click Sign In
  const signInBtn = page.locator('button:has-text("Sign In")').first();
  await signInBtn.click();
  console.log('Clicked Sign In on live Vercel site...');
  await page.waitForTimeout(2000);

  const errorBanner = page.locator('.bg-rose-50');
  if (await errorBanner.isVisible()) {
    console.log('LIVE ERROR BANNER:', await errorBanner.innerText());
  } else {
    console.log('LIVE SUCCESS! URL:', page.url());
  }

  await browser.close();
}

testVercelLiveLogin().catch(console.error);
