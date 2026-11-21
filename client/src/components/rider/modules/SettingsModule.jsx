import React, { useState } from 'react';
import { Settings, Bell, Shield, Navigation, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const SettingsModule = ({ isOnDuty, setIsOnDuty }) => {
  const { logout } = useAuth();
  const [allowLocation, setAllowLocation] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div className="pb-2 border-b border-white/10">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Rider App Settings &amp; Availability</span>
        </h2>
        <p className="text-xs text-gray-400">
          Configure real-time GPS telemetry, push notifications, and shift preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Availability & Shift Settings */}
        <div className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Duty Availability</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050816] border border-white/5">
              <div>
                <p className="font-bold text-white">Accepting Delivery Dispatches</p>
                <p className="text-[11px] text-gray-400">Controls assignment eligibility in Central Hub.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOnDuty(!isOnDuty)}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  isOnDuty ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isOnDuty ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050816] border border-white/5">
              <div>
                <p className="font-bold text-white">Live Route Telemetry</p>
                <p className="text-[11px] text-gray-400">Broadcasts speed and distance for customer ETA tracking.</p>
              </div>
              <button
                type="button"
                onClick={() => setAllowLocation(!allowLocation)}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  allowLocation ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    allowLocation ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Notification Channels</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050816] border border-white/5">
              <div>
                <p className="font-bold text-white">Urgent Dispatch SMS Alerts</p>
                <p className="text-[11px] text-gray-400">Receive SMS for time-sensitive high value parcels.</p>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  smsAlerts ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    smsAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#050816] border border-white/5">
              <div>
                <p className="font-bold text-white">Sound Chime on New Drop-off</p>
                <p className="text-[11px] text-gray-400">Audible notification when approaching delivery radius.</p>
              </div>
              <button
                type="button"
                onClick={() => setPushAlerts(!pushAlerts)}
                className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  pushAlerts ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    pushAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security & Sign Out Section */}
      <div className="p-5 rounded-2xl bg-[#0B1022] border border-rose-500/20 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Security &amp; Session Termination</span>
        </h3>
        <p className="text-xs text-gray-400">
          Sign out securely from this terminal. Active delivery cache and authentication tokens will be purged immediately.
        </p>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors cursor-pointer"
          >
            Save Preferences
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-lg shadow-rose-500/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>End Shift &amp; Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
