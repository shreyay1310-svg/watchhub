import React, { useState } from 'react';
import {
  Boxes,
  Box,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Calendar,
  Filter,
  Plus,
  ArrowRightLeft,
  Building2,
  FileSpreadsheet,
  Download,
  Upload,
  Eye,
  SlidersHorizontal,
  Bell,
  Clock,
  Sparkles,
  BarChart3,
  History,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function DashboardModule({
  products,
  warehouses,
  movements,
  adjustments,
  purchaseRequests,
  onNavigateTab,
  onQuickStockAction,
}) {
  const [movementPeriod, setMovementPeriod] = useState('7d');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState('All');

  // Compute live metrics
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.totalQty || 0), 0);
  const totalValuation = products.reduce((acc, p) => acc + (p.totalQty || 0) * (p.unitCost || 0), 0);
  const lowStockCount = products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter((p) => p.status === 'Out of Stock' || p.availableQty === 0).length;
  const pendingPRs = purchaseRequests.filter((pr) => pr.status === 'Submitted' || pr.status === 'Under Review').length;

  // Chart data
  const movementTrendData = [
    { day: 'Mon', stockIn: 45, stockOut: 28 },
    { day: 'Tue', stockIn: 62, stockOut: 35 },
    { day: 'Wed', stockIn: 88, stockOut: 54 },
    { day: 'Thu', stockIn: 40, stockOut: 62 },
    { day: 'Fri', stockIn: 110, stockOut: 75 },
    { day: 'Sat', stockIn: 95, stockOut: 85 },
    { day: 'Sun', stockIn: 70, stockOut: 40 },
  ];

  const stockOverviewData = [
    { name: 'In Stock', value: products.filter((p) => p.status === 'In Stock').length, color: '#10B981' },
    { name: 'Low Stock', value: lowStockCount, color: '#F59E0B' },
    { name: 'Out of Stock', value: outOfStockCount, color: '#EF4444' },
  ];

  // Category distribution
  const categoryMap = {};
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + (p.totalQty || 0);
  });
  const categoryData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    units: categoryMap[cat],
  }));

  // Low stock products for alerts card
  const lowStockProducts = products
    .filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock' || p.availableQty <= p.reorderLevel)
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return '₹' + Number(amount).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#11123D] via-[#17165A] to-[#11123D] border border-[#29305D] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#6500FF]/15 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/50">
                Live Horology Operations
              </span>
              <span className="text-[11px] text-[#A7B1C2]">• Central Vault Sync Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Welcome, <span className="text-[#E9B94F]">Inventory Manager</span>
            </h1>
            <p className="text-xs md:text-sm text-[#A7B1C2] mt-1 max-w-2xl">
              Monitor real-time vault allocations, multi-warehouse stock balances, restock thresholds, and automated purchase requests across all luxury boutiques.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('stock', { openAddModal: true })}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#6500FF]/25 border border-white/10 transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => onNavigateTab('movements')}
              className="px-3.5 py-2.5 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#E9B94F] font-bold text-xs flex items-center gap-2 border border-[#E9B94F]/40 transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Stock Movements</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Products */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-[#6500FF] transition-all">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold">Total Products</span>
            <div className="w-7 h-7 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{totalProducts}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+3 new SKUs this month</span>
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-[#6500FF] transition-all">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold">Total Stock Units</span>
            <div className="w-7 h-7 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{totalStockUnits.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Across 4 Vaults</span>
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-[#6500FF] transition-all">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold">Inventory Value</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <p className="text-lg font-black text-white truncate" title={formatCurrency(totalValuation)}>
            ₹{(totalValuation / 10000000).toFixed(2)} Cr
          </p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Audited asset value</span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => onNavigateTab('reorder')}
          className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold group-hover:text-amber-300">Low Stock</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-amber-400">{lowStockCount}</p>
          <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-1">
            <span>Needs attention</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Out of Stock Items */}
        <div
          onClick={() => onNavigateTab('reorder')}
          className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-rose-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold group-hover:text-rose-300">Out of Stock</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-rose-400">{outOfStockCount}</p>
          <div className="flex items-center gap-1 text-[10px] text-rose-300 font-semibold mt-1">
            <span>Critical reorders</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pending Purchase Requests */}
        <div
          onClick={() => onNavigateTab('requests')}
          className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-[#00D5FF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold group-hover:text-[#00D5FF]">Pending PRs</span>
            <div className="w-7 h-7 rounded-lg bg-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#00D5FF]">{pendingPRs}</p>
          <div className="flex items-center gap-1 text-[10px] text-[#00D5FF] font-semibold mt-1">
            <span>Awaiting dispatch</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Stock Movement Trends */}
        <div className="lg:col-span-2 bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#6500FF]" />
                <span>Stock Movement Trends</span>
              </h3>
              <p className="text-[11px] text-[#A7B1C2]">Daily Stock In vs Stock Out velocity</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-[#A7B1C2]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Inbound
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#A7B1C2]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6500FF]" /> Outbound
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={movementTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6500FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6500FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#A7B1C2" fontSize={11} tickLine={false} />
                <YAxis stroke="#A7B1C2" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17165A',
                    borderColor: '#29305D',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="stockIn" name="Stock In" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="stockOut" name="Stock Out" stroke="#6500FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Stock Health Overview (Pie Chart) */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E9B94F]" />
                <span>Stock Health Overview</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#17165A] text-[#00D5FF] border border-[#29305D]">
                Audit Compliant
              </span>
            </div>
            <p className="text-[11px] text-[#A7B1C2] mb-3">Breakdown of inventory catalog readiness</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockOverviewData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stockOverviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#17165A',
                      borderColor: '#29305D',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#29305D]/60 text-xs">
            {stockOverviewData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#A7B1C2]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{item.value} SKUs</span>
                  <span className="text-[10px] text-[#A7B1C2]">
                    ({((item.value / totalProducts) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Category & Warehouse Distribution + Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Stock by Category</h3>
            <span className="text-[10px] text-[#A7B1C2]">Units</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 10, left: 15, bottom: 0 }}>
                <XAxis type="number" stroke="#A7B1C2" fontSize={10} hide />
                <YAxis dataKey="name" type="category" stroke="#A7B1C2" fontSize={10} width={80} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17165A',
                    borderColor: '#29305D',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="units" fill="#6500FF" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Network Distribution */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00D5FF]" />
              <span>Warehouse Capacities</span>
            </h3>
            <button
              onClick={() => onNavigateTab('warehouses')}
              className="text-[11px] text-[#E9B94F] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {warehouses.map((wh) => {
              const utilPercent = Math.round((wh.currentUnits / wh.capacityUnits) * 100);
              return (
                <div key={wh.id} className="p-2.5 rounded-xl bg-[#17165A]/40 border border-[#29305D]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{wh.name}</span>
                    <span className="font-mono text-[#00D5FF] font-semibold">{utilPercent}%</span>
                  </div>
                  <div className="w-full bg-[#11123D] h-2 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-[#6500FF] to-[#00D5FF] rounded-full transition-all duration-500"
                      style={{ width: `${utilPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#A7B1C2]">
                    <span>{wh.currentUnits.toLocaleString()} units</span>
                    <span>Cap: {wh.capacityUnits.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Velocity: Fast vs Slow Movers */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E9B94F]" />
              <span>Stock Velocity</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#17165A] text-[#E9B94F] border border-[#29305D]">
              30-Day Index
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Fast Moving Timepieces
            </div>
            {products
              .filter((p) => p.velocity === 'Fast Moving')
              .slice(0, 2)
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-[#17165A]/30 border border-[#29305D]/50">
                  <div className="flex items-center gap-2 truncate">
                    <img src={p.image} alt={p.name} className="w-7 h-7 rounded-lg object-contain bg-black/40 border border-white/10" />
                    <div className="truncate">
                      <p className="font-semibold text-white truncate text-[11px]">{p.name}</p>
                      <p className="text-[10px] text-[#A7B1C2]">{p.brand} • {p.availableQty} units left</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold shrink-0">
                    High Demand
                  </span>
                </div>
              ))}

            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <Clock className="w-3.5 h-3.5" /> Slow Moving Timepieces
            </div>
            {products
              .filter((p) => p.velocity === 'Slow Moving')
              .slice(0, 2)
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-[#17165A]/30 border border-[#29305D]/50">
                  <div className="flex items-center gap-2 truncate">
                    <img src={p.image} alt={p.name} className="w-7 h-7 rounded-lg object-contain bg-black/40 border border-white/10" />
                    <div className="truncate">
                      <p className="font-semibold text-white truncate text-[11px]">{p.name}</p>
                      <p className="text-[10px] text-[#A7B1C2]">{p.brand} • {p.availableQty} units in vault</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold shrink-0">
                    &gt;45 days hold
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Two Tables: Recent Movements + Low Stock Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stock Movements */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#6500FF]" />
                <span>Recent Stock Movements</span>
              </h3>
              <p className="text-[11px] text-[#A7B1C2]">Real-time ledger updates</p>
            </div>
            <button
              onClick={() => onNavigateTab('movements')}
              className="text-xs text-[#E9B94F] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#29305D] text-[#A7B1C2] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5">ID</th>
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29305D]/50">
                {movements.slice(0, 5).map((m) => (
                  <tr key={m.id} className="hover:bg-[#17165A]/40 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] text-[#00D5FF]">{m.id}</td>
                    <td className="py-2.5">
                      <p className="font-semibold text-white truncate max-w-[160px]">{m.productName}</p>
                      <p className="text-[10px] text-[#A7B1C2]">{m.date} • {m.time}</p>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.type === 'Stock In'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : m.type === 'Stock Out' || m.type === 'Customer Sale'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white font-mono">
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Action Center */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Low Stock Critical Alerts</span>
              </h3>
              <p className="text-[11px] text-[#A7B1C2]">Threshold breached — immediate reorder recommended</p>
            </div>
            <button
              onClick={() => onNavigateTab('reorder')}
              className="text-xs text-[#E9B94F] hover:underline font-semibold flex items-center gap-1"
            >
              <span>All Alerts ({lowStockCount + outOfStockCount})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#17165A]/40 border border-[#29305D] hover:border-[#6500FF] transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-contain bg-black/40 border border-white/10 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-white text-xs truncate max-w-[180px]">{p.name}</h4>
                    <p className="text-[11px] text-[#A7B1C2]">
                      Available: <strong className="text-amber-400">{p.availableQty} units</strong> (Min: {p.minStock})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      p.status === 'Out of Stock'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {p.status}
                  </span>
                  <button
                    onClick={() =>
                      onNavigateTab('requests', {
                        openNewModal: true,
                        prefillProduct: p,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Reorder</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
