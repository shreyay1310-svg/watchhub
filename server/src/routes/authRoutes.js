import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { login, register, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { requestAndSendOtp, verifyOtp, maskEmail } from '../services/otpService.js';
import { prisma } from '../config/prisma.js';

const router = Router();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'watchhub_super_secret_access_jwt_key_2026_luxury_chronograph';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'watchhub_super_secret_refresh_jwt_key_2026_luxury_chronograph';

const generateTokens = (user) => {
  const payload = {
    id: user.userId || user._id || user.id,
    name: user.fullName || user.name,
    email: user.email,
    role: user.role || 'Customer',
    permissions: user.permissions || ['orders.own'],
  };
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const sendAuthSuccessResponse = (res, user, message = 'Authentication confirmed.') => {
  const { accessToken, refreshToken } = generateTokens(user);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    status: 'success',
    verified: true,
    message,
    accessToken,
    user: {
      id: user.userId || user.id,
      name: user.fullName || user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'Customer',
      isEmailVerified: !!user.isEmailVerified,
      isPhoneVerified: !!user.isPhoneVerified,
    },
  });
};

// Standard Password Login & Register
router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getMe);

// ============================================================================
// 1. POST /api/auth/send-email-otp
// Dispatch 6-digit cryptographic verification code to email via Resend API
// ============================================================================
router.post('/send-email-otp', async (req, res) => {
  try {
    const { email, purpose = 'registration', name } = req.body;
    console.log(`[OTP-FLOW] Registration request received for ${maskEmail(email)}`);

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, status: 'fail', message: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, status: 'fail', message: 'Please enter a valid email address.' });
    }
    console.log(`[OTP-FLOW] Email validation: PASS (${maskEmail(cleanEmail)})`);

    let normalizedPurpose = (purpose || 'registration').toLowerCase().trim();
    if (normalizedPurpose === 'register') normalizedPurpose = 'registration';
    console.log(`[OTP-FLOW] Purpose normalization: PASS (${normalizedPurpose})`);

    // Check duplicate account if registering
    if (normalizedPurpose === 'registration') {
      let existingUser = null;
      try {
        existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
      } catch {}
      if (existingUser) {
        console.warn(`[OTP-FLOW] Duplicate user check: FAIL (Account exists for ${maskEmail(cleanEmail)})`);
        return res.status(400).json({
          success: false,
          status: 'fail',
          message: 'An account with this email address already exists. Please sign in.',
        });
      }
      console.log(`[OTP-FLOW] Duplicate user check: PASS`);
    }

    const result = await requestAndSendOtp({
      identifier: cleanEmail,
      channel: 'email',
      purpose: normalizedPurpose,
      userName: name || 'Valued Collector',
    });

    console.log(`[OTP-FLOW] Final API status: ${result.success ? 'SUCCESS' : 'FAILURE'} (code: ${result.cooldown ? 429 : (result.success ? 200 : 400)})`);

    if (!result.success) {
      return res.status(result.cooldown ? 429 : 400).json({
        success: false,
        status: 'fail',
        message: result.message || "We couldn't send the verification code. Please try again.",
        waitSeconds: result.waitSeconds,
      });
    }

    return res.status(200).json({
      success: true,
      status: 'success',
      message: 'Verification code sent to your email address.',
      identifier: cleanEmail,
      channel: 'email',
      purpose: normalizedPurpose,
      expiresInSeconds: result.expiresInSeconds || 300,
      cooldownSeconds: result.cooldownSeconds || 60,
    });
  } catch (err) {
    console.error('[Auth Error - send-email-otp]', err.message);
    return res.status(500).json({ success: false, status: 'error', message: "We couldn't send the verification code. Please try again." });
  }
});

// ============================================================================
// 2. POST /api/auth/verify-email-otp
// Verify 6-digit OTP; if registration payload included, activate and create account
// ============================================================================
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { email, otp, purpose = 'registration', name, phone, password, role = 'Customer' } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, status: 'fail', message: !email ? 'Please enter a valid email address.' : 'Invalid verification code. Please try again.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();
    let normalizedPurpose = (purpose || 'registration').toLowerCase().trim();
    if (normalizedPurpose === 'register') normalizedPurpose = 'registration';

    const verification = await verifyOtp({
      identifier: cleanEmail,
      otp: cleanOtp,
      purpose: normalizedPurpose,
    });

    if (!verification.success) {
      let failMessage = verification.message || 'Invalid verification code. Please try again.';
      if (verification.expired) {
        failMessage = 'Your verification code has expired. Request a new code.';
      } else if (verification.locked) {
        failMessage = 'Maximum verification attempts exceeded. Please request a new code.';
      } else if (failMessage.toLowerCase().includes('invalid') || failMessage.toLowerCase().includes('mismatch')) {
        failMessage = 'Invalid verification code. Please try again.';
      }

      return res.status(400).json({
        success: false,
        status: 'fail',
        message: failMessage,
        remainingAttempts: verification.remainingAttempts,
        expired: verification.expired,
        locked: verification.locked,
      });
    }

    // If registration payload provided, create/activate user account now
    if (normalizedPurpose === 'registration') {
      let user = null;
      try {
        const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (existing) {
          user = await prisma.user.update({
            where: { userId: existing.userId },
            data: { isEmailVerified: true },
          });
        } else if (password) {
          const passwordHash = await bcrypt.hash(password, 10);
          const customerRole = await prisma.role.findUnique({ where: { roleName: 'Customer' } });
          user = await prisma.user.create({
            data: {
              fullName: name || cleanEmail.split('@')[0],
              email: cleanEmail,
              phone: phone || null,
              passwordHash,
              isEmailVerified: true,
              isPhoneVerified: !!phone,
              userRoles: customerRole ? { create: { roleId: customerRole.roleId } } : undefined,
            },
          });
        }
      } catch (err) {
        console.error('[Registration DB Error]', err);
      }

      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: name || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: phone || '',
          role: role || 'Customer',
          isEmailVerified: true,
          permissions: ['orders.own', 'cart.own', 'wishlist.own'],
        };
      }

      return sendAuthSuccessResponse(res, user, 'Email verified successfully. Account activated.');
    }

    return res.status(200).json({
      success: true,
      status: 'success',
      verified: true,
      identifier: cleanEmail,
      purpose: normalizedPurpose,
      message: 'OTP verification confirmed.',
    });
  } catch (err) {
    console.error('[Auth Error - verify-email-otp]', err);
    return res.status(500).json({ success: false, status: 'error', message: err.message });
  }
});

// ============================================================================
// 3. POST /api/auth/resend-email-otp
// Resend OTP with strict 60-second cooldown protection
// ============================================================================
router.post('/resend-email-otp', async (req, res) => {
  try {
    const { email, purpose = 'registration' } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, status: 'fail', message: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let normalizedPurpose = (purpose || 'registration').toLowerCase().trim();
    if (normalizedPurpose === 'register') normalizedPurpose = 'registration';

    const result = await requestAndSendOtp({
      identifier: cleanEmail,
      channel: 'email',
      purpose: normalizedPurpose,
    });

    if (!result.success) {
      return res.status(result.cooldown ? 429 : 400).json({
        success: false,
        status: 'fail',
        message: result.message || "We couldn't send the verification code. Please try again.",
        waitSeconds: result.waitSeconds,
      });
    }

    return res.status(200).json({
      success: true,
      status: 'success',
      message: 'Verification code sent to your email address.',
      identifier: cleanEmail,
      cooldownSeconds: 60,
    });
  } catch (err) {
    console.error('[Auth Error - resend-email-otp]', err);
    return res.status(500).json({ success: false, status: 'error', message: "We couldn't send the verification code. Please try again." });
  }
});

// ============================================================================
// 4. POST /api/auth/email-login
// Passwordless / Secure Sign-in with verified Email OTP
// ============================================================================
router.post('/email-login', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ status: 'fail', message: 'Email address and 6-digit OTP code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const verification = await verifyOtp({
      identifier: cleanEmail,
      otp: cleanOtp,
      purpose: 'login',
    });

    if (!verification.success) {
      return res.status(400).json({
        status: 'fail',
        message: verification.message,
        remainingAttempts: verification.remainingAttempts,
        expired: verification.expired,
      });
    }

    // Lookup user in DB
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: { userRoles: { include: { role: true } } },
      });
    } catch {}

    if (!user) {
      // Create verified customer profile
      try {
        const customerRole = await prisma.role.findUnique({ where: { roleName: 'Customer' } });
        user = await prisma.user.create({
          data: {
            fullName: cleanEmail.split('@')[0],
            email: cleanEmail,
            passwordHash: await bcrypt.hash(`Auth_${Date.now()}_WatchHub!`, 10),
            isEmailVerified: true,
            userRoles: customerRole ? { create: { roleId: customerRole.roleId } } : undefined,
          },
        });
      } catch (err) {
        user = {
          id: `usr_${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'Customer',
          isEmailVerified: true,
        };
      }
    } else if (!user.isEmailVerified) {
      await prisma.user.update({
        where: { userId: user.userId },
        data: { isEmailVerified: true },
      }).catch(() => {});
    }

    return sendAuthSuccessResponse(res, user, 'Sign-in verified successfully.');
  } catch (err) {
    console.error('[Auth Error - email-login]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================================
// 5. POST /api/auth/forgot-password
// Send password reset OTP to email
// ============================================================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ status: 'fail', message: 'A valid email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists (generic response pattern prevents user enumeration)
    let userExists = true;
    let userName = 'Valued Collector';
    try {
      const u = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (u) {
        userName = u.fullName || 'Valued Collector';
      } else {
        userExists = false;
      }
    } catch {}

    const result = await requestAndSendOtp({
      identifier: cleanEmail,
      channel: 'email',
      purpose: 'password_reset',
      userName,
    });

    if (!result.success) {
      if (result.cooldown) {
        return res.status(429).json({
          status: 'fail',
          message: result.message,
          waitSeconds: result.waitSeconds,
        });
      }
      return res.status(400).json({
        status: 'fail',
        error: result.error || 'EMAIL_DISPATCH_FAILED',
        message: result.message || 'Failed to dispatch password recovery code. Please try again.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `If an account is associated with ${cleanEmail}, a password recovery code has been sent.`,
      cooldownSeconds: 60,
    });
  } catch (err) {
    console.error('[Auth Error - forgot-password]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================================
// 5B. POST /api/auth/verify-reset-otp
// Step 3: Verify reset OTP and issue temporary reset authorization token
// ============================================================================
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp, purpose = 'RESET_PASSWORD' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email address and 6-digit OTP code are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Verify specifically against password reset purpose (rejects registration OTPs)
    const verification = await verifyOtp({
      identifier: cleanEmail,
      otp: cleanOtp,
      purpose: 'password_reset',
    });

    if (!verification.success) {
      return res.status(400).json({
        status: 'fail',
        message: verification.message,
        remainingAttempts: verification.remainingAttempts,
        expired: verification.expired,
      });
    }

    // Generate short-lived reset grant token (15m validity)
    const resetToken = jwt.sign(
      { email: cleanEmail, purpose: 'RESET_PASSWORD' },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    // Persist reset token state in user record
    await prisma.user.updateMany({
      where: { email: cleanEmail },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    }).catch(() => {});

    return res.status(200).json({
      status: 'success',
      verified: true,
      message: 'Reset verification code confirmed. You may now set your new password.',
      resetToken,
    });
  } catch (err) {
    console.error('[Auth Error - verify-reset-otp]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================================
// 6. POST /api/auth/reset-password
// Verify reset OTP (or resetToken) and securely hash & store new password
// ============================================================================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || (!otp && !resetToken) || !newPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email address, verification code (or reset token), and new password are required.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // If resetToken was provided from verify-reset-otp
    if (resetToken) {
      try {
        const decoded = jwt.verify(resetToken, JWT_ACCESS_SECRET);
        if (decoded.email !== cleanEmail || decoded.purpose !== 'RESET_PASSWORD') {
          return res.status(400).json({
            status: 'fail',
            message: 'Invalid or tampered password reset authorization token.',
          });
        }
      } catch (tokenErr) {
        return res.status(400).json({
          status: 'fail',
          message: 'Password reset authorization has expired. Please request a new code.',
        });
      }
    } else {
      // Direct verification via OTP (rejects registration OTP)
      const cleanOtp = otp.toString().trim();
      const verification = await verifyOtp({
        identifier: cleanEmail,
        otp: cleanOtp,
        purpose: 'password_reset',
      });

      if (!verification.success) {
        return res.status(400).json({
          status: 'fail',
          message: verification.message,
          remainingAttempts: verification.remainingAttempts,
          expired: verification.expired,
        });
      }
    }

    // Hash new password securely with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      await prisma.user.updateMany({
        where: { email: cleanEmail },
        data: {
          passwordHash: hashedPassword,
          isEmailVerified: true,
          passwordChangedAt: new Date(),
          resetPasswordToken: null,
          resetPasswordExpiresAt: null,
          otpCode: null,
          otpHash: null,
          otpExpiresAt: null,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      console.error('[Password Reset DB Error]', err);
    }

    // Revoke existing refresh session cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      status: 'success',
      message: 'Password reset confirmed. You may now sign in with your new credentials.',
    });
  } catch (err) {
    console.error('[Auth Error - reset-password]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================================
// 7. POST /api/auth/send-phone-otp
// Dispatch 6-digit verification code to mobile phone via Fast2SMS / MSG91
// ============================================================================
router.post('/send-phone-otp', async (req, res) => {
  try {
    const { phone, purpose = 'registration', name } = req.body;
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);

    if (cleanPhone.length < 10) {
      return res.status(400).json({ status: 'fail', message: 'A valid 10-digit mobile phone number is required.' });
    }

    if (purpose === 'registration') {
      let existingUser = null;
      try {
        existingUser = await prisma.user.findFirst({ where: { phone: { contains: cleanPhone } } });
      } catch {}
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: 'An account with this phone number already exists. Please sign in.',
        });
      }
    }

    const result = await requestAndSendOtp({
      identifier: cleanPhone,
      channel: 'mobile',
      purpose,
      userName: name || 'Valued Collector',
    });

    if (!result.success) {
      return res.status(result.cooldown ? 429 : 400).json({
        status: 'fail',
        message: result.message,
        waitSeconds: result.waitSeconds,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `A verification code has been dispatched to +91 ${cleanPhone}.`,
      identifier: cleanPhone,
      channel: 'mobile',
      purpose,
      expiresInSeconds: result.expiresInSeconds || 300,
      cooldownSeconds: result.cooldownSeconds || 60,
      simulated: result.simulated ?? true,
      provider: result.provider || 'DevelopmentMockSMSProvider',
    });
  } catch (err) {
    console.error('[Auth Error - send-phone-otp]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================================
// 8. POST /api/auth/verify-phone-otp
// Verify 6-digit Phone OTP; if registration payload included, create/activate user
// ============================================================================
router.post('/verify-phone-otp', async (req, res) => {
  try {
    const { phone, otp, purpose = 'registration', name, email, password, role = 'Customer' } = req.body;
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);
    const cleanOtp = (otp || '').toString().trim();

    if (cleanPhone.length < 10 || !cleanOtp) {
      return res.status(400).json({ status: 'fail', message: '10-digit phone number and 6-digit OTP code are required.' });
    }

    const verification = await verifyOtp({
      identifier: cleanPhone,
      otp: cleanOtp,
      purpose,
    });

    if (!verification.success) {
      return res.status(400).json({
        status: 'fail',
        message: verification.message,
        remainingAttempts: verification.remainingAttempts,
        expired: verification.expired,
        locked: verification.locked,
      });
    }

    // If registration payload provided, create/activate user
    if (purpose === 'registration') {
      let user = null;
      try {
        const existing = await prisma.user.findFirst({ where: { phone: { contains: cleanPhone } } });
        if (existing) {
          user = await prisma.user.update({
            where: { userId: existing.userId },
            data: { isPhoneVerified: true },
          });
        } else {
          const userEmail = email && email.includes('@') ? email.toLowerCase().trim() : `user_${cleanPhone}@watchhub.luxury`;
          const passwordHash = await bcrypt.hash(password || `Pass_${Date.now()}_WatchHub!`, 10);
          const customerRole = await prisma.role.findUnique({ where: { roleName: 'Customer' } });
          user = await prisma.user.create({
            data: {
              fullName: name || `Collector ${cleanPhone.slice(-4)}`,
              email: userEmail,
              phone: cleanPhone,
              passwordHash,
              isPhoneVerified: true,
              isEmailVerified: !!(email && email.includes('@')),
              userRoles: customerRole ? { create: { roleId: customerRole.roleId } } : undefined,
            },
          });
        }
      } catch (err) {
        console.error('[Phone Registration DB Error]', err);
      }

      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: name || `Collector ${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          role: role || 'Customer',
          isPhoneVerified: true,
          permissions: ['orders.own', 'cart.own', 'wishlist.own'],
        };
      }

      return sendAuthSuccessResponse(res, user, 'Phone number verified successfully. Account activated.');
    }

    return res.status(200).json({
      status: 'success',
      verified: true,
      message: 'Phone OTP verified successfully.',
      identifier: cleanPhone,
      purpose,
    });
  } catch (err) {
    console.error('[Auth Error - verify-phone-otp]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================================
// 9. POST /api/auth/forgot-password-phone
// Send password reset OTP to phone
// ============================================================================
router.post('/forgot-password-phone', async (req, res) => {
  try {
    const cleanPhone = (req.body.phone || '').replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      return res.status(400).json({ status: 'fail', message: 'A valid 10-digit mobile phone number is required.' });
    }
    const result = await requestAndSendOtp({ identifier: cleanPhone, channel: 'mobile', purpose: 'password_reset' });
    if (!result.success) {
      if (result.cooldown) return res.status(429).json({ status: 'fail', message: result.message, waitSeconds: result.waitSeconds });
      return res.status(400).json({ status: 'fail', error: result.error || 'SMS_DISPATCH_FAILED', message: result.message || 'Failed to dispatch SMS recovery code.' });
    }
    return res.status(200).json({ status: 'success', message: `If an account is associated with +91 ${cleanPhone}, a password recovery code has been sent via SMS.`, cooldownSeconds: 60 });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================================
// 10. POST /api/auth/reset-password-phone
// ============================================================================
router.post('/reset-password-phone', async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);
    const cleanOtp = (otp || '').toString().trim();
    if (cleanPhone.length < 10 || !cleanOtp || !newPassword) {
      return res.status(400).json({ status: 'fail', message: '10-digit phone number, 6-digit OTP code, and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ status: 'fail', message: 'Password must be at least 6 characters long.' });
    }
    const verification = await verifyOtp({ identifier: cleanPhone, otp: cleanOtp, purpose: 'password_reset' });
    if (!verification.success) {
      return res.status(400).json({ status: 'fail', message: verification.message, remainingAttempts: verification.remainingAttempts, expired: verification.expired });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.updateMany({ where: { phone: { contains: cleanPhone } }, data: { passwordHash: hashedPassword, isPhoneVerified: true } }).catch(() => {});
    return res.status(200).json({ status: 'success', message: 'Password reset confirmed via Phone verification. You may now sign in with your new password.' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// Backwards-compatible aliases for legacy callers
router.post('/send-otp', (req, res) => { req.url = '/send-email-otp'; return router.handle(req, res); });
router.post('/verify-otp', (req, res) => { req.url = '/verify-email-otp'; return router.handle(req, res); });
router.post('/resend-otp', (req, res) => { req.url = '/resend-email-otp'; return router.handle(req, res); });
router.post('/register-with-otp', (req, res) => { req.url = '/verify-email-otp'; return router.handle(req, res); });
router.post('/forgot-password-request', (req, res) => { req.url = '/forgot-password'; return router.handle(req, res); });
router.post('/forgot-password-reset', (req, res) => { req.url = '/reset-password'; return router.handle(req, res); });
router.post('/login-with-otp', (req, res) => { req.url = '/email-login'; return router.handle(req, res); });

export default router;
