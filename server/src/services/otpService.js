// WatchHub Enterprise OTP Service (V3 Distributed Architecture)
// Implements:
// 1. Distributed reservation with unique lease tokens and atomic state transitions
// 2. Dedicated HMAC-SHA256 secrets with key rotation and crypto.timingSafeEqual
// 3. 30s dispatch lease, 60s resend cooldown, 5m expiry, max 5 attempts
// 4. External SMTP dispatch strictly outside database transactions
// 5. Atomic single-use OTP consumption preventing concurrent replay
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { sendResendEmailOtp } from './resendService.js';
import { sendGmailOtp } from './googleEmailService.js';
import { sendMsg91Otp } from './msg91Service.js';
import { sendFast2SMS } from './smsService.js';
import { getSmsProvider } from './smsProvider.js';

// Dedicated HMAC secrets (Zero JWT fallback to prevent security coupling)
export const getCurrentOtpSecret = () =>
  process.env.OTP_HASH_SECRET_CURRENT ||
  process.env.OTP_HASH_SECRET ||
  'watchhub_v3_secure_current_otp_hmac_secret_2026_enterprise';

export const getPreviousOtpSecret = () => process.env.OTP_HASH_SECRET_PREVIOUS || null;

// Distributed lease & rate-limit constants
export const DISPATCH_LEASE_MS = 30 * 1000; // 30 seconds reservation lease
export const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds rate limit
export const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes validity
export const MAX_VERIFICATION_ATTEMPTS = 5;

// Fallback in-memory cache when database is unavailable
const MEMORY_OTP_CACHE = new Map();

// Helper to mask email for safe audit logging
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return '***';
  const parts = email.trim().split('@');
  if (parts.length !== 2) return '***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName =
    name.length <= 2 ? `${name[0]}*` : `${name.slice(0, 2)}***${name.slice(-1)}`;
  return `${maskedName}@${domain}`;
};

// 1. Generate cryptographically secure random 6-digit OTP
export const generateSecure6DigitOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// 2. Compute HMAC-SHA256 hash bound to identifier + purpose + otp
export const hashOtp = (otp, identifier, purpose = 'registration', secret = null) => {
  const normalizedId = identifier.toLowerCase().trim();
  const normalizedPurpose = purpose.toLowerCase().trim();
  const normalizedOtp = otp.toString().trim();
  const activeSecret = secret || getCurrentOtpSecret();

  return crypto
    .createHmac('sha256', activeSecret)
    .update(`${normalizedId}:${normalizedPurpose}:${normalizedOtp}`)
    .digest('hex');
};

// 3. Constant-time digest comparison using crypto.timingSafeEqual
export const verifyHashTimingSafe = (computedHash, storedHash) => {
  if (typeof computedHash !== 'string' || typeof storedHash !== 'string') return false;

  const bufA = Buffer.from(computedHash, 'hex');
  const bufB = Buffer.from(storedHash, 'hex');

  // SHA-256 digests must be exactly 32 bytes (64 hex characters)
  if (bufA.length !== 32 || bufB.length !== 32) return false;

  return crypto.timingSafeEqual(bufA, bufB);
};

// Provider Eligibility Helpers
export const isResendEligibleFallback = () => {
  // In strict local mode / development, cloud Resend fallback is explicitly disabled
  if (process.env.STRICT_LOCAL_MODE === 'true' || process.env.NODE_ENV !== 'production') {
    return false;
  }
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const sender = (process.env.EMAIL_FROM || process.env.RESEND_FROM || '').trim();
  if (!apiKey) return false;
  if (sender.toLowerCase().includes('@gmail.com')) return false;
  return true;
};

const isGmailSmtpConfigured = () => {
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD || '').trim();
  return Boolean(user && pass);
};

/**
 * 4. Acquire Atomic Dispatch Reservation in SQL Server
 * Ensures only one node/process holds the reservation lease.
 */
export const acquireReservation = async ({
  identifier,
  purpose,
  channel,
  otpHash,
  expiresAt,
  resendCooldownUntil,
  dispatchToken,
  dispatchLockedUntil,
}) => {
  const now = new Date();
  const cleanId = identifier.toLowerCase().trim();
  const cleanPurpose = purpose.toLowerCase().trim();

  // Check existing reservation
  const existing = await prisma.oTPVerification.findUnique({
    where: { identifier_purpose: { identifier: cleanId, purpose: cleanPurpose } },
  });

  if (existing) {
    // Condition A: Active lease currently held by another process
    if (
      existing.dispatchState === 'RESERVED' &&
      existing.dispatchLockedUntil &&
      new Date(existing.dispatchLockedUntil) > now
    ) {
      const remainingSeconds = Math.ceil((new Date(existing.dispatchLockedUntil).getTime() - now.getTime()) / 1000);
      return {
        acquired: false,
        inFlight: true,
        remainingSeconds,
        message: 'A verification dispatch is already in progress for this address. Please wait a moment.',
      };
    }

    // Condition B: Active cooldown currently enforced
    if (
      existing.dispatchState === 'ACTIVE' &&
      existing.resendCooldownUntil &&
      new Date(existing.resendCooldownUntil) > now
    ) {
      const waitSeconds = Math.ceil((new Date(existing.resendCooldownUntil).getTime() - now.getTime()) / 1000);
      return {
        acquired: false,
        cooldown: true,
        waitSeconds,
        message: `Please wait ${waitSeconds} seconds before requesting a new verification code.`,
      };
    }

    // Condition C: Lease expired, cooldown expired, or failed -> Takeover ownership atomically
    const rowsAffected = await prisma.$executeRawUnsafe(`
      UPDATE OTPVerifications
      SET DispatchToken = '${dispatchToken}',
          DispatchState = 'RESERVED',
          DispatchLockedUntil = '${dispatchLockedUntil.toISOString()}',
          OtpHash = '${otpHash}',
          Channel = '${channel}',
          Attempts = 0,
          IsVerified = 0,
          ExpiresAt = '${expiresAt.toISOString()}',
          ResendCooldownUntil = '${resendCooldownUntil.toISOString()}'
      WHERE Identifier = '${cleanId}'
        AND Purpose = '${cleanPurpose}'
        AND (
          DispatchLockedUntil <= '${now.toISOString()}'
          OR DispatchLockedUntil IS NULL
          OR (DispatchState = 'ACTIVE' AND ResendCooldownUntil <= '${now.toISOString()}')
          OR DispatchState = 'FAILED'
        );
    `);

    if (rowsAffected === 0) {
      return {
        acquired: false,
        inFlight: true,
        message: 'A concurrent dispatch reservation was acquired by another instance. Please wait a moment.',
      };
    }

    return { acquired: true, dispatchToken };
  }

  // Record does not exist -> Insert new reservation
  try {
    await prisma.oTPVerification.create({
      data: {
        identifier: cleanId,
        purpose: cleanPurpose,
        channel,
        otpHash,
        dispatchToken,
        dispatchState: 'RESERVED',
        dispatchLockedUntil,
        resendCooldownUntil,
        expiresAt,
        attempts: 0,
        isVerified: false,
      },
    });
    return { acquired: true, dispatchToken };
  } catch (insertErr) {
    // Unique constraint race condition -> re-evaluate
    return {
      acquired: false,
      inFlight: true,
      message: 'Concurrent reservation detected. Please try again.',
    };
  }
};

/**
 * 5. Request & Send OTP (High-concurrency distributed implementation)
 */
export const requestAndSendOtp = async ({
  identifier,
  channel = 'email',
  purpose = 'registration',
  userName = 'Valued Collector',
}) => {
  const cleanId = identifier.toLowerCase().trim();
  const cleanPurpose = purpose.toLowerCase().trim();
  const lockKey = `${cleanId}:${cleanPurpose}`;
  const now = new Date();

  const otp = generateSecure6DigitOtp();
  const otpHash = hashOtp(otp, cleanId, cleanPurpose, getCurrentOtpSecret());
  const dispatchToken = crypto.randomUUID();
  const dispatchLockedUntil = new Date(Date.now() + DISPATCH_LEASE_MS);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
  const resendCooldownUntil = new Date(Date.now() + RESEND_COOLDOWN_MS);

  let reservationAcquired = false;

  // Step 5A: Acquire distributed database reservation
  try {
    const reservation = await acquireReservation({
      identifier: cleanId,
      purpose: cleanPurpose,
      channel,
      otpHash,
      expiresAt,
      resendCooldownUntil,
      dispatchToken,
      dispatchLockedUntil,
    });

    if (!reservation.acquired) {
      return {
        success: false,
        cooldown: reservation.cooldown || false,
        inFlight: reservation.inFlight || false,
        waitSeconds: reservation.waitSeconds,
        message: reservation.message,
      };
    }
    reservationAcquired = true;
    console.info(`[OTP-FLOW] Reservation lease acquired: { identifier: '${maskEmail(cleanId)}', purpose: '${cleanPurpose}', channel: '${channel}', token: '${dispatchToken.slice(0, 8)}...' }`);
  } catch (dbErr) {
    // Fallback: In-memory reservation if database is unreachable
    console.warn(`[OTP Service] Database reservation failed for ${maskEmail(cleanId)}. Using in-memory fallback.`);
    const mem = MEMORY_OTP_CACHE.get(lockKey);
    if (mem && mem.resendCooldownUntil && mem.resendCooldownUntil > now) {
      const waitSeconds = Math.ceil((mem.resendCooldownUntil.getTime() - now.getTime()) / 1000);
      return {
        success: false,
        cooldown: true,
        waitSeconds,
        message: `Please wait ${waitSeconds} seconds before requesting a new verification code.`,
      };
    }
    MEMORY_OTP_CACHE.set(lockKey, {
      dispatchToken,
      dispatchState: 'RESERVED',
      dispatchLockedUntil,
      resendCooldownUntil,
      expiresAt,
      otpHash,
      channel,
      purpose: cleanPurpose,
      attempts: 0,
      isVerified: false,
    });
    reservationAcquired = true;
  }

  // Step 5B: Dispatch OTP via external provider OUTSIDE database transaction
  let dispatchResult = null;

  try {
    if (channel === 'mobile' || channel === 'sms' || channel === 'phone') {
      const smsProvider = getSmsProvider();
      dispatchResult = await smsProvider.sendOtp({
        mobile: cleanId,
        otp,
        purpose: cleanPurpose,
      });
    } else {
      const hasGmail = isGmailSmtpConfigured();
      const hasResendFallback = isResendEligibleFallback();
      const chosenProvider = hasGmail ? 'Gmail SMTP' : (hasResendFallback ? 'Resend' : 'None');
      console.info(`[OTP-FLOW] Dispatch provider: { channel: '${channel}', provider: '${chosenProvider}', recipient: '${maskEmail(cleanId)}' }`);

      if (hasGmail) {
        dispatchResult = await sendGmailOtp({
          email: cleanId,
          otp,
          purpose: cleanPurpose,
          userName,
        });

        if (!dispatchResult?.success && hasResendFallback) {
          console.warn(`[OTP Dispatch] Gmail SMTP failed for ${maskEmail(cleanId)}. Engaging Resend fallback...`);
          dispatchResult = await sendResendEmailOtp({
            email: cleanId,
            otp,
            purpose: cleanPurpose,
            userName,
          });
        }
      } else if (hasResendFallback) {
        dispatchResult = await sendResendEmailOtp({
          email: cleanId,
          otp,
          purpose: cleanPurpose,
          userName,
        });
      } else {
        dispatchResult = {
          success: false,
          error: 'NO_VALID_EMAIL_PROVIDER',
          message: 'No valid email delivery provider is configured. Please configure Gmail SMTP.',
        };
      }
    }
  } catch (providerError) {
    dispatchResult = {
      success: false,
      error: 'PROVIDER_EXCEPTION',
      message: providerError.message || 'Error occurred while contacting email provider.',
    };
  }

  // Step 5C: Guarded state transition based on dispatch outcome and token ownership
  if (!dispatchResult || dispatchResult.success === false) {
    console.warn(`[OTP-FLOW] Dispatch outcome: { success: false, recipient: '${maskEmail(cleanId)}', error: '${dispatchResult?.error || 'UNKNOWN'}' }`);
    console.warn(`[OTP Dispatch] Delivery failed for ${maskEmail(cleanId)}: ${dispatchResult?.error || 'Unknown error'}. Safe rollback.`);

    try {
      // Mark as FAILED and clear cooldown only if we still own this reservation
      await prisma.$executeRawUnsafe(`
        UPDATE OTPVerifications
        SET DispatchState = 'FAILED',
            ResendCooldownUntil = '${now.toISOString()}'
        WHERE Identifier = '${cleanId}'
          AND Purpose = '${cleanPurpose}'
          AND DispatchToken = '${dispatchToken}';
      `);
    } catch {
      const mem = MEMORY_OTP_CACHE.get(lockKey);
      if (mem && mem.dispatchToken === dispatchToken) {
        MEMORY_OTP_CACHE.delete(lockKey);
      }
    }

    return {
      success: false,
      error: 'EMAIL_DISPATCH_FAILED',
      message: dispatchResult?.error || dispatchResult?.message || 'Failed to dispatch verification email. Please check your address and try again.',
    };
  }

  console.info(`[OTP-FLOW] Dispatch outcome: { success: true, recipient: '${maskEmail(cleanId)}', provider: '${dispatchResult?.provider || 'Gmail SMTP'}', messageId: '${dispatchResult?.messageId || 'N/A'}' }`);

  // Step 5D: Successful dispatch -> Transition to ACTIVE guarded by dispatchToken
  let activated = false;
  try {
    const rowsAffected = await prisma.$executeRawUnsafe(`
      UPDATE OTPVerifications
      SET DispatchState = 'ACTIVE'
      WHERE Identifier = '${cleanId}'
        AND Purpose = '${cleanPurpose}'
        AND DispatchToken = '${dispatchToken}';
    `);

    if (rowsAffected > 0) {
      activated = true;
      console.info(`[OTP-FLOW] State transition to ACTIVE: { identifier: '${maskEmail(cleanId)}', purpose: '${cleanPurpose}', channel: '${channel}' }`);
    } else {
      console.warn(`[OTP Dispatch] Lease expired during dispatch for ${maskEmail(cleanId)}. Reservation was superseded by a newer process.`);
      return {
        success: false,
        error: 'DISPATCH_LEASE_EXPIRED',
        message: 'Verification dispatch expired before activation. Please request a new code.',
      };
    }
  } catch {
    const mem = MEMORY_OTP_CACHE.get(lockKey);
    if (mem && mem.dispatchToken === dispatchToken) {
      mem.dispatchState = 'ACTIVE';
      activated = true;
    }
  }

  return {
    success: true,
    identifier: cleanId,
    channel,
    purpose: cleanPurpose,
    expiresInSeconds: Math.floor(OTP_EXPIRY_MS / 1000),
    cooldownSeconds: Math.floor(RESEND_COOLDOWN_MS / 1000),
    messageId: dispatchResult?.messageId,
    simulated: dispatchResult?.simulated ?? false,
    provider: dispatchResult?.provider || (channel === 'mobile' ? 'DevelopmentMockSMSProvider' : 'Gmail SMTP'),
  };
};

/**
 * 6. Verify OTP with Atomic Single-Use Consumption and Timing-Safe Hash Check
 */
export const verifyOtp = async ({
  identifier,
  otp,
  purpose = 'registration',
}) => {
  if (!identifier || !otp) {
    return { success: false, message: 'Identifier and OTP code are required.' };
  }

  const cleanId = identifier.toLowerCase().trim();
  const cleanPurpose = purpose.toLowerCase().trim();
  const cleanOtp = otp.toString().trim();
  const lockKey = `${cleanId}:${cleanPurpose}`;
  const now = new Date();
  console.info(`[OTP-FLOW] Verification attempt: { identifier: '${maskEmail(cleanId)}', purpose: '${cleanPurpose}' }`);

  // Compute expected digests (Current secret + Optional previous key rotation)
  const currentSecret = getCurrentOtpSecret();
  const previousSecret = getPreviousOtpSecret();
  const currentDigest = hashOtp(cleanOtp, cleanId, cleanPurpose, currentSecret);
  const previousDigest = previousSecret
    ? hashOtp(cleanOtp, cleanId, cleanPurpose, previousSecret)
    : null;

  // Retrieve existing record
  let record = null;
  let isFromMemory = false;

  try {
    record = await prisma.oTPVerification.findUnique({
      where: { identifier_purpose: { identifier: cleanId, purpose: cleanPurpose } },
    });
  } catch {
    record = MEMORY_OTP_CACHE.get(lockKey);
    isFromMemory = true;
  }

  if (!record) {
    record = MEMORY_OTP_CACHE.get(lockKey);
    isFromMemory = true;
  }

  if (!record || record.dispatchState !== 'ACTIVE') {
    return {
      success: false,
      message: 'No active verification code found for this account. Please request a new code.',
    };
  }

  // Rule 6A: Check Expiration
  if (new Date(record.expiresAt) <= now) {
    try {
      await prisma.oTPVerification.delete({
        where: { identifier_purpose: { identifier: cleanId, purpose: cleanPurpose } },
      }).catch(() => {});
    } catch {}
    MEMORY_OTP_CACHE.delete(lockKey);

    return {
      success: false,
      expired: true,
      message: 'This verification code has expired. Please request a new one.',
    };
  }

  // Rule 6B: Maximum 5 Attempts Brute Force Protection
  if ((record.attempts || 0) >= MAX_VERIFICATION_ATTEMPTS) {
    try {
      await prisma.oTPVerification.delete({
        where: { identifier_purpose: { identifier: cleanId, purpose: cleanPurpose } },
      }).catch(() => {});
    } catch {}
    MEMORY_OTP_CACHE.delete(lockKey);

    return {
      success: false,
      locked: true,
      message: 'Maximum verification attempts exceeded (5/5). This code has been invalidated for security.',
    };
  }

  // Rule 6C: Check digest validity using timing-safe comparison
  const matchesCurrent = verifyHashTimingSafe(currentDigest, record.otpHash);
  const matchesPrevious = previousDigest ? verifyHashTimingSafe(previousDigest, record.otpHash) : false;

  if (!matchesCurrent && !matchesPrevious) {
    const nextAttempts = (record.attempts || 0) + 1;
    const remaining = MAX_VERIFICATION_ATTEMPTS - nextAttempts;

    if (!isFromMemory) {
      if (remaining <= 0) {
        await prisma.oTPVerification.delete({
          where: { identifier_purpose: { identifier: cleanId, purpose: cleanPurpose } },
        }).catch(() => {});
      } else {
        await prisma.oTPVerification.update({
          where: { identifier_purpose: { identifier: cleanId, purpose: cleanPurpose } },
          data: { attempts: nextAttempts },
        }).catch(() => {});
      }
    } else {
      if (remaining <= 0) {
        MEMORY_OTP_CACHE.delete(lockKey);
      } else {
        record.attempts = nextAttempts;
        MEMORY_OTP_CACHE.set(lockKey, record);
      }
    }

    if (remaining <= 0) {
      return {
        success: false,
        locked: true,
        message: 'Maximum verification attempts exceeded. Code invalidated.',
      };
    }

    return {
      success: false,
      message: `Invalid verification code. You have ${remaining} attempt(s) remaining.`,
      remainingAttempts: remaining,
    };
  }

  // Rule 6D: Atomic Single-Use Invalidation & Consumption
  // Guarantees only one concurrent verification request succeeds
  if (!isFromMemory) {
    const matchedHash = matchesCurrent ? currentDigest : (previousDigest || currentDigest);
    const rowsAffected = await prisma.$executeRawUnsafe(`
      UPDATE OTPVerifications
      SET IsVerified = 1,
          DispatchState = 'FAILED'
      WHERE Identifier = '${cleanId}'
        AND Purpose = '${cleanPurpose}'
        AND DispatchState = 'ACTIVE'
        AND IsVerified = 0
        AND ExpiresAt > '${now.toISOString()}'
        AND Attempts < ${MAX_VERIFICATION_ATTEMPTS}
        AND OtpHash = '${matchedHash}';
    `);

    if (rowsAffected === 0) {
      return {
        success: false,
        message: 'This verification code was already consumed or has expired.',
      };
    }

    // Permanently remove the consumed record
    await prisma.oTPVerification.delete({
      where: { identifier_purpose: { identifier: cleanId, purpose: cleanPurpose } },
    }).catch(() => {});
  } else {
    MEMORY_OTP_CACHE.delete(lockKey);
  }

  console.info(`[OTP-FLOW] Verification successful: { identifier: '${maskEmail(cleanId)}', purpose: '${cleanPurpose}', consumed: true }`);

  return {
    success: true,
    verified: true,
    identifier: cleanId,
    purpose: cleanPurpose,
    message: 'OTP verified successfully.',
  };
};

export default {
  DISPATCH_LEASE_MS,
  RESEND_COOLDOWN_MS,
  OTP_EXPIRY_MS,
  MAX_VERIFICATION_ATTEMPTS,
  generateSecure6DigitOtp,
  hashOtp,
  verifyHashTimingSafe,
  acquireReservation,
  requestAndSendOtp,
  verifyOtp,
};
