import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  Building2,
  ShieldCheck,
  User,
  Save,
  Check,
  Lock,
  QrCode,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';

export default function InventorySettingsModule() {
  const [activeSubTab, setActiveSubTab] = useState('config');
  const [savedToast, setSavedToast] = useState(false);

  // Form states
  const [config, setConfig] = useState({
    defaultSafetyStock: 5,
    lowStockTriggerPercent: 20,
    costMethod: 'FIFO',
    autoReorderZeroStock: true,
    barcodeFormat: 'EAN-13',
    batchTrackingEnabled: true,
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    slackWebhook: true,
    frequency: 'Instant (Real-Time)',
    recipientEmail: 'inventory-ops@watchhub.luxury',
  });

  const [warehouseSettings, setWarehouseSettings] = useState({
    enforceDualCustody: true,
    highValueThreshold: 1000000,
    defaultReceivingDock: 'DLF Cyber City Vault Dock #1',
    dailyReconciliationCutoff: '18:00 IST',
  });

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Operations Center
            </span>
            <span className="text-xs text-[#A7B1C2]">• Global Parameters</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Inventory Settings &amp; Configuration</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Configure safety stock tolerances, automated PO triggering, dual-custody verification, and notifications.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#6500FF]/25 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Inventory settings updated successfully and propagated to all 4 vaults.</span>
        </div>
      )}

      {/* 2. Sub Tabs Navigation */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-2 flex flex-wrap gap-2 text-xs">
        {[
          { id: 'config', label: 'A. Inventory Config', icon: Sliders },
          { id: 'notif', label: 'B. Notifications & Alerts', icon: Bell },
          { id: 'wh', label: 'C. Vault & Warehouse', icon: Building2 },
          { id: 'rbac', label: 'D. Role & Permissions', icon: ShieldCheck },
          { id: 'profile', label: 'E. Profile & Security', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#6500FF] text-white shadow-md'
                  : 'text-[#A7B1C2] hover:text-white hover:bg-[#17165A]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub Tab Content */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-6 shadow-xl space-y-5 text-xs">
        {/* SUBTAB A: INVENTORY CONFIG */}
        {activeSubTab === 'config' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white border-b border-[#29305D] pb-2">
              Core Valuation &amp; Safety Thresholds
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A7B1C2] font-semibold mb-1">Default Minimum Safety Stock (Units)</label>
                <input
                  type="number"
                  value={config.defaultSafetyStock}
                  onChange={(e) => setConfig({ ...config, defaultSafetyStock: Number(e.target.value) })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] font-semibold mb-1">Low-Stock Trigger Percentage (%)</label>
                <input
                  type="number"
                  value={config.lowStockTriggerPercent}
                  onChange={(e) => setConfig({ ...config, lowStockTriggerPercent: Number(e.target.value) })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] font-semibold mb-1">Unit Cost Accounting Method</label>
                <select
                  value={config.costMethod}
                  onChange={(e) => setConfig({ ...config, costMethod: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                >
                  <option value="FIFO">FIFO (First In, First Out)</option>
                  <option value="Weighted">Weighted Average Cost (WAC)</option>
                  <option value="LIFO">LIFO (Last In, First Out)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A7B1C2] font-semibold mb-1">Barcode Standard Format</label>
                <select
                  value={config.barcodeFormat}
                  onChange={(e) => setConfig({ ...config, barcodeFormat: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                >
                  <option value="EAN-13">EAN-13 (Standard Horology)</option>
                  <option value="Code-128">Code-128 (Serial Barcode)</option>
                  <option value="QR-Code">QR Code (Chronometer Certificate)</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Auto-Generate Purchase Request at 0 Stock</h4>
                <p className="text-[11px] text-[#A7B1C2]">
                  Instantly creates a draft Purchase Request to Swiss factory when available stock depletes to 0.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.autoReorderZeroStock}
                onChange={(e) => setConfig({ ...config, autoReorderZeroStock: e.target.checked })}
                className="w-4 h-4 rounded text-[#6500FF]"
              />
            </div>
          </div>
        )}

        {/* SUBTAB B: NOTIFICATIONS */}
        {activeSubTab === 'notif' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white border-b border-[#29305D] pb-2">
              Alert Subscriptions &amp; Integrations
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Critical Low-Stock Email Notifications</h4>
                  <p className="text-[11px] text-[#A7B1C2]">Sends real-time email dispatches for breached minimum levels.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-[#6500FF]"
                />
              </div>

              <div className="p-3.5 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">SMS Alerts for Out-of-Stock Emergencies</h4>
                  <p className="text-[11px] text-[#A7B1C2]">Sends SMS directly to the duty inventory manager phone.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.smsAlerts}
                  onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-[#6500FF]"
                />
              </div>

              <div className="p-3.5 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Slack / Discord Horology Webhook</h4>
                  <p className="text-[11px] text-[#A7B1C2]">Broadcasts PO status changes and transfers to #inventory-ops channel.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.slackWebhook}
                  onChange={(e) => setNotifications({ ...notifications, slackWebhook: e.target.checked })}
                  className="w-4 h-4 rounded text-[#6500FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A7B1C2] font-semibold mb-1">Primary Operations Email</label>
              <input
                type="email"
                value={notifications.recipientEmail}
                onChange={(e) => setNotifications({ ...notifications, recipientEmail: e.target.value })}
                className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        )}

        {/* SUBTAB C: WAREHOUSE SETTINGS */}
        {activeSubTab === 'wh' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white border-b border-[#29305D] pb-2">
              Physical Vault &amp; Receiving Safeguards
            </h3>

            <div className="p-3.5 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Enforce Dual-Custody for High-Value Timepieces</h4>
                <p className="text-[11px] text-[#A7B1C2]">
                  Watches exceeding ₹10,00,000 require two authorized sign-offs for transfer or stock adjustment.
                </p>
              </div>
              <input
                type="checkbox"
                checked={warehouseSettings.enforceDualCustody}
                onChange={(e) => setWarehouseSettings({ ...warehouseSettings, enforceDualCustody: e.target.checked })}
                className="w-4 h-4 rounded text-[#6500FF]"
              />
            </div>

            <div>
              <label className="block text-[#A7B1C2] font-semibold mb-1">High-Value Threshold (₹)</label>
              <input
                type="number"
                value={warehouseSettings.highValueThreshold}
                onChange={(e) => setWarehouseSettings({ ...warehouseSettings, highValueThreshold: Number(e.target.value) })}
                className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#A7B1C2] font-semibold mb-1">Default Receiving Dock</label>
              <input
                type="text"
                value={warehouseSettings.defaultReceivingDock}
                onChange={(e) => setWarehouseSettings({ ...warehouseSettings, defaultReceivingDock: e.target.value })}
                className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        )}

        {/* SUBTAB D: ROLE & PERMISSIONS */}
        {activeSubTab === 'rbac' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-white border-b border-[#29305D] pb-2">
              Inventory Manager RBAC Permissions (Active Role)
            </h3>
            <p className="text-[11px] text-[#A7B1C2]">
              The Inventory Manager role has dedicated authority over physical vaults, stock ledger adjustments, and purchase requests. Store Admin dashboards are strictly isolated.
            </p>

            <div className="space-y-2">
              {[
                { perm: 'Master Inventory Management (Add, Edit, Categorize SKUs)', granted: true },
                { perm: 'Stock Inbound & Outbound Movement Ledger Authority', granted: true },
                { perm: 'Physical Cycle Count & Stock Adjustment Approvals', granted: true },
                { perm: 'Multi-Vault Inter-Warehouse Transfer Authorizations', granted: true },
                { perm: 'Factory Purchase Request Generation & Vendor PO Dispatch', granted: true },
                { perm: 'Immutable Audit History Log Read & Export Privileges', granted: true },
                { perm: 'Store Admin Boutique Order Management', granted: false, note: 'Restricted to Store Admin' },
                { perm: 'Customer Credit Card Payment Refunds', granted: false, note: 'Restricted to Finance' },
              ].map((p, idx) => (
                <div key={idx} className="p-3 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={p.granted ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                      {p.granted ? '✓' : '✗'}
                    </span>
                    <span className={p.granted ? 'text-white font-medium' : 'text-gray-400 line-through'}>
                      {p.perm}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.granted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                    {p.granted ? 'Granted' : p.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB E: PROFILE */}
        {activeSubTab === 'profile' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white border-b border-[#29305D] pb-2">
              Officer Profile &amp; Biometric Vault Key
            </h3>

            <div className="p-4 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#E9B94F] flex items-center justify-center font-black text-lg text-white">
                SP
              </div>
              <div>
                <h4 className="font-black text-white text-sm">Suresh Patel</h4>
                <p className="text-[11px] text-[#00D5FF] font-semibold">Chief Inventory Officer (CIO)</p>
                <p className="text-[10px] text-[#A7B1C2]">Badge: WH-INV-LEAD-001 • Main Central Vault</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Biometric Vault Passkey</h4>
                <p className="text-[11px] text-[#A7B1C2]">FIDO2 WebAuthn key linked for safe access approval.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                Enrolled
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
