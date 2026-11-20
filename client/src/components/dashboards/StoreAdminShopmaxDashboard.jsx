import React, { useState } from 'react';
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
  TrendingDown,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Barcode,
  Camera,
  CheckCircle,
  X,
  Printer,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Check,
} from 'lucide-react';

import ShopmaxPOSTerminalPanel from './ShopmaxPOSTerminalPanel';
import ShopmaxModals from './ShopmaxModals';
import {
  WEEKLY_SALES_DATA,
  SALES_CHANNEL_DATA,
  INITIAL_POS_ITEMS,
  TOP_WATCHES_DATA,
  RECENT_ORDERS_DATA
} from '../../data/shopmaxDashboardData';
export const StoreAdminShopmaxDashboard = ({
  onNavigateTab,
  onOpenAddProduct,
  searchQuery = '',
}) => {
  // Sales Overview Date Filter
  const [selectedRange, setSelectedRange] = useState('This Week');
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);

  // POS State
  const [posTab, setPosTab] = useState('pos'); // 'pos' | 'scanner'
  const [posCart, setPosCart] = useState(INITIAL_POS_ITEMS);
  const [scannedSku, setScannedSku] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState('');

  // Modals State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [cardPaymentModalOpen, setCardPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handleBarcodeScan = (e) => {
    e?.preventDefault();
    if (!scannedSku.trim()) return;

    // Check if matching sku or generic add
    const skuCode = scannedSku.trim().toUpperCase();
    const existingIndex = posCart.findIndex(
      (item) => item.sku.toUpperCase() === skuCode
    );

    if (existingIndex > -1) {
      handleQtyChange(posCart[existingIndex].id, 1);
      setScanSuccessMessage(`Increased quantity for ${posCart[existingIndex].name}!`);
    } else {
      const newItem = {
        id: `pos-${Date.now()}`,
        name: `Scanned Watch (${skuCode})`,
        price: 350000,
        qty: 1,
        image: '/images/products/rolex-submariner.png',
        sku: skuCode,
      };
      setPosCart((prev) => [newItem, ...prev]);
      setScanSuccessMessage(`Added ${newItem.name} to POS Cart!`);
    }

    setScannedSku('');
    setTimeout(() => setScanSuccessMessage(''), 3000);
  };

  // Filter Top Watches & Recent Orders based on search query
  const filteredTopWatches = TOP_WATCHES_DATA.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentOrders = RECENT_ORDERS_DATA.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white font-sans select-none">
      {/* ════════════════════════════════════════════════════════════════
          1. WELCOME SECTION (Exact match to reference)
          ════════════════════════════════════════════════════════════════ */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span>Welcome back, Store Admin!</span>
          <span>👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Here's what's happening with your WatchHub store today.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. KPI CARDS (4 horizontally aligned cards)
          ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#1265FF]/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1265FF]/20 flex items-center justify-center text-[#1265FF] flex-shrink-0">
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Total Sales</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                ₹24,85,075
              </h3>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5%</span>
                <span className="text-slate-400 font-normal">vs yesterday</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#00D9FF]/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] flex-shrink-0">
              <ShoppingCart className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Orders</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                356
              </h3>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.3%</span>
                <span className="text-slate-400 font-normal">vs yesterday</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Customers */}
        <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#741BFF]/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#741BFF]/20 flex items-center justify-center text-[#741BFF] flex-shrink-0">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Customers</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                1,245
              </h3>
              <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+15.7%</span>
                <span className="text-slate-400 font-normal">vs yesterday</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/60 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#A855F7]/20 flex items-center justify-center text-[#A855F7] flex-shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Conversion Rate</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                3.42%
              </h3>
              <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-2.1%</span>
                <span className="text-slate-400 font-normal">vs yesterday</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. MAIN TWO-COLUMN WORKSPACE: LEFT (Charts & Tables) | RIGHT (POS & Promo)
          ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT SECTION (8 COLS ON DESKTOP) ── */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* ── ROW: SALES OVERVIEW + SALES BY CHANNEL ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sales Overview Line Chart (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Sales Overview</h3>
                
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

              {/* Peak Saturday Floating Tooltip Pill (as shown in reference image) */}
              <div className="absolute top-12 right-16 z-10 bg-[#741BFF] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-purple-400/40 pointer-events-none hidden sm:block text-center">
                <p className="font-extrabold text-xs">₹24,85,075</p>
                <p className="text-[9px] text-purple-200 font-medium">Total Sales</p>
              </div>

              {/* Recharts Area Line Chart */}
              <div className="h-60 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={WEEKLY_SALES_DATA[selectedRange] || WEEKLY_SALES_DATA['This Week']}
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
                      ticks={[0, 10, 20, 30]}
                      domain={[0, 30]}
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
            <div className="lg:col-span-5 bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-2">Sales by Channel</h3>
              </div>

              {/* Donut Chart with Center Revenue */}
              <div className="relative h-44 flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SALES_CHANNEL_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {SALES_CHANNEL_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                    ₹24,85,075
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Total</span>
                </div>
              </div>

              {/* Channel Legend Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-[#1E2968]/70 text-xs">
                {SALES_CHANNEL_DATA.map((c) => (
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

          {/* ── ROW: TOP WATCHES + RECENT ORDERS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Watches Table */}
            <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg">
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

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-[#1E2968] pb-2 font-medium">
                      <th className="pb-2.5">Product</th>
                      <th className="pb-2.5 text-center">Sold</th>
                      <th className="pb-2.5 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2968]/60">
                    {filteredTopWatches.map((watch) => (
                      <tr key={watch.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-2.5 flex items-center gap-2.5">
                          <img
                            src={watch.image}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg">
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

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-[#1E2968] pb-2 font-medium">
                      <th className="pb-2.5">Order ID</th>
                      <th className="pb-2.5">Customer</th>
                      <th className="pb-2.5">Amount</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2968]/60">
                    {filteredRecentOrders.map((ord) => (
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
                            className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${ord.statusStyle}`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* ── RIGHT SECTION (4 COLS ON DESKTOP) ── */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 8. POS TERMINAL & BARCODE SCANNER PANEL */}
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

            {/* ════════════════════════════════════════════════════════════
                11. NEW COLLECTION PROMOTION CARD
              ════════════════════════════════════════════════════════════ */}
          <div className="rounded-2xl bg-[#0B1445]/90 border border-[#1E2968] p-5 shadow-lg relative overflow-hidden flex items-center justify-between">
            {/* Left Content */}
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

            {/* Right Luxury Watch Image */}
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
