import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Plus,
  LogOut,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CustomerSupportHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  searchQuery,
  setSearchQuery,
  onOpenCreateTicket,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Live Clock matching reference screenshot format: "Sat, 21 Nov 2026 • 04:02 PM"
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
      desc: 'Ticket #TIC-2293 assigned: Watch strap availability inquiry',
      time: '5m ago',
    },
    {
      id: 2,
      title: 'New Refund Request',
      desc: 'Customer requested refund enquiry for cancelled order',
      time: '20m ago',
    },
    {
      id: 3,
      title: 'SLA Escalation Warning',
      desc: 'Ticket #TKT-801 Order transit delay is approaching SLA limit',
      time: '45m ago',
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#070B18]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle + Logo + Support Manager Branding */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (setMobileSidebarOpen) setMobileSidebarOpen(!mobileSidebarOpen);
            else if (setSidebarCollapsed) setSidebarCollapsed(!sidebarCollapsed);
          }}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-[#00D9E8] hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
          aria-label="Toggle Navigation Drawer"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/customer-support/dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D6A33A] via-[#B88728] to-[#8C601E] flex items-center justify-center shadow-lg border border-[#F6C453]/40">
            <ShieldCheck className="w-5 h-5 text-black font-extrabold" />
          </div>
          <div>
            <span className="font-serif text-sm font-bold tracking-wider text-white block">
              WATCHHUB ATELIER
            </span>
            <span className="text-[9.5px] tracking-widest text-[#00D9E8] font-bold uppercase block -mt-0.5">
              SUPPORT MANAGER
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Global Ticket & Customer Search Bar with Ctrl + K */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search tickets, customers, orders, or knowledge base..."
            className="w-full bg-[#0E1630] text-white text-xs pl-9 pr-14 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#00D9E8] placeholder:text-gray-500 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/10 rounded shadow-sm pointer-events-none font-mono">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right Controls: + Create Ticket, Notifications, Store, Live Clock, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* + Create Ticket Action Button */}
        <button
          type="button"
          onClick={() => {
            if (onOpenCreateTicket) onOpenCreateTicket();
            else navigate('/customer-support/tickets?create=true');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#00F2FE] hover:bg-[#00D9E8] text-black shadow-lg shadow-[#00F2FE]/20 transition-all cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Ticket</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0B1222] border border-[#00D9E8]/30 shadow-2xl p-4 z-50 animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Support Notifications</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {notifications.length} New
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-[#111A2C] border border-white/5 hover:border-[#00D9E8]/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-white">{n.title}</p>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Storefront Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-[#0E1630] border border-white/10 transition-colors"
          title="Open Customer Storefront"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#00D9E8]" />
          <span>Store</span>
        </Link>

        {/* Live Clock Badge (Matching Reference Screenshot) */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1630] border border-white/10 text-xs text-gray-300">
          <Clock className="w-3.5 h-3.5 text-[#00D9E8]" />
          <span>{currentTime || 'Sat, 21 Nov 2026 • 04:02 PM'}</span>
        </div>

        {/* Direct Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default CustomerSupportHeader;
