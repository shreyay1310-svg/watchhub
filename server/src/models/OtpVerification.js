import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    // Cryptographically hashed OTP (never store plaintext)
    otpHash: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ['email', 'mobile', 'sms'],
      default: 'mobile',
    },
    purpose: {
      type: String,
      enum: ['registration', 'login', 'password_reset', 'sensitive_action'],
      default: 'registration',
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resendCooldownUntil: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000), // 60s cooldown
    },
    // 5-minute expiry
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
      index: { expires: 300 }, // MongoDB TTL auto-cleanup after 5 minutes
    },
  },
  { timestamps: true }
);

export const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);
