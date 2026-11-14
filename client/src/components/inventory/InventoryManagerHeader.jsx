import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Building2,
  Bell,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';

export default function InventoryManagerHeader({
  onToggleSidebar,
  selectedWarehouse,
  onSelectWarehouse,
  onSearch,
  onOpenNotifications,
  onOpenSupport,
}) {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [warehouseDropdownOpen, setWarehouseDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const warehouses = ['All Warehouses', 'Main Warehouse', 'Delhi Warehouse', 'Mumbai Warehouse'];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleRoleChange = (targetRole) => {
    switchRole(targetRole);
    setProfileDropdownOpen(false);
    if (targetRole === ROLES.INVENTORY_MANAGER) {
      navigate('/inventory-manager/dashboard');
    } else if (targetRole === ROLES.STORE_ADMIN) {
      navigate('/store-admin/dashboard');
    } else if (targetRole === ROLES.DELIVERY_MANAGER) {
      navigate('/delivery-manager/dashboard');
    } else if (targetRole === ROLES.CUSTOMER_SUPPORT) {
      navigate('/customer-support/dashboard');
    } else if (targetRole === ROLES.SUPER_ADMIN) {
      navigate('/super-admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#071426] border-b border-white/10 px-4 md:px-6 flex items-center justify-between text-white select-none">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by Product, SKU, Barcode, or PO..."
            className="w-full bg-[#0d1e38] border border-white/10 rounded-xl pl-10 pr-16 py-2 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-hidden focus:border-[#D6A63C] focus:ring-1 focus:ring-[#D6A63C] transition-all"
          />
          <span className="hidden sm:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-wider text-gray-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
            Ctrl + K
          </span>
        </div>
      </div>

      {/* Right: Warehouse Filter, Notifications, Profile Dropdown */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Warehouse Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setWarehouseDropdownOpen(!warehouseDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d1e38] border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:border-[#D6A63C]/50 transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#D6A63C]" />
            <span>{selectedWarehouse || 'All Warehouses'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {warehouseDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0a192f] border border-white/15 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider border-b border-white/10">
                Filter by Warehouse
              </div>
              {warehouses.map((wh) => (
                <button
                  key={wh}
                  type="button"
                  onClick={() => {
                    if (onSelectWarehouse) onSelectWarehouse(wh);
                    setWarehouseDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                    (selectedWarehouse || 'All Warehouses') === wh
                      ? 'text-[#D6A63C] font-bold bg-white/5'
                      : 'text-gray-300'
                  }`}
                >
                  <span>{wh}</span>
                  {(selectedWarehouse || 'All Warehouses') === wh && (
                    <Check className="w-3.5 h-3.5 text-[#D6A63C]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications with Red Badge '3' */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-hidden cursor-pointer"
          title="Stock Alerts & Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#071426]">
            3
          </span>
        </button>

        {/* View Customer Store Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-[#D6A63C] hover:bg-white/5 border border-white/10 transition-all"
          title="Preview Customer Storefront"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Store</span>
        </a>

        {/* User Profile Avatar 'SY' + Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 md:pl-2 md:pr-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer focus:outline-hidden"
          >
            {/* Avatar Pill 'SY' */}
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#D6A63C]/60 shadow-md">
              SY
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user?.name || 'Inventory Manager'}
              </span>
              <span className="text-[10px] text-[#D6A63C] font-semibold leading-none">
                Inventory Manager
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0a192f] border border-white/15 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in text-xs">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="font-bold text-white text-sm">{user?.name || 'Rajesh Mehta'}</p>
                <p className="text-gray-400 text-[11px] truncate">{user?.email || 'inventory@watchhub.com'}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D6A63C]/15 text-[#D6A63C] text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Role: Inventory Manager</span>
                </div>
              </div>

              {/* Role Switcher Menu (Seamless Testing) */}
              <div className="py-1 border-b border-white/10">
                <div className="px-4 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Switch Role Portal
                </div>
                {Object.values(ROLES).map((roleName) => (
                  <button
                    key={roleName}
                    type="button"
                    onClick={() => handleRoleChange(roleName)}
                    className={`w-full flex items-center justify-between px-4 py-1.5 text-left transition-colors ${
                      user?.role === roleName
                        ? 'text-[#D6A63C] font-bold bg-white/5'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{roleName}</span>
                    {user?.role === roleName && <Check className="w-3.5 h-3.5 text-[#D6A63C]" />}
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
