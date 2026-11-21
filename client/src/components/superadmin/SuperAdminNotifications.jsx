import React, { useState } from 'react';
import { Bell, Check, ShieldAlert, Database, UserCheck, X } from 'lucide-react';

export default function SuperAdminNotifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Database Backup Completed',
      desc: 'Point-in-time SQL Server snapshot saved successfully for WatchHubDB.',
      time: '12 mins ago',
      unread: true,
      icon: Database,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'n2',
      title: 'New Staff Member Onboarded',
      desc: 'Role Store Admin assigned to Aanya Singhania by Super Admin.',
      time: '45 mins ago',
      unread: true,
      icon: UserCheck,
      iconColor: 'text-[#D6A33A] bg-[#D6A33A]/10 border-[#D6A33A]/20',
    },
    {
      id: 'n3',
      title: 'Security Policy Synchronized',
      desc: 'Strict role isolation and session access controls enforced across 7 portals.',
      time: '2 hours ago',
      unread: true,
      icon: ShieldAlert,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-[#0B1222] border border-[#D6A33A]/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in text-xs">
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#080E1C]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#D6A33A]" />
          <span className="font-bold text-white text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#D6A33A] text-black font-extrabold">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] text-[#D6A33A] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-3.5 flex items-start gap-3 hover:bg-white/5 transition-colors ${
                item.unread ? 'bg-[#0E172A]/70' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  <span className="text-[10px] text-gray-500">{item.time}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 bg-[#080E1C] border-t border-white/5 text-center text-[11px] text-[#D6A33A]">
        WatchHub Atelier Audit Event Stream
      </div>
    </div>
  );
}
