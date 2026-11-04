import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, ChevronDown, CheckCircle, ExternalLink, LogOut } from 'lucide-react';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';

// Role-specific upper horizontal navigation modules
export const DASHBOARD_MODULES = {
  [ROLES.SUPER_ADMIN]: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: '🏭' },
    { id: 'users', label: 'Users & Roles', icon: '👥' },
    { id: 'products', label: 'Products', icon: '⌚' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'offers', label: 'Offers & Coupons', icon: '🏷️' },
    { id: 'banners', label: 'Banners', icon: '🖼️' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
  ],
  [ROLES.STORE_ADMIN]: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: '🏭' },
    { id: 'products', label: 'Products', icon: '⌚' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'offers', label: 'Offers & Coupons', icon: '🏷️' },
    { id: 'banners', label: 'Banners & Promotions', icon: '🖼️' },
    { id: 'reviews', label: 'Reviews & Ratings', icon: '⭐' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'store_settings', label: 'Store Settings', icon: '⚙️' },
  ],
  [ROLES.INVENTORY_MANAGER]: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: '🏭' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'stock_update', label: 'Stock Update', icon: '🔄' },
    { id: 'stock_requests', label: 'Stock Requests', icon: '📋' },
    { id: 'products', label: 'Products', icon: '⌚' },
    { id: 'warehouses', label: 'Warehouses', icon: '🏢' },
    { id: 'stock_reports', label: 'Stock Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ],
  [ROLES.DELIVERY_MANAGER]: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: '🏭' },
    { id: 'assigned_orders', label: 'Assigned Orders', icon: '📋' },
    { id: 'pick_pack', label: 'Pick & Pack', icon: '📦' },
    { id: 'shipments', label: 'Shipments', icon: '🚚' },
    { id: 'track_orders', label: 'Track Orders', icon: '📍' },
    { id: 'returns', label: 'Returns & Cancellations', icon: '🔄' },
    { id: 'delivery_reports', label: 'Delivery Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ],
  [ROLES.CUSTOMER_SUPPORT]: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: '🏭' },
    { id: 'support_tickets', label: 'Support Tickets', icon: '🎫' },
    { id: 'customer_queries', label: 'Customer Queries', icon: '💬' },
    { id: 'orders_lookup', label: 'Orders Lookup', icon: '🔍' },
    { id: 'returns_refunds', label: 'Returns & Refunds', icon: '🔄' },
    { id: 'complaints', label: 'Complaints', icon: '⚠️' },
    { id: 'reviews_ratings', label: 'Reviews & Ratings', icon: '⭐' },
    { id: 'customer_management', label: 'Customer Management', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ],
  [ROLES.CUSTOMER]: [
    { id: 'dashboard', label: 'Customer Portal', icon: '🛍️' },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: '🏭' },
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'support_tickets', label: 'Helpdesk & Queries', icon: '🎧' },
  ],
};

export const DashboardHeader = ({ activeTab, onTabChange }) => {
  const { user, switchRole, logout } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const currentRole = user?.role || ROLES.SUPER_ADMIN;
  const modules = DASHBOARD_MODULES[currentRole] || DASHBOARD_MODULES[ROLES.SUPER_ADMIN];

  return (
    <header className="sticky top-0 z-50 bg-watch-navy border-b border-gray-800 font-poppins">
      {/* 1. Dark Navy Main Header */}
      <div className="px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-watch-gold flex items-center justify-center text-lg border border-watch-gold/40 shadow">
              ⌚
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white leading-none">
                Watch<span className="text-watch-gold">Hub</span>
              </h1>
              <p className="text-[9px] text-gray-400 mt-0.5">Premium Watches for Every Style</p>
            </div>
          </Link>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-lg relative hidden md:block">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search orders, users, products, reports..."
            className="w-full h-9 pl-4 pr-10 text-xs rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/15 focus:bg-white/15 focus:border-watch-gold outline-none transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-watch-gold">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Customer Storefront Link */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-watch-gold hover:bg-watch-gold-dark text-watch-navy-dark px-3 py-1.5 rounded-full transition-colors shadow-sm"
          >
            <span>View Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Notifications */}
          <button
            onClick={() => alert('5 New Platform Notifications: 2 high-value orders placed, 1 low-stock alert on Chronograph, 2 support tickets opened.')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-watch-navy">
              5
            </span>
          </button>

          {/* System Settings */}
          <button
            onClick={() => alert('Settings: RBAC permissions, Payment Gateway (Razorpay Sandbox), Database connection live.')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-watch-gold/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            >
              <span className="text-sm">{user?.avatar || '👑'}</span>
              <span>{currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 text-xs text-gray-800">
                <div className="px-3.5 py-1.5 border-b border-gray-100 text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                  Switch Role Dashboard
                </div>

                {Object.values(ROLES).filter(r => r !== ROLES.CUSTOMER).map((r) => {
                  const staff = MOCK_STAFF_ACCOUNTS[r];
                  const isActive = currentRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        isActive ? 'bg-amber-50/70 text-watch-gold-dark font-bold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{staff?.avatar}</span>
                        <span>{r}</span>
                      </div>
                      {isActive && <CheckCircle className="w-3.5 h-3.5 text-watch-gold" />}
                    </button>
                  );
                })}

                <div className="border-t border-gray-100 mt-1.5 pt-1">
                  <button
                    onClick={() => {
                      switchRole(ROLES.CUSTOMER);
                      setRoleMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-3.5 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span>👤</span> Customer Storefront
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setRoleMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Upper Horizontal Navigation Modules (Matching Reference Designs) */}
      <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto scrollbar-none flex items-center gap-2 py-1.5">
        {modules.map((m) => {
          const isSelected = activeTab === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onTabChange && onTabChange(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default DashboardHeader;

