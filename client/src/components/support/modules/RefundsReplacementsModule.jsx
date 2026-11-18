import React, { useState } from 'react';
import {
  CreditCard,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  X,
  FileCheck,
  ArrowUpRight,
} from 'lucide-react';

export const RefundsReplacementsModule = ({
  refunds = [],
  setRefunds,
  onOpenCreateTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [actionModal, setActionModal] = useState({ type: null, refund: null }); // 'approve' | 'reject' | 'replacement'
  const [rejectReason, setRejectReason] = useState('Tamper seal broken or product worn');

  const filteredRefunds = refunds.filter((ref) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      ref.id?.toLowerCase().includes(q) ||
      ref.orderId?.toLowerCase().includes(q) ||
      ref.customerName?.toLowerCase().includes(q) ||
      ref.watchModel?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'All' || ref.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleConfirmApprove = () => {
    if (!actionModal.refund) return;
    const updated = refunds.map((r) =>
      r.id === actionModal.refund.id
        ? {
            ...r,
            status: 'Approved',
            gatewayRef: `rzp_rfnd_${Math.floor(100000 + Math.random() * 900000)}`,
            processedAt: 'Just now',
          }
        : r
    );
    setRefunds(updated);
    setActionModal({ type: null, refund: null });
  };

  const handleConfirmReject = () => {
    if (!actionModal.refund) return;
    const updated = refunds.map((r) =>
      r.id === actionModal.refund.id
        ? { ...r, status: 'Rejected', rejectionReason: rejectReason }
        : r
    );
    setRefunds(updated);
    setActionModal({ type: null, refund: null });
  };

  const handleConfirmReplacement = () => {
    if (!actionModal.refund) return;
    const updated = refunds.map((r) =>
      r.id === actionModal.refund.id
        ? {
            ...r,
            type: 'Replacement',
            status: 'Replacement Dispatched',
            newOrderId: `WH-ORD-${Math.floor(9100 + Math.random() * 800)}`,
          }
        : r
    );
    setRefunds(updated);
    setActionModal({ type: null, refund: null });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'processed':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'pending approval':
      case 'pending':
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
      case 'rejected':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      case 'replacement dispatched':
        return 'bg-[#00D9E8]/15 text-[#00D9E8] border-[#00D9E8]/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Refunds & Timepiece Replacements
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 font-semibold">
              {filteredRefunds.length} Cases
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Process luxury order refunds via Razorpay Gateway, manage return audits & issue direct replacements
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Total Refunds Processed</span>
            <span className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">₹34,85,000</p>
          <p className="text-xs text-[#64748B] mt-1.5">24 orders this month</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Pending Authorizations</span>
            <span className="p-1.5 rounded-lg bg-[#E7B43F]/10 text-[#E7B43F]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#E7B43F] mt-1">₹4,25,000</p>
          <p className="text-xs text-[#E7B43F] mt-1.5 font-semibold">3 cases pending review</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Replacements Dispatched</span>
            <span className="p-1.5 rounded-lg bg-[#00D9E8]/10 text-[#00D9E8]">
              <RefreshCw className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#00D9E8] mt-1">12 Watches</p>
          <p className="text-xs text-[#64748B] mt-1.5">Zero defect exchange</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Razorpay Gateway SLA</span>
            <span className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">2.4 Hours</p>
          <p className="text-xs text-[#10B981] mt-1.5 font-semibold">Direct bank reversal</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar border-b border-[#252D42]">
        {['All', 'Pending Approval', 'Approved', 'Processed', 'Rejected', 'Replacement'].map(
          (tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-[#00D9E8] text-[#00D9E8] bg-[#111729]'
                    : 'border-transparent text-[#A7B1C2] hover:text-white hover:bg-[#111729]/50'
                }`}
              >
                {tab}
              </button>
            );
          }
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Refund ID, Order ID, customer name, timepiece model..."
          className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
        />
      </div>

      {/* Refunds Table */}
      <div className="rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#091426] border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Refund ID</th>
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Timepiece</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Gateway / Method</th>
                <th className="py-3.5 px-4 font-semibold">Reason</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D42]/60">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-[#64748B]">
                    No refunds or replacement records found.
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((ref) => (
                  <tr
                    key={ref.id}
                    onClick={() => setSelectedRefund(ref)}
                    className="hover:bg-[#070918]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00D9E8]">
                      {ref.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white">#{ref.orderId}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white group-hover:text-[#00D9E8] transition-colors">
                        {ref.customerName}
                      </p>
                      <p className="text-[10px] text-[#64748B]">{ref.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium truncate max-w-[160px]">
                      {ref.watchModel}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#E7B43F]">
                      ₹{ref.amount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2]">
                      <span className="font-semibold text-white">Razorpay</span>
                      <span className="text-[10px] text-[#64748B] block">{ref.gatewayRef || 'Pending auth'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2] truncate max-w-[150px]">
                      {ref.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          ref.status
                        )}`}
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ref.status === 'Pending Approval' || ref.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionModal({ type: 'approve', refund: ref });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#070918] font-bold text-[10px] transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionModal({ type: 'reject', refund: ref });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/30 font-semibold text-[10px] transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRefund(ref);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] font-bold text-[10px] border border-[#00D9E8]/30 transition-colors"
                        >
                          View Audit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal with Razorpay Simulation */}
      {actionModal.type === 'approve' && actionModal.refund && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <div className="flex items-center gap-2 text-white font-bold">
                <CreditCard className="w-5 h-5 text-[#00D9E8]" />
                <span>Authorize Razorpay Refund</span>
              </div>
              <button
                onClick={() => setActionModal({ type: null, refund: null })}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#111729] border border-[#252D42] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A7B1C2]">Refund ID:</span>
                <span className="font-mono text-[#00D9E8] font-semibold">{actionModal.refund.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B1C2]">Customer:</span>
                <span className="text-white font-medium">{actionModal.refund.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B1C2]">Watch Model:</span>
                <span className="text-white font-medium">{actionModal.refund.watchModel}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#252D42]">
                <span className="text-white font-bold">Refund Amount:</span>
                <span className="text-base font-bold text-[#E7B43F]">
                  ₹{actionModal.refund.amount?.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#A7B1C2] leading-relaxed">
              Authorizing this refund will automatically dispatch an API reversal command to Razorpay PG and send an SMS/Email receipt to the customer.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setActionModal({ type: null, refund: null })}
                className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#10B981] text-[#070918] hover:bg-[#059669] transition-colors"
              >
                Confirm Razorpay Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {actionModal.type === 'reject' && actionModal.refund && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <div className="flex items-center gap-2 text-[#EF4444] font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>Reject Refund Request</span>
              </div>
              <button
                onClick={() => setActionModal({ type: null, refund: null })}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#A7B1C2] block">
                Select Rejection Reason *
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#EF4444]"
              >
                <option value="Tamper-evident lug security seal broken">Tamper-evident lug security seal broken</option>
                <option value="Timepiece shows micro-scratches or signs of wear">Timepiece shows micro-scratches or wear</option>
                <option value="Warranty card or authenticity documentation missing">Warranty or authenticity card missing</option>
                <option value="Exceeded 7-day return inspection window">Exceeded 7-day return window</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setActionModal({ type: null, refund: null })}
                className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundsReplacementsModule;
