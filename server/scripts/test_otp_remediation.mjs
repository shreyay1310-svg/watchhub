import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { verifyGmailSmtp } from '../src/services/googleEmailService.js';
import { requestAndSendOtp, verifyOtp } from '../src/services/otpService.js';

async function runTests() {
  console.log('====================================================');
  console.log('WATCHHUB — EMAIL OTP REMEDIATION VERIFICATION SUITE');
  console.log('====================================================\n');

  // TEST 1: Gmail SMTP Connection Verification
  console.log('[TEST 1] Verifying Gmail SMTP Transporter connection...');
  const smtpCheck = await verifyGmailSmtp();
  console.log(`SMTP Check Result: ${smtpCheck ? 'PASS' : 'FAIL'}\n`);

  if (!smtpCheck) {
    console.error('Cannot proceed: Gmail SMTP verification failed.');
    process.exit(1);
  }

  // TEST 2: Live Dispatch via Gmail SMTP
  const testEmail = process.env.GMAIL_USER || 'shreyay1310@gmail.com';
  console.log(`[TEST 2] Testing live OTP dispatch to verified address: ${testEmail.slice(0, 3)}***@gmail.com...`);
  const dispatchResult = await requestAndSendOtp({
    identifier: testEmail,
    channel: 'email',
    purpose: 'verification_test',
    userName: 'WatchHub Tester',
  });

  console.log('Dispatch Response:', {
    success: dispatchResult.success,
    channel: dispatchResult.channel,
    purpose: dispatchResult.purpose,
    messageId: dispatchResult.messageId || 'NONE',
    cooldownSeconds: dispatchResult.cooldownSeconds,
  });

  if (!dispatchResult.success || !dispatchResult.messageId) {
    console.error('Live dispatch failed:', dispatchResult);
    process.exit(1);
  }
  console.log('[TEST 2 PASS] Successfully dispatched live email via Gmail SMTP!\n');

  // TEST 3: Cooldown enforcement after successful dispatch
  console.log('[TEST 3] Testing cooldown enforcement immediately after successful dispatch...');
  const cooldownResult = await requestAndSendOtp({
    identifier: testEmail,
    channel: 'email',
    purpose: 'verification_test',
  });

  console.log('Cooldown Response:', {
    success: cooldownResult.success,
    cooldown: cooldownResult.cooldown,
    waitSeconds: cooldownResult.waitSeconds,
    message: cooldownResult.message,
  });

  if (!cooldownResult.cooldown || cooldownResult.success) {
    console.error('Cooldown was not enforced after successful dispatch!');
    process.exit(1);
  }
  console.log('[TEST 3 PASS] Cooldown correctly enforced (429 rate limit).\n');

  // TEST 4: Failure Rollback & Immediate Retry Test
  console.log('[TEST 4] Testing Failure Rollback on invalid recipient / dispatch failure...');
  // Trigger failure by requesting to an impossible address that will fail SMTP or validation
  const invalidEmail = 'invalid_recipient_address_no_domain';
  const failedDispatch = await requestAndSendOtp({
    identifier: invalidEmail,
    channel: 'email',
    purpose: 'rollback_test',
  });

  console.log('Failed Dispatch Response:', {
    success: failedDispatch.success,
    error: failedDispatch.error,
    message: failedDispatch.message,
  });

  if (failedDispatch.success || failedDispatch.error !== 'EMAIL_DISPATCH_FAILED') {
    console.error('Failed dispatch did not return EMAIL_DISPATCH_FAILED!');
    process.exit(1);
  }

  // Verify immediate retry is allowed without cooldown lockout
  console.log('Verifying immediate retry without 60s lockout...');
  const retryDispatch = await requestAndSendOtp({
    identifier: invalidEmail,
    channel: 'email',
    purpose: 'rollback_test',
  });

  console.log('Retry Attempt Response:', {
    success: retryDispatch.success,
    cooldown: retryDispatch.cooldown,
    error: retryDispatch.error,
  });

  if (retryDispatch.cooldown) {
    console.error('Failure rollback failed: Cooldown was consumed on failed dispatch!');
    process.exit(1);
  }
  console.log('[TEST 4 PASS] Failure rollback verified: No cooldown consumed, immediate retry permitted!\n');

  console.log('====================================================');
  console.log('ALL OTP REMEDIATION VERIFICATION TESTS PASSED');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
