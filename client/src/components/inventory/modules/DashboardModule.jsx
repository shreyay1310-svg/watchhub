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
  DollarSign,
  PackagePlus,
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
  products = [],
  warehouses = [],
  movements = [],
  adjustments = [],
  purchaseRequests = [],
  onNavigateTab = () => {},
  onQuickStockAction = () => {},
}) {
  const [activityTab, setActivityTab] = useState('movements'); // movements, adjustments, requests, alerts

  const safeProducts = Array.isArray(products) ? products : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safeMovements = Array.isArray(movements) ? movements : [];
  const safeAdjustments = Array.isArray(adjustments) ? adjustments : [];
  const safePurchaseRequests = Array.isArray(purchaseRequests) ? purchaseRequests : [];

  // Compute live metrics
  const totalProducts = safeProducts.length;
  const totalStockUnits = safeProducts.reduce((acc, p) => acc + (p?.totalQty || 0), 0);
  const totalValuation = safeProducts.reduce((acc, p) => acc + (p?.totalQty || 0) * (p?.unitCost || 0), 0);
  const lowStockCount = safeProducts.filter((p) => p?.status === 'Low Stock').length;
  const outOfStockCount = safeProducts.filter((p) => p?.status === 'Out of Stock' || (p?.availableQty || 0) === 0).length;
  const pendingPRs = safePurchaseRequests.filter((pr) => pr?.status === 'Submitted' || pr?.status === 'Under Review').length;

  // Monthly Stock In vs Stock Out chart data
  const monthlyInOutData = [
    { month: 'Jun', stockIn: 420, stockOut: 310 },
    { month: 'Jul', stockIn: 510, stockOut: 390 },
    { month: 'Aug', stockIn: 680, stockOut: 450 },
    { month: 'Sep', stockIn: 590, stockOut: 520 },
    { month: 'Oct', stockIn: 840, stockOut: 610 },
    { month: 'Nov', stockIn: 980, stockOut: 720 },
  ];

  // Inventory Value Trend data (in ₹ Crores)
  const valuationTrendData = [
    { month: 'Jun', value: 6.85 },
    { month: 'Jul', value: 7.15 },
    { month: 'Aug', value: 7.40 },
    { month: 'Sep', value: 7.75 },
    { month: 'Oct', value: 8.10 },
    { month: 'Nov', value: 8.42 },
  ];

  // Category distribution
  const categoryMap = {};
  safeProducts.forEach((p) => {
    if (p?.category) {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + (p?.totalQty || 0);
    }
  });
  const categoryData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    units: categoryMap[cat],
  }));

  // Low stock products for alerts
  const lowStockProducts = safeProducts
    .filter((p) => p?.status === 'Low Stock' || p?.status === 'Out of Stock' || (p?.availableQty || 0) <= (p?.reorderLevel || 10))
    .slice(0, 6);

  const formatCurrency = (amount) => {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
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
                Horology Operations Center
              </span>
              <span className="text-[11px] text-[#A7B1C2]">• 4 Secured Swiss Vaults Synced</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Welcome Back, <span className="text-[#E9B94F]">Inventory Manager!</span>
            </h1>
            <p className="text-xs md:text-sm text-[#A7B1C2] mt-1 max-w-2xl">
              Monitor multi-warehouse luxury timepiece reserves, real-time stock velocity, safety buffers, and factory purchase requests.
            </p>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('stock')}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#6500FF]/25 border border-white/10 transition-all cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add New Stock</span>
            </button>
            <button
              onClick={() => onNavigateTab('adjustments')}
              className="px-3.5 py-2.5 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#E9B94F] font-bold text-xs flex items-center gap-1.5 border border-[#E9B94F]/40 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Stock Adjustment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 6 Required KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Total Products */}
        <div
          onClick={() => onNavigateTab('stock')}
          className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-[#6500FF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold group-hover:text-white">Total Products</span>
            <div className="w-7 h-7 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
              <Box className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{totalProducts} SKUs</p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Active Master Catalog</span>
          </div>
        </div>

        {/* 2. Total Stock Units */}
        <div
          onClick={() => onNavigateTab('overview')}
          className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-[#6500FF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold group-hover:text-white">Total Stock Units</span>
            <div className="w-7 h-7 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{Number(totalStockUnits || 0).toLocaleString('en-IN')}</p>
          <div className="flex items-center gap-1 text-[10px] text-[#00D5FF] font-semibold mt-1">
            <span>Across 4 Vaults</span>
          </div>
        </div>

        {/* 3. Total Inventory Value */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold group-hover:text-white">Total Inventory Value</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <p className="text-lg font-black text-white truncate" title={formatCurrency(totalValuation)}>
            ₹{(totalValuation / 10000000).toFixed(2)} Cr
          </p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Certified Valuation</span>
          </div>
        </div>

        {/* 4. Low Stock Items */}
        <div
          onClick={() => onNavigateTab('reorder')}
          className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#A7B1C2] mb-2">
            <span className="text-[11px] font-semibold group-hover:text-amber-300">Low Stock Items</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-amber-400">{lowStockCount}</p>
          <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-1">
            <span>Needs Reorder</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 5. Out of Stock Items */}
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
            <span>0 Available</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* 6. Pending Purchase Requests */}
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
            <span>Factory Requisitions</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS STRIP */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#E9B94F] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Vault Quick Actions</span>
          </h3>
          <span className="text-[11px] text-[#A7B1C2]">Direct Operations Shortcuts</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <button
            onClick={() => onNavigateTab('stock')}
            className="p-3 rounded-xl bg-[#17165A] hover:bg-[#6500FF]/30 border border-[#29305D] text-left transition-all hover:border-[#6500FF] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#00D5FF] mb-1" />
            <p className="font-bold text-white text-xs">Add New Stock</p>
            <p className="text-[10px] text-[#A7B1C2]">Inbound PO entry</p>
          </button>

          <button
            onClick={() => onNavigateTab('adjustments')}
            className="p-3 rounded-xl bg-[#17165A] hover:bg-[#E9B94F]/20 border border-[#29305D] text-left transition-all hover:border-[#E9B94F] cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#E9B94F] mb-1" />
            <p className="font-bold text-white text-xs">Stock Adjustment</p>
            <p className="text-[10px] text-[#A7B1C2]">Cycle counts &amp; audit</p>
          </button>

          <button
            onClick={() => onNavigateTab('warehouses')}
            className="p-3 rounded-xl bg-[#17165A] hover:bg-[#00D5FF]/20 border border-[#29305D] text-left transition-all hover:border-[#00D5FF] cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#00D5FF] mb-1" />
            <p className="font-bold text-white text-xs">Transfer Stock</p>
            <p className="text-[10px] text-[#A7B1C2]">Inter-vault dispatch</p>
          </button>

          <button
            onClick={() => onNavigateTab('requests')}
            className="p-3 rounded-xl bg-[#17165A] hover:bg-[#8B00FF]/30 border border-[#29305D] text-left transition-all hover:border-[#8B00FF] cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#8B00FF] mb-1" />
            <p className="font-bold text-white text-xs">Purchase Request</p>
            <p className="text-[10px] text-[#A7B1C2]">Factory replenishment</p>
          </button>

          <button
            onClick={() => onNavigateTab('reports')}
            className="p-3 rounded-xl bg-[#17165A] hover:bg-emerald-500/20 border border-[#29305D] text-left transition-all hover:border-emerald-500 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400 mb-1" />
            <p className="font-bold text-white text-xs">Stock Reports</p>
            <p className="text-[10px] text-[#A7B1C2]">12 standard reports</p>
          </button>
        </div>
      </div>

      {/* 3. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Stock In vs Stock Out */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#6500FF]" />
                <span>Monthly Stock In vs Stock Out</span>
              </h3>
              <p className="text-[11px] text-[#A7B1C2]">Volume flow velocity comparison (6 months)</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-[#A7B1C2]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Stock In
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#A7B1C2]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6500FF]" /> Stock Out
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyInOutData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#A7B1C2" fontSize={11} tickLine={false} />
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
                <Bar dataKey="stockIn" name="Stock In" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#6500FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Inventory Value Trend */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00D5FF]" />
                <span>Inventory Value Trend</span>
              </h3>
              <p className="text-[11px] text-[#A7B1C2]">Appraised horological capital in vault (₹ Crores)</p>
            </div>
            <span className="text-xs font-bold text-[#E9B94F] bg-[#17165A] px-2.5 py-1 rounded-xl border border-[#29305D]">
              ₹8.42 Cr Current
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={valuationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashValTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D5FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A7B1C2" fontSize={11} tickLine={false} />
                <YAxis stroke="#A7B1C2" fontSize={11} tickLine={false} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17165A',
                    borderColor: '#29305D',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="value" name="Value (₹ Cr)" stroke="#00D5FF" strokeWidth={2.5} fillOpacity={1} fill="url(#dashValTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Category & Warehouse Distribution + Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category-wise Stock Distribution */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Box className="w-4 h-4 text-[#6500FF]" />
              <span>Category Stock Distribution</span>
            </h3>
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

        {/* Warehouse-wise Stock Distribution */}
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
              <span>Manage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {safeWarehouses.map((wh) => {
              const capacity = Number(wh.capacityUnits || wh.capacity || 5000);
              const current = Number(wh.currentUnits || 0);
              const utilPercent = Math.min(100, Math.round((current / (capacity || 1)) * 100));
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
                    <span>{Number(current || 0).toLocaleString('en-IN')} units</span>
                    <span>Cap: {Number(capacity || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fast Moving & Slow Moving Products */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E9B94F]" />
              <span>Velocity Analysis</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#17165A] text-[#E9B94F] border border-[#29305D]">
              Fast vs Slow
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Fast Moving Products
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
              <Clock className="w-3.5 h-3.5" /> Slow Moving Products
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
                      <p className="text-[10px] text-[#A7B1C2]">{p.brand} • {p.availableQty} in vault</p>
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

      {/* 5. Recent Activities Section (Recent Movements, Adjustments, Pending PRs, Low Stock Alerts) */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#29305D]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#00D5FF]" />
              <span>Recent Operations &amp; Activities</span>
            </h3>
            <p className="text-[11px] text-[#A7B1C2]">Real-time operational stream across all luxury boutiques</p>
          </div>

          {/* Switcher */}
          <div className="bg-[#17165A] p-1 rounded-xl border border-[#29305D] flex items-center text-xs">
            <button
              onClick={() => setActivityTab('movements')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activityTab === 'movements' ? 'bg-[#6500FF] text-white shadow-xs' : 'text-[#A7B1C2] hover:text-white'
              }`}
            >
              Stock Movements ({movements.length})
            </button>
            <button
              onClick={() => setActivityTab('adjustments')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activityTab === 'adjustments' ? 'bg-[#6500FF] text-white shadow-xs' : 'text-[#A7B1C2] hover:text-white'
              }`}
            >
              Adjustments ({adjustments.length})
            </button>
            <button
              onClick={() => setActivityTab('requests')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activityTab === 'requests' ? 'bg-[#6500FF] text-white shadow-xs' : 'text-[#A7B1C2] hover:text-white'
              }`}
            >
              Purchase Requests ({purchaseRequests.length})
            </button>
            <button
              onClick={() => setActivityTab('alerts')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activityTab === 'alerts' ? 'bg-[#6500FF] text-white shadow-xs' : 'text-[#A7B1C2] hover:text-white'
              }`}
            >
              Low Stock Alerts ({lowStockCount + outOfStockCount})
            </button>
          </div>
        </div>

        {/* Tab 1: Movements */}
        {activityTab === 'movements' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#29305D] text-[#A7B1C2] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5">ID</th>
                  <th className="py-2.5">Time</th>
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5 text-right">Quantity</th>
                  <th className="py-2.5">Locations</th>
                  <th className="py-2.5">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29305D]/50">
                {movements.slice(0, 5).map((m) => (
                  <tr key={m.id} className="hover:bg-[#17165A]/40 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] text-[#00D5FF]">{m.id}</td>
                    <td className="py-2.5 text-gray-300">{m.date} • {m.time}</td>
                    <td className="py-2.5">
                      <p className="font-semibold text-white">{m.productName}</p>
                      <p className="text-[10px] text-[#A7B1C2] font-mono">{m.sku}</p>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#17165A] text-white border border-[#29305D]">
                        {m.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold">
                      <span className={m.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#A7B1C2]">
                      {m.fromLocation} → {m.toLocation}
                    </td>
                    <td className="py-2.5 text-gray-300 font-medium">{m.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Adjustments */}
        {activityTab === 'adjustments' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#29305D] text-[#A7B1C2] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5">ID</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5 text-center">Variance</th>
                  <th className="py-2.5">Reason</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29305D]/50">
                {adjustments.slice(0, 5).map((a) => (
                  <tr key={a.id} className="hover:bg-[#17165A]/40 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] text-[#00D5FF]">{a.id}</td>
                    <td className="py-2.5 text-gray-300">{a.date}</td>
                    <td className="py-2.5 font-bold text-white">{a.productName}</td>
                    <td className="py-2.5 text-center font-mono font-bold">
                      <span className={a.diff < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {a.diff > 0 ? `+${a.diff}` : a.diff}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-300">{a.reason}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#17165A] text-white">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Purchase Requests */}
        {activityTab === 'requests' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#29305D] text-[#A7B1C2] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5">PR #</th>
                  <th className="py-2.5">Supplier</th>
                  <th className="py-2.5">Destination</th>
                  <th className="py-2.5 text-right">Total Cost</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29305D]/50">
                {purchaseRequests.slice(0, 5).map((pr) => (
                  <tr key={pr.id} className="hover:bg-[#17165A]/40 transition-colors">
                    <td className="py-2.5 font-mono text-[11px] text-[#00D5FF]">{pr.id}</td>
                    <td className="py-2.5 font-semibold text-white">{pr.supplier}</td>
                    <td className="py-2.5 text-gray-300">{pr.destinationWarehouse}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#E9B94F]">
                      ₹{(pr.totalCost / 100000).toFixed(1)} Lakhs
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#17165A] text-emerald-400">
                        {pr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Low Stock Alerts */}
        {activityTab === 'alerts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-contain bg-black/40 border border-[#29305D]" />
                  <div>
                    <h5 className="font-bold text-white text-xs">{p.name}</h5>
                    <p className="text-[10px] text-amber-400">
                      Available: <strong>{p.availableQty} units</strong> (Min: {p.minStock})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('reorder')}
                  className="px-2.5 py-1 rounded-lg bg-[#6500FF] hover:bg-[#5700db] text-white font-bold text-[10px]"
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
