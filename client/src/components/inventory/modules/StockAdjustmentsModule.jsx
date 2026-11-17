import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRightLeft,
  X,
  TrendingDown,
  TrendingUp,
  Building2,
  Download,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function StockAdjustmentsModule({
  adjustments,
  products,
  warehouses,
  onCreateAdjustment,
  onApproveRejectAdjustment,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [approvalModalItem, setApprovalModalItem] = useState(null);
  const [managerNote, setManagerNote] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    warehouse: 'Main Warehouse',
    recordedStock: products[0]?.totalQty || 24,
    physicalStock: products[0]?.totalQty || 24,
    reason: 'Damaged in transit / display scratch',
    notes: '',
    imageProof: '',
  });

  // Calculate metrics
  const totalAdjustments = adjustments.length;
  const netUnitDifference = adjustments.reduce((sum, a) => sum + (a.diff || 0), 0);
  const netValueImpact = adjustments.reduce((sum, a) => sum + (a.valueImpact || 0), 0);
  const pendingApprovals = adjustments.filter((a) => a.status === 'Under Review' || a.status === 'Draft').length;

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((a) => {
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchSearch =
        !searchQuery ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [adjustments, statusFilter, searchQuery]);

  const handleProductSelect = (prodId) => {
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setFormData({
        ...formData,
        productId: prod.id,
        warehouse: prod.warehouse,
        recordedStock: prod.totalQty,
        physicalStock: prod.totalQty,
      });
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === formData.productId) || products[0];
    const diff = Number(formData.physicalStock) - Number(formData.recordedStock);
    const valueImpact = diff * (prod.unitCost || 500000);

    const newAdj = {
      id: `ADJ-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      productName: prod.name,
      sku: prod.sku,
      warehouse: formData.warehouse,
      recordedStock: Number(formData.recordedStock),
      physicalStock: Number(formData.physicalStock),
      diff: diff,
      reason: formData.reason,
      valueImpact: valueImpact,
      status: 'Under Review',
      createdBy: 'Suresh Patel (Inventory Lead)',
      notes: formData.notes || 'Routine physical vault count variance.',
    };

    onCreateAdjustment(newAdj);
    setShowNewModal(false);
  };

  const handleApprovalAction = (status) => {
    if (!approvalModalItem) return;
    onApproveRejectAdjustment(approvalModalItem.id, status, managerNote);
    setApprovalModalItem(null);
    setManagerNote('');
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Audit &amp; Reconciliation
            </span>
            <span className="text-xs text-[#A7B1C2]">• Dual-Signoff Protocol</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Stock Adjustments &amp; Cycle Counts</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Log physical safe audit discrepancies, damage write-downs, and execute manager approvals.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#6500FF]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Stock Adjustment</span>
        </button>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Total Adjustments</span>
            <SlidersHorizontal className="w-4 h-4 text-[#6500FF]" />
          </div>
          <p className="text-xl font-black text-white">{totalAdjustments}</p>
          <p className="text-[10px] text-[#A7B1C2] mt-0.5">Logged cycle counts</p>
        </div>

        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Net Unit Adjustment</span>
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-black font-mono text-amber-400">
            {netUnitDifference > 0 ? `+${netUnitDifference}` : netUnitDifference} Units
          </p>
          <p className="text-[10px] text-amber-300/80 mt-0.5">Physical count delta</p>
        </div>

        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Net Value Variance</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-lg font-black font-mono text-rose-400 truncate">
            {netValueImpact < 0 ? `-₹${Math.abs(netValueImpact).toLocaleString('en-IN')}` : `+₹${netValueImpact.toLocaleString('en-IN')}`}
          </p>
          <p className="text-[10px] text-rose-300/80 mt-0.5">Financial asset impact</p>
        </div>

        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Pending Approvals</span>
            <Clock className="w-4 h-4 text-[#00D5FF]" />
          </div>
          <p className="text-xl font-black text-[#00D5FF]">{pendingApprovals}</p>
          <p className="text-[10px] text-[#00D5FF]/80 mt-0.5">Awaiting Manager sign-off</p>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, SKU, product, reason..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Adjustments Ledger Table */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Adjustment ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Product / SKU</th>
                <th className="py-3 px-3">Warehouse</th>
                <th className="py-3 px-3 text-center">Rec. vs Physical</th>
                <th className="py-3 px-3 text-center">Variance</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-right">Value Impact</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29305D]/50">
              {filteredAdjustments.map((a) => (
                <tr key={a.id} className="hover:bg-[#17165A]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#00D5FF] text-[11px]">{a.id}</td>
                  <td className="py-3 px-3 text-gray-300">{a.date}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-white text-xs">{a.productName}</p>
                    <p className="text-[10px] font-mono text-[#A7B1C2]">{a.sku}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-200">{a.warehouse}</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="text-[#A7B1C2]">{a.recordedStock}</span> →{' '}
                    <strong className="text-white">{a.physicalStock}</strong>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span className={a.diff > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {a.diff > 0 ? `+${a.diff}` : a.diff}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-gray-300 line-clamp-1">{a.reason}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">
                    <span className={a.valueImpact < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {a.valueImpact < 0 ? `-₹${Math.abs(a.valueImpact).toLocaleString('en-IN')}` : `+₹${a.valueImpact.toLocaleString('en-IN')}`}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : a.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {a.status === 'Under Review' ? (
                      <button
                        onClick={() => setApprovalModalItem(a)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-[11px] shadow-xs cursor-pointer"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#A7B1C2] italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: NEW ADJUSTMENT FORM */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Record Physical Stock Adjustment</h3>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Select Timepiece SKU *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Current: {p.totalQty} Units
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Warehouse Safe Location *</label>
                <select
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.name}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">System Recorded Stock</label>
                  <input
                    type="number"
                    disabled
                    value={formData.recordedStock}
                    className="w-full bg-[#17165A]/50 border border-[#29305D] rounded-xl p-2.5 text-gray-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Actual Physical Count *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.physicalStock}
                    onChange={(e) => setFormData({ ...formData, physicalStock: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono font-bold focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#17165A]/40 rounded-xl border border-[#29305D] flex justify-between items-center">
                <span className="text-[#A7B1C2]">Calculated Variance:</span>
                <span className={`font-mono font-black text-sm ${Number(formData.physicalStock) - Number(formData.recordedStock) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {Number(formData.physicalStock) - Number(formData.recordedStock) >= 0
                    ? `+${Number(formData.physicalStock) - Number(formData.recordedStock)} Units`
                    : `${Number(formData.physicalStock) - Number(formData.recordedStock)} Units`}
                </span>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Adjustment Reason *</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                >
                  <option value="Damaged in transit / display scratch">Damaged in transit / display scratch</option>
                  <option value="Physical Cycle Count Variance">Physical Cycle Count Variance</option>
                  <option value="Found Unrecorded Stock">Found Unrecorded Stock</option>
                  <option value="Atelier Quality Reject">Atelier Quality Reject</option>
                  <option value="Boutique Display Shrinkage">Boutique Display Shrinkage</option>
                  <option value="Theft or Loss Investigation">Theft or Loss Investigation</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Audit Notes &amp; Justification</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Details of audit inspection and serial numbers..."
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
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPROVAL / REJECT WORKFLOW */}
      {approvalModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Manager Adjustment Review</h3>
              </div>
              <button onClick={() => setApprovalModalItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#17165A]/50 rounded-xl border border-[#29305D] space-y-1.5 text-xs">
              <p className="font-bold text-white">{approvalModalItem.productName}</p>
              <p className="text-[11px] text-[#A7B1C2]">
                Variance: <strong className={approvalModalItem.diff < 0 ? 'text-rose-400' : 'text-emerald-400'}>{approvalModalItem.diff} Units</strong> • Impact: ₹{Math.abs(approvalModalItem.valueImpact).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-gray-300">Reason: {approvalModalItem.reason}</p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-[#A7B1C2] font-semibold">Manager Review Notes</label>
              <textarea
                rows={2}
                value={managerNote}
                onChange={(e) => setManagerNote(e.target.value)}
                placeholder="Approval rationale or rejection reason..."
                className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
              <button
                type="button"
                onClick={() => handleApprovalAction('Rejected')}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/50 font-bold text-xs transition-all cursor-pointer"
              >
                Reject Adjustment
              </button>
              <button
                type="button"
                onClick={() => handleApprovalAction('Approved')}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Approve &amp; Reconcile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
