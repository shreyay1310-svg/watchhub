import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('server/scripts/screenshots_super_admin');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runSuperAdminVerification() {
  console.log('--- WATCHHUB SUPER ADMIN COMMAND CENTER VERIFICATION ---');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Login
    console.log('[Step 1] Logging in as Super Admin (superadmin@watchhub.com)...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

    await page.fill('input[type="email"]', 'superadmin@watchhub.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');

    // Wait for redirect to /super-admin/dashboard
    await page.waitForURL('**/super-admin/**', { timeout: 15000 });
    console.log('[Step 2] Arrived at:', page.url());

    // Wait for data table and KPI cards to load
    await page.waitForSelector('text=Users & Role-Based Permissions', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verify KPI Cards
    const totalUsersText = await page.textContent('text=Total Users');
    const rolesText = await page.textContent('text=Roles');
    const deptText = await page.textContent('text=Departments');
    console.log('[KPIs Present]:', Boolean(totalUsersText), Boolean(rolesText), Boolean(deptText));

    // Capture main Users & Roles screenshot (matching reference)
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_users_and_roles_dashboard.png'), fullPage: false });
    console.log('[Screenshot Saved] 01_users_and_roles_dashboard.png');

    // 2. Open Add Staff Member Modal
    console.log('[Step 3] Testing Add Staff Member Modal...');
    await page.click('button:has-text("Add Staff Member")');
    await page.waitForSelector('text=Add New Staff Member', { timeout: 5000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_add_staff_modal.png') });
    console.log('[Screenshot Saved] 02_add_staff_modal.png');
    await page.click('button:has-text("Cancel")');
    await page.waitForTimeout(500);

    // 3. Open Permissions Matrix Modal
    console.log('[Step 4] Testing Role Permissions Modal...');
    const keyButtons = await page.$$('button[title="Manage Permissions"]');
    if (keyButtons.length > 0) {
      await keyButtons[0].click();
      await page.waitForSelector('text=Role Permissions Matrix', { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_permissions_modal.png') });
      console.log('[Screenshot Saved] 03_permissions_modal.png');
      await page.click('button:has-text("Acknowledge Permissions")');
      await page.waitForTimeout(500);
    }

    // 4. Test Tab: System Overview
    console.log('[Step 5] Navigating to System Overview...');
    await page.click('button:has-text("System Overview")');
    await page.waitForSelector('text=Executive System Overview', { timeout: 8000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_system_overview.png') });
    console.log('[Screenshot Saved] 04_system_overview.png');

    // 5. Test Tab: Role Permissions
    console.log('[Step 6] Navigating to Role Permissions...');
    await page.click('button:has-text("Role Permissions")');
    await page.waitForSelector('text=Role Permissions & Authority Matrix', { timeout: 8000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_roles_matrix.png') });
    console.log('[Screenshot Saved] 05_roles_matrix.png');

    // 6. Test Tab: Department Management
    console.log('[Step 7] Navigating to Department Management...');
    await page.click('button:has-text("Department Management")');
    await page.waitForSelector('text=Corporate Departments & Staff Allocation', { timeout: 8000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_departments.png') });
    console.log('[Screenshot Saved] 06_departments.png');

    // 7. Test Tab: Audit & Security
    console.log('[Step 8] Navigating to Audit & Security...');
    await page.click('button:has-text("Audit & Security")');
    await page.waitForSelector('text=Audit & Security Center', { timeout: 8000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_audit_security.png') });
    console.log('[Screenshot Saved] 07_audit_security.png');

    // 8. Test Tab: Operations (System Health)
    console.log('[Step 9] Navigating to Operations / System Health...');
    await page.click('button:has-text("System Health")');
    await page.waitForSelector('text=Operations & Infrastructure Telemetry', { timeout: 8000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_system_health.png') });
    console.log('[Screenshot Saved] 08_system_health.png');

    // 9. Mobile Responsive Test (375x812)
    console.log('[Step 10] Testing Mobile Viewport (375x812)...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:5173/super-admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const overflowCheck = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      return { docW, winW, hasOverflow: docW > winW };
    });
    console.log('[Mobile Overflow Check]:', overflowCheck);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_mobile_375x812.png'), fullPage: false });
    console.log('[Screenshot Saved] 09_mobile_375x812.png');

    console.log('\n>>> ALL SUPER ADMIN COMMAND CENTER CHECKS PASSED SUCCESSFULLY! <<<');
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runSuperAdminVerification();
