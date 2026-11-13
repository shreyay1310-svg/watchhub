import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';
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
  LayoutDashboard,
  Watch,
  Folder,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Image as ImageIcon,
  Star,
  BarChart3,
  Factory,
  Settings,
  Plus,
  Truck,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  ExternalLink,
  Calendar,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  CheckCircle,
  LogOut,
  AlertTriangle,
  CreditCard,
  Check,
  Layers,
  ShieldCheck,
  Eye,
  RefreshCw,
  Box,
  ShoppingCart,
  Crown,
  Sparkles,
} from 'lucide-react';

// Import All Role Module Components
import UsersManagementModule from '../../components/dashboards/modules/UsersManagementModule';
import ProductsManagementModule from '../../components/dashboards/modules/ProductsManagementModule';
import OrdersManagementModule from '../../components/dashboards/modules/OrdersManagementModule';
import InventoryManagementModule from '../../components/dashboards/modules/InventoryManagementModule';
import CustomerSupportModule from '../../components/dashboards/modules/CustomerSupportModule';
import OffersCouponsModule from '../../components/dashboards/modules/OffersCouponsModule';
import SettingsAuditModule from '../../components/dashboards/modules/SettingsAuditModule';
import CategoriesBrandsModule from '../../components/dashboards/modules/CategoriesBrandsModule';
import DeliveryModule from '../../components/dashboards/modules/DeliveryModule';
import ReportsAnalyticsModule from '../../components/dashboards/modules/ReportsAnalyticsModule';
import ManufacturingHubModule from '../../components/dashboards/modules/ManufacturingHubModule';
import CustomizationManagementModule from '../../components/dashboards/modules/CustomizationManagementModule';

// Sales Overview Chart Data (Oct 6 - Nov 5, matching reference UI exactly)
const SALES_OVERVIEW_DATA = [
  { date: 'Oct 6', revenue: 2.2, formatted: '₹2,20,000' },
  { date: 'Oct 10', revenue: 4.5, formatted: '₹4,50,000' },
  { date: 'Oct 14', revenue: 6.0, formatted: '₹6,00,000' },
  { date: 'Oct 18', revenue: 5.8, formatted: '₹5,80,000' },
  { date: 'Oct 22', revenue: 7.4, formatted: '₹7,40,000' },
  { date: 'Oct 26', revenue: 10.48, formatted: '₹10,48,000', isHighlight: true },
  { date: 'Oct 30', revenue: 9.8, formatted: '₹9,80,000' },
  { date: 'Nov 5', revenue: 12.48, formatted: '₹12,48,000' },
];

// Orders Status Donut Chart Data
const ORDERS_STATUS_DATA = [
  { name: 'Delivered', value: 62, color: '#10B981' },
  { name: 'Processing', value: 14, color: '#3B82F6' },
  { name: 'Shipped', value: 12, color: '#F59E0B' },
  { name: 'Cancelled', value: 7, color: '#EF4444' },
  { name: 'Returned', value: 5, color: '#8B5CF6' },
];

// Inventory Low Stock Alerts Data
const INVENTORY_ALERTS = [
  {
    id: 1,
    name: 'Digital Sports Watch',
    stockLeft: 5,
    statusText: 'Low Stock (5 left)',
    image: '/images/products/featured_rolex_submariner.jpg',
  },
  {
    id: 2,
    name: 'Classic Chronograph Watch',
    stockLeft: 8,
    statusText: 'Low Stock (8 left)',
    image: '/images/products/featured_omega_speedmaster.jpg',
  },
  {
    id: 3,
    name: 'Smartwatch Pro',
    stockLeft: 10,
    statusText: 'Low Stock (10 left)',
    image: '/images/products/featured_apple_watch.jpg',
  },
];

// Recent Orders Table Data
const RECENT_ORDERS_DATA = [
  {
    id: '#WH12548',
    customer: 'Ananya Singh',
    amount: '₹2,999',
    status: 'Delivered',
    date: '04 Nov 2026',
    statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  {
    id: '#WH12547',
    customer: 'Rahul Verma',
    amount: '₹3,499',
    status: 'Shipped',
    date: '04 Nov 2026',
    statusClass: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  {
    id: '#WH12546',
    customer: 'Priya Yadav',
    amount: '₹1,899',
    status: 'Processing',
    date: '03 Nov 2026',
    statusClass: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  {
    id: '#WH12545',
    customer: 'Rohit Kumar',
    amount: '₹2,749',
    status: 'Delivered',
    date: '03 Nov 2026',
    statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  {
    id: '#WH12544',
    customer: 'Sneha Patel',
    amount: '₹3,299',
    status: 'Cancelled',
    date: '02 Nov 2026',
    statusClass: 'bg-rose-50 text-rose-700 border border-rose-200',
  },
];

// Top Selling Products Data
const TOP_SELLING_PRODUCTS = [
  {
    id: 1,
    name: 'Classic Chronograph Watch',
    rating: '4.5',
    reviews: '1.2k',
    soldBadge: '324 Sold',
    image: '/images/products/featured_omega_speedmaster.jpg',
  },
  {
    id: 2,
    name: 'Smartwatch Pro',
    rating: '4.5',
    reviews: '3.4k',
    soldBadge: '287 Sold',
    image: '/images/products/featured_apple_watch.jpg',
  },
  {
    id: 3,
    name: 'Elegant Partywear Watch',
    rating: '4.6',
    reviews: '980',
    soldBadge: '256 Sold',
    image: '/images/products/featured_cartier_tank.jpg',
  },
];

export const RoleDashboard = ({ initialTab = 'dashboard' }) => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState(initialTab);
  const [productsExpanded, setProductsExpanded] = useState(true);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30 Days (Oct 6, 2026 – Nov 5, 2026)');

  const currentRole = user?.role || ROLES.STORE_ADMIN;

  // Navigation Items for the Fixed Sidebar (Exact order requested)
  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Watch, hasChevron: true },
    { id: 'categories', label: 'Categories', icon: Folder },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '24' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag },
    { id: 'banners', label: 'Banners & Promotions', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'manufacturing_hub', label: 'Manufacturing Hub', icon: Factory },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  // Quick Links
  const QUICK_LINKS = [
    { label: 'Add Product', icon: Plus, tab: 'products' },
    { label: 'Process Orders', icon: Truck, tab: 'orders' },
    { label: 'Update Stock', icon: Boxes, tab: 'inventory' },
    { label: 'View Reports', icon: BarChart3, tab: 'reports' },
  ];

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B121C] text-white p-2.5 rounded-xl border border-[#D6A63C]/40 shadow-xl text-xs">
          <p className="text-[10px] text-gray-400">{data.date}, 2026</p>
          <p className="font-bold text-[#D6A63C] text-sm">{data.formatted}</p>
        </div>
      );
    }
    return null;
  };

  // Render the Selected Navigation Module
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManagementModule />;
      case 'categories':
        return <CategoriesBrandsModule />;
      case 'inventory':
      case 'stock_update':
      case 'stock_requests':
      case 'warehouses':
        return <InventoryManagementModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
      case 'orders':
      case 'payments':
        return <OrdersManagementModule />;
      case 'customers':
      case 'users':
        return <CustomerSupportModule activeSubTab="customer_management" onSubTabChange={setActiveTab} />;
      case 'offers':
        return <OffersCouponsModule activeSubTab="offers" onSubTabChange={setActiveTab} />;
      case 'banners':
        return <OffersCouponsModule activeSubTab="banners" onSubTabChange={setActiveTab} />;
      case 'reviews':
      case 'reviews_ratings':
        return <CustomerSupportModule activeSubTab="reviews_ratings" onSubTabChange={setActiveTab} />;
      case 'reports':
      case 'stock_reports':
      case 'delivery_reports':
        return <ReportsAnalyticsModule />;
      case 'manufacturing_hub':
        return <ManufacturingHubModule />;
      case 'custom_watches':
        return <CustomizationManagementModule />;
      case 'settings':
      case 'store_settings':
        return <SettingsAuditModule />;
      case 'assigned_orders':
      case 'pick_pack':
      case 'shipments':
      case 'track_orders':
        return <DeliveryModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
      default:
        // Main Store Admin Dashboard View matching reference UI exactly
        return (
          <div className="space-y-6">
            {/* 1. Header with greeting and Date Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold font-sans text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Store Admin Dashboard</span>
                  <span className="text-xl">👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Manage your WatchHub store, track performance, and grow your business.
                </p>
              </div>

              {/* Date Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDateRangeOpen(!dateRangeOpen)}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs hover:border-[#D6A63C] text-gray-800 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-bold">Last 30 Days</span>
                  <span className="text-gray-500 font-normal hidden sm:inline">(Oct 6, 2026 – Nov 5, 2026)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {dateRangeOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 text-xs animate-scaleUp">
                    {[
                      'Today (Nov 13, 2026)',
                      'Last 7 Days (Nov 6 – Nov 13, 2026)',
                      'Last 30 Days (Oct 6 – Nov 5, 2026)',
                      'This Fiscal Quarter (Q4 2026)',
                      'Year to Date (2026)',
                    ].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedRange(range);
                          setDateRangeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-amber-50 transition-colors ${
                          selectedRange.startsWith(range.split(' ')[0])
                            ? 'font-bold text-[#D6A63C] bg-amber-50/50'
                            : 'text-gray-700'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. WatchHub Store Management Center Hero Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0C121D] via-[#101826] to-[#0A0E17] p-6 lg:p-8 text-white relative overflow-hidden shadow-md border border-white/10">
              {/* Subtle gold luxury ambient glow */}
              <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#D6A63C]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <span className="text-[11px] font-bold text-[#D6A63C] uppercase tracking-wider block mb-1">
                  — WatchHub Store Management Center
                </span>
                <p className="text-xs sm:text-sm text-gray-300 mb-5 font-normal">
                  Control your products, inventory, orders and promotions in one place.
                </p>

                {/* 3 Quick Action Pills inside Hero */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer hover:border-[#D6A63C]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D6A63C]" />
                    <span>Manage Inventory</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer hover:border-[#D6A63C]"
                  >
                    <BarChart3 className="w-4 h-4 text-[#D6A63C]" />
                    <span>Track Sales</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('offers')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer hover:border-[#D6A63C]"
                  >
                    <Tag className="w-4 h-4 text-[#D6A63C]" />
                    <span>Run Promotions</span>
                  </button>
                </div>
              </div>

              {/* High-Resolution Angled Gold Chronograph Watch Visual */}
              <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center">
                <div className="relative">
                  {/* Radial gold background glow behind watch */}
                  <div className="absolute inset-0 bg-[#D6A63C]/20 rounded-full blur-2xl transform scale-125" />
                  <img
                    src="/images/products/featured_rolex_daytona.jpg"
                    alt="Luxury Gold Chronograph Watch"
                    className="w-36 h-36 lg:w-44 lg:h-44 object-contain rounded-2xl relative z-10 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] border border-[#D6A63C]/30 bg-black/40 p-2 transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* 3. Five KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
              {/* Total Products */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Total Products</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                    <Box className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-sans text-gray-900 mt-2">320</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+8% <span className="font-normal text-gray-400">vs. last 30 days</span></span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Total Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-sans text-gray-900 mt-2">1,248</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12% <span className="font-normal text-gray-400">vs. last 30 days</span></span>
                </div>
              </div>

              {/* Total Customers */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Total Customers</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-sans text-gray-900 mt-2">5,320</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18% <span className="font-normal text-gray-400">vs. last 30 days</span></span>
                </div>
              </div>

              {/* Total Sales */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Total Sales</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-sans text-gray-900 mt-2">₹12,48,000</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+22% <span className="font-normal text-gray-400">vs. last 30 days</span></span>
                </div>
              </div>

              {/* Active Offers */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Active Offers</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                    <Tag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-sans text-gray-900 mt-2">18</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+5% <span className="font-normal text-gray-400">vs. last 30 days</span></span>
                </div>
              </div>
            </div>

            {/* 4. Middle Row (3 Cards): Sales Overview + Orders Status + Inventory Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Sales Overview Area Chart (lg:col-span-5) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#D6A63C] flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Sales Overview</h3>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    Revenue ⌵
                  </span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SALES_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="goldSalesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D6A63C" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#D6A63C" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `₹${val}L`}
                        domain={[0, 15]}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#D6A63C"
                        strokeWidth={2.5}
                        fill="url(#goldSalesGradient)"
                        dot={{ r: 3, fill: '#D6A63C', strokeWidth: 1.5, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#D6A63C', stroke: '#0B121C', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Orders Status Donut Chart (lg:col-span-3) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-3 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Box className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Orders Status</h3>
                </div>

                {/* Donut Chart with Center Legend */}
                <div className="relative h-36 flex items-center justify-center my-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ORDERS_STATUS_DATA}
                        innerRadius={36}
                        outerRadius={56}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {ORDERS_STATUS_DATA.map((entry, index) => (
                          <Cell key={`donut-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Total Count */}
                  <div className="absolute text-center pointer-events-none">
                    <p className="text-xs font-black font-sans text-gray-900 leading-tight">1,248</p>
                    <p className="text-[9px] text-gray-400 font-medium">Orders</p>
                  </div>
                </div>

                {/* Status Percentages Breakdown */}
                <div className="space-y-1.5 text-xs pt-1">
                  {ORDERS_STATUS_DATA.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </span>
                      <span className="font-bold text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Alerts List (lg:col-span-4) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Inventory Alerts</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {INVENTORY_ALERTS.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 object-contain rounded-lg bg-white border border-gray-100 p-0.5 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                          <p className="text-[10px] text-gray-400">Warehouse Zone A</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                        {prod.statusText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Bottom Row (3 Cards): Recent Orders + Top Selling Products + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Recent Orders Table (lg:col-span-5) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="pb-2.5">Order ID</th>
                        <th className="pb-2.5">Customer</th>
                        <th className="pb-2.5">Amount</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {RECENT_ORDERS_DATA.map((ord, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-2.5 font-bold font-mono text-gray-900">{ord.id}</td>
                          <td className="py-2.5 text-gray-700 font-medium">
                            <span className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-600">
                                👤
                              </span>
                              <span>{ord.customer}</span>
                            </span>
                          </td>
                          <td className="py-2.5 font-bold text-gray-900">{ord.amount}</td>
                          <td className="py-2.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ord.statusClass}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-gray-400 text-[11px] text-right">{ord.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Selling Products List (lg:col-span-3) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-3 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#D6A63C] flex items-center justify-center">
                      <Crown className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Top Selling Products</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {TOP_SELLING_PRODUCTS.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-11 h-11 object-contain rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="text-[#D6A63C]">★</span> {prod.rating} ({prod.reviews})
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCF8E9] border border-[#EADBBD] text-[#8B6A1A] whitespace-nowrap">
                        {prod.soldBadge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions 2x3 Grid (lg:col-span-4) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#D6A63C] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Quick Actions</h3>
                </div>

                <div className="grid grid-cols-3 gap-2.5 flex-1">
                  {/* Add Product */}
                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">
                      Add Product
                    </span>
                  </button>

                  {/* Update Stock */}
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">
                      Update Stock
                    </span>
                  </button>

                  {/* Create Offer */}
                  <button
                    onClick={() => setActiveTab('offers')}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">
                      Create Offer
                    </span>
                  </button>

                  {/* Upload Banner */}
                  <button
                    onClick={() => setActiveTab('banners')}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">
                      Upload Banner
                    </span>
                  </button>

                  {/* View Orders */}
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">
                      View Orders
                    </span>
                  </button>

                  {/* Generate Report */}
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-2 transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">
                      Generate Report
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex font-sans antialiased">
      {/* ════════════════════════════════════════════════════════════════
          1. FIXED LEFT SIDEBAR (Dark Navy #071426)
          ════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#071426] text-white transition-all duration-300 ease-in-out border-r border-white/10 flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-black via-[#101C2B] to-black border border-[#D6A63C]/40 flex items-center justify-center text-lg shadow-sm group-hover:border-[#D6A63C] transition-colors">
              ⌚
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-base font-extrabold tracking-tight text-white leading-none">
                  Watch<span className="text-[#D6A63C]">Hub</span>
                </h2>
                <p className="text-[9.5px] font-bold tracking-wider text-gray-400 uppercase mt-0.5">
                  Store Admin
                </p>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isProducts = item.id === 'products';
            const isActive = activeTab === item.id || (isProducts && ['products', 'add_product', 'variants', 'import_export', 'product_reviews'].includes(activeTab));

            return (
              <div key={item.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isProducts) {
                      setProductsExpanded(!productsExpanded);
                    }
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#D6A63C] text-black font-bold shadow-md shadow-[#D6A63C]/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-black' : 'text-gray-400 group-hover:text-[#D6A63C]'
                      }`}
                    />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.badge && (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.hasChevron && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            productsExpanded ? 'rotate-180' : ''
                          } ${isActive ? 'text-black' : 'text-gray-500 group-hover:text-gray-300'}`}
                        />
                      )}
                    </div>
                  )}
                </button>

                {/* Products Sub-Menu (Exact Match to Reference UI) */}
                {isProducts && productsExpanded && !sidebarCollapsed && (
                  <div className="pl-7 pr-2 py-1 space-y-1 text-xs animate-fadeIn">
                    {[
                      { id: 'products', label: 'All Products' },
                      { id: 'add_product', label: 'Add Product' },
                      { id: 'variants', label: 'Product Variants' },
                      { id: 'import_export', label: 'Bulk Import / Export' },
                      { id: 'product_reviews', label: 'Product Reviews' },
                    ].map((sub) => {
                      const isSubActive = activeTab === sub.id || (sub.id === 'products' && activeTab === 'products');
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setActiveTab('products');
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-[11px] ${
                            isSubActive
                              ? 'text-[#D6A63C] font-bold bg-white/5'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-[#D6A63C]' : 'bg-gray-500'}`} />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Links Section */}
          {!sidebarCollapsed && (
            <div className="pt-5 pb-2">
              <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Quick Links
              </p>
              <div className="space-y-1">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => {
                        setActiveTab(link.tab);
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-left"
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Upgrade to Pro Admin Card */}
          {!sidebarCollapsed && (
            <div className="pt-4 pb-2">
              <div className="rounded-2xl bg-gradient-to-br from-[#1C1608] via-[#2A1F0A] to-[#161005] border border-[#D6A63C]/30 p-4 text-white relative overflow-hidden shadow-lg group">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#D6A63C]/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-2 text-[#D6A63C] text-xs font-bold mb-1">
                  <Crown className="w-4 h-4 fill-[#D6A63C]" />
                  <span>Upgrade to Pro Admin</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-snug mb-3">
                  Unlock advanced analytics, automation & more.
                </p>
                <button
                  type="button"
                  onClick={() => setShowProUpgradeModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#D6A63C] hover:bg-[#c3973e] text-black font-extrabold text-xs flex items-center justify-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Upgrade Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          2. MAIN CONTENT AREA (Header + Body)
          ════════════════════════════════════════════════════════════════ */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-[#071426] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              className="p-1.5 text-gray-300 hover:text-[#D6A63C] rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-72 sm:w-96 hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search orders, products, customers, reports..."
                className="w-full h-9 pl-9 pr-14 text-xs rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-[#D6A63C] focus:bg-white/15 outline-none transition-all font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Store Button */}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6A63C]/40 bg-white/5 hover:bg-white/10 hover:border-[#D6A63C] text-[#D6A63C] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
              <ExternalLink className="w-3 h-3 text-[#D6A63C]/70" />
            </Link>

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={() =>
                alert(
                  '5 New Store Admin Alerts:\n• 2 New high-value Rolex orders placed\n• Low stock warning on Classic Chronograph (8 left)\n• Customer ticket #SUP-892 pending response\n• VIP Coupon drop active'
                )
              }
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#071426]">
                5
              </span>
            </button>

            {/* Settings Cog */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Store Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Pill with Fast Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-[#D6A63C]/40 text-white text-xs font-semibold py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <span className="w-5 h-5 rounded-full bg-[#D6A63C] text-black font-bold flex items-center justify-center text-[10px]">
                  👤
                </span>
                <span className="hidden sm:inline">Store Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 text-xs text-gray-800 animate-scaleUp">
                  <div className="px-3.5 py-1.5 border-b border-gray-100 text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Role Dashboard
                  </div>

                  {Object.values(ROLES)
                    .filter((r) => r !== ROLES.CUSTOMER)
                    .map((r) => {
                      const staff = MOCK_STAFF_ACCOUNTS[r];
                      const isActive = currentRole === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-amber-50 transition-colors cursor-pointer ${
                            isActive ? 'bg-amber-50/70 text-[#D6A63C] font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{staff?.avatar}</span>
                            <span>{r}</span>
                          </div>
                          {isActive && <CheckCircle className="w-3.5 h-3.5 text-[#D6A63C]" />}
                        </button>
                      );
                    })}

                  <div className="border-t border-gray-100 mt-1.5 pt-1">
                    <button
                      onClick={() => {
                        navigate('/');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🛍️</span> Customer Storefront
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setRoleMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveModule()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>WatchHub Store Admin | Enterprise E-Commerce Platform • v2.6</span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setActiveTab('settings')} className="hover:text-[#D6A63C] cursor-pointer">
              System Settings
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('reports')} className="hover:text-[#D6A63C] cursor-pointer">
              Reports & Analytics
            </button>
            <span>•</span>
            <Link to="/" className="text-[#D6A63C] hover:underline">
              Visit Customer Store
            </Link>
          </div>
        </footer>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. UPGRADE TO PRO ADMIN MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showProUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B121C] text-white rounded-2xl max-w-md w-full shadow-2xl border border-[#D6A63C]/40 p-6 relative overflow-hidden">
            <button
              onClick={() => setShowProUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-[#D6A63C] mb-2">
              <Crown className="w-5 h-5 fill-[#D6A63C]" />
              <span className="font-serif font-bold text-lg">WatchHub Pro Admin</span>
            </div>
            <p className="text-xs text-gray-300 mb-4">
              Supercharge your watch business with automated inventory reordering, AI-powered sales forecasts, and VIP multi-carrier logistics routing.
            </p>

            <div className="space-y-2 text-xs mb-5">
              {[
                'Real-Time Omnichannel Inventory Sync',
                'Automated Low-Stock Reordering with Suppliers',
                'Predictive AI Demand & Revenue Forecasting',
                'Export Custom Financial & Tax GST Ledgers',
                'Dedicated 24×7 Enterprise Support & SLA',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-200">
                  <Check className="w-4 h-4 text-[#D6A63C] flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('✨ Pro Admin Mode Activated for Demo Session!');
                  setShowProUpgradeModal(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E5B54F] hover:from-[#c3973e] hover:to-[#d4a84f] text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
              >
                Start 14-Day Free Pro Trial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDashboard;
