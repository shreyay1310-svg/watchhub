import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import GoogleMapLiveTracking from '../../components/common/GoogleMapLiveTracking';
import { CUSTOMER_ORDERS_DATA, findCustomerOrder } from '../../data/customerOrdersData';
import CustomerOrdersListTab from '../../components/tracking/CustomerOrdersListTab';
import CustomerOrderDetailTab from '../../components/tracking/CustomerOrderDetailTab';
import CustomerOrderLiveTrackingTab from '../../components/tracking/CustomerOrderLiveTrackingTab';
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeView === 'orders'
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeView === 'tracking'
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
        {/* VIEW 1: MY ORDERS MAIN PAGE */}
        {activeView === 'orders' && (
          <CustomerOrdersListTab
            orders={orders}
            filteredOrders={filteredOrders}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            timeframeFilter={timeframeFilter}
            setTimeframeFilter={setTimeframeFilter}
            formatPrice={formatPrice}
            handleViewOrderDetails={handleViewOrderDetails}
            handleTrackOrder={handleTrackOrder}
            handleDownloadInvoice={handleDownloadInvoice}
            setShowSupportModal={setShowSupportModal}
            setShowReturnModal={setShowReturnModal}
            copiedAwb={copiedAwb}
            setCopiedAwb={setCopiedAwb}
          />
        )}

        {/* VIEW 2: ORDER DETAILS PAGE */}
        {activeView === 'detail' && currentOrder && (
          <CustomerOrderDetailTab
            currentOrder={currentOrder}
            formatPrice={formatPrice}
            setActiveView={setActiveView}
            handleTrackOrder={handleTrackOrder}
            handleDownloadInvoice={handleDownloadInvoice}
            setShowSupportModal={setShowSupportModal}
            setShowCancelModal={setShowCancelModal}
            copiedAwb={copiedAwb}
            setCopiedAwb={setCopiedAwb}
          />
        )}

        {/* VIEW 3: TRACK MY ORDER */}
        {activeView === 'tracking' && currentOrder && (
          <CustomerOrderLiveTrackingTab
            currentOrder={currentOrder}
            formatPrice={formatPrice}
            setActiveView={setActiveView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchOrder={handleSearchOrder}
            copiedAwb={copiedAwb}
            setCopiedAwb={setCopiedAwb}
            mapRef={mapRef}
            mapSimActive={mapSimActive}
            setMapSimActive={setMapSimActive}
            selectedMilestone={selectedMilestone}
            setSelectedMilestone={setSelectedMilestone}
            etaCountdown={etaCountdown}
            liveRiderStatus={liveRiderStatus}
            setShowInstructionsModal={setShowInstructionsModal}
            setShowSupportModal={setShowSupportModal}
            handleDownloadInvoice={handleDownloadInvoice}
          />
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
              <img
                src={currentOrder.product.image}
                alt={currentOrder.product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/products/watch_placeholder.png';
                }}
                className="w-12 h-12 object-contain"
              />
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
