import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  MessageSquare,
  Users,
  PackageSearch,
  RotateCcw,
  ShieldAlert,
  BookOpen,
  FileText,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Sparkles,
} from 'lucide-react';

export const SUPPORT_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/customer-support/dashboard' },
  { id: 'tickets', label: 'Support Tickets', icon: Ticket, path: '/customer-support/tickets', badge: '108' },
  { id: 'live-chat', label: 'Live Chat', icon: MessageSquare, path: '/customer-support/live-chat', badge: 'Live', badgeType: 'cyan' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/customer-support/customers' },
  { id: 'orders-returns', label: 'Orders & Returns', icon: PackageSearch, path: '/customer-support/orders-returns' },
  { id: 'refunds', label: 'Refunds & Replacements', icon: RotateCcw, path: '/customer-support/refunds', badge: '4' },
  { id: 'escalations', label: 'Escalations', icon: ShieldAlert, path: '/customer-support/escalations', badge: '3', badgeType: 'red' },
  { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen, path: '/customer-support/knowledge-base' },
  { id: 'canned-responses', label: 'Canned Responses', icon: FileText, path: '/customer-support/canned-responses' },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, path: '/customer-support/reports' },
  { id: 'team', label: 'Team & Permissions', icon: UserCheck, path: '/customer-support/team' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/customer-support/settings' },
];

export const CustomerSupportSidebar = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavClick = (item) => {
    if (setActiveTab) setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <aside
      className={`bg-[#091426] border-r border-[#252D42] flex flex-col justify-between transition-all duration-300 z-30 select-none flex-shrink-0 ${
        sidebarCollapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#252D42]">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/customer-support/dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 flex items-center justify-center text-lg shadow-sm">
                👑
              </div>
              <div>
                <h1 className="text-base font-black tracking-wider text-white flex items-center gap-1.5 font-serif">
                  WATCHHUB
                </h1>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#00D9E8] flex items-center gap-1">
                  <Headphones className="w-3 h-3" /> Support Manager
                </p>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 flex items-center justify-center text-lg mx-auto cursor-pointer"
              onClick={() => navigate('/customer-support/dashboard')}
              title="WatchHub Customer Support"
            >
              👑
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-7 h-7 rounded-lg bg-[#111729] hover:bg-[#252D42] text-[#A7B1C2] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#252D42]"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Modules List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {SUPPORT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group relative ${
                  isActive
                    ? 'bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/40 shadow-[0_0_15px_rgba(0,217,232,0.15)] font-bold'
                    : 'text-[#A7B1C2] hover:text-white hover:bg-[#111729] border border-transparent'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#00D9E8]' : 'text-[#A7B1C2] group-hover:text-white'
                  }`}
                />

                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate tracking-wide">
                    {item.label}
                  </span>
                )}

                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider ${
                      item.badgeType === 'cyan'
                        ? 'bg-[#00D9E8]/20 text-[#00D9E8] border border-[#00D9E8]/40 animate-pulse'
                        : item.badgeType === 'red'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-[#111729] text-[#A7B1C2] border border-[#252D42]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Left Active Glow Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#00D9E8] rounded-r shadow-[0_0_8px_#00D9E8]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout Footer */}
      <div className="p-3 border-t border-[#252D42] bg-[#091426]">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#111729] border border-[#252D42]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-[#00D9E8]/50"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/watch_placeholder.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#091426]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user?.name || 'Pooja Gupta'}
                </p>
                <p className="text-[10px] text-[#A7B1C2] truncate font-light">
                  Customer Support Manager
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-7 h-7 rounded-lg hover:bg-rose-500/20 text-[#A7B1C2] hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-[#00D9E8]/50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#091426]" />
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-8 h-8 rounded-lg hover:bg-rose-500/20 text-[#A7B1C2] hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CustomerSupportSidebar;
