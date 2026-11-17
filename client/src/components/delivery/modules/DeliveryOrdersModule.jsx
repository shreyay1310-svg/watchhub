import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  MapPin,
  UserCheck,
  CheckCircle,
  Truck,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  X,
  FileText,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Package,
} from 'lucide-react';

export const DeliveryOrdersModule = ({
  orders,
  riders,
  couriers,
  onOpenCreateShipment,
  onSelectOrderForTracking,
  onSelectOrderForDetail,
  onUpdateOrderStatus,
  onAssignOrder,
}) => {
  // Filter states
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedPartner, setSelectedPartner] = useState('All');
  const [selectedRider, setSelectedRider] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');

  // Modals for update status and shipping label
  const [orderForStatusUpdate, setOrderForStatusUpdate] = useState(null);
  const [newStatusValue, setNewStatusValue] = useState('In Transit');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  const [shippingLabelOrder, setShippingLabelOrder] = useState(null);

  // Status Counts for KPI cards
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.deliveryStatus === 'Pending').length,
      processing: orders.filter((o) => o.deliveryStatus === 'Processing').length,
      dispatched: orders.filter((o) => o.deliveryStatus === 'Dispatched').length,
      inTransit: orders.filter((o) => o.deliveryStatus === 'In Transit').length,
      delivered: orders.filter((o) => o.deliveryStatus === 'Delivered').length,
      failed: orders.filter((o) => o.deliveryStatus === 'Failed').length,
      cancelled: orders.filter((o) => o.deliveryStatus === 'Cancelled').length,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (selectedStatusTab !== 'All') {
        if (selectedStatusTab === 'Out for Delivery') {
          if (order.deliveryStatus !== 'Out for Delivery') return false;
        } else if (order.deliveryStatus !== selectedStatusTab) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== 'All' && order.city !== selectedCity) return false;

      // Partner filter
      if (selectedPartner !== 'All' && !order.deliveryPartner.toLowerCase().includes(selectedPartner.toLowerCase())) {
        return false;
      }

      // Rider filter
      if (selectedRider !== 'All' && order.riderId !== selectedRider) return false;

      // Payment filter
      if (selectedPayment !== 'All') {
        if (selectedPayment === 'COD' && !order.paymentType.includes('Cash on Delivery')) return false;
        if (selectedPayment === 'Prepaid' && !order.paymentType.includes('Prepaid')) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          order.orderId.toLowerCase().includes(q) ||
          order.awbNumber.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.mobileNumber.toLowerCase().includes(q) ||
          order.productName.toLowerCase().includes(q) ||
          order.city.toLowerCase().includes(q) ||
          order.rider.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [orders, selectedStatusTab, selectedCity, selectedPartner, selectedRider, selectedPayment, searchQuery]);

  // Unique lists for dropdowns
  const cities = Array.from(new Set(orders.map((o) => o.city))).filter(Boolean);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'AWB Number',
      'Customer Name',
      'Mobile',
      'Product',
      'Address',
      'City',
      'Partner',
      'Rider',
      'Payment',
      'Amount',
      'Status',
      'Expected Delivery',
    ];
    const rows = filteredOrders.map((o) => [
      o.orderId,
      o.awbNumber,
      `"${o.customerName}"`,
      `"${o.mobileNumber}"`,
      `"${o.productName}"`,
      `"${o.deliveryAddress}"`,
      o.city,
      `"${o.deliveryPartner}"`,
      `"${o.rider}"`,
      `"${o.paymentType}"`,
      o.orderAmount,
      o.deliveryStatus,
      `"${o.expectedDeliveryDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WatchHub_Deliveries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Delivery Orders
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Monitor, assign, dispatch and track all outbound luxury watch shipments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#28334B] text-xs font-semibold text-[#A7B1C2] hover:text-white transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenCreateShipment}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer border border-[#8B00FF]/50"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {/* 2. EIGHT TOP KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { key: 'All', label: 'All Orders', count: counts.all, color: '#FFFFFF', border: '#28334B' },
          { key: 'Pending', label: 'Pending', count: counts.pending, color: '#FFB020', border: '#FFB020' },
          { key: 'Processing', label: 'Processing', count: counts.processing, color: '#6500FF', border: '#6500FF' },
          { key: 'Dispatched', label: 'Dispatched', count: counts.dispatched, color: '#8B00FF', border: '#8B00FF' },
          { key: 'In Transit', label: 'In Transit', count: counts.inTransit, color: '#00D5FF', border: '#00D5FF' },
          { key: 'Delivered', label: 'Delivered', count: counts.delivered, color: '#00C98B', border: '#00C98B' },
          { key: 'Failed', label: 'Failed', count: counts.failed, color: '#FF4966', border: '#FF4966' },
          { key: 'Cancelled', label: 'Cancelled', count: counts.cancelled, color: '#A7B1C2', border: '#28334B' },
        ].map((card) => {
          const isSelected = selectedStatusTab === card.key;
          return (
            <div
              key={card.key}
              onClick={() => setSelectedStatusTab(card.key)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-[#11172C] shadow-lg shadow-[#6500FF]/20 border-[#6500FF] ring-1 ring-[#6500FF]'
                  : 'bg-[#11172C]/70 hover:bg-[#11172C] border-[#28334B]'
              }`}
            >
              <span className="text-[10px] font-semibold text-[#A7B1C2] truncate block">
                {card.label}
              </span>
              <span
                className="text-lg font-bold block mt-0.5"
                style={{ color: card.color }}
              >
                {card.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. MULTI-LEVEL FILTERS ROW */}
      <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, AWB, Customer, Watch..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white placeholder-[#A7B1C2]/60 focus:outline-none focus:border-[#6500FF]"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
            >
              <option value="All">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Delivery Partner Filter */}
          <div>
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
            >
              <option value="All">All Courier Partners</option>
              {couriers.map((cp) => (
                <option key={cp.id} value={cp.name}>{cp.name}</option>
              ))}
            </select>
          </div>

          {/* Rider Filter */}
          <div>
            <select
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
            >
              <option value="All">All Assigned Riders</option>
              {riders.map((r) => (
                <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
              ))}
            </select>
          </div>

          {/* Payment Type Filter */}
          <div>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
            >
              <option value="All">All Payment Types</option>
              <option value="Prepaid">Prepaid (Cards/UPI)</option>
              <option value="COD">Cash on Delivery (COD)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {(selectedStatusTab !== 'All' || selectedCity !== 'All' || selectedPartner !== 'All' || selectedRider !== 'All' || selectedPayment !== 'All' || searchQuery) && (
          <div className="flex items-center justify-between pt-2 border-t border-[#28334B] text-xs">
            <span className="text-[#A7B1C2]">
              Showing <span className="font-bold text-white">{filteredOrders.length}</span> of {orders.length} orders
            </span>
            <button
              onClick={() => {
                setSelectedStatusTab('All');
                setSelectedCity('All');
                setSelectedPartner('All');
                setSelectedRider('All');
                setSelectedPayment('All');
                setSearchQuery('');
              }}
              className="text-[#00D5FF] hover:underline font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. COMPREHENSIVE ORDER TABLE (16 COLUMNS) */}
      <div className="rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#081529] border-b border-[#28334B] text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 pl-4 pr-2">Order ID</th>
                <th className="py-3.5 px-3">AWB / Tracking</th>
                <th className="py-3.5 px-3">Order Date</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Mobile</th>
                <th className="py-3.5 px-3">Product Image</th>
                <th className="py-3.5 px-3">Product Name</th>
                <th className="py-3.5 px-3">Address & City</th>
                <th className="py-3.5 px-3">Partner</th>
                <th className="py-3.5 px-3">Rider</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Amount</th>
                <th className="py-3.5 px-3">Delivery Status</th>
                <th className="py-3.5 px-3">Expected Date</th>
                <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28334B] text-[#FFFFFF]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="15" className="py-12 text-center text-[#A7B1C2]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Truck className="w-8 h-8 text-[#28334B]" />
                      <p className="font-semibold text-sm">No delivery orders match your filters</p>
                      <p className="text-xs text-[#A7B1C2]">Try clearing filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => onSelectOrderForDetail(order)}
                  >
                    {/* 1. Order ID */}
                    <td className="py-3 pl-4 pr-2 font-bold text-white whitespace-nowrap">
                      {order.orderId}
                    </td>

                    {/* 2. AWB Number */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#00D5FF] whitespace-nowrap">
                      {order.awbNumber}
                    </td>

                    {/* 3. Order Date */}
                    <td className="py-3 px-3 text-[#A7B1C2] whitespace-nowrap text-[11px]">
                      {order.orderDate}
                    </td>

                    {/* 4. Customer Name */}
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {order.customerName}
                    </td>

                    {/* 5. Mobile */}
                    <td className="py-3 px-3 text-[#A7B1C2] whitespace-nowrap">
                      {order.mobileNumber}
                    </td>

                    {/* 6. Product Image */}
                    <td className="py-3 px-3">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-10 h-10 rounded-lg object-contain bg-[#081529] border border-[#28334B] p-0.5"
                      />
                    </td>

                    {/* 7. Product Name */}
                    <td className="py-3 px-3 max-w-[170px] truncate font-medium text-white" title={order.productName}>
                      {order.productName}
                    </td>

                    {/* 8. Delivery Address & City */}
                    <td className="py-3 px-3 max-w-[180px]">
                      <span className="font-semibold text-white block">{order.city}</span>
                      <span className="text-[11px] text-[#A7B1C2] truncate block" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </span>
                    </td>

                    {/* 9. Delivery Partner */}
                    <td className="py-3 px-3 text-white whitespace-nowrap font-medium">
                      {order.deliveryPartner}
                    </td>

                    {/* 10. Rider */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`font-bold block ${order.rider === 'Unassigned' ? 'text-[#FFB020]' : 'text-[#E9B94F]'}`}>
                        {order.rider}
                      </span>
                    </td>

                    {/* 11. Payment Type */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#A7B1C2]">
                      {order.paymentType}
                    </td>

                    {/* 12. Amount */}
                    <td className="py-3 px-3 whitespace-nowrap font-bold text-white">
                      {order.formattedAmount}
                    </td>

                    {/* 13. Delivery Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                          order.deliveryStatus === 'Delivered'
                            ? 'bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/40'
                            : order.deliveryStatus === 'Out for Delivery'
                            ? 'bg-[#00D5FF]/20 text-[#00D5FF] border border-[#00D5FF]/40'
                            : order.deliveryStatus === 'In Transit'
                            ? 'bg-[#6500FF]/20 text-[#6500FF] border border-[#6500FF]/40'
                            : order.deliveryStatus === 'Failed'
                            ? 'bg-[#FF4966]/20 text-[#FF4966] border border-[#FF4966]/40'
                            : order.deliveryStatus === 'Cancelled'
                            ? 'bg-[#A7B1C2]/20 text-[#A7B1C2] border border-[#28334B]'
                            : 'bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {order.deliveryStatus}
                      </span>
                    </td>

                    {/* 14. Expected Delivery Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#A7B1C2]">
                      {order.expectedDeliveryDate}
                    </td>

                    {/* 15. Actions */}
                    <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => onSelectOrderForDetail(order)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#28334B] transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Track Live */}
                        <button
                          onClick={() => onSelectOrderForTracking(order)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00D5FF] border border-[#28334B] transition-colors"
                          title="Track Live Shipment"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>

                        {/* Update Status */}
                        <button
                          onClick={() => {
                            setOrderForStatusUpdate(order);
                            setNewStatusValue(order.deliveryStatus);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#E9B94F] border border-[#28334B] transition-colors"
                          title="Update Delivery Status"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Print Shipping Label */}
                        <button
                          onClick={() => setShippingLabelOrder(order)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00C98B] border border-[#28334B] transition-colors"
                          title="Print Shipping Label"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL: UPDATE DELIVERY STATUS */}
      {orderForStatusUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#28334B]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Update Delivery Status
                  </h3>
                  <p className="text-[11px] text-[#A7B1C2]">
                    Order #{orderForStatusUpdate.orderId} • {orderForStatusUpdate.awbNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrderForStatusUpdate(null)}
                className="text-[#A7B1C2] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                  Select New Milestone Status
                </label>
                <select
                  value={newStatusValue}
                  onChange={(e) => setNewStatusValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered (Handover Verified)</option>
                  <option value="Failed">Failed Attempt</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                  Checkpoint Notes / Reason
                </label>
                <textarea
                  rows="3"
                  value={statusUpdateNote}
                  onChange={(e) => setStatusUpdateNote(e.target.value)}
                  placeholder="e.g. Scanned into destination hub, rider dispatched on DLF route..."
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white placeholder-[#A7B1C2]/60 focus:outline-none focus:border-[#6500FF]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Customer:</span>
                  <span className="text-white font-medium">{orderForStatusUpdate.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Assigned Rider:</span>
                  <span className="text-[#E9B94F] font-bold">{orderForStatusUpdate.rider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Current Status:</span>
                  <span className="text-[#00D5FF] font-bold">{orderForStatusUpdate.deliveryStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
              <button
                onClick={() => setOrderForStatusUpdate(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A7B1C2] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateOrderStatus(orderForStatusUpdate.orderId, newStatusValue, statusUpdateNote);
                  setOrderForStatusUpdate(null);
                  setStatusUpdateNote('');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs shadow-md shadow-[#6500FF]/30 cursor-pointer"
              >
                Save & Update Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: PRINT SHIPPING LABEL */}
      {shippingLabelOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-black rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShippingLabelOrder(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Air Waybill Label Design */}
            <div className="border-2 border-black p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div>
                  <h2 className="text-xl font-bold font-serif tracking-tight">WATCHHUB</h2>
                  <p className="text-[10px] uppercase font-bold text-gray-600">Luxury Horology Express Air Cargo</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 border border-black rounded">
                    PRIORITY INSURED
                  </span>
                  <p className="text-[10px] text-gray-600 mt-1">Air Waybill: {shippingLabelOrder.awbNumber}</p>
                </div>
              </div>

              {/* Barcode visual */}
              <div className="text-center py-2 border-b-2 border-black">
                <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_8px,transparent_8px,transparent_10px)]" />
                <p className="font-mono text-sm font-bold tracking-widest mt-1">
                  *{shippingLabelOrder.awbNumber}*
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-b-2 border-black pb-3">
                <div>
                  <span className="font-bold uppercase text-[10px] text-gray-500 block">SHIP TO:</span>
                  <p className="font-bold text-sm text-black">{shippingLabelOrder.customerName}</p>
                  <p className="text-gray-700 leading-tight">{shippingLabelOrder.deliveryAddress}</p>
                  <p className="font-bold mt-1">{shippingLabelOrder.city}, {shippingLabelOrder.state} - {shippingLabelOrder.pincode}</p>
                  <p className="text-gray-700">Phone: {shippingLabelOrder.mobileNumber}</p>
                </div>

                <div>
                  <span className="font-bold uppercase text-[10px] text-gray-500 block">SHIPPER:</span>
                  <p className="font-bold text-black">WatchHub Central Vault WH-01</p>
                  <p className="text-gray-700 leading-tight">Barakhamba Road, Connaught Place</p>
                  <p className="font-bold mt-1">New Delhi, Delhi - 110001</p>
                  <p className="text-gray-700">GST: 07AABCW1928K1Z3</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <p><span className="font-bold">Item:</span> {shippingLabelOrder.productName}</p>
                  <p><span className="font-bold">Declared Value:</span> {shippingLabelOrder.formattedAmount} (Full Transit Cover)</p>
                </div>
                <div className="text-right">
                  <p><span className="font-bold">Courier:</span> {shippingLabelOrder.deliveryPartner}</p>
                  <p><span className="font-bold">OTP Required:</span> YES</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setShippingLabelOrder(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Shipping Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOrdersModule;
