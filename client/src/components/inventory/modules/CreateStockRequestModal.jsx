import React from 'react';

export default function CreateStockRequestModal({
  isOpen,
  onClose,
  newRequest,
  setNewRequest,
  handleCreateRequest,
  inventory = [],
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-base font-bold text-[#F8FAFC] mb-1">Create Stock Transfer Requisition</h3>
        <p className="text-xs text-[#A6B1C8] mb-4">Request inventory allocation from high-stock facilities.</p>

        <form onSubmit={handleCreateRequest} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[#A6B1C8] font-semibold mb-1">Select Timepiece SKU</label>
            <select
              value={newRequest.sku}
              onChange={(e) => setNewRequest({ ...newRequest, sku: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-white/15 text-xs font-bold outline-none"
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
              <label className="block text-[#A6B1C8] font-semibold mb-1">Source (From)</label>
              <select
                value={newRequest.fromWarehouse}
                onChange={(e) => setNewRequest({ ...newRequest, fromWarehouse: e.target.value })}
                className="w-full h-9 px-2 rounded-lg border border-white/15 text-xs outline-none"
              >
                <option value="Mumbai Central Vault">Mumbai Central Vault</option>
                <option value="Delhi North Hub">Delhi North Hub</option>
                <option value="Bangalore South Hub">Bangalore South Hub</option>
              </select>
            </div>

            <div>
              <label className="block text-[#A6B1C8] font-semibold mb-1">Destination (To)</label>
              <select
                value={newRequest.toWarehouse}
                onChange={(e) => setNewRequest({ ...newRequest, toWarehouse: e.target.value })}
                className="w-full h-9 px-2 rounded-lg border border-white/15 text-xs outline-none"
              >
                <option value="Delhi North Hub">Delhi North Hub</option>
                <option value="Bangalore South Hub">Bangalore South Hub</option>
                <option value="Mumbai Central Vault">Mumbai Central Vault</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A6B1C8] font-semibold mb-1">Quantity (Units)</label>
              <input
                type="number"
                value={newRequest.qty}
                onChange={(e) => setNewRequest({ ...newRequest, qty: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-white/15 text-xs font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#A6B1C8] font-semibold mb-1">Requisition Priority</label>
              <select
                value={newRequest.priority}
                onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                className="w-full h-9 px-2 rounded-lg border border-white/15 text-xs outline-none"
              >
                <option value="Urgent">Urgent (Stock Out Risk)</option>
                <option value="High">High</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#A6B1C8] font-semibold mb-1">Business Reason</label>
            <input
              type="text"
              value={newRequest.reason}
              onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-white/15 text-xs outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/15 rounded-xl text-[#A6B1C8] font-bold"
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
  );
}
