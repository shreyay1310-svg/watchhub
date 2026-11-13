import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  RefreshCw,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CustomerNavbar } from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { findTrackingOrder, MOCK_ORDERS } from '../../data/trackingData';

export default function TrackParcelPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('awb') || 'WH20261125';

  const [activeTab, setActiveTab] = useState('orderId'); // 'orderId' | 'awb' | 'myOrders'
  const [orderIdInput, setOrderIdInput] = useState(initialQuery);
  const [contactInput, setContactInput] = useState('shreya@example.com');
  const [awbInput, setAwbInput] = useState('DLV7894563210');
  const [selectedCourier, setSelectedCourier] = useState('Delhivery');
  const [currentOrder, setCurrentOrder] = useState(() => findTrackingOrder(initialQuery));
  const [isCopied, setIsCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuccessToast, setSearchSuccessToast] = useState(null);

  // Delivery Updates Modal State
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [updateChannels, setUpdateChannels] = useState({
    whatsapp: true,
    sms: true,
    email: false,
  });
  const [updatePhone, setUpdatePhone] = useState('+91 98765 43210');
  const [updateEmail, setUpdateEmail] = useState('shreya@example.com');
  const [updateSubscribed, setUpdateSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle Search Submission
  const handleTrackSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);

    const query = activeTab === 'awb' ? awbInput : orderIdInput;
    setTimeout(() => {
      const order = findTrackingOrder(query);
      setCurrentOrder(order);
      setIsSearching(false);
      setSearchSuccessToast(`Tracking details synced for ${order.orderId}`);
      setTimeout(() => setSearchSuccessToast(null), 3500);
    }, 350);
  };

  // Copy AWB to Clipboard
  const handleCopyAwb = () => {
    if (!currentOrder?.awbNumber) return;
    navigator.clipboard.writeText(currentOrder.awbNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  // Switch Order from My Orders list
  const handleSelectOrder = (order) => {
    setCurrentOrder(order);
    setOrderIdInput(order.orderId);
    setAwbInput(order.awbNumber);
    setActiveTab('orderId');
  };

  // Handle Updates Subscription
  const handleSubscribeUpdates = (e) => {
    e.preventDefault();
    setUpdateSubscribed(true);
    setTimeout(() => {
      setShowUpdatesModal(false);
      setUpdateSubscribed(false);
      setSearchSuccessToast('Delivery notifications activated via WhatsApp & SMS!');
      setTimeout(() => setSearchSuccessToast(null), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans flex flex-col">
      <CustomerNavbar />

      {/* ════════════════════════════════════════════════════════════════
          1. HERO BANNER: Midnight Navy + Gold Pathway + 3D Luxury Box
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0B121C] text-white overflow-hidden py-10 lg:py-14 border-b border-white/10">
        {/* Subtle background ambient luxury glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4A84F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#1A365D]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Title & Subtitle */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#D4A84F]/30 text-xs font-semibold text-[#D4A84F] mb-3">
                <Truck className="w-3.5 h-3.5" />
                <span>Live GPS & Carrier Sync Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                Track Your <span className="text-[#D4A84F]">Parcel</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-300 font-normal">
                Stay updated on your WatchHub delivery, every step of the way.
              </p>
            </div>

            {/* Visual 3D Luxury Box Graphic with Golden Dashed Pathway */}
            <div className="relative w-full max-w-md h-32 sm:h-36 flex items-center justify-center">
              {/* Golden Dashed Pathway */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 400 120"
                fill="none"
              >
                <path
                  d="M 10 90 Q 120 110, 200 60 T 390 30"
                  stroke="#D4A84F"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </svg>

              {/* Waypoint Pin 1 */}
              <div className="absolute left-10 bottom-4 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#D4A84F]/20 border border-[#D4A84F] flex items-center justify-center text-[#D4A84F] shadow-lg animate-pulse">
                  <MapPin className="w-4 h-4 fill-[#D4A84F]" />
                </div>
              </div>

              {/* 3D Branded Gold WatchHub Parcel Box (Centerpiece) */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                <div className="w-36 h-24 sm:w-44 sm:h-28 rounded-2xl bg-gradient-to-br from-[#E2B755] via-[#C59B3F] to-[#997322] shadow-2xl border border-white/20 p-2.5 flex flex-col justify-between text-black relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-md" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 text-white px-2 py-0.5 rounded">
                      VIP PRIORITY
                    </span>
                    <Package className="w-4 h-4 text-black/70" />
                  </div>
                  <div className="text-center my-auto">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-sm tracking-tight text-black">
                      <span>⌚</span>
                      <span className="font-serif">Watch<span className="text-white">Hub</span></span>
                    </div>
                    <span className="text-[9px] font-medium text-black/70 block">
                      Tamper-Proof Luxury Seal
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-black/80 border-t border-black/10 pt-1">
                    <span>SEALED</span>
                    <span>✓ AUTHENTIC</span>
                  </div>
                </div>
              </div>

              {/* Destination Pin 2 */}
              <div className="absolute right-6 top-4 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#D4A84F] text-black flex items-center justify-center shadow-xl font-bold">
                  <MapPin className="w-5 h-5 fill-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. TOP TRACKING OPTIONS BAR (3 Tabs: Order ID, AWB, My Orders)
          ════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 w-full mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top 3 Segmented Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab('orderId')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'orderId'
                  ? 'bg-[#0B121C] text-white shadow-inner'
                  : 'bg-gray-50/70 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Package className={`w-4 h-4 ${activeTab === 'orderId' ? 'text-[#D4A84F]' : 'text-gray-500'}`} />
              <span>Track by Order ID</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('awb')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'awb'
                  ? 'bg-[#0B121C] text-white shadow-inner'
                  : 'bg-gray-50/70 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Truck className={`w-4 h-4 ${activeTab === 'awb' ? 'text-[#D4A84F]' : 'text-gray-500'}`} />
              <span>Track by AWB Number</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('myOrders')}
              className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'myOrders'
                  ? 'bg-[#0B121C] text-white shadow-inner'
                  : 'bg-gray-50/70 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Layers className={`w-4 h-4 ${activeTab === 'myOrders' ? 'text-[#D4A84F]' : 'text-gray-500'}`} />
              <span>Track from My Orders</span>
            </button>
          </div>

          {/* Tab Content & Search Form */}
          <div className="p-4 sm:p-6 bg-white">
            {activeTab === 'orderId' && (
              <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Order ID Input */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Order ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={orderIdInput}
                      onChange={(e) => setOrderIdInput(e.target.value)}
                      placeholder="Enter your order ID (e.g. WH20261125)"
                      required
                      className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A84F]/50 focus:border-[#D4A84F] transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Email / Phone Input */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Registered Email or Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      placeholder="Enter your email or mobile number"
                      required
                      className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A84F]/50 focus:border-[#D4A84F] transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full h-11 bg-gradient-to-r from-[#D4A84F] to-[#E6BA5E] hover:from-[#c3973e] hover:to-[#d4a84f] text-black font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSearching ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <>
                        <span>Track Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'awb' && (
              <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* AWB Number Input */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    AWB / Consignment Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={awbInput}
                      onChange={(e) => setAwbInput(e.target.value)}
                      placeholder="Enter 10-14 digit AWB (e.g. DLV7894563210)"
                      required
                      className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A84F]/50 focus:border-[#D4A84F] transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Courier Partner Selector */}
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Courier Partner <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="w-full h-11 px-3 text-xs sm:text-sm rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4A84F]/50 focus:border-[#D4A84F] transition-all font-medium"
                  >
                    <option value="Delhivery">Delhivery (Official Partner)</option>
                    <option value="BlueDart">BlueDart Express</option>
                    <option value="DTDC">DTDC Premier</option>
                    <option value="FedEx">FedEx Luxury Logistics</option>
                    <option value="EcomExpress">Ecom Express</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full h-11 bg-gradient-to-r from-[#D4A84F] to-[#E6BA5E] hover:from-[#c3973e] hover:to-[#d4a84f] text-black font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSearching ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <>
                        <span>Track AWB</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'myOrders' && (
              <div>
                <p className="text-xs text-gray-500 mb-3">
                  Select any recent order from your WatchHub account to view real-time courier tracking:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {MOCK_ORDERS.map((order) => {
                    const isSelected = currentOrder.orderId === order.orderId;
                    return (
                      <div
                        key={order.orderId}
                        onClick={() => handleSelectOrder(order)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#D4A84F] bg-[#FCF9F2] shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-gray-900">{order.orderId}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {order.timeline.find((t) => t.active)?.title || 'In Transit'}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-700 truncate">{order.product.name}</p>
                        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500">
                          <span>{order.formattedPrice}</span>
                          <span className="font-semibold text-[#D4A84F] flex items-center gap-0.5">
                            Track Now <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sync Toast Notification */}
        {searchSuccessToast && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {searchSuccessToast}
            </span>
            <button onClick={() => setSearchSuccessToast(null)} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. MAIN THREE-COLUMN DASHBOARD
             Left: Order Details
             Center: Shipment Progress (8 Stages)
             Right: Delivery Estimate & Interactive Current Location
          ════════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: ORDER DETAILS (lg:col-span-3)
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 sticky top-24">
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Order Details
              </h2>

              {/* Product Thumbnail & Core Info */}
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 p-1.5 flex items-center justify-center flex-shrink-0">
                  <img
                    src={currentOrder.product.image}
                    alt={currentOrder.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A84F] block">
                    {currentOrder.product.category || 'Luxury'}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {currentOrder.product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Qty: {currentOrder.product.quantity}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {currentOrder.product.formattedPrice}
                  </p>
                </div>
              </div>

              {/* Order Metadata Spec List */}
              <div className="space-y-3.5 text-xs">
                {/* Order ID */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Box className="w-4 h-4 text-gray-400" />
                    <span>Order ID</span>
                  </span>
                  <span className="font-bold text-gray-900">{currentOrder.orderId}</span>
                </div>

                {/* Order Date */}
                <div className="flex items-center justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Order Date</span>
                  </span>
                  <span className="font-semibold text-gray-800 text-right">{currentOrder.orderDate}</span>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>Payment Status</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <Check className="w-3 h-3" /> Paid
                  </span>
                </div>

                {/* Courier Partner */}
                <div className="flex items-center justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span>Courier Partner</span>
                  </span>
                  <span className="font-bold text-gray-900">{currentOrder.courierPartner}</span>
                </div>

                {/* Tracking / AWB No. with Copy Button */}
                <div className="py-2 border-t border-gray-50">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span className="flex items-center gap-2">
                      <Copy className="w-4 h-4 text-gray-400" />
                      <span>Tracking / AWB No.</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                    <span className="font-mono font-bold text-gray-900 text-xs">
                      {currentOrder.awbNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAwb}
                      title="Copy AWB Number"
                      className="p-1 hover:bg-white rounded text-gray-500 hover:text-[#D4A84F] transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                    >
                      {isCopied ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Official Courier Tracking Link */}
                {currentOrder.courierTrackingUrl && (
                  <div className="pt-2">
                    <a
                      href={currentOrder.courierTrackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:border-[#D4A84F] bg-white hover:bg-gray-50 text-gray-700 hover:text-black font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Carrier Portal Tracking</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CENTER COLUMN: SHIPMENT PROGRESS (8 Stages) (lg:col-span-5)
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              {/* Card Header with Status Badge */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                  Shipment Progress
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Truck className="w-3.5 h-3.5" />
                  <span>In Transit</span>
                </span>
              </div>

              {/* 8-Stage Vertical Timeline */}
              <div className="relative pl-2">
                {currentOrder.timeline.map((stage, idx) => {
                  const isLast = idx === currentOrder.timeline.length - 1;
                  const isCompleted = stage.completed;
                  const isActive = stage.active;

                  return (
                    <div key={stage.stageId} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Vertical Connecting Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[13px] top-[26px] bottom-0 w-0.5 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        />
                      )}

                      {/* Milestone State Icon */}
                      <div className="relative z-10 flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-7 h-7 rounded-full bg-[#E5B54F] text-black flex items-center justify-center shadow-md animate-pulse">
                            <Truck className="w-4 h-4 fill-black text-black" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Milestone Text & Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
                          <h4
                            className={`text-sm font-bold ${
                              isActive
                                ? 'text-gray-900'
                                : isCompleted
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {stage.title}
                          </h4>
                          {stage.time && (
                            <span
                              className={`text-[11px] ${
                                isActive ? 'font-semibold text-gray-700' : 'text-gray-500'
                              }`}
                            >
                              {stage.time}
                            </span>
                          )}
                        </div>

                        {/* Active Highlight Box (Matches the exact golden yellow box in reference UI) */}
                        {isActive ? (
                          <div className="mt-2 p-3.5 rounded-xl bg-[#FCF8E9] border border-[#EADBBD] text-xs text-[#6B5115] font-medium leading-relaxed shadow-2xs">
                            {stage.description}
                          </div>
                        ) : (
                          <p
                            className={`text-xs mt-0.5 leading-relaxed ${
                              isCompleted ? 'text-gray-600' : 'text-gray-400'
                            }`}
                          >
                            {stage.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: DELIVERY INFORMATION & MAP (lg:col-span-4)
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-5">
            {/* 1. Delivery Estimate Card (Champagne gold container) */}
            <div className="bg-[#FCF9F2] border border-[#EADBBD] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2">
                <Calendar className="w-4 h-4 text-[#D4A84F]" />
                <span className="uppercase tracking-wider">Delivery Estimate</span>
              </div>
              <p className="text-xs text-gray-500">Expected Delivery</p>
              <h3 className="text-2xl sm:text-3xl font-bold font-sans text-gray-900 mt-0.5">
                {currentOrder.expectedDelivery}
              </h3>
              <p className="text-xs font-medium text-gray-600 mt-1">
                {currentOrder.deliveryTimeWindow}
              </p>
            </div>

            {/* 2. Current Location & Interactive Map Preview */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-50 text-[#D4A84F] flex items-center justify-center">
                    <MapPin className="w-4 h-4 fill-[#D4A84F]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Current Location
                    </h4>
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                      {currentOrder.currentLocation}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[11px] text-gray-400 mb-3">
                Last Updated: {currentOrder.lastUpdated}
              </p>

              {/* Styled Vector Map Preview */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-[#E8ECEF]">
                {/* SVG Simulated City Grid & Highways */}
                <svg className="w-full h-full" viewBox="0 0 300 140" fill="none">
                  {/* Background map land */}
                  <rect width="300" height="140" fill="#E8ECEF" />
                  {/* Green park zones */}
                  <rect x="20" y="20" width="60" height="40" rx="6" fill="#D3E2D5" opacity="0.7" />
                  <rect x="220" y="70" width="70" height="50" rx="8" fill="#D3E2D5" opacity="0.7" />
                  
                  {/* Road Grid */}
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#FFFFFF" strokeWidth="4" />
                  <line x1="0" y1="95" x2="300" y2="95" stroke="#FFFFFF" strokeWidth="5" />
                  <line x1="80" y1="0" x2="80" y2="140" stroke="#FFFFFF" strokeWidth="4" />
                  <line x1="190" y1="0" x2="190" y2="140" stroke="#FFFFFF" strokeWidth="6" />

                  {/* Highway Line (Gold) */}
                  <path
                    d="M 10 120 Q 150 110, 190 70 T 290 20"
                    stroke="#D4A84F"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />

                  {/* Pulsing Location Pin at Gurugram Hub */}
                  <circle cx="190" cy="70" r="14" fill="#D4A84F" fillOpacity="0.25">
                    <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="190" cy="70" r="6" fill="#D4A84F" />
                </svg>

                {/* Floating Map Status Bubble (Matches reference UI exactly) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs shadow-md border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                  <div className="w-2 h-2 rounded-full bg-[#D4A84F] animate-ping" />
                  <span className="text-[11px] font-bold text-gray-800">
                    In Transit - Gurugram Hub
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Get Delivery Updates Button (Triggers subscription modal) */}
            <button
              type="button"
              onClick={() => setShowUpdatesModal(true)}
              className="w-full py-3.5 px-4 rounded-xl border border-[#EADBBD] bg-white hover:bg-[#FCF9F2] text-gray-900 font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4A84F] group-hover:scale-110 transition-transform" />
                <span>Get Delivery Updates</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
            </button>
          </div>

        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════════
          4. GET DELIVERY UPDATES MODAL (WhatsApp, SMS, Email alerts)
          ════════════════════════════════════════════════════════════════ */}
      {showUpdatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#0B121C] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#D4A84F]/20 border border-[#D4A84F]/40 flex items-center justify-center text-[#D4A84F]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Delivery Alerts Subscription</h3>
                  <p className="text-[11px] text-gray-400">Order: {currentOrder.orderId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUpdatesModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubscribeUpdates} className="p-5 space-y-4">
              <p className="text-xs text-gray-600">
                Choose how you would like to receive real-time notifications for milestone updates:
              </p>

              {/* Notification Channel Checkboxes */}
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:border-[#D4A84F]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">💬</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">WhatsApp Instant Alerts</p>
                      <p className="text-[11px] text-gray-500">Live milestone updates on WhatsApp</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={updateChannels.whatsapp}
                    onChange={(e) =>
                      setUpdateChannels({ ...updateChannels, whatsapp: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#D4A84F] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:border-[#D4A84F]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📱</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">SMS Out-for-Delivery Alerts</p>
                      <p className="text-[11px] text-gray-500">OTP & driver contact when dispatched</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={updateChannels.sms}
                    onChange={(e) =>
                      setUpdateChannels({ ...updateChannels, sms: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#D4A84F] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:border-[#D4A84F]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">✉️</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Email Delivery Confirmation</p>
                      <p className="text-[11px] text-gray-500">Official invoice and warranty certificate</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={updateChannels.email}
                    onChange={(e) =>
                      setUpdateChannels({ ...updateChannels, email: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#D4A84F] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={updatePhone}
                  onChange={(e) => setUpdatePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A84F]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updateSubscribed}
                  className="w-full h-11 bg-[#D4A84F] hover:bg-[#c3973e] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  {updateSubscribed ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Preferences Saved!
                    </span>
                  ) : (
                    <span>Save Alert Preferences</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
