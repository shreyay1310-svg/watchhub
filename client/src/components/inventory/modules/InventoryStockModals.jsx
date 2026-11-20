import React from 'react';
import {
  X,
  PackagePlus,
  Box,
  Plus,
  ArrowRightLeft,
  Edit3,
  History,
  CheckCircle2,
  Building2,
} from 'lucide-react';

export default function InventoryStockModals({
  showAddStockModal,
  setShowAddStockModal,
  addStockForm,
  setAddStockForm,
  handleAddStockSubmit,
  products,
  warehouses,
  showAddProductModal,
  setShowAddProductModal,
  newProductForm,
  setNewProductForm,
  handleAddProductSubmit,
  editItem,
  setEditItem,
  handleEditSave,
  historyItem,
  setHistoryItem,
  stockUpdateItem,
  setStockUpdateItem,
  handleQuickStockUpdate,
  transferItem,
  setTransferItem,
  transferForm,
  setTransferForm,
  handleTransferSubmit,
  drawerProduct,
  setDrawerProduct,
}) {
  return (
    <>

      {/* REQUIRED ADD STOCK FORM MODAL:
          Fields: Select Product, SKU, Supplier, Warehouse, Quantity Received, Purchase Cost, Batch Number, Received Date, Invoice Number, Notes */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white flex items-center justify-center">
                  <PackagePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Inbound Stock Entry</h3>
                  <p className="text-[10px] text-[#A7B1C2]">Record physical delivery and supplier PO reception</p>
                </div>
              </div>
              <button onClick={() => setShowAddStockModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Select Product */}
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Select Timepiece Product *</label>
                  <select
                    value={addStockForm.productId}
                    onChange={(e) => {
                      const prod = products.find((p) => p.id === e.target.value);
                      if (prod) {
                        setAddStockForm({
                          ...addStockForm,
                          productId: prod.id,
                          sku: prod.sku,
                          supplier: prod.supplier,
                          warehouse: prod.warehouse,
                          purchaseCost: prod.unitCost,
                        });
                      }
                    }}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) — Available: {p.availableQty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. SKU (Readonly/Synced) */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Product SKU</label>
                  <input
                    type="text"
                    disabled
                    value={addStockForm.sku}
                    className="w-full bg-[#17165A]/50 border border-[#29305D] rounded-xl p-2.5 text-gray-400 font-mono"
                  />
                </div>

                {/* 3. Supplier */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supplier / Manufacture *</label>
                  <input
                    type="text"
                    required
                    value={addStockForm.supplier}
                    onChange={(e) => setAddStockForm({ ...addStockForm, supplier: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 4. Warehouse */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Destination Vault *</label>
                  <select
                    value={addStockForm.warehouse}
                    onChange={(e) => setAddStockForm({ ...addStockForm, warehouse: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Quantity Received */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Quantity Received (Units) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={addStockForm.quantityReceived}
                    onChange={(e) => setAddStockForm({ ...addStockForm, quantityReceived: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono font-bold focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 6. Purchase Cost */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Purchase Unit Cost (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addStockForm.purchaseCost}
                    onChange={(e) => setAddStockForm({ ...addStockForm, purchaseCost: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 7. Batch Number */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={addStockForm.batchNumber}
                    onChange={(e) => setAddStockForm({ ...addStockForm, batchNumber: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 8. Received Date */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Received Date</label>
                  <input
                    type="text"
                    value={addStockForm.receivedDate}
                    onChange={(e) => setAddStockForm({ ...addStockForm, receivedDate: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 9. Invoice Number */}
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supplier Invoice / PO Number *</label>
                  <input
                    type="text"
                    required
                    value={addStockForm.invoiceNumber}
                    onChange={(e) => setAddStockForm({ ...addStockForm, invoiceNumber: e.target.value })}
                    placeholder="e.g. INV-ROL-2026-8812"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 10. Notes */}
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Receipt &amp; Quality Notes</label>
                  <textarea
                    rows={2}
                    value={addStockForm.notes}
                    onChange={(e) => setAddStockForm({ ...addStockForm, notes: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#17165A] rounded-xl border border-[#29305D] flex justify-between items-center">
                <span className="text-[#A7B1C2]">Total Procurement Capital:</span>
                <span className="font-mono font-black text-sm text-[#E9B94F]">
                  ₹{Number((Number(addStockForm?.quantityReceived || 0) * Number(addStockForm?.purchaseCost || 0)) || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Stock Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Add New Product Reference</h3>
              </div>
              <button onClick={() => setShowAddProductModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Watch Model Name *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. Rolex Cosmograph Daytona"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Brand *</label>
                  <select
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  >
                    <option value="Rolex">Rolex</option>
                    <option value="Omega">Omega</option>
                    <option value="TAG Heuer">TAG Heuer</option>
                    <option value="Seiko">Seiko</option>
                    <option value="Tissot">Tissot</option>
                    <option value="Cartier">Cartier</option>
                    <option value="Breitling">Breitling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  >
                    <option value="Luxury Watches">Luxury Watches</option>
                    <option value="Men's Watches">Men's Watches</option>
                    <option value="Women's Watches">Women's Watches</option>
                    <option value="Sports Watches">Sports Watches</option>
                    <option value="Automatic Watches">Automatic Watches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    placeholder="WH-ROL-009"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Barcode</label>
                  <input
                    type="text"
                    value={newProductForm.barcode}
                    onChange={(e) => setNewProductForm({ ...newProductForm, barcode: e.target.value })}
                    placeholder="890123456789"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Warehouse</label>
                  <select
                    value={newProductForm.warehouse}
                    onChange={(e) => setNewProductForm({ ...newProductForm, warehouse: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>{wh.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Initial Stock (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.availableQty}
                    onChange={(e) => setNewProductForm({ ...newProductForm, availableQty: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT INFO */}
      {editProductItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <h3 className="text-base font-bold text-white">Edit Inventory Information</h3>
              <button onClick={() => setEditProductItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#A7B1C2] mb-1">Product Name</label>
                <input
                  type="text"
                  defaultValue={editProductItem.name}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7B1C2] mb-1">Min Stock Level</label>
                  <input
                    type="number"
                    defaultValue={editProductItem.minStock}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A7B1C2] mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    defaultValue={editProductItem.unitCost}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  defaultValue={editProductItem.sellingPrice}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#29305D]">
              <button
                type="button"
                onClick={() => setEditProductItem(null)}
                className="px-4 py-2 rounded-xl bg-[#17165A] text-[#A7B1C2] font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Updated specs for ${editProductItem.name}.`);
                  setEditProductItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PRODUCT HISTORY */}
      {historyProductItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#00D5FF]" />
                <h3 className="text-base font-bold text-white">Stock Audit Trail: {historyProductItem.sku}</h3>
              </div>
              <button onClick={() => setHistoryProductItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl">
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-[#00D5FF]">HIST-8910</span>
                  <span className="text-emerald-400 font-bold">+10 Units</span>
                </div>
                <p className="font-bold text-white">Inbound PO Restock verified</p>
                <p className="text-[10px] text-[#A7B1C2]">Today, 11:20 AM • Suresh Patel</p>
              </div>

              <div className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl">
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-[#00D5FF]">HIST-8909</span>
                  <span className="text-rose-400 font-bold">-1 Unit</span>
                </div>
                <p className="font-bold text-white">POS Retail Boutique Sale (#INV-WH9012)</p>
                <p className="text-[10px] text-[#A7B1C2]">Today, 10:45 AM • Terminal #04</p>
              </div>

              <div className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl">
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-[#00D5FF]">HIST-8906</span>
                  <span className="text-emerald-400 font-bold">+1 Unit</span>
                </div>
                <p className="font-bold text-white">Physical Safe Count Reconciliation finding</p>
                <p className="text-[10px] text-[#A7B1C2]">15 Nov 2026 • Approved by Director Singhania</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#29305D] flex justify-end">
              <button
                onClick={() => setHistoryProductItem(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK STOCK UPDATE MODAL */}
      {stockUpdateItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <h3 className="text-base font-bold text-white">Adjust Stock: {stockUpdateItem.sku}</h3>
              <button onClick={() => setStockUpdateItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStockUpdateForm({ ...stockUpdateForm, type: 'add' })}
                  className={`py-2 rounded-xl font-bold border transition-all ${stockUpdateForm.type === 'add'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-[#17165A] text-[#A7B1C2] border-[#29305D]'
                    }`}
                >
                  + Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setStockUpdateForm({ ...stockUpdateForm, type: 'subtract' })}
                  className={`py-2 rounded-xl font-bold border transition-all ${stockUpdateForm.type === 'subtract'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                    : 'bg-[#17165A] text-[#A7B1C2] border-[#29305D]'
                    }`}
                >
                  - Deduct Stock
                </button>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Quantity Delta</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockUpdateForm.qtyDelta}
                  onChange={(e) => setStockUpdateForm({ ...stockUpdateForm, qtyDelta: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Reason / Notes</label>
                <input
                  type="text"
                  required
                  value={stockUpdateForm.reason}
                  onChange={(e) => setStockUpdateForm({ ...stockUpdateForm, reason: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setStockUpdateItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTER-WAREHOUSE TRANSFER MODAL */}
      {transferItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <h3 className="text-base font-bold text-white">Inter-Vault Stock Transfer</h3>
              <button onClick={() => setTransferItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-[#A7B1C2] mb-1">Destination Vault</label>
                <select
                  value={transferForm.toWarehouse}
                  onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                >
                  {warehouses
                    .filter((wh) => wh.name !== transferItem.warehouse)
                    .map((wh) => (
                      <option key={wh.id} value={wh.name}>{wh.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Transfer Quantity (Max: {transferItem.availableQty})</label>
                <input
                  type="number"
                  min="1"
                  max={transferItem.availableQty}
                  required
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Transit / Courier Reference</label>
                <input
                  type="text"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setTransferItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
                >
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS DRAWER */}
      {drawerProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border-l border-[#29305D] w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-fade-in text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
                <span className="font-mono text-xs text-[#00D5FF] font-bold">{drawerProduct.sku}</span>
                <button onClick={() => setDrawerProduct(null)} className="text-[#A7B1C2] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center p-4 rounded-2xl bg-[#17165A]/40 border border-[#29305D]">
                <img
                  src={drawerProduct.image}
                  alt={drawerProduct.name}
                  className="w-32 h-32 object-contain bg-black/50 rounded-2xl p-2 mx-auto border border-white/10 mb-3"
                />
                <h3 className="text-base font-black text-white">{drawerProduct.name}</h3>
                <p className="text-xs text-[#E9B94F] font-bold mt-0.5">{drawerProduct.brand} • {drawerProduct.category}</p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-[#17165A]/30 border border-[#29305D]">
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Vault Location:</span>
                  <span className="font-semibold text-white">{drawerProduct?.warehouse || 'Central Vault'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Available Qty:</span>
                  <span className="font-bold text-emerald-400">
                    {Number(drawerProduct?.availableQty ?? drawerProduct?.availableStock ?? drawerProduct?.stock ?? 0).toLocaleString('en-IN')} units
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Reserved Qty:</span>
                  <span className="text-white">
                    {Number(drawerProduct?.reservedQty ?? drawerProduct?.reservedStock ?? 0).toLocaleString('en-IN')} units
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Unit Procurement Cost:</span>
                  <span className="text-white font-mono">
                    ₹{Number(drawerProduct?.unitCost ?? drawerProduct?.costPrice ?? drawerProduct?.price ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Total Stock Value:</span>
                  <span className="text-[#E9B94F] font-mono font-bold">
                    ₹{Number(((drawerProduct?.totalQty ?? drawerProduct?.stock ?? 0) * (drawerProduct?.unitCost ?? drawerProduct?.costPrice ?? drawerProduct?.price ?? 0)) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#A7B1C2]">Barcode:</span>
                  <span className="text-white font-mono">{drawerProduct?.barcode || '—'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#29305D]">
              <button
                onClick={() => setDrawerProduct(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
