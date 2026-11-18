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

// Sales Overview Line Chart Data (Weekly: Mon - Sun)
const WEEKLY_SALES_DATA = {
  'This Week': [
    { day: 'Mon', revenue: 8.5, formatted: '₹8,50,000' },
    { day: 'Tue', revenue: 12.2, formatted: '₹12,20,000' },
    { day: 'Wed', revenue: 14.8, formatted: '₹14,80,000' },
    { day: 'Thu', revenue: 13.5, formatted: '₹13,50,000' },
    { day: 'Fri', revenue: 17.6, formatted: '₹17,60,000' },
    { day: 'Sat', revenue: 24.85, formatted: '₹24,85,075', isPeak: true },
    { day: 'Sun', revenue: 19.4, formatted: '₹19,40,000' },
  ],
  'Last Week': [
    { day: 'Mon', revenue: 7.2, formatted: '₹7,20,000' },
    { day: 'Tue', revenue: 10.5, formatted: '₹10,50,000' },
    { day: 'Wed', revenue: 11.8, formatted: '₹11,80,000' },
    { day: 'Thu', revenue: 14.0, formatted: '₹14,00,000' },
    { day: 'Fri', revenue: 16.2, formatted: '₹16,20,000' },
    { day: 'Sat', revenue: 21.5, formatted: '₹21,50,000', isPeak: true },
    { day: 'Sun', revenue: 18.0, formatted: '₹18,00,000' },
  ],
  'This Month': [
    { day: 'Week 1', revenue: 45.2, formatted: '₹45,20,000' },
    { day: 'Week 2', revenue: 58.7, formatted: '₹58,70,000' },
    { day: 'Week 3', revenue: 72.4, formatted: '₹72,40,000' },
    { day: 'Week 4', revenue: 98.6, formatted: '₹98,60,000', isPeak: true },
  ],
};

// Channel Distribution Donut Data
const SALES_CHANNEL_DATA = [
  { name: 'Online Store', value: 50, amount: '₹12,450.50', color: '#741BFF' },
  { name: 'POS Terminal', value: 33, amount: '₹8,250.30', color: '#1265FF' },
  { name: 'Mobile App', value: 17, amount: '₹4,149.95', color: '#00D9FF' },
];

// Initial POS Cart Products
const INITIAL_POS_ITEMS = [
  {
    id: 'pos-1',
    name: 'Rolex Submariner',
    price: 980000,
    qty: 1,
    image: '/images/products/rolex-submariner.png',
    sku: 'WH-ROL-001',
  },
  {
    id: 'pos-2',
    name: 'Omega Speedmaster',
    price: 725000,
    qty: 1,
    image: '/images/products/omega-speedmaster.png',
    sku: 'WH-OMG-001',
  },
  {
    id: 'pos-3',
    name: 'TAG Heuer Carrera',
    price: 490000,
    qty: 1,
    image: '/images/products/tag-heuer-carrera.png',
    sku: 'WH-TAG-001',
  },
  {
    id: 'pos-4',
    name: 'Tissot PRX',
    price: 42500,
    qty: 1,
    image: '/images/products/tissot-prx.png',
    sku: 'WH-TIS-001',
  },
];

// Top Watches Performance Table Data
const TOP_WATCHES_DATA = [
  {
    id: 'tw-1',
    name: 'Rolex Submariner',
    sold: 245,
    revenue: '₹24,01,000',
    image: '/images/products/rolex-submariner.png',
  },
  {
    id: 'tw-2',
    name: 'Omega Speedmaster',
    sold: 186,
    revenue: '₹13,48,500',
    image: '/images/products/omega-speedmaster.png',
  },
  {
    id: 'tw-3',
    name: 'TAG Heuer Carrera',
    sold: 162,
    revenue: '₹7,93,800',
    image: '/images/products/tag-heuer-carrera.png',
  },
  {
    id: 'tw-4',
    name: 'Tissot PRX',
    sold: 135,
    revenue: '₹5,73,750',
    image: '/images/products/tissot-prx.png',
  },
];

// Recent Orders Table Data
const RECENT_ORDERS_DATA = [
  {
    id: '#ORD-1256',
    customer: 'John Doe',
    email: 'john.doe@gmail.com',
    amount: '₹1,50,750',
    status: 'Completed',
    statusStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    items: ['Rolex Submariner Date 41mm', 'Leather Travel Case'],
    date: '14 Nov 2026, 02:45 PM',
  },
  {
    id: '#ORD-1255',
    customer: 'Sarah Smith',
    email: 'sarah.smith@outlook.com',
    amount: '₹89,500',
    status: 'Processing',
    statusStyle: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    items: ['Tissot PRX Powermatic 80'],
    date: '14 Nov 2026, 01:15 PM',
  },
  {
    id: '#ORD-1254',
    customer: 'Michael Brown',
    email: 'michael.b@yahoo.com',
    amount: '₹3,20,000',
    status: 'Shipped',
    statusStyle: 'bg-[#741BFF]/20 text-[#A855F7] border border-[#741BFF]/40',
    items: ['Omega Speedmaster Moonwatch'],
    date: '13 Nov 2026, 06:30 PM',
  },
  {
    id: '#ORD-1253',
    customer: 'Emily Davis',
    email: 'emily.davis@corp.com',
    amount: '₹75,250',
    status: 'Pending',
    statusStyle: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    items: ['TAG Heuer Form 1 Quartz'],
    date: '13 Nov 2026, 04:10 PM',
  },
  {
    id: '#ORD-1252',
    customer: 'David Wilson',
    email: 'david.wilson@swiss.ch',
    amount: '₹1,85,600',
    status: 'Completed',
    statusStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    items: ['Cartier Tank Must Large'],
    date: '13 Nov 2026, 11:20 AM',
  },
];

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
          
          {/* ════════════════════════════════════════════════════════════
              8. POS TERMINAL & BARCODE SCANNER PANEL
              ════════════════════════════════════════════════════════════ */}
          <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-6 border-b border-[#1E2968] pb-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPosTab('pos')}
                className={`text-sm font-bold pb-1 cursor-pointer transition-colors relative ${
                  posTab === 'pos'
                    ? 'text-white border-b-2 border-[#1265FF]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                POS Terminal
              </button>
              <button
                type="button"
                onClick={() => setPosTab('scanner')}
                className={`text-sm font-bold pb-1 cursor-pointer transition-colors relative ${
                  posTab === 'scanner'
                    ? 'text-white border-b-2 border-[#1265FF]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Barcode Scanner
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab?.('pos')}
                className="ml-auto text-[11px] font-bold text-[#00D9FF] hover:underline flex items-center gap-1 cursor-pointer"
                title="Launch Full Dedicated POS Terminal Station"
              >
                <span>Full POS Terminal</span>
                <span>↗</span>
              </button>
            </div>

            {/* TAB 1: POS TERMINAL */}
            {posTab === 'pos' && (
              <div className="space-y-4">
                {/* Watch Products List in Cart */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {posCart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#081033] border border-white/5 hover:border-[#1E2968] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-contain bg-black/40 border border-white/10 p-0.5 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/images/products/rolex-submariner.png';
                          }}
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-[11px] font-semibold text-[#00D9FF] mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#050B2D] border border-white/10 rounded-lg p-0.5 text-xs">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-white text-[11px]">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePosItem(item.id)}
                          className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {posCart.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      <p>POS Cart is empty.</p>
                      <button
                        type="button"
                        onClick={() => setPosCart(INITIAL_POS_ITEMS)}
                        className="mt-2 text-xs text-[#00D9FF] hover:underline"
                      >
                        Reset sample items
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtotal, Tax, Total */}
                <div className="pt-3 border-t border-[#1E2968] space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tax (10%)</span>
                    <span className="font-semibold text-white">
                      ₹{tax.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1E2968]/70">
                    <span>Total</span>
                    <span className="text-base text-white font-extrabold">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1265FF] to-[#741BFF] text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Checkout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardPaymentModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-[#081033] border border-blue-500/30 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#0c194e] hover:border-blue-400 transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-[#00D9FF]" />
                    <span>Pay with Card</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: BARCODE SCANNER */}
            {posTab === 'scanner' && (
              <div className="space-y-4">
                {/* Viewfinder box */}
                <div className="relative rounded-2xl bg-black/60 border-2 border-dashed border-[#1265FF]/60 p-4 text-center overflow-hidden">
                  <div className="h-28 flex flex-col items-center justify-center">
                    <Barcode className="w-12 h-12 text-[#00D9FF] mb-2" />
                    <p className="text-xs font-semibold text-white">
                      {cameraActive
                        ? 'Camera Active — Scanning Laser Armed'
                        : 'Hardware & Camera Scanner Ready'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Point barcode reader or enter SKU code below
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCameraActive(!cameraActive)}
                    className="mt-2 text-[11px] font-bold text-[#00D9FF] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{cameraActive ? 'Stop Camera' : 'Activate Camera Scanner'}</span>
                  </button>
                </div>

                {/* Feedback message */}
                {scanSuccessMessage && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{scanSuccessMessage}</span>
                  </div>
                )}

                {/* Manual SKU input form */}
                <form onSubmit={handleBarcodeScan} className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Fast SKU / Barcode Entry:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scannedSku}
                      onChange={(e) => setScannedSku(e.target.value)}
                      placeholder="e.g. WH-ROL-001, WH-OMG-001"
                      className="flex-1 bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#1265FF]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1265FF] hover:bg-[#0e52d6] text-white text-xs font-bold transition-all cursor-pointer flex-shrink-0"
                    >
                      Scan & Add
                    </button>
                  </div>
                </form>

                {/* Quick Scan Badges */}
                <div className="space-y-1.5 pt-2 border-t border-[#1E2968]">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Quick Sample Barcodes:
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {[
                      { code: 'WH-ROL-001', label: 'Rolex' },
                      { code: 'WH-OMG-001', label: 'Omega' },
                      { code: 'WH-TAG-001', label: 'TAG Heuer' },
                      { code: 'WH-TIS-001', label: 'Tissot' },
                    ].map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => {
                          setScannedSku(b.code);
                        }}
                        className="px-2 py-1 rounded-lg bg-[#081033] border border-white/10 hover:border-[#1265FF] text-slate-300 hover:text-white cursor-pointer"
                      >
                        {b.label} ({b.code})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

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

      {/* ════════════════════════════════════════════════════════════════
          MODAL 1: ORDER DETAILS MODAL
          ════════════════════════════════════════════════════════════════ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-lg w-full border border-[#1E2968] p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#1E2968] pb-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1265FF]/20 flex items-center justify-center text-[#00D9FF]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Order Details: {selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-400">{selectedOrder.date}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#081033] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-400 block text-[11px]">Customer</span>
                  <p className="font-bold text-white">{selectedOrder.customer}</p>
                  <p className="text-slate-400 text-[10px]">{selectedOrder.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${selectedOrder.statusStyle}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-300 font-bold block mb-1.5">
                  Ordered Timepieces:
                </span>
                <ul className="space-y-1 bg-[#081033] p-3 rounded-xl border border-white/5 text-slate-200">
                  {selectedOrder.items?.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#00D9FF]">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center bg-[#050B2D] p-3 rounded-xl border border-[#1E2968] font-bold text-sm">
                <span>Total Amount Paid</span>
                <span className="text-[#00D9FF] text-base">{selectedOrder.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1E2968] mt-5">
              <button
                type="button"
                onClick={() => {
                  alert(`🖨️ Printing Tax Invoice for ${selectedOrder.id}...`);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#1265FF] hover:bg-[#0e52d6] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 2: POS CHECKOUT CONFIRMATION MODAL
          ════════════════════════════════════════════════════════════════ */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-md w-full border border-[#1E2968] p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setCheckoutModalOpen(false);
                setPaymentSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1265FF]/20 text-[#00D9FF] flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">POS Terminal Checkout</h3>
                  <p className="text-xs text-slate-400">
                    Review cart & complete counter customer transaction
                  </p>
                </div>

                <div className="space-y-2 text-xs bg-[#081033] p-3 rounded-xl border border-white/5 max-h-40 overflow-y-auto mb-3">
                  {posCart.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-slate-300">
                      <span>
                        {it.name} <span className="text-[#00D9FF]">×{it.qty}</span>
                      </span>
                      <span className="font-semibold text-white">
                        ₹{(it.price * it.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#050B2D] p-3 rounded-xl border border-[#1E2968] space-y-1 text-xs mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST (10%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-white/10">
                    <span>Grand Total</span>
                    <span className="text-base text-[#00D9FF]">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPaymentSuccess(true)}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    💵 Cash Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSuccess(true)}
                    className="py-2.5 rounded-xl bg-[#1265FF] hover:bg-[#0e52d6] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    ⚡ Instant UPI QR
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Transaction Approved!</h3>
                <p className="text-xs text-slate-300">
                  Payment of ₹{grandTotal.toLocaleString('en-IN')} received successfully.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert('🖨️ Printing POS Thermal Receipt Slip...');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutModalOpen(false);
                      setPaymentSuccess(false);
                      setPosCart([]);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#1265FF] text-white font-bold text-xs cursor-pointer"
                  >
                    New Sale
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 3: PAY WITH CARD TERMINAL SIMULATION
          ════════════════════════════════════════════════════════════════ */}
      {cardPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-sm w-full border border-[#1E2968] p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setCardPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#1265FF]/20 text-[#00D9FF] flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">Swipe or Tap Card on Terminal</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Authorized Total: ₹{grandTotal.toLocaleString('en-IN')}
            </p>

            <div className="bg-[#081033] p-4 rounded-xl border border-white/10 space-y-2 text-xs mb-4">
              <div className="flex justify-between text-slate-400">
                <span>Terminal ID</span>
                <span className="font-mono text-white">WH-POS-04</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Protocol</span>
                <span className="text-[#00D9FF]">EMV Chip & Contactless</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert('💳 Card Swiped! Payment Authorized via ICICI Merchant Gateway.');
                setCardPaymentModalOpen(false);
                setPosCart([]);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1265FF] to-[#741BFF] text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Simulate Card Approval
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreAdminShopmaxDashboard;
