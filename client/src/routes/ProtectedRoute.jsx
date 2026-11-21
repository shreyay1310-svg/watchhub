import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import AuthLoadingScreen from '../components/common/AuthLoadingScreen';
import AccessDeniedScreen from '../components/common/AccessDeniedScreen';

/**
 * Maps any user role to their authorized primary dashboard path
 */
export const getRoleDashboardPath = (role) => {
  const norm = (role || '').trim().toLowerCase();
  if (norm === 'super admin' || norm === 'super_admin' || norm === (ROLES.SUPER_ADMIN || '').toLowerCase()) {
    return '/super-admin/dashboard';
  }
  if (norm === 'store admin' || norm === 'store_admin' || norm === (ROLES.STORE_ADMIN || '').toLowerCase()) {
    return '/store-admin/dashboard';
  }
  if (norm === 'inventory manager' || norm === 'inventory_manager' || norm === (ROLES.INVENTORY_MANAGER || '').toLowerCase()) {
    return '/inventory-manager/dashboard';
  }
  if (norm === 'delivery manager' || norm === 'delivery_manager' || norm === (ROLES.DELIVERY_MANAGER || '').toLowerCase()) {
    return '/delivery-manager/dashboard';
  }
  if (norm === 'delivery partner' || norm === 'delivery_partner' || norm === (ROLES.DELIVERY_PARTNER || '').toLowerCase()) {
    return '/delivery-partner/dashboard';
  }
  if (norm.includes('support')) {
    return '/customer-support/dashboard';
  }
  // Customer / Buyer dashboard
  return '/customer/dashboard';
};

/**
 * Production Authentication & Authorization Guard
 * - Verifies cryptographic JWT state (not just untrusted localStorage role)
 * - Renders luxury loading screen while session is being verified against /api/auth/me
 * - Preserves requested URL in location.state.from for post-login redirection
 * - Enforces role-based access control with automatic authorized redirection
 */
export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, token, authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Session verification in progress -> show luxury loading screen
  if (authLoading) {
    return <AuthLoadingScreen message="Verifying authentication session..." />;
  }

  // 2. Unauthenticated -> redirect to /login, preserving original location
  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Access Control verification
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || '';
    const normUserRole = userRole.trim().toLowerCase();

    const isSuperAdmin =
      normUserRole === 'super admin' ||
      normUserRole === 'super_admin' ||
      normUserRole === (ROLES.SUPER_ADMIN || '').toLowerCase();

    const isExplicitlyAllowed = allowedRoles.some((r) => {
      if (!r) return false;
      return (
        r === userRole ||
        r.toString().trim().toLowerCase() === normUserRole
      );
    });

    if (!isSuperAdmin && !isExplicitlyAllowed) {
      // User is authenticated but lacks required role -> Render Luxury Access Denied Screen
      return <AccessDeniedScreen allowedRoles={allowedRoles} currentRole={userRole} />;
    }
  }

  // 4. Authorized -> render protected content
  return children ? children : <Outlet />;
};

// Backwards-compatible alias for existing imports
export const RoleProtectedRoute = ProtectedRoute;

export default ProtectedRoute;
