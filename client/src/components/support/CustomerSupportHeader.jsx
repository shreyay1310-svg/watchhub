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
  Headphones,
  AlertTriangle,
  RotateCcw,
  X,
  PlusCircle,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export const CustomerSupportHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenCreateTicket,
  onOpenQuickChat,
}) => {
  const { user, switchRole, logout } = useAuth();
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
      title: 'High Priority Ticket',
      desc: 'Ticket #TIC-8821 assigned: Transit delay for Rolex Cosmograph Daytona',
      time: '5m ago',
      type: 'urgent',
    },
    {
      id: 2,
      title: 'New Refund Request',
      desc: 'Customer requested ₹1,25,000 refund for Return #RET-2026-081',
      time: '20m ago',
      type: 'warning',
    },
    {
      id: 3,
      title: 'SLA Breach Warning',
      desc: 'Ticket #TIC-8819 is approaching 4-hour SLA deadline',
      time: '45m ago',
      type: 'urgent',
    },
    {
      id: 4,
      title: 'Live Chat Waiting',
      desc: 'VIP Customer Rajesh Singhania is waiting on Live Chat (Queue #1)',
      time: '1h ago',
      type: 'info',
    },
  ];

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return 'Customer Support Overview';
      case 'tickets':
        return 'Support Tickets Management';
      case 'live-chat':
        return 'Live Chat & Instant Messaging';
      case 'customers':
        return 'Customer 360 & Profiles';
      case 'orders-returns':
        return 'Orders & Return Requests';
      case 'refunds':
        return 'Refunds & Replacements';
      case 'escalations':
        return 'Critical Escalations & SLA';
      case 'knowledge-base':
        return 'Knowledge Base & FAQs';
      case 'canned-responses':
        return 'Canned Responses & Templates';
      case 'reports':
        return 'Support Analytics & Performance';
      case 'team':
        return 'Team & Permissions';
      case 'settings':
        return 'Support Center Settings';
      default:
        return 'Customer Support Portal';
    }
  };

  return (
    <header className="h-16 bg-[#091426]/95 backdrop-blur-md border-b border-[#252D42] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40 text-white select-none">
      {/* Left: Sidebar Toggle & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-xl text-[#A7B1C2] hover:text-[#00D9E8] hover:bg-[#111729] transition-colors cursor-pointer border border-transparent hover:border-[#252D42]"
          title="Toggle Sidebar"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-[#A7B1C2]">
            <Link to="/customer-support/dashboard" className="hover:text-[#00D9E8] transition-colors">
              Customer Support
            </Link>
            <span>/</span>
            <span className="text-[#00D9E8] font-medium capitalize">
              {activeTab ? activeTab.replace('-', ' ') : 'Dashboard'}
            </span>
          </div>
          <h1 className="text-base font-bold text-white tracking-wide truncate max-w-[280px] lg:max-w-none">
            {getTabTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Middle: Global Ticket & Customer Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search tickets, order #, customer email, keywords... (Ctrl+K)"
            className="w-full bg-[#111729] text-white text-xs pl-9 pr-14 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] placeholder:text-[#64748B] transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-[#A7B1C2] bg-[#070918] border border-[#252D42] rounded shadow-sm pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Clock, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button: New Ticket */}
        <button
          onClick={() => {
            if (onOpenCreateTicket) {
              onOpenCreateTicket();
            } else {
              navigate('/customer-support/tickets?create=true');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] hover:shadow-[0_0_15px_rgba(0,217,232,0.35)] transition-all cursor-pointer font-sans"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden lg:inline">Create Ticket</span>
        </button>

        {/* Live Clock Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111729] border border-[#252D42] text-xs text-[#A7B1C2]">
          <Clock className="w-3.5 h-3.5 text-[#00D9E8]" />
          <span>{currentTime || 'Syncing clock...'}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-[#A7B1C2] hover:text-[#00D9E8] hover:bg-[#111729] border border-transparent hover:border-[#252D42] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#091426] border border-[#252D42] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">Notifications</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                    {notifications.length} New
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#64748B] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-[#111729]/80 border border-[#252D42]/60 hover:border-[#00D9E8]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <span className="text-[10px] text-[#64748B] whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#A7B1C2] mt-1 line-clamp-2 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-[#252D42] flex justify-between items-center text-xs">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#00D9E8] hover:underline"
                >
                  Mark all as read
                </button>
                <Link
                  to="/customer-support/escalations"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#A7B1C2] hover:text-white flex items-center gap-1"
                >
                  View Escalations &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* View Storefront Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#A7B1C2] hover:text-white bg-[#111729] hover:bg-[#161F38] border border-[#252D42] transition-colors"
          title="Open Customer Storefront"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#00D9E8]" />
          <span>Store</span>
        </Link>

        {/* Profile Dropdown & Quick Switch */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#111729] border border-transparent hover:border-[#252D42] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 flex items-center justify-center text-sm shadow-inner">
              {user?.avatar || '🎧'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.name || 'Pooja Sharma'}
              </p>
              <p className="text-[10px] text-[#00D9E8] font-medium leading-tight">
                Support Manager
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#A7B1C2] hidden md:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#091426] border border-[#252D42] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2 border-b border-[#252D42] mb-2">
                <p className="text-xs font-semibold text-white">{user?.name || 'Pooja Sharma'}</p>
                <p className="text-[11px] text-[#A7B1C2] truncate">{user?.email || 'support@watchhub.com'}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] border border-[#00D9E8]/30 text-[10px] font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Support Lead (L2/L3 Access)</span>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  to="/customer-support/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-[#A7B1C2] hover:text-white hover:bg-[#111729] transition-colors"
                >
                  <User className="w-4 h-4 text-[#00D9E8]" />
                  <span>Account & SLA Settings</span>
                </Link>

                <div className="pt-2 mt-2 border-t border-[#252D42]">
                  <p className="text-[10px] uppercase font-bold text-[#64748B] px-3 pb-1 tracking-wider">
                    Switch Active Portal
                  </p>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      switchRole && switchRole(ROLES.SUPER_ADMIN);
                      navigate('/super-admin/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#A7B1C2] hover:text-white hover:bg-[#111729] rounded-xl text-left"
                  >
                    <span>Super Admin</span>
                    <span className="text-[10px] text-[#64748B]">👑</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      switchRole && switchRole(ROLES.DELIVERY_MANAGER);
                      navigate('/delivery-manager/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#A7B1C2] hover:text-white hover:bg-[#111729] rounded-xl text-left"
                  >
                    <span>Delivery Manager</span>
                    <span className="text-[10px] text-[#64748B]">🚚</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      switchRole && switchRole(ROLES.INVENTORY_MANAGER);
                      navigate('/inventory-manager/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#A7B1C2] hover:text-white hover:bg-[#111729] rounded-xl text-left"
                  >
                    <span>Inventory Manager</span>
                    <span className="text-[10px] text-[#64748B]">📦</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      switchRole && switchRole(ROLES.STORE_ADMIN);
                      navigate('/admin/dashboard');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#A7B1C2] hover:text-white hover:bg-[#111729] rounded-xl text-left"
                  >
                    <span>Store Admin</span>
                    <span className="text-[10px] text-[#64748B]">🏪</span>
                  </button>
                </div>

                <div className="pt-2 mt-2 border-t border-[#252D42]">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (logout) logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-colors font-medium text-left"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerSupportHeader;
