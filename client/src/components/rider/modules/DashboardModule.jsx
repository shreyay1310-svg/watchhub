import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  Navigation,
  Clock,
  Phone,
  KeyRound,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronDown,
  Bike,
  ShieldCheck,
  Star,
  FileText,
  HelpCircle,
  Headphones,
} from 'lucide-react';

export const DashboardModule = ({
  deliveries = [],
  onOpenOtpModal,
  onOpenIssueModal,
  onSelectTab,
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const [sortOption, setSortOption] = useState('nearest');

  // Filter deliveries based on active parcel tab
  const filteredDeliveries = deliveries.filter((d) => {
    if (activeFilterTab === 'in-progress') return d.status === 'Out for Delivery';
    if (activeFilterTab === 'upcoming') return d.status === 'Assigned';
    if (activeFilterTab === 'completed') return d.status === 'Delivered';
    return true; // 'all'
  });

  return (
    <div className="space-y-6 select-none">
      {/* 1. TOP HERO GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1022] via-[#0E1630] to-[#080E21] border border-white/10 p-5 sm:p-7 shadow-2xl">
        {/* Ambient Neon Backlights */}
        <div className="absolute top-0 right-1/4 w-80 h-40 bg-[#00F2FE]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-10 w-96 h-36 bg-[#A855F7]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-300 font-medium">
                Welcome back, <strong className="text-white">Rohan Singh</strong> 👋
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-serif tracking-tight">
              Rider Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Manage your assigned deliveries, track earnings, and stay on time.
            </p>
          </div>

          {/* Right Hero: Motorcycle Graphic + Live Clock */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            {/* Speeding Bike Art Illustration */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-[#00F2FE]/15 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <Bike className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                  Express Transit
                </span>
                <span className="text-xs font-black text-white">Lucknow Express Route</span>
              </div>
            </div>

            {/* Live Clock Badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#070B18] border border-white/10 text-xs text-gray-300">
              <Calendar className="w-4 h-4 text-[#00F2FE]" />
              <div className="text-left">
                <span className="block text-[11px] font-bold text-white">Sat, 21 Nov 2026</span>
                <span className="block text-[10px] text-gray-400 font-mono">04:02 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP KPI CARDS (4 Grid Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Today's Earnings */}
        <div
          onClick={() => onSelectTab && onSelectTab('earnings')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0B1022] border border-white/10 hover:border-[#00F2FE]/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Today's Earnings</span>
            <div className="w-9 h-9 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(0,242,254,0.2)]">
              ₹
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            ₹1,850
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#10B981] font-bold">
            <span>↑ +18% vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Active Parcels */}
        <div
          onClick={() => onSelectTab && onSelectTab('assigned')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0B1022] border border-white/10 hover:border-[#A855F7]/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Active Parcels</span>
            <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] flex items-center justify-center text-sm shadow-[0_0_12px_rgba(168,85,247,0.2)]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {deliveries.filter((d) => d.status !== 'Delivered').length || 4}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400">
            <span>Out for delivery</span>
          </div>
        </div>

        {/* Card 3: Completed Today */}
        <div
          onClick={() => onSelectTab && onSelectTab('completed')}
          className="p-4 sm:p-5 rounded-2xl bg-[#0B1022] border border-white/10 hover:border-[#10B981]/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Completed Today</span>
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center text-sm shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            12 Orders
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#10B981] font-bold">
            <span>100% on-time delivery</span>
          </div>
        </div>

        {/* Card 4: Distance Logged */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1022] border border-white/10 hover:border-[#F59E0B]/40 transition-all group shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Distance Logged</span>
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] flex items-center justify-center text-sm shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            34.2 km
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#F59E0B] font-bold">
            <span>Lucknow Central Zone</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: TWO COLUMNS (Deliveries List + Right Widgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Assigned Parcels for Delivery (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Controls & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-white/5">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveFilterTab('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilterTab === 'all'
                    ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                Assigned Parcels for Delivery{' '}
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#00F2FE]/30 text-[#00F2FE] text-[10px]">
                  {deliveries.length} Packages
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterTab('in-progress')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilterTab === 'in-progress'
                    ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                In Progress
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterTab('upcoming')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilterTab === 'upcoming'
                    ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                Upcoming
              </button>

              <button
                type="button"
                onClick={() => setActiveFilterTab('completed')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilterTab === 'completed'
                    ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40'
                    : 'text-gray-400 hover:text-white bg-white/5'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Sorter Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="hidden sm:inline">Order Priority:</span>
              <div className="flex items-center gap-1 text-white font-semibold cursor-pointer">
                <span>Nearest Drop-off First</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Delivery Cards Roster */}
          <div className="space-y-3.5">
            {filteredDeliveries.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#0B1022] border border-white/10 space-y-2">
                <Package className="w-10 h-10 text-gray-500 mx-auto" />
                <h3 className="font-bold text-white text-sm">No Parcels in this view</h3>
                <p className="text-xs text-gray-400">All current parcels are accounted for.</p>
              </div>
            ) : (
              filteredDeliveries.map((delivery, index) => {
                const isFirstActive = index === 0 && delivery.status !== 'Delivered';

                return (
                  <div
                    key={delivery.id}
                    className={`rounded-2xl p-4 sm:p-5 transition-all bg-[#0B1022] border ${
                      isFirstActive
                        ? 'border-[#00F2FE]/60 shadow-[0_0_25px_rgba(0,242,254,0.15)] ring-1 ring-[#00F2FE]/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Row: Order ID, Status, and Scheduled Time */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#00F2FE] text-xs sm:text-sm">
                          {delivery.orderNumber || `#${delivery.id}`}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            delivery.status === 'Delivered'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : delivery.status === 'Assigned'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{delivery.time || delivery.eta || '12:40 PM'}</span>
                      </div>
                    </div>

                    {/* Middle: Product Thumbnail & Customer Delivery Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-4 items-center">
                      {/* Product Thumbnail & Name (5 Cols) */}
                      <div className="sm:col-span-5 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#050816] border border-white/10 p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={delivery.productImage || '/images/products/rolex-submariner.png'}
                            alt={delivery.productName}
                            className="w-full h-full object-contain filter drop-shadow-md"
                            onError={(e) => {
                              e.target.src = '/images/products/rolex-submariner.png';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                            {delivery.productName}
                          </h4>
                          <p className="text-xs text-[#F59E0B] font-bold mt-0.5">
                            {delivery.amount}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            Customer: <strong className="text-gray-200">{delivery.customer}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Delivery Address & Distance (7 Cols) */}
                      <div className="sm:col-span-7 space-y-1.5 text-xs text-gray-300">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-relaxed">{delivery.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-0.5">
                          <div className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-cyan-400" />
                            <span>{delivery.distance}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20 font-semibold text-[10px]">
                            Secured Luxury Transit
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions: Call Customer & Enter Delivery OTP */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2.5">
                      <a
                        href={`tel:${delivery.customerPhone}`}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call</span>
                      </a>

                      {delivery.status !== 'Delivered' ? (
                        <button
                          type="button"
                          onClick={() => onOpenOtpModal && onOpenOtpModal(delivery)}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#00D9E8] hover:brightness-110 text-[#050816] font-black text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Enter Delivery OTP</span>
                        </button>
                      ) : (
                        <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live Map + Performance Gauge + Quick Actions (Span 1) */}
        <div className="space-y-4">
          {/* 1. Live Delivery Map Card */}
          <div className="rounded-3xl bg-[#0B1022] border border-white/10 p-5 space-y-3.5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Live Delivery Map</span>
              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('history')}
                className="text-[11px] text-[#00F2FE] hover:underline font-bold flex items-center gap-1"
              >
                <span>View Full Map</span>
                <span>→</span>
              </button>
            </div>

            {/* Stylized Visual Map Route Canvas */}
            <div className="relative h-44 rounded-2xl bg-[#050816] border border-white/10 overflow-hidden flex items-center justify-center">
              {/* Subtle Map Grid lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #28334B 1px, transparent 1px), linear-gradient(to bottom, #28334B 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Glowing Route SVG Vector */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160">
                <path
                  d="M 50 110 Q 120 70 170 95 T 260 40"
                  fill="none"
                  stroke="#00F2FE"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_8px_#00F2FE]"
                />
              </svg>

              {/* Rider Bike Marker on Map */}
              <div className="absolute left-[38px] top-[95px] w-8 h-8 rounded-full bg-[#00F2FE] border-2 border-white flex items-center justify-center text-black shadow-[0_0_15px_#00F2FE] animate-pulse">
                <Bike className="w-4 h-4" />
              </div>

              {/* Destination Drop Pin */}
              <div className="absolute right-[35px] top-[25px] w-8 h-8 rounded-full bg-[#F59E0B] border-2 border-white flex items-center justify-center text-black shadow-[0_0_15px_#F59E0B]">
                <MapPin className="w-4 h-4 fill-black" />
              </div>

              {/* Map Info Overlay Pill */}
              <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-[#070B18]/90 border border-white/15 backdrop-blur-md text-right">
                <span className="block text-[10px] text-gray-400 font-semibold">Next Drop-off</span>
                <span className="block text-xs font-black text-white">5.1 km • 12 mins</span>
              </div>
            </div>
          </div>

          {/* 2. Today's Performance Card */}
          <div className="rounded-3xl bg-[#0B1022] border border-white/10 p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-white">Today's Performance</h3>

            <div className="flex items-center gap-5">
              {/* Circular Neon Gauge (100% On-Time) */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Neon Glow Track (100%) */}
                  <path
                    className="text-[#10B981]"
                    strokeDasharray="100, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-white">100%</span>
                  <span className="text-[9px] text-[#10B981] font-bold">On-Time</span>
                </div>
              </div>

              {/* Performance Metrics List */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>12 Completed</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>0 Delayed</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.8 / 5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Quick Actions Card */}
          <div className="rounded-3xl bg-[#0B1022] border border-white/10 p-5 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-white">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onOpenIssueModal && onOpenIssueModal()}
                className="p-3 rounded-2xl bg-[#050816] hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
              >
                <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-gray-200">Call Support</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('history')}
                className="p-3 rounded-2xl bg-[#050816] hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-gray-200">Open Map</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('support')}
                className="p-3 rounded-2xl bg-[#050816] hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-gray-200">Delivery Guide</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('support')}
                className="p-3 rounded-2xl bg-[#050816] hover:bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer group"
              >
                <HelpCircle className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-gray-200">Help &amp; FAQ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
