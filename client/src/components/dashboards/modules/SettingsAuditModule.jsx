import React, { useState } from 'react';
import { Settings, ShieldCheck, FileText, Save, CheckCircle } from 'lucide-react';

const INITIAL_LOGS = [
  { id: 'log_1', time: '04 Nov 2026, 12:45 PM', actor: 'Vikramaditya Singhania (Super Admin)', action: 'Role Update', target: 'Staff usr_store_admin permissions updated', status: 'Success' },
  { id: 'log_2', time: '04 Nov 2026, 11:30 AM', actor: 'Suresh Patel (Inventory Manager)', action: 'Stock Inward', target: 'WHC-001 +100 units at Mumbai Central', status: 'Success' },
  { id: 'log_3', time: '04 Nov 2026, 10:15 AM', actor: 'Amit Sharma (Delivery Manager)', action: 'Shipment Dispatched', target: 'Order #WH12548 assigned BlueDart BLU-889124', status: 'Success' },
  { id: 'log_4', time: '03 Nov 2026, 04:20 PM', actor: 'Neha Kapoor (Support Executive)', action: 'Refund Escalation', target: 'Order #WH12544 ₹3,299 refund forwarded to Super Admin', status: 'Approved' },
  { id: 'log_5', time: '03 Nov 2026, 02:10 PM', actor: 'Rajesh Mehra (Store Admin)', action: 'Product Price Modified', target: 'Smartwatch Pro price updated to ₹2,749', status: 'Success' },
];

export const SettingsAuditModule = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState({
    storeName: 'WatchHub – Premium Watches',
    supportEmail: 'support@watchhub.in',
    supportPhone: '1800-WATCHHUB',
    gstRate: '18',
    freeShippingAbove: '999',
    returnWindowDays: '7',
    razorpayKey: 'rzp_test_watchhub2026',
    enableCod: true,
  });
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>⚙️</span> System Settings & Audit Trail
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure payment gateways, tax rates, return policies and review role audit history.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-white text-watch-navy shadow-sm' : 'text-gray-500'}`}
          >
            Store Configuration
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'audit' ? 'bg-white text-watch-navy shadow-sm' : 'text-gray-500'}`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {activeTab === 'settings' ? (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-xs max-w-2xl">
          {savedMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4" /> System settings updated and applied across all modules.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Store Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">GST / Tax Rate (%)</label>
              <input
                type="number"
                value={settings.gstRate}
                onChange={(e) => setSettings({ ...settings, gstRate: e.target.value })}
                className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Free Shipping (₹)</label>
              <input
                type="number"
                value={settings.freeShippingAbove}
                onChange={(e) => setSettings({ ...settings, freeShippingAbove: e.target.value })}
                className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Return Window (Days)</label>
              <input
                type="number"
                value={settings.returnWindowDays}
                onChange={(e) => setSettings({ ...settings, returnWindowDays: e.target.value })}
                className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Razorpay API Key (Sandbox Test Mode)</label>
            <input
              type="text"
              value={settings.razorpayKey}
              onChange={(e) => setSettings({ ...settings, razorpayKey: e.target.value })}
              className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold font-mono"
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-gold text-xs py-2 px-5 flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save Configuration
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10.5px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Member & Role</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target Record / Details</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {INITIAL_LOGS.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">{l.time}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{l.actor}</td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{l.target}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SettingsAuditModule;

