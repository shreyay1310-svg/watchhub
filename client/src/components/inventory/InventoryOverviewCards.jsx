import React from 'react';
import {
  Box,
  Boxes,
  AlertTriangle,
  TrendingUp,
  ArrowRightLeft,
  Building2,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  STOCK_MOVEMENT_CHART_DATA,
  STOCK_OVERVIEW_DATA,
} from '../../data/inventoryDashboardData';

export default function InventoryOverviewCards({
  onOpenWarehousesModal = () => {},
}) {
  return (
    <>
      {/* 2. FIVE KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Stock Units */}
        <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 15 Q 15 18, 30 10 T 60 5" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">Total Stock Units</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-white">12,840</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                ↑ +12%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: In-Stock Products */}
        <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 16 Q 15 14, 30 8 T 60 4" fill="none" stroke="#39F5A5" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">In-Stock Products</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-white">298</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                ↑ +10%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Items */}
        <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 6 Q 15 8, 30 14 T 60 18" fill="none" stroke="#FF4567" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">Low Stock Items</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-white">18</span>
              <span className="text-[11px] font-bold text-red-400 flex items-center">
                ↓ -22%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl hover:border-red-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center text-[10px] font-black">
                !
              </div>
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 8 Q 15 10, 30 15 T 60 17" fill="none" stroke="#FF4567" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">Out of Stock</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-white">10</span>
              <span className="text-[11px] font-bold text-red-400 flex items-center">
                ↓ -9%
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Total Stock Value */}
        <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black">
              ₹
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 15 Q 15 12, 30 7 T 60 3" fill="none" stroke="#00CFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">Total Stock Value</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-black text-white truncate">₹8,42,90,000</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center shrink-0">
                ↑ +15%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ANALYTICS ROW (3 CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel A: Stock Status Overview Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-[#10182D]/90 backdrop-blur-md rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-white">Stock Status Overview</h3>
            <span className="text-[11px] text-cyan-400 font-mono font-semibold">Real-time</span>
          </div>

          <div className="flex items-center justify-between py-2">
            {/* Donut Chart with 320 Products in Center */}
            <div className="relative w-36 h-36 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STOCK_OVERVIEW_DATA}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {STOCK_OVERVIEW_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-white leading-none">320</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  Products
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#39F5A5] shrink-0" />
                  <span className="text-gray-300 text-[11px] font-medium">In Stock (298)</span>
                </div>
                <span className="font-bold text-white text-[11px]">93.1%</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F4B942] shrink-0" />
                  <span className="text-gray-300 text-[11px] font-medium">Low Stock (18)</span>
                </div>
                <span className="font-bold text-white text-[11px]">5.6%</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_#FF4567] shrink-0" />
                  <span className="text-gray-300 text-[11px] font-medium">Out of Stock (10)</span>
                </div>
                <span className="font-bold text-white text-[11px]">3.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel B: Stock Movement Area Chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#10182D]/90 backdrop-blur-md rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-sm text-white">Stock Movement</h3>
              <span className="text-[11px] text-gray-400 font-medium">(Last 30 Days)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#39F5A5]" />
                <span className="text-gray-300">Stock In</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#A855F7]" />
                <span className="text-gray-300">Stock Out</span>
              </div>
            </div>
          </div>

          <div className="h-40 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STOCK_MOVEMENT_CHART_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="invGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39F5A5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#39F5A5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="invPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} ticks={[0, 250, 500, 750, 1000]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1022',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '11px',
                    boxShadow: '0 0 15px rgba(0, 207, 255, 0.2)',
                  }}
                />
                <Area type="monotone" dataKey="stockIn" stroke="#39F5A5" strokeWidth={2.5} fillOpacity={1} fill="url(#invGreen)" />
                <Area type="monotone" dataKey="stockOut" stroke="#A855F7" strokeWidth={2.5} fillOpacity={1} fill="url(#invPurple)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel C: Warehouse Stock Summary (3 cols) */}
        <div className="lg:col-span-3 bg-[#10182D]/90 backdrop-blur-md rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-white">Warehouse Stock Summary</h3>
            <button
              type="button"
              onClick={() => setShowWarehousesModal(true)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Main Warehouse */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-white">Main Warehouse</span>
                </div>
                <span className="font-black text-emerald-400">68%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Gurugram Central Vault</span>
                <span className="font-semibold text-gray-200">8,420 Units</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full shadow-[0_0_8px_#39F5A5]" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Delhi Warehouse */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold text-white">Delhi Warehouse</span>
                </div>
                <span className="font-black text-purple-400">21%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>Okhla Phase III Hub</span>
                <span className="font-semibold text-gray-200">2,640 Units</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full shadow-[0_0_8px_#A855F7]" style={{ width: '21%' }} />
              </div>
            </div>

            {/* Mumbai Warehouse */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-white">Mumbai Warehouse</span>
                </div>
                <span className="font-black text-amber-400">11%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>BKC Logistics Park</span>
                <span className="font-semibold text-gray-200">1,780 Units</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full shadow-[0_0_8px_#F4B942]" style={{ width: '11%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
