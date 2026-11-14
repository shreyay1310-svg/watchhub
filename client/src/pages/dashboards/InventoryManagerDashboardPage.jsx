import React, { useState } from 'react';
import InventoryManagerLayout from '../../components/inventory/InventoryManagerLayout';
import InventoryManagerDashboard from '../../components/inventory/InventoryManagerDashboard';
import {
  Boxes,
  PieChart,
  Box,
  ArrowRightLeft,
  SlidersHorizontal,
  Building2,
  Bell,
  FileSpreadsheet,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  Download,
} from 'lucide-react';

export default function InventoryManagerDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for other sidebar sections
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  return (
    <InventoryManagerLayout
      activeTab={activeTab}
      onSelectTab={(tabId) => setActiveTab(tabId)}
      selectedWarehouse={selectedWarehouse}
      onSelectWarehouse={(wh) => setSelectedWarehouse(wh)}
      onSearch={(q) => setSearchQuery(q)}
      onOpenNotifications={() => setShowNotificationsModal(true)}
      onOpenSupport={() => setShowSupportModal(true)}
    >
      {/* Active Tab View */}
      {activeTab === 'dashboard' && (
        <InventoryManagerDashboard
          activeSidebarTab={activeTab}
          selectedWarehouseFilter={selectedWarehouse}
          searchQuery={searchQuery}
        />
      )}

      {/* Tab: Stock Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Stock Overview Analytics</h2>
              <p className="text-gray-500 text-xs">Comprehensive breakdown of inventory valuation, turns and velocity.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <InventoryManagerDashboard
            activeSidebarTab="dashboard"
            selectedWarehouseFilter={selectedWarehouse}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Tab: Inventory (Stock) */}
      {activeTab === 'stock' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Full Inventory Catalogue (Stock)</h2>
              <p className="text-gray-500 text-xs">Direct SKU inventory master levels and real-time buffer allocations.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <InventoryManagerDashboard
            activeSidebarTab="dashboard"
            selectedWarehouseFilter={selectedWarehouse}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Tab: Stock Movements */}
      {activeTab === 'movements' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Stock Movements &amp; Inbound Log</h2>
              <p className="text-gray-500 text-xs">Real-time ledger of inbound purchases, transfer dispatches and adjustments.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase">
                  <th className="py-2.5">Movement ID</th>
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Product SKU</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Quantity</th>
                  <th className="py-2.5">Warehouse Location</th>
                  <th className="py-2.5">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 font-mono font-bold text-[#071426]">MOV-9841</td>
                  <td className="py-3 text-gray-500">10 mins ago</td>
                  <td className="py-3 font-bold">Rolex Submariner (WH-ROL-001)</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">Inbound Restock</span></td>
                  <td className="py-3 font-bold text-emerald-600">+10 Units</td>
                  <td className="py-3 text-gray-600">Main Warehouse (Gurugram)</td>
                  <td className="py-3 text-gray-700 font-medium">Rajesh Mehta</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 font-mono font-bold text-[#071426]">MOV-9840</td>
                  <td className="py-3 text-gray-500">45 mins ago</td>
                  <td className="py-3 font-bold">Omega Speedmaster (WH-OMG-001)</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">Hub Transfer</span></td>
                  <td className="py-3 font-bold text-blue-600">⇄ 4 Units</td>
                  <td className="py-3 text-gray-600">Main → Delhi Warehouse</td>
                  <td className="py-3 text-gray-700 font-medium">Rajesh Mehta</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 font-mono font-bold text-[#071426]">MOV-9839</td>
                  <td className="py-3 text-gray-500">2 hours ago</td>
                  <td className="py-3 font-bold">Apple Watch S10 (WH-APL-001)</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">Customer Order Dispatch</span></td>
                  <td className="py-3 font-bold text-purple-600">-2 Units</td>
                  <td className="py-3 text-gray-600">Delhi Warehouse</td>
                  <td className="py-3 text-gray-700 font-medium">Dispatch System</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Stock Adjustments */}
      {activeTab === 'adjustments' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Stock Adjustments &amp; Reconciliation</h2>
              <p className="text-gray-500 text-xs">Audit adjustments for damaged items, shrinkage or physical cycle counts.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <InventoryManagerDashboard
            activeSidebarTab="dashboard"
            selectedWarehouseFilter={selectedWarehouse}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Tab: Warehouse Management */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Warehouse Network Management</h2>
              <p className="text-gray-500 text-xs">Manage active distribution hubs, capacities and regional rebalancing.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">Primary Hub</span>
                <span className="font-mono text-gray-400">WH-01</span>
              </div>
              <h3 className="text-base font-extrabold text-[#071426]">Main Warehouse</h3>
              <p className="text-gray-500 text-[11px] mb-3">Gurugram Central Vault • DLF Cyber City</p>
              <div className="p-3 bg-gray-50 rounded-2xl mb-3 space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Current Stock:</span><span className="font-bold">8,420 Units</span></div>
                <div className="flex justify-between"><span>Capacity:</span><span>10,000 Units (68%)</span></div>
                <div className="flex justify-between"><span>Supervisor:</span><span className="font-semibold">Rajesh Mehta</span></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">Regional Hub</span>
                <span className="font-mono text-gray-400">WH-02</span>
              </div>
              <h3 className="text-base font-extrabold text-[#071426]">Delhi Warehouse</h3>
              <p className="text-gray-500 text-[11px] mb-3">Okhla Industrial Area Phase III</p>
              <div className="p-3 bg-gray-50 rounded-2xl mb-3 space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Current Stock:</span><span className="font-bold">2,640 Units</span></div>
                <div className="flex justify-between"><span>Capacity:</span><span>4,000 Units (21%)</span></div>
                <div className="flex justify-between"><span>Supervisor:</span><span className="font-semibold">Mohan Das</span></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-[10px]">West Coast Hub</span>
                <span className="font-mono text-gray-400">WH-03</span>
              </div>
              <h3 className="text-base font-extrabold text-[#071426]">Mumbai Warehouse</h3>
              <p className="text-gray-500 text-[11px] mb-3">BKC Logistics Center, Bandra East</p>
              <div className="p-3 bg-gray-50 rounded-2xl mb-3 space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Current Stock:</span><span className="font-bold">1,780 Units</span></div>
                <div className="flex justify-between"><span>Capacity:</span><span>3,000 Units (11%)</span></div>
                <div className="flex justify-between"><span>Supervisor:</span><span className="font-semibold">Kiran Joshi</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Reorder Alerts */}
      {activeTab === 'reorder' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#071426]">Reorder Alerts (18 Critical Items)</h2>
                <p className="text-gray-500 text-xs">Items that reached or breached their safety stock threshold.</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <InventoryManagerDashboard
            activeSidebarTab="dashboard"
            selectedWarehouseFilter={selectedWarehouse}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Tab: Purchase Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Purchase Requests &amp; Inbound Orders</h2>
              <p className="text-gray-500 text-xs">Pending brand manufacturer purchase requests waiting for delivery.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-[#071426]">Submitted Purchase Orders (4 Active)</span>
              <button className="px-3 py-1.5 rounded-xl bg-[#D6A63C] text-[#071426] font-bold">
                + New Purchase Request
              </button>
            </div>
            <div className="divide-y divide-gray-100 mt-2">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#071426]">PO-2026-901: Rolex Cosmograph Daytona (10 Units)</p>
                  <p className="text-gray-500 text-[11px]">Supplier: Rolex Geneva SA • ETA: 18 Nov 2026</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">Order Confirmed</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#071426]">PO-2026-899: Omega Speedmaster Professional (15 Units)</p>
                  <p className="text-gray-500 text-[11px]">Supplier: Swatch Group India • In Transit</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold">In Customs Clearance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Stock Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Stock Reports &amp; Valuations</h2>
              <p className="text-gray-500 text-xs">Valuation audit reports, inventory shrinkage and turn metrics.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <BarChart3 className="w-8 h-8 text-[#D6A63C] mb-2" />
              <h4 className="font-extrabold text-[#071426]">Valuation Report (₹8.42 Cr)</h4>
              <p className="text-gray-500 text-[11px] mt-1 mb-4">Complete asset valuation certified across all 3 central vaults.</p>
              <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Audit</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <PieChart className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-extrabold text-[#071426]">Category Turnover Analysis</h4>
              <p className="text-gray-500 text-[11px] mt-1 mb-4">Luxury chronographs vs Smartwatches turnover cycles.</p>
              <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel Report</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <Boxes className="w-8 h-8 text-emerald-600 mb-2" />
              <h4 className="font-extrabold text-[#071426]">Warehouse Utilization Index</h4>
              <p className="text-gray-500 text-[11px] mt-1 mb-4">Shelf space occupancy, cold storage and high-value vault limits.</p>
              <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download Metrics</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Inventory History */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Inventory Audit History</h2>
              <p className="text-gray-500 text-xs">Immutable chronological activity log of all warehouse changes.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                  +
                </div>
                <div>
                  <p className="font-bold text-[#071426]">Stock Received: 10 units of Rolex Submariner (WH-ROL-001)</p>
                  <p className="text-gray-500 text-[11px]">Operator: Rajesh Mehta (Inventory Mgr) • Timestamp: Today, 11:25 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                  ⇄
                </div>
                <div>
                  <p className="font-bold text-[#071426]">Warehouse Transfer: 4 units of Omega Speedmaster to Delhi</p>
                  <p className="text-gray-500 text-[11px]">Operator: Rajesh Mehta (Inventory Mgr) • Timestamp: Yesterday, 04:20 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                  !
                </div>
                <div>
                  <p className="font-bold text-[#071426]">Threshold Triggered: Omega Seamaster Diver 300M reached 0 stock</p>
                  <p className="text-gray-500 text-[11px]">System Auto Alert • Timestamp: 04 Nov 2026, 02:10 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#071426]">Inventory Operations Settings</h2>
              <p className="text-gray-500 text-xs">Configure buffer threshold alerts, auto-reorder triggers and barcode scanners.</p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs max-w-xl space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Default Low Stock Alert Threshold</label>
              <input type="number" defaultValue={5} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-800">Auto-Generate Purchase Request on 0 Stock</p>
                <p className="text-gray-500 text-[11px]">Automatically notify procurement when inventory reaches zero.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-[#071426]" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-800">SMS &amp; Email Dispatch on Low Stock Alerts</p>
                <p className="text-gray-500 text-[11px]">Notify inventory team when units dip below min level.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-[#071426]" />
            </div>
            <button className="px-5 py-2.5 bg-[#D6A63C] text-[#071426] font-bold rounded-xl shadow-xs">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* MODAL: NOTIFICATIONS POPUP */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-500" />
                <h3 className="font-bold text-sm text-[#071426]">Stock Alerts &amp; Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNotificationsModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 py-3">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                <span className="font-bold text-red-700 block">Out of Stock Alert</span>
                <span className="text-gray-600 text-[11px]">Omega Seamaster Diver 300M is at 0 units in Main Warehouse.</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="font-bold text-amber-700 block">Low Stock Warning</span>
                <span className="text-gray-600 text-[11px]">Omega Speedmaster has only 7 available units in Delhi Hub.</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="font-bold text-blue-700 block">Shipment Dispatched</span>
                <span className="text-gray-600 text-[11px]">Inbound shipment PO-2026-8841 received at central gate.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNotificationsModal(false)}
              className="w-full py-2 bg-[#071426] text-white rounded-xl font-bold mt-2"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}

      {/* MODAL: SUPPORT / NEED HELP */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D6A63C] text-2xl flex items-center justify-center mx-auto mb-3">
              📦
            </div>
            <h3 className="font-bold text-base text-[#071426] mb-1">Inventory Operations Helpdesk</h3>
            <p className="text-gray-500 mb-4 leading-relaxed">
              24×7 internal logistics and warehouse operations support for stock counts and replenishment.
            </p>
            <div className="p-3 bg-gray-50 rounded-2xl text-left space-y-2 mb-4 border border-gray-100">
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Warehouse Helpline:</span> +91 98765 43210
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Internal Email:</span> inventory@watchhub.in
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Fulfillment Head:</span> Vikramaditya Singhania
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#071426] text-white font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </InventoryManagerLayout>
  );
}
