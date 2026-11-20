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
import StoryDetailPage from '../pages/customer/StoryDetailPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import EmailVerificationPage from '../pages/auth/EmailVerificationPage';
import EmailOtpLoginPage from '../pages/auth/EmailOtpLoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import RoleDashboard from '../pages/dashboards/RoleDashboard';
import InventoryManagerDashboardPage from '../pages/dashboards/InventoryManagerDashboardPage';
import DeliveryManagerDashboardPage from '../pages/dashboards/DeliveryManagerDashboardPage';
import DeliveryPartnerDashboardPage from '../pages/dashboards/DeliveryPartnerDashboardPage';
import CustomerSupportDashboardPage from '../pages/dashboards/CustomerSupportDashboardPage';
import ManufacturingHubPage from '../pages/customer/ManufacturingHubPage';
import MobileAppHubPage from '../pages/mobile/MobileAppHubPage';
import CustomizeWatchPage from '../pages/customer/CustomizeWatchPage';
import CustomerOrdersTrackingPage from '../pages/customer/CustomerOrdersTrackingPage';
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
import { ProtectedRoute, RoleProtectedRoute, getRoleDashboardPath } from './ProtectedRoute';
import AuthLoadingScreen from '../components/common/AuthLoadingScreen';

/**
 * Root Route Entry Controller
 * - Unauthenticated visitors are always redirected to /login
 * - Authenticated users are routed to their role-authorized dashboard or storefront
 */
const RootRoute = () => {
  const { user, isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <AuthLoadingScreen message="Loading WatchHub Atelier..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = (user.role || '').trim().toLowerCase();
  if (role === 'super admin' || role === 'super_admin' || role === (ROLES.SUPER_ADMIN || '').toLowerCase()) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }
  if (role === 'store admin' || role === 'store_admin' || role === (ROLES.STORE_ADMIN || '').toLowerCase()) {
    return <Navigate to="/store-admin/dashboard" replace />;
  }
  if (role === 'inventory manager' || role === 'inventory_manager' || role === (ROLES.INVENTORY_MANAGER || '').toLowerCase()) {
    return <Navigate to="/inventory-manager/dashboard" replace />;
  }
  if (role === 'delivery manager' || role === 'delivery_manager' || role === (ROLES.DELIVERY_MANAGER || '').toLowerCase()) {
    return <Navigate to="/delivery-manager/dashboard" replace />;
  }
  if (role === 'delivery partner' || role === 'delivery_partner' || role === (ROLES.DELIVERY_PARTNER || '').toLowerCase()) {
    return <Navigate to="/delivery-partner/dashboard" replace />;
  }
  if (role.includes('support')) {
    return <Navigate to="/customer-support/dashboard" replace />;
  }

  // Authenticated customer gets customer home storefront
  return <HomePage />;
};

/**
 * Automatic Dispatcher for `/dashboard` route based on authenticated role
 */
const RoleDashboardDispatcher = () => {
  const { user, isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <AuthLoadingScreen message="Dispatching to role dashboard..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRoleDashboardPath(user.role)} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================================================================== */}
      {/* 1. PUBLIC AUTHENTICATION ROUTES (Strictly Limited)                   */}
      {/* ==================================================================== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/email-otp-login" element={<EmailOtpLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ==================================================================== */}
      {/* 2. DEFAULT WEBSITE ENTRY ROUTE                                       */}
      {/* Opening http://localhost:5173/ -> Login Page when unauthenticated    */}
      {/* ==================================================================== */}
      <Route path="/" element={<RootRoute />} />

      {/* ==================================================================== */}
      {/* 3. DYNAMIC ROLE DISPATCHER & ALIASES                                 */}
      {/* ==================================================================== */}
      <Route path="/dashboard" element={<RoleDashboardDispatcher />} />
      <Route path="/dashboard/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
      <Route path="/admin/super-admin" element={<Navigate to="/super-admin/dashboard" replace />} />
      <Route path="/dashboard/store-admin" element={<Navigate to="/store-admin/dashboard" replace />} />
      <Route path="/dashboard/inventory" element={<Navigate to="/inventory-manager/dashboard" replace />} />
      <Route path="/dashboard/delivery" element={<Navigate to="/delivery-manager/dashboard" replace />} />
      <Route path="/dashboard/support" element={<Navigate to="/customer-support/dashboard" replace />} />

      {/* ==================================================================== */}
      {/* 4. PROTECTED CUSTOMER STOREFRONT & ORDERS (Requires Authentication)  */}
      {/* ==================================================================== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/customer/dashboard" element={<CustomerAccountPage />} />
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
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/account" element={<CustomerAccountPage />} />
        <Route path="/orders" element={<CustomerOrdersTrackingPage />} />
        <Route path="/my-orders" element={<CustomerOrdersTrackingPage />} />
        <Route path="/order-tracking" element={<CustomerOrdersTrackingPage />} />
        <Route path="/account/orders/:orderId/track" element={<CustomerOrdersTrackingPage />} />
        <Route path="/orders/:orderId/track" element={<CustomerOrdersTrackingPage />} />
        <Route path="/track-order/:orderId" element={<CustomerOrdersTrackingPage />} />
        <Route path="/track-parcel/:orderId" element={<CustomerOrdersTrackingPage />} />
        <Route path="/warranty-service" element={<WarrantyServicePage />} />
        <Route path="/returns-refunds" element={<ReturnsRefundsPage />} />
        <Route path="/store-locator" element={<StoreLocatorPage />} />
        <Route path="/support" element={<CustomerSupportPage />} />
        <Route path="/stories" element={<StoryDetailPage initialSlug="craftsmanship" />} />
        <Route path="/stories/craftsmanship" element={<StoryDetailPage initialSlug="craftsmanship" />} />
        <Route path="/stories/heritage" element={<StoryDetailPage initialSlug="heritage" />} />
        <Route path="/stories/collectors-journal" element={<StoryDetailPage initialSlug="collectors-journal" />} />
        <Route path="/stories/:slug" element={<StoryDetailPage />} />
        <Route path="/track-parcel" element={<CustomerOrdersTrackingPage />} />
        <Route path="/track-order" element={<CustomerOrdersTrackingPage />} />
        <Route path="/manufacturing-hub" element={<ManufacturingHubPage />} />
        <Route path="/mobile-app" element={<MobileAppHubPage />} />
        <Route path="/download-app" element={<MobileAppHubPage />} />
        <Route path="/customize-watch" element={<CustomizeWatchPage />} />
      </Route>

      {/* ==================================================================== */}
      {/* 5. DEDICATED STORE ADMIN DASHBOARDS (Role Protected)                 */}
      {/* ==================================================================== */}
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

      {/* ==================================================================== */}
      {/* 6. DEDICATED SUPER ADMIN DASHBOARDS (Role Protected)                 */}
      {/* ==================================================================== */}
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
      <Route
        path="/super-admin/releases"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard initialTab="releases" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/releases"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, 'Super Admin']}>
            <RoleDashboard initialTab="releases" />
          </RoleProtectedRoute>
        }
      />

      {/* ==================================================================== */}
      {/* 7. DEDICATED INVENTORY MANAGER DASHBOARDS (11 Modules - Protected)   */}
      {/* ==================================================================== */}
      <Route
        path="/inventory-manager/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/stock-overview"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="overview" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/inventory"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="stock" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/stock-movements"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="movements" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/stock-adjustments"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="adjustments" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/warehouses"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="warehouses" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/reorder-alerts"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="reorder" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/purchase-requests"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="requests" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/reports"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="reports" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/history"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="history" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory-manager/settings"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="settings" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER, 'Inventory Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="stock" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/store-admin/inventory"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/inventory"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <InventoryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />

      {/* ==================================================================== */}
      {/* 8. DEDICATED DELIVERY MANAGER DASHBOARDS (11 Modules - Protected)    */}
      {/* ==================================================================== */}
      <Route
        path="/delivery-manager/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/orders"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="orders" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/assign"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="assign" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/tracking"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="tracking" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/partners"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="partners" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/routes"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="routes" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/attempts"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="attempts" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/returns"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="returns" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/reports"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="reports" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/areas"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="areas" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/delivery-manager/settings"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.DELIVERY_MANAGER, 'Delivery Manager', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="settings" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/store-admin/delivery"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/delivery"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.STORE_ADMIN, 'Store Admin', ROLES.SUPER_ADMIN, 'Super Admin']}>
            <DeliveryManagerDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />

      {/* ==================================================================== */}
      {/* 9. DEDICATED DELIVERY PARTNER DASHBOARDS (Role Protected)            */}
      {/* ==================================================================== */}
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

      {/* ==================================================================== */}
      {/* 10. DEDICATED CUSTOMER SUPPORT DASHBOARDS (12 Modules - Protected)   */}
      {/* ==================================================================== */}
      <Route
        path="/customer-support/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="dashboard" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/tickets"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="tickets" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/live-chat"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="live-chat" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/customers"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="customers" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/orders-returns"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="orders-returns" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/refunds"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="refunds" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/escalations"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="escalations" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/knowledge-base"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="knowledge-base" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/canned-responses"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="canned-responses" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/reports"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="reports" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/team"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="team" />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/customer-support/settings"
        element={
          <RoleProtectedRoute allowedRoles={[ROLES.CUSTOMER_SUPPORT, 'Customer Support Executive', 'Customer Support Manager', 'Customer Support', ROLES.SUPER_ADMIN, 'Super Admin', ROLES.STORE_ADMIN, 'Store Admin']}>
            <CustomerSupportDashboardPage initialTab="settings" />
          </RoleProtectedRoute>
        }
      />

      {/* ==================================================================== */}
      {/* 11. CATCH-ALL FALLBACK ROUTE                                         */}
      {/* ==================================================================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
