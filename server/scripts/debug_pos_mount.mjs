import { chromium } from 'playwright-core';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[BROWSER UNCAUGHT ERROR]', err.message, err.stack));

  try {
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@watchhub.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/store-admin/**', { timeout: 15000 });
    console.log('Logged in. Current URL:', page.url());

    await page.waitForTimeout(2000);
    console.log('Finding and clicking POS tab...');
    // Look for tab with text "POS"
    const posTabs = await page.$$('button');
    let clicked = false;
    for (const b of posTabs) {
      const txt = await b.textContent();
      if (txt && txt.trim() === 'POS') {
        console.log('Clicking tab:', txt);
        await b.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      console.log('Trying button with text "Full POS Terminal"...');
      const fullPosBtn = await page.$('button:has-text("Full POS Terminal")');
      if (fullPosBtn) {
        await fullPosBtn.click();
        clicked = true;
      }
    }

    await page.waitForTimeout(3000);
    const body = await page.textContent('body');
    console.log('Body includes WatchHub Portal Recovery:', body.includes('WatchHub Portal Recovery'));
    if (body.includes('WatchHub Portal Recovery')) {
      const errorText = await page.$eval('.text-xs.text-\\[\\#A7B1C2\\]', el => el.textContent).catch(() => 'unknown');
      console.log('PORTAL RECOVERY ERROR TEXT:', errorText);
    }
  } catch (e) {
    console.error('Debug script error:', e);
  } finally {
    await browser.close();
  }
}

run();
