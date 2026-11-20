// Real Browser Registration Flow Complete End-to-End Test
import { chromium } from 'playwright-core';
import { prisma } from '../src/config/prisma.js';
import { hashOtp, getCurrentOtpSecret } from '../src/services/otpService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEST_EMAIL = 'shreyay1310@gmail.com';

// Helper to quickly derive the 6-digit OTP from its stored HMAC hash
function bruteForceOtpFromHash(storedHash, identifier, purpose) {
  const secret = getCurrentOtpSecret();
  console.log('[Brute Force] Deriving 6-digit OTP from HMAC-SHA256 for test verification...');
  const start = Date.now();
  for (let n = 100000; n <= 999999; n++) {
    const candidate = n.toString();
    const digest = hashOtp(candidate, identifier, purpose, secret);
    if (digest === storedHash) {
      console.log(`[Brute Force] Successfully derived OTP: ${candidate} in ${Date.now() - start}ms`);
      return candidate;
    }
  }
  throw new Error('Failed to derive OTP from hash.');
}

async function runCompleteRegistrationTest() {
  console.log('\n================================================================');
  console.log('WATCHHUB — REAL BROWSER REGISTRATION & EMAIL OTP TEST');
  console.log('Target Email: ' + TEST_EMAIL);
  console.log('================================================================\n');

  // Pre-cleanup: Remove any existing test user and verification records to test clean registration
  console.log('[Prep] Checking existing records in SQL Server (WatchHubDB)...');
  await prisma.oTPVerification.deleteMany({
    where: { identifier: TEST_EMAIL },
  }).catch(() => {});

  const existingUser = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
  });
  if (existingUser) {
    console.log(`[Prep] Found existing user (${existingUser.userId}). Cleaning for clean test...`);
    await prisma.userRole.deleteMany({ where: { userId: existingUser.userId } }).catch(() => {});
    await prisma.user.delete({ where: { userId: existingUser.userId } }).catch(() => {});
  }
  console.log('[Prep] Clean slate prepared.');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  let sendOtpResponse = null;
  let verifyOtpResponse = null;

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/auth/send-email-otp')) {
      try {
        sendOtpResponse = { status: res.status(), body: await res.json() };
      } catch (e) {
        sendOtpResponse = { status: res.status(), text: await res.text() };
      }
      console.log(`[Network API] /send-email-otp returned HTTP ${res.status()}`);
    } else if (url.includes('/api/auth/verify-email-otp')) {
      try {
        verifyOtpResponse = { status: res.status(), body: await res.json() };
      } catch (e) {
        verifyOtpResponse = { status: res.status(), text: await res.text() };
      }
      console.log(`[Network API] /verify-email-otp returned HTTP ${res.status()}`);
    }
  });

  try {
    console.log('[Step 1] Navigating to http://localhost:5173/signup...');
    await page.goto('http://localhost:5173/signup', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // If redirected to /login, navigate to signup
    if (page.url().includes('/login')) {
      console.log('[Step 1B] Redirected to /login. Clicking signup link...');
      await page.click('a[href="/signup"]');
      await page.waitForTimeout(1000);
    }

    console.log('[Step 2] Current URL:', page.url());

    // Step 1: Fill out registration details
    console.log('[Step 3] Filling registration fields...');
    await page.fill('input[placeholder*="Singhania"]', 'Shreyas Collector');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="tel"]', '9876543210');
    await page.fill('input[placeholder*="Min 6 characters"]', 'LuxuryCollector@2026');
    await page.fill('input[placeholder*="Confirm password"]', 'LuxuryCollector@2026');

    // Ensure Email channel is active
    console.log('[Step 4] Ensuring "Email Inbox" channel is selected...');
    const emailChannelBtn = page.locator('button:has-text("Email Inbox")');
    if ((await emailChannelBtn.count()) > 0) {
      await emailChannelBtn.click();
    }

    // Click "Send Email Verification Code"
    console.log('[Step 5] Clicking "Send Email Verification Code" button...');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    console.log('[Step 6] Awaiting API response and UI transition...');
    await page.waitForTimeout(5000);

    console.log('[Step 7] Send OTP API result:', JSON.stringify(sendOtpResponse, null, 2));

    if (!sendOtpResponse || sendOtpResponse.status !== 200) {
      throw new Error(`Send OTP failed with HTTP ${sendOtpResponse?.status}: ${JSON.stringify(sendOtpResponse)}`);
    }

    // Step 2 UI verification
    const step2Heading = await page.locator('text=Step 2 of 2').count();
    console.log('[Step 8] Step 2 UI visible count:', step2Heading);
    if (step2Heading === 0) {
      throw new Error('Step 2 UI was not rendered after successful send-email-otp!');
    }

    // Query SQL Server to inspect the persisted OTP verification record
    console.log('[Step 9] Inspecting persisted record in SQL Server (WatchHubDB)...');
    const otpRecord = await prisma.oTPVerification.findUnique({
      where: {
        identifier_purpose: {
          identifier: TEST_EMAIL.toLowerCase(),
          purpose: 'registration',
        },
      },
    });

    console.log('[Step 10] Persisted DB Record:', {
      identifier: otpRecord?.identifier,
      purpose: otpRecord?.purpose,
      channel: otpRecord?.channel,
      dispatchState: otpRecord?.dispatchState,
      dispatchLockedUntil: otpRecord?.dispatchLockedUntil,
      resendCooldownUntil: otpRecord?.resendCooldownUntil,
      expiresAt: otpRecord?.expiresAt,
      isVerified: otpRecord?.isVerified,
      otpHashPreview: otpRecord?.otpHash?.slice(0, 16) + '...',
    });

    if (!otpRecord || otpRecord.dispatchState !== 'ACTIVE') {
      throw new Error(`Database record not active! DispatchState: ${otpRecord?.dispatchState}`);
    }

    // Derive the 6-digit OTP from its stored HMAC digest
    const otpCode = bruteForceOtpFromHash(otpRecord.otpHash, TEST_EMAIL, 'registration');

    console.log(`[Step 11] Entering derived 6-digit OTP into Step 2 inputs...`);
    const otpInputs = page.locator('input[type="text"][maxlength="1"], input[inputmode="numeric"]');
    const inputCount = await otpInputs.count();
    console.log(`[Step 11B] Found ${inputCount} OTP digit input fields.`);

    if (inputCount === 6) {
      for (let i = 0; i < 6; i++) {
        await otpInputs.nth(i).fill(otpCode[i]);
        await page.waitForTimeout(50);
      }
    } else {
      // Fallback: type into first input
      await otpInputs.first().fill(otpCode);
    }

    await page.waitForTimeout(500);

    // Click "Verify Email & Complete Registration"
    console.log('[Step 12] Clicking "Verify Email & Complete Registration"...');
    const verifyBtn = page.locator('button[type="submit"]:has-text("Verify Email")');
    await verifyBtn.click();

    console.log('[Step 13] Waiting for account creation & verification API response...');
    await page.waitForTimeout(4000);

    console.log('[Step 14] Verify OTP API result:', JSON.stringify(verifyOtpResponse, null, 2));

    if (!verifyOtpResponse || verifyOtpResponse.status !== 200) {
      throw new Error(`Verify OTP failed with HTTP ${verifyOtpResponse?.status}: ${JSON.stringify(verifyOtpResponse)}`);
    }

    // Verify user in SQL Server WatchHubDB
    console.log('[Step 15] Verifying user account persistence in SQL Server...');
    const userInDb = await prisma.user.findUnique({
      where: { email: TEST_EMAIL.toLowerCase() },
      include: { userRoles: { include: { role: true } } },
    });

    console.log('[Step 16] Created User in DB:', {
      userId: userInDb?.userId,
      email: userInDb?.email,
      fullName: userInDb?.fullName,
      isEmailVerified: userInDb?.isEmailVerified,
      roles: userInDb?.userRoles?.map((r) => r.role.roleName),
      createdAt: userInDb?.createdAt,
    });

    if (!userInDb || !userInDb.isEmailVerified) {
      throw new Error('User was not created with isEmailVerified=true in SQL Server!');
    }

    console.log('\n================================================================');
    console.log('✔ SUCCESS: FULL REAL BROWSER REGISTRATION & EMAIL OTP FLOW PASSED');
    console.log('================================================================\n');

  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    throw err;
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

runCompleteRegistrationTest();
