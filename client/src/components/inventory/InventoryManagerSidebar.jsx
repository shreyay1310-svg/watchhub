import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Boxes,
  PieChart,
  Box,
  ArrowRightLeft,
  SlidersHorizontal,
  Building2,
  Bell,
  FileSpreadsheet,
  BarChart3,
  History,
  Settings,
  X,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function InventoryManagerSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  activeTab,
  onSelectTab,
  reorderAlertsCount = 18,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Exactly matching the 11 inventory navigation modules from the specification
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Boxes, path: '/inventory-manager/dashboard' },
    { id: 'overview', label: 'Stock Overview', icon: PieChart, path: '/inventory-manager/stock-overview' },
    { id: 'stock', label: 'Inventory (Stock)', icon: Box, path: '/inventory-manager/inventory' },
    { id: 'movements', label: 'Stock Movements', icon: ArrowRightLeft, path: '/inventory-manager/stock-movements' },
    { id: 'adjustments', label: 'Stock Adjustments', icon: SlidersHorizontal, path: '/inventory-manager/stock-adjustments' },
    { id: 'warehouses', label: 'Warehouse Management', icon: Building2, path: '/inventory-manager/warehouses' },
    { id: 'reorder', label: 'Reorder Alerts', icon: Bell, badge: reorderAlertsCount ? `${reorderAlertsCount}` : null, path: '/inventory-manager/reorder-alerts' },
    { id: 'requests', label: 'Purchase Requests', icon: FileSpreadsheet, path: '/inventory-manager/purchase-requests' },
    { id: 'reports', label: 'Stock Reports', icon: BarChart3, path: '/inventory-manager/reports' },
    { id: 'history', label: 'Inventory History', icon: History, path: '/inventory-manager/history' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/inventory-manager/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#17165A] text-white border-r border-[#29305D] flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#29305D] bg-[#11123D]/50 shrink-0">
          <Link
            to="/inventory-manager/dashboard"
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            {/* Gold watch icon container */}
            <div className="w-10 h-10 rounded-xl bg-[#E9B94F]/15 border border-[#E9B94F]/40 flex items-center justify-center text-[#E9B94F] shadow-inner group-hover:scale-105 transition-transform text-lg">
              ⌚
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white leading-none">
                  WatchHub
                </span>
                <span className="text-[11px] font-bold text-[#E9B94F] tracking-wide mt-1">
                  Inventory Manager
                </span>
              </div>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (11 Dedicated Inventory Modules) */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id || location.pathname === item.path;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (onSelectTab) onSelectTab(item.id);
                  if (item.path) navigate(item.path);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold shadow-lg shadow-[#6500FF]/30 border border-white/15'
                    : 'text-[#A7B1C2] hover:text-white hover:bg-[#11123D]'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isSelected ? 'text-[#00D5FF]' : 'text-[#A7B1C2] group-hover:text-white'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {/* Optional Right Badge (e.g. Reorder Alerts) */}
                {!collapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-red-500/90 text-white shadow-xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM SIDEBAR (Required: Logged-in employee profile, name, designation, profile settings, logout) */}
        <div className="p-3 border-t border-[#29305D] bg-[#11123D]/60 shrink-0">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#E9B94F] flex items-center justify-center font-black text-xs text-white shrink-0 border border-white/20">
                  SP
                </div>
                <div className="truncate flex-1">
                  <h4 className="text-xs font-bold text-white truncate">Suresh Patel</h4>
                  <p className="text-[10px] text-[#E9B94F] font-semibold truncate">Inventory Manager</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectTab) onSelectTab('settings');
                    navigate('/inventory-manager/settings');
                  }}
                  className="py-1.5 px-2 rounded-lg bg-[#17165A] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white flex items-center justify-center gap-1 border border-[#29305D] transition-colors cursor-pointer"
                  title="Profile & Vault Settings"
                >
                  <Settings className="w-3.5 h-3.5 text-[#00D5FF]" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout && logout()}
                  className="py-1.5 px-2 rounded-lg bg-[#17165A] hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1 border border-[#29305D] transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6500FF] to-[#E9B94F] flex items-center justify-center font-bold text-xs text-white"
                title="Suresh Patel (Inventory Manager)"
              >
                SP
              </div>
              <button
                type="button"
                onClick={() => logout && logout()}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
