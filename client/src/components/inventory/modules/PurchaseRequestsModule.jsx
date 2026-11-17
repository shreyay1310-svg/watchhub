import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  X,
  Building2,
  Calendar,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function PurchaseRequestsModule({
  purchaseRequests = [],
  products = [],
  warehouses = [],
  onCreatePR = () => {},
  onUpdatePRStatus = () => {},
}) {
  const safePurchaseRequests = Array.isArray(purchaseRequests) ? purchaseRequests : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [viewPRItem, setViewPRItem] = useState(null);

  // New PR Form State
  const [newPRForm, setNewPRForm] = useState({
    supplier: 'Rolex Geneva SA / Swiss Imports Ltd',
    destinationWarehouse: 'Main Warehouse',
    requiredByDate: '25 Nov 2026',
    priority: 'Standard',
    items: [
      {
        productId: safeProducts[0]?.id || '',
        name: safeProducts[0]?.name || '',
        sku: safeProducts[0]?.sku || '',
        quantity: 10,
        unitCost: safeProducts[0]?.unitCost || 780000,
      },
    ],
    notes: 'Safety stock replenishment for upcoming festive boutique peak.',
  });

  const filteredPRs = useMemo(() => {
    return safePurchaseRequests.filter((pr) => {
      if (!pr) return false;
      const matchStatus = statusFilter === 'All' || pr.status === statusFilter || pr.stage === statusFilter;
      const matchSearch =
        !searchQuery ||
        pr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.destinationWarehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [purchaseRequests, statusFilter, searchQuery]);

  const handleAddItemToForm = () => {
    const prod = products[0];
    setNewPRForm({
      ...newPRForm,
      items: [
        ...newPRForm.items,
        {
          productId: prod?.id || '',
          name: prod?.name || '',
          sku: prod?.sku || '',
          quantity: 5,
          unitCost: prod?.unitCost || 500000,
        },
      ],
    });
  };

  const handleItemProductChange = (index, prodId) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const updatedItems = [...newPRForm.items];
    updatedItems[index] = {
      ...updatedItems[index],
      productId: prod.id,
      name: prod.name,
      sku: prod.sku,
      unitCost: prod.unitCost,
    };
    setNewPRForm({ ...newPRForm, items: updatedItems });
  };

  const handleItemQtyChange = (index, qty) => {
    const updatedItems = [...newPRForm.items];
    updatedItems[index].quantity = Number(qty) || 1;
    setNewPRForm({ ...newPRForm, items: updatedItems });
  };

  const handleRemoveItem = (index) => {
    if (newPRForm.items.length <= 1) return;
    const updatedItems = newPRForm.items.filter((_, i) => i !== index);
    setNewPRForm({ ...newPRForm, items: updatedItems });
  };

  const calculateFormTotal = () => {
    return newPRForm.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newPR = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      supplier: newPRForm.supplier,
      destinationWarehouse: newPRForm.destinationWarehouse,
      requiredByDate: newPRForm.requiredByDate,
      priority: newPRForm.priority,
      status: 'Submitted',
      stage: 'Submitted',
      createdBy: 'Suresh Patel (Inventory Lead)',
      items: newPRForm.items,
      totalCost: calculateFormTotal(),
      notes: newPRForm.notes,
    };
    onCreatePR(newPR);
    setShowNewModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
      case 'Received':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      case 'Ordered':
      case 'Under Review':
        return 'bg-blue-500/20 text-[#00D5FF] border border-blue-500/40';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
    }
  };

  const downloadPDFSummary = (pr) => {
    const itemsText = (pr?.items || []).map((i) => `- ${i?.name || 'Item'} (${i?.sku || 'SKU'}) x ${i?.quantity || 0} units @ ₹${Number(i?.unitCost || 0).toLocaleString('en-IN')}`).join('\n');
    const content = `WATCHHUB LUXURY HOROLOGY - PURCHASE ORDER\nPO Number: ${pr?.id || 'N/A'}\nDate: ${pr?.date || 'N/A'}\nSupplier: ${pr?.supplier || 'N/A'}\nDestination: ${pr?.destinationWarehouse || 'Central Vault'}\nStatus: ${pr?.status || 'Pending'}\n\nITEMS:\n${itemsText}\n\nTOTAL ESTIMATED: ₹${Number(pr?.totalCost || 0).toLocaleString('en-IN')}\n\nAuthorized by: ${pr?.createdBy || 'Inventory Manager'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WatchHub_PO_${pr?.id || 'PO'}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Procurement Lifecycle
            </span>
            <span className="text-xs text-[#A7B1C2]">• Official PO Requisitions</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Purchase Requests (PR)</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Manage factory orders, manufacturer replenishments, approvals, and inbound customs receiving.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#6500FF]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Request</span>
        </button>
      </div>

      {/* 2. Lifecycle Stepper Banner */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <h3 className="text-xs font-bold text-[#E9B94F] uppercase tracking-wider mb-3">
          Standard Purchase Requisition Pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          {['Draft', 'Submitted', 'Under Review', 'Approved', 'Ordered', 'Received'].map((stg, i) => (
            <div key={stg} className="p-2.5 rounded-xl bg-[#17165A]/50 border border-[#29305D] flex flex-col items-center justify-center">
              <span className="w-5 h-5 rounded-full bg-[#6500FF]/30 text-[#00D5FF] font-mono text-[10px] font-bold flex items-center justify-center mb-1">
                {i + 1}
              </span>
              <span className="font-semibold text-white text-[11px]">{stg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Search & Filters */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PR #, supplier, warehouse..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              <option value="All">All Stages / Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Ordered">Ordered (In Transit)</option>
              <option value="Received">Received &amp; Stocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">PR #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Manufacturer / Supplier</th>
                <th className="py-3 px-3">Destination Vault</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Est. Total Cost</th>
                <th className="py-3 px-3">Required By</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29305D]/50">
              {filteredPRs.map((pr) => (
                <tr key={pr.id} className="hover:bg-[#17165A]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#00D5FF] text-[11px]">{pr.id}</td>
                  <td className="py-3 px-3 text-gray-300">{pr.date}</td>
                  <td className="py-3 px-3 font-semibold text-white">{pr.supplier}</td>
                  <td className="py-3 px-3 text-gray-200">{pr.destinationWarehouse}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-white">
                    {pr.items?.length || 1} SKUs
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#E9B94F]">
                    ₹{(pr.totalCost / 100000).toFixed(2)} Lakhs
                  </td>
                  <td className="py-3 px-3 text-gray-300">{pr.requiredByDate}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(pr.status)}`}>
                      {pr.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewPRItem(pr)}
                        className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#6500FF]/30 text-[#00D5FF] border border-[#29305D] transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => downloadPDFSummary(pr)}
                        className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#E9B94F]/20 text-[#E9B94F] border border-[#29305D] transition-all cursor-pointer"
                        title="Download PO Summary"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: NEW PR CREATION */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Draft Factory Purchase Request</h3>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supplier / Horological Manufacture *</label>
                  <select
                    value={newPRForm.supplier}
                    onChange={(e) => setNewPRForm({ ...newPRForm, supplier: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    <option value="Rolex Geneva SA / Swiss Imports Ltd">Rolex Geneva SA / Swiss Imports Ltd</option>
                    <option value="The Swatch Group India Pvt Ltd (Omega/Tissot)">The Swatch Group India Pvt Ltd (Omega/Tissot)</option>
                    <option value="LVMH Watch & Jewelry India (TAG Heuer)">LVMH Watch & Jewelry India (TAG Heuer)</option>
                    <option value="Seiko Watch Corporation Japan">Seiko Watch Corporation Japan</option>
                    <option value="Cartier Horlogerie SA">Cartier Horlogerie SA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Destination Vault *</label>
                  <select
                    value={newPRForm.destinationWarehouse}
                    onChange={(e) => setNewPRForm({ ...newPRForm, destinationWarehouse: e.target.value })}
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
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Required By Date</label>
                  <input
                    type="text"
                    value={newPRForm.requiredByDate}
                    onChange={(e) => setNewPRForm({ ...newPRForm, requiredByDate: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Order Priority</label>
                  <select
                    value={newPRForm.priority}
                    onChange={(e) => setNewPRForm({ ...newPRForm, priority: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Urgent">Urgent (Express Air Freight)</option>
                    <option value="Backorder Reserve">Backorder Reserve</option>
                  </select>
                </div>
              </div>

              {/* Line Items List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">Line Items</h4>
                  <button
                    type="button"
                    onClick={handleAddItemToForm}
                    className="text-xs text-[#00D5FF] hover:underline font-bold"
                  >
                    + Add Timepiece SKU
                  </button>
                </div>

                {newPRForm.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#17165A]/40 rounded-xl border border-[#29305D] grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-6">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemProductChange(idx, e.target.value)}
                        className="w-full bg-[#11123D] border border-[#29305D] rounded-lg p-2 text-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemQtyChange(idx, e.target.value)}
                        placeholder="Quantity"
                        className="w-full bg-[#11123D] border border-[#29305D] rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div className="md:col-span-2 text-right font-mono font-bold text-[#E9B94F]">
                      ₹{((item.quantity * item.unitCost) / 100000).toFixed(1)}L
                    </div>

                    <div className="md:col-span-1 text-center">
                      {newPRForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-[#17165A] rounded-xl border border-[#29305D] flex justify-between items-center text-xs">
                  <span className="text-[#A7B1C2] font-semibold">Total Estimated Procurement Cost:</span>
                  <span className="font-mono font-black text-base text-[#E9B94F]">
                    ₹{(calculateFormTotal() / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Notes / Purpose of Requisition</label>
                <textarea
                  rows={2}
                  value={newPRForm.notes}
                  onChange={(e) => setNewPRForm({ ...newPRForm, notes: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Submit Purchase Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW PR DETAILS & WORKFLOW */}
      {viewPRItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#00D5FF]">{viewPRItem.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(viewPRItem.status)}`}>
                  {viewPRItem.status}
                </span>
              </div>
              <button onClick={() => setViewPRItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 p-3 bg-[#17165A]/40 rounded-xl border border-[#29305D]">
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Manufacturer:</span>
                <span className="font-semibold text-white">{viewPRItem.supplier}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Destination:</span>
                <span className="text-white">{viewPRItem.destinationWarehouse}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Requisition Date:</span>
                <span className="text-white">{viewPRItem.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Required By:</span>
                <span className="text-white">{viewPRItem.requiredByDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#A7B1C2]">Total Estimated:</span>
                <span className="text-[#E9B94F] font-bold font-mono">₹{Number(viewPRItem?.totalCost || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-2">Requested Timepiece Items</h4>
              <div className="space-y-1.5 border border-[#29305D] rounded-xl overflow-hidden p-2 bg-[#17165A]/20">
                {viewPRItem.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2 rounded bg-[#17165A]/40">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-[#A7B1C2] font-mono">{item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{item.quantity} Units</p>
                      <p className="text-[10px] text-[#E9B94F]">₹{((item.quantity * item.unitCost) / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#29305D] flex justify-between gap-2">
              <button
                onClick={() => downloadPDFSummary(viewPRItem)}
                className="px-3 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#00D5FF] font-bold border border-[#29305D] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PO PDF</span>
              </button>

              <div className="flex gap-2">
                {viewPRItem.status === 'Submitted' && (
                  <button
                    onClick={() => {
                      onUpdatePRStatus(viewPRItem.id, 'Approved');
                      setViewPRItem(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Approve PR
                  </button>
                )}
                {viewPRItem.status === 'Approved' && (
                  <button
                    onClick={() => {
                      onUpdatePRStatus(viewPRItem.id, 'Ordered');
                      setViewPRItem(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold cursor-pointer"
                  >
                    Mark as Ordered
                  </button>
                )}
                {viewPRItem.status === 'Ordered' && (
                  <button
                    onClick={() => {
                      onUpdatePRStatus(viewPRItem.id, 'Received');
                      setViewPRItem(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Receive into Vault
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
