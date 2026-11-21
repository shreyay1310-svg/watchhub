import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  User,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  CheckCircle,
  Truck,
  AlertTriangle,
  RotateCcw,
  X,
  Package,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export const DeliveryManagerHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenCreateShipment,
  onOpenSupportModal,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) +
          ' • ' +
          now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Failed Delivery Alert',
      desc: 'Order #WH-ORD-9025 delivery attempt failed (Phone unreachable)',
      time: '10m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'New Return Request',
      desc: 'Return #RET-2026-081 created for Rolex Daytona (Size issue)',
      time: '35m ago',
      type: 'info',
    },
    {
      id: 3,
      title: 'High-Value Order Confirmed',
      desc: 'Order #WH-ORD-9026 (Audemars Piguet ₹58,000) ready for assignment',
      time: '1h ago',
      type: 'success',
    },
  ];

  return (
    <header className="h-16 bg-[#081529]/95 backdrop-blur-md border-b border-[#28334B] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 text-white select-none">
      {/* Left: Sidebar Toggle & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setMobileSidebarOpen && setMobileSidebarOpen(!mobileSidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          className="p-2 rounded-xl text-[#A7B1C2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-[#A7B1C2]">
            <span className="font-semibold text-white">Logistics Hub</span>
            <span>/</span>
            <span className="text-[#E9B94F] font-bold capitalize">
              {(activeTab || 'dashboard').replace(/-/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Logistics Search Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-delivery-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, AWB, Customer or Rider..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#11172C] border border-[#28334B] text-xs text-white placeholder-[#A7B1C2]/60 focus:outline-none focus:border-[#6500FF] focus:ring-1 focus:ring-[#6500FF] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C2] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Date/Time Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#11172C] border border-[#28334B] text-[11px] font-semibold text-[#A7B1C2]">
          <Clock className="w-3.5 h-3.5 text-[#00D5FF]" />
          <span>{currentTime}</span>
        </div>

        {/* View Store Button */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#28334B] text-xs font-semibold text-[#A7B1C2] hover:text-white transition-all cursor-pointer"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Help & Support Button */}
        <button
          onClick={onOpenSupportModal}
          className="p-2 rounded-xl bg-[#11172C] hover:bg-white/10 border border-[#28334B] text-[#A7B1C2] hover:text-white transition-colors cursor-pointer"
          title="Help & Logistics Support"
        >
          <HelpCircle className="w-4 h-4 text-[#E9B94F]" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-[#11172C] hover:bg-white/10 border border-[#28334B] text-[#A7B1C2] hover:text-white transition-colors cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4966] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4966]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#11172C] rounded-2xl shadow-2xl border border-[#28334B] p-4 z-50 text-xs animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span>Logistics Alerts</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#6500FF] text-white">
                    3
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#A7B1C2] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#6500FF]/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setNotificationsOpen(false);
                      if (n.title.includes('Return')) setActiveTab('returns');
                      else if (n.title.includes('Failed')) setActiveTab('attempts');
                      else setActiveTab('assign');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{n.title}</span>
                      <span className="text-[10px] text-[#A7B1C2]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#A7B1C2] mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#28334B] text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    setActiveTab('orders');
                  }}
                  className="text-[#00D5FF] hover:underline font-semibold text-[11px]"
                >
                  View All Orders & Deliveries →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Manager Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#11172C] hover:bg-white/10 border border-[#28334B] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] flex items-center justify-center text-xs font-bold text-white shadow-xs">
              KV
            </div>
            <div className="hidden md:block text-left leading-tight">
              <span className="text-xs font-bold text-white block">
                {user?.name || 'Karan Verma'}
              </span>
              <span className="text-[9.5px] text-[#E9B94F] font-semibold block">
                Delivery Manager
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#A7B1C2]" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#11172C] rounded-2xl shadow-2xl border border-[#28334B] py-2 z-50 text-xs animate-fade-in">
              <div className="px-4 py-2 border-b border-[#28334B]">
                <p className="font-bold text-white">{user?.name || 'Karan Verma'}</p>
                <p className="text-[11px] text-[#A7B1C2] truncate">{user?.email || 'delivery@watchhub.com'}</p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6500FF]/20 text-[#00D5FF] text-[10px] font-bold border border-[#6500FF]/40">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authorized Role: Delivery Manager</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  setActiveTab('settings');
                }}
                className="w-full text-left px-4 py-2 text-[#A7B1C2] hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#E9B94F]" />
                <span>Profile & SLA Settings</span>
              </button>

              <div className="border-t border-[#28334B] my-1" />

              <button
                onClick={async () => {
                  setProfileDropdownOpen(false);
                  await logout();
                  navigate('/login', { replace: true });
                }}
                className="w-full text-left px-4 py-2 text-[#FF4966] hover:bg-[#FF4966]/10 flex items-center gap-2 transition-colors cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DeliveryManagerHeader;
