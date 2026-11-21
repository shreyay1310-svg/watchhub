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
  Clock,
} from 'lucide-react';

export const SUPPORT_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/customer-support/dashboard' },
  { id: 'tickets', label: 'Support Tickets', icon: Ticket, path: '/customer-support/tickets', badge: '186', badgeType: 'amber' },
  { id: 'live-chat', label: 'Live Chat', icon: MessageSquare, path: '/customer-support/live-chat', badge: 'Live', badgeType: 'green' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/customer-support/customers' },
  { id: 'orders-returns', label: 'Orders & Returns', icon: PackageSearch, path: '/customer-support/orders-returns' },
  { id: 'refunds', label: 'Refunds & Replacements', icon: RotateCcw, path: '/customer-support/refunds', badge: '4', badgeType: 'red' },
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
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavClick = (item) => {
    if (setActiveTab) setActiveTab(item.id);
    if (setMobileSidebarOpen) setMobileSidebarOpen(false);
    navigate(item.path);
  };

  const getBadgeStyle = (type, isActive) => {
    if (isActive) {
      return 'bg-black text-[#00F2FE] font-extrabold';
    }
    switch (type) {
      case 'green':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'red':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-white/10 text-white';
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#080E21] border-r border-white/10 flex flex-col justify-between transition-transform lg:transition-all duration-300 select-none flex-shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Navigation Modules */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar text-xs">
          {SUPPORT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00F2FE] to-[#00D9E8] text-black font-extrabold shadow-lg shadow-[#00F2FE]/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadgeStyle(item.badgeType, isActive)}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Luxury Watch Emblem Arc & User Profile */}
        <div className="p-3 border-t border-white/10 bg-[#060A18]/80 space-y-3">
          {/* Horology Arc Graphic Card (Matching reference) */}
          {!sidebarCollapsed && (
            <div className="relative rounded-2xl bg-gradient-to-b from-[#111A2E] to-[#0A0F1D] border border-[#00D9E8]/20 p-3 text-center overflow-hidden shadow-inner">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#00D9E8]/20 via-[#00F2FE]/10 to-transparent border border-[#00D9E8]/40 flex items-center justify-center mb-1.5 shadow-md">
                <Clock className="w-6 h-6 text-[#00F2FE] animate-pulse" />
              </div>
              <div className="text-xs font-bold font-serif text-white tracking-wide">
                Customer Support
              </div>
              <div className="text-[10px] text-gray-400">Command Center</div>
            </div>
          )}

          {/* Pooja Sharma Profile Pill with Sign Out */}
          <div className="p-2 rounded-xl bg-[#0E1630] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 flex items-center justify-center text-sm shadow-sm">
                🎧
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="font-bold text-white text-xs leading-tight">
                    {user?.name || 'Pooja Sharma'}
                  </div>
                  <div className="text-[10px] text-[#00D9E8] font-medium leading-tight">
                    Support Manager
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CustomerSupportSidebar;
