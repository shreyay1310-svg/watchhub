import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  Watch,
  Folder,
  Users,
  Boxes,
  Tag,
  Image as ImageIcon,
  Star,
  BarChart3,
  Factory,
  Settings,
  Plus,
  Search,
  Calendar,
  Bell,
  Menu,
  X,
  Crown,
  ChevronDown,
  LogOut,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Upload,
  Rocket,
} from 'lucide-react';

// Import All Role Module Components
import StoreAdminShopmaxDashboard from '../../components/dashboards/StoreAdminShopmaxDashboard';
import POSTerminalModule from '../../components/dashboards/modules/POSTerminalModule';
import ProductsManagementModule from '../../components/dashboards/modules/ProductsManagementModule';
import OrdersManagementModule from '../../components/dashboards/modules/OrdersManagementModule';
import InventoryManagementModule from '../../components/dashboards/modules/InventoryManagementModule';
import InventoryManagerDashboardPage from './InventoryManagerDashboardPage';
import CustomerSupportModule from '../../components/dashboards/modules/CustomerSupportModule';
import OffersCouponsModule from '../../components/dashboards/modules/OffersCouponsModule';
import SettingsAuditModule from '../../components/dashboards/modules/SettingsAuditModule';
import CategoriesBrandsModule from '../../components/dashboards/modules/CategoriesBrandsModule';
import DeliveryModule from '../../components/dashboards/modules/DeliveryModule';
import ReportsAnalyticsModule from '../../components/dashboards/modules/ReportsAnalyticsModule';
import ManufacturingHubModule from '../../components/dashboards/modules/ManufacturingHubModule';
import CustomizationManagementModule from '../../components/dashboards/modules/CustomizationManagementModule';
import ReleaseManagementModule from '../../components/dashboards/modules/ReleaseManagementModule';
import SEO from '../../components/common/SEO';

export const RoleDashboard = ({ initialTab = 'dashboard' }) => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Header & Modals State
  const [searchVal, setSearchVal] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Rolex',
    category: 'Luxury',
    price: '',
    sku: '',
    stock: '',
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const currentRole = user?.role || ROLES.STORE_ADMIN;

  // Exact 13 Sidebar Navigation Items in Order Specified in Prompt
  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS', icon: CreditCard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '24' },
    { id: 'products', label: 'Products', icon: Watch },
    { id: 'categories', label: 'Categories', icon: Folder },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag },
    { id: 'banners', label: 'Promotions & Banners', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: Factory },
    { id: 'releases', label: 'Release Management', icon: Rocket, badge: 'v1.1' },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  // Render the Selected Navigation Module
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <StoreAdminShopmaxDashboard
            searchQuery={searchVal}
            onNavigateTab={setActiveTab}
            onOpenAddProduct={() => setShowAddProductModal(true)}
          />
        );
      case 'pos':
        return <POSTerminalModule />;
      case 'products':
        return <ProductsManagementModule />;
      case 'categories':
        return <CategoriesBrandsModule />;
      case 'inventory':
      case 'stock_update':
      case 'stock_requests':
      case 'warehouses':
        return <InventoryManagerDashboardPage />;
      case 'orders':
      case 'payments':
        return <OrdersManagementModule />;
      case 'customers':
      case 'users':
        return (
          <CustomerSupportModule
            activeSubTab="customer_management"
            onSubTabChange={setActiveTab}
          />
        );
      case 'offers':
        return (
          <OffersCouponsModule
            activeSubTab="offers"
            onSubTabChange={setActiveTab}
          />
        );
      case 'banners':
        return (
          <OffersCouponsModule
            activeSubTab="banners"
            onSubTabChange={setActiveTab}
          />
        );
      case 'reviews':
      case 'reviews_ratings':
        return (
          <CustomerSupportModule
            activeSubTab="reviews_ratings"
            onSubTabChange={setActiveTab}
          />
        );
      case 'reports':
      case 'stock_reports':
      case 'delivery_reports':
        return <ReportsAnalyticsModule />;
      case 'manufacturing_hub':
        return <ManufacturingHubModule />;
      case 'releases':
      case 'release_management':
        return <ReleaseManagementModule />;
      case 'custom_watches':
        return <CustomizationManagementModule />;
      case 'settings':
      case 'store_settings':
        return <SettingsAuditModule />;
      case 'assigned_orders':
      case 'pick_pack':
      case 'shipments':
      case 'track_orders':
        return (
          <DeliveryModule
            activeSubTab={activeTab}
            onSubTabChange={setActiveTab}
          />
        );
      default:
        return (
          <StoreAdminShopmaxDashboard
            searchQuery={searchVal}
            onNavigateTab={setActiveTab}
            onOpenAddProduct={() => setShowAddProductModal(true)}
          />
        );
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Please fill in product name and price.');
      return;
    }
    alert(
      `✅ Success! New watch "${productForm.name}" (${productForm.brand}) added to WatchHub inventory with SKU ${productForm.sku || 'WH-NEW-001'}.`
    );
    setShowAddProductModal(false);
    setProductForm({
      name: '',
      brand: 'Rolex',
      category: 'Luxury',
      price: '',
      sku: '',
      stock: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#050B2D] text-white flex font-sans antialiased select-none">
      <SEO title="Administrative Management Portal | WatchHub" noindex={true} />
      
      {/* ════════════════════════════════════════════════════════════════
          1. FIXED LEFT SIDEBAR (Dark Indigo #101B68)
          ════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#101B68] text-white transition-all duration-300 ease-in-out border-r border-[#1E2968] flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#1E2968] flex items-center justify-between flex-shrink-0">
          <Link to="/store-admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1265FF] to-[#741BFF] flex items-center justify-center text-lg shadow-md flex-shrink-0">
              ⌚
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white leading-none">
                  Watch<span className="text-[#00D9FF]">Hub</span>
                </h2>
                <p className="text-[10px] font-semibold text-slate-300 tracking-wide mt-0.5">
                  Store Admin
                </p>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1265FF] to-[#741BFF] text-white font-bold shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!sidebarCollapsed && item.badge && (
                  <span className="bg-[#741BFF] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Bottom Upgrade Plan Card */}
          {!sidebarCollapsed && (
            <div className="pt-4 pb-2">
              <div className="rounded-2xl bg-[#0B1348] border border-[#741BFF]/40 p-4 text-white relative overflow-hidden shadow-lg group">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#741BFF]/30 flex items-center justify-center text-[#00D9FF]">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-white">Upgrade Plan</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mb-3">
                  Unlock premium features and grow your store.
                </p>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#1265FF] to-[#741BFF] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
                >
                  <span>Upgrade Now</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Store Admin User Profile at Very Bottom */}
        <div className="p-3 border-t border-[#1E2968] flex-shrink-0 relative">
          <div
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[#1E2968]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Shreya Yadav"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-full bg-gradient-to-tr from-[#1265FF] to-[#741BFF] items-center justify-center text-white font-bold text-xs hidden">
                  SY
                </div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    Shreya Yadav
                  </p>
                  <p className="text-[10px] text-slate-300">Store Admin</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {/* Profile Dropdown */}
          {profileMenuOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-[#081033] border border-[#1E2968] rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fadeIn">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="font-bold text-white">Shreya Yadav</p>
                <p className="text-[10px] text-slate-400">admin@watchhub.luxury</p>
              </div>

              <Link
                to="/"
                onClick={() => setProfileMenuOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span>🛍️</span> View Customer Store
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setProfileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          2. MAIN CONTENT AREA (Header + Body)
          ════════════════════════════════════════════════════════════════ */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 h-16 bg-[#050B2D]/95 backdrop-blur-md border-b border-[#1E2968] px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar (Exact ShopMax Style) */}
            <div className="relative w-64 sm:w-80 md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search watches, orders, customers..."
                className="w-full h-10 pl-10 pr-4 text-xs rounded-full bg-[#0B1445] text-white placeholder-slate-400 border border-[#1E2968] focus:border-[#1265FF] outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Calendar Icon Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="w-10 h-10 rounded-xl bg-[#0B1445] hover:bg-[#101E5E] border border-[#1E2968] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Calendar & Date Range"
              >
                <Calendar className="w-4 h-4" />
              </button>

              {calendarOpen && (
                <div className="absolute right-0 top-12 w-64 bg-[#081033] border border-[#1E2968] rounded-2xl shadow-2xl p-3 z-50 text-xs animate-fadeIn">
                  <p className="font-bold text-white mb-2 pb-1 border-b border-white/10">
                    Store Calendar & Fiscal Filter
                  </p>
                  <div className="space-y-1">
                    {[
                      'Today (Nov 14, 2026)',
                      'This Week (Nov 9 – 15, 2026)',
                      'Last Week',
                      'This Month (November 2026)',
                      'Fiscal Q4 2026',
                    ].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          alert(`Selected Range: ${d}`);
                          setCalendarOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:bg-[#1265FF] hover:text-white transition-colors cursor-pointer"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button with Unread Badge '3' */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-xl bg-[#0B1445] hover:bg-[#101E5E] border border-[#1E2968] text-slate-300 hover:text-white flex items-center justify-center relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#FF35C8] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-[#081033] border border-[#1E2968] rounded-2xl shadow-2xl p-3 z-50 text-xs animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="font-bold text-white">Notifications</span>
                    <span className="text-[10px] font-semibold text-[#00D9FF]">3 Unread</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-[#0B1445] border border-white/5 space-y-0.5">
                      <p className="font-bold text-white text-[11px]">
                        💎 High-Value Order Placed
                      </p>
                      <p className="text-slate-300 text-[10px]">
                        #ORD-1256 (Rolex Submariner - ₹1,50,750) by John Doe.
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0B1445] border border-white/5 space-y-0.5">
                      <p className="font-bold text-amber-400 text-[11px]">
                        ⚠️ Low Stock Warning
                      </p>
                      <p className="text-slate-300 text-[10px]">
                        Omega Speedmaster inventory has only 8 units remaining.
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0B1445] border border-white/5 space-y-0.5">
                      <p className="font-bold text-[#00D9FF] text-[11px]">
                        ⭐ 5-Star Luxury Review
                      </p>
                      <p className="text-slate-300 text-[10px]">
                        Customer verified rating on Chronoswiss Tourbillon Paraiba.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* + Add Product Button */}
            <button
              type="button"
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#741BFF] to-[#1265FF] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

          </div>
        </header>

        {/* Main Dashboard Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: ADD NEW LUXURY WATCH PRODUCT
          ════════════════════════════════════════════════════════════════ */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-lg w-full border border-[#1E2968] p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-[#1E2968] mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1265FF] to-[#741BFF] flex items-center justify-center text-white font-bold">
                ⌚
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Add New Luxury Watch</h3>
                <p className="text-xs text-slate-400">
                  Add timepiece to catalog, POS & online inventory
                </p>
              </div>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Watch Model Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rolex Submariner Date 41mm"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full bg-[#081033] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-[#1265FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) =>
                      setProductForm({ ...productForm, brand: e.target.value })
                    }
                    className="w-full bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#1265FF]"
                  >
                    <option value="Rolex">Rolex</option>
                    <option value="Omega">Omega</option>
                    <option value="TAG Heuer">TAG Heuer</option>
                    <option value="Patek Philippe">Patek Philippe</option>
                    <option value="Tissot">Tissot</option>
                    <option value="Chronoswiss">Chronoswiss</option>
                    <option value="Cartier">Cartier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category: e.target.value })
                    }
                    className="w-full bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#1265FF]"
                  >
                    <option value="Luxury">Luxury Watches</option>
                    <option value="Men">Men's Horology</option>
                    <option value="Women">Women's Horology</option>
                    <option value="Sports">Sports Chronographs</option>
                    <option value="Smartwatches">Smartwatches</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="980000"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-[#1265FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="WH-ROL-009"
                    value={productForm.sku}
                    onChange={(e) =>
                      setProductForm({ ...productForm, sku: e.target.value })
                    }
                    className="w-full bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-[#1265FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    className="w-full bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-[#1265FF]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#741BFF] to-[#1265FF] hover:opacity-95 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Watch Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL: UPGRADE TO PRO MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-md w-full border border-[#741BFF]/40 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#00D9FF] mb-2">
              <Crown className="w-5 h-5" />
              <span className="font-bold text-lg text-white">WatchHub Enterprise Plan</span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Unlock multi-boutique POS sync, automated supplier purchase orders, and AI concierge forecasting.
            </p>

            <div className="space-y-2 text-xs mb-5">
              {[
                'Unlimited POS Terminals & Barcode Scanners',
                'Multi-Currency GST & VAT Ledger Exports',
                'Predictive AI Demand Analytics',
                '24×7 Swiss Atelier Concierge Support',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-[#00D9FF] flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                alert('✨ Enterprise Plan Activated for Demo Session!');
                setShowUpgradeModal(false);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1265FF] to-[#741BFF] text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoleDashboard;
