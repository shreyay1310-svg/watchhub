import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

const generateTokens = (user) => {
  const payload = {
    id: user.id || user.userId,
    name: user.name || user.fullName,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
  };

  const accessSecret = process.env.JWT_ACCESS_SECRET || 'watchhub_super_secret_access_jwt_key_2026_luxury_chronograph';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'watchhub_super_secret_refresh_jwt_key_2026_luxury_chronograph';

  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user in MSSQL database via Prisma
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } catch (e) {
      console.error('[Auth Error] Database lookup error:', e.message);
    }

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password.' });
    }

    // Strictly verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: 'fail', message: 'Your account is deactivated. Please contact support.' });
    }

    // Resolve primary role & granular permissions
    const primaryRole = user.userRoles[0]?.role?.roleName || 'Customer';
    let permissions = [];
    if (primaryRole === 'Super Admin') {
      permissions = ['all'];
    } else {
      user.userRoles.forEach((ur) => {
        ur.role?.rolePermissions?.forEach((rp) => {
          if (rp.permission?.permissionCode && !permissions.includes(rp.permission.permissionCode)) {
            permissions.push(rp.permission.permissionCode);
          }
        });
      });
    }

    const userPayload = {
      id: user.userId,
      name: user.fullName,
      email: user.email,
      role: primaryRole,
      permissions,
      avatar: user.avatarUrl,
    };

    const { accessToken, refreshToken } = generateTokens(userPayload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      accessToken,
      user: userPayload,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Register Customer Controller
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Name, email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(400).json({ status: 'fail', message: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customerRole = await prisma.role.findUnique({ where: { roleName: 'Customer' } });

    const created = await prisma.user.create({
      data: {
        fullName: name,
        email: cleanEmail,
        phone: phone || null,
        passwordHash,
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        userRoles: customerRole ? {
          create: {
            roleId: customerRole.roleId,
          },
        } : undefined,
      },
    });

    const userPayload = {
      id: created.userId,
      name: created.fullName,
      email: created.email,
      role: 'Customer',
      permissions: ['shop', 'review', 'track_orders', 'wishlist'],
    };

    const { accessToken } = generateTokens(userPayload);

    res.status(201).json({
      status: 'success',
      message: 'Customer registered successfully.',
      accessToken,
      user: userPayload,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Current User Controller
export const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
};
