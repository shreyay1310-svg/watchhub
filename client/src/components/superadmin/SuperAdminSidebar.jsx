import React from 'react';
import {
  Activity,
  Rocket,
  Users,
  Shield,
  BarChart3,
  Key,
  Building,
  UserCheck,
  UserCog,
  Settings,
  HeartPulse,
  Database,
  Server,
  AlertTriangle,
  HardDriveDownload,
  LogOut,
  X,
  Clock,
} from 'lucide-react';

export const SUPER_ADMIN_SECTIONS = [
  {
    heading: 'SYSTEM ADMINISTRATION',
    items: [
      { id: 'overview', label: 'System Overview', icon: Activity },
      { id: 'releases', label: 'Release Management', icon: Rocket, badge: 'v1.1' },
      { id: 'users', label: 'Users & Roles', icon: Users },
      { id: 'audit', label: 'Audit & Security', icon: Shield },
      { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
    ],
  },
  {
    heading: 'BUSINESS CONTROL',
    items: [
      { id: 'permissions', label: 'Role Permissions', icon: Key },
      { id: 'departments', label: 'Department Management', icon: Building },
      { id: 'staff', label: 'Staff Management', icon: UserCheck },
      { id: 'accounts', label: 'Account Management', icon: UserCog },
      { id: 'settings', label: 'Platform Settings', icon: Settings },
    ],
  },
  {
    heading: 'OPERATIONS',
    items: [
      { id: 'health', label: 'System Health', icon: HeartPulse },
      { id: 'database', label: 'Database Monitoring', icon: Database },
      { id: 'api-monitoring', label: 'API Monitoring', icon: Server },
      { id: 'error-logs', label: 'Error Logs', icon: AlertTriangle },
      { id: 'backup', label: 'Backup & Recovery', icon: HardDriveDownload },
    ],
  },
];

export default function SuperAdminSidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#080E21] border-r border-white/10 flex flex-col justify-between transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header on Mobile */}
        <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D6A33A] flex items-center justify-center font-bold text-black text-xs">
              WH
            </div>
            <span className="font-serif font-bold text-sm text-white">Super Admin Command</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-5 custom-scrollbar text-xs">
          {SUPER_ADMIN_SECTIONS.map((section) => (
            <div key={section.heading} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1.5">
                {section.heading}
              </span>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#D6A33A] text-black font-bold shadow-lg shadow-[#D6A33A]/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isActive
                            ? 'bg-black text-[#D6A33A]'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Enterprise Watch Graphic + Logout Button */}
        <div className="p-3.5 border-t border-white/10 bg-[#060A18]/80 space-y-3">
          {/* Horology Enterprise Branding Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#111A2E] to-[#0A0F1D] border border-[#D6A33A]/20 p-3 text-center overflow-hidden shadow-inner">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#D6A33A]/20 via-[#F6C453]/10 to-transparent border border-[#D6A33A]/40 flex items-center justify-center mb-1.5 shadow-md">
              <Clock className="w-6 h-6 text-[#D6A33A] animate-pulse" />
            </div>
            <div className="text-xs font-bold font-serif text-white tracking-wide">
              WatchHub Atelier
            </div>
            <div className="text-[10px] text-gray-400">Enterprise Control Center</div>
          </div>

          {/* Secure Log Out Button */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Administrator</span>
          </button>
        </div>
      </aside>
    </>
  );
}
