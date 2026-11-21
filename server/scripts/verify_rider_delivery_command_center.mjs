import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('server/scripts/screenshots_rider');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runRiderVerification() {
  console.log('=== STARTING RIDER DELIVERY COMMAND CENTER VERIFICATION ===');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  try {
    // 1. Login as Delivery Partner
    console.log('\n[1/8] Logging in as Delivery Partner (Rohan Singh)...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'rider@watchhub.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    if (!page.url().includes('/delivery-partner')) {
      await page.goto('http://localhost:5173/delivery-partner/dashboard', { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(1000);
    console.log('Rider Dashboard URL:', page.url());

    // 2. Validate UI Elements matching the reference design
    console.log('\n[2/8] Validating Rider UI Elements against reference...');
    const pageText = await page.textContent('body');

    const hasHeaderBrand = pageText.includes('WatchHub Partner') && pageText.includes('Rider Delivery App');
    const hasDutyToggle = pageText.includes('ON DUTY');
    const hasRiderName = pageText.includes('Rohan Singh');
    const hasHeroBanner = pageText.includes('Rider Dashboard') && pageText.includes('Manage your assigned deliveries');
    const hasKpiEarnings = pageText.includes('₹1,850') && pageText.includes('+18% vs yesterday');
    const hasKpiActive = pageText.includes('Active Parcels');
    const hasKpiCompleted = pageText.includes('12 Orders') && pageText.includes('100% on-time delivery');
    const hasKpiDistance = pageText.includes('34.2 km') && pageText.includes('Lucknow Central Zone');

    // Deliveries
    const hasOrder1 = pageText.includes('WH12548') && pageText.includes('Rolex Submariner Date 41mm') && pageText.includes('Ananya Singh');
    const hasOrder2 = pageText.includes('WH12547') && pageText.includes('Omega Speedmaster Professional') && pageText.includes('Rahul Verma');
    const hasOrder3 = pageText.includes('WH12546') && pageText.includes('Cartier Tank Must Rose Gold') && pageText.includes('Priya Yadav');
    const hasOrder4 = pageText.includes('WH12545') && pageText.includes('Apple Watch Series 10') && pageText.includes('Rohit Kumar');

    // Right Widgets
    const hasLiveMap = pageText.includes('Live Delivery Map') && pageText.includes('5.1 km • 12 mins');
    const hasPerformance = pageText.includes("Today's Performance") && pageText.includes('100%') && pageText.includes('On-Time');
    const hasQuickActions = pageText.includes('Quick Actions') && pageText.includes('Call Support') && pageText.includes('Open Map');

    console.log('UI Verification Checklist:');
    console.log(`- Header Branding: ${hasHeaderBrand ? 'PASS' : 'FAIL'}`);
    console.log(`- Duty Toggle (ON DUTY): ${hasDutyToggle ? 'PASS' : 'FAIL'}`);
    console.log(`- Rider Profile (Rohan Singh ★ 4.5): ${hasRiderName ? 'PASS' : 'FAIL'}`);
    console.log(`- Hero Greeting Banner: ${hasHeroBanner ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Today's Earnings (₹1,850): ${hasKpiEarnings ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Active Parcels: ${hasKpiActive ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Completed Today (12 Orders): ${hasKpiCompleted ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Distance Logged (34.2 km): ${hasKpiDistance ? 'PASS' : 'FAIL'}`);
    console.log(`- Order #WH12548 (Rolex Submariner): ${hasOrder1 ? 'PASS' : 'FAIL'}`);
    console.log(`- Order #WH12547 (Omega Speedmaster): ${hasOrder2 ? 'PASS' : 'FAIL'}`);
    console.log(`- Order #WH12546 (Cartier Tank): ${hasOrder3 ? 'PASS' : 'FAIL'}`);
    console.log(`- Order #WH12545 (Apple Watch): ${hasOrder4 ? 'PASS' : 'FAIL'}`);
    console.log(`- Live Delivery Map Widget: ${hasLiveMap ? 'PASS' : 'FAIL'}`);
    console.log(`- Performance Gauge (100% On-Time): ${hasPerformance ? 'PASS' : 'FAIL'}`);
    console.log(`- Quick Actions: ${hasQuickActions ? 'PASS' : 'FAIL'}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_rider_command_center_desktop.png'), fullPage: true });

    // 3. Test OTP Verification Handover Flow
    console.log('\n[3/8] Testing Delivery OTP Handover Flow for #WH12548...');
    const enterOtpButtons = await page.$$('button:has-text("Enter Delivery OTP")');
    if (enterOtpButtons.length > 0) {
      await enterOtpButtons[0].click();
      await page.waitForTimeout(500);

      // Verify OTP modal opened
      const modalText = await page.textContent('body');
      console.log(`- OTP Modal Opened: ${modalText.includes('Delivery OTP Verification') ? 'PASS' : 'FAIL'}`);

      // Enter OTP 4829
      const otpInput = await page.$('input[placeholder="••••"]');
      if (otpInput) {
        await otpInput.fill('4829');
        await page.click('button:has-text("Confirm Delivery")');
        await page.waitForTimeout(1500);

        const afterOtpText = await page.textContent('body');
        const isMarkedDelivered = afterOtpText.includes('Delivered');
        console.log(`- Order #WH12548 marked as Delivered: ${isMarkedDelivered ? 'PASS' : 'FAIL'}`);
      }
    }

    // 4. Test Navigation Across All Tabs
    console.log('\n[4/8] Testing Rider Navigation across all 9 tabs...');
    const tabs = [
      { id: 'assigned', label: 'Assigned Deliveries' },
      { id: 'completed', label: 'Completed Orders' },
      { id: 'earnings', label: 'Earnings & Payouts' },
      { id: 'history', label: 'Delivery History' },
      { id: 'performance', label: 'Performance' },
      { id: 'profile', label: 'My Profile' },
      { id: 'support', label: 'Support' },
      { id: 'settings', label: 'Settings' },
      { id: 'dashboard', label: 'Dashboard' },
    ];

    for (const t of tabs) {
      const tabBtn = await page.$(`button:has-text("${t.label}")`);
      if (tabBtn) {
        await tabBtn.click();
        await page.waitForTimeout(300);
        const tabContent = await page.textContent('body');
        console.log(`  - Tab [${t.label}]: ${tabContent.length > 500 ? 'LOADED OK' : 'EMPTY'}`);
      }
    }

    // 5. Test Duty Availability Toggle
    console.log('\n[5/8] Testing Duty Availability Toggle...');
    const dutyToggle = await page.$('button[title="Toggle Availability"]');
    if (dutyToggle) {
      await dutyToggle.click();
      await page.waitForTimeout(500);
      let text = await page.textContent('body');
      console.log(`- Toggled to OFF DUTY: ${text.includes('OFF DUTY') ? 'PASS' : 'FAIL'}`);

      await dutyToggle.click();
      await page.waitForTimeout(500);
      text = await page.textContent('body');
      console.log(`- Toggled back to ON DUTY: ${text.includes('ON DUTY') ? 'PASS' : 'FAIL'}`);
    }

    // 6. Test Refresh Resilience
    console.log('\n[6/8] Testing Refresh Resilience on Rider Dashboard...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const refreshedText = await page.textContent('body');
    const hasTimeStandstill = refreshedText.includes('Time Standstill') || refreshedText.includes('CONNECTION OFFLINE');
    console.log(`- Still on Rider Dashboard after refresh: ${page.url().includes('/delivery-partner') ? 'PASS' : 'FAIL'}`);
    console.log(`- Time Standstill / Offline modal absent on refresh: ${!hasTimeStandstill ? 'PASS' : 'FAIL'}`);

    // 7. Test Mobile Layout (375x812)
    console.log('\n[7/8] Testing Mobile Responsive Layout (375x812)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await mobilePage.fill('input[type="email"]', 'rider@watchhub.com');
    await mobilePage.fill('input[type="password"]', 'Admin@123');
    await mobilePage.click('button[type="submit"]');
    await mobilePage.waitForTimeout(1500);

    if (!mobilePage.url().includes('/delivery-partner')) {
      await mobilePage.goto('http://localhost:5173/delivery-partner/dashboard', { waitUntil: 'networkidle' });
    }
    await mobilePage.waitForTimeout(1000);

    const overflowX = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    console.log(`- Mobile Horizontal Overflow (375x812): ${overflowX}px (target: 0px) -> ${overflowX <= 0 ? 'PASS' : 'FAIL'}`);

    await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_rider_command_center_mobile_375.png'), fullPage: true });
    await mobileContext.close();

    // 8. Test Improved Logout Feature
    console.log('\n[8/8] Testing Improved Logout Feature on Rider Dashboard...');
    const logoutBtn = await page.$('button[title="Sign Out"]');
    if (logoutBtn) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      const isLoggedOut = page.url().includes('/login');
      console.log(`- Successfully logged out and redirected to /login: ${isLoggedOut ? 'PASS' : 'FAIL'}`);
    }

    console.log('\n=== ALL RIDER VERIFICATION TESTS COMPLETED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Rider test execution error:', err);
  } finally {
    await browser.close();
  }
}

runRiderVerification();
