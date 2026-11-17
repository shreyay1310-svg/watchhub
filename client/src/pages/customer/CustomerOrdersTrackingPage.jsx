import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import GoogleMapLiveTracking from '../../components/common/GoogleMapLiveTracking';
import { CUSTOMER_ORDERS_DATA, findCustomerOrder } from '../../data/customerOrdersData';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import {
  Package,
  Truck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Bell,
  X,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Box,
  Layers,
  Sparkles,
  Download,
  Printer,
  RotateCcw,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  HelpCircle,
  FileText,
  User,
  Shield,
  Send,
  Navigation,
} from 'lucide-react';

export default function CustomerOrdersTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrencyLanguage();

  // Read route parameter if accessed via /account/orders/:orderId/track or /orders/:orderId/track
  const { orderId: paramOrderId } = useParams();

  // Active View Tab: 'orders' | 'detail' | 'tracking'
  const initialView = paramOrderId ? 'tracking' : (searchParams.get('tab') || 'orders');
  const initialOrderId = paramOrderId || searchParams.get('id') || searchParams.get('order') || 'WH20261125';

  const [activeView, setActiveView] = useState(initialView);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);

  // Synchronize with URL search params or route params
  useEffect(() => {
    if (paramOrderId) {
      setActiveView('tracking');
      setSelectedOrderId(paramOrderId);
      return;
    }

    const tabParam = searchParams.get('tab');
    const idParam = searchParams.get('id') || searchParams.get('order');
    if (tabParam && ['orders', 'detail', 'tracking'].includes(tabParam)) {
      setActiveView(tabParam);
    }
    if (idParam) {
      setSelectedOrderId(idParam);
    }
  }, [searchParams, paramOrderId]);

  // Master Orders List in local state so customer can perform cancellations / updates
  const [ordersList, setOrdersList] = useState(CUSTOMER_ORDERS_DATA);

  // Selected Order object
  const currentOrder = useMemo(() => {
    return ordersList.find((o) => o.orderId === selectedOrderId) || findCustomerOrder(selectedOrderId);
  }, [ordersList, selectedOrderId]);

  // Filter & Search states for Orders List
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [sortBy, setSortBy] = useState('Newest');

  // Tracking Search Input
  const [trackingSearchInput, setTrackingSearchInput] = useState(selectedOrderId);

  // Copy AWB feedback
  const [isCopied, setIsCopied] = useState(false);

  // Map Zoom & Fullscreen & Engine Mode
  const [mapZoom, setMapZoom] = useState(1);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [mapMode, setMapMode] = useState('google'); // 'google' | 'vector'

  // Modals
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Modal form states
  const [returnReason, setReturnReason] = useState('Size / Wrist Diameter Preference');
  const [returnNotes, setReturnNotes] = useState('Would prefer to exchange for a different dial variant or size.');
  const [newInstructions, setNewInstructions] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Top Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = ordersList.length;
    const processing = ordersList.filter((o) => ['Processing', 'Confirmed', 'Packed'].includes(o.status)).length;
    const shipped = ordersList.filter((o) => ['Shipped', 'In Transit', 'Out for Delivery'].includes(o.status)).length;
    const delivered = ordersList.filter((o) => o.status === 'Delivered').length;
    const returns = ordersList.filter((o) => ['Returned', 'Cancelled'].includes(o.status)).length;
    return { total, processing, shipped, delivered, returns };
  }, [ordersList]);

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return ordersList
      .filter((order) => {
        // Status filter
        if (statusFilter !== 'All Orders') {
          if (statusFilter === 'Shipped') {
            if (!['Shipped', 'In Transit'].includes(order.status)) return false;
          } else if (order.status !== statusFilter) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesId = order.orderId.toLowerCase().includes(q);
          const matchesAwb = order.awbNumber.toLowerCase().includes(q);
          const matchesProduct = order.product.name.toLowerCase().includes(q);
          const matchesBrand = order.product.brand.toLowerCase().includes(q);
          if (!matchesId && !matchesAwb && !matchesProduct && !matchesBrand) return false;
        }
        // Date filter
        if (dateFilter === 'Last 30 Days') {
          if (order.orderDate.includes('Oct')) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Oldest') return a.orderId.localeCompare(b.orderId);
        return b.orderId.localeCompare(a.orderId);
      });
  }, [ordersList, statusFilter, searchQuery, dateFilter, sortBy]);

  // Navigate to Detail View
  const handleOpenDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveView('detail');
    setSearchParams({ tab: 'detail', id: orderId });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Navigate to Tracking View
  const handleOpenTracking = (orderId) => {
    setSelectedOrderId(orderId);
    setTrackingSearchInput(orderId);
    setActiveView('tracking');
    setSearchParams({ tab: 'tracking', id: orderId });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Copy AWB
  const handleCopyAwb = (awb) => {
    navigator.clipboard.writeText(awb);
    setIsCopied(true);
    showToast(`AWB ${awb} copied to clipboard!`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Tracking Search Submit
  const handleTrackingSearchSubmit = (e) => {
    e.preventDefault();
    if (!trackingSearchInput.trim()) return;
    const found = findCustomerOrder(trackingSearchInput);
    setSelectedOrderId(found.orderId);
    showToast(`Synced live telemetry for Order #${found.orderId}`);
  };

  // Handle Order Cancellation
  const handleConfirmCancel = () => {
    setOrdersList((prev) =>
      prev.map((o) =>
        o.orderId === currentOrder.orderId
          ? {
              ...o,
              status: 'Cancelled',
              timeline: [
                ...o.timeline,
                {
                  id: o.timeline.length + 1,
                  title: 'Order Cancelled',
                  time: 'Just now',
                  location: 'Customer Self-Service Portal',
                  description: 'Order cancelled by customer. 100% refund initiated to original payment source.',
                  status: 'completed',
                },
              ],
            }
          : o
      )
    );
    setShowCancelModal(false);
    showToast(`Order #${currentOrder.orderId} cancelled successfully. 100% refund initiated.`);
  };

  // Handle Return Request
  const handleConfirmReturn = () => {
    setOrdersList((prev) =>
      prev.map((o) =>
        o.orderId === currentOrder.orderId
          ? {
              ...o,
              status: 'Returned',
              timeline: [
                ...o.timeline,
                {
                  id: o.timeline.length + 1,
                  title: 'Return & Exchange Requested',
                  time: 'Just now',
                  location: 'Customer Portal',
                  description: `Return initiated for reason: ${returnReason}. White-glove pickup being scheduled.`,
                  status: 'completed',
                },
              ],
            }
          : o
      )
    );
    setShowReturnModal(false);
    showToast(`Complimentary return & exchange registered for Order #${currentOrder.orderId}`);
  };

  // Handle Update Instructions
  const handleSaveInstructions = () => {
    if (!newInstructions.trim()) return;
    setOrdersList((prev) =>
      prev.map((o) =>
        o.orderId === currentOrder.orderId
          ? {
              ...o,
              shipment: { ...o.shipment, deliveryInstructions: newInstructions },
            }
          : o
      )
    );
    setShowInstructionsModal(false);
    showToast('Delivery instructions updated with courier dispatch!');
  };

  // Download Certified PDF / TXT Invoice
  const handleDownloadInvoice = (order) => {
    const target = order || currentOrder;
    const content = `================================================================================
WATCHHUB LUXURY HOROLOGY INTERNATIONAL
CERTIFIED TAX INVOICE & PROVENANCE CERTIFICATE
================================================================================
Invoice No: INV-${target.orderId}
Order ID: ${target.orderId}
AWB / Tracking Number: ${target.awbNumber}
Date: ${target.orderDate}

BILLED & SHIPPED TO:
Customer: ${target.customer.name}
Email: ${target.customer.email}
Phone: ${target.customer.phone}
Address: ${target.deliveryAddress.street}, ${target.deliveryAddress.city}, ${target.deliveryAddress.state} - ${target.deliveryAddress.pincode}, ${target.deliveryAddress.country}

ITEM DETAILS:
--------------------------------------------------------------------------------
1. ${target.product.name}
   Brand: ${target.product.brand} | Model: ${target.product.modelNumber} | SKU: ${target.product.sku}
   Warranty: ${target.product.warranty}
   Qty: ${target.product.quantity}
   Unit Price: ₹${Number(target.product.unitPrice).toLocaleString('en-IN')}
   Discount: -₹${Number(target.product.discount).toLocaleString('en-IN')}
   Shipping (Luxury Armored Air): FREE (₹0)
   GST (18%): ₹${Number(target.product.taxes).toLocaleString('en-IN')}
--------------------------------------------------------------------------------
GRAND TOTAL PAID: ₹${Number(target.product.grandTotal).toLocaleString('en-IN')}
Payment Method: ${target.payment.method}
Payment Status: ${target.payment.status}
Transaction Reference: ${target.payment.transactionId}

LOGISTICS & COURIER PARTNER:
Carrier: ${target.shipment.courierPartner}
Assigned Officer: ${target.shipment.riderName} (${target.shipment.riderPhone})
Status: ${target.status}

GENEVA HOROLOGY COMPLIANCE SEAL:
WatchHub guarantees 100% authenticity, verified escapement rate, and official factory warranty.
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WatchHub_Invoice_${target.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Certified Invoice for #${target.orderId} downloaded.`);
  };

  return (
    <div className="min-h-screen bg-[#070918] text-white flex flex-col font-sans selection:bg-[#6500FF]/40 selection:text-white">
      {/* Top Customer Website Navbar */}
      <CustomerNavbar />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#11172C] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#00D5FF]/50 flex items-center gap-3 animate-fade-in text-xs font-semibold backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-[#00C98B] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* 1. PAGE HEADER */}
        <div className="bg-gradient-to-r from-[#0C1033] via-[#11172C] to-[#0C1033] border border-[#28334B] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#6500FF]/20 via-[#00D5FF]/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6500FF]/20 border border-[#6500FF]/40 text-[#00D5FF] text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E9B94F]" />
                Customer Order Concierge &amp; Live Tracking
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
                My Orders &amp; Tracking
              </h1>
              <p className="text-xs sm:text-sm text-[#A7B1C2] mt-1 max-w-2xl">
                Track your luxury timepieces in real-time, view provenance certificates, manage purchases and stay updated on every delivery milestone.
              </p>
            </div>

            {/* Navigation View Pill Switcher */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#081529] border border-[#28334B] rounded-2xl shrink-0 self-start md:self-auto">
              <button
                onClick={() => {
                  setActiveView('orders');
                  setSearchParams({ tab: 'orders' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'orders'
                    ? 'bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white shadow-lg shadow-[#6500FF]/40'
                    : 'text-[#A7B1C2] hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders ({ordersList.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('tracking');
                  setSearchParams({ tab: 'tracking', id: selectedOrderId });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'tracking'
                    ? 'bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white shadow-lg shadow-[#6500FF]/40'
                    : 'text-[#A7B1C2] hover:text-white hover:bg-white/5'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </button>

              {activeView === 'detail' && (
                <button
                  onClick={() => setActiveView('detail')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white shadow-lg shadow-[#6500FF]/40 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Order Details</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: MY ORDERS MAIN PAGE                                    */}
        {/* ============================================================== */}
        {activeView === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* Total Orders */}
              <div
                onClick={() => setStatusFilter('All Orders')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                  statusFilter === 'All Orders'
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                  statusFilter === 'Processing'
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                  statusFilter === 'Shipped'
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                  statusFilter === 'Delivered'
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg group ${
                  statusFilter === 'Returned'
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === tab
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
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              isDelivered
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
        )}

        {/* ============================================================== */}
        {/* VIEW 2: ORDER DETAILS PAGE                                      */}
        {/* ============================================================== */}
        {activeView === 'detail' && currentOrder && (
          <div className="space-y-6 animate-fade-in">
            {/* Header with Back button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#28334B]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveView('orders');
                    setSearchParams({ tab: 'orders' });
                  }}
                  className="p-2 rounded-xl bg-[#11172C] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white border border-[#28334B] transition-colors cursor-pointer"
                  title="Back to All Orders"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                    Order Details – #{currentOrder.orderId}
                  </h2>
                  <p className="text-xs text-[#A7B1C2] mt-0.5">
                    Placed on {currentOrder.orderDate} • Air Waybill: {currentOrder.awbNumber}
                  </p>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenTracking(currentOrder.orderId)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white text-xs font-bold shadow-md shadow-[#6500FF]/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Shipment</span>
                </button>
                <button
                  onClick={() => handleDownloadInvoice(currentOrder)}
                  className="px-3.5 py-2 rounded-xl bg-[#11172C] text-[#A7B1C2] hover:text-white border border-[#28334B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>

            {/* Two-Column Order Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT SECTION: Product, Customer & Address Information */}
              <div className="lg:col-span-7 space-y-6">
                {/* Product Information Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
                    <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E9B94F]" />
                      Timepiece Information
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#00D5FF]">
                      SKU: {currentOrder.product.sku}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                    <div className="w-36 h-36 rounded-2xl bg-[#081529] border border-[#28334B] p-2 flex items-center justify-center shrink-0">
                      <img
                        src={currentOrder.product.image}
                        alt={currentOrder.product.name}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>

                    <div className="space-y-2 flex-1 text-left">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E9B94F]">
                        {currentOrder.product.brand}
                      </span>
                      <h4 className="font-serif font-bold text-lg text-white">
                        {currentOrder.product.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#A7B1C2]">
                        <p>
                          Model: <strong className="text-white font-mono">{currentOrder.product.modelNumber}</strong>
                        </p>
                        <p>
                          Category: <strong className="text-white">{currentOrder.product.category}</strong>
                        </p>
                        <p>
                          Quantity: <strong className="text-white">{currentOrder.product.quantity} Unit</strong>
                        </p>
                        <p>
                          Unit Price: <strong className="text-[#E9B94F]">₹{Number(currentOrder.product.unitPrice).toLocaleString('en-IN')}</strong>
                        </p>
                      </div>

                      <div className="pt-2 p-3 bg-[#081529] rounded-xl border border-[#28334B] text-xs space-y-1">
                        <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Certified Authenticity &amp; Warranty
                        </span>
                        <p className="text-[#A7B1C2] text-[11px]">
                          {currentOrder.product.warranty}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#28334B] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00D5FF]" />
                    Customer Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-[#081529] rounded-xl border border-[#28334B]">
                      <span className="text-[#A7B1C2] block mb-1">Customer Name</span>
                      <strong className="text-white font-semibold text-sm">{currentOrder.customer.name}</strong>
                    </div>
                    <div className="p-3 bg-[#081529] rounded-xl border border-[#28334B]">
                      <span className="text-[#A7B1C2] block mb-1">Registered Email</span>
                      <strong className="text-white font-mono text-xs truncate block">{currentOrder.customer.email}</strong>
                    </div>
                    <div className="p-3 bg-[#081529] rounded-xl border border-[#28334B]">
                      <span className="text-[#A7B1C2] block mb-1">Mobile Contact</span>
                      <strong className="text-white font-mono text-xs">{currentOrder.customer.phone}</strong>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#28334B] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E9B94F]" />
                    Shipping &amp; Delivery Destination
                  </h3>
                  <div className="p-4 bg-[#081529] rounded-2xl border border-[#28334B] space-y-1.5 text-xs">
                    <p className="font-bold text-white text-sm">{currentOrder.customer.name}</p>
                    <p className="text-gray-300">{currentOrder.deliveryAddress.street}</p>
                    <p className="text-gray-300">
                      {currentOrder.deliveryAddress.city}, {currentOrder.deliveryAddress.state} - {currentOrder.deliveryAddress.pincode}
                    </p>
                    <p className="text-[#E9B94F] font-semibold">{currentOrder.deliveryAddress.country}</p>
                    <div className="pt-2 flex items-center gap-2 text-[11px] text-[#A7B1C2]">
                      <Shield className="w-3.5 h-3.5 text-[#00C98B]" />
                      <span>Tamper-evident luxury dual seal packaging with security escort</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION: Order Financial Summary & Additional Actions */}
              <div className="lg:col-span-5 space-y-6">
                {/* Order Financial Summary Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-5">
                  <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#28334B] flex items-center justify-between">
                    <span>Order Financial Summary</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/40">
                      {currentOrder.payment.status}
                    </span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-[#A7B1C2]">
                      <span>Product Price:</span>
                      <span className="text-white font-mono">₹{Number(currentOrder.product.unitPrice).toLocaleString('en-IN')}</span>
                    </div>

                    {currentOrder.product.discount > 0 && (
                      <div className="flex justify-between text-[#00C98B]">
                        <span>VIP Privilege Discount ({currentOrder.product.promoCode}):</span>
                        <span className="font-mono font-semibold">-₹{Number(currentOrder.product.discount).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#A7B1C2]">
                      <span>Shipping &amp; Insurance:</span>
                      <span className="text-[#00D5FF] font-semibold">FREE (Luxury Armored Air)</span>
                    </div>

                    <div className="flex justify-between text-[#A7B1C2]">
                      <span>Applicable GST (18%):</span>
                      <span className="text-white font-mono">₹{Number(currentOrder.product.taxes).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="pt-3 border-t border-[#28334B] flex justify-between items-center text-sm font-bold">
                      <span className="text-white font-serif">Grand Total:</span>
                      <span className="text-xl font-mono text-[#E9B94F]">
                        ₹{Number(currentOrder.product.grandTotal).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Metadata */}
                  <div className="p-3.5 bg-[#081529] rounded-2xl border border-[#28334B] text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#A7B1C2]">Payment Mode:</span>
                      <span className="text-white font-semibold">{currentOrder.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A7B1C2]">Transaction ID:</span>
                      <span className="text-[#00D5FF] font-mono text-[11px]">{currentOrder.payment.transactionId}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Action Buttons */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-3">
                  <h4 className="text-xs font-bold text-[#A7B1C2] uppercase tracking-wider mb-2">
                    Order Assistance &amp; Actions
                  </h4>

                  <button
                    onClick={() => handleDownloadInvoice(currentOrder)}
                    className="w-full py-2.5 rounded-xl bg-[#081529] hover:bg-[#17165A] text-white border border-[#28334B] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#00D5FF]" />
                    <span>Download Tax Invoice (PDF / TXT)</span>
                  </button>

                  <button
                    onClick={() => handleOpenTracking(currentOrder.orderId)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7410FF] hover:to-[#9B10FF] text-white text-xs font-bold shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Live GPS Shipment</span>
                  </button>

                  <button
                    onClick={() => setShowSupportModal(true)}
                    className="w-full py-2.5 rounded-xl bg-[#081529] hover:bg-[#17165A] text-white border border-[#28334B] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-[#E9B94F]" />
                    <span>Contact Watch Concierge Support</span>
                  </button>

                  {/* Cancellation Button (Only if not yet shipped or delivered) */}
                  {['Processing', 'Confirmed', 'Packed'].includes(currentOrder.status) && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Request Order Cancellation</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: TRACK MY ORDER – DETAILED TRACKING PAGE                */}
        {/* ============================================================== */}
        {activeView === 'tracking' && currentOrder && (
          <div className="space-y-6 animate-fade-in">
            {/* Header with Search Omnibar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#28334B]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveView('orders');
                    setSearchParams({ tab: 'orders' });
                  }}
                  className="p-2 rounded-xl bg-[#11172C] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white border border-[#28334B] transition-colors cursor-pointer"
                  title="Back to All Orders"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                    Track Your Order
                  </h2>
                  <p className="text-xs text-[#A7B1C2] mt-0.5">
                    Real-time GPS telemetry, milestone inspection checkpoints and courier details.
                  </p>
                </div>
              </div>

              {/* Fast Lookup Form */}
              <form onSubmit={handleTrackingSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackingSearchInput}
                    onChange={(e) => setTrackingSearchInput(e.target.value)}
                    placeholder="Enter Order ID or AWB Number..."
                    className="w-full pl-9 pr-3 py-2 bg-[#11172C] border border-[#28334B] rounded-xl text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#00D5FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer shrink-0"
                >
                  Track
                </button>
              </form>
            </div>

            {/* 7. DELIVERY CONFIRMATION BANNER (If order is Delivered) */}
            {currentOrder.status === 'Delivered' && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#11172C] to-emerald-950/60 border border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-black text-white">
                      Your Watch Has Been Delivered!
                    </h3>
                    <p className="text-xs text-emerald-300 mt-0.5">
                      Delivered on <strong className="text-white">{currentOrder.shipment.deliveredDate}</strong> at{' '}
                      <strong className="text-white">{currentOrder.shipment.deliveredTime}</strong>. Handover confirmed via SMS OTP &amp; Recipient Signature.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadInvoice(currentOrder)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. SHIPMENT INFORMATION STRIP */}
            <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-5 sm:p-6 shadow-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              <div>
                <span className="text-[#A7B1C2] block mb-1">Order ID</span>
                <strong className="text-white font-mono text-sm block">#{currentOrder.orderId}</strong>
              </div>

              <div>
                <span className="text-[#A7B1C2] block mb-1">Air Waybill (AWB)</span>
                <div className="flex items-center gap-1 font-mono text-[#00D5FF] font-bold text-sm">
                  <span>{currentOrder.awbNumber}</span>
                  <button
                    onClick={() => handleCopyAwb(currentOrder.awbNumber)}
                    className="text-[#A7B1C2] hover:text-white cursor-pointer"
                    title="Copy AWB"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[#A7B1C2] block mb-1">Courier Partner</span>
                <strong className="text-white flex items-center gap-1 text-xs">
                  <Truck className="w-3.5 h-3.5 text-[#00D5FF]" />
                  {currentOrder.shipment.courierPartner}
                </strong>
              </div>

              <div>
                <span className="text-[#A7B1C2] block mb-1">Shipment Date</span>
                <strong className="text-gray-200">{currentOrder.shipment.shipmentDate}</strong>
              </div>

              <div>
                <span className="text-[#A7B1C2] block mb-1">
                  {currentOrder.status === 'Delivered' ? 'Delivered On' : 'Expected Delivery'}
                </span>
                <strong className="text-emerald-400 font-bold">
                  {currentOrder.status === 'Delivered' ? currentOrder.shipment.deliveredDate : currentOrder.shipment.expectedDeliveryDate}
                </strong>
              </div>

              <div>
                <span className="text-[#A7B1C2] block mb-1">Current Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/50 inline-block">
                  {currentOrder.status}
                </span>
              </div>
            </div>

            {/* 5. LIVE SHIPMENT MAP */}
            <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#28334B]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00D5FF] animate-ping" />
                    <h3 className="font-serif font-black text-lg text-white">
                      Your Watch Is On Its Way!
                    </h3>
                  </div>
                  <p className="text-xs text-[#A7B1C2] mt-0.5">
                    Latest verified telemetry update: <strong className="text-white">{currentOrder.shipment.verifiedTimestamp}</strong>
                  </p>
                </div>

                {/* Map Engine Toggle & Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 bg-[#081529] border border-[#28334B] rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setMapMode('google')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        mapMode === 'google'
                          ? 'bg-gradient-to-r from-[#6500FF] to-[#00D5FF] text-white shadow-md'
                          : 'text-[#A7B1C2] hover:text-white'
                      }`}
                    >
                      🛰️ Google Maps Live
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode('vector')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        mapMode === 'vector'
                          ? 'bg-gradient-to-r from-[#6500FF] to-[#00D5FF] text-white shadow-md'
                          : 'text-[#A7B1C2] hover:text-white'
                      }`}
                    >
                      🗺️ Atelier Radar
                    </button>
                  </div>

                  {mapMode === 'vector' && (
                    <>
                      <button
                        onClick={() => setMapZoom((prev) => Math.min(prev + 0.2, 1.8))}
                        className="p-2 rounded-xl bg-[#081529] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white border border-[#28334B] transition-colors cursor-pointer"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setMapZoom((prev) => Math.max(prev - 0.2, 0.8))}
                        className="p-2 rounded-xl bg-[#081529] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white border border-[#28334B] transition-colors cursor-pointer"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                    className="p-2 rounded-xl bg-[#081529] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white border border-[#28334B] transition-colors cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Render either Google Maps Live Tracking or Vector Canvas */}
              {mapMode === 'google' ? (
                <GoogleMapLiveTracking
                  orderId={currentOrder.orderId}
                  customerAddress={currentOrder.deliveryAddress.street}
                  customerCoords={{ lat: 28.4595, lng: 77.0850 }}
                  riderName={currentOrder.shipment.riderName}
                  riderPhone={currentOrder.shipment.riderPhone}
                />
              ) : (
                /* Interactive Vector Route Map Canvas */
                <div
                  className={`w-full rounded-2xl bg-[#081529] border border-[#28334B] overflow-hidden relative transition-all duration-300 flex items-center justify-center ${
                    isMapFullscreen ? 'h-[500px]' : 'h-72 sm:h-80'
                  }`}
                  style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center' }}
                >
                  {/* SVG Visual Roadway & Geofence Matrix */}
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 400" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(40, 51, 75, 0.4)" strokeWidth="0.5" />
                      </pattern>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6500FF" />
                        <stop offset="50%" stopColor="#00D5FF" />
                        <stop offset="100%" stopColor="#00C98B" />
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Highway Polylines */}
                    <path
                      d="M 120 280 C 240 180, 360 320, 500 210 S 680 140, 720 120"
                      fill="none"
                      stroke="#28334B"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Active Animated Polyline */}
                    <path
                      d="M 120 280 C 240 180, 360 320, 500 210 S 680 140, 720 120"
                      fill="none"
                      stroke="url(#routeGradient)"
                      strokeWidth="4"
                      strokeDasharray="8 6"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Point 1: Origin (Central Vault, New Delhi) */}
                  <div className="absolute left-[15%] top-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#6500FF] text-white flex items-center justify-center shadow-lg shadow-[#6500FF]/50 border-2 border-white">
                      <Box className="w-4 h-4" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white whitespace-nowrap border border-white/10">
                      Central Vault WH-01
                    </span>
                  </div>

                  {/* Point 2: Active Transit / Rider Location */}
                  <div className="absolute left-[62%] top-[52%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#00D5FF]/30 animate-ping absolute inset-0" />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] text-white flex items-center justify-center shadow-xl shadow-[#00D5FF]/50 border-2 border-white relative z-10">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="mt-1 px-2.5 py-1 rounded-lg bg-black/90 text-[10px] font-bold text-[#00D5FF] whitespace-nowrap border border-[#00D5FF]/40 shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{currentOrder.shipment.riderName} (On Route)</span>
                    </div>
                  </div>

                  {/* Point 3: Destination Address */}
                  <div className="absolute left-[90%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-[#E9B94F] text-black font-black flex items-center justify-center shadow-lg shadow-[#E9B94F]/50 border-2 border-white">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-[#E9B94F] whitespace-nowrap border border-white/10">
                      Destination: {currentOrder.deliveryAddress.city}
                    </span>
                  </div>

                  {/* Map Overlay Badge */}
                  <div className="absolute bottom-3 left-3 bg-[#081529]/90 backdrop-blur-md border border-[#28334B] rounded-xl px-3 py-1.5 text-[11px] text-[#A7B1C2] flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#00D5FF]" />
                    <span>Geofenced Route • ETA: {currentOrder.shipment.eta || 'Scheduled Handover'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. DELIVERY INFORMATION CARD & 4. 10-MILESTONE TIMELINE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 10-Step Chronometric Delivery Timeline (7 Cols) */}
              <div className="lg:col-span-7 bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
                  <h3 className="font-serif font-black text-lg text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#00D5FF]" />
                    Chronometric Delivery Timeline (10 Steps)
                  </h3>
                  <span className="text-xs text-[#E9B94F] font-semibold">100% Insured Delivery</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#28334B]">
                  {currentOrder.timeline.map((step, idx) => {
                    const isStepCompleted = step.status === 'completed';
                    const isStepActive = step.status === 'active';
                    const isStepPending = step.status === 'pending';

                    return (
                      <div key={step.id || idx} className="relative group">
                        {/* Status Node Dot */}
                        <div
                          className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                            isStepCompleted
                              ? 'bg-[#00C98B] text-black shadow-[#00C98B]/30'
                              : isStepActive
                              ? 'bg-[#00D5FF] text-black shadow-[#00D5FF]/50 ring-4 ring-[#00D5FF]/20 animate-pulse'
                              : 'bg-[#28334B] text-[#A7B1C2]'
                          }`}
                        >
                          {isStepCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <span>{step.id}</span>
                          )}
                        </div>

                        {/* Event Content */}
                        <div
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isStepActive
                              ? 'bg-[#081529] border-[#00D5FF]/60 shadow-lg shadow-[#00D5FF]/10'
                              : 'bg-[#081529]/60 border-[#28334B]/60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-sm font-bold ${
                                isStepActive ? 'text-[#00D5FF]' : isStepCompleted ? 'text-white' : 'text-gray-400'
                              }`}
                            >
                              {step.title}
                            </span>
                            <span className="text-[11px] font-mono text-[#A7B1C2]">{step.time}</span>
                          </div>

                          <p className="text-xs text-gray-300">{step.description}</p>

                          {step.location && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#A7B1C2]">
                              <MapPin className="w-3 h-3 text-[#E9B94F]" />
                              <span>{step.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Dedicated Delivery Details Card (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-5">
                  <h3 className="font-serif font-black text-lg text-white pb-3 border-b border-[#28334B] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#E9B94F]" />
                    Delivery Executive &amp; Courier
                  </h3>

                  {/* Rider Profile Card */}
                  <div className="p-4 rounded-2xl bg-[#081529] border border-[#28334B] flex items-center gap-3.5">
                    <img
                      src={currentOrder.shipment.riderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={currentOrder.shipment.riderName}
                      className="w-12 h-12 rounded-xl object-cover border border-[#00D5FF]/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-bold text-sm truncate">
                          {currentOrder.shipment.riderName}
                        </strong>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00C98B]/20 text-[#00C98B]">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-[#A7B1C2]">
                        Badge ID: <strong className="font-mono text-gray-300">{currentOrder.shipment.riderEmpId || 'RD-EXP-01'}</strong>
                      </p>
                      <p className="text-xs text-[#00D5FF] font-semibold mt-0.5">
                        {currentOrder.shipment.courierPartner}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A7B1C2] font-semibold">Delivery Instructions:</span>
                      <button
                        onClick={() => {
                          setNewInstructions(currentOrder.shipment.deliveryInstructions);
                          setShowInstructionsModal(true);
                        }}
                        className="text-[#00D5FF] hover:underline text-[11px] font-bold cursor-pointer"
                      >
                        Update
                      </button>
                    </div>
                    <div className="p-3 bg-[#081529] rounded-xl border border-[#28334B] text-gray-200">
                      {currentOrder.shipment.deliveryInstructions}
                    </div>
                  </div>

                  {/* Quick Action Contact Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <a
                      href={`tel:${currentOrder.shipment.riderPhone !== '—' ? currentOrder.shipment.riderPhone : currentOrder.shipment.courierPhone}`}
                      className="py-2.5 px-3 rounded-xl bg-[#081529] hover:bg-white/10 border border-[#28334B] text-xs font-bold text-white transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#00C98B]" />
                      <span>Call Courier</span>
                    </a>

                    <button
                      onClick={() => setShowSupportModal(true)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7410FF] hover:to-[#9B10FF] text-white text-xs font-bold shadow-md shadow-[#6500FF]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Live Concierge</span>
                    </button>
                  </div>
                </div>

                {/* Handover Security Notice */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-5 shadow-xl text-xs space-y-2">
                  <span className="font-bold text-[#E9B94F] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    White-Glove Handover Protocol
                  </span>
                  <p className="text-[#A7B1C2] text-[11px] leading-relaxed">
                    WatchHub couriers carry specialized anti-tamper verification tools. You may unseal and inspect the watch chronometer case before providing the 4-digit SMS OTP confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODALS: INVOICE, RETURN, CANCEL, INSTRUCTIONS, SUPPORT          */}
      {/* ============================================================== */}

      {/* MODAL: Return / Replace Request */}
      {showReturnModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFB020]/20 text-[#FFB020] flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-white">
                  Request Return / Exchange
                </h3>
              </div>
              <button onClick={() => setShowReturnModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#081529] rounded-2xl border border-[#28334B] flex items-center gap-3">
              <img src={currentOrder.product.image} alt={currentOrder.product.name} className="w-12 h-12 object-contain" />
              <div>
                <p className="text-xs font-bold text-white">{currentOrder.product.name}</p>
                <p className="text-[11px] text-[#A7B1C2]">Order #{currentOrder.orderId} • Delivered on {currentOrder.shipment.deliveredDate}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Reason for Return / Exchange</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-[#081529] border border-[#28334B] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#00D5FF]"
                >
                  <option value="Size / Wrist Diameter Preference">Size / Wrist Diameter Preference</option>
                  <option value="Exchange for Alternative Dial Variant">Exchange for Alternative Dial Variant</option>
                  <option value="Defect or Imperfection on Sapphire / Clasp">Defect or Imperfection on Sapphire / Clasp</option>
                  <option value="Changed Mind / Unworn Luxury Condition">Changed Mind / Unworn Luxury Condition</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Special Notes for Vault Inspector</label>
                <textarea
                  rows={3}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full bg-[#081529] border border-[#28334B] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#00D5FF]"
                />
              </div>

              <div className="p-3 bg-[#081529] rounded-xl text-[11px] text-[#A7B1C2] border border-[#28334B]">
                <strong className="text-white block mb-0.5">Complimentary Pickup Policy:</strong>
                Our white-glove courier will arrive with a specialized tamper-proof security box. 100% refund or exchange will be released upon vault intake inspection.
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#28334B]">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-xl bg-[#081529] text-[#A7B1C2] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFB020] to-[#E9B94F] text-black text-xs font-black shadow-lg cursor-pointer"
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Request Order Cancellation */}
      {showCancelModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">Cancel Order #{currentOrder.orderId}?</h3>
            </div>

            <p className="text-xs text-[#A7B1C2] leading-relaxed">
              Are you sure you want to cancel your order for{' '}
              <strong className="text-white">{currentOrder.product.name}</strong>? Your total payment of{' '}
              <strong className="text-[#E9B94F]">₹{Number(currentOrder.product.grandTotal).toLocaleString('en-IN')}</strong>{' '}
              will be 100% refunded immediately to your original payment method.
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#28334B]">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl bg-[#081529] text-[#A7B1C2] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Keep My Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Update Delivery Instructions */}
      {showInstructionsModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00D5FF]" />
                Update Delivery Instructions
              </h3>
              <button onClick={() => setShowInstructionsModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-[#A7B1C2] font-semibold">Special Instructions for Rider</label>
              <textarea
                rows={3}
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                placeholder="e.g. Leave with building security, call 30 mins before arrival..."
                className="w-full bg-[#081529] border border-[#28334B] rounded-xl p-3 text-white focus:outline-hidden focus:border-[#00D5FF]"
              />
              <p className="text-[11px] text-[#A7B1C2]">
                These instructions will be synced directly to courier executive {currentOrder.shipment.riderName}'s mobile dispatch app.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#28334B]">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#081529] text-[#A7B1C2] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructions}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Customer Concierge Support */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">WatchHub Concierge Desk</h3>
                  <p className="text-[10px] text-emerald-400 font-semibold">Priority 24/7 Live Assistance</p>
                </div>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#081529] rounded-2xl border border-[#28334B] space-y-1">
                <span className="text-[#A7B1C2] block">Regarding Order:</span>
                <strong className="text-white text-sm">#{currentOrder.orderId} • {currentOrder.product.name}</strong>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">How can our horology specialist assist you?</label>
                <textarea
                  rows={3}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Ask regarding delivery rescheduling, provenance certificate, or strap sizing..."
                  className="w-full bg-[#081529] border border-[#28334B] rounded-xl p-3 text-white focus:outline-hidden focus:border-[#00D5FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <a
                  href="tel:+918000000000"
                  className="p-3 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#00D5FF] text-white flex flex-col items-center gap-1 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#00C98B]" />
                  <span className="font-bold">Instant Phone Call</span>
                  <span className="text-[10px] text-[#A7B1C2]">+91 1800 900 8000</span>
                </a>

                <a
                  href="mailto:concierge@watchhub.com"
                  className="p-3 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#00D5FF] text-white flex flex-col items-center gap-1 transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#00D5FF]" />
                  <span className="font-bold">Email Desk</span>
                  <span className="text-[10px] text-[#A7B1C2]">concierge@watchhub.com</span>
                </a>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#28334B]">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 rounded-xl bg-[#081529] text-[#A7B1C2] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSupportModal(false);
                  showToast('Concierge inquiry submitted. A senior client advisor will reach out shortly.');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Footer */}
      <Footer />
    </div>
  );
}
