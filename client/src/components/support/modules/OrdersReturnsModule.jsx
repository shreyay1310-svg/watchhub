import React, { useState } from 'react';
import {
  Search,
  Package,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  AlertTriangle,
  Clock,
  Filter,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';

export const OrdersReturnsModule = ({
  ordersReturns = [],
  setOrdersReturns,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size / fitment adjustment required');

  const filteredOrders = ordersReturns.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      order.orderId?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.watchModel?.toLowerCase().includes(q) ||
      order.trackingNumber?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'All' ||
      order.returnStatus?.toLowerCase() === statusFilter.toLowerCase() ||
      order.shippingStatus?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleApproveReturn = (orderId) => {
    const updated = ordersReturns.map((o) =>
      o.orderId === orderId ? { ...o, returnStatus: 'Approved' } : o
    );
    setOrdersReturns(updated);
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, returnStatus: 'Approved' });
    }
  };

  const handleRejectReturn = (orderId) => {
    const updated = ordersReturns.map((o) =>
      o.orderId === orderId ? { ...o, returnStatus: 'Rejected' } : o
    );
    setOrdersReturns(updated);
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, returnStatus: 'Rejected' });
    }
  };

  const handleInitiateReturn = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = ordersReturns.map((o) =>
      o.orderId === selectedOrder.orderId
        ? {
            ...o,
            returnStatus: 'Return Requested',
            returnReason: returnReason,
            returnRequestedAt: 'Just now',
          }
        : o
    );
    setOrdersReturns(updated);
    setSelectedOrder({
      ...selectedOrder,
      returnStatus: 'Return Requested',
      returnReason: returnReason,
    });
    setReturnModalOpen(false);
  };

  const getReturnStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'return requested':
      case 'pending':
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
      case 'rejected':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      case 'none':
      case 'not requested':
      default:
        return 'bg-white/5 text-[#64748B] border-[#252D42]';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Orders & Returns Operations
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 font-semibold">
              {filteredOrders.length} Orders
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Lookup customer purchases, manage returns, verify authenticity checks & coordinate reverse pickups
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar border-b border-[#252D42]">
        {[
          'All',
          'Return Requested',
          'Approved',
          'Delivered',
          'In Transit',
          'Rejected',
        ].map((tab) => {
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
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order ID (#WH-ORD-...), customer, timepiece model, or AWB tracking..."
          className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#091426] border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Timepiece</th>
                <th className="py-3.5 px-4 font-semibold">Value</th>
                <th className="py-3.5 px-4 font-semibold">Delivery Status</th>
                <th className="py-3.5 px-4 font-semibold">Return Status</th>
                <th className="py-3.5 px-4 font-semibold">AWB Tracking</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D42]/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-[#64748B]">
                    No matching orders or return cases found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-[#070918]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00D9E8]">
                      #{order.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white group-hover:text-[#00D9E8] transition-colors">
                        {order.customerName}
                      </p>
                      <p className="text-[10px] text-[#64748B]">{order.customerPhone || order.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-white truncate max-w-[200px]">
                        {order.watchModel}
                      </p>
                      <p className="text-[10px] text-[#A7B1C2]">{order.orderDate}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#E7B43F]">
                      ₹{order.amount?.toLocaleString() || '1,25,000'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
                        <Truck className="w-3 h-3" />
                        {order.shippingStatus || 'Delivered'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getReturnStatusBadge(
                          order.returnStatus
                        )}`}
                      >
                        {order.returnStatus || 'None'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2] font-mono text-[11px]">
                      {order.trackingNumber || 'BD-EXP-7721'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] font-bold text-[11px] transition-colors border border-[#00D9E8]/30"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Order #{selectedOrder.orderId}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getReturnStatusBadge(
                      selectedOrder.returnStatus
                    )}`}
                  >
                    {selectedOrder.returnStatus}
                  </span>
                </h3>
                <p className="text-xs text-[#A7B1C2]">Placed on {selectedOrder.orderDate}</p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#64748B] hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product card */}
            <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#A7B1C2] uppercase font-bold tracking-wider">Item Details</p>
                <p className="text-sm font-bold text-white mt-1">{selectedOrder.watchModel}</p>
                <p className="text-xs text-[#64748B] mt-0.5">Serial: WTH-2026-CH-9921 • Certificate Verified</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#A7B1C2] block">Paid Amount</span>
                <span className="text-lg font-bold text-[#E7B43F]">
                  ₹{selectedOrder.amount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Customer & Shipping information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#111729] border border-[#252D42] space-y-1.5">
                <span className="text-[#64748B] font-bold uppercase text-[10px]">Client Info</span>
                <p className="text-white font-semibold">{selectedOrder.customerName}</p>
                <p className="text-[#A7B1C2]">{selectedOrder.customerEmail}</p>
                <p className="text-[#A7B1C2]">{selectedOrder.customerPhone || '+91 98765 43210'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111729] border border-[#252D42] space-y-1.5">
                <span className="text-[#64748B] font-bold uppercase text-[10px]">Logistics & Tracking</span>
                <p className="text-white font-semibold">Courier: BlueDart Secure Express</p>
                <p className="text-[#00D9E8] font-mono">AWB: {selectedOrder.trackingNumber || 'BD-EXP-7721'}</p>
                <p className="text-[#10B981] font-semibold">{selectedOrder.shippingStatus || 'Delivered'}</p>
              </div>
            </div>

            {/* Return info if applicable */}
            {selectedOrder.returnReason && (
              <div className="p-3.5 rounded-xl bg-[#E7B43F]/10 border border-[#E7B43F]/30 text-xs">
                <p className="font-bold text-[#E7B43F] mb-1">Return Request Information:</p>
                <p className="text-white/90">{selectedOrder.returnReason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-[#252D42] flex flex-wrap items-center justify-between gap-3">
              {selectedOrder.returnStatus === 'Return Requested' ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApproveReturn(selectedOrder.orderId)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#10B981] text-[#070918] font-bold text-xs hover:bg-[#059669] transition-colors"
                  >
                    Approve Return
                  </button>
                  <button
                    onClick={() => handleRejectReturn(selectedOrder.orderId)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/30 font-semibold text-xs transition-colors"
                  >
                    Reject Return
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReturnModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#E7B43F]/15 hover:bg-[#E7B43F]/25 text-[#E7B43F] border border-[#E7B43F]/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Initiate Reverse Return</span>
                </button>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Initiate Return Modal */}
      {returnModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <h3 className="text-base font-bold text-white">Initiate Reverse Return</h3>
              <button onClick={() => setReturnModalOpen(false)} className="text-[#64748B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateReturn} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Reason for Return *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                >
                  <option value="Size / fitment adjustment required">Size / fitment adjustment required</option>
                  <option value="Packaging damage in transit">Packaging damage in transit</option>
                  <option value="Defect or mechanical inconsistency">Defect or mechanical inconsistency</option>
                  <option value="Customer changed mind (Within 7 days)">Customer changed mind (Within 7 days)</option>
                  <option value="Incorrect model sent">Incorrect model sent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Security Seal & Authenticity Verification
                </label>
                <div className="p-3 rounded-xl bg-[#111729] border border-[#252D42] text-xs text-[#A7B1C2]">
                  Ensure customer has confirmed WatchHub tamper-evident security seal on lugs is intact.
                </div>
              </div>

              <div className="pt-3 border-t border-[#252D42] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918]"
                >
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersReturnsModule;
