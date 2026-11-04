import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Verify JWT Access Token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'Authentication required. No token provided.' });
    }

    const secret = process.env.JWT_ACCESS_SECRET || 'watchhub_super_secret_access_jwt_key_2026_luxury_chronograph';
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired authentication token.' });
  }
};

// Role-Based Access Control (RBAC) middleware
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `Access denied. Role '${req.user?.role || 'Guest'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

// Granular Permission check
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];
    if (req.user?.role === 'Super Admin' || userPermissions.includes(requiredPermission)) {
      return next();
    }
    return res.status(403).json({
      status: 'fail',
      message: `Access denied. Missing required permission '${requiredPermission}'.`,
    });
  };
};

