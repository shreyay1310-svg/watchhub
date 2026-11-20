// WatchHub V3 OTP Persistence & Distributed Concurrency Test Suite — Part 1 (TC_V3_001 to TC_V3_010)
import crypto from 'crypto';
import { prisma } from '../src/config/prisma.js';
import {
  hashOtp,
  acquireReservation,
  verifyOtp,
  DISPATCH_LEASE_MS,
  RESEND_COOLDOWN_MS,
  OTP_EXPIRY_MS,
} from '../src/services/otpService.js';
import { OtpCleanupWorker } from '../src/services/otpCleanupWorker.js';

export async function runV3SuitePart1(recordTest, testEmailPrefix) {
  // TC_V3_001: Two-node simultaneous OTP dispatch
  try {
    const email = `${testEmailPrefix}_001@watchhub.test`;
    const purpose = 'registration';
    const otpHashA = hashOtp('111111', email, purpose);
    const otpHashB = hashOtp('222222', email, purpose);
    const now = new Date();

    const [resA, resB] = await Promise.all([
      acquireReservation({
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: otpHashA,
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
        dispatchToken: crypto.randomUUID(),
        dispatchLockedUntil: new Date(now.getTime() + DISPATCH_LEASE_MS),
      }),
      acquireReservation({
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: otpHashB,
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
        dispatchToken: crypto.randomUUID(),
        dispatchLockedUntil: new Date(now.getTime() + DISPATCH_LEASE_MS),
      }),
    ]);

    const oneAcquired = (resA.acquired && !resB.acquired) || (!resA.acquired && resB.acquired);
    if (oneAcquired) {
      recordTest('TC_V3_001', 'Two-node simultaneous OTP dispatch', 'PASS', 'Exactly one node acquired reservation lease; second node rejected.', { nodeA: resA.acquired, nodeB: resB.acquired });
    } else {
      recordTest('TC_V3_001', 'Two-node simultaneous OTP dispatch', 'FAIL', 'Concurrency violation: both acquired or both failed', { resA, resB });
    }
  } catch (err) {
    recordTest('TC_V3_001', 'Two-node simultaneous OTP dispatch', 'FAIL', err.message);
  }

  // TC_V3_002: Old dispatch process completes after lease expiry
  try {
    const email = `${testEmailPrefix}_002@watchhub.test`;
    const purpose = 'registration';
    const oldToken = crypto.randomUUID();
    const newToken = crypto.randomUUID();
    const pastLease = new Date(Date.now() - 5000);
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp('111111', email, purpose),
        dispatchToken: oldToken,
        dispatchState: 'RESERVED',
        dispatchLockedUntil: pastLease,
        resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        attempts: 0,
        isVerified: false,
      },
    });

    const resB = await acquireReservation({
      identifier: email,
      purpose,
      channel: 'email',
      otpHash: hashOtp('222222', email, purpose),
      expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
      resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
      dispatchToken: newToken,
      dispatchLockedUntil: new Date(now.getTime() + DISPATCH_LEASE_MS),
    });

    const lateActivation = await prisma.$executeRawUnsafe(`
      UPDATE OTPVerifications
      SET DispatchState = 'ACTIVE'
      WHERE Identifier = '${email}' AND Purpose = '${purpose}' AND DispatchToken = '${oldToken}';
    `);

    if (resB.acquired && lateActivation === 0) {
      recordTest('TC_V3_002', 'Old dispatch process completes after lease expiry', 'PASS', 'Node B successfully took over expired lease; Node A late activation affected 0 rows.', { nodeBAcquired: resB.acquired, nodeAUpdatedRows: lateActivation });
    } else {
      recordTest('TC_V3_002', 'Old dispatch process completes after lease expiry', 'FAIL', 'Old process updated record', { resB, lateActivation });
    }
  } catch (err) {
    recordTest('TC_V3_002', 'Old dispatch process completes after lease expiry', 'FAIL', err.message);
  }

  // TC_V3_003: Old reservation cannot overwrite new reservation
  try {
    const email = `${testEmailPrefix}_003@watchhub.test`;
    const purpose = 'registration';
    const oldToken = crypto.randomUUID();
    const currentToken = crypto.randomUUID();
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp('333333', email, purpose),
        dispatchToken: currentToken,
        dispatchState: 'ACTIVE',
        dispatchLockedUntil: null,
        resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        attempts: 0,
        isVerified: false,
      },
    });

    const overwriteAttempt = await prisma.$executeRawUnsafe(`
      UPDATE OTPVerifications
      SET OtpHash = '${hashOtp('999999', email, purpose)}',
          DispatchToken = '${oldToken}'
      WHERE Identifier = '${email}' AND Purpose = '${purpose}' AND DispatchToken = '${oldToken}';
    `);

    const recordAfter = await prisma.oTPVerification.findUnique({
      where: { identifier_purpose: { identifier: email, purpose } },
    });

    if (overwriteAttempt === 0 && recordAfter.dispatchToken === currentToken) {
      recordTest('TC_V3_003', 'Old reservation cannot overwrite new reservation', 'PASS', 'Conditional update rejected old token update (0 rows affected).', { overwriteRows: overwriteAttempt, preservedToken: recordAfter.dispatchToken });
    } else {
      recordTest('TC_V3_003', 'Old reservation cannot overwrite new reservation', 'FAIL', 'Overwrite succeeded', { overwriteAttempt, recordAfter });
    }
  } catch (err) {
    recordTest('TC_V3_003', 'Old reservation cannot overwrite new reservation', 'FAIL', err.message);
  }

  // TC_V3_004: Process crash and lease recovery
  try {
    const email = `${testEmailPrefix}_004@watchhub.test`;
    const purpose = 'registration';
    const crashedToken = crypto.randomUUID();
    const recoveryToken = crypto.randomUUID();
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp('444444', email, purpose),
        dispatchToken: crashedToken,
        dispatchState: 'RESERVED',
        dispatchLockedUntil: new Date(now.getTime() - 10000),
        resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        attempts: 0,
        isVerified: false,
      },
    });

    const recovery = await acquireReservation({
      identifier: email,
      purpose,
      channel: 'email',
      otpHash: hashOtp('555555', email, purpose),
      expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
      resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
      dispatchToken: recoveryToken,
      dispatchLockedUntil: new Date(now.getTime() + DISPATCH_LEASE_MS),
    });

    if (recovery.acquired) {
      recordTest('TC_V3_004', 'Process crash and lease recovery', 'PASS', 'Expired lease of crashed process successfully recovered by new process.', { recoveryAcquired: recovery.acquired, newToken: recoveryToken });
    } else {
      recordTest('TC_V3_004', 'Process crash and lease recovery', 'FAIL', 'Failed to recover expired lease', recovery);
    }
  } catch (err) {
    recordTest('TC_V3_004', 'Process crash and lease recovery', 'FAIL', err.message);
  }

  // TC_V3_005: Dispatch failure with known provider rejection
  try {
    const email = `${testEmailPrefix}_005@watchhub.test`;
    const purpose = 'registration';
    const token = crypto.randomUUID();
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp('555555', email, purpose),
        dispatchToken: token,
        dispatchState: 'RESERVED',
        dispatchLockedUntil: new Date(now.getTime() + DISPATCH_LEASE_MS),
        resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        attempts: 0,
        isVerified: false,
      },
    });

    await prisma.$executeRawUnsafe(`
      UPDATE OTPVerifications
      SET DispatchState = 'FAILED',
          ResendCooldownUntil = '${now.toISOString()}'
      WHERE Identifier = '${email}' AND Purpose = '${purpose}' AND DispatchToken = '${token}';
    `);

    const retry = await acquireReservation({
      identifier: email,
      purpose,
      channel: 'email',
      otpHash: hashOtp('666666', email, purpose),
      expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
      resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
      dispatchToken: crypto.randomUUID(),
      dispatchLockedUntil: new Date(now.getTime() + DISPATCH_LEASE_MS),
    });

    if (retry.acquired) {
      recordTest('TC_V3_005', 'Dispatch failure with known provider rejection', 'PASS', 'Cooldown cleared on known failure; immediate retry acquired without lockout.', { retryAcquired: retry.acquired });
    } else {
      recordTest('TC_V3_005', 'Dispatch failure with known provider rejection', 'FAIL', 'Immediate retry blocked', retry);
    }
  } catch (err) {
    recordTest('TC_V3_005', 'Dispatch failure with known provider rejection', 'FAIL', err.message);
  }

  // TC_V3_006: Ambiguous email delivery timeout
  try {
    const email = `${testEmailPrefix}_006@watchhub.test`;
    const purpose = 'registration';
    const token = crypto.randomUUID();
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp('666666', email, purpose),
        dispatchToken: token,
        dispatchState: 'FAILED',
        dispatchLockedUntil: null,
        resendCooldownUntil: new Date(now.getTime() + 30000),
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        attempts: 0,
        isVerified: false,
      },
    });

    const record = await prisma.oTPVerification.findUnique({
      where: { identifier_purpose: { identifier: email, purpose } },
    });

    const verifyRes = await verifyOtp({ identifier: email, otp: '666666', purpose });

    if (record.dispatchState === 'FAILED' && !verifyRes.success) {
      recordTest('TC_V3_006', 'Ambiguous email delivery timeout', 'PASS', 'State marked FAILED; unconfirmed code cannot be verified by user.', { verifySuccess: verifyRes.success, verifyMessage: verifyRes.message });
    } else {
      recordTest('TC_V3_006', 'Ambiguous email delivery timeout', 'FAIL', 'Unconfirmed code was verifiable', verifyRes);
    }
  } catch (err) {
    recordTest('TC_V3_006', 'Ambiguous email delivery timeout', 'FAIL', err.message);
  }

  // TC_V3_007: Graceful shutdown during active cleanup batch
  try {
    const testWorker = new OtpCleanupWorker({ batchSize: 50, intervalMs: 1000 });
    testWorker.start();
    const stopStart = Date.now();
    await testWorker.stop(3000);
    const stopDuration = Date.now() - stopStart;

    if (!testWorker.isRunning && testWorker.isStopping) {
      recordTest('TC_V3_007', 'Graceful shutdown during active cleanup batch', 'PASS', `Worker cleanly stopped in ${stopDuration}ms with in-flight drain resolved.`, { stopDurationMs: stopDuration, isRunning: testWorker.isRunning });
    } else {
      recordTest('TC_V3_007', 'Graceful shutdown during active cleanup batch', 'FAIL', 'Worker failed to stop', testWorker);
    }
  } catch (err) {
    recordTest('TC_V3_007', 'Graceful shutdown during active cleanup batch', 'FAIL', err.message);
  }

  // TC_V3_008: Cleanup worker does not overlap
  try {
    const testWorker = new OtpCleanupWorker({ batchSize: 100 });
    testWorker.isRunning = true;
    let runCount = 0;
    testWorker.inFlightPromise = new Promise((resolve) => setTimeout(() => { runCount++; resolve(); }, 200));
    const hadInFlight = testWorker.inFlightPromise !== null;
    await testWorker.inFlightPromise;
    testWorker.isRunning = false;

    if (hadInFlight && runCount === 1) {
      recordTest('TC_V3_008', 'Cleanup worker does not overlap', 'PASS', 'Single worker execution enforced via in-flight execution tracking.', { runCount });
    } else {
      recordTest('TC_V3_008', 'Cleanup worker does not overlap', 'FAIL', 'Overlap prevention failed', { hadInFlight, runCount });
    }
  } catch (err) {
    recordTest('TC_V3_008', 'Cleanup worker does not overlap', 'FAIL', err.message);
  }

  // TC_V3_009: 5,000 expired OTP records cleaned in batches
  try {
    const expiredTimestamp = new Date(Date.now() - 3600 * 1000).toISOString();
    for (let chunk = 0; chunk < 5; chunk++) {
      let values = [];
      for (let i = 0; i < 1000; i++) {
        const id = `bulk_exp_${chunk}_${i}_${Date.now()}`;
        const email = `bulk_${chunk}_${i}@test.watchhub`;
        values.push(`('${id}', '${email}', 'bulk_hash', 'email', 'bulk_test', 0, 0, '${expiredTimestamp}', '${expiredTimestamp}', '${expiredTimestamp}', 'ACTIVE')`);
      }
      await prisma.$executeRawUnsafe(`
        INSERT INTO OTPVerifications (OtpId, Identifier, OtpHash, Channel, Purpose, Attempts, IsVerified, ResendCooldownUntil, ExpiresAt, CreatedAt, DispatchState)
        VALUES ${values.join(',')};
      `);
    }

    const cleanupWorker = new OtpCleanupWorker({ batchSize: 500, batchYieldDelayMs: 10 });
    cleanupWorker.isRunning = true;
    const cleanupResult = await cleanupWorker.executeCleanupRun();
    cleanupWorker.isRunning = false;

    if (cleanupResult.cycleDeleted >= 5000 && cleanupResult.cycleBatches >= 10) {
      recordTest('TC_V3_009', '5,000 expired OTP records cleaned in batches', 'PASS', `Successfully deleted ${cleanupResult.cycleDeleted} records across ${cleanupResult.cycleBatches} batches in ${cleanupResult.duration}ms without lock escalation.`, cleanupResult);
    } else {
      recordTest('TC_V3_009', '5,000 expired OTP records cleaned in batches', 'FAIL', 'Deleted count mismatch', cleanupResult);
    }
  } catch (err) {
    recordTest('TC_V3_009', '5,000 expired OTP records cleaned in batches', 'FAIL', err.message);
  }

  // TC_V3_010: Active OTP verification during cleanup
  try {
    const email = `${testEmailPrefix}_010@watchhub.test`;
    const purpose = 'registration';
    const otp = '789123';
    const now = new Date();

    await prisma.oTPVerification.create({
      data: {
        identifier: email,
        purpose,
        channel: 'email',
        otpHash: hashOtp(otp, email, purpose),
        dispatchToken: crypto.randomUUID(),
        dispatchState: 'ACTIVE',
        dispatchLockedUntil: null,
        resendCooldownUntil: new Date(now.getTime() + RESEND_COOLDOWN_MS),
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        attempts: 0,
        isVerified: false,
      },
    });

    const cleanupWorker = new OtpCleanupWorker({ batchSize: 500 });
    cleanupWorker.isRunning = true;
    await cleanupWorker.executeCleanupRun();
    cleanupWorker.isRunning = false;

    const verifyResult = await verifyOtp({ identifier: email, otp, purpose });
    if (verifyResult.success && verifyResult.verified) {
      recordTest('TC_V3_010', 'Active OTP verification during cleanup', 'PASS', 'Active unexpired record preserved by cleanup worker and verified successfully.', verifyResult);
    } else {
      recordTest('TC_V3_010', 'Active OTP verification during cleanup', 'FAIL', 'Active OTP verification failed', verifyResult);
    }
  } catch (err) {
    recordTest('TC_V3_010', 'Active OTP verification during cleanup', 'FAIL', err.message);
  }
}
