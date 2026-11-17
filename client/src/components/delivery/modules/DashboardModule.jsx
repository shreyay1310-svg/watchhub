import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  Truck,
  Package,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Compass,
  MapPin,
  Calendar,
  Plus,
  Eye,
  ChevronRight,
  Phone,
  ShieldCheck,
  Bike,
  Navigation,
  Sparkles,
} from 'lucide-react';

const waveDataTotal = [{ v: 30 }, { v: 45 }, { v: 35 }, { v: 60 }, { v: 55 }, { v: 80 }, { v: 72 }];
const waveDataOut = [{ v: 20 }, { v: 35 }, { v: 40 }, { v: 50 }, { v: 45 }, { v: 65 }, { v: 58 }];
const waveDataDelivered = [{ v: 50 }, { v: 65 }, { v: 75 }, { v: 90 }, { v: 85 }, { v: 110 }, { v: 125 }];
const waveDataAttempts = [{ v: 15 }, { v: 22 }, { v: 18 }, { v: 25 }, { v: 20 }, { v: 16 }, { v: 12 }];
const waveDataReturns = [{ v: 10 }, { v: 8 }, { v: 12 }, { v: 7 }, { v: 9 }, { v: 6 }, { v: 5 }];
const waveDataFailed = [{ v: 6 }, { v: 4 }, { v: 5 }, { v: 3 }, { v: 4 }, { v: 2 }, { v: 1 }];

export const DashboardModule = ({
  stats,
  statusBreakdown,
  orders,
  riders,
  couriers,
  setActiveTab,
  onOpenCreateShipment,
  onSelectOrderForTracking,
  onSelectOrderForDetail,
}) => {
  const availableRiders = riders.filter((r) => r.status === 'Available').length;
  const busyRiders = riders.filter((r) => r.status === 'On Delivery' || r.status === 'Busy').length;
  const offlineRiders = riders.filter((r) => r.status === 'Offline').length;

  return (
    <div className="space-y-6">
      {/* 1. TOP WELCOME & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#11172C] via-[#081529] to-[#11172C] border border-[#28334B] shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6500FF] to-[#8B00FF] flex items-center justify-center text-white shadow-lg shadow-[#6500FF]/30">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Welcome Back, Delivery Manager!
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/40">
                LIVE OPS ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#A7B1C2] mt-0.5">
              Real-time fleet tracking, priority watch dispatch and doorstep OTP verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('routes')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#28334B] text-xs font-semibold text-[#A7B1C2] hover:text-white transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>Plan Routes</span>
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

      {/* 2. SIX KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Shipments */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] hover:border-[#6500FF]/50 transition-all flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#A7B1C2]">Total Shipments</span>
            <div className="w-7 h-7 rounded-lg bg-[#6500FF]/15 text-[#00D5FF] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#00D5FF]" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {stats.totalShipments?.toLocaleString()}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-bold text-[#00C98B] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {stats.totalShipmentsTrend}
              </span>
              <span className="text-[10px] text-[#A7B1C2]">vs last week</span>
            </div>
          </div>
          <div className="w-full h-7 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveDataTotal}>
                <Area type="monotone" dataKey="v" stroke="#00D5FF" fill="#00D5FF" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Out for Delivery */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] hover:border-[#00D5FF]/50 transition-all flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#A7B1C2]">Out for Delivery</span>
            <div className="w-7 h-7 rounded-lg bg-[#00D5FF]/15 text-[#00D5FF] flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#00D5FF]" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {stats.outForDelivery?.toLocaleString()}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-bold text-[#00C98B] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {stats.outForDeliveryTrend}
              </span>
              <span className="text-[10px] text-[#A7B1C2]">active vans</span>
            </div>
          </div>
          <div className="w-full h-7 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveDataOut}>
                <Area type="monotone" dataKey="v" stroke="#00D5FF" fill="#00D5FF" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Delivered */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] hover:border-[#00C98B]/50 transition-all flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#A7B1C2]">Delivered</span>
            <div className="w-7 h-7 rounded-lg bg-[#00C98B]/15 text-[#00C98B] flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-[#00C98B]" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {stats.delivered?.toLocaleString()}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-bold text-[#00C98B] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {stats.deliveredTrend}
              </span>
              <span className="text-[10px] text-[#A7B1C2]">OTP confirmed</span>
            </div>
          </div>
          <div className="w-full h-7 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveDataDelivered}>
                <Area type="monotone" dataKey="v" stroke="#00C98B" fill="#00C98B" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Delivery Attempts */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] hover:border-[#E9B94F]/50 transition-all flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#A7B1C2]">Delivery Attempts</span>
            <div className="w-7 h-7 rounded-lg bg-[#E9B94F]/15 text-[#E9B94F] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#E9B94F]" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {stats.deliveryAttempts}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-bold text-[#00C98B] flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" />
                {stats.deliveryAttemptsTrend}
              </span>
              <span className="text-[10px] text-[#A7B1C2]">reduced delay</span>
            </div>
          </div>
          <div className="w-full h-7 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveDataAttempts}>
                <Area type="monotone" dataKey="v" stroke="#E9B94F" fill="#E9B94F" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 5: Returns / Pickups */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] hover:border-[#FFB020]/50 transition-all flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#A7B1C2]">Returns / Pickups</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFB020]/15 text-[#FFB020] flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-[#FFB020]" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {stats.returnsPickups}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-bold text-[#00C98B] flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" />
                {stats.returnsPickupsTrend}
              </span>
              <span className="text-[10px] text-[#A7B1C2]">in reverse hub</span>
            </div>
          </div>
          <div className="w-full h-7 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveDataReturns}>
                <Area type="monotone" dataKey="v" stroke="#FFB020" fill="#FFB020" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 6: Failed Deliveries */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] hover:border-[#FF4966]/50 transition-all flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#A7B1C2]">Failed Deliveries</span>
            <div className="w-7 h-7 rounded-lg bg-[#FF4966]/15 text-[#FF4966] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#FF4966]" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-[#FF4966]">
              {stats.failedDeliveries}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-bold text-[#00C98B] flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" />
                {stats.failedDeliveriesTrend}
              </span>
              <span className="text-[10px] text-[#A7B1C2]">reattempts queued</span>
            </div>
          </div>
          <div className="w-full h-7 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveDataFailed}>
                <Area type="monotone" dataKey="v" stroke="#FF4966" fill="#FF4966" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. MAIN ANALYTICS SECTION: A. Shipment Status Overview + B. Live Delivery Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Shipment Status Overview (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Shipment Status Overview
                </h3>
                <p className="text-xs text-[#A7B1C2]">
                  Real-time pipeline across all active courier routes
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6500FF]/20 text-[#00D5FF] border border-[#6500FF]/30">
                1,482 Active
              </span>
            </div>

            {/* Donut Chart with Centered Total */}
            <div className="relative h-44 flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {statusBreakdown.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#081529',
                      border: '1px solid #28334B',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white">1,482</span>
                <span className="text-[10px] text-[#A7B1C2] uppercase font-bold tracking-wider">
                  Shipments
                </span>
              </div>
            </div>

            {/* Status breakdown bars */}
            <div className="space-y-2 mt-3">
              {statusBreakdown.slice(0, 5).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#A7B1C2]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">{item.count}</span>
                    <span className="text-[11px] text-[#A7B1C2] w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="w-full mt-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#00D5FF] border border-[#28334B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View All Delivery Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* B. Live Delivery Map Simulation (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00C98B] animate-ping" />
                <h3 className="font-serif font-bold text-base text-white">
                  Live Fleet Radar & Route Map
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#00D5FF] font-semibold flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-[#00D5FF]" />
                  {busyRiders} Vans Active on Street
                </span>
              </div>
            </div>

            {/* Interactive Vector Map Canvas */}
            <div className="relative h-64 rounded-xl bg-[#081529] border border-[#28334B] overflow-hidden p-4 flex flex-col justify-between">
              {/* Grid Lines Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#28334B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              {/* Central Vault Hub */}
              <div className="absolute left-[38%] top-[42%] flex items-center gap-2 z-10">
                <div className="w-8 h-8 rounded-full bg-[#6500FF] border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-[#6500FF]/50 animate-pulse">
                  WH
                </div>
                <div className="bg-[#070918]/90 px-2 py-0.5 rounded-md border border-[#28334B] text-[10px] text-[#E9B94F] font-bold shadow-md">
                  Central Vault WH-01
                </div>
              </div>

              {/* Rider 1 Pin (Rohan Singh - South Delhi) */}
              <div className="absolute left-[28%] top-[25%] z-10 group cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#00D5FF] border-2 border-white flex items-center justify-center text-xs font-bold text-[#070918] shadow-md shadow-[#00D5FF]/50">
                  🛵
                </div>
                <div className="absolute left-8 -top-1 bg-[#081529] border border-[#00D5FF] px-2.5 py-1 rounded-lg text-[10px] text-white shadow-xl opacity-90 group-hover:opacity-100 whitespace-nowrap z-20">
                  <p className="font-bold text-[#00D5FF]">Rohan Singh (DL 01 EV 4821)</p>
                  <p className="text-[9px] text-[#A7B1C2]">Connaught Place • 14 deliveries</p>
                </div>
              </div>

              {/* Rider 2 Pin (Amit Kumar - Gurugram) */}
              <div className="absolute left-[58%] top-[65%] z-10 group cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#00C98B] border-2 border-white flex items-center justify-center text-xs font-bold text-[#070918] shadow-md shadow-[#00C98B]/50">
                  🚚
                </div>
                <div className="absolute left-8 -top-1 bg-[#081529] border border-[#00C98B] px-2.5 py-1 rounded-lg text-[10px] text-white shadow-xl opacity-90 group-hover:opacity-100 whitespace-nowrap z-20">
                  <p className="font-bold text-[#00C98B]">Amit Kumar (DLF-5 Van)</p>
                  <p className="text-[9px] text-[#A7B1C2]">Rolex Submariner • ETA 25 min</p>
                </div>
              </div>

              {/* Rider 3 Pin (Neha Sharma - Noida) */}
              <div className="absolute left-[78%] top-[30%] z-10 group cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#E9B94F] border-2 border-white flex items-center justify-center text-xs font-bold text-[#070918] shadow-md shadow-[#E9B94F]/50">
                  🛵
                </div>
                <div className="absolute -left-36 -top-1 bg-[#081529] border border-[#E9B94F] px-2.5 py-1 rounded-lg text-[10px] text-white shadow-xl opacity-90 group-hover:opacity-100 whitespace-nowrap z-20">
                  <p className="font-bold text-[#E9B94F]">Neha Sharma (Sector 62)</p>
                  <p className="text-[9px] text-[#A7B1C2]">Cartier Santos • 9 orders done</p>
                </div>
              </div>

              {/* Route connecting line simulation SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#00D5FF]/40 stroke-2 [stroke-dasharray:4_4]">
                <path d="M 280 120 Q 350 160 420 180 T 520 220" fill="none" />
              </svg>

              {/* Bottom Map Legend */}
              <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-2 bg-[#11172C]/90 backdrop-blur-md p-2 rounded-lg border border-[#28334B] text-[10.5px]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00D5FF]" />
                    On Route
                  </span>
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00C98B]" />
                    Doorstep ETA &lt;30m
                  </span>
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6500FF]" />
                    Central Vault
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="text-[#00D5FF] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Open Full Screen Tracking</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* D. Delivery Partners Fleet Status Bar */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#28334B]">
            <div className="text-center p-2 rounded-xl bg-[#081529] border border-[#28334B]">
              <span className="text-sm font-bold text-white block">{riders.length}</span>
              <span className="text-[10px] text-[#A7B1C2]">Total Fleet</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-[#081529] border border-[#28334B]">
              <span className="text-sm font-bold text-[#00C98B] block">{availableRiders}</span>
              <span className="text-[10px] text-[#A7B1C2]">Available</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-[#081529] border border-[#28334B]">
              <span className="text-sm font-bold text-[#00D5FF] block">{busyRiders}</span>
              <span className="text-[10px] text-[#A7B1C2]">On Delivery</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-[#081529] border border-[#28334B]">
              <span className="text-sm font-bold text-[#A7B1C2] block">{offlineRiders}</span>
              <span className="text-[10px] text-[#A7B1C2]">Offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S DELIVERY ORDERS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* C. Today's Delivery Orders (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Today's Delivery Orders
              </h3>
              <p className="text-xs text-[#A7B1C2]">
                Priority luxury timepieces scheduled for dispatch & delivery today
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-[#00D5FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#28334B] text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider">
                  <th className="pb-3 pl-1">Order & Watch</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Address & City</th>
                  <th className="pb-3">Rider / Partner</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">ETA</th>
                  <th className="pb-3 text-right pr-1">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#28334B] text-xs">
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => onSelectOrderForDetail(order)}
                  >
                    {/* Order & Product */}
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-10 h-10 rounded-lg object-contain bg-[#081529] border border-[#28334B] p-0.5 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">
                            {order.orderId}
                          </span>
                          <span className="text-[11px] text-[#A7B1C2] truncate max-w-[140px] block">
                            {order.productName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3">
                      <span className="font-bold text-white block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-[#A7B1C2]">
                        {order.mobileNumber}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="py-3">
                      <span className="text-white block font-medium">
                        {order.city}
                      </span>
                      <span className="text-[11px] text-[#A7B1C2] truncate max-w-[150px] block">
                        {order.deliveryAddress}
                      </span>
                    </td>

                    {/* Rider */}
                    <td className="py-3">
                      <span className="font-bold text-[#E9B94F] block">
                        {order.rider}
                      </span>
                      <span className="text-[11px] text-[#A7B1C2]">
                        {order.deliveryPartner}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                          order.deliveryStatus === 'Delivered'
                            ? 'bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/40'
                            : order.deliveryStatus === 'Out for Delivery'
                            ? 'bg-[#00D5FF]/20 text-[#00D5FF] border border-[#00D5FF]/40'
                            : order.deliveryStatus === 'Failed'
                            ? 'bg-[#FF4966]/20 text-[#FF4966] border border-[#FF4966]/40'
                            : order.deliveryStatus === 'In Transit'
                            ? 'bg-[#6500FF]/20 text-[#6500FF] border border-[#6500FF]/40'
                            : 'bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {order.deliveryStatus}
                      </span>
                    </td>

                    {/* ETA */}
                    <td className="py-3 text-[11px] text-[#A7B1C2]">
                      {order.eta}
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right pr-1" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectOrderForTracking(order)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#00D5FF] border border-[#28334B] transition-colors"
                          title="Track Live"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectOrderForDetail(order)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#28334B] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* E. Quick Actions Grid (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-white mb-1">
              Logistics Quick Actions
            </h3>
            <p className="text-xs text-[#A7B1C2] mb-4">
              Direct dispatch, fleet coordination & reverse logistics workflows
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Action 1: Assign Orders */}
              <button
                onClick={() => setActiveTab('assign')}
                className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#6500FF] transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-4 h-4 text-[#00D5FF]" />
                </div>
                <span className="font-bold text-xs text-white block">
                  Assign Orders
                </span>
                <span className="text-[10px] text-[#A7B1C2]">
                  2 Unassigned orders
                </span>
              </button>

              {/* Action 2: Track Shipment */}
              <button
                onClick={() => setActiveTab('tracking')}
                className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#00D5FF] transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-[#00D5FF]" />
                </div>
                <span className="font-bold text-xs text-white block">
                  Track Shipment
                </span>
                <span className="text-[10px] text-[#A7B1C2]">
                  By AWB or Mobile
                </span>
              </button>

              {/* Action 3: Manage Riders */}
              <button
                onClick={() => setActiveTab('partners')}
                className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#E9B94F] transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4 text-[#E9B94F]" />
                </div>
                <span className="font-bold text-xs text-white block">
                  Manage Fleet
                </span>
                <span className="text-[10px] text-[#A7B1C2]">
                  6 Riders online
                </span>
              </button>

              {/* Action 4: Plan Routes */}
              <button
                onClick={() => setActiveTab('routes')}
                className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#8B00FF] transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#8B00FF]/20 text-[#8B00FF] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Compass className="w-4 h-4 text-[#8B00FF]" />
                </div>
                <span className="font-bold text-xs text-white block">
                  Plan Routes
                </span>
                <span className="text-[10px] text-[#A7B1C2]">
                  Sequence multi-stops
                </span>
              </button>

              {/* Action 5: Create Shipment */}
              <button
                onClick={onOpenCreateShipment}
                className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#00C98B] transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00C98B]/20 text-[#00C98B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4 text-[#00C98B]" />
                </div>
                <span className="font-bold text-xs text-white block">
                  Create Shipment
                </span>
                <span className="text-[10px] text-[#A7B1C2]">
                  Generate label & AWB
                </span>
              </button>

              {/* Action 6: Handle Returns */}
              <button
                onClick={() => setActiveTab('returns')}
                className="p-3.5 rounded-xl bg-[#081529] border border-[#28334B] hover:border-[#FFB020] transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FFB020]/20 text-[#FFB020] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-4 h-4 text-[#FFB020]" />
                </div>
                <span className="font-bold text-xs text-white block">
                  Handle Returns
                </span>
                <span className="text-[10px] text-[#A7B1C2]">
                  3 Pending pickups
                </span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-[#6500FF]/15 to-[#00D5FF]/10 border border-[#6500FF]/30 mt-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-[#00C98B]" />
              <span>WatchHub Insurance Guarantee</span>
            </div>
            <p className="text-[11px] text-[#A7B1C2] leading-relaxed">
              Every package is transit-insured up to ₹5,00,000 with mandatory biometric or SMS OTP confirmation upon handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
