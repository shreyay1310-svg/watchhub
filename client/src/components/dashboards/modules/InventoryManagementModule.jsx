import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Warehouse,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  QrCode,
  FileText,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Check,
  Building2,
  Boxes,
  ClipboardList,
  Clock,
  Printer,
  ChevronRight
} from 'lucide-react';

const INITIAL_INVENTORY = [
  { sku: 'WHC-001', name: 'Classic Chronograph Watch', category: 'Men', warehouse: 'Mumbai Central Vault', stock: 45, reorderLevel: 15, status: 'Optimal', unitCost: '₹14,500', bay: 'Bay A-12' },
  { sku: 'WHP-005', name: 'Elegant Partywear Watch', category: 'Partywear', warehouse: 'Delhi North Hub', stock: 28, reorderLevel: 10, status: 'Optimal', unitCost: '₹9,800', bay: 'Bay B-04' },
  { sku: 'WHD-002', name: 'Combo – Men & Women Pair', category: 'Combo Offers', warehouse: 'Mumbai Central Vault', stock: 35, reorderLevel: 12, status: 'Optimal', unitCost: '₹16,200', bay: 'Bay A-08' },
  { sku: 'WHD-008', name: 'Digital Sports Tactical Watch', category: 'Digital', warehouse: 'Bangalore South Hub', stock: 5, reorderLevel: 15, status: 'Low Stock', unitCost: '₹4,200', bay: 'Bay C-11' },
  { sku: 'WHS-010', name: 'Smartwatch Pro AMOLED', category: 'Smartwatches', warehouse: 'Mumbai Central Vault', stock: 8, reorderLevel: 15, status: 'Low Stock', unitCost: '₹18,500', bay: 'Bay C-02' },
  { sku: 'WHW-006', name: 'Waterproof Diver 200M', category: 'Waterproof', warehouse: 'Delhi North Hub', stock: 22, reorderLevel: 10, status: 'Optimal', unitCost: '₹12,400', bay: 'Bay B-15' },
  { sku: 'WHL-099', name: 'Royal Heritage Golden Tourbillon', category: 'Luxury', warehouse: 'Mumbai Central Vault', stock: 3, reorderLevel: 5, status: 'Low Stock', unitCost: '₹4,50,000', bay: 'Bay Vault-01' },
  { sku: 'W-ROLEX-SUB-41', name: 'Rolex Submariner Date 41mm', category: 'Luxury', warehouse: 'Mumbai Central Vault', stock: 4, reorderLevel: 2, status: 'Optimal', unitCost: '₹9,80,000', bay: 'Bay Vault-02' },
  { sku: 'W-OMEGA-MOON-01', name: 'Omega Speedmaster Moonwatch', category: 'Luxury', warehouse: 'Mumbai Central Vault', stock: 6, reorderLevel: 3, status: 'Optimal', unitCost: '₹5,20,000', bay: 'Bay Vault-03' },
  { sku: 'W-SEIKO-SPEED-01', name: 'Seiko Prospex Speedtimer', category: 'Men', warehouse: 'Bangalore South Hub', stock: 18, reorderLevel: 8, status: 'Optimal', unitCost: '₹42,000', bay: 'Bay C-07' }
];

// Mock Stock Audit Trail / Movement Logs
const INITIAL_STOCK_LOGS = [
  { id: '#LOG-9041', time: '10 mins ago', sku: 'WHC-001', name: 'Classic Chronograph Watch', type: 'Inward (+)', qty: 50, warehouse: 'Mumbai Central Vault', operator: 'Rajesh Sharma', ref: 'PO-2026-8812', reason: 'Factory Supply Arrival' },
  { id: '#LOG-9040', time: '45 mins ago', sku: 'W-ROLEX-SUB-41', name: 'Rolex Submariner Date 41mm', type: 'Outward (-)', qty: 1, warehouse: 'Mumbai Central Vault', operator: 'Vikram Joshi', ref: 'ORD-WH12548', reason: 'Dispatched to Customer' },
  { id: '#LOG-9039', time: '2 hours ago', sku: 'WHS-010', name: 'Smartwatch Pro AMOLED', type: 'Transfer (⇄)', qty: 15, warehouse: 'Delhi North Hub', operator: 'Deepak Rao', ref: 'REQ-TRF-402', reason: 'Inter-warehouse Rebalancing' },
  { id: '#LOG-9038', time: 'Yesterday', sku: 'WHP-005', name: 'Elegant Partywear Watch', type: 'Damage Adj (-)', qty: 2, warehouse: 'Bangalore South Hub', operator: 'Sunil Kumar', ref: 'QC-REJ-108', reason: 'Crystal Blemish during unloading' }
];

// Mock Stock Requests
const INITIAL_STOCK_REQUESTS = [
  {
    id: '#REQ-TRF-403',
    date: '04 Nov 2026',
    fromWarehouse: 'Mumbai Central Vault',
    toWarehouse: 'Bangalore South Hub',
    sku: 'WHD-008',
    item: 'Digital Sports Tactical Watch',
    qty: 30,
    priority: 'Urgent',
    reason: 'Stock depleted below safety threshold (Only 5 left)',
    status: 'Pending Approval',
    requestedBy: 'Sunil Kumar (BLR Lead)'
  },
  {
    id: '#REQ-TRF-402',
    date: '04 Nov 2026',
    fromWarehouse: 'Mumbai Central Vault',
    toWarehouse: 'Delhi North Hub',
    sku: 'WHS-010',
    item: 'Smartwatch Pro AMOLED',
    qty: 25,
    priority: 'High',
    reason: 'Festive Diwali rush spike in North region',
    status: 'In Transit',
    requestedBy: 'Deepak Rao (DEL Lead)'
  },
  {
    id: '#REQ-TRF-401',
    date: '03 Nov 2026',
    fromWarehouse: 'Delhi North Hub',
    toWarehouse: 'Mumbai Central Vault',
    sku: 'W-SEIKO-SPEED-01',
    item: 'Seiko Prospex Speedtimer',
    qty: 10,
    priority: 'Standard',
    reason: 'Regional balance reconciliation',
    status: 'Completed & Received',
    requestedBy: 'Rajesh Sharma (BOM Lead)'
  }
];

export const InventoryManagementModule = ({ activeSubTab = 'inventory', onSubTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeSubTab);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [stockLogs, setStockLogs] = useState(INITIAL_STOCK_LOGS);
  const [stockRequests, setStockRequests] = useState(INITIAL_STOCK_REQUESTS);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('All');

  // Stock Update Form State
  const [stockOp, setStockOp] = useState({
    sku: 'WHC-001',
    type: 'Inward (+)',
    qty: '',
    warehouse: 'Mumbai Central Vault',
    batchNo: 'BATCH-2026-NOV',
    reason: 'Fresh Manufacturer Supply',
    operator: 'Current Inventory Manager'
  });
  const [barcodeScanInput, setBarcodeScanInput] = useState('');

  // New Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    fromWarehouse: 'Mumbai Central Vault',
    toWarehouse: 'Delhi North Hub',
    sku: 'WHD-008',
    qty: 20,
    priority: 'High',
    reason: 'Stock replenishment for regional surge'
  });

  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  const switchTab = (tab) => {
    setCurrentTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Perform Stock Adjustment
  const handlePerformStockUpdate = (e) => {
    e.preventDefault();
    const qtyNum = Number(stockOp.qty);
    if (!qtyNum || qtyNum <= 0) {
      alert('Please enter a valid positive quantity.');
      return;
    }

    const selectedItem = inventory.find(i => i.sku === stockOp.sku);
    if (!selectedItem) return;

    let newStock = selectedItem.stock;
    if (stockOp.type.includes('+') || stockOp.type.includes('Inward')) {
      newStock += qtyNum;
    } else {
      if (newStock < qtyNum) {
        alert(`⚠️ Insufficient stock! Available: ${newStock} units.`);
        return;
      }
      newStock -= qtyNum;
    }

    // Update inventory
    setInventory(inventory.map(item => {
      if (item.sku === stockOp.sku) {
        return {
          ...item,
          stock: newStock,
          status: newStock <= item.reorderLevel ? 'Low Stock' : 'Optimal'
        };
      }
      return item;
    }));

    // Add Audit Log
    const newLog = {
      id: `#LOG-${Math.floor(9100 + Math.random() * 800)}`,
      time: 'Just now',
      sku: stockOp.sku,
      name: selectedItem.name,
      type: stockOp.type,
      qty: qtyNum,
      warehouse: stockOp.warehouse,
      operator: 'You (Inventory Manager)',
      ref: `AUD-${Date.now().toString().slice(-6)}`,
      reason: stockOp.reason
    };
    setStockLogs([newLog, ...stockLogs]);

    alert(`✅ Stock updated! ${stockOp.type} ${qtyNum} units applied to ${stockOp.sku}. New On-Hand: ${newStock} units.`);
    setStockOp({ ...stockOp, qty: '' });
  };

  // Approve Stock Request
  const handleApproveRequest = (reqId) => {
    setStockRequests(stockRequests.map(r => {
      if (r.id === reqId) {
        return { ...r, status: 'In Transit' };
      }
      return r;
    }));
    alert(`🚚 Requisition ${reqId} Approved! Dispatch transfer manifest generated with tracking ID.`);
  };

  // Create New Stock Requisition
  const handleCreateRequest = (e) => {
    e.preventDefault();
    const item = inventory.find(i => i.sku === newRequest.sku);
    const req = {
      id: `#REQ-TRF-${Math.floor(410 + Math.random() * 90)}`,
      date: 'Today',
      fromWarehouse: newRequest.fromWarehouse,
      toWarehouse: newRequest.toWarehouse,
      sku: newRequest.sku,
      item: item?.name || 'Watch Item',
      qty: Number(newRequest.qty),
      priority: newRequest.priority,
      reason: newRequest.reason,
      status: 'Pending Approval',
      requestedBy: 'Current Inventory Manager'
    };
    setStockRequests([req, ...stockRequests]);
    setRequestModalOpen(false);
    alert(`📋 Stock Transfer Requisition ${req.id} created and sent to Central Vault Lead.`);
  };

  const filteredInventory = inventory.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchWarehouse = warehouseFilter === 'All' || i.warehouse.includes(warehouseFilter);
    return matchSearch && matchWarehouse;
  });

  return (
    <div className="space-y-6">
      {/* Upper Module Sub-Tab Switcher Bar (Matches Screenshots 2 & 3) */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => switchTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'inventory'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📦</span> Inventory Overview
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">
              {inventory.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('stock_update')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'stock_update'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🔄</span> Stock Update
          </button>

          <button
            onClick={() => switchTab('stock_requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'stock_requests'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📋</span> Stock Requests
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-full font-bold">
              {stockRequests.filter(r => r.status === 'Pending Approval').length}
            </span>
          </button>

          <button
            onClick={() => switchTab('warehouses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'warehouses'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🏢</span> Warehouses
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 font-semibold pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Stock Accuracy: 99.8% Barcode Verified</span>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: INVENTORY OVERVIEW (📦 Inventory)
          ========================================================================= */}
      {currentTab === 'inventory' && (
        <div className="space-y-5">
          {/* Warehouse Facilities Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-watch-navy font-bold text-xs mb-1">
                <Warehouse className="w-4 h-4 text-watch-gold" /> Mumbai Central Vault (Main)
              </div>
              <p className="text-xl font-extrabold text-gray-900">4,820 <span className="text-xs font-normal text-gray-400">/ 10,000 units</span></p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[48%]"></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-watch-navy font-bold text-xs mb-1">
                <Warehouse className="w-4 h-4 text-watch-gold" /> Delhi North Distribution Hub
              </div>
              <p className="text-xl font-extrabold text-gray-900">2,510 <span className="text-xs font-normal text-gray-400">/ 8,000 units</span></p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full w-[31%]"></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-watch-navy font-bold text-xs mb-1">
                <Warehouse className="w-4 h-4 text-watch-gold" /> Bangalore South Facility
              </div>
              <p className="text-xl font-extrabold text-gray-900">1,210 <span className="text-xs font-normal text-gray-400">/ 5,000 units</span></p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full w-[24%]"></div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Actions Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by SKU or Timepiece..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-xs outline-none focus:border-watch-gold"
                />
              </div>
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 outline-none"
              >
                <option value="All">All Warehouses</option>
                <option value="Mumbai">Mumbai Central Vault</option>
                <option value="Delhi">Delhi North Hub</option>
                <option value="Bangalore">Bangalore South Hub</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => switchTab('stock_update')}
                className="h-9 px-3.5 bg-watch-gold hover:bg-watch-gold-dark text-watch-navy-dark text-xs font-extrabold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Adjust Stock
              </button>
              <button
                onClick={() => switchTab('stock_requests')}
                className="h-9 px-3.5 bg-watch-navy-dark text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-black"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-watch-gold" /> Request Transfer
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Watch Model & Category</th>
                    <th className="py-3 px-4">Storage Bay & Warehouse</th>
                    <th className="py-3 px-4">Available Units</th>
                    <th className="py-3 px-4">Reorder Level</th>
                    <th className="py-3 px-4">Unit Valuation</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.sku} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{item.sku}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{item.name}</span>
                        <span className="text-[10.5px] text-gray-500">{item.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800 block">{item.warehouse}</span>
                        <span className="font-mono text-[10px] text-watch-gold font-bold">{item.bay}</span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-gray-900 text-sm">{item.stock} units</td>
                      <td className="py-3 px-4 text-gray-500 font-mono">{item.reorderLevel} units</td>
                      <td className="py-3 px-4 font-bold text-gray-800">{item.unitCost}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                          item.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.status === 'Optimal' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: STOCK UPDATE (🔄 Stock Update Console)
          ========================================================================= */}
      {currentTab === 'stock_update' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Stock Adjustment Form */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-watch-gold" /> Physical Stock Movement Console
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">Record factory arrivals, adjustments or damage deductions.</p>
              </div>
            </div>

            {/* Quick Barcode Scanner Simulation */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-watch-gold" /> Scan Barcode / SKU
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcodeScanInput}
                  onChange={(e) => setBarcodeScanInput(e.target.value)}
                  placeholder="Scan SKU barcode e.g. WHC-001"
                  className="flex-1 h-8 px-3 rounded-lg border border-gray-300 text-xs font-mono outline-none focus:border-watch-gold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const match = inventory.find(i => i.sku.toLowerCase() === barcodeScanInput.toLowerCase());
                    if (match) {
                      setStockOp({ ...stockOp, sku: match.sku, warehouse: match.warehouse });
                      alert(`✅ Barcode matched: ${match.name} (${match.sku})`);
                    } else {
                      alert('SKU not found in active catalog.');
                    }
                  }}
                  className="px-3 bg-watch-navy-dark text-white rounded-lg text-xs font-bold hover:bg-black"
                >
                  Lookup
                </button>
              </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handlePerformStockUpdate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Target SKU & Timepiece</label>
                <select
                  value={stockOp.sku}
                  onChange={(e) => {
                    const selected = inventory.find(i => i.sku === e.target.value);
                    setStockOp({ ...stockOp, sku: e.target.value, warehouse: selected?.warehouse || stockOp.warehouse });
                  }}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-bold outline-none focus:border-watch-gold"
                >
                  {inventory.map((i) => (
                    <option key={i.sku} value={i.sku}>
                      {i.sku} — {i.name} (Current: {i.stock} units)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Movement Type</label>
                  <select
                    value={stockOp.type}
                    onChange={(e) => setStockOp({ ...stockOp, type: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-bold outline-none"
                  >
                    <option value="Inward (+)">Inward Supply (+)</option>
                    <option value="Outward (-)">Outward Manual (-)</option>
                    <option value="Damage (-)">Damaged / Defect (-)</option>
                    <option value="Audit (+)">Audit Reconciliation (+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    value={stockOp.qty}
                    onChange={(e) => setStockOp({ ...stockOp, qty: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-bold outline-none focus:border-watch-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Destination Facility</label>
                <select
                  value={stockOp.warehouse}
                  onChange={(e) => setStockOp({ ...stockOp, warehouse: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs outline-none"
                >
                  <option value="Mumbai Central Vault">Mumbai Central Vault (Main)</option>
                  <option value="Delhi North Hub">Delhi North Distribution Hub</option>
                  <option value="Bangalore South Hub">Bangalore South Facility</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Batch / Inward Lot Ref</label>
                <input
                  type="text"
                  value={stockOp.batchNo}
                  onChange={(e) => setStockOp({ ...stockOp, batchNo: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Movement Reason / PO Number</label>
                <input
                  type="text"
                  value={stockOp.reason}
                  onChange={(e) => setStockOp({ ...stockOp, reason: e.target.value })}
                  placeholder="e.g. Supplier Batch #441 Arrival"
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gold py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-luxury"
              >
                <Check className="w-4 h-4" /> Commit Stock Update & Sign Audit Log
              </button>
            </form>
          </div>

          {/* Right Column: Live Movement Logs & Audit Trail */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-watch-navy-dark" /> Real-Time Stock Movement Audit Trail
                </h4>
                <p className="text-xs text-gray-500">Tamper-evident chronological log of all warehouse movements.</p>
              </div>
              <button
                onClick={() => alert('📄 Audit Log exported in CSV / Excel format.')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" /> Export Logs
              </button>
            </div>

            <div className="space-y-3">
              {stockLogs.map((log) => {
                const isInward = log.type.includes('+');
                return (
                  <div key={log.id} className="p-3.5 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 text-xs flex items-center justify-between gap-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                        isInward ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isInward ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{log.name}</span>
                          <span className="font-mono text-[10px] text-gray-400">({log.sku})</span>
                        </div>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          {log.reason} • Ref: <span className="font-mono font-bold text-gray-700">{log.ref}</span> • {log.warehouse}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-black text-sm block ${isInward ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isInward ? `+${log.qty}` : `-${log.qty}`} units
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{log.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: STOCK REQUESTS (📋 Stock Requests Requisitions)
          ========================================================================= */}
      {currentTab === 'stock_requests' && (
        <div className="space-y-5">
          {/* Header Controls */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-watch-gold" /> Inter-Warehouse Stock Requisitions & Transfer Desk
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage stock transfer requests between Mumbai Central Vault, Delhi North, and Bangalore South.
              </p>
            </div>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Stock Requisition
            </button>
          </div>

          {/* Stock Requests Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Request ID & Date</th>
                    <th className="py-3 px-4">Requested Watch Item</th>
                    <th className="py-3 px-4">Transfer Route (From → To)</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Priority & Justification</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stockRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-gray-900 block">{req.id}</span>
                        <span className="text-[10px] text-gray-400">{req.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{req.item}</span>
                        <span className="font-mono text-[10px] text-gray-400">SKU: {req.sku}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800 block text-[11px]">{req.fromWarehouse}</span>
                        <span className="text-[10px] text-watch-gold font-bold flex items-center gap-1">
                          → {req.toWarehouse}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-gray-900 text-sm">{req.qty} units</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : req.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {req.priority}
                        </span>
                        <span className="block text-[10.5px] text-gray-500 mt-0.5">{req.reason}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'Completed & Received'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {req.status === 'Pending Approval' ? (
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            className="px-3 py-1.5 bg-watch-gold hover:bg-watch-gold-dark text-watch-navy-dark font-extrabold rounded-lg text-xs"
                          >
                            Approve Transfer
                          </button>
                        ) : (
                          <span className="text-gray-400 font-semibold text-[11px]">Authorized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Request Modal */}
          {requestModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-base font-bold text-gray-900 mb-1">Create Stock Transfer Requisition</h3>
                <p className="text-xs text-gray-500 mb-4">Request inventory allocation from high-stock facilities.</p>

                <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Select Timepiece SKU</label>
                    <select
                      value={newRequest.sku}
                      onChange={(e) => setNewRequest({ ...newRequest, sku: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-bold outline-none"
                    >
                      {inventory.map((i) => (
                        <option key={i.sku} value={i.sku}>
                          {i.sku} — {i.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Source (From)</label>
                      <select
                        value={newRequest.fromWarehouse}
                        onChange={(e) => setNewRequest({ ...newRequest, fromWarehouse: e.target.value })}
                        className="w-full h-9 px-2 rounded-lg border border-gray-300 text-xs outline-none"
                      >
                        <option value="Mumbai Central Vault">Mumbai Central Vault</option>
                        <option value="Delhi North Hub">Delhi North Hub</option>
                        <option value="Bangalore South Hub">Bangalore South Hub</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Destination (To)</label>
                      <select
                        value={newRequest.toWarehouse}
                        onChange={(e) => setNewRequest({ ...newRequest, toWarehouse: e.target.value })}
                        className="w-full h-9 px-2 rounded-lg border border-gray-300 text-xs outline-none"
                      >
                        <option value="Delhi North Hub">Delhi North Hub</option>
                        <option value="Bangalore South Hub">Bangalore South Hub</option>
                        <option value="Mumbai Central Vault">Mumbai Central Vault</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Quantity (Units)</label>
                      <input
                        type="number"
                        value={newRequest.qty}
                        onChange={(e) => setNewRequest({ ...newRequest, qty: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-bold outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Requisition Priority</label>
                      <select
                        value={newRequest.priority}
                        onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                        className="w-full h-9 px-2 rounded-lg border border-gray-300 text-xs outline-none"
                      >
                        <option value="Urgent">Urgent (Stock Out Risk)</option>
                        <option value="High">High</option>
                        <option value="Standard">Standard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Business Reason</label>
                    <input
                      type="text"
                      value={newRequest.reason}
                      onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRequestModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-gold px-5 py-2 rounded-xl font-bold"
                    >
                      Submit Requisition
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 4: WAREHOUSES (🏢 Warehouses Overview)
          ========================================================================= */}
      {currentTab === 'warehouses' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Mumbai Central High-Security Vault',
                type: 'Primary Luxury Vault & Fulfillment Center',
                capacity: '10,000 units',
                occupied: '4,820 units (48%)',
                manager: 'Rajesh Sharma',
                contact: '+91 22 2844 9901',
                bays: '12 Bays (Vault 1-4 climate controlled)'
              },
              {
                name: 'Delhi North Regional Distribution Hub',
                type: 'High-Volume North Transit Center',
                capacity: '8,000 units',
                occupied: '2,510 units (31%)',
                manager: 'Deepak Rao',
                contact: '+91 11 4455 2200',
                bays: '8 Standard Bays'
              },
              {
                name: 'Bangalore South Fulfillment Center',
                type: 'Tech Corridor & South Distribution',
                capacity: '5,000 units',
                occupied: '1,210 units (24%)',
                manager: 'Sunil Kumar',
                contact: '+91 80 6677 8899',
                bays: '6 Standard Bays'
              }
            ].map((wh, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-watch-navy-dark text-watch-gold flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs">{wh.name}</h5>
                    <span className="text-[10px] text-gray-500">{wh.type}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-bold text-gray-900">{wh.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupancy:</span>
                    <span className="font-bold text-emerald-600">{wh.occupied}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facility Lead:</span>
                    <span className="font-bold text-gray-800">{wh.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Zones:</span>
                    <span className="font-semibold text-gray-700">{wh.bays}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagementModule;
