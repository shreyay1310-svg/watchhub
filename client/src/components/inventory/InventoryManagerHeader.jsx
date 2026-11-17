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
  warehouses = [],
  reorderAlertsCount = 18,
}) {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [warehouseDropdownOpen, setWarehouseDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const warehouseOptions = ['All Warehouses', ...warehouses.map((w) => w.name || w)];

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
    <header className="sticky top-0 z-30 h-16 bg-[#11123D] border-b border-[#29305D] px-4 md:px-6 flex items-center justify-between text-white select-none shadow-md">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#A7B1C2] hover:text-white hover:bg-[#17165A] transition-colors focus:outline-hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by Product, SKU, Barcode, or PO..."
            className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-10 pr-16 py-2 text-xs md:text-sm text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF] focus:ring-1 focus:ring-[#6500FF] transition-all"
          />
          <span className="hidden sm:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-wider text-[#A7B1C2] bg-[#11123D] px-1.5 py-0.5 rounded border border-[#29305D]">
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
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#17165A] border border-[#29305D] text-xs font-semibold text-gray-200 hover:text-white hover:border-[#6500FF] transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#E9B94F]" />
            <span>{selectedWarehouse || 'All Warehouses'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#A7B1C2]" />
          </button>

          {warehouseDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#11123D] border border-[#29305D] shadow-2xl py-2 z-50 text-xs animate-fade-in">
              <div className="px-3 py-1 text-[10px] font-bold text-[#A7B1C2] uppercase tracking-wider">
                Filter by Vault Location
              </div>
              {warehouseOptions.map((wh) => (
                <button
                  key={wh}
                  type="button"
                  onClick={() => {
                    if (onSelectWarehouse) onSelectWarehouse(wh);
                    setWarehouseDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-[#17165A] text-left text-gray-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{wh}</span>
                  {selectedWarehouse === wh && <Check className="w-3.5 h-3.5 text-[#00D5FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-[#A7B1C2] hover:text-white hover:bg-[#17165A] transition-colors focus:outline-hidden cursor-pointer"
          title="Reorder Notifications"
        >
          <Bell className="w-5 h-5" />
          {reorderAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-[#17165A] border border-[#29305D] hover:border-[#6500FF] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#E9B94F] flex items-center justify-center font-black text-xs text-white">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'IM'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user?.name || 'Suresh Patel'}
              </span>
              <span className="text-[10px] font-semibold text-[#E9B94F] leading-tight">
                Inventory Manager
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#A7B1C2]" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#11123D] border border-[#29305D] shadow-2xl p-2 z-50 text-xs animate-fade-in">
              <div className="px-3 py-2 border-b border-[#29305D]/80">
                <p className="font-bold text-white text-xs">{user?.name || 'Suresh Patel'}</p>
                <p className="text-[11px] text-[#A7B1C2]">{user?.email || 'inventory@watchhub.luxury'}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                    Authorized Manager
                  </span>
                </div>
              </div>

              {/* Role Switcher Demo */}
              <div className="py-2 border-b border-[#29305D]/80">
                <span className="px-3 text-[10px] font-bold text-[#A7B1C2] uppercase tracking-wider block mb-1">
                  Switch Staff Workspace
                </span>
                {MOCK_STAFF_ACCOUNTS &&
                  Object.keys(MOCK_STAFF_ACCOUNTS).map((accKey) => {
                    const acc = MOCK_STAFF_ACCOUNTS[accKey];
                    const isCurrent = user?.role === acc.role;
                    return (
                      <button
                        key={accKey}
                        type="button"
                        onClick={() => handleRoleChange(acc.role)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#17165A] text-[#00D5FF] font-bold'
                            : 'text-[#A7B1C2] hover:bg-[#17165A]/50 hover:text-white'
                        }`}
                      >
                        <span className="text-[11px]">{acc.role}</span>
                        {isCurrent && <Check className="w-3 h-3 text-[#00D5FF]" />}
                      </button>
                    );
                  })}
              </div>

              {/* Logout */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="font-semibold">Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
