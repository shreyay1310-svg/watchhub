import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/customer/HomePage';
import ProductsPage from '../pages/customer/ProductsPage';
import BrandsPage from '../pages/customer/BrandsPage';
import CategoriesPage from '../pages/customer/CategoriesPage';
import CartPage from '../pages/customer/CartPage';
import WishlistPage from '../pages/customer/WishlistPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import RoleDashboard from '../pages/dashboards/RoleDashboard';
import InventoryManagerDashboardPage from '../pages/dashboards/InventoryManagerDashboardPage';
import DeliveryManagerDashboardPage from '../pages/dashboards/DeliveryManagerDashboardPage';
import CustomerSupportDashboardPage from '../pages/dashboards/CustomerSupportDashboardPage';
import ManufacturingHubPage from '../pages/customer/ManufacturingHubPage';
import MobileAppHubPage from '../pages/mobile/MobileAppHubPage';
import CustomizeWatchPage from '../pages/customer/CustomizeWatchPage';
import TrackParcelPage from '../pages/customer/TrackParcelPage';
import { useAuth, ROLES } from '../context/AuthContext';

// Role-Based Guarded Route Component
const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles specified, verify user has permission
  if (allowedRoles.length > 0) {
    const userRole = user.role;
    const isAllowed =
      allowedRoles.includes(userRole) ||
      userRole === ROLES.SUPER_ADMIN ||
      userRole === 'Super Admin';

    if (!isAllowed) {
      // Redirect to user's authorized role dashboard
      if (userRole === ROLES.INVENTORY_MANAGER || userRole === 'Inventory Manager') {
        return <Navigate to="/inventory-manager/dashboard" replace />;
      }
      if (userRole === ROLES.DELIVERY_MANAGER || userRole === 'Delivery Manager') {
        return <Navigate to="/delivery-manager/dashboard" replace />;
      }
      if (userRole === ROLES.CUSTOMER_SUPPORT || userRole === 'Customer Support Executive' || userRole === 'Customer Support') {
        return <Navigate to="/customer-support/dashboard" replace />;
      }
      if (userRole === ROLES.SUPER_ADMIN || userRole === 'Super Admin') {
        return <Navigate to="/super-admin/dashboard" replace />;
      }
      if (userRole === ROLES.STORE_ADMIN || userRole === 'Store Admin') {
        return <Navigate to="/store-admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Automatic Dispatcher for `/dashboard` route based on authenticated role
const RoleDashboardDispatcher = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role;
  if (role === ROLES.INVENTORY_MANAGER || role === 'Inventory Manager') {
    return <Navigate to="/inventory-manager/dashboard" replace />;
  }
  if (role === ROLES.DELIVERY_MANAGER || role === 'Delivery Manager') {
    return <Navigate to="/delivery-manager/dashboard" replace />;
  }
  if (role === ROLES.CUSTOMER_SUPPORT || role === 'Customer Support Executive' || role === 'Customer Support') {
    return <Navigate to="/customer-support/dashboard" replace />;
  }
  if (role === ROLES.SUPER_ADMIN || role === 'Super Admin') {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  if (role === ROLES.STORE_ADMIN || role === 'Store Admin') {
    return <Navigate to="/store-admin/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/track-parcel" element={<TrackParcelPage />} />
      <Route path="/track-order" element={<TrackParcelPage />} />
      <Route path="/my-orders" element={<TrackParcelPage />} />
      <Route path="/manufacturing-hub" element={<ManufacturingHubPage />} />
      <Route path="/mobile-app" element={<MobileAppHubPage />} />
      <Route path="/download-app" element={<MobileAppHubPage />} />
      <Route path="/customize-watch" element={<CustomizeWatchPage />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Dynamic Role Dispatcher (/dashboard) */}
      <Route path="/dashboard" element={<RoleDashboardDispatcher />} />

      {/* 1. Dedicated Store Admin Dashboard Routes */}
      <Route
        path="/store-admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/store-admin"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard initialTab="products" />
          </RoleProtectedRoute>
        }
      />

      {/* 2. Dedicated Super Admin Dashboard Routes */}
      <Route
        path="/super-admin/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/super-admin"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />

      {/* 3. Dedicated Inventory Manager Dashboard Routes */}
      <Route
        path="/inventory-manager/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage />
          </RoleProtectedRoute>
        }
      />

      {/* 4. Dedicated Delivery Manager Dashboard Routes */}
      <Route
        path="/delivery-manager/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage />
          </RoleProtectedRoute>
        }
      />

      {/* 5. Dedicated Customer Support Dashboard Routes */}
      <Route
        path="/customer-support/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <CustomerSupportDashboardPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <CustomerSupportDashboardPage />
          </RoleProtectedRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
