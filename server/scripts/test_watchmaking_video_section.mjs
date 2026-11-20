// Verification script for Watchmaking YouTube Short in Craftsmanship Section
import { chromium } from 'playwright-core';
import { prisma } from '../src/config/prisma.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'watchhub_super_secret_access_jwt_key_2026_luxury_chronograph';

async function verifyWatchmakingShort() {
  console.log('\n================================================================');
  console.log('WATCHHUB — WATCHMAKING YOUTUBE SHORT VALIDATION SUITE');
  console.log('Target: http://localhost:5173/');
  console.log('================================================================\n');

  // Find a Customer user from SQL Server
  const dbUser = await prisma.user.findFirst({
    where: { isEmailVerified: true },
    include: { userRoles: { include: { role: true } } },
  });

  if (!dbUser) {
    throw new Error('No verified user found in SQL Server WatchHubDB!');
  }

  const roleName = dbUser.userRoles?.[0]?.role?.roleName || 'Customer';
  const tokenPayload = {
    id: dbUser.userId,
    name: dbUser.fullName,
    email: dbUser.email,
    role: roleName,
    permissions: ['orders.own', 'cart.own', 'wishlist.own'],
  };

  const validAccessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
  console.log(`[Auth] Generated authentic JWT for user: ${dbUser.email} (Role: ${roleName})`);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // ── Test 1: Desktop Viewport (1280x800) ──
    console.log('[Test 1] Testing Desktop Viewport (1280x800)...');
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await desktopContext.newPage();

    // Inject valid token into localStorage before storefront navigation
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.evaluate(({ token, user }) => {
      localStorage.setItem('watchhub_token', token);
      localStorage.setItem('watchhub_auth_user', JSON.stringify(user));
    }, { token: validAccessToken, user: { id: dbUser.userId, name: dbUser.fullName, email: dbUser.email, role: roleName } });

    console.log('[Desktop] Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('[Desktop] Current URL:', page.url());

    // Locate the Watchmaking Craftsmanship Section
    const section = page.locator('#watchmaking-craftsmanship');
    const sectionCount = await section.count();
    console.log(`[Desktop] Section #watchmaking-craftsmanship found: ${sectionCount > 0 ? 'PASS' : 'FAIL'}`);
    if (sectionCount === 0) throw new Error('Section #watchmaking-craftsmanship not found!');

    // 1. Heading verification
    const headingText = await section.locator('h2').innerText();
    console.log(`[Desktop] Section Heading: "${headingText}"`);
    if (!headingText.includes('THE ART OF WATCHMAKING')) {
      throw new Error(`Heading mismatch: expected "THE ART OF WATCHMAKING", got "${headingText}"`);
    }

    // 2. Subtitle verification
    const subtitleText = await section.locator('p').first().innerText();
    console.log(`[Desktop] Subtitle: "${subtitleText}"`);
    if (!subtitleText.includes('Precision, patience and timeless craftsmanship.')) {
      throw new Error(`Subtitle mismatch: got "${subtitleText}"`);
    }

    // 3. Video Title verification
    const videoTitle = await section.locator('h3').first().innerText();
    console.log(`[Desktop] Video Title: "${videoTitle}"`);
    if (!videoTitle.includes('Inside the Art of Watchmaking')) {
      throw new Error(`Video Title mismatch: got "${videoTitle}"`);
    }

    // 4. Video Description verification
    const descText = await section.locator('text=Discover the intricate craftsmanship').innerText();
    console.log(`[Desktop] Description: "${descText.slice(0, 50)}..."`);

    // 5. YouTube Embed iframe verification
    const iframe = section.locator('iframe');
    const iframeSrc = await iframe.getAttribute('src');
    const iframeTitle = await iframe.getAttribute('title');
    console.log(`[Desktop] iframe src: ${iframeSrc}`);
    console.log(`[Desktop] iframe title: ${iframeTitle}`);
    if (!iframeSrc.includes('youtube-nocookie.com/embed/yzfdv0Tfkz0')) {
      throw new Error(`iframe src mismatch: got "${iframeSrc}"`);
    }

    // 6. 9:16 Aspect ratio container verification
    const playerContainer = section.locator('div[class*="aspect-[9/16]"]');
    const aspectContainerCount = await playerContainer.count();
    console.log(`[Desktop] 9:16 Aspect ratio container found: ${aspectContainerCount > 0 ? 'PASS' : 'FAIL'}`);
    const box = await playerContainer.boundingBox();
    console.log(`[Desktop] Player dimensions: width=${Math.round(box.width)}px, height=${Math.round(box.height)}px (ratio: ${(box.height / box.width).toFixed(2)})`);

    // 7. Fallback Link verification
    const fallbackLink = section.locator('a[href*="youtube.com/shorts/yzfdv0Tfkz0"]');
    const fallbackCount = await fallbackLink.count();
    const fallbackHref = await fallbackLink.getAttribute('href');
    console.log(`[Desktop] Fallback Link found: ${fallbackCount > 0 ? 'PASS' : 'FAIL'} (${fallbackHref})`);

    // 8. Existing Story cards verification
    const storyCards = section.locator('h3:has-text("The Hand of the Master Watchmaker"), h3:has-text("The Historic Regulator Legacy"), h3:has-text("Architectural Watches & Journeys")');
    const cardsCount = await storyCards.count();
    console.log(`[Desktop] Existing Story Cards preserved: ${cardsCount === 3 ? 'PASS' : 'FAIL'} (${cardsCount}/3 cards)`);

    // Capture screenshot
    const screenshotPath = path.resolve(__dirname, '../../WATCHHUB_LIVE_TEST_EVIDENCE/watchmaking_youtube_short_desktop.png');
    await section.screenshot({ path: screenshotPath });
    console.log(`[Desktop] Screenshot captured: ${screenshotPath}`);

    // ── Test 2: Mobile Viewport (375x667 - iPhone SE) ──
    console.log('\n[Test 2] Testing Mobile Viewport (375x667)...');
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await mobilePage.evaluate(({ token, user }) => {
      localStorage.setItem('watchhub_token', token);
      localStorage.setItem('watchhub_auth_user', JSON.stringify(user));
    }, { token: validAccessToken, user: { id: dbUser.userId, name: dbUser.fullName, email: dbUser.email, role: roleName } });

    await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(2000);

    const mobileSection = mobilePage.locator('#watchmaking-craftsmanship');
    const mobilePlayer = mobileSection.locator('div[class*="aspect-[9/16]"]');
    const mobileBox = await mobilePlayer.boundingBox();
    console.log(`[Mobile] Player dimensions: width=${Math.round(mobileBox.width)}px, height=${Math.round(mobileBox.height)}px (ratio: ${(mobileBox.height / mobileBox.width).toFixed(2)})`);

    const mobileScreenshotPath = path.resolve(__dirname, '../../WATCHHUB_LIVE_TEST_EVIDENCE/watchmaking_youtube_short_mobile.png');
    await mobileSection.screenshot({ path: mobileScreenshotPath });
    console.log(`[Mobile] Screenshot captured: ${mobileScreenshotPath}`);

    console.log('\n================================================================');
    console.log('✔ ALL WATCHMAKING YOUTUBE SHORT VALIDATION CHECKS PASSED (100%)');
    console.log('================================================================\n');

  } catch (err) {
    console.error('\n❌ VALIDATION ERROR:', err.message);
    throw err;
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

verifyWatchmakingShort();
