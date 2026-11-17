// Cryptographically Secure OTP Service for WatchHub
import crypto from 'crypto';
import { OtpVerification } from '../models/OtpVerification.js';
import { sendMsg91Otp } from './msg91Service.js';
import { sendResendEmailOtp } from './resendService.js';

// Secret salt for HMAC hashing of OTP
const OTP_SALT = process.env.OTP_SALT || 'watchhub_secret_otp_salt_2026_geneva';

// In-memory fallback cache when MongoDB is running in offline/demo mode
const MEMORY_OTP_CACHE = new Map();

// Generate cryptographically secure random 6-digit OTP
export const generateSecure6DigitOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// Compute hash of the OTP
export const hashOtp = (otp, identifier) => {
  return crypto
    .createHmac('sha256', OTP_SALT)
    .update(`${identifier.toLowerCase().trim()}:${otp.trim()}`)
    .digest('hex');
};

// Request & Send OTP (supports email & mobile)
export const requestAndSendOtp = async ({ identifier, channel, purpose = 'registration', userName = 'Collector' }) => {
  const cleanId = identifier.toLowerCase().trim();
  const now = new Date();

  // 1. Check Resend Cooldown (prevent spam/exhaustion)
  try {
    const existing = await OtpVerification.findOne({ identifier: cleanId, purpose });
    if (existing && existing.resendCooldownUntil && existing.resendCooldownUntil > now) {
      const waitSeconds = Math.ceil((existing.resendCooldownUntil - now) / 1000);
      return {
        success: false,
        cooldown: true,
        waitSeconds,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
      };
    }
  } catch {
    // If Mongo offline, check memory cache
    const mem = MEMORY_OTP_CACHE.get(`${cleanId}:${purpose}`);
    if (mem && mem.resendCooldownUntil > now) {
      const waitSeconds = Math.ceil((mem.resendCooldownUntil - now) / 1000);
      return {
        success: false,
        cooldown: true,
        waitSeconds,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
      };
    }
  }

  // 2. Generate random 6-digit code
  const otp = generateSecure6DigitOtp();
  const otpHash = hashOtp(otp, cleanId);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  const resendCooldownUntil = new Date(Date.now() + 60 * 1000); // 60s cooldown

  // 3. Store in MongoDB
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
    // Fallback in-memory
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

  // 4. Dispatch via appropriate provider
  let dispatchResult = null;
  if (channel === 'mobile' || channel === 'sms') {
    dispatchResult = await sendMsg91Otp(cleanId, otp);
  } else {
    dispatchResult = await sendResendEmailOtp({ email: cleanId, otp, purpose, userName });
  }

  return {
    success: true,
    identifier: cleanId,
    channel,
    purpose,
    expiresInSeconds: 300,
    cooldownSeconds: 60,
    dispatchResult,
    // In dev mode when API key is sandbox, expose for visual toast convenience
    devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
  };
};

// Verify OTP
export const verifyOtp = async ({ identifier, otp, purpose = 'registration' }) => {
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
    return { success: false, message: 'No active OTP request found. Please request a new verification code.' };
  }

  // Check Expiry
  if (new Date(record.expiresAt) < now) {
    if (!isFromMemory) await OtpVerification.deleteMany({ identifier: cleanId, purpose });
    MEMORY_OTP_CACHE.delete(`${cleanId}:${purpose}`);
    return { success: false, expired: true, message: 'This OTP has expired. Please request a new code.' };
  }

  // Check Max Attempts (Brute Force Protection)
  if (record.attempts >= 5) {
    if (!isFromMemory) await OtpVerification.deleteMany({ identifier: cleanId, purpose });
    MEMORY_OTP_CACHE.delete(`${cleanId}:${purpose}`);
    return { success: false, locked: true, message: 'Maximum verification attempts exceeded. Please request a new code.' };
  }

  // Compare Hashes
  if (record.otpHash !== inputHash) {
    // Increment attempts
    record.attempts = (record.attempts || 0) + 1;
    if (!isFromMemory) {
      await OtpVerification.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
    }
    const remainingAttempts = 5 - record.attempts;
    return {
      success: false,
      message: `Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`,
      remainingAttempts,
    };
  }

  // Success: Invalidate single-use OTP
  if (!isFromMemory && record._id) {
    await OtpVerification.deleteOne({ _id: record._id });
  }
  MEMORY_OTP_CACHE.delete(`${cleanId}:${purpose}`);

  return {
    success: true,
    message: 'Verification successful.',
    identifier: cleanId,
    purpose,
  };
};
