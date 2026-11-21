import React, { useState } from 'react';
import {
  Search,
  Bell,
  Star,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bike,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RiderHeader = ({
  isOnDuty,
  setIsOnDuty,
  searchQuery,
  setSearchQuery,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  unreadNotifications = 3,
}) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleDutyToggle = async () => {
    const nextState = !isOnDuty;
    setIsOnDuty(nextState);
    try {
      await fetch('/api/rider/duty', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnDuty: nextState }),
      });
    } catch (e) {
      console.warn('Duty status sync note:', e);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#070B18]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Left: Mobile Toggle & WatchHub Partner Branding */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 border border-white/10"
          aria-label="Toggle Navigation Drawer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Shield & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F2FE]/20 to-[#A855F7]/20 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.25)]">
            <Shield className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-white font-serif">
                WatchHub Partner
              </span>
            </div>
            <p className="text-[10px] font-semibold text-[#00F2FE] tracking-wider uppercase">
              Rider Delivery App
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search orders, customers, or parcel ID..."
            className="w-full pl-10 pr-16 py-2 bg-[#0B1022] border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-hidden focus:border-[#00F2FE]/60 focus:ring-1 focus:ring-[#00F2FE]/40 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] text-gray-400 font-mono">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right Controls: ON/OFF Duty, Notifications, Profile, Direct Logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* On Duty / Off Duty Pill Toggle */}
        <button
          type="button"
          onClick={handleDutyToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
            isOnDuty
              ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'bg-gray-800/60 border-gray-700 text-gray-400'
          }`}
          title="Toggle Availability"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnDuty
                ? 'bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse'
                : 'bg-gray-500'
            }`}
          />
          <span className="text-xs font-black tracking-wide">
            {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-[#0B1022] border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0B1022] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white">Rider Notifications</span>
                <span className="text-[10px] text-cyan-400 font-semibold">{unreadNotifications} New</span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <p className="font-semibold text-white">4 Parcels Assigned</p>
                  <p className="text-[11px] text-gray-400">Gomti Nagar & Hazratganj route ready.</p>
                  <span className="text-[9px] text-cyan-400">10 mins ago</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <p className="font-semibold text-emerald-400">Payout Credited</p>
                  <p className="text-[11px] text-gray-400">Weekly earnings ₹12,450 deposited.</p>
                  <span className="text-[9px] text-gray-400">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill (Rohan Singh ★ 4.5) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#0B1022] border border-white/10 hover:border-cyan-400/40 transition-colors cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Rohan Singh"
              className="w-7 h-7 rounded-lg object-cover border border-cyan-400/40 shrink-0"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
              }}
            />
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">
                {user?.name || 'Rohan Singh'}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.5</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0B1022] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
              <div className="p-2 border-b border-white/10 mb-1">
                <p className="font-bold text-white">{user?.name || 'Rohan Singh'}</p>
                <p className="text-[10px] text-cyan-400 font-mono">EMP-RD-01 • Lucknow Central</p>
              </div>
              <div className="px-2 py-1 text-gray-300">
                Vehicle: <strong className="text-white">Honda Activa (UP 32)</strong>
              </div>
              <div className="px-2 py-1 text-gray-300">
                Duty: <strong className={isOnDuty ? 'text-emerald-400' : 'text-gray-400'}>{isOnDuty ? 'Active / On Duty' : 'Off Duty'}</strong>
              </div>
              <div className="border-t border-white/10 pt-1 mt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Direct Standalone Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default RiderHeader;
