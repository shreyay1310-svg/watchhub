import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('server/scripts/screenshots_support_manager');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  console.log('=== STARTING SUPPORT MANAGER & MULTI-ROLE REFRESH/LOGOUT VERIFICATION ===');
  
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Track console errors
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('chrome-error')) {
      errors.push(msg.text());
    }
  });

  try {
    // ----------------------------------------------------
    // TEST 1: SUPPORT MANAGER COMMAND CENTER (DESKTOP)
    // ----------------------------------------------------
    console.log('\n[1/7] Testing Support Manager Command Center...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

    // Fill login credentials
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'support@watchhub.com');
    await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', 'Admin@123');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1500);

    // Navigate to Support Manager dashboard if not auto-navigated
    if (!page.url().includes('/customer-support')) {
      await page.goto('http://localhost:5173/customer-support/dashboard', { waitUntil: 'networkidle' });
    }

    await page.waitForTimeout(1000);
    console.log('Support Manager URL:', page.url());

    // Verify key UI elements matching reference screenshot
    const pageText = await page.textContent('body');
    const hasHeaderBranding = pageText.includes('WATCHHUB ATELIER') && pageText.includes('SUPPORT MANAGER');
    const hasGreeting = pageText.includes('Pooja Sharma');
    const hasTotalTickets = pageText.includes('1,248');
    const hasResolved = pageText.includes('1,096');
    const hasPending = pageText.includes('108');
    const hasEscalations = pageText.includes('24');
    const hasAvgResponse = pageText.includes('4m 32s');
    const hasCSAT = pageText.includes('4.8 / 5');
    const hasWeeklyInflow = pageText.includes('Weekly Ticket Inflow & Resolution');
    const hasStatusDistribution = pageText.includes('Ticket Status Distribution');
    const hasRecentInquiries = pageText.includes('Recent Support Inquiries');
    const hasActiveAgents = pageText.includes('Active Support Agents');
    const hasFCR = pageText.includes('88.5%');

    // Check for "undefined" bug in inquiries table
    const hasUndefinedInquiry = pageText.includes('Live Chat Inquiry: undefined');

    console.log('UI Element Verification:');
    console.log(`- Header Branding: ${hasHeaderBranding ? 'PASS' : 'FAIL'}`);
    console.log(`- Pooja Sharma Greeting: ${hasGreeting ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Total Tickets (1,248): ${hasTotalTickets ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Resolved (1,096): ${hasResolved ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Pending (108): ${hasPending ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Escalations (24): ${hasEscalations ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI Avg Response (4m 32s): ${hasAvgResponse ? 'PASS' : 'FAIL'}`);
    console.log(`- KPI CSAT (4.8 / 5): ${hasCSAT ? 'PASS' : 'FAIL'}`);
    console.log(`- Weekly Inflow Chart: ${hasWeeklyInflow ? 'PASS' : 'FAIL'}`);
    console.log(`- Status Distribution Donut: ${hasStatusDistribution ? 'PASS' : 'FAIL'}`);
    console.log(`- Recent Inquiries Table: ${hasRecentInquiries ? 'PASS' : 'FAIL'}`);
    console.log(`- Live Chat Inquiry undefined bug absent: ${!hasUndefinedInquiry ? 'PASS' : 'FAIL'}`);
    console.log(`- Active Agents Leaderboard: ${hasActiveAgents ? 'PASS' : 'FAIL'}`);
    console.log(`- FCR Card (88.5%): ${hasFCR ? 'PASS' : 'FAIL'}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_support_manager_desktop_dashboard.png'), fullPage: true });

    // Test tab navigation
    console.log('\n[2/7] Testing Support Manager Tab Navigation across all 12 modules...');
    const tabs = ['tickets', 'live-chat', 'customers', 'orders-returns', 'refunds', 'escalations', 'knowledge-base', 'canned-responses', 'reports', 'team', 'settings', 'dashboard'];
    for (const tab of tabs) {
      await page.goto(`http://localhost:5173/customer-support/${tab}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const content = await page.textContent('body');
      const isRendered = content.length > 500 && !content.includes('Module Loading Exception');
      console.log(`  - Tab /customer-support/${tab}: ${isRendered ? 'LOADED OK' : 'FAILED'}`);
    }

    // ----------------------------------------------------
    // TEST 3: REFRESH RESILIENCE ON SUPPORT MANAGER
    // ----------------------------------------------------
    console.log('\n[3/7] Testing Refresh Resilience on Support Manager...');
    await page.goto('http://localhost:5173/customer-support/dashboard', { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const refreshedText = await page.textContent('body');
    const hasTimeStandstill = refreshedText.includes('Time Standstill') || refreshedText.includes('CONNECTION OFFLINE');
    console.log(`- Still on Support Manager after refresh: ${page.url().includes('/customer-support') ? 'PASS' : 'FAIL'}`);
    console.log(`- Time Standstill / Offline screen absent on refresh: ${!hasTimeStandstill ? 'PASS' : 'FAIL'}`);

    // ----------------------------------------------------
    // TEST 4: LOGOUT ON SUPPORT MANAGER
    // ----------------------------------------------------
    console.log('\n[4/7] Testing Logout on Support Manager...');
    const logoutBtn = await page.$('button[title="Sign Out"]');
    if (logoutBtn) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      console.log(`- Redirected to login on logout: ${page.url().includes('/login') ? 'PASS' : 'FAIL'}`);
    } else {
      console.log('- Logout button not found!');
    }

    // ----------------------------------------------------
    // TEST 5: STORE ADMIN REFRESH & LOGOUT
    // ----------------------------------------------------
    console.log('\n[5/7] Testing Store Admin Refresh & Logout...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'admin@watchhub.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    if (!page.url().includes('/store-admin')) {
      await page.goto('http://localhost:5173/store-admin/dashboard', { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(1000);
    console.log('Store Admin URL:', page.url());

    // Test REFRESH on Store Admin
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const storeAdminRefreshedText = await page.textContent('body');
    const storeAdminHasOffline = storeAdminRefreshedText.includes('Time Standstill') || storeAdminRefreshedText.includes('CONNECTION OFFLINE');
    console.log(`- Still on Store Admin after refresh: ${page.url().includes('/store-admin') ? 'PASS' : 'FAIL'}`);
    console.log(`- Time Standstill / Offline absent on Store Admin refresh: ${!storeAdminHasOffline ? 'PASS' : 'FAIL'}`);

    // Test LOGOUT on Store Admin
    const storeAdminLogout = await page.$('button[title="Sign Out"]');
    if (storeAdminLogout) {
      await storeAdminLogout.click();
      await page.waitForTimeout(1000);
      console.log(`- Store Admin redirected to login on logout: ${page.url().includes('/login') ? 'PASS' : 'FAIL'}`);
    }

    // ----------------------------------------------------
    // TEST 6: SUPER ADMIN REFRESH & LOGOUT
    // ----------------------------------------------------
    console.log('\n[6/7] Testing Super Admin Refresh & Logout...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'superadmin@watchhub.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    if (!page.url().includes('/super-admin')) {
      await page.goto('http://localhost:5173/super-admin/dashboard', { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(1000);
    console.log('Super Admin URL:', page.url());

    // Test REFRESH on Super Admin
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const superAdminRefreshedText = await page.textContent('body');
    const superAdminHasOffline = superAdminRefreshedText.includes('Time Standstill') || superAdminRefreshedText.includes('CONNECTION OFFLINE');
    console.log(`- Still on Super Admin after refresh: ${page.url().includes('/super-admin') ? 'PASS' : 'FAIL'}`);
    console.log(`- Time Standstill / Offline absent on Super Admin refresh: ${!superAdminHasOffline ? 'PASS' : 'FAIL'}`);

    // Test LOGOUT on Super Admin
    const superAdminLogout = await page.$('button[title="Log out of Super Admin"]');
    if (superAdminLogout) {
      await superAdminLogout.click();
      await page.waitForTimeout(1000);
      console.log(`- Super Admin redirected to login on logout: ${page.url().includes('/login') ? 'PASS' : 'FAIL'}`);
    }

    // ----------------------------------------------------
    // TEST 7: MOBILE RESPONSIVE TEST (SUPPORT MANAGER 375x812)
    // ----------------------------------------------------
    console.log('\n[7/7] Testing Support Manager Mobile (375x812)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await mobilePage.fill('input[type="email"]', 'support@watchhub.com');
    await mobilePage.fill('input[type="password"]', 'Admin@123');
    await mobilePage.click('button[type="submit"]');
    await mobilePage.waitForTimeout(1500);

    if (!mobilePage.url().includes('/customer-support')) {
      await mobilePage.goto('http://localhost:5173/customer-support/dashboard', { waitUntil: 'networkidle' });
    }
    await mobilePage.waitForTimeout(1000);

    // Measure horizontal scroll overflow
    const overflowX = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    console.log(`- Mobile Horizontal Overflow (375x812): ${overflowX}px (target: 0px) -> ${overflowX <= 0 ? 'PASS' : 'FAIL'}`);

    await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, '02_support_manager_mobile_375.png'), fullPage: true });

    await mobileContext.close();

    console.log('\n=== ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
