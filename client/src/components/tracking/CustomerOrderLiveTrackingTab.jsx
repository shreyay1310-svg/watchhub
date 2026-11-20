import React from 'react';
import GoogleMapLiveTracking from '../common/GoogleMapLiveTracking';
import {
  ArrowLeft,
  Search,
  Truck,
  Navigation,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Download,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export default function CustomerOrderLiveTrackingTab({
  currentOrder,
  formatPrice,
  setActiveView,
  searchQuery,
  setSearchQuery,
  handleSearchOrder,
  copiedAwb,
  setCopiedAwb,
  mapRef,
  mapSimActive,
  setMapSimActive,
  selectedMilestone,
  setSelectedMilestone,
  etaCountdown,
  liveRiderStatus,
  setShowInstructionsModal,
  setShowSupportModal,
  handleDownloadInvoice,
}) {
  if (activeView !== 'tracking' || !currentOrder) return null;

  return (
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
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${mapMode === 'google'
                        ? 'bg-gradient-to-r from-[#6500FF] to-[#00D5FF] text-white shadow-md'
                        : 'text-[#A7B1C2] hover:text-white'
                        }`}
                    >
                      🛰️ Google Maps Live
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapMode('vector')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${mapMode === 'vector'
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
                  className={`w-full rounded-2xl bg-[#081529] border border-[#28334B] overflow-hidden relative transition-all duration-300 flex items-center justify-center ${isMapFullscreen ? 'h-[500px]' : 'h-72 sm:h-80'
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
                          className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${isStepCompleted
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
                          className={`p-3.5 rounded-2xl border transition-all ${isStepActive
                            ? 'bg-[#081529] border-[#00D5FF]/60 shadow-lg shadow-[#00D5FF]/10'
                            : 'bg-[#081529]/60 border-[#28334B]/60'
                            }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-sm font-bold ${isStepActive ? 'text-[#00D5FF]' : isStepCompleted ? 'text-white' : 'text-gray-400'
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
  );
}
