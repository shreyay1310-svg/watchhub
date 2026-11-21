import React, { useState, useEffect, useCallback } from 'react';
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
  ShoppingBag,
  ShoppingCart,
  Users,
  TrendingUp,
  ChevronDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import api from '../../services/api';
import ShopmaxPOSTerminalPanel from './ShopmaxPOSTerminalPanel';
import ShopmaxModals from './ShopmaxModals';
import {
  SALES_CHANNEL_DATA,
  INITIAL_POS_ITEMS,
} from '../../data/shopmaxDashboardData';

export const StoreAdminShopmaxDashboard = ({
  onNavigateTab,
  onOpenAddProduct,
  searchQuery = '',
}) => {
  // Loading & Error States
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);

  // Overview Data from Backend
  const [overviewData, setOverviewData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: null,
    recentOrders: [],
    topWatches: [],
  });

  // Sales Overview Date Filter & Dynamic Chart Data
  const [selectedRange, setSelectedRange] = useState('This Week');
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);
  const [salesOverviewData, setSalesOverviewData] = useState([]);
  const [salesOverviewLoading, setSalesOverviewLoading] = useState(false);

  // Channel Breakdown
  const [channelData, setChannelData] = useState(SALES_CHANNEL_DATA);

  // POS State
  const [posTab, setPosTab] = useState('pos'); // 'pos' | 'scanner'
  const [posCart, setPosCart] = useState(INITIAL_POS_ITEMS);
  const [scannedSku, setScannedSku] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [tenderedCash, setTenderedCash] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Modals State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [cardPaymentModalOpen, setCardPaymentModalOpen] = useState(false);

  // Fetch High-Level Overview
  const fetchOverview = useCallback(async () => {
    try {
      setOverviewLoading(true);
      setOverviewError(null);
      const res = await api.get('/store-admin/overview');
      if (res.data && res.data.status === 'success') {
        const d = res.data.data;
        setOverviewData({
          totalSales: d.kpis?.totalSales ?? d.totalSales ?? 0,
          totalOrders: d.kpis?.totalOrders ?? d.totalOrders ?? 0,
          totalCustomers: d.kpis?.totalCustomers ?? d.totalCustomers ?? 0,
          conversionRate: d.kpis?.conversionRate ?? d.conversionRate ?? null,
          recentOrders: d.recentOrders ?? [],
          topWatches: d.topWatches ?? [],
        });
      }
    } catch (err) {
      console.warn('[StoreAdmin] Overview fetch error:', err.message);
      setOverviewError(err.response?.data?.message || 'Failed to load live overview.');
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  // Fetch Sales Overview series based on filter
  const fetchSalesOverview = useCallback(async (range) => {
    try {
      setSalesOverviewLoading(true);
      const rangeParam = range.toLowerCase().replace(' ', '-');
      const res = await api.get(`/store-admin/sales-overview?range=${rangeParam}`);
      if (res.data && res.data.status === 'success') {
        setSalesOverviewData(res.data.data.series || []);
      }
    } catch (err) {
      console.warn('[StoreAdmin] Sales overview fetch error:', err.message);
    } finally {
      setSalesOverviewLoading(false);
    }
  }, []);

  // Fetch Sales by Channel
  const fetchSalesByChannel = useCallback(async () => {
    try {
      const res = await api.get('/store-admin/sales-by-channel');
      if (res.data && res.data.status === 'success') {
        const channels = res.data.data.channels || [];
        if (channels.length > 0) {
          setChannelData(channels);
        }
      }
    } catch (err) {
      console.warn('[StoreAdmin] Channel fetch error:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchSalesByChannel();
  }, [fetchOverview, fetchSalesByChannel]);

  useEffect(() => {
    fetchSalesOverview(selectedRange);
  }, [selectedRange, fetchSalesOverview]);

  // Calculations for POS
  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + tax;

  // POS Handlers
  const handleQtyChange = (id, delta) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemovePosItem = (id) => {
    setPosCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBarcodeScan = async (e) => {
    e?.preventDefault();
    if (!scannedSku.trim()) return;

    const skuCode = scannedSku.trim().toUpperCase();
    const existingIndex = posCart.findIndex(
      (item) => (item.sku || '').toUpperCase() === skuCode
    );

    if (existingIndex > -1) {
      handleQtyChange(posCart[existingIndex].id, 1);
      setScanSuccessMessage(`Increased quantity for ${posCart[existingIndex].name}!`);
      setScannedSku('');
      setTimeout(() => setScanSuccessMessage(''), 3000);
      return;
    }

    try {
      const res = await api.get(`/store-admin/pos/search?query=${encodeURIComponent(skuCode)}`);
      if (res.data?.status === 'success' && res.data.data?.length > 0) {
        const p = res.data.data[0];
        const newItem = {
          id: p.id,
          name: p.name,
          price: p.price,
          qty: 1,
          image: p.image || '/images/products/rolex-submariner.png',
          sku: p.sku || skuCode,
          currentStock: p.currentStock,
        };
        setPosCart((prev) => [newItem, ...prev]);
        setScanSuccessMessage(`Added ${p.name} to POS Cart!`);
      } else {
        const fallbackItem = {
          id: `pos-${Date.now()}`,
          name: `Watch SKU ${skuCode}`,
          price: 250000,
          qty: 1,
          image: '/images/products/rolex-submariner.png',
          sku: skuCode,
        };
        setPosCart((prev) => [fallbackItem, ...prev]);
        setScanSuccessMessage(`Added SKU ${skuCode} to POS Cart!`);
      }
    } catch {
      const fallbackItem = {
        id: `pos-${Date.now()}`,
        name: `Watch SKU ${skuCode}`,
        price: 250000,
        qty: 1,
        image: '/images/products/rolex-submariner.png',
        sku: skuCode,
      };
      setPosCart((prev) => [fallbackItem, ...prev]);
      setScanSuccessMessage(`Added SKU ${skuCode} to POS Cart!`);
    }

    setScannedSku('');
    setTimeout(() => setScanSuccessMessage(''), 3000);
  };

  // Filter Top Watches & Recent Orders based on search query
  const displayTopWatches = (overviewData.topWatches && overviewData.topWatches.length > 0)
    ? overviewData.topWatches
    : [];

  const filteredTopWatches = displayTopWatches.filter((w) =>
    (w.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayRecentOrders = (overviewData.recentOrders && overviewData.recentOrders.length > 0)
    ? overviewData.recentOrders
    : [];

  const filteredRecentOrders = displayRecentOrders.filter(
    (o) =>
      (o.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formattedTotalSales = `₹${(overviewData.totalSales || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6 text-white font-sans select-none min-w-0 w-full overflow-x-hidden">
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Welcome back, Store Admin!</span>
            <span>👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status and telemetry from your WatchHub store &amp; database.
          </p>
        </div>
        {overviewLoading && (
          <div className="flex items-center gap-2 text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-xl w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing database...</span>
          </div>
        )}
      </div>

      {overviewError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{overviewError}</span>
        </div>
      )}

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div
          onClick={() => onNavigateTab?.('reports')}
          className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#1265FF] hover:scale-[1.01] transition-all cursor-pointer"
          title="Click to view full Sales Reports"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1265FF]/20 flex items-center justify-center text-[#1265FF] flex-shrink-0 group-hover:bg-[#1265FF]/30 transition-colors">
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Total Sales</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {formattedTotalSales}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active</span>
                <span className="text-slate-400 font-normal">from completed orders</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div
          onClick={() => onNavigateTab?.('orders')}
          className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#00D9FF] hover:scale-[1.01] transition-all cursor-pointer"
          title="Click to view Orders module"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] flex-shrink-0 group-hover:bg-[#00D9FF]/30 transition-colors">
              <ShoppingCart className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Orders</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {(overviewData.totalOrders || 0).toLocaleString()}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Persistent</span>
                <span className="text-slate-400 font-normal">in database</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Customers */}
        <div
          onClick={() => onNavigateTab?.('customers')}
          className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#741BFF] hover:scale-[1.01] transition-all cursor-pointer"
          title="Click to view Customers module"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#741BFF]/20 flex items-center justify-center text-[#741BFF] flex-shrink-0 group-hover:bg-[#741BFF]/30 transition-colors">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Customers</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {(overviewData.totalCustomers || 0).toLocaleString()}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Registered</span>
                <span className="text-slate-400 font-normal">verified buyers</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Conversion Rate (Display Not Available if no visitor tracking) */}
        <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#A855F7]/20 flex items-center justify-center text-[#A855F7] flex-shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Conversion Rate</p>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                {overviewData.conversionRate !== null ? `${overviewData.conversionRate}%` : 'Not Available'}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Visitor telemetry uninstrumented
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN TWO-COLUMN WORKSPACE: LEFT (Charts & Tables) | RIGHT (POS & Promo) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT SECTION (8 COLS ON DESKTOP) */}
        <div className="xl:col-span-8 space-y-6">
          {/* ROW: SALES OVERVIEW + SALES BY CHANNEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sales Overview Line Chart (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Sales Overview</h3>
                  {salesOverviewLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
                </div>

                {/* Time Range Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081033] border border-blue-500/30 text-xs text-white font-medium hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <span>{selectedRange}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {rangeDropdownOpen && (
                    <div className="absolute right-0 top-9 w-36 bg-[#081033] border border-[#1E2968] rounded-xl shadow-2xl p-1 z-30 text-xs">
                      {['This Week', 'Last Week', 'This Month'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setSelectedRange(r);
                            setRangeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            selectedRange === r
                              ? 'bg-[#1265FF] text-white font-bold'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Peak Floating Tooltip Pill */}
              <div className="absolute top-12 right-16 z-10 bg-[#741BFF] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-purple-400/40 pointer-events-none hidden sm:block text-center">
                <p className="font-extrabold text-xs">{formattedTotalSales}</p>
                <p className="text-[9px] text-purple-200 font-medium">Database Revenue</p>
              </div>

              {/* Recharts Area Line Chart */}
              <div className="h-60 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesOverviewData}
                    margin={{ top: 20, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#741BFF" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#1265FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#1E2968' }}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `₹${val}L`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#050B2D] border border-[#741BFF]/50 p-2.5 rounded-xl shadow-xl text-xs">
                              <p className="text-slate-400 font-semibold">{data.day}</p>
                              <p className="text-[#00D9FF] font-bold text-sm mt-0.5">
                                {data.formatted}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00D9FF"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#salesGradient)"
                      dot={{ r: 4, fill: '#00D9FF', stroke: '#050B2D', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#741BFF', stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Channel Donut Chart (5 Cols) */}
            <div
              onClick={() => onNavigateTab?.('orders')}
              className="lg:col-span-5 bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer hover:border-[#1265FF]/40 transition-colors"
              title="Click to view Channel Orders"
            >
              <div>
                <h3 className="text-base font-bold text-white mb-2">Sales by Channel</h3>
              </div>

              {/* Donut Chart with Center Revenue */}
              <div className="relative h-44 flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#1265FF'} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#050B2D] border border-white/20 p-2 rounded-xl text-xs">
                              <p className="font-bold text-white">{data.name}</p>
                              <p className="text-slate-300 mt-0.5">
                                {data.amount} ({data.value}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {formattedTotalSales}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Total</span>
                </div>
              </div>

              {/* Channel Legend Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-[#1E2968]/70 text-xs">
                {channelData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-slate-300 font-medium">{c.name}</span>
                    </div>
                    <span className="font-semibold text-white">
                      {c.amount}{' '}
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({c.value}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW: TOP WATCHES + RECENT ORDERS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
            {/* Top Watches Table */}
            <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-4 sm:p-5 shadow-lg min-w-0 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Top Watches</h3>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('products')}
                  className="text-xs font-semibold text-[#00D9FF] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[280px]">
                  <thead>
                    <tr className="text-slate-400 border-b border-[#1E2968] pb-2 font-medium">
                      <th className="pb-2.5">Product</th>
                      <th className="pb-2.5 text-center">Sold</th>
                      <th className="pb-2.5 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2968]/60">
                    {filteredTopWatches.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-slate-400">
                          No top selling watches recorded yet.
                        </td>
                      </tr>
                    ) : (
                      filteredTopWatches.map((watch) => (
                        <tr key={watch.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-2.5 flex items-center gap-2.5">
                            <img
                              src={watch.image || '/images/products/rolex-submariner.png'}
                              alt={watch.name}
                              className="w-9 h-9 rounded-xl object-contain bg-black/40 border border-white/10 p-0.5 flex-shrink-0"
                              onError={(e) => {
                                e.target.src = '/images/products/rolex-submariner.png';
                              }}
                            />
                            <span className="font-semibold text-white truncate max-w-[140px]">
                              {watch.name}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-medium text-slate-300">
                            {watch.sold}
                          </td>
                          <td className="py-2.5 text-right font-bold text-white">
                            {watch.revenue}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-4 sm:p-5 shadow-lg min-w-0 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Recent Orders</h3>
                <button
                  type="button"
                  onClick={() => onNavigateTab?.('orders')}
                  className="text-xs font-semibold text-[#00D9FF] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[320px]">
                  <thead>
                    <tr className="text-slate-400 border-b border-[#1E2968] pb-2 font-medium">
                      <th className="pb-2.5">Order ID</th>
                      <th className="pb-2.5">Customer</th>
                      <th className="pb-2.5">Amount</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2968]/60">
                    {filteredRecentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-4 text-center text-slate-400">
                          No recent orders in database.
                        </td>
                      </tr>
                    ) : (
                      filteredRecentOrders.map((ord) => (
                        <tr
                          key={ord.id}
                          onClick={() => setSelectedOrder(ord)}
                          className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                        >
                          <td className="py-2.5 font-mono text-[#00D9FF] group-hover:underline">
                            {ord.id}
                          </td>
                          <td className="py-2.5 text-white font-medium truncate max-w-[110px]">
                            {ord.customer}
                          </td>
                          <td className="py-2.5 font-bold text-slate-200">
                            {ord.amount}
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                ord.statusStyle || 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (4 COLS ON DESKTOP) */}
        <div className="xl:col-span-4 space-y-6">
          {/* POS TERMINAL & BARCODE SCANNER PANEL */}
          <ShopmaxPOSTerminalPanel
            posTab={posTab}
            setPosTab={setPosTab}
            posCart={posCart}
            setPosCart={setPosCart}
            handleQtyChange={handleQtyChange}
            handleRemovePosItem={handleRemovePosItem}
            subtotal={subtotal}
            tax={tax}
            grandTotal={grandTotal}
            setCheckoutModalOpen={setCheckoutModalOpen}
            setCardPaymentModalOpen={setCardPaymentModalOpen}
            cameraActive={cameraActive}
            setCameraActive={setCameraActive}
            scanSuccessMessage={scanSuccessMessage}
            scannedSku={scannedSku}
            setScannedSku={setScannedSku}
            handleBarcodeScan={handleBarcodeScan}
            onNavigateTab={onNavigateTab}
          />

          {/* NEW COLLECTION PROMOTION CARD */}
          <div className="rounded-2xl bg-[#0B1445]/90 border border-[#1E2968] p-5 shadow-lg relative overflow-hidden flex items-center justify-between">
            <div className="z-10 max-w-[170px] space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                New Collection
              </h3>
              <p className="text-xs text-slate-300 leading-snug">
                Add the latest watches to your store.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAddProduct}
                  className="px-4 py-2 rounded-xl bg-[#741BFF] hover:bg-[#6515dd] text-white font-semibold text-xs shadow-lg shadow-[#741BFF]/30 transition-all cursor-pointer inline-block"
                >
                  Add New Products
                </button>
              </div>
            </div>

            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/footer_newsletter_watch.png"
                alt="New Collection Luxury Watch"
                className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.src = '/images/products/rolex-daytona.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <ShopmaxModals
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        checkoutModalOpen={checkoutModalOpen}
        setCheckoutModalOpen={setCheckoutModalOpen}
        cardPaymentModalOpen={cardPaymentModalOpen}
        setCardPaymentModalOpen={setCardPaymentModalOpen}
        posCart={posCart}
        setPosCart={setPosCart}
        subtotal={subtotal}
        tax={tax}
        grandTotal={grandTotal}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        tenderedCash={tenderedCash}
        setTenderedCash={setTenderedCash}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
      />
    </div>
  );
};

export default StoreAdminShopmaxDashboard;
