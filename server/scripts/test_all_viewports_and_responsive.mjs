import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  // Desktop
  { name: 'Desktop-1920x1080', width: 1920, height: 1080, category: 'Desktop' },
  { name: 'Desktop-1440x900', width: 1440, height: 900, category: 'Desktop' },
  { name: 'Desktop-1366x768', width: 1366, height: 768, category: 'Desktop' },
  // Laptop
  { name: 'Laptop-1280x800', width: 1280, height: 800, category: 'Laptop' },
  { name: 'Laptop-1024x768', width: 1024, height: 768, category: 'Laptop' },
  // Tablet
  { name: 'Tablet-768x1024', width: 768, height: 1024, category: 'Tablet' },
  { name: 'Tablet-820x1180', width: 820, height: 1180, category: 'Tablet' },
  // Mobile
  { name: 'Mobile-430x932', width: 430, height: 932, category: 'Mobile' },
  { name: 'Mobile-390x844', width: 390, height: 844, category: 'Mobile' },
  { name: 'Mobile-375x812', width: 375, height: 812, category: 'Mobile' },
  { name: 'Mobile-360x800', width: 360, height: 800, category: 'Mobile' },
  { name: 'Mobile-320x720', width: 320, height: 720, category: 'Mobile' },
];

const PAGES_TO_TEST = [
  { url: 'http://localhost:5173/', name: 'Storefront Homepage' },
  { url: 'http://localhost:5173/products', name: 'Products Catalog' },
  { url: 'http://localhost:5173/cart', name: 'Cart Page' },
  { url: 'http://localhost:5173/login', name: 'Authentication Portal' },
];

async function run() {
  console.log('=== STARTING MULTI-VIEWPORT RESPONSIVE AUDIT ===');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const results = [];
  const screenshotDir = path.join(process.cwd(), 'server', 'scripts', 'screenshots_responsive');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height} - ${vp.category})`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const p of PAGES_TO_TEST) {
      await page.goto(p.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        const maxScroll = Math.max(docWidth, bodyWidth);
        return {
          maxScroll,
          winWidth,
          hasHorizontalOverflow: maxScroll > winWidth + 1, // 1px tolerance for subpixel rounding
        };
      });

      const shotPath = path.join(screenshotDir, `${vp.name}_${p.name.replace(/\s+/g, '_')}.png`);
      // Only capture representative screenshots on mobile & desktop to conserve disk
      if (vp.name.includes('375') || vp.name.includes('1440') || vp.name.includes('768')) {
        await page.screenshot({ path: shotPath });
      }

      console.log(`  ${p.name}: MaxScroll=${overflow.maxScroll}px / Viewport=${overflow.winWidth}px -> Overflow: ${overflow.hasHorizontalOverflow}`);

      results.push({
        viewport: vp.name,
        category: vp.category,
        page: p.name,
        winWidth: overflow.winWidth,
        maxScroll: overflow.maxScroll,
        passed: !overflow.hasHorizontalOverflow,
      });
    }
  }

  await browser.close();

  console.log('\n=== RESPONSIVE AUDIT SUMMARY ===');
  const allPassed = results.every(r => r.passed);
  console.log(`TOTAL CHECKS: ${results.length} | ALL PASSED: ${allPassed}`);
  if (!allPassed) {
    const failed = results.filter(r => !r.passed);
    console.log('FAILURES:', failed);
  }
}

run().catch(console.error);
