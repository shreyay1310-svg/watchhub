import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  Phone,
  ShieldCheck,
  Plus,
  Compass,
  X,
  AlertTriangle,
  RotateCcw,
  Bike,
  Sparkles,
} from 'lucide-react';

export const ShipmentTrackingModule = ({
  orders,
  riders,
  selectedOrder,
  onSelectOrder,
  onAddTrackingEvent,
}) => {
  const [searchInput, setSearchInput] = useState(selectedOrder?.orderId || '');
  const [activeOrder, setActiveOrder] = useState(selectedOrder || orders[0]);

  // Modal to append new checkpoint
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    stage: 'In Transit',
    time: '12:45 PM',
    location: 'Gurugram Distribution Hub',
    status: 'Completed',
    desc: 'Parcel scanned at transit station.',
  });

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const q = searchInput.toLowerCase().trim();
    const found = orders.find(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.awbNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.mobileNumber.toLowerCase().includes(q)
    );
    if (found) {
      setActiveOrder(found);
    } else {
      alert(`No shipment found matching "${searchInput}". Showing default active order.`);
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (onAddTrackingEvent && activeOrder) {
      onAddTrackingEvent(activeOrder.orderId, {
        ...newEvent,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      });
      setShowAddEventModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & REAL-TIME SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Shipment Tracking & Live Telemetry
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Trace high-value horology shipments end-to-end with GPS waypoints, courier telemetry and OTP validation.
          </p>
        </div>

        <button
          onClick={() => setShowAddEventModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer border border-[#8B00FF]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Checkpoint Event</span>
        </button>
      </div>

      {/* SEARCH BAR SECTION */}
      <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Order ID (e.g. WH-ORD-9021), AWB (BLU789456102), Customer, or Mobile..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white placeholder-[#A7B1C2]/60 focus:outline-none focus:border-[#6500FF]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold text-xs shadow-md shadow-[#6500FF]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Search Shipment</span>
          </button>
        </form>

        {/* Quick Shipment Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#28334B] text-[11px]">
          <span className="text-[#A7B1C2] font-semibold">Quick Track:</span>
          {orders.slice(0, 4).map((o) => (
            <button
              key={o.orderId}
              type="button"
              onClick={() => {
                setActiveOrder(o);
                setSearchInput(o.orderId);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                activeOrder?.orderId === o.orderId
                  ? 'bg-[#6500FF]/25 border-[#6500FF] text-white font-bold'
                  : 'bg-[#081529] border-[#28334B] text-[#A7B1C2] hover:text-white'
              }`}
            >
              {o.orderId} ({o.customerName})
            </button>
          ))}
        </div>
      </div>

      {activeOrder && (
        <div className="space-y-6">
          {/* 2. SHIPMENT HEADER SUMMARY CARD */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#11172C] via-[#081529] to-[#11172C] border border-[#28334B] shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Product and Order identity */}
              <div className="flex items-center gap-4">
                <img
                  src={activeOrder.productImage}
                  alt={activeOrder.productName}
                  className="w-20 h-20 rounded-2xl object-contain bg-[#081529] border border-[#28334B] p-2 flex-shrink-0 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-mono text-xs font-bold text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded-md border border-[#00D5FF]/30">
                      AWB: {activeOrder.awbNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        activeOrder.deliveryStatus === 'Delivered'
                          ? 'bg-[#00C98B]/20 text-[#00C98B]'
                          : 'bg-[#00D5FF]/20 text-[#00D5FF]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {activeOrder.deliveryStatus}
                    </span>
                  </div>

                  <h2 className="text-lg font-serif font-bold text-white">
                    {activeOrder.productName}
                  </h2>
                  <p className="text-xs text-[#A7B1C2]">
                    Order #{activeOrder.orderId} • {activeOrder.formattedAmount} • {activeOrder.paymentType}
                  </p>
                </div>
              </div>

              {/* Rider & Delivery Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-[#28334B] pt-4 lg:pt-0 lg:pl-6 text-xs">
                <div>
                  <span className="text-[#A7B1C2] block text-[11px]">Courier Partner</span>
                  <span className="font-bold text-white block mt-0.5">{activeOrder.deliveryPartner}</span>
                  <span className="text-[10px] text-[#E9B94F] font-semibold">{activeOrder.priority}</span>
                </div>

                <div>
                  <span className="text-[#A7B1C2] block text-[11px]">Assigned Rider</span>
                  <span className="font-bold text-[#E9B94F] block mt-0.5">{activeOrder.rider}</span>
                  <span className="text-[10px] text-[#A7B1C2]">{activeOrder.riderPhone || 'Not assigned'}</span>
                </div>

                <div>
                  <span className="text-[#A7B1C2] block text-[11px]">Expected Delivery</span>
                  <span className="font-bold text-[#00C98B] block mt-0.5">{activeOrder.expectedDeliveryDate}</span>
                  <span className="text-[10px] text-[#A7B1C2]">{activeOrder.eta}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TWO COLUMNS: LEFT (9-STAGE TIMELINE) + RIGHT (LIVE GPS MAP & DETAILS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: 9-STAGE TRACKING TIMELINE (6 Cols) */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#28334B] mb-5">
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Shipment Journey & Milestones
                  </h3>
                  <p className="text-xs text-[#A7B1C2]">
                    Verified timestamped events with GPS locations
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#00D5FF] bg-[#00D5FF]/10 px-2 py-0.5 rounded-full border border-[#00D5FF]/30">
                  {activeOrder.trackingTimeline.length} Events Logged
                </span>
              </div>

              {/* Timeline list */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#6500FF] before:via-[#00D5FF] before:to-[#28334B]">
                {activeOrder.trackingTimeline.map((item, idx) => {
                  const isCompleted = item.status === 'Completed';
                  const isActive = item.status === 'Active';
                  const isFailed = item.status === 'Failed';

                  return (
                    <div key={idx} className="relative group">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[30px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? 'bg-[#00C98B] border-[#00C98B] text-[#070918]'
                            : isActive
                            ? 'bg-[#00D5FF] border-white text-[#070918] shadow-md shadow-[#00D5FF]/50 animate-pulse'
                            : isFailed
                            ? 'bg-[#FF4966] border-[#FF4966] text-white'
                            : 'bg-[#11172C] border-[#28334B] text-[#A7B1C2]'
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-3 h-3 text-[#070918]" />}
                        {isActive && <Truck className="w-2.5 h-2.5 text-[#070918]" />}
                        {isFailed && <AlertTriangle className="w-2.5 h-2.5 text-white" />}
                      </div>

                      {/* Event Card */}
                      <div
                        className={`p-3.5 rounded-xl border text-xs transition-colors ${
                          isActive
                            ? 'bg-[#081529] border-[#00D5FF]/50 shadow-md shadow-[#00D5FF]/10'
                            : 'bg-[#081529]/60 border-[#28334B]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">
                            {item.stage}
                          </span>
                          <span className="text-[11px] font-mono text-[#E9B94F]">
                            {item.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#00D5FF] font-medium mt-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span>{item.location}</span>
                          <span className="text-[#A7B1C2]">• {item.date}</span>
                        </div>

                        <p className="text-[11px] text-[#A7B1C2] mt-1.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: LIVE INTERACTIVE MAP & RECIPIENT INFORMATION (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Map Canvas */}
              <div className="p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00C98B] animate-ping" />
                    <h3 className="font-serif font-bold text-base text-white">
                      Live Delivery Route & GPS Waypoint
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#00D5FF] font-semibold">
                    Live GPS Telemetry
                  </span>
                </div>

                {/* Map Display */}
                <div className="relative h-60 rounded-xl bg-[#081529] border border-[#28334B] overflow-hidden p-4 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(#28334B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                  {/* Destination Marker */}
                  <div className="absolute right-[22%] top-[25%] z-10 flex flex-col items-center group">
                    <div className="w-8 h-8 rounded-full bg-[#00C98B] border-2 border-white flex items-center justify-center text-xs font-bold text-[#070918] shadow-lg shadow-[#00C98B]/50 animate-bounce">
                      📍
                    </div>
                    <div className="bg-[#081529] border border-[#00C98B] px-2 py-0.5 rounded text-[9.5px] text-white shadow-md whitespace-nowrap mt-1">
                      {activeOrder.deliveryAddress}
                    </div>
                  </div>

                  {/* Rider In-Transit Marker */}
                  <div className="absolute left-[30%] bottom-[30%] z-10 flex flex-col items-center group">
                    <div className="w-8 h-8 rounded-full bg-[#00D5FF] border-2 border-white flex items-center justify-center text-xs font-bold text-[#070918] shadow-lg shadow-[#00D5FF]/50">
                      🛵
                    </div>
                    <div className="bg-[#081529] border border-[#00D5FF] px-2 py-0.5 rounded text-[9.5px] text-white shadow-md whitespace-nowrap mt-1">
                      {activeOrder.rider} ({activeOrder.eta})
                    </div>
                  </div>

                  {/* Route Line SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#00D5FF] stroke-2 [stroke-dasharray:6_4]">
                    <path d="M 120 180 Q 220 120 380 90" fill="none" />
                  </svg>

                  {/* Bottom Map Info */}
                  <div className="relative z-10 mt-auto bg-[#11172C]/90 backdrop-blur-md p-2.5 rounded-lg border border-[#28334B] flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-[#A7B1C2] block">Current Location:</span>
                      <span className="font-bold text-white">{activeOrder.city} • Sector Distribution Point</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#A7B1C2] block">Live ETA:</span>
                      <span className="font-bold text-[#00C98B]">{activeOrder.eta}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipient & Security Card */}
              <div className="p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-4">
                <h3 className="font-serif font-bold text-base text-white">
                  Recipient & Security Handover Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B]">
                    <span className="text-[#A7B1C2] text-[11px] block">Customer Name</span>
                    <span className="font-bold text-white block mt-0.5">{activeOrder.customerName}</span>
                    <span className="text-[11px] text-[#A7B1C2] flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3 text-[#00D5FF]" />
                      {activeOrder.mobileNumber}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B]">
                    <span className="text-[#A7B1C2] text-[11px] block">Doorstep Verification</span>
                    <span className="font-bold text-[#00C98B] block mt-0.5">Mandatory SMS OTP</span>
                    <span className="text-[11px] text-[#E9B94F] font-mono mt-1 block">
                      OTP: **** (Sent to phone)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B] text-xs">
                  <span className="text-[#A7B1C2] text-[11px] block">Full Delivery Address:</span>
                  <p className="text-white font-medium mt-0.5 leading-relaxed">
                    {activeOrder.deliveryAddress}, {activeOrder.city}, {activeOrder.state} - {activeOrder.pincode}
                  </p>
                  <p className="text-[11px] text-[#E9B94F] mt-1.5 italic">
                    Special notes: {activeOrder.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD TRACKING CHECKPOINT EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#28334B]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Add Tracking Checkpoint
                  </h3>
                  <p className="text-[11px] text-[#A7B1C2]">
                    Append manual waypoint for #{activeOrder?.orderId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-[#A7B1C2] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#A7B1C2] block mb-1">
                  Milestone Stage
                </label>
                <select
                  value={newEvent.stage}
                  onChange={(e) => setNewEvent({ ...newEvent, stage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
                >
                  <option value="Packed">Packed at Vault</option>
                  <option value="Dispatched">Dispatched to Air Freight</option>
                  <option value="In Transit">In Transit (Highway/Flight)</option>
                  <option value="Reached Local Hub">Reached Local Hub</option>
                  <option value="Out for Delivery">Out for Delivery (Rider Allocated)</option>
                  <option value="Delivered">Delivered with OTP</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#A7B1C2] block mb-1">
                    Event Time
                  </label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A7B1C2] block mb-1">
                    Status
                  </label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Active">Active (Current)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#A7B1C2] block mb-1">
                  Location (City / Facility)
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#A7B1C2] block mb-1">
                  Event Description
                </label>
                <textarea
                  rows="2"
                  value={newEvent.desc}
                  onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white placeholder-[#A7B1C2]/60 focus:outline-none focus:border-[#6500FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A7B1C2] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs shadow-md shadow-[#6500FF]/30 cursor-pointer"
                >
                  Save Checkpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTrackingModule;
