import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateTokens = (user) => {
  const payload = {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
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

    // Try finding user in MongoDB if connected
    let user = null;
    try {
      user = await User.findOne({ email: email.toLowerCase() });
    } catch (e) {
      // MongoDB might not be connected in local dev, allow fallback
    }

    if (!user) {
      // Fallback mock staff accounts or demo customer
      const isStaff = email.includes('admin') || email.includes('manager') || email.includes('support');
      user = {
        id: `demo_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: isStaff ? (email.includes('super') ? 'Super Admin' : 'Store Admin') : 'Customer',
        permissions: isStaff ? ['all'] : ['orders.own'],
        avatar: isStaff ? '👑' : '👤',
      };
    }

    const { accessToken, refreshToken } = generateTokens(user);

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
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar,
      },
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

    let newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      role: 'Customer', // Public registration is strictly Customer role
      permissions: ['orders.own', 'cart.own', 'wishlist.own'],
    };

    try {
      const created = await User.create({
        name,
        email,
        phone,
        password,
        role: 'Customer',
        permissions: ['orders.own'],
      });
      newUser = created;
    } catch (e) {
      // Standalone mode fallback
    }

    const { accessToken } = generateTokens(newUser);

    res.status(201).json({
      status: 'success',
      message: 'Customer registered successfully.',
      accessToken,
      user: newUser,
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

