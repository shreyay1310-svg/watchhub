import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Bike,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle,
  Save,
  Lock,
  Truck,
  Key,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const DeliverySettingsModule = ({
  settings,
  onSaveSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('config'); // 'config' | 'notifications' | 'riders' | 'tracking' | 'profile' | 'permissions'
  const [formState, setFormState] = useState(settings);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings(formState);
    }
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & SAVE BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Delivery Management Settings
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Configure logistics rules, courier API tokens, GPS telemetry thresholds and driver fleet policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer border border-[#8B00FF]/50"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {saveSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-[#00C98B]/15 border border-[#00C98B]/40 text-[#00C98B] flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#00C98B]" />
          <span>Delivery configurations and SLA thresholds updated successfully!</span>
        </div>
      )}

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#28334B] overflow-x-auto pb-1 text-xs">
        {[
          { id: 'config', label: 'Delivery Configuration', icon: Settings },
          { id: 'notifications', label: 'Notification Settings', icon: Bell },
          { id: 'riders', label: 'Rider Fleet Settings', icon: Bike },
          { id: 'tracking', label: 'Tracking & API Keys', icon: MapPin },
          { id: 'profile', label: 'Profile Settings', icon: User },
          { id: 'permissions', label: 'Assigned Permissions', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                isSelected
                  ? 'border-[#00D5FF] text-[#00D5FF] bg-white/5'
                  : 'border-transparent text-[#A7B1C2] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB A: DELIVERY CONFIGURATION */}
      {activeSubTab === 'config' && (
        <div className="p-6 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-6 text-xs">
          <div>
            <h3 className="font-serif font-bold text-base text-white">
              Status Progression & Handover Rules
            </h3>
            <p className="text-xs text-[#A7B1C2] mt-0.5">
              Automated logistics triggers and verification requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Auto Mark "Out for Delivery"</span>
                <span className="text-[11px] text-[#A7B1C2]">Automatically update order status when rider accepts route</span>
              </div>
              <input
                type="checkbox"
                checked={formState.statusRules?.autoMarkOutForDelivery}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    statusRules: { ...formState.statusRules, autoMarkOutForDelivery: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#6500FF] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Mandatory Doorstep OTP</span>
                <span className="text-[11px] text-[#A7B1C2]">Rider cannot complete delivery without customer OTP</span>
              </div>
              <input
                type="checkbox"
                checked={formState.statusRules?.requireOtpOnDelivery}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    statusRules: { ...formState.statusRules, requireOtpOnDelivery: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#6500FF] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Neighbor Drop Policy</span>
                <span className="text-[11px] text-[#A7B1C2]">Allow packages to be left with security or neighbor</span>
              </div>
              <input
                type="checkbox"
                checked={formState.statusRules?.allowDropWithNeighbor}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    statusRules: { ...formState.statusRules, allowDropWithNeighbor: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#6500FF] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Maximum Delivery Attempts</span>
                <span className="text-[11px] text-[#A7B1C2]">Attempts before automatic return to vault</span>
              </div>
              <select
                value={formState.statusRules?.maxDeliveryAttempts}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    statusRules: { ...formState.statusRules, maxDeliveryAttempts: Number(e.target.value) },
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#11172C] border border-[#28334B] text-white"
              >
                <option value={2}>2 Attempts</option>
                <option value={3}>3 Attempts (Standard)</option>
                <option value={4}>4 Attempts</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#28334B]">
            <h4 className="font-bold text-sm text-white mb-2">Delivery Charges & Thresholds</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B]">
                <span className="text-[#A7B1C2] text-[11px] block">Free Shipping Threshold</span>
                <input
                  type="number"
                  value={formState.deliveryCharges?.freeThreshold}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      deliveryCharges: { ...formState.deliveryCharges, freeThreshold: Number(e.target.value) },
                    })
                  }
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#11172C] border border-[#28334B] text-white font-bold"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B]">
                <span className="text-[#A7B1C2] text-[11px] block">Standard Metro Fee (₹)</span>
                <input
                  type="number"
                  value={formState.deliveryCharges?.standardFee}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      deliveryCharges: { ...formState.deliveryCharges, standardFee: Number(e.target.value) },
                    })
                  }
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#11172C] border border-[#28334B] text-white font-bold"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B]">
                <span className="text-[#A7B1C2] text-[11px] block">Urgent 2-Hour Express Fee (₹)</span>
                <input
                  type="number"
                  value={formState.deliveryCharges?.expressFee}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      deliveryCharges: { ...formState.deliveryCharges, expressFee: Number(e.target.value) },
                    })
                  }
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#11172C] border border-[#28334B] text-white font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB B: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-white">
            Logistics Alerts & Customer SMS / WhatsApp Dispatch
          </h3>

          <div className="space-y-3">
            {[
              { key: 'notifyNewOrder', title: 'New Outbound Order Alerts', desc: 'Notify delivery manager when new verified orders enter dispatch pool' },
              { key: 'notifyAssignment', title: 'Rider Assignment Confirmation', desc: 'Send automated push notification to rider mobile app upon order allocation' },
              { key: 'notifyFailedAttempt', title: 'Failed Attempt Immediate Escalation', desc: 'Alert ops team instantly when a doorstep delivery fails' },
              { key: 'notifyReturnPickup', title: 'Customer Return Pickup Notification', desc: 'Notify reverse logistics team when customer books return' },
              { key: 'smsToCustomer', title: 'Customer Doorstep OTP & ETA SMS', desc: 'Send live tracking link and 4-digit verification code to customer phone' },
              { key: 'whatsappUpdates', title: 'WhatsApp Live Location Bot', desc: 'Send real-time driver arrival ETA updates on WhatsApp' },
            ].map((item) => (
              <div
                key={item.key}
                className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">{item.title}</span>
                  <span className="text-[11px] text-[#A7B1C2]">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={formState.notifications?.[item.key]}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      notifications: { ...formState.notifications, [item.key]: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#6500FF] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB C: RIDER SETTINGS */}
      {activeSubTab === 'riders' && (
        <div className="p-6 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-white">
            Rider Fleet Capacity & Assignment Constraints
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B]">
              <span className="font-bold text-white block">Maximum Active Drops per Rider</span>
              <p className="text-[11px] text-[#A7B1C2] mt-0.5">Cap on active deliveries simultaneously assigned to a single driver</p>
              <input
                type="number"
                value={formState.riderLimits?.maxActiveOrdersPerRider}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    riderLimits: { ...formState.riderLimits, maxActiveOrdersPerRider: Number(e.target.value) },
                  })
                }
                className="w-32 mt-3 px-3 py-1.5 rounded-lg bg-[#11172C] border border-[#28334B] text-white font-bold"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Cross-Area Assignment</span>
                <span className="text-[11px] text-[#A7B1C2]">Allow assigning orders outside rider's default corridor</span>
              </div>
              <input
                type="checkbox"
                checked={formState.riderLimits?.allowCrossAreaAssignment}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    riderLimits: { ...formState.riderLimits, allowCrossAreaAssignment: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#6500FF] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB D: TRACKING & API KEYS */}
      {activeSubTab === 'tracking' && (
        <div className="p-6 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-white">
            Live Telemetry & Courier Webhook Integrations
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">GPS Telemetry Ping Interval (Seconds)</label>
              <input
                type="number"
                value={formState.trackingApis?.gpsFrequencySeconds}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    trackingApis: { ...formState.trackingApis, gpsFrequencySeconds: Number(e.target.value) },
                  })
                }
                className="w-48 px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Blue Dart Enterprise API Key</label>
              <input
                type="password"
                value={formState.trackingApis?.blueDartApiKey}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    trackingApis: { ...formState.trackingApis, blueDartApiKey: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Delhivery Webhook Token</label>
              <input
                type="password"
                value={formState.trackingApis?.delhiveryApiKey}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    trackingApis: { ...formState.trackingApis, delhiveryApiKey: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB E: PROFILE SETTINGS */}
      {activeSubTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-white">
            Delivery Manager Employee Profile
          </h3>

          <div className="flex items-center gap-4 pb-4 border-b border-[#28334B]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] flex items-center justify-center text-xl font-bold text-white shadow-lg">
              KV
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{formState.profile?.name}</h4>
              <p className="text-[11px] text-[#E9B94F] font-semibold">{formState.profile?.designation}</p>
              <p className="text-[10px] text-[#A7B1C2]">{formState.profile?.hub}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Employee Name</label>
              <input
                type="text"
                value={formState.profile?.name}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    profile: { ...formState.profile, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
              />
            </div>

            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Email</label>
              <input
                type="email"
                value={formState.profile?.email}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    profile: { ...formState.profile, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
              />
            </div>

            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Official Mobile</label>
              <input
                type="text"
                value={formState.profile?.phone}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    profile: { ...formState.profile, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
              />
            </div>

            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Employee ID</label>
              <input
                type="text"
                disabled
                value={formState.profile?.employeeId}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-gray-400 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB F: ASSIGNED PERMISSIONS */}
      {activeSubTab === 'permissions' && (
        <div className="p-6 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Role Permissions & Access Matrix
              </h3>
              <p className="text-xs text-[#A7B1C2]">
                Active role: <strong className="text-[#E9B94F]">Delivery Manager</strong> (Strict role isolation enforced)
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/30">
              11 Modules Authorized
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formState.permissions?.map((p) => (
              <div
                key={p.module}
                className="p-3 rounded-xl bg-[#081529] border border-[#28334B] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">{p.module}</span>
                  <span className="text-[10px] text-[#A7B1C2]">{p.access}</span>
                </div>
                <div className="flex items-center gap-1 text-[#00C98B] text-[11px] font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Granted</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverySettingsModule;
