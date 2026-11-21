import React, { useState } from 'react';
import { Settings, Shield, Sliders, Globe, Clock, Save, Check } from 'lucide-react';

export default function SuperAdminSettingsModule() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platformName: 'WatchHub Atelier',
    supportEmail: 'concierge@watchhub.luxury',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST)',
    sessionTimeoutMinutes: '120',
    mfaRequired: true,
    strictRoleIsolation: true,
    maintenanceMode: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D6A33A]" />
            <span>Platform Governance & Atelier Configuration</span>
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Security policies, horology marketplace branding, and administrative session controls.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#0B1222] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl">
        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Platform settings saved and synchronized across all active roles.</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D6A33A]" />
            <span>Branding & Regional Localization</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Concierge Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Atelier Currency</label>
              <input
                type="text"
                disabled
                value={settings.currency}
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C]/60 border border-white/5 text-gray-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Standard Time Zone</label>
              <input
                type="text"
                disabled
                value={settings.timezone}
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C]/60 border border-white/5 text-gray-400 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D6A33A]" />
            <span>Security & Role Isolation Guard</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#111A2C] border border-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-white block">Strict Role Isolation Architecture</span>
                <span className="text-[11px] text-gray-400">Prevent UI or navigation leakage between all 7 roles.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.strictRoleIsolation}
                onChange={(e) => setSettings({ ...settings, strictRoleIsolation: e.target.checked })}
                className="accent-[#D6A33A] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#111A2C] border border-white/5 cursor-pointer">
              <div>
                <span className="font-bold text-white block">Dual-Token Authentication (JWT + Refresh)</span>
                <span className="text-[11px] text-gray-400">Enforce cryptographic verification on every request.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.mfaRequired}
                onChange={(e) => setSettings({ ...settings, mfaRequired: e.target.checked })}
                className="accent-[#D6A33A] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#D6A33A] hover:bg-[#F6C453] text-black font-bold shadow-lg shadow-[#D6A33A]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
