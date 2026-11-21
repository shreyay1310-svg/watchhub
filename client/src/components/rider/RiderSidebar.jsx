import React from 'react';
import {
  LayoutDashboard,
  PackageCheck,
  CheckSquare,
  IndianRupee,
  Clock,
  TrendingUp,
  User,
  HelpCircle,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RiderSidebar = ({
  activeTab = 'dashboard',
  setActiveTab,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  assignedCount = 4,
}) => {
  const { logout } = useAuth();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assigned', label: 'Assigned Deliveries', icon: PackageCheck, badge: assignedCount },
    { id: 'completed', label: 'Completed Orders', icon: CheckSquare },
    { id: 'earnings', label: 'Earnings & Payouts', icon: IndianRupee },
    { id: 'history', label: 'Delivery History', icon: Clock },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tabId) => {
    if (setActiveTab) setActiveTab(tabId);
    if (setMobileSidebarOpen) setMobileSidebarOpen(false);
  };

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-64px)] w-64 bg-[#070B18] border-r border-white/10 flex flex-col justify-between p-3.5 transition-transform duration-300 ease-in-out select-none ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Navigation Menu */}
      <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#00F2FE] to-[#00D9E8] text-[#050816] shadow-[0_0_20px_rgba(0,242,254,0.35)] font-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#050816]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-[#050816] text-[#00F2FE]'
                      : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Sidebar: Luxury Horology Graphic + Direct Logout */}
      <div className="pt-3 border-t border-white/10 space-y-2 shrink-0">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0E1630] to-[#070B18] border border-white/10 p-3 text-center shadow-lg group">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute inset-0 bg-radial from-[#F59E0B]/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Pedestal Watch Art */}
          <div className="relative w-16 h-16 mx-auto mb-1 flex items-center justify-center">
            <div className="absolute inset-x-2 bottom-0 h-4 bg-[#F59E0B]/20 blur-md rounded-full" />
            <img
              src="/images/products/rolex-submariner.png"
              alt="WatchHub Horology"
              className="w-14 h-14 object-contain filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/images/products/featured_rolex_submariner.jpg';
              }}
            />
          </div>

          <h4 className="text-xs font-black text-white tracking-wide font-serif">
            WatchHub Partner
          </h4>
          <p className="text-[10px] text-[#00F2FE] font-bold tracking-wider uppercase mt-0.5">
            Delivery Excellence
          </p>
        </div>

        {/* Immediate Direct Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
          title="Sign Out of Partner Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default RiderSidebar;
