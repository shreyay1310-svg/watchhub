// WATCHHUB ATELIER — DYNAMIC EMAIL OTP DELIVERY TEST SUITE
// Validates dynamic recipient handling, RFC normalization, V3 security, and Gmail SMTP delivery
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../src/config/prisma.js';
import { sendGmailOtp, verifyGmailSmtp } from '../src/services/googleEmailService.js';
import { hashOtp, verifyOtp } from '../src/services/otpService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE = 'http://localhost:5000/api/auth';
const results = [];

function recordTest(id, name, status, details, evidence = null) {
  results.push({ id, name, status, details, evidence });
  const icon = status === 'PASS' ? '✔ [PASS]' : '✘ [FAIL]';
  console.log(`${icon} ${id}: ${name}`);
  if (details) console.log(`   Details: ${details}`);
}

async function runDynamicOtpSuite() {
  console.log('\n================================================================================');
  console.log('WATCHHUB ATELIER — DYNAMIC EMAIL OTP DELIVERY VERIFICATION SUITE');
  console.log('Target API: http://localhost:5000/api/auth | DB: WatchHubDB @ 127.0.0.1:1433');
  console.log('================================================================================\n');

  const testStamp = Date.now();
  let createdTestUserId = null;

  // --------------------------------------------------------------------------
  // TC_DY_001: Dynamic recipient selection with Gmail address & purpose: REGISTER
  // --------------------------------------------------------------------------
  try {
    const rawEmail = `collector_${testStamp}@gmail.com`;
    const res = await fetch(`${API_BASE}/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: rawEmail, purpose: 'REGISTER', name: 'James Sterling' }),
    });
    const data = await res.json();

    if (res.ok && data.success === true && data.identifier === rawEmail.toLowerCase()) {
      recordTest(
        'TC_DY_001',
        'Dynamic recipient selection with Gmail address & purpose: REGISTER',
        'PASS',
        `Backend accepted Gmail address and mapped purpose REGISTER to registration.`,
        data
      );
    } else {
      recordTest('TC_DY_001', 'Dynamic recipient selection with Gmail address', 'FAIL', 'Unexpected response', data);
    }
  } catch (err) {
    recordTest('TC_DY_001', 'Dynamic recipient selection with Gmail address', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_002: Dynamic recipient with corporate horology domain
  // --------------------------------------------------------------------------
  try {
    const rawEmail = `director_${testStamp}@swiss-horology-group.ch`;
    const res = await fetch(`${API_BASE}/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: rawEmail, purpose: 'registration' }),
    });
    const data = await res.json();

    if (res.ok && data.success === true && data.identifier === rawEmail) {
      recordTest(
        'TC_DY_002',
        'Dynamic recipient with corporate horology domain',
        'PASS',
        `Dispatched to corporate domain (${rawEmail}) without fallback substitution.`,
        data
      );
    } else {
      recordTest('TC_DY_002', 'Dynamic recipient with corporate horology domain', 'FAIL', 'Dispatch error', data);
    }
  } catch (err) {
    recordTest('TC_DY_002', 'Dynamic recipient with corporate horology domain', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_003: Leading and trailing whitespace normalization
  // --------------------------------------------------------------------------
  try {
    const paddedEmail = `   pad_${testStamp}@collector-vault.org   `;
    const expected = `pad_${testStamp}@collector-vault.org`;
    const res = await fetch(`${API_BASE}/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: paddedEmail, purpose: 'registration' }),
    });
    const data = await res.json();

    if (res.ok && data.identifier === expected) {
      recordTest(
        'TC_DY_003',
        'Leading and trailing whitespace normalization',
        'PASS',
        `Input "${paddedEmail}" trimmed cleanly to "${expected}".`,
        { sent: paddedEmail, normalized: data.identifier }
      );
    } else {
      recordTest('TC_DY_003', 'Leading and trailing whitespace normalization', 'FAIL', 'Normalization mismatch', data);
    }
  } catch (err) {
    recordTest('TC_DY_003', 'Leading and trailing whitespace normalization', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_004: Uppercase and mixed-case normalization
  // --------------------------------------------------------------------------
  try {
    const upperEmail = `VIKRAM_${testStamp}@HAUTE-HORLOGERIE.COM`;
    const expected = upperEmail.toLowerCase();
    const res = await fetch(`${API_BASE}/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: upperEmail, purpose: 'registration' }),
    });
    const data = await res.json();

    if (res.ok && data.identifier === expected) {
      recordTest(
        'TC_DY_004',
        'Uppercase and mixed-case normalization',
        'PASS',
        `Input "${upperEmail}" normalized to lowercase "${expected}".`,
        { sent: upperEmail, normalized: data.identifier }
      );
    } else {
      recordTest('TC_DY_004', 'Uppercase and mixed-case normalization', 'FAIL', 'Case mismatch', data);
    }
  } catch (err) {
    recordTest('TC_DY_004', 'Uppercase and mixed-case normalization', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_005: Invalid email format rejection
  // --------------------------------------------------------------------------
  try {
    const invalidEmail = 'invalid_email_without_at_symbol';
    const res = await fetch(`${API_BASE}/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: invalidEmail, purpose: 'registration' }),
    });
    const data = await res.json();

    if (res.status === 400 && data.message === 'Please enter a valid email address.') {
      recordTest(
        'TC_DY_005',
        'Invalid email format rejection',
        'PASS',
        `Rejected invalid format with HTTP 400: "${data.message}"`,
        data
      );
    } else {
      recordTest('TC_DY_005', 'Invalid email format rejection', 'FAIL', 'Accepted invalid email or wrong message', data);
    }
  } catch (err) {
    recordTest('TC_DY_005', 'Invalid email format rejection', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_006: Empty email rejection
  // --------------------------------------------------------------------------
  try {
    const res = await fetch(`${API_BASE}/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', purpose: 'registration' }),
    });
    const data = await res.json();

    if (res.status === 400 && data.message === 'Please enter a valid email address.') {
      recordTest(
        'TC_DY_006',
        'Empty email rejection',
        'PASS',
        `Empty input rejected with HTTP 400: "${data.message}"`,
        data
      );
    } else {
      recordTest('TC_DY_006', 'Empty email rejection', 'FAIL', 'Did not reject empty email', data);
    }
  } catch (err) {
    recordTest('TC_DY_006', 'Empty email rejection', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_007: Same email used for OTP verification & atomic activation
  // --------------------------------------------------------------------------
  try {
    const customerEmail = `verified_${testStamp}@watchatelier.luxury`;
    const otp = '928415';
    const purpose = 'registration';
    const now = new Date();

    // Create reservation in WatchHubDB
    await prisma.oTPVerification.create({
      data: {
        identifier: customerEmail,
        purpose,
        channel: 'email',
        otpHash: hashOtp(otp, customerEmail, purpose),
        dispatchToken: 'test_token_' + testStamp,
        dispatchState: 'ACTIVE',
        resendCooldownUntil: new Date(now.getTime() + 60000),
        expiresAt: new Date(now.getTime() + 300000),
        attempts: 0,
        isVerified: false,
      },
    });

    const verifyRes = await fetch(`${API_BASE}/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: customerEmail,
        otp: otp,
        purpose: 'registration',
        name: 'Alexander Sterling',
        password: 'SecurePassword2026!',
        phone: '+91 9876543210',
      }),
    });
    const verifyData = await verifyRes.json();

    if (verifyRes.ok && verifyData.success === true && verifyData.user?.email === customerEmail) {
      createdTestUserId = verifyData.user?.id;
      recordTest(
        'TC_DY_007',
        'Same email used for OTP verification & atomic activation',
        'PASS',
        `Verified OTP against exact email and created user in MSSQL with token.`,
        verifyData
      );
    } else {
      recordTest('TC_DY_007', 'Same email used for OTP verification', 'FAIL', 'Verification failed', verifyData);
    }
  } catch (err) {
    recordTest('TC_DY_007', 'Same email used for OTP verification', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_008: Mismatched email verification rejection
  // --------------------------------------------------------------------------
  try {
    const emailA = `client_a_${testStamp}@gmail.com`;
    const emailB = `client_b_${testStamp}@gmail.com`;
    const otp = '654321';
    const purpose = 'registration';
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: emailA,
        purpose,
        channel: 'email',
        otpHash: hashOtp(otp, emailA, purpose),
        dispatchToken: 'token_a_' + testStamp,
        dispatchState: 'ACTIVE',
        resendCooldownUntil: new Date(now.getTime() + 60000),
        expiresAt: new Date(now.getTime() + 300000),
        attempts: 0,
        isVerified: false,
      },
    });

    // Attempt verify with emailB using OTP issued to emailA
    const verifyRes = await fetch(`${API_BASE}/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailB, otp: otp, purpose: 'registration' }),
    });
    const verifyData = await verifyRes.json();

    if (verifyRes.status === 400 && verifyData.success === false) {
      recordTest(
        'TC_DY_008',
        'Mismatched email verification rejection',
        'PASS',
        `Mismatched email strictly rejected: cannot verify code issued to another recipient.`,
        verifyData
      );
    } else {
      recordTest('TC_DY_008', 'Mismatched email verification rejection', 'FAIL', 'Accepted mismatched email', verifyData);
    }
  } catch (err) {
    recordTest('TC_DY_008', 'Mismatched email verification rejection', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_009: Expired OTP verification rejection
  // --------------------------------------------------------------------------
  try {
    const email = `expired_${testStamp}@gmail.com`;
    const otp = '112233';
    const purpose = 'registration';
    const past = new Date(Date.now() - 60000);

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp(otp, email, purpose),
        dispatchToken: 'exp_token_' + testStamp,
        dispatchState: 'ACTIVE',
        resendCooldownUntil: past,
        expiresAt: past,
        attempts: 0,
        isVerified: false,
      },
    });

    const res = await fetch(`${API_BASE}/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, purpose }),
    });
    const data = await res.json();

    if (res.status === 400 && data.message === 'Your verification code has expired. Request a new code.') {
      recordTest(
        'TC_DY_009',
        'Expired OTP verification rejection',
        'PASS',
        `Expired code returns: "${data.message}"`,
        data
      );
    } else {
      recordTest('TC_DY_009', 'Expired OTP verification rejection', 'FAIL', 'Unexpected response', data);
    }
  } catch (err) {
    recordTest('TC_DY_009', 'Expired OTP verification rejection', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_010: Incorrect OTP verification rejection
  // --------------------------------------------------------------------------
  try {
    const email = `wrong_${testStamp}@gmail.com`;
    const validOtp = '778899';
    const wrongOtp = '000000';
    const purpose = 'registration';
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp(validOtp, email, purpose),
        dispatchToken: 'wrong_token_' + testStamp,
        dispatchState: 'ACTIVE',
        resendCooldownUntil: new Date(now.getTime() + 60000),
        expiresAt: new Date(now.getTime() + 300000),
        attempts: 0,
        isVerified: false,
      },
    });

    const res = await fetch(`${API_BASE}/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: wrongOtp, purpose }),
    });
    const data = await res.json();

    if (res.status === 400 && data.message === 'Invalid verification code. Please try again.') {
      recordTest(
        'TC_DY_010',
        'Incorrect OTP verification rejection',
        'PASS',
        `Incorrect code returns: "${data.message}"`,
        data
      );
    } else {
      recordTest('TC_DY_010', 'Incorrect OTP verification rejection', 'FAIL', 'Unexpected response', data);
    }
  } catch (err) {
    recordTest('TC_DY_010', 'Incorrect OTP verification rejection', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_011: Live Gmail SMTP verification & delivery to authorized recipient
  // --------------------------------------------------------------------------
  try {
    const authorizedRecipient = (process.env.GMAIL_USER || 'shreyay1310@gmail.com').trim();
    console.log(`   [TC_DY_011] Executing real Gmail SMTP dispatch to authorized address: ${authorizedRecipient}...`);

    const smtpCheck = await verifyGmailSmtp();
    if (!smtpCheck.success) {
      throw new Error(`SMTP connection check failed: ${smtpCheck.error}`);
    }

    const liveSend = await sendGmailOtp({
      email: authorizedRecipient,
      otp: '549218',
      purpose: 'registration',
      userName: 'Authorized WatchHub Collector',
    });

    if (liveSend.success && liveSend.messageId && liveSend.provider === 'google_gmail_smtp') {
      recordTest(
        'TC_DY_011',
        'Live Gmail SMTP verification & delivery to authorized recipient',
        'PASS',
        `Actual email delivered via Google Gmail SMTP (MessageId: ${liveSend.messageId}) to ${authorizedRecipient}.`,
        liveSend
      );
    } else {
      recordTest('TC_DY_011', 'Live Gmail SMTP delivery', 'FAIL', 'Delivery failed or provider mismatch', liveSend);
    }
  } catch (err) {
    recordTest('TC_DY_011', 'Live Gmail SMTP delivery', 'FAIL', err.message);
  }

  // --------------------------------------------------------------------------
  // TC_DY_012: Database cleanup of disposable test records
  // --------------------------------------------------------------------------
  try {
    if (createdTestUserId) {
      await prisma.userRole.deleteMany({ where: { userId: createdTestUserId } });
      await prisma.user.delete({ where: { userId: createdTestUserId } });
    }
    await prisma.oTPVerification.deleteMany({
      where: { identifier: { contains: `${testStamp}` } },
    });

    recordTest(
      'TC_DY_012',
      'Database cleanup of disposable test records',
      'PASS',
      'Ephemeral test records purged from SQL Server; baseline integrity preserved.',
      { cleanedUserId: createdTestUserId }
    );
  } catch (err) {
    recordTest('TC_DY_012', 'Database cleanup', 'FAIL', err.message);
  }

  console.log('\n================================================================================');
  console.log('DYNAMIC EMAIL OTP TEST SUMMARY');
  console.log('================================================================================');
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================================\n');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runDynamicOtpSuite().catch((err) => {
  console.error('[Fatal Error in Dynamic OTP Suite]', err);
  process.exit(1);
});
