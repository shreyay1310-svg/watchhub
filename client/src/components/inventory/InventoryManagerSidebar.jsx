import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  HelpCircle,
  X,
  ChevronRight,
} from 'lucide-react';

export default function InventoryManagerSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  activeTab,
  onSelectTab,
  onOpenSupport,
}) {
  const location = useLocation();

  // Exactly matching the 11 inventory navigation items from reference UI
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Boxes },
    { id: 'overview', label: 'Stock Overview', icon: PieChart },
    { id: 'stock', label: 'Inventory (Stock)', icon: Box },
    { id: 'movements', label: 'Stock Movements', icon: ArrowRightLeft },
    { id: 'adjustments', label: 'Stock Adjustments', icon: SlidersHorizontal },
    { id: 'warehouses', label: 'Warehouse Management', icon: Building2 },
    { id: 'reorder', label: 'Reorder Alerts', icon: Bell, badge: '18' },
    { id: 'requests', label: 'Purchase Requests', icon: FileSpreadsheet },
    { id: 'reports', label: 'Stock Reports', icon: BarChart3 },
    { id: 'history', label: 'Inventory History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#071426] text-white border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link
            to="/inventory-manager/dashboard"
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            {/* Gold watch icon outline container */}
            <div className="w-10 h-10 rounded-xl bg-[#D6A63C]/15 border border-[#D6A63C]/40 flex items-center justify-center text-[#D6A63C] shadow-inner group-hover:scale-105 transition-transform">
              ⌚
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white leading-none">
                  WatchHub
                </span>
                <span className="text-[11px] font-semibold text-[#D6A63C] tracking-wide mt-0.5">
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

        {/* Navigation Items (11 Inventory-Only Modules) */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (onSelectTab) onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all group cursor-pointer ${
                  isSelected
                    ? 'bg-[#D6A63C] text-[#071426] font-bold shadow-md shadow-[#D6A63C]/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isSelected ? 'text-[#071426]' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {/* Optional Right Badge (e.g. Reorder Alerts '18') */}
                {!collapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : 'bg-red-500 text-white shadow-xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom "Need Help?" Card matching reference UI */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-[#0c2242] to-[#071426] border border-white/10 text-xs shadow-lg">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#D6A63C]/20 text-[#D6A63C] flex items-center justify-center shrink-0">
                📦
              </div>
              <div>
                <h4 className="font-bold text-white text-[13px]">Need Help?</h4>
                <p className="text-gray-400 text-[11px] leading-tight">
                  Inventory operations &amp; stock support.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenSupport}
              className="w-full mt-1 py-1.5 px-3 rounded-xl bg-[#D6A63C] hover:bg-[#c49532] text-[#071426] font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow cursor-pointer"
            >
              <span>Contact Support</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
