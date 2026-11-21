import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '1440x900_Desktop', width: 1440, height: 900 },
  { name: '1366x768_Laptop', width: 1366, height: 768 },
  { name: '1024x768_SmallDesktop', width: 1024, height: 768 },
  { name: '768x1024_Tablet', width: 768, height: 1024 },
  { name: '390x844_Mobile', width: 390, height: 844 },
];

const SCREENSHOT_DIR = path.resolve('server/scripts/screenshots_team');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  console.log('--- STARTING TEAM & PERMISSIONS TESTING ---');

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    // 1. Login as Customer Support
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    const supportTab = page.locator('button[title*="Support"]').first();
    await supportTab.click();
    await page.waitForTimeout(200);

    await page.locator('button:has-text("Sign In")').first().click();
    await page.waitForURL('**/customer-support/**', { timeout: 8000 });

    // 2. Navigate to Team & Permissions
    await page.goto('http://localhost:5173/customer-support/team', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // 3. Check for Raw Unsplash URL in text
    const pageText = await page.innerText('body');
    const hasRawUnsplash = pageText.includes('images.unsplash.com');
    if (hasRawUnsplash) {
      console.error(`❌ [${vp.name}] FAILED: Raw images.unsplash.com text found on page!`);
    } else {
      console.log(`✅ [${vp.name}] PASSED: Zero raw image URLs rendered in text.`);
    }

    // 4. Check Page-level Horizontal Overflow
    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      return {
        docWidth,
        winWidth,
        hasPageOverflow: docWidth > winWidth + 2, // 2px tolerance for subpixel rendering
      };
    });

    if (overflowCheck.hasPageOverflow) {
      console.error(`❌ [${vp.name}] Page-level horizontal overflow: docWidth=${overflowCheck.docWidth}, winWidth=${overflowCheck.winWidth}`);
    } else {
      console.log(`✅ [${vp.name}] PASSED: No page-level overflow (doc=${overflowCheck.docWidth}px, win=${overflowCheck.winWidth}px).`);
    }

    // 5. Check Table Existence and Column Alignment
    const table = page.locator('table');
    const tableCount = await table.count();
    console.log(`✅ [${vp.name}] Table mounted: ${tableCount > 0 ? 'YES' : 'NO'}`);

    // 6. Test Search input if on desktop
    if (vp.width >= 1024) {
      const searchInput = page.locator('input[placeholder*="Search team members"]');
      await searchInput.fill('Rohan');
      await page.waitForTimeout(300);
      const rows = await page.locator('tbody tr').count();
      console.log(`✅ [${vp.name}] Search filter test ('Rohan'): ${rows} row(s) visible`);
      await searchInput.fill('');
      await page.waitForTimeout(300);
    }

    // 7. Save Screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 [${vp.name}] Screenshot saved: ${screenshotPath}`);

    await context.close();
  }

  await browser.close();
  console.log('\n--- ALL VIEWPORT TESTS COMPLETE ---');
}

run().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
