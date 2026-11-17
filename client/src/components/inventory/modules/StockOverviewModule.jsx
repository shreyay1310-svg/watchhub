import React, { useState, useMemo } from 'react';
import {
  PieChart,
  BarChart3,
  Building2,
  Box,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  X,
  Filter,
  Search,
  Download,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function StockOverviewModule({ products, warehouses, onNavigateTab }) {
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Unique filter lists
  const brands = useMemo(() => ['All', ...new Set(products.map((p) => p.brand))], [products]);
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products]);
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchWh = selectedWarehouse === 'All' || p.warehouse === selectedWarehouse || p.warehouseId === selectedWarehouse;
      const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStat = selectedStatus === 'All' || p.status === selectedStatus;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchWh && matchBrand && matchCat && matchStat && matchSearch;
    });
  }, [products, selectedWarehouse, selectedBrand, selectedCategory, selectedStatus, searchQuery]);

  // Aggregate numbers
  const totalStock = filteredProducts.reduce((sum, p) => sum + (p.totalQty || 0), 0);
  const availableStock = filteredProducts.reduce((sum, p) => sum + (p.availableQty || 0), 0);
  const reservedStock = filteredProducts.reduce((sum, p) => sum + (p.reservedQty || 0), 0);
  const damagedStock = filteredProducts.reduce((sum, p) => sum + (p.damagedQty || 0), 0);
  const lowStockCount = filteredProducts.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = filteredProducts.filter((p) => p.status === 'Out of Stock' || p.availableQty === 0).length;
  const totalValuation = filteredProducts.reduce((sum, p) => sum + (p.totalQty || 0) * (p.unitCost || 0), 0);

  // Category Distribution
  const categoryChartData = useMemo(() => {
    const counts = {};
    filteredProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + (p.totalQty || 0);
    });
    return Object.keys(counts).map((cat) => ({
      name: cat,
      units: counts[cat],
    }));
  }, [filteredProducts]);

  // Brand Distribution
  const brandChartData = useMemo(() => {
    const counts = {};
    filteredProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + (p.totalQty || 0);
    });
    return Object.keys(counts).map((b) => ({
      name: b,
      units: counts[b],
    }));
  }, [filteredProducts]);

  const COLORS = ['#6500FF', '#00D5FF', '#E9B94F', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'];

  const resetFilters = () => {
    setSelectedWarehouse('All');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Visual Analytics
            </span>
            <span className="text-xs text-[#A7B1C2]">• High Precision Valuation</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Stock Overview Analytics</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Holistic breakdown of inventory availability, safety buffers, warehouse allocations, and capital valuation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('stock')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Box className="w-4 h-4" />
            <span>Open Inventory Master</span>
          </button>
        </div>
      </div>

      {/* 2. Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Total Stock</span>
            <div className="w-7 h-7 rounded-lg bg-[#6500FF]/20 text-[#6500FF] flex items-center justify-center">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-white">{totalStock.toLocaleString()}</p>
          <p className="text-[10px] text-[#A7B1C2] mt-1">Across all vaults</p>
        </div>

        {/* Available Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Available</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-400">{availableStock.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400/80 mt-1">Ready for fulfillment</p>
        </div>

        {/* Reserved Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Reserved</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-[#00D5FF] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-[#00D5FF]">{reservedStock.toLocaleString()}</p>
          <p className="text-[10px] text-[#00D5FF]/80 mt-1">Boutique & VIP holds</p>
        </div>

        {/* Damaged Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Damaged</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-rose-400">{damagedStock.toLocaleString()}</p>
          <p className="text-[10px] text-rose-400/80 mt-1">Quarantine for atelier</p>
        </div>

        {/* Low Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Low Stock</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-amber-400">{lowStockCount}</p>
          <p className="text-[10px] text-amber-400/80 mt-1">Below safety margin</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Out of Stock</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-red-500">{outOfStockCount}</p>
          <p className="text-[10px] text-red-400/80 mt-1">Depleted SKUs</p>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, brand, SKU..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          {/* Warehouse Filter */}
          <div className="min-w-[140px]">
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              <option value="All">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.name}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="min-w-[130px]">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  Brand: {b}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="min-w-[140px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[130px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={resetFilters}
            className="p-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white border border-[#29305D] transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Visual Distribution Charts: Category & Brand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#6500FF]" />
                <span>Category Stock Volume</span>
              </h3>
              <p className="text-[11px] text-[#A7B1C2]">Physical watch units allocated by horological line</p>
            </div>
            <span className="text-xs text-[#E9B94F] font-bold">
              {categoryChartData.reduce((s, c) => s + c.units, 0)} Units
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#A7B1C2" fontSize={10} tickLine={false} />
                <YAxis stroke="#A7B1C2" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17165A',
                    borderColor: '#29305D',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="units" fill="#6500FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Breakdown */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#00D5FF]" />
                <span>Brand Share Distribution</span>
              </h3>
              <p className="text-[11px] text-[#A7B1C2]">Manufacturer presence across inventory units</p>
            </div>
            <span className="text-xs text-[#00D5FF] font-bold">{brandChartData.length} Brands</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={brandChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="units"
                >
                  {brandChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#A7B1C2' }}
                  formatter={(value) => <span className="text-[#A7B1C2]">{value}</span>}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Warehouse-wise Stock Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E9B94F]" />
            <span>Warehouse Stock Allocation</span>
          </h3>
          <button
            onClick={() => onNavigateTab('warehouses')}
            className="text-xs text-[#E9B94F] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Manage Warehouses</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {warehouses.map((wh) => {
            const whProducts = products.filter((p) => p.warehouse === wh.name || p.warehouseId === wh.id);
            const totalWhUnits = whProducts.reduce((s, p) => s + (p.totalQty || 0), 0);
            const whValuation = whProducts.reduce((s, p) => s + (p.totalQty || 0) * (p.unitCost || 0), 0);
            const utilPercent = Math.min(100, Math.round((totalWhUnits / wh.capacityUnits) * 100));

            return (
              <div
                key={wh.id}
                className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md hover:border-[#6500FF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#17165A] text-[#00D5FF] border border-[#29305D]">
                      {wh.id}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">Active Vault</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{wh.name}</h4>
                  <p className="text-[11px] text-[#A7B1C2] line-clamp-1 mb-3">{wh.location}</p>

                  <div className="space-y-1.5 p-3 rounded-xl bg-[#17165A]/50 border border-[#29305D]/60 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-[#A7B1C2]">Stored Units:</span>
                      <strong className="text-white">{totalWhUnits.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A7B1C2]">Vault Capacity:</span>
                      <span className="text-gray-300">{wh.capacityUnits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A7B1C2]">Asset Value:</span>
                      <span className="text-[#E9B94F] font-bold">₹{(whValuation / 100000).toFixed(1)} Lakhs</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#A7B1C2]">Capacity Occupied</span>
                    <span className="text-[#00D5FF] font-mono font-bold">{utilPercent}%</span>
                  </div>
                  <div className="w-full bg-[#17165A] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6500FF] to-[#00D5FF] rounded-full transition-all"
                      style={{ width: `${utilPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
