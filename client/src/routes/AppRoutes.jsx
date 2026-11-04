import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/customer/HomePage';
import ProductsPage from '../pages/customer/ProductsPage';
import CartPage from '../pages/customer/CartPage';
import WishlistPage from '../pages/customer/WishlistPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import RoleDashboard from '../pages/dashboards/RoleDashboard';
import ManufacturingHubPage from '../pages/customer/ManufacturingHubPage';
import MobileAppHubPage from '../pages/mobile/MobileAppHubPage';
import { useAuth, ROLES } from '../context/AuthContext';

// Protected Route Component for Staff Dashboards
const StaffProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/track-order" element={<CartPage />} />
      <Route path="/my-orders" element={<CartPage />} />
      <Route path="/manufacturing-hub" element={<ManufacturingHubPage />} />
      <Route path="/mobile-app" element={<MobileAppHubPage />} />
      <Route path="/download-app" element={<MobileAppHubPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Role-Based Internal Staff Dashboard */}
      <Route
        path="/dashboard"
        element={
          <StaffProtectedRoute>
            <RoleDashboard />
          </StaffProtectedRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

