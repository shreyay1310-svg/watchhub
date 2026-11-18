// Cryptographically Secure OTP Service for WatchHub
// Implements HMAC-SHA256 hashing, 5-minute expiry, max 5 attempts, 60s cooldown, and Resend delivery
import crypto from 'crypto';
import { OtpVerification } from '../models/OtpVerification.js';
import { sendResendEmailOtp } from './resendService.js';
import { sendMsg91Otp } from './msg91Service.js';

// Secret salt for HMAC hashing of OTP
const OTP_HASH_SECRET = process.env.OTP_HASH_SECRET || process.env.JWT_ACCESS_SECRET || 'watchhub_sha256_hmac_secret_otp_encryption_key_2026';

// In-memory fallback cache when MongoDB is in offline mode
const MEMORY_OTP_CACHE = new Map();

// 1. Generate cryptographically secure random 6-digit OTP
export const generateSecure6DigitOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// 2. Compute HMAC-SHA256 hash of the OTP bound to the recipient identifier
export const hashOtp = (otp, identifier) => {
  return crypto
    .createHmac('sha256', OTP_HASH_SECRET)
    .update(`${identifier.toLowerCase().trim()}:${otp.toString().trim()}`)
    .digest('hex');
};

// 3. Request & Send OTP (Primary: Email via Resend; Secondary: SMS)
export const requestAndSendOtp = async ({
  identifier,
  channel = 'email',
  purpose = 'registration',
  userName = 'Valued Collector',
}) => {
  const cleanId = identifier.toLowerCase().trim();
  const now = new Date();

  // 1. Check Resend Cooldown (60-second rate-limiting rule)
  try {
    const existing = await OtpVerification.findOne({ identifier: cleanId, purpose });
    if (existing && existing.resendCooldownUntil && existing.resendCooldownUntil > now) {
      const waitSeconds = Math.ceil((existing.resendCooldownUntil.getTime() - now.getTime()) / 1000);
      return {
        success: false,
        cooldown: true,
        waitSeconds,
        message: `Please wait ${waitSeconds} seconds before requesting a new verification code.`,
      };
    }
  } catch {
    const mem = MEMORY_OTP_CACHE.get(`${cleanId}:${purpose}`);
    if (mem && mem.resendCooldownUntil && mem.resendCooldownUntil > now) {
      const waitSeconds = Math.ceil((mem.resendCooldownUntil.getTime() - now.getTime()) / 1000);
      return {
        success: false,
        cooldown: true,
        waitSeconds,
        message: `Please wait ${waitSeconds} seconds before requesting a new verification code.`,
      };
    }
  }

  // 2. Generate secure 6-digit OTP and hash it immediately
  const otp = generateSecure6DigitOtp();
  const otpHash = hashOtp(otp, cleanId);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiration
  const resendCooldownUntil = new Date(Date.now() + 60 * 1000); // 60-second cooldown

  // 3. Invalidate previous OTPs for this identifier & purpose (Single active OTP rule)
  try {
    await OtpVerification.deleteMany({ identifier: cleanId, purpose });
    await OtpVerification.create({
      identifier: cleanId,
      otpHash,
      channel,
      purpose,
      attempts: 0,
      isVerified: false,
      resendCooldownUntil,
      expiresAt,
    });
  } catch (err) {
    MEMORY_OTP_CACHE.set(`${cleanId}:${purpose}`, {
      otpHash,
      channel,
      purpose,
      attempts: 0,
      isVerified: false,
      resendCooldownUntil,
      expiresAt,
    });
  }

  // 4. Dispatch OTP via Resend for email (or SMS gateway if channel is mobile)
  let dispatchResult = null;
  if (channel === 'mobile' || channel === 'sms') {
    dispatchResult = await sendMsg91Otp(cleanId, otp);
  } else {
    dispatchResult = await sendResendEmailOtp({
      email: cleanId,
      otp,
      purpose,
      userName,
    });
  }

  if (dispatchResult && dispatchResult.success === false) {
    return {
      success: false,
      message: dispatchResult.error || 'Failed to dispatch verification email. Please check address.',
    };
  }

  // Security Rule: NEVER return the plain OTP in response or log it
  return {
    success: true,
    identifier: cleanId,
    channel,
    purpose,
    expiresInSeconds: 300,
    cooldownSeconds: 60,
    messageId: dispatchResult?.messageId,
  };
};

// 4. Verify OTP with Brute-Force Rate Limiting & Single-Use Invalidation
export const verifyOtp = async ({
  identifier,
  otp,
  purpose = 'registration',
}) => {
  if (!identifier || !otp) {
    return { success: false, message: 'Identifier and OTP code are required.' };
  }

  const cleanId = identifier.toLowerCase().trim();
  const inputHash = hashOtp(otp, cleanId);
  const now = new Date();

  let record = null;
  let isFromMemory = false;

  try {
    record = await OtpVerification.findOne({ identifier: cleanId, purpose });
  } catch {
    record = MEMORY_OTP_CACHE.get(`${cleanId}:${purpose}`);
    isFromMemory = true;
  }

  if (!record) {
    record = MEMORY_OTP_CACHE.get(`${cleanId}:${purpose}`);
    isFromMemory = true;
  }

  if (!record) {
    return {
      success: false,
      message: 'No active verification code found for this account. Please request a new code.',
    };
  }

  // Rule 4A: Check Expiration (5 minutes)
  if (new Date(record.expiresAt) < now) {
    if (!isFromMemory && record._id) {
      await OtpVerification.deleteOne({ _id: record._id }).catch(() => {});
    }
    MEMORY_OTP_CACHE.delete(`${cleanId}:${purpose}`);
    return {
      success: false,
      expired: true,
      message: 'This verification code has expired. Please request a new one.',
    };
  }

  // Rule 4B: Maximum 5 Attempts Brute Force Protection
  if ((record.attempts || 0) >= 5) {
    if (!isFromMemory && record._id) {
      await OtpVerification.deleteOne({ _id: record._id }).catch(() => {});
    }
    MEMORY_OTP_CACHE.delete(`${cleanId}:${purpose}`);
    return {
      success: false,
      locked: true,
      message: 'Maximum verification attempts exceeded (5/5). This code has been invalidated for security.',
    };
  }

  // Rule 4C: Compare Hashes
  if (record.otpHash !== inputHash) {
    const nextAttempts = (record.attempts || 0) + 1;
    if (!isFromMemory && record._id) {
      await OtpVerification.updateOne({ _id: record._id }, { $set: { attempts: nextAttempts } }).catch(() => {});
    } else {
      record.attempts = nextAttempts;
      MEMORY_OTP_CACHE.set(`${cleanId}:${purpose}`, record);
    }

    const remaining = 5 - nextAttempts;
    if (remaining <= 0) {
      if (!isFromMemory && record._id) {
        await OtpVerification.deleteOne({ _id: record._id }).catch(() => {});
      }
      MEMORY_OTP_CACHE.delete(`${cleanId}:${purpose}`);
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

  // Rule 4D: Single-Use Invalidation (Delete OTP immediately upon success to prevent replay attacks)
  if (!isFromMemory && record._id) {
    await OtpVerification.deleteOne({ _id: record._id }).catch(() => {});
  }
  MEMORY_OTP_CACHE.delete(`${cleanId}:${purpose}`);

  return {
    success: true,
    verified: true,
    identifier: cleanId,
    purpose,
    message: 'OTP verified successfully.',
  };
};

export default {
  generateSecure6DigitOtp,
  hashOtp,
  requestAndSendOtp,
  verifyOtp,
};
