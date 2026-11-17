import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/customer/HomePage';
import ProductsPage from '../pages/customer/ProductsPage';
import ProductDetailsPage from '../pages/customer/ProductDetailsPage';
import BrandsPage from '../pages/customer/BrandsPage';
import BrandListingPage from '../pages/customer/BrandListingPage';
import CategoriesPage from '../pages/customer/CategoriesPage';
import CategoryDetailPage from '../pages/customer/CategoryDetailPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import WishlistPage from '../pages/customer/WishlistPage';
import CustomerAccountPage from '../pages/customer/CustomerAccountPage';
import WarrantyServicePage from '../pages/customer/WarrantyServicePage';
import ReturnsRefundsPage from '../pages/customer/ReturnsRefundsPage';
import StoreLocatorPage from '../pages/customer/StoreLocatorPage';
import CustomerSupportPage from '../pages/customer/CustomerSupportPage';
import EditorialStoriesPage from '../pages/customer/EditorialStoriesPage';
import StoryDetailPage from '../pages/customer/StoryDetailPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import RoleDashboard from '../pages/dashboards/RoleDashboard';
import InventoryManagerDashboardPage from '../pages/dashboards/InventoryManagerDashboardPage';
import DeliveryManagerDashboardPage from '../pages/dashboards/DeliveryManagerDashboardPage';
import DeliveryPartnerDashboardPage from '../pages/dashboards/DeliveryPartnerDashboardPage';
import CustomerSupportDashboardPage from '../pages/dashboards/CustomerSupportDashboardPage';
import ManufacturingHubPage from '../pages/customer/ManufacturingHubPage';
import MobileAppHubPage from '../pages/mobile/MobileAppHubPage';
import CustomizeWatchPage from '../pages/customer/CustomizeWatchPage';
import TrackParcelPage from '../pages/customer/TrackParcelPage';
import WatchesPage from '../pages/customer/WatchesPage';
import MenPage from '../pages/customer/MenPage';
import WomenPage from '../pages/customer/WomenPage';
import KidsPage from '../pages/customer/KidsPage';
import SmartwatchesPage from '../pages/customer/SmartwatchesPage';
import LuxuryPage from '../pages/customer/LuxuryPage';
import SportsPage from '../pages/customer/SportsPage';
import CollectionsPage from '../pages/customer/CollectionsPage';
import LimitedEditionPage from '../pages/customer/LimitedEditionPage';
import NewArrivalsPage from '../pages/customer/NewArrivalsPage';
import BestSellersPage from '../pages/customer/BestSellersPage';
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
      if (userRole === ROLES.DELIVERY_PARTNER || userRole === 'Delivery Partner') {
        return <Navigate to="/delivery-partner/dashboard" replace />;
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
  if (role === ROLES.DELIVERY_PARTNER || role === 'Delivery Partner') {
    return <Navigate to="/delivery-partner/dashboard" replace />;
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
      <Route path="/watches" element={<WatchesPage />} />
      <Route path="/men" element={<MenPage />} />
      <Route path="/women" element={<WomenPage />} />
      <Route path="/kids" element={<KidsPage />} />
      <Route path="/smartwatches" element={<SmartwatchesPage />} />
      <Route path="/luxury" element={<LuxuryPage />} />
      <Route path="/sports" element={<SportsPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/limited-edition" element={<LimitedEditionPage />} />
      <Route path="/new-arrivals" element={<NewArrivalsPage />} />
      <Route path="/best-sellers" element={<BestSellersPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/:categorySlug" element={<CategoryDetailPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/brands/:slug" element={<BrandListingPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/account" element={<CustomerAccountPage />} />
      <Route path="/orders" element={<CustomerAccountPage />} />
      <Route path="/warranty-service" element={<WarrantyServicePage />} />
      <Route path="/returns-refunds" element={<ReturnsRefundsPage />} />
      <Route path="/store-locator" element={<StoreLocatorPage />} />
      <Route path="/support" element={<CustomerSupportPage />} />
      <Route path="/stories" element={<StoryDetailPage initialSlug="craftsmanship" />} />
      <Route path="/stories/craftsmanship" element={<StoryDetailPage initialSlug="craftsmanship" />} />
      <Route path="/stories/heritage" element={<StoryDetailPage initialSlug="heritage" />} />
      <Route path="/stories/collectors-journal" element={<StoryDetailPage initialSlug="collectors-journal" />} />
      <Route path="/stories/:slug" element={<StoryDetailPage />} />
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
        path="/store-admin/pos"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard initialTab="pos" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard initialTab="pos" />
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

      {/* 3. Dedicated Inventory Manager Dashboard Routes (All 11 Modules) */}
      <Route
        path="/inventory-manager/dashboard"
        element={<InventoryManagerDashboardPage initialTab="dashboard" />}
      />
      <Route
        path="/inventory-manager"
        element={<InventoryManagerDashboardPage initialTab="dashboard" />}
      />
      <Route
        path="/inventory-manager/stock-overview"
        element={<InventoryManagerDashboardPage initialTab="overview" />}
      />
      <Route
        path="/inventory-manager/inventory"
        element={<InventoryManagerDashboardPage initialTab="stock" />}
      />
      <Route
        path="/inventory-manager/stock-movements"
        element={<InventoryManagerDashboardPage initialTab="movements" />}
      />
      <Route
        path="/inventory-manager/stock-adjustments"
        element={<InventoryManagerDashboardPage initialTab="adjustments" />}
      />
      <Route
        path="/inventory-manager/warehouses"
        element={<InventoryManagerDashboardPage initialTab="warehouses" />}
      />
      <Route
        path="/inventory-manager/reorder-alerts"
        element={<InventoryManagerDashboardPage initialTab="reorder" />}
      />
      <Route
        path="/inventory-manager/purchase-requests"
        element={<InventoryManagerDashboardPage initialTab="requests" />}
      />
      <Route
        path="/inventory-manager/reports"
        element={<InventoryManagerDashboardPage initialTab="reports" />}
      />
      <Route
        path="/inventory-manager/history"
        element={<InventoryManagerDashboardPage initialTab="history" />}
      />
      <Route
        path="/inventory-manager/settings"
        element={<InventoryManagerDashboardPage initialTab="settings" />}
      />
      <Route
        path="/inventory"
        element={<InventoryManagerDashboardPage initialTab="stock" />}
      />
      <Route
        path="/store-admin/inventory"
        element={<InventoryManagerDashboardPage initialTab="dashboard" />}
      />
      <Route
        path="/admin/inventory"
        element={<InventoryManagerDashboardPage initialTab="dashboard" />}
      />

      {/* 4. Dedicated Delivery Manager Dashboard Routes (All 11 Modules) */}
      <Route
        path="/delivery-manager/dashboard"
        element={<DeliveryManagerDashboardPage initialTab="dashboard" />}
      />
      <Route
        path="/delivery-manager"
        element={<DeliveryManagerDashboardPage initialTab="dashboard" />}
      />
      <Route
        path="/delivery"
        element={<DeliveryManagerDashboardPage initialTab="dashboard" />}
      />
      <Route
        path="/delivery-manager/orders"
        element={<DeliveryManagerDashboardPage initialTab="orders" />}
      />
      <Route
        path="/delivery-manager/assign"
        element={<DeliveryManagerDashboardPage initialTab="assign" />}
      />
      <Route
        path="/delivery-manager/tracking"
        element={<DeliveryManagerDashboardPage initialTab="tracking" />}
      />
      <Route
        path="/delivery-manager/partners"
        element={<DeliveryManagerDashboardPage initialTab="partners" />}
      />
      <Route
        path="/delivery-manager/routes"
        element={<DeliveryManagerDashboardPage initialTab="routes" />}
      />
      <Route
        path="/delivery-manager/attempts"
        element={<DeliveryManagerDashboardPage initialTab="attempts" />}
      />
      <Route
        path="/delivery-manager/returns"
        element={<DeliveryManagerDashboardPage initialTab="returns" />}
      />
      <Route
        path="/delivery-manager/reports"
        element={<DeliveryManagerDashboardPage initialTab="reports" />}
      />
      <Route
        path="/delivery-manager/areas"
        element={<DeliveryManagerDashboardPage initialTab="areas" />}
      />
      <Route
        path="/delivery-manager/settings"
        element={<DeliveryManagerDashboardPage initialTab="settings" />}
      />
      <Route
        path="/store-admin/delivery"
        element={<DeliveryManagerDashboardPage initialTab="dashboard" />}
      />
      <Route
        path="/admin/delivery"
        element={<DeliveryManagerDashboardPage initialTab="dashboard" />}
      />

      {/* 5. Dedicated Delivery Partner App Routes */}
      <Route
        path="/delivery-partner/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_PARTNER, 'Delivery Partner', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryPartnerDashboardPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-partner"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_PARTNER, 'Delivery Partner', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryPartnerDashboardPage />
          </RoleProtectedRoute>
        }
      />

      {/* 6. Dedicated Customer Support Dashboard Routes */}
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
