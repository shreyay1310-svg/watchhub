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
import ManufacturingHubPage from '../pages/customer/ManufacturingHubPage';
import MobileAppHubPage from '../pages/mobile/MobileAppHubPage';
import CustomizeWatchPage from '../pages/customer/CustomizeWatchPage';
import TrackParcelPage from '../pages/customer/TrackParcelPage';
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
      <Route
        path="/admin/products"
        element={
          <StaffProtectedRoute>
            <RoleDashboard initialTab="products" />
          </StaffProtectedRoute>
        }
      />

      {/* Dedicated Role-Based Inventory Manager Dashboard */}
      <Route
        path="/inventory-manager/dashboard"
        element={
          <StaffProtectedRoute>
            <InventoryManagerDashboardPage />
          </StaffProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager"
        element={
          <StaffProtectedRoute>
            <InventoryManagerDashboardPage />
          </StaffProtectedRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

