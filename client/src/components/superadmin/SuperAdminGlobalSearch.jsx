import React, { useState, useEffect } from 'react';
import { Search, X, Users, Shield, Building, Rocket, Database, Settings, ChevronRight } from 'lucide-react';

export default function SuperAdminGlobalSearch({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');

  const searchableItems = [
    { category: 'System Administration', title: 'System Overview', tab: 'overview', icon: Database, desc: 'Real-time database, server metrics and platform status' },
    { category: 'System Administration', title: 'Release Management', tab: 'releases', icon: Rocket, desc: 'Android APK builds, OTA distributions and v1.1 releases' },
    { category: 'System Administration', title: 'Users & Roles', tab: 'users', icon: Users, desc: 'User governance, RBAC accounts and department assignments' },
    { category: 'System Administration', title: 'Audit & Security', tab: 'audit', icon: Shield, desc: 'Security event logs, administrative actions and authentication' },
    { category: 'System Administration', title: 'Platform Analytics', tab: 'analytics', icon: Settings, desc: 'Financial aggregations, sales analytics and traffic KPIs' },
    { category: 'Business Control', title: 'Role Permissions', tab: 'permissions', icon: Shield, desc: 'Granular permission matrix and access policies' },
    { category: 'Business Control', title: 'Department Management', tab: 'departments', icon: Building, desc: 'Corporate departments, operational heads and staff allocation' },
    { category: 'Business Control', title: 'Staff Management', tab: 'staff', icon: Users, desc: 'Staff directory, onboarding and employee credentials' },
    { category: 'Business Control', title: 'Platform Settings', tab: 'settings', icon: Settings, desc: 'Global horology platform configuration and session policies' },
    { category: 'Operations', title: 'System Health', tab: 'health', icon: Database, desc: 'API latency, CPU memory monitoring and uptime' },
    { category: 'Operations', title: 'Database Monitoring', tab: 'database', icon: Database, desc: 'SQL Server WatchHubDB health, tables inventory and queries' },
    { category: 'Operations', title: 'API Monitoring', tab: 'api-monitoring', icon: Database, desc: 'Endpoint diagnostics, request rates and error logging' },
    { category: 'Operations', title: 'Backup & Recovery', tab: 'backup', icon: Database, desc: 'MSSQL snapshot backups and point-in-time recovery' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0B1222] border border-[#D6A33A]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D6A33A]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything... (users, roles, departments, operations)"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No matching modules or records found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => {
                    onNavigate(item.tab);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D6A33A]/10 border border-[#D6A33A]/20 flex items-center justify-center text-[#D6A33A] group-hover:bg-[#D6A33A] group-hover:text-black transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-normal text-[#D6A33A] px-1.5 py-0.2 rounded bg-[#D6A33A]/10 border border-[#D6A33A]/20">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#080E1C] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with mouse or click</span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 text-[10px]">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
