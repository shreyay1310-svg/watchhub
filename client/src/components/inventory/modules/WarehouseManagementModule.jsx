import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit3,
  Eye,
  ArrowRightLeft,
  X,
  MapPin,
  User,
  Phone,
  Mail,
  Box,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export default function WarehouseManagementModule({
  warehouses,
  products,
  onAddWarehouse,
  onUpdateWarehouse,
  onTransferStock,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editWarehouseItem, setEditWarehouseItem] = useState(null);
  const [viewWarehouseItem, setViewWarehouseItem] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Form for Add/Edit
  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    code: '',
    location: '',
    capacityUnits: 5000,
    supervisor: '',
    contact: '',
    status: 'Operational',
  });

  // Transfer Form
  const [transferForm, setTransferForm] = useState({
    productId: products[0]?.id || '',
    fromWarehouse: warehouses[0]?.name || 'Main Central Vault',
    toWarehouse: warehouses[1]?.name || 'Delhi Regional Warehouse',
    quantity: 2,
    notes: 'Inter-vault stock balance',
  });

  const handleOpenAdd = () => {
    setWarehouseForm({
      name: '',
      code: `WH-0${warehouses.length + 1}`,
      location: '',
      capacityUnits: 5000,
      supervisor: '',
      contact: '',
      status: 'Operational',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (wh) => {
    setEditWarehouseItem(wh);
    setWarehouseForm({
      name: wh.name,
      code: wh.code || wh.id,
      location: wh.location,
      capacityUnits: wh.capacityUnits,
      supervisor: wh.supervisor,
      contact: wh.contact || '',
      status: wh.status || 'Operational',
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newWh = {
      id: warehouseForm.code || `WH-0${warehouses.length + 1}`,
      name: warehouseForm.name,
      code: warehouseForm.code,
      location: warehouseForm.location,
      capacityUnits: Number(warehouseForm.capacityUnits) || 5000,
      currentUnits: 0,
      supervisor: warehouseForm.supervisor,
      contact: warehouseForm.contact,
      status: warehouseForm.status,
      type: 'Regional Distribution Hub',
    };
    onAddWarehouse(newWh);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editWarehouseItem) return;
    const updated = {
      ...editWarehouseItem,
      name: warehouseForm.name,
      location: warehouseForm.location,
      capacityUnits: Number(warehouseForm.capacityUnits) || editWarehouseItem.capacityUnits,
      supervisor: warehouseForm.supervisor,
      contact: warehouseForm.contact,
      status: warehouseForm.status,
    };
    onUpdateWarehouse(updated);
    setEditWarehouseItem(null);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    onTransferStock({
      productId: transferForm.productId,
      fromWarehouse: transferForm.fromWarehouse,
      toWarehouse: transferForm.toWarehouse,
      quantity: Number(transferForm.quantity),
      notes: transferForm.notes,
    });
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Vault Infrastructure
            </span>
            <span className="text-xs text-[#A7B1C2]">• 4 Secured Distribution Centers</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Warehouse Management</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Oversee physical security vaults, climate-controlled safe storage, capacity metrics, and transit corridors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#E9B94F] border border-[#E9B94F]/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Stock Transfer Form</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#6500FF]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Warehouse</span>
          </button>
        </div>
      </div>

      {/* 2. Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {warehouses.map((wh) => {
          const whProducts = products.filter(
            (p) => p.warehouse === wh.name || p.warehouseId === wh.id || p.warehouse === wh.code
          );
          const currentUnits = whProducts.reduce((sum, p) => sum + (p.totalQty || 0), 0);
          const lowStockCount = whProducts.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
          const uniqueBrands = [...new Set(whProducts.map((p) => p.brand))];
          const utilPercent = Math.min(100, Math.round((currentUnits / wh.capacityUnits) * 100));

          return (
            <div
              key={wh.id}
              className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl hover:border-[#6500FF] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17165A] text-[#00D5FF] border border-[#29305D]">
                      {wh.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {wh.status || 'Active'}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#A7B1C2]">{wh.type || 'Primary Vault'}</span>
                </div>

                {/* Name & Location */}
                <h3 className="text-lg font-black text-white">{wh.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#A7B1C2] mt-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#E9B94F] shrink-0" />
                  <span className="line-clamp-1">{wh.location}</span>
                </div>

                {/* Supervisor & Metrics Strip */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#17165A]/40 border border-[#29305D]/60 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-[#A7B1C2] block">Vault Supervisor</span>
                    <strong className="text-white text-xs">{wh.supervisor}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A7B1C2] block">Current Stored</span>
                    <strong className="text-white text-xs">{currentUnits.toLocaleString()} Timepieces</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A7B1C2] block">Vault Capacity</span>
                    <span className="text-gray-300 font-mono">{wh.capacityUnits.toLocaleString()} units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A7B1C2] block">Low Stock Items</span>
                    <span className={lowStockCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {lowStockCount} SKUs
                    </span>
                  </div>
                </div>

                {/* Active Brands Tags */}
                <div className="mb-4">
                  <span className="text-[10px] text-[#A7B1C2] uppercase tracking-wider block mb-1.5 font-bold">
                    Stored Brands ({uniqueBrands.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueBrands.slice(0, 5).map((b) => (
                      <span key={b} className="px-2 py-0.5 rounded bg-[#17165A] text-white text-[10px] border border-[#29305D]">
                        {b}
                      </span>
                    ))}
                    {uniqueBrands.length > 5 && (
                      <span className="px-2 py-0.5 rounded bg-[#17165A] text-[#00D5FF] text-[10px] border border-[#29305D]">
                        +{uniqueBrands.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress & Bottom Buttons */}
              <div className="pt-3 border-t border-[#29305D]/60 space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#A7B1C2]">Vault Capacity Occupancy</span>
                    <span className="font-mono font-bold text-[#00D5FF]">{utilPercent}%</span>
                  </div>
                  <div className="w-full bg-[#17165A] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6500FF] to-[#00D5FF] rounded-full transition-all duration-500"
                      style={{ width: `${utilPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => setViewWarehouseItem(wh)}
                    className="flex-1 py-2 rounded-xl bg-[#17165A] hover:bg-[#6500FF]/30 text-[#00D5FF] border border-[#29305D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Stored Stock</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(wh)}
                    className="p-2 rounded-xl bg-[#17165A] hover:bg-[#E9B94F]/20 text-[#E9B94F] border border-[#29305D] transition-all cursor-pointer"
                    title="Edit Warehouse Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: ADD WAREHOUSE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Add New Warehouse / Vault</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Warehouse Name *</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  placeholder="e.g. Bangalore Tech Hub Warehouse"
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Warehouse Code</label>
                <input
                  type="text"
                  value={warehouseForm.code}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                  placeholder="WH-05"
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Address / Location *</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.location}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, location: e.target.value })}
                  placeholder="e.g. Whitefield Export Zone, Bangalore"
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Total Capacity (Units)</label>
                  <input
                    type="number"
                    min="100"
                    value={warehouseForm.capacityUnits}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, capacityUnits: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supervisor Name *</label>
                  <input
                    type="text"
                    required
                    value={warehouseForm.supervisor}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, supervisor: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Create Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT WAREHOUSE */}
      {editWarehouseItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Edit Warehouse Information</h3>
              </div>
              <button onClick={() => setEditWarehouseItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Warehouse Name</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Address / Location</label>
                <input
                  type="text"
                  required
                  value={warehouseForm.location}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, location: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Capacity (Units)</label>
                  <input
                    type="number"
                    value={warehouseForm.capacityUnits}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, capacityUnits: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supervisor</label>
                  <input
                    type="text"
                    required
                    value={warehouseForm.supervisor}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, supervisor: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setEditWarehouseItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW STORED STOCK DETAILS */}
      {viewWarehouseItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{viewWarehouseItem.name}</h3>
                  <p className="text-[11px] text-[#A7B1C2]">{viewWarehouseItem.location}</p>
                </div>
              </div>
              <button onClick={() => setViewWarehouseItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#E9B94F] uppercase tracking-wider">
                Timepiece Inventory in Vault
              </h4>

              <div className="divide-y divide-[#29305D]/50 border border-[#29305D] rounded-xl overflow-hidden">
                {products
                  .filter((p) => p.warehouse === viewWarehouseItem.name || p.warehouseId === viewWarehouseItem.id)
                  .map((p) => (
                    <div key={p.id} className="p-3 bg-[#17165A]/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-black/30" />
                        <div>
                          <p className="font-bold text-white">{p.name}</p>
                          <p className="text-[10px] text-[#A7B1C2]">{p.sku} • {p.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{p.availableQty} Units</p>
                        <p className="text-[10px] text-emerald-400">₹{Number(p.sellingPrice).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#29305D] flex justify-end">
              <button
                onClick={() => setViewWarehouseItem(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: INTER-WAREHOUSE STOCK TRANSFER */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Inter-Vault Stock Transfer</h3>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Select Timepiece SKU *</label>
                <select
                  value={transferForm.productId}
                  onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Available: {p.availableQty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Origin Warehouse *</label>
                  <select
                    value={transferForm.fromWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, fromWarehouse: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Destination Vault *</label>
                  <select
                    value={transferForm.toWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Quantity to Dispatch</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Courier / Transit Reference</label>
                <input
                  type="text"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  placeholder="e.g. Armored logistics transit #TR-994"
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Authorize Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
