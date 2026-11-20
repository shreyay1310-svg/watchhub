import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRightLeft } from 'lucide-react';

export default function InventoryDashboardModals({
  showAddStockModal,
  setShowAddStockModal,
  addForm,
  setAddForm,
  handleAddStockSubmit,
  showAdjustStockModal,
  setShowAdjustStockModal,
  adjustForm,
  setAdjustForm,
  handleAdjustSubmit,
  showTransferModal,
  setShowTransferModal,
  transferForm,
  setTransferForm,
  handleTransferSubmit,
  activeItemForDetail,
  setActiveItemForDetail,
  items = [],
}) {
  return (
    <>
      {/* ──────────────── MODALS (DARK NEON GLASS) ──────────────── */}

      {/* MODAL 1: ADD STOCK MODAL */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0B1022] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/15 text-xs text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                  +📦
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Add Inbound Stock Entry</h3>
                  <p className="text-[11px] text-gray-400">Log incoming purchase shipment into warehouse</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStockModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Select Timepiece / SKU</label>
                <select
                  value={addForm.sku}
                  onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                  className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-white focus:border-amber-400"
                >
                  {items.map((i) => (
                    <option key={i.sku} value={i.sku}>
                      {i.productName} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Destination Warehouse</label>
                  <select
                    value={addForm.warehouse}
                    onChange={(e) => setAddForm({ ...addForm, warehouse: e.target.value })}
                    className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-white focus:border-amber-400"
                  >
                    <option value="Main Warehouse">Main Warehouse (Gurugram)</option>
                    <option value="Delhi Warehouse">Delhi Warehouse (Okhla)</option>
                    <option value="Mumbai Warehouse">Mumbai Warehouse (BKC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Units Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={addForm.quantity}
                    onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
                    className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Supplier / Brand Partner</label>
                  <input
                    type="text"
                    value={addForm.supplier}
                    onChange={(e) => setAddForm({ ...addForm, supplier: e.target.value })}
                    className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">PO Reference Number</label>
                  <input
                    type="text"
                    value={addForm.reference}
                    onChange={(e) => setAddForm({ ...addForm, reference: e.target.value })}
                    className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-xs font-mono text-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black shadow-neon-gold hover:opacity-95"
                >
                  Confirm Stock Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: STOCK ADJUSTMENT MODAL */}
      {showAdjustStockModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0B1022] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/15 text-xs text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-400" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-white">Stock Adjustment</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdjustStockModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 pt-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">SKU</label>
                <input
                  type="text"
                  value={adjustForm.sku}
                  disabled
                  className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-mono font-bold text-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Adjustment Type</label>
                  <select
                    value={adjustForm.adjustType}
                    onChange={(e) => setAdjustForm({ ...adjustForm, adjustType: e.target.value })}
                    className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-white"
                  >
                    <option value="add">Increase (+) Stock</option>
                    <option value="reduce">Decrease (-) Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustForm.quantity}
                    onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                    className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Audit Reason</label>
                <select
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value="Audit Inventory Reconciliation">Audit Inventory Reconciliation</option>
                  <option value="Damaged in Transit">Damaged in Transit</option>
                  <option value="Customer Return Restocking">Customer Return Restocking</option>
                  <option value="Showroom Display Allocation">Showroom Display Allocation</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustStockModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-neon-cyan"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: WAREHOUSE TRANSFER */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0B1022] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/15 text-xs text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-white">Warehouse Transfer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Product SKU</label>
                <input
                  type="text"
                  value={transferForm.sku}
                  disabled
                  className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-mono font-bold text-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Source Hub</label>
                  <input
                    type="text"
                    value={transferForm.fromWarehouse}
                    disabled
                    className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-medium text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Destination Hub</label>
                  <select
                    value={transferForm.toWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                    className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-white"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Delhi Warehouse">Delhi Warehouse</option>
                    <option value="Mumbai Warehouse">Mumbai Warehouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Quantity to Move</label>
                <input
                  type="number"
                  min="1"
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                  className="w-full p-2 bg-[#050816] border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferModal(false);
                    showToast(`Dispatched transfer of ${transferForm.quantity} units to ${transferForm.toWarehouse}!`);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-black shadow-neon-cyan"
                >
                  Dispatch Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PRODUCT DETAIL PREVIEW */}
      {activeItemForDetail && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0B1022] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-white/15 text-xs text-white relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-white">Stock Details</span>
              <button
                type="button"
                onClick={() => setActiveItemForDetail(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-[#050816] p-2 border border-white/10 mb-3 flex items-center justify-center">
                <img
                  src={activeItemForDetail.image}
                  alt={activeItemForDetail.productName}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="font-extrabold text-sm text-white">{activeItemForDetail.productName}</h4>
              <p className="text-cyan-400 text-[11px] font-mono mt-0.5">{activeItemForDetail.sku}</p>
            </div>
            <div className="space-y-2 bg-[#050816] p-3 rounded-2xl border border-white/10 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Warehouse:</span>
                <span className="font-bold text-white">{activeItemForDetail.warehouseFullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Stock:</span>
                <span className="font-bold text-white">{activeItemForDetail.currentStock} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reserved for Orders:</span>
                <span className="font-bold text-amber-400">{activeItemForDetail.reservedStock} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available to Sell:</span>
                <span className="font-bold text-emerald-400">{activeItemForDetail.availableStock} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reorder Threshold:</span>
                <span className="font-bold text-gray-300">{activeItemForDetail.minLevel} Units</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setActiveItemForDetail(null)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
