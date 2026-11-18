import React, { useState } from 'react';
import {
  Sliders,
  Clock,
  ShieldCheck,
  Bell,
  MessageSquare,
  Zap,
  Save,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const SupportSettingsModule = ({
  settings,
  setSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState(
    settings || {
      conciergeName: 'WatchHub Luxury Concierge',
      supportEmail: 'support@watchhub.com',
      supportPhone: '+91 1800 200 9000',
      workingHours: '24/7 Priority Desk',
      timezone: 'Asia/Kolkata (IST)',
      autoAssignMode: 'round-robin',
      autoCloseHours: 48,
      slaCriticalHours: 2,
      slaHighHours: 4,
      slaMediumHours: 8,
      slaLowHours: 24,
      emailOnVip: true,
      smsOnDelay: true,
      soundOnChat: true,
      chatWelcomeMsg: 'Welcome to WatchHub Luxury Concierge. How may our horology advisors assist you today?',
    }
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (setSettings) setSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'sla', label: 'SLA & Escalation Rules', icon: Clock },
    { id: 'assignment', label: 'Ticket Routing', icon: Zap },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
    { id: 'chat', label: 'Live Chat Widget', icon: MessageSquare },
    { id: 'integrations', label: 'Connected APIs', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Customer Support Center Settings
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Configure automated routing algorithms, SLA enforcement thresholds, and integration webhooks
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-semibold animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </span>
        )}
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar border-b border-[#252D42]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-[#00D9E8] text-[#00D9E8] bg-[#111729]'
                  : 'border-transparent text-[#A7B1C2] hover:text-white hover:bg-[#111729]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Forms */}
      <form onSubmit={handleSave} className="rounded-2xl bg-[#111729] border border-[#252D42] p-6 shadow-xl space-y-6">
        {activeSubTab === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white">General Concierge Desk Configuration</h3>
            <p className="text-xs text-[#A7B1C2]">
              Public-facing identity and operating schedule for the WatchHub customer care department.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Desk Display Name
                </label>
                <input
                  type="text"
                  value={form.conciergeName}
                  onChange={(e) => setForm({ ...form, conciergeName: e.target.value })}
                  className="w-full bg-[#070918] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Support Email Address
                </label>
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                  className="w-full bg-[#070918] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Toll-Free Concierge Hotline
                </label>
                <input
                  type="text"
                  value={form.supportPhone}
                  onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                  className="w-full bg-[#070918] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Operating Hours Schedule
                </label>
                <input
                  type="text"
                  value={form.workingHours}
                  onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  className="w-full bg-[#070918] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'sla' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white">SLA Enforcement & Auto-Escalation</h3>
            <p className="text-xs text-[#A7B1C2]">
              Define maximum resolution response hours per priority level before incident alerts trigger.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#070918] border border-[#EF4444]/30">
                <span className="text-[10px] font-bold text-[#EF4444] uppercase block mb-1">
                  Critical L3 SLA
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={form.slaCriticalHours}
                    onChange={(e) =>
                      setForm({ ...form, slaCriticalHours: Number(e.target.value) })
                    }
                    className="w-16 bg-[#111729] text-white text-sm font-bold p-1 rounded border border-[#252D42] text-center"
                  />
                  <span className="text-xs text-[#A7B1C2]">Hours</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070918] border border-[#F97316]/30">
                <span className="text-[10px] font-bold text-[#F97316] uppercase block mb-1">
                  High L2 SLA
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={form.slaHighHours}
                    onChange={(e) => setForm({ ...form, slaHighHours: Number(e.target.value) })}
                    className="w-16 bg-[#111729] text-white text-sm font-bold p-1 rounded border border-[#252D42] text-center"
                  />
                  <span className="text-xs text-[#A7B1C2]">Hours</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070918] border border-[#E7B43F]/30">
                <span className="text-[10px] font-bold text-[#E7B43F] uppercase block mb-1">
                  Medium SLA
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={form.slaMediumHours}
                    onChange={(e) =>
                      setForm({ ...form, slaMediumHours: Number(e.target.value) })
                    }
                    className="w-16 bg-[#111729] text-white text-sm font-bold p-1 rounded border border-[#252D42] text-center"
                  />
                  <span className="text-xs text-[#A7B1C2]">Hours</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070918] border border-[#00D9E8]/30">
                <span className="text-[10px] font-bold text-[#00D9E8] uppercase block mb-1">
                  Low SLA
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={form.slaLowHours}
                    onChange={(e) => setForm({ ...form, slaLowHours: Number(e.target.value) })}
                    className="w-16 bg-[#111729] text-white text-sm font-bold p-1 rounded border border-[#252D42] text-center"
                  />
                  <span className="text-xs text-[#A7B1C2]">Hours</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'assignment' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white">Ticket Auto-Assignment Routing</h3>
            <p className="text-xs text-[#A7B1C2]">
              Select which triage algorithm assigns incoming inquiries to available online concierge staff.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070918] border border-[#252D42] cursor-pointer">
                <input
                  type="radio"
                  name="assignMode"
                  value="round-robin"
                  checked={form.autoAssignMode === 'round-robin'}
                  onChange={(e) => setForm({ ...form, autoAssignMode: e.target.value })}
                  className="mt-1 text-[#00D9E8]"
                />
                <div>
                  <p className="text-xs font-bold text-white">Round Robin Distribution (Recommended)</p>
                  <p className="text-[11px] text-[#A7B1C2]">Distributes new tickets equally across all active online agents.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070918] border border-[#252D42] cursor-pointer">
                <input
                  type="radio"
                  name="assignMode"
                  value="least-loaded"
                  checked={form.autoAssignMode === 'least-loaded'}
                  onChange={(e) => setForm({ ...form, autoAssignMode: e.target.value })}
                  className="mt-1 text-[#00D9E8]"
                />
                <div>
                  <p className="text-xs font-bold text-white">Least Loaded Agent First</p>
                  <p className="text-[11px] text-[#A7B1C2]">Directs tickets to the staff member with the lowest number of unresolved cases.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeSubTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white">Support Alert Subscriptions</h3>
            <p className="text-xs text-[#A7B1C2]">
              Control real-time push alerts and audio notifications for critical store events.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#070918] border border-[#252D42] cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">VIP Collector Instant Notification</p>
                  <p className="text-[11px] text-[#A7B1C2]">Notify Concierge Lead when a Platinum/Gold member initiates a chat</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.emailOnVip}
                  onChange={(e) => setForm({ ...form, emailOnVip: e.target.checked })}
                  className="rounded text-[#00D9E8] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#070918] border border-[#252D42] cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">Courier Transit Delay SMS Warning</p>
                  <p className="text-[11px] text-[#A7B1C2]">Send automated proactive SMS when BlueDart flags high-risk transit delay</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.smsOnDelay}
                  onChange={(e) => setForm({ ...form, smsOnDelay: e.target.checked })}
                  className="rounded text-[#00D9E8] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#070918] border border-[#252D42] cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">Audio Chime on Inbound Live Chat</p>
                  <p className="text-[11px] text-[#A7B1C2]">Play gentle luxury chime when a new conversation enters the queue</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.soundOnChat}
                  onChange={(e) => setForm({ ...form, soundOnChat: e.target.checked })}
                  className="rounded text-[#00D9E8] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {activeSubTab === 'chat' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white">Storefront Live Chat Widget</h3>
            <p className="text-xs text-[#A7B1C2]">
              Customize greetings, colors, and behavior of the customer-facing concierge chat widget.
            </p>

            <div className="pt-2">
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                Automated Welcome Greeting
              </label>
              <textarea
                rows="3"
                value={form.chatWelcomeMsg}
                onChange={(e) => setForm({ ...form, chatWelcomeMsg: e.target.value })}
                className="w-full bg-[#070918] text-white text-xs p-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] resize-none"
              />
            </div>
          </div>
        )}

        {activeSubTab === 'integrations' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white">Platform APIs & Live Gateway Status</h3>
            <p className="text-xs text-[#A7B1C2]">
              Integration endpoints powering live refund reversals, tracking webhooks, and SMS updates.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#070918] border border-[#252D42] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Razorpay Payments & Refund Engine</p>
                  <p className="text-[11px] text-[#A7B1C2]">Automated refund reversal API</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Connected
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070918] border border-[#252D42] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">BlueDart Secure Logistics API</p>
                  <p className="text-[11px] text-[#A7B1C2]">Real-time GPS tracking & reverse pickup dispatch</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Connected
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070918] border border-[#252D42] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Socket.IO Live Concierge Socket</p>
                  <p className="text-[11px] text-[#A7B1C2]">Sub-second live chat messaging engine</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00D9E8]/20 text-[#00D9E8] border border-[#00D9E8]/30">
                  Online
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#252D42] flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs hover:shadow-[0_0_20px_rgba(0,217,232,0.4)] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportSettingsModule;
