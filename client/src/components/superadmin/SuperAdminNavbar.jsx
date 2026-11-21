import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export default function SuperAdminNavbar({
  user,
  onLogout,
  onOpenSearch,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  onNavigate,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070B17]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle + Logo + Super Admin Command */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
          aria-label="Toggle Navigation Drawer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D6A33A] via-[#B88728] to-[#8C601E] flex items-center justify-center shadow-lg shadow-[#D6A33A]/10 border border-[#F6C453]/40">
            <ShieldCheck className="w-5 h-5 text-black font-extrabold" />
          </div>
          <div>
            <span className="font-serif text-sm font-bold tracking-wider text-white block">
              WATCHHUB ATELIER
            </span>
            <span className="text-[9.5px] tracking-widest text-[#D6A33A] font-bold uppercase block -mt-0.5">
              SUPER ADMIN COMMAND
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block h-6 w-px bg-white/10 mx-2" />
      </div>

      {/* Middle: Global Search Input with Ctrl + K */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full h-10 px-3.5 rounded-xl bg-[#0B1222] border border-white/10 hover:border-[#D6A33A]/50 text-left text-xs text-gray-400 flex items-center justify-between transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-gray-400 group-hover:text-[#D6A33A] transition-colors" />
            <span className="text-gray-400 text-xs">Search anything... (users, roles, modules, etc.)</span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10.5px] text-gray-400 font-mono">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls: DB Online + Notifications + Profile Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Database Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>DB Online</span>
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D6A33A] text-black font-extrabold text-[10px] flex items-center justify-center shadow-md">
              3
            </span>
          </button>
        </div>

        {/* Profile Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D6A33A]/20 to-[#8C601E]/40 border border-[#D6A33A]/50 flex items-center justify-center text-sm shadow-sm text-[#F6C453]">
              👑
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <div className="font-bold text-white tracking-wide">{user?.name || 'Vikram Malhotra'}</div>
              <div className="text-[10px] text-[#D6A33A] font-semibold">Super Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Box */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-[#0B1222] border border-[#D6A33A]/30 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in text-xs">
              <div className="p-3 border-b border-white/10 mb-1">
                <div className="font-bold text-white text-sm">{user?.name || 'Vikram Malhotra'}</div>
                <div className="text-gray-400 text-[11px] truncate">{user?.email || 'superadmin@watchhub.com'}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D6A33A]/15 text-[#D6A33A] border border-[#D6A33A]/30">
                  <span>Level 1 — Supreme Control</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('users');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#D6A33A]" />
                  <span>Users Governance</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#D6A33A]" />
                  <span>Platform Settings</span>
                </button>
              </div>

              <div className="pt-2 mt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Secure Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
