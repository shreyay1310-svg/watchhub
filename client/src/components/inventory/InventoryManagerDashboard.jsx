import React, { useState, useMemo } from 'react';
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
  Edit3,
  MoreVertical,
  Check,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Bell,
  Clock,
  Sparkles,
  HelpCircle,
  BarChart3,
  History,
  Layers,
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
import api from '../../services/api';

// Initial Data Matching Reference UI Exactly
const STOCK_MOVEMENT_CHART_DATA = [
  { day: '1 Nov', stockIn: 340, stockOut: 210 },
  { day: '5 Nov', stockIn: 380, stockOut: 240 },
  { day: '10 Nov', stockIn: 520, stockOut: 360 },
  { day: '15 Nov', stockIn: 610, stockOut: 390 },
  { day: '20 Nov', stockIn: 720, stockOut: 480 },
  { day: '25 Nov', stockIn: 980, stockOut: 530 },
  { day: '30 Nov', stockIn: 910, stockOut: 620 },
];

const STOCK_OVERVIEW_DATA = [
  { name: 'In Stock', value: 298, percent: 93.1, color: '#10B981' },
  { name: 'Low Stock', value: 18, percent: 5.6, color: '#F59E0B' },
  { name: 'Out of Stock', value: 10, percent: 3.1, color: '#EF4444' },
];

const INITIAL_INVENTORY_ITEMS = [
  {
    id: 'inv_001',
    productName: 'Rolex Submariner Date 41mm',
    subSpecs: 'Black Dial • Stainless Steel',
    sku: 'WH-ROL-001',
    category: 'Luxury',
    brand: 'Rolex',
    warehouse: 'Main',
    warehouseFullName: 'Main Warehouse',
    currentStock: 24,
    reservedStock: 3,
    availableStock: 21,
    minLevel: 5,
    status: 'In Stock',
    lastUpdated: '05 Nov, 11:25 AM',
    image: '/images/products/featured_rolex_submariner.jpg',
  },
  {
    id: 'inv_002',
    productName: 'Rolex Cosmograph Daytona',
    subSpecs: 'Gold Dial • 40 mm',
    sku: 'WH-ROL-002',
    category: 'Luxury',
    brand: 'Rolex',
    warehouse: 'Main',
    warehouseFullName: 'Main Warehouse',
    currentStock: 18,
    reservedStock: 2,
    availableStock: 16,
    minLevel: 5,
    status: 'In Stock',
    lastUpdated: '05 Nov, 10:40 AM',
    image: '/images/products/featured_rolex_daytona.jpg',
  },
  {
    id: 'inv_003',
    productName: 'Omega Speedmaster Professional',
    subSpecs: 'Black Dial • 42 mm',
    sku: 'WH-OMG-001',
    category: 'Men\'s',
    brand: 'Omega',
    warehouse: 'Delhi',
    warehouseFullName: 'Delhi Warehouse',
    currentStock: 8,
    reservedStock: 1,
    availableStock: 7,
    minLevel: 10,
    status: 'Low Stock',
    lastUpdated: '04 Nov, 06:15 PM',
    image: '/images/products/featured_omega_speedmaster.jpg',
  },
  {
    id: 'inv_004',
    productName: 'Omega Seamaster Diver 300M',
    subSpecs: 'Blue Dial • 42 mm',
    sku: 'WH-OMG-002',
    category: 'Sports',
    brand: 'Omega',
    warehouse: 'Main',
    warehouseFullName: 'Main Warehouse',
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minLevel: 5,
    status: 'Out of Stock',
    lastUpdated: '04 Nov, 02:10 PM',
    image: '/images/products/featured_omega_seamaster.jpg',
  },
  {
    id: 'inv_005',
    productName: 'Cartier Tank Must',
    subSpecs: 'White Dial • 33 mm',
    sku: 'WH-CAR-001',
    category: 'Women\'s',
    brand: 'Cartier',
    warehouse: 'Mumbai',
    warehouseFullName: 'Mumbai Warehouse',
    currentStock: 12,
    reservedStock: 2,
    availableStock: 10,
    minLevel: 5,
    status: 'In Stock',
    lastUpdated: '03 Nov, 04:20 PM',
    image: '/images/products/featured_cartier_tank.jpg',
  },
  {
    id: 'inv_006',
    productName: 'Patek Philippe Nautilus 5711',
    subSpecs: 'Blue Dial • 40 mm',
    sku: 'WH-PP-001',
    category: 'Luxury',
    brand: 'Patek Philippe',
    warehouse: 'Main',
    warehouseFullName: 'Main Warehouse',
    currentStock: 5,
    reservedStock: 1,
    availableStock: 4,
    minLevel: 3,
    status: 'In Stock',
    lastUpdated: '02 Nov, 03:15 PM',
    image: '/images/products/featured_patek_nautilus.jpg',
  },
  {
    id: 'inv_007',
    productName: 'Apple Watch Series 10',
    subSpecs: 'Midnight Aluminium • 46 mm',
    sku: 'WH-APL-001',
    category: 'Smartwatches',
    brand: 'Apple',
    warehouse: 'Delhi',
    warehouseFullName: 'Delhi Warehouse',
    currentStock: 28,
    reservedStock: 4,
    availableStock: 24,
    minLevel: 10,
    status: 'In Stock',
    lastUpdated: '01 Nov, 05:40 PM',
    image: '/images/products/featured_apple_watch.jpg',
  },
];

export default function InventoryManagerDashboard({
  activeSidebarTab = 'dashboard',
  selectedWarehouseFilter = 'All Warehouses',
  searchQuery = '',
}) {
  // Tabs: All Inventory (320), In Stock (298), Low Stock (18), Out of Stock (10), Stock Movements
  const [activeTableTab, setActiveTableTab] = useState('All');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  // Table Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterWarehouse, setFilterWarehouse] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Live Inventory State
  const [items, setItems] = useState(INITIAL_INVENTORY_ITEMS);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWarehousesModal, setShowWarehousesModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeItemForDetail, setActiveItemForDetail] = useState(null);

  // Forms
  const [addForm, setAddForm] = useState({
    sku: 'WH-ROL-001',
    warehouse: 'Main Warehouse',
    quantity: 10,
    supplier: 'Rolex Geneva SA (Direct)',
    reference: 'PO-2026-8841',
  });

  const [adjustForm, setAdjustForm] = useState({
    sku: 'WH-OMG-001',
    warehouse: 'Delhi Warehouse',
    adjustType: 'add',
    quantity: 5,
    reason: 'Audit Inventory Reconciliation',
  });

  const [transferForm, setTransferForm] = useState({
    sku: 'WH-ROL-001',
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Delhi Warehouse',
    quantity: 4,
    notes: 'Regional demand replenishment',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Inventory calculation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Global header search or table search
      const q = (tableSearch || searchQuery).trim().toLowerCase();
      if (q) {
        const matches =
          item.productName.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Warehouse from header or table dropdown
      if (
        selectedWarehouseFilter !== 'All Warehouses' &&
        item.warehouseFullName !== selectedWarehouseFilter &&
        item.warehouse !== selectedWarehouseFilter
      ) {
        return false;
      }

      if (filterWarehouse !== 'All' && item.warehouse !== filterWarehouse && item.warehouseFullName !== filterWarehouse) {
        return false;
      }

      // Category
      if (filterCategory !== 'All' && item.category !== filterCategory) return false;

      // Brand
      if (filterBrand !== 'All' && item.brand !== filterBrand) return false;

      // Stock Status Tab or filter
      if (activeTableTab === 'In Stock' && item.status !== 'In Stock') return false;
      if (activeTableTab === 'Low Stock' && item.status !== 'Low Stock') return false;
      if (activeTableTab === 'Out of Stock' && item.status !== 'Out of Stock') return false;

      if (filterStatus !== 'All' && item.status !== filterStatus) return false;

      return true;
    });
  }, [items, searchQuery, tableSearch, selectedWarehouseFilter, filterWarehouse, filterCategory, filterBrand, filterStatus, activeTableTab]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedItems.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleResetFilters = () => {
    setTableSearch('');
    setFilterCategory('All');
    setFilterBrand('All');
    setFilterWarehouse('All');
    setFilterStatus('All');
    setActiveTableTab('All');
    setCurrentPage(1);
    showToast('Filters reset to default view.');
  };

  // Add stock action
  const handleAddStockSubmit = (e) => {
    e.preventDefault();
    const qty = Number(addForm.quantity);
    if (!qty || qty <= 0) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.sku === addForm.sku) {
          const newCurrent = item.currentStock + qty;
          const newAvail = item.availableStock + qty;
          return {
            ...item,
            currentStock: newCurrent,
            availableStock: newAvail,
            status: newCurrent > item.minLevel ? 'In Stock' : 'Low Stock',
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );

    setShowAddStockModal(false);
    showToast(`Successfully added ${qty} units to ${addForm.sku} (${addForm.warehouse})!`);
  };

  // Adjust stock action
  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    const qty = Number(adjustForm.quantity);
    if (!qty || qty <= 0) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.sku === adjustForm.sku) {
          const delta = adjustForm.adjustType === 'add' ? qty : -qty;
          const newCurrent = Math.max(0, item.currentStock + delta);
          const newAvail = Math.max(0, item.availableStock + delta);
          return {
            ...item,
            currentStock: newCurrent,
            availableStock: newAvail,
            status: newCurrent === 0 ? 'Out of Stock' : newCurrent <= item.minLevel ? 'Low Stock' : 'In Stock',
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );

    setShowAdjustStockModal(false);
    showToast(`Stock adjusted for ${adjustForm.sku}: ${adjustForm.adjustType === 'add' ? '+' : '-'}${qty} units.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Product,SKU,Category,Warehouse,CurrentStock,Reserved,Available,MinLevel,Status,LastUpdated\n'];
    const rows = filteredItems.map(
      (i) =>
        `"${i.productName}","${i.sku}","${i.category}","${i.warehouse}",${i.currentStock},${i.reservedStock},${i.availableStock},${i.minLevel},"${i.status}","${i.lastUpdated}"\n`
    );
    const blob = new Blob([headers.join(''), ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WatchHub_Inventory_${Date.now()}.csv`;
    a.click();
    showToast('Inventory report exported as CSV!');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#071426] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#D6A63C]/50 flex items-center gap-3 animate-slide-in text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#D6A63C]" />
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. TITLE & TOP ACTIONS ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Yellow/Gold warehouse building icon in rounded container */}
          <div className="w-11 h-11 rounded-2xl bg-[#D6A63C]/15 border border-[#D6A63C]/30 text-[#D6A63C] flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#071426] tracking-tight">
              Inventory Manager Dashboard
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Monitor stock, manage warehouses, track movements and ensure product availability.
            </p>
          </div>
        </div>

        {/* Top Right: Date Range & Primary '+ Add Stock' Button */}
        <div className="flex items-center gap-3">
          {/* Date Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateRangeOpen(!dateRangeOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-300 shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {dateRangeOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-20 text-xs">
                {['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'This Year'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setDateRange(range);
                      setDateRangeOpen(false);
                      showToast(`Filtered for ${range}`);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-gray-50 transition-colors ${
                      dateRange === range ? 'text-[#D6A63C] font-bold bg-amber-50/50' : 'text-gray-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Golden Button: + Add Stock */}
          <button
            type="button"
            onClick={() => setShowAddStockModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49532] text-[#071426] text-xs font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* 2. FIVE KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Stock Units */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 15 Q 15 18, 30 10 T 60 5" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Total Stock Units</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-[#071426]">12,840</span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                ↑ +12%
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: In-Stock Products */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 16 Q 15 14, 30 8 T 60 4" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">In-Stock Products</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-[#071426]">298</span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                ↑ +10%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Items */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 6 Q 15 8, 30 14 T 60 18" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Low Stock Items</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-[#071426]">18</span>
              <span className="text-[11px] font-bold text-red-500 flex items-center">
                ↓ -22%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center text-[10px] font-black">
                !
              </div>
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 8 Q 15 10, 30 15 T 60 17" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Out of Stock</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-[#071426]">10</span>
              <span className="text-[11px] font-bold text-red-500 flex items-center">
                ↓ -9%
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Total Stock Value */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="text-sm font-black">₹</span>
            </div>
            <div className="h-6 w-16">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <path d="M 0 15 Q 15 12, 30 7 T 60 3" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Total Stock Value</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-black text-[#071426] truncate">₹8,42,90,000</span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center shrink-0">
                ↑ +15%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ANALYTICS ROW (3 CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel A: Stock Status Overview Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-[#071426]">Stock Status Overview</h3>
            <span className="text-[11px] text-gray-400 font-medium">Real-time</span>
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
                <span className="text-base font-black text-[#071426] leading-none">320</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  Products
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-gray-600 text-[11px] font-medium">In Stock (298)</span>
                </div>
                <span className="font-bold text-[#071426] text-[11px]">93.1%</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-gray-600 text-[11px] font-medium">Low Stock (18)</span>
                </div>
                <span className="font-bold text-[#071426] text-[11px]">5.6%</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-gray-600 text-[11px] font-medium">Out of Stock (10)</span>
                </div>
                <span className="font-bold text-[#071426] text-[11px]">3.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel B: Stock Movement (Last 30 Days) Area Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-sm text-[#071426]">Stock Movement</h3>
              <span className="text-[11px] text-gray-400 font-medium">(Last 30 Days)</span>
            </div>
            {/* Legend: Stock In / Stock Out */}
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-gray-600">Stock In</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-gray-600">Stock Out</span>
              </div>
            </div>
          </div>

          <div className="h-40 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STOCK_MOVEMENT_CHART_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="invGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="invPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} ticks={[0, 250, 500, 750, 1000]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071426',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="stockIn" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#invGreen)" />
                <Area type="monotone" dataKey="stockOut" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#invPurple)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel C: Warehouse Stock Summary (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-[#071426]">Warehouse Stock Summary</h3>
            <button
              type="button"
              onClick={() => setShowWarehousesModal(true)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
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
                  <Building2 className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-bold text-[#071426]">Main Warehouse</span>
                </div>
                <span className="font-black text-gray-700">68%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span>Gurugram Central Vault</span>
                <span className="font-semibold text-gray-800">8,420 Units</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Delhi Warehouse */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-bold text-[#071426]">Delhi Warehouse</span>
                </div>
                <span className="font-black text-gray-700">21%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span>Okhla Phase III Hub</span>
                <span className="font-semibold text-gray-800">2,640 Units</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '21%' }} />
              </div>
            </div>

            {/* Mumbai Warehouse */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-bold text-[#071426]">Mumbai Warehouse</span>
                </div>
                <span className="font-black text-gray-700">11%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                <span>BKC Logistics Park</span>
                <span className="font-semibold text-gray-800">1,780 Units</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '11%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INVENTORY TABLE TABS ROW */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => {
            setActiveTableTab('All');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTableTab === 'All'
              ? 'bg-[#071426] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Box className={`w-3.5 h-3.5 ${activeTableTab === 'All' ? 'text-[#D6A63C]' : 'text-gray-400'}`} />
          <span>All Inventory (320)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTableTab('In Stock');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTableTab === 'In Stock'
              ? 'bg-[#071426] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>In Stock (298)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTableTab('Low Stock');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTableTab === 'Low Stock'
              ? 'bg-[#071426] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Low Stock (18)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTableTab('Out of Stock');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTableTab === 'Out of Stock'
              ? 'bg-[#071426] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <X className="w-3.5 h-3.5 text-red-500" />
          <span>Out of Stock (10)</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAdjustStockModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all cursor-pointer ml-auto"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
          <span>Stock Movements</span>
        </button>
      </div>

      {/* 5. SEARCH & MULTI-FILTER BAR */}
      <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => {
              setTableSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Product Name, SKU or Brand..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-[#D6A63C]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">Category (All)</option>
            <option value="Luxury">Luxury</option>
            <option value="Men's">Men's</option>
            <option value="Women's">Women's</option>
            <option value="Sports">Sports</option>
            <option value="Smartwatches">Smartwatches</option>
          </select>

          {/* Brand Dropdown */}
          <select
            value={filterBrand}
            onChange={(e) => {
              setFilterBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">Brand (All)</option>
            <option value="Rolex">Rolex</option>
            <option value="Omega">Omega</option>
            <option value="Cartier">Cartier</option>
            <option value="Patek Philippe">Patek Philippe</option>
            <option value="Apple">Apple</option>
          </select>

          {/* Warehouse Dropdown */}
          <select
            value={filterWarehouse}
            onChange={(e) => {
              setFilterWarehouse(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">Warehouse (All)</option>
            <option value="Main">Main Warehouse</option>
            <option value="Delhi">Delhi Warehouse</option>
            <option value="Mumbai">Mumbai Warehouse</option>
          </select>

          {/* Stock Status Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">Stock Status (All)</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold transition-colors cursor-pointer"
            title="Reset Filters"
          >
            Reset
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#071426] text-white hover:bg-[#0c2242] font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D6A63C]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 6. MAIN INVENTORY TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#071426] focus:ring-[#D6A63C]"
                  />
                </th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Warehouse</th>
                <th className="py-3 px-3 text-center">Current Stock</th>
                <th className="py-3 px-3 text-center">Reserved</th>
                <th className="py-3 px-3 text-center">Available</th>
                <th className="py-3 px-3 text-center">Min. Level</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-500">
                    <Boxes className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No inventory items matched your filter.</p>
                    <p className="text-xs text-gray-400 mt-1">Try resetting filters or changing the search keyword.</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="rounded border-gray-300 text-[#071426] focus:ring-[#D6A63C]"
                      />
                    </td>

                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = '/images/products/featured_rolex_submariner.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-[#071426] text-xs leading-tight truncate">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">
                            {item.subSpecs}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-3 font-semibold text-gray-600 font-mono text-[11px]">
                      {item.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-gray-600 font-medium">
                      {item.category}
                    </td>

                    {/* Warehouse */}
                    <td className="py-3 px-3 text-gray-700 font-semibold">
                      {item.warehouse}
                    </td>

                    {/* Current Stock */}
                    <td className="py-3 px-3 text-center font-black text-[#071426] text-sm">
                      {item.currentStock}
                    </td>

                    {/* Reserved */}
                    <td className="py-3 px-3 text-center font-semibold text-gray-500">
                      {item.reservedStock}
                    </td>

                    {/* Available */}
                    <td className="py-3 px-3 text-center font-bold text-emerald-600">
                      {item.availableStock}
                    </td>

                    {/* Min. Level */}
                    <td className="py-3 px-3 text-center font-semibold text-gray-400">
                      {item.minLevel}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                      {item.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-400">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemForDetail(item);
                          }}
                          className="p-1 hover:text-[#071426] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Product Stock Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAdjustForm({
                              ...adjustForm,
                              sku: item.sku,
                              warehouse: item.warehouseFullName,
                            });
                            setShowAdjustStockModal(true);
                          }}
                          className="p-1 hover:text-[#D6A63C] hover:bg-amber-50 rounded-lg transition-colors"
                          title="Adjust Stock Quantity"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTransferForm({
                              ...transferForm,
                              sku: item.sku,
                              fromWarehouse: item.warehouseFullName,
                            });
                            setShowTransferModal(true);
                          }}
                          className="p-1 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Warehouse Stock Transfer"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 7. TABLE FOOTER & PAGINATION */}
        <div className="bg-gray-50/80 border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span>Showing 1-5 of 320 products</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-hidden"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-[#D6A63C] text-[#071426] font-extrabold text-xs flex items-center justify-center shadow-xs"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(4)}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50"
            >
              4
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button
              type="button"
              onClick={() => setCurrentPage(64)}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50"
            >
              64
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────── MODALS ──────────────── */}

      {/* MODAL 1: ADD STOCK MODAL */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D6A63C] flex items-center justify-center font-bold">
                  +📦
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#071426]">Add Inbound Stock Entry</h3>
                  <p className="text-[11px] text-gray-400">Log incoming purchase shipment into warehouse</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStockModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-3.5 pt-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Select Timepiece / SKU</label>
                <select
                  value={addForm.sku}
                  onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                >
                  {items.map((i) => (
                    <option key={i.sku} value={i.sku}>
                      {i.productName} ({i.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Destination Warehouse</label>
                  <select
                    value={addForm.warehouse}
                    onChange={(e) => setAddForm({ ...addForm, warehouse: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Main Warehouse">Main Warehouse (Gurugram)</option>
                    <option value="Delhi Warehouse">Delhi Warehouse (Okhla)</option>
                    <option value="Mumbai Warehouse">Mumbai Warehouse (BKC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Units Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={addForm.quantity}
                    onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Supplier / Brand Partner</label>
                  <input
                    type="text"
                    value={addForm.supplier}
                    onChange={(e) => setAddForm({ ...addForm, supplier: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">PO Reference Number</label>
                  <input
                    type="text"
                    value={addForm.reference}
                    onChange={(e) => setAddForm({ ...addForm, reference: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D6A63C] text-[#071426] font-extrabold shadow-sm hover:bg-[#c49532]"
                >
                  Confirm Stock Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: STOCK ADJUSTMENT MODAL */}
      {showAdjustStockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#D6A63C]" />
                <h3 className="font-extrabold text-sm text-[#071426]">Stock Adjustment</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdjustStockModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3 pt-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={adjustForm.sku}
                  disabled
                  className="w-full p-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Adjustment Type</label>
                  <select
                    value={adjustForm.adjustType}
                    onChange={(e) => setAdjustForm({ ...adjustForm, adjustType: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="add">Increase (+) Stock</option>
                    <option value="reduce">Decrease (-) Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustForm.quantity}
                    onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Audit Reason</label>
                <select
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                >
                  <option value="Audit Inventory Reconciliation">Audit Inventory Reconciliation</option>
                  <option value="Damaged in Transit">Damaged in Transit</option>
                  <option value="Customer Return Restocking">Customer Return Restocking</option>
                  <option value="Showroom Display Allocation">Showroom Display Allocation</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustStockModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#071426] text-white font-bold"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: WAREHOUSE TRANSFER */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm text-[#071426]">Warehouse Transfer</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Product SKU</label>
                <input
                  type="text"
                  value={transferForm.sku}
                  disabled
                  className="w-full p-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Source Hub</label>
                  <input
                    type="text"
                    value={transferForm.fromWarehouse}
                    disabled
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Destination Hub</label>
                  <select
                    value={transferForm.toWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Delhi Warehouse">Delhi Warehouse</option>
                    <option value="Mumbai Warehouse">Mumbai Warehouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Quantity to Move</label>
                <input
                  type="number"
                  min="1"
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferModal(false);
                    showToast(`Dispatched transfer of ${transferForm.quantity} units to ${transferForm.toWarehouse}!`);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Dispatch Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PRODUCT DETAIL PREVIEW */}
      {activeItemForDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-bold text-[#071426]">Stock Details</span>
              <button
                type="button"
                onClick={() => setActiveItemForDetail(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gray-50 p-2 border border-gray-100 mb-3">
                <img
                  src={activeItemForDetail.image}
                  alt={activeItemForDetail.productName}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="font-extrabold text-sm text-[#071426]">{activeItemForDetail.productName}</h4>
              <p className="text-gray-500 text-[11px] font-mono mt-0.5">{activeItemForDetail.sku}</p>
            </div>
            <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Warehouse:</span>
                <span className="font-bold text-gray-800">{activeItemForDetail.warehouseFullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Stock:</span>
                <span className="font-bold text-gray-800">{activeItemForDetail.currentStock} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reserved for Orders:</span>
                <span className="font-bold text-amber-600">{activeItemForDetail.reservedStock} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Available to Sell:</span>
                <span className="font-bold text-emerald-600">{activeItemForDetail.availableStock} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reorder Threshold:</span>
                <span className="font-bold text-gray-800">{activeItemForDetail.minLevel} Units</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setActiveItemForDetail(null)}
                className="w-full py-2 rounded-xl bg-[#071426] text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
