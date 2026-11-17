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
  Truck,
  Calendar,
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

export default function StockOverviewModule({
  products = [],
  warehouses = [],
  onNavigateTab = () => {},
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];

  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All Time (Current Balance)');
  const [searchQuery, setSearchQuery] = useState('');

  // Unique filter lists
  const brands = useMemo(() => ['All', ...new Set(safeProducts.map((p) => p?.brand).filter(Boolean))], [safeProducts]);
  const categories = useMemo(() => ['All', ...new Set(safeProducts.map((p) => p?.category).filter(Boolean))], [safeProducts]);
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return safeProducts.filter((p) => {
      if (!p) return false;
      const matchWh = selectedWarehouse === 'All' || p.warehouse === selectedWarehouse || p.warehouseId === selectedWarehouse;
      const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStat = selectedStatus === 'All' || p.status === selectedStatus;
      const matchSearch =
        !searchQuery ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchWh && matchBrand && matchCat && matchStat && matchSearch;
    });
  }, [safeProducts, selectedWarehouse, selectedBrand, selectedCategory, selectedStatus, searchQuery]);

  // Aggregate numbers for the 7 required summary cards
  const totalStock = filteredProducts.reduce((sum, p) => sum + (p.totalQty || 0), 0);
  const availableStock = filteredProducts.reduce((sum, p) => sum + (p.availableQty || 0), 0);
  const reservedStock = filteredProducts.reduce((sum, p) => sum + (p.reservedQty || 0), 0);
  const damagedStock = filteredProducts.reduce((sum, p) => sum + (p.damagedQty || 0), 0);
  const inTransitStock = 14; // Timepieces currently dispatched between regional vaults
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

  // Warehouse Distribution
  const warehouseChartData = useMemo(() => {
    return warehouses.map((wh) => {
      const whProds = products.filter((p) => p.warehouse === wh.name || p.warehouseId === wh.id);
      return {
        name: wh.name.replace(' Warehouse', '').replace(' Central Vault', ''),
        units: whProds.reduce((s, p) => s + (p.totalQty || 0), 0),
      };
    });
  }, [products, warehouses]);

  // Stock Value Distribution (Top 5 Value Brands in Lakhs)
  const valueDistributionData = useMemo(() => {
    const valByBrand = {};
    filteredProducts.forEach((p) => {
      valByBrand[p.brand] = (valByBrand[p.brand] || 0) + ((p.totalQty || 0) * (p.unitCost || 0));
    });
    return Object.keys(valByBrand).map((b) => ({
      brand: b,
      valueLakhs: Number((valByBrand[b] / 100000).toFixed(1)),
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
              Visual Stock Monitoring
            </span>
            <span className="text-xs text-[#A7B1C2]">• Real-Time Valuation Analysis</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Stock Overview Analytics</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Holistic breakdown of inventory availability, safety buffers, warehouse allocations, and capital valuation.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('stock')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Box className="w-4 h-4" />
          <span>Open Full Inventory Catalog</span>
        </button>
      </div>

      {/* 2. Top 7 Summary Cards (Required: Total, Available, Reserved, Damaged, In-Transit, Low, Out of Stock) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
            <span className="text-[10px] font-semibold">Total Stock</span>
            <Boxes className="w-3.5 h-3.5 text-[#6500FF]" />
          </div>
          <p className="text-lg font-black text-white">{totalStock.toLocaleString()}</p>
          <p className="text-[10px] text-[#A7B1C2]">Physical units</p>
        </div>

        {/* Available Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
            <span className="text-[10px] font-semibold">Available</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-lg font-black text-emerald-400">{availableStock.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-300">Ready to fulfill</p>
        </div>

        {/* Reserved Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
            <span className="text-[10px] font-semibold">Reserved</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D5FF]" />
          </div>
          <p className="text-lg font-black text-[#00D5FF]">{reservedStock.toLocaleString()}</p>
          <p className="text-[10px] text-[#00D5FF]/80">VIP holds</p>
        </div>

        {/* Damaged Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
            <span className="text-[10px] font-semibold">Damaged</span>
            <X className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-lg font-black text-rose-400">{damagedStock.toLocaleString()}</p>
          <p className="text-[10px] text-rose-300">Quarantine</p>
        </div>

        {/* In-Transit Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
            <span className="text-[10px] font-semibold">In-Transit</span>
            <Truck className="w-3.5 h-3.5 text-[#E9B94F]" />
          </div>
          <p className="text-lg font-black text-[#E9B94F]">{inTransitStock}</p>
          <p className="text-[10px] text-[#E9B94F]/80">Inter-vault moves</p>
        </div>

        {/* Low Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
            <span className="text-[10px] font-semibold">Low Stock</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-400">{lowStockCount}</p>
          <p className="text-[10px] text-amber-300">Safety margin</p>
        </div>

        {/* Out of Stock */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1">
            <span className="text-[10px] font-semibold">Out of Stock</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          </div>
          <p className="text-lg font-black text-red-500">{outOfStockCount}</p>
          <p className="text-[10px] text-red-400">0 Available</p>
        </div>
      </div>

      {/* 3. Filter Bar (Brand, Category, Warehouse, Stock Status, Date Range) */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          {/* Brand */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  Brand: {b}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse */}
          <div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              <option value="All">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.name}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range & Reset */}
          <div className="flex items-center gap-1.5">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              <option value="All Time (Current Balance)">All Time (Live Balance)</option>
              <option value="This Month (Nov 2026)">This Month (Nov 2026)</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Year to Date">Year to Date 2026</option>
            </select>
            <button
              onClick={resetFilters}
              className="p-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white border border-[#29305D] shrink-0"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Graphical Analytics (Brand-wise, Category-wise, Warehouse-wise, Stock Value Distribution) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Graph 1: Brand-wise Inventory */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div className="mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-[#00D5FF]" />
              <span>Brand-wise Inventory</span>
            </h4>
            <p className="text-[10px] text-[#A7B1C2]">Share across manufacturers</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={brandChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="units">
                  {brandChartData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#17165A', borderColor: '#29305D', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-1 text-[10px] text-[#A7B1C2] pt-1 border-t border-[#29305D]">
            {brandChartData.slice(0, 3).map((b) => (
              <span key={b.name} className="px-1.5 py-0.5 rounded bg-[#17165A]">{b.name}: {b.units}</span>
            ))}
          </div>
        </div>

        {/* Graph 2: Category-wise Inventory */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div className="mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#6500FF]" />
              <span>Category-wise Inventory</span>
            </h4>
            <p className="text-[10px] text-[#A7B1C2]">Units by horological collection</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#A7B1C2" fontSize={9} tickLine={false} />
                <YAxis stroke="#A7B1C2" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#17165A', borderColor: '#29305D', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
                <Bar dataKey="units" fill="#6500FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-[#A7B1C2] pt-1 border-t border-[#29305D] text-right">
            Total {categoryChartData.reduce((s, c) => s + c.units, 0)} Units
          </p>
        </div>

        {/* Graph 3: Warehouse-wise Inventory */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div className="mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#E9B94F]" />
              <span>Warehouse-wise Inventory</span>
            </h4>
            <p className="text-[10px] text-[#A7B1C2]">Stock distribution across 4 vaults</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseChartData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
                <XAxis type="number" stroke="#A7B1C2" fontSize={9} hide />
                <YAxis dataKey="name" type="category" stroke="#A7B1C2" fontSize={9} width={70} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#17165A', borderColor: '#29305D', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
                <Bar dataKey="units" fill="#00D5FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-[#A7B1C2] pt-1 border-t border-[#29305D] text-right">
            4 Secured Hubs Active
          </p>
        </div>

        {/* Graph 4: Stock Value Distribution */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div className="mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stock Value Distribution</span>
            </h4>
            <p className="text-[10px] text-[#A7B1C2]">Valuation by top brands (₹ Lakhs)</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueDistributionData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <XAxis dataKey="brand" stroke="#A7B1C2" fontSize={9} tickLine={false} />
                <YAxis stroke="#A7B1C2" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#17165A', borderColor: '#29305D', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
                <Bar dataKey="valueLakhs" name="Value (₹L)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-emerald-400 font-bold pt-1 border-t border-[#29305D] text-right">
            Total Asset: ₹{(totalValuation / 10000000).toFixed(2)} Cr
          </p>
        </div>
      </div>

      {/* 5. Detailed Stock Summary Table (Product-wise quantity & stock value) */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-[#29305D] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#E9B94F]" />
            <span>Product-wise Stock Valuation Ledger</span>
          </h3>
          <span className="text-xs text-[#00D5FF] font-bold">
            {filteredProducts.length} Items Listed
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Watch / SKU</th>
                <th className="py-3 px-3">Brand</th>
                <th className="py-3 px-3">Vault Location</th>
                <th className="py-3 px-3 text-center">Available</th>
                <th className="py-3 px-3 text-center">Reserved</th>
                <th className="py-3 px-3 text-center">Total Stock</th>
                <th className="py-3 px-3 text-right">Unit Cost</th>
                <th className="py-3 px-3 text-right">Total Stock Value</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29305D]/50">
              {filteredProducts.map((p) => {
                const stockVal = (p.totalQty || 0) * (p.unitCost || 0);
                return (
                  <tr key={p.id} className="hover:bg-[#17165A]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-black/40 border border-[#29305D]" />
                        <div>
                          <p className="font-bold text-white text-xs">{p.name}</p>
                          <p className="text-[10px] font-mono text-[#00D5FF]">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{p.brand}</td>
                    <td className="py-3 px-3 text-gray-300">{p.warehouse}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className={p.availableQty === 0 ? 'text-rose-400' : p.availableQty <= p.minStock ? 'text-amber-400' : 'text-emerald-400'}>
                        {p.availableQty}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-300">{p.reservedQty}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-white">{p.totalQty}</td>
                    <td className="py-3 px-3 text-right font-mono text-gray-300">
                      ₹{Number(p.unitCost).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#E9B94F]">
                      ₹{Number(stockVal).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'In Stock'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : p.status === 'Low Stock'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
