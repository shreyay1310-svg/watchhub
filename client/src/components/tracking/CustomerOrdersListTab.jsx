import React from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  Search,
  Calendar,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Download,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function CustomerOrdersListTab({
  orders = [],
  filteredOrders = [],
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  timeframeFilter,
  setTimeframeFilter,
  formatPrice,
  handleViewOrderDetails,
  handleTrackOrder,
  handleDownloadInvoice,
  setShowSupportModal,
  setShowReturnModal,
  copiedAwb,
  setCopiedAwb,
}) {
  if (activeView !== 'orders') return null;

  return (
          <div className="space-y-6 animate-fade-in">
            {/* Top Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* Total Orders */}
              <div
                onClick={() => setStatusFilter('All Orders')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${statusFilter === 'All Orders'
                  ? 'bg-[#11172C] border-[#00D5FF]'
                  : 'bg-[#11172C]/70 border-[#28334B] hover:border-[#6500FF]/50'
                  }`}
              >
                <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
                  <span className="text-xs font-semibold group-hover:text-white">Total Orders</span>
                  <Package className="w-4 h-4 text-[#00D5FF]" />
                </div>
                <p className="text-2xl font-black text-white">{summaryMetrics.total}</p>
                <p className="text-[10px] text-[#A7B1C2] mt-0.5">All timepieces</p>
              </div>

              {/* Processing */}
              <div
                onClick={() => setStatusFilter('Processing')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${statusFilter === 'Processing'
                  ? 'bg-[#11172C] border-[#E9B94F]'
                  : 'bg-[#11172C]/70 border-[#28334B] hover:border-[#E9B94F]/50'
                  }`}
              >
                <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
                  <span className="text-xs font-semibold group-hover:text-white">Processing</span>
                  <Clock className="w-4 h-4 text-[#E9B94F]" />
                </div>
                <p className="text-2xl font-black text-[#E9B94F]">{summaryMetrics.processing}</p>
                <p className="text-[10px] text-[#A7B1C2] mt-0.5">In vault inspection</p>
              </div>

              {/* Shipped */}
              <div
                onClick={() => setStatusFilter('Shipped')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${statusFilter === 'Shipped'
                  ? 'bg-[#11172C] border-[#00D5FF]'
                  : 'bg-[#11172C]/70 border-[#28334B] hover:border-[#00D5FF]/50'
                  }`}
              >
                <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
                  <span className="text-xs font-semibold group-hover:text-white">Shipped</span>
                  <Truck className="w-4 h-4 text-[#00D5FF]" />
                </div>
                <p className="text-2xl font-black text-[#00D5FF]">{summaryMetrics.shipped}</p>
                <p className="text-[10px] text-[#A7B1C2] mt-0.5">In secure transit</p>
              </div>

              {/* Delivered */}
              <div
                onClick={() => setStatusFilter('Delivered')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${statusFilter === 'Delivered'
                  ? 'bg-[#11172C] border-[#00C98B]'
                  : 'bg-[#11172C]/70 border-[#28334B] hover:border-[#00C98B]/50'
                  }`}
              >
                <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
                  <span className="text-xs font-semibold group-hover:text-white">Delivered</span>
                  <CheckCircle2 className="w-4 h-4 text-[#00C98B]" />
                </div>
                <p className="text-2xl font-black text-[#00C98B]">{summaryMetrics.delivered}</p>
                <p className="text-[10px] text-[#A7B1C2] mt-0.5">Doorstep received</p>
              </div>

              {/* Returns / Refunds */}
              <div
                onClick={() => setStatusFilter('Returned')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${statusFilter === 'Returned'
                  ? 'bg-[#11172C] border-[#FFB020]'
                  : 'bg-[#11172C]/70 border-[#28334B] hover:border-[#FFB020]/50'
                  }`}
              >
                <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
                  <span className="text-xs font-semibold group-hover:text-white">Returns &amp; Refunds</span>
                  <RotateCcw className="w-4 h-4 text-[#FFB020]" />
                </div>
                <p className="text-2xl font-black text-[#FFB020]">{summaryMetrics.returns}</p>
                <p className="text-[10px] text-[#A7B1C2] mt-0.5">Replaced or credited</p>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="bg-[#11172C] border border-[#28334B] rounded-2xl p-4 space-y-4 shadow-xl">
              {/* Order Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {[
                  'All Orders',
                  'Processing',
                  'Confirmed',
                  'Packed',
                  'Shipped',
                  'Out for Delivery',
                  'Delivered',
                  'Cancelled',
                  'Returned',
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${statusFilter === tab
                      ? 'bg-[#6500FF] text-white shadow-md shadow-[#6500FF]/40 border border-[#8B00FF]'
                      : 'bg-[#081529] text-[#A7B1C2] hover:text-white hover:bg-white/5 border border-[#28334B]'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search, Date Filter & Sorting */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-[#28334B]">
                {/* Search by Order ID or Product Name */}
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Order ID (e.g. WH2026001), Product name, Brand, AWB..."
                    className="w-full pl-10 pr-4 py-2 bg-[#081529] border border-[#28334B] rounded-xl text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#00D5FF]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C2] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter by Date */}
                <div className="md:col-span-3">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-[#081529] border border-[#28334B] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#00D5FF]"
                  >
                    <option value="All Time">All Time Purchases</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Year 2026">Year 2026 Orders</option>
                  </select>
                </div>

                {/* Sort by */}
                <div className="md:col-span-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-[#081529] border border-[#28334B] rounded-xl text-xs text-white focus:outline-hidden focus:border-[#00D5FF]"
                  >
                    <option value="Newest">Sort: Newest Orders First</option>
                    <option value="Oldest">Sort: Oldest Orders First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. ORDER CARDS / ORDER LIST */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-[#11172C] border border-[#28334B] rounded-2xl p-12 text-center text-[#A7B1C2] space-y-3 shadow-xl">
                  <Box className="w-12 h-12 text-[#6500FF]/50 mx-auto" />
                  <h3 className="text-base font-bold text-white">No Matching Timepieces Found</h3>
                  <p className="text-xs max-w-md mx-auto">
                    No orders match your current filter selection. Try clearing search keywords or resetting status filters.
                  </p>
                  <button
                    onClick={() => {
                      setStatusFilter('All Orders');
                      setSearchQuery('');
                      setDateFilter('All Time');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#6500FF]/20 text-[#00D5FF] border border-[#6500FF]/40 text-xs font-bold hover:bg-[#6500FF]/30 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isDelivered = order.status === 'Delivered';
                  const isOutForDelivery = order.status === 'Out for Delivery';
                  const isShipped = order.status === 'Shipped' || order.status === 'In Transit';
                  const isCancelled = order.status === 'Cancelled';
                  const isReturned = order.status === 'Returned';

                  return (
                    <div
                      key={order.orderId}
                      className="bg-[#11172C] border border-[#28334B] hover:border-[#6500FF]/50 transition-all rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 group"
                    >
                      {/* Top Order Metadata Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#28334B]">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono font-bold text-sm text-white">
                            Order #{order.orderId}
                          </span>
                          <span className="text-[#A7B1C2] text-xs">•</span>
                          <span className="text-xs text-[#A7B1C2] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#E9B94F]" />
                            {order.orderDate}
                          </span>
                          <span className="text-[#A7B1C2] text-xs">•</span>
                          <span className="text-xs text-[#A7B1C2]">
                            AWB:{' '}
                            <button
                              onClick={() => handleCopyAwb(order.awbNumber)}
                              className="font-mono text-[#00D5FF] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                              title="Click to copy AWB"
                            >
                              {order.awbNumber}
                              <Copy className="w-3 h-3" />
                            </button>
                          </span>
                        </div>

                        {/* Shipment Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${isDelivered
                              ? 'bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/40'
                              : isOutForDelivery
                                ? 'bg-[#00D5FF]/20 text-[#00D5FF] border border-[#00D5FF]/40 animate-pulse'
                                : isShipped
                                  ? 'bg-[#6500FF]/20 text-[#00D5FF] border border-[#6500FF]/40'
                                  : isCancelled
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : isReturned
                                      ? 'bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40'
                                      : 'bg-[#E9B94F]/20 text-[#E9B94F] border border-[#E9B94F]/40'
                              }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Main Product Card Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        {/* Large Watch Product Image */}
                        <div className="lg:col-span-3 flex justify-center">
                          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-[#081529] border border-[#28334B] p-2 flex items-center justify-center overflow-hidden group-hover:border-[#00D5FF]/40 transition-colors shadow-inner">
                            <img
                              src={order.product.image}
                              alt={order.product.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/products/watch_placeholder.png';
                              }}
                              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-[9px] font-bold text-[#E9B94F] uppercase tracking-wider backdrop-blur-xs">
                              {order.product.brand}
                            </div>
                          </div>
                        </div>

                        {/* Watch Details */}
                        <div className="lg:col-span-5 space-y-2 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#E9B94F]">
                              {order.product.brand}
                            </span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-xs text-[#A7B1C2]">{order.product.category}</span>
                          </div>

                          <h3
                            onClick={() => handleOpenDetail(order.orderId)}
                            className="font-serif font-black text-lg sm:text-xl text-white hover:text-[#00D5FF] transition-colors cursor-pointer"
                          >
                            {order.product.name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-[#A7B1C2]">
                            <span>
                              Model: <strong className="text-white font-mono">{order.product.modelNumber}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              SKU: <strong className="text-[#00D5FF] font-mono">{order.product.sku}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Qty: <strong className="text-white">{order.product.quantity}</strong>
                            </span>
                          </div>

                          <p className="text-xs text-gray-300 line-clamp-1 flex items-center gap-1.5 pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#00C98B] shrink-0" />
                            {order.product.warranty}
                          </p>

                          <div className="pt-2 flex items-center gap-3">
                            <span className="text-xl font-mono font-black text-[#E9B94F]">
                              ₹{Number(order.product.grandTotal).toLocaleString('en-IN')}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {order.payment.status} via {order.payment.method}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Destination & ETA Preview */}
                        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#081529]/80 border border-[#28334B] space-y-2 text-xs">
                          <div className="flex items-start gap-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-[#E9B94F] shrink-0 mt-0.5" />
                            <div className="line-clamp-2">
                              <span className="font-semibold text-white">Delivery Address: </span>
                              {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-300">
                            <Truck className="w-4 h-4 text-[#00D5FF] shrink-0" />
                            <div>
                              <span className="font-semibold text-white">Courier: </span>
                              {order.shipment.courierPartner}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <span className="font-semibold text-white">
                                {isDelivered ? 'Delivered On: ' : 'Expected Delivery: '}
                              </span>
                              <span className="text-[#00D5FF] font-semibold">
                                {isDelivered ? `${order.shipment.deliveredDate} (${order.shipment.deliveredTime})` : order.shipment.expectedDeliveryDate}
                              </span>
                            </div>
                          </div>

                          {order.shipment.eta && !isDelivered && (
                            <p className="text-[11px] text-[#E9B94F] font-mono font-bold bg-[#E9B94F]/10 px-2.5 py-1 rounded-lg border border-[#E9B94F]/20">
                              ⚡ {order.shipment.eta}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="pt-3 border-t border-[#28334B] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleOpenDetail(order.orderId)}
                            className="px-4 py-2 rounded-xl bg-[#6500FF]/20 hover:bg-[#6500FF]/40 text-[#00D5FF] hover:text-white border border-[#6500FF]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Order Details</span>
                          </button>

                          <button
                            onClick={() => handleOpenTracking(order.orderId)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7410FF] hover:to-[#9B10FF] text-white text-xs font-bold shadow-md shadow-[#6500FF]/30 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Order</span>
                          </button>

                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="px-3.5 py-2 rounded-xl bg-[#081529] hover:bg-white/10 text-[#A7B1C2] hover:text-white border border-[#28334B] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                            title="Download Certified Tax Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Invoice</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.orderId);
                              setShowSupportModal(true);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-[#081529] hover:bg-white/10 text-[#A7B1C2] hover:text-white border border-[#28334B] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-[#E9B94F]" />
                            <span>Contact Support</span>
                          </button>

                          {/* Return / Replace Button (Eligible for Delivered orders) */}
                          {isDelivered && (
                            <button
                              onClick={() => {
                                setSelectedOrderId(order.orderId);
                                setShowReturnModal(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#FFB020]/15 hover:bg-[#FFB020]/25 text-[#FFB020] border border-[#FFB020]/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Return / Replace</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
  );
}
