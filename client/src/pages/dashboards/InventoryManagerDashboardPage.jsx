import React, { useState, useMemo } from 'react';
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
  Boxes,
  Box,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ExternalLink,
  Calendar,
  Filter,
  RefreshCw,
  Plus,
  ArrowRightLeft,
  Truck,
  Download,
  Upload,
  FileSpreadsheet,
  Check,
  Eye,
  Edit3,
  MoreVertical,
  MapPin,
  Building2,
  ClipboardList,
  Clock,
  Sparkles,
  HelpCircle,
  Menu,
  Crown,
  History,
  Folder,
  Tag,
  Image as ImageIcon,
  Star,
  BarChart3,
  Factory,
  ShieldCheck,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

// Brand icon helper
const BRAND_LOGOS = {
  Rolex: '👑',
  Omega: 'Ω',
  'Patek Philippe': '⚜️',
  'Audemars Piguet': 'AP',
  Cartier: 'C',
  Apple: '🍎',
  'Tag Heuer': '🏁',
  Seiko: 'S',
};

// Stock Movement Trend Chart Data (Matching exact curves in reference UI)
const STOCK_MOVEMENT_CHART_DATA = [
  { day: '1 Nov', stockIn: 340, stockOut: 210 },
  { day: '5 Nov', stockIn: 380, stockOut: 240 },
  { day: '10 Nov', stockIn: 520, stockOut: 360 },
  { day: '15 Nov', stockIn: 610, stockOut: 390 },
  { day: '20 Nov', stockIn: 720, stockOut: 480 },
  { day: '25 Nov', stockIn: 980, stockOut: 530 },
  { day: '30 Nov', stockIn: 910, stockOut: 620 },
];

// Stock Overview Donut Chart Data
const STOCK_OVERVIEW_DATA = [
  { name: 'In Stock', value: 298, percent: 93.1, color: '#10B981' },
  { name: 'Low Stock', value: 18, percent: 5.6, color: '#F59E0B' },
  { name: 'Out of Stock', value: 10, percent: 3.1, color: '#EF4444' },
];

// Initial Products Inventory Data (Matching table in reference UI)
const INITIAL_INVENTORY_ITEMS = [
  {
    id: 'inv_rol_001',
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
    lastUpdated: '05 Nov 2026, 11:25 AM',
    image: '/images/products/featured_rolex_submariner.jpg',
  },
  {
    id: 'inv_rol_002',
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
    lastUpdated: '05 Nov 2026, 10:40 AM',
    image: '/images/products/featured_rolex_daytona.jpg',
  },
  {
    id: 'inv_omg_001',
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
    lastUpdated: '04 Nov 2026, 06:15 PM',
    image: '/images/products/featured_omega_speedmaster.jpg',
  },
  {
    id: 'inv_omg_002',
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
    lastUpdated: '04 Nov 2026, 02:10 PM',
    image: '/images/products/featured_omega_seamaster.jpg',
  },
  {
    id: 'inv_car_001',
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
    lastUpdated: '03 Nov 2026, 04:20 PM',
    image: '/images/products/featured_cartier_tank.jpg',
  },
];

// Low Stock Alerts Widget Data (Right sidebar card in reference UI)
const LOW_STOCK_ALERTS = [
  {
    name: 'Omega Speedmaster',
    stockLeft: 7,
    minThreshold: 10,
    image: '/images/products/featured_omega_speedmaster.jpg',
  },
  {
    name: 'Tag Heuer Carrera',
    stockLeft: 6,
    minThreshold: 10,
    image: '/images/products/featured_ap_royal_oak.jpg',
  },
  {
    name: 'Seiko Prospex',
    stockLeft: 8,
    minThreshold: 15,
    image: '/images/products/featured_omega_seamaster.jpg',
  },
];

// Warehouses Data
const WAREHOUSE_LIST = [
  {
    id: 'Main',
    name: 'Main Warehouse',
    units: '8,420 Units',
    count: 8420,
    isPrimary: true,
    location: 'Gurugram Central Vault',
    capacity: '10,000 Units (84.2% full)',
  },
  {
    id: 'Delhi',
    name: 'Delhi Warehouse',
    units: '2,640 Units',
    count: 2640,
    isPrimary: false,
    location: 'Okhla Phase III Hub',
    capacity: '4,000 Units (66% full)',
  },
  {
    id: 'Mumbai',
    name: 'Mumbai Warehouse',
    units: '1,780 Units',
    count: 1780,
    isPrimary: false,
    location: 'BKC Logistics Park',
    capacity: '3,000 Units (59.3% full)',
  },
];

export default function InventoryManagerDashboardPage() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'inStock' | 'lowStock' | 'outOfStock' | 'movements' | 'reorder'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Table Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Inventory Master State
  const [inventoryItems, setInventoryItems] = useState(INITIAL_INVENTORY_ITEMS);

  // Modals State
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showWarehousesModal, setShowWarehousesModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [activeItemForAction, setActiveItemForAction] = useState(null);

  // Operations Form State
  const [addStockForm, setAddStockForm] = useState({
    sku: 'WH-ROL-001',
    quantity: 10,
    warehouse: 'Main Warehouse',
    supplier: 'Rolex Geneva SA (Direct)',
    purchaseRef: 'PO-2026-9042',
    unitCost: 12000,
    remarks: 'Pre-festive buffer stock replenishment',
  });

  const [adjustStockForm, setAdjustStockForm] = useState({
    sku: 'WH-ROL-001',
    adjustmentType: 'increase', // 'increase' | 'decrease'
    quantity: 1,
    reason: 'Count Discrepancy Correction',
    remarks: 'Verified physical safe count',
  });

  const [transferForm, setTransferForm] = useState({
    sku: 'WH-ROL-001',
    fromWarehouse: 'Main Warehouse',
    toWarehouse: 'Delhi Warehouse',
    quantity: 5,
    transferRef: 'TRF-2026-105',
    reason: 'High regional demand in Delhi NCR',
  });

  const [reorderForm, setReorderForm] = useState({
    sku: 'WH-OMG-002',
    productName: 'Omega Seamaster Diver 300M',
    suggestedQty: 25,
    supplier: 'Swatch Group India Pvt Ltd',
    notes: 'Urgent restocking: currently 0 available in stock',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. KPI Statistics (Matching reference UI)
  const kpis = {
    totalUnits: '12,840',
    totalUnitsChange: '+12%',
    inStock: 298,
    inStockChange: '+10%',
    lowStock: 18,
    lowStockChange: '-22%',
    outOfStock: 10,
    outOfStockChange: '-9%',
    stockValue: '₹8,42,90,000',
    stockValueChange: '+15%',
  };

  // 2. Filter Products
  const filteredInventory = useMemo(() => {
    return inventoryItems.filter((item) => {
      // Tab Filter
      if (activeTab === 'inStock' && item.status !== 'In Stock') return false;
      if (activeTab === 'lowStock' && item.status !== 'Low Stock') return false;
      if (activeTab === 'outOfStock' && item.status !== 'Out of Stock') return false;

      // Text Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = item.productName.toLowerCase().includes(q);
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }

      // Dropdowns
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (brandFilter !== 'All' && item.brand !== brandFilter) return false;
      if (warehouseFilter !== 'All' && item.warehouse !== warehouseFilter) return false;
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;

      return true;
    });
  }, [inventoryItems, activeTab, searchTerm, categoryFilter, brandFilter, warehouseFilter, statusFilter]);

  // Paginated Slice
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInventory.slice(start, start + itemsPerPage);
  }, [filteredInventory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage) || 1;

  // Handle Add Stock Action
  const handleAddStockSubmit = (e) => {
    e.preventDefault();
    const qty = Number(addStockForm.quantity);
    if (!qty || qty <= 0) return;

    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.sku === addStockForm.sku) {
          const newCurrent = item.currentStock + qty;
          return {
            ...item,
            currentStock: newCurrent,
            availableStock: newCurrent - item.reservedStock,
            status: newCurrent > item.minLevel ? 'In Stock' : 'Low Stock',
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );

    showToast(`Added ${qty} units to ${addStockForm.sku}! Stock updated.`);
    setShowAddStockModal(false);
  };

  // Handle Adjust Stock Action
  const handleAdjustStockSubmit = (e) => {
    e.preventDefault();
    const qty = Number(adjustStockForm.quantity);
    if (!qty || qty <= 0) return;

    const item = inventoryItems.find((i) => i.sku === adjustStockForm.sku);
    if (!item) return;

    if (adjustStockForm.adjustmentType === 'decrease' && item.currentStock < qty) {
      alert(`Cannot decrease by ${qty}. Current stock is only ${item.currentStock}.`);
      return;
    }

    setInventoryItems((prev) =>
      prev.map((it) => {
        if (it.sku === adjustStockForm.sku) {
          const newCurrent =
            adjustStockForm.adjustmentType === 'increase'
              ? it.currentStock + qty
              : it.currentStock - qty;
          const status =
            newCurrent === 0 ? 'Out of Stock' : newCurrent <= it.minLevel ? 'Low Stock' : 'In Stock';
          return {
            ...it,
            currentStock: newCurrent,
            availableStock: Math.max(0, newCurrent - it.reservedStock),
            status,
            lastUpdated: 'Just now',
          };
        }
        return it;
      })
    );

    showToast(`Stock adjusted for ${adjustStockForm.sku} (${adjustStockForm.adjustmentType === 'increase' ? '+' : '-'}${qty})`);
    setShowAdjustStockModal(false);
  };

  // Handle Transfer Stock Action
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const qty = Number(transferForm.quantity);
    if (!qty || qty <= 0) return;

    if (transferForm.fromWarehouse === transferForm.toWarehouse) {
      alert('Source and destination warehouses cannot be identical.');
      return;
    }

    showToast(`Transfer order ${transferForm.transferRef} dispatched: ${qty} units from ${transferForm.fromWarehouse} → ${transferForm.toWarehouse}`);
    setShowTransferModal(false);
  };

  // Handle Reorder Request
  const handleReorderSubmit = (e) => {
    e.preventDefault();
    showToast(`Purchase Request submitted for ${reorderForm.productName} (${reorderForm.suggestedQty} units)`);
    setShowReorderModal(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['SKU', 'Product', 'Category', 'Warehouse', 'CurrentStock', 'Reserved', 'Available', 'MinLevel', 'Status', 'LastUpdated'];
    const rows = filteredInventory.map((i) => [
      i.sku,
      `"${i.productName.replace(/"/g, '""')}"`,
      i.category,
      i.warehouse,
      i.currentStock,
      i.reservedStock,
      i.availableStock,
      i.minLevel,
      i.status,
      `"${i.lastUpdated}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `WatchHub_Inventory_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setImportExportOpen(false);
    showToast('Inventory Report successfully exported to CSV!');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex font-sans antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B121C] text-white px-4 py-3 rounded-xl border border-[#D6A63C] shadow-2xl flex items-center gap-3 text-xs animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-[#D6A63C]" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          1. FIXED LEFT SIDEBAR (Dark Navy #071426)
          ════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#071426] text-white transition-all duration-300 ease-in-out border-r border-white/10 flex flex-col ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <Link to="/inventory-manager/dashboard" className="flex items-center gap-3 group">
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
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10 text-xs">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors"
          >
            <Boxes className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>

          {/* Products */}
          <Link
            to="/admin/products"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors"
          >
            <div className="flex items-center gap-3 truncate">
              <Box className="w-4 h-4 text-gray-400" />
              {!sidebarCollapsed && <span>Products</span>}
            </div>
            {!sidebarCollapsed && <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
          </Link>

          {/* Categories */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <Folder className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Categories</span>}
          </button>

          {/* INVENTORY (Active Primary Tab) */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('all')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#D6A63C] text-black font-extrabold shadow-md shadow-[#D6A63C]/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4 text-black" />
                {!sidebarCollapsed && <span>Inventory</span>}
              </div>
            </button>

            {/* Sub-items matching reference UI */}
            {!sidebarCollapsed && (
              <div className="pl-7 pr-2 py-1 space-y-1 text-xs animate-fadeIn">
                {[
                  { id: 'all', label: 'Inventory Manager' },
                  { id: 'movements', label: 'Stock Movements' },
                  { id: 'adjustments', label: 'Stock Adjustments', action: () => setShowAdjustStockModal(true) },
                  { id: 'warehouses', label: 'Warehouses', action: () => setShowWarehousesModal(true) },
                  { id: 'reorder', label: 'Reorder Alerts' },
                ].map((sub) => {
                  const isSubActive =
                    activeTab === sub.id || (sub.id === 'all' && ['all', 'inStock', 'lowStock', 'outOfStock'].includes(activeTab));
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        if (sub.action) {
                          sub.action();
                        } else {
                          setActiveTab(sub.id);
                        }
                      }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-[11px] ${
                        isSubActive ? 'text-[#D6A63C] font-bold bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
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

          {/* Orders */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              {!sidebarCollapsed && <span>Orders</span>}
            </div>
            {!sidebarCollapsed && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                24
              </span>
            )}
          </button>

          {/* Customers */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <Box className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Customers</span>}
          </button>

          {/* Offers & Coupons */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <Tag className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Offers & Coupons</span>}
          </button>

          {/* Banners & Promotions */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Banners & Promotions</span>}
          </button>

          {/* Reviews & Ratings */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <Star className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Reviews & Ratings</span>}
          </button>

          {/* Reports & Analytics */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Reports & Analytics</span>}
          </button>

          {/* Manufacturing Hub */}
          <Link
            to="/manufacturing-hub"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors"
          >
            <Factory className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Manufacturing Hub</span>}
          </Link>

          {/* Store Settings */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            {!sidebarCollapsed && <span>Store Settings</span>}
          </button>

          {/* Need Help Card (Bottom Left in Reference UI) */}
          {!sidebarCollapsed && (
            <div className="pt-6 pb-2">
              <div className="rounded-2xl bg-gradient-to-br from-[#1C1608] via-[#2A1F0A] to-[#161005] border border-[#D6A63C]/30 p-4 text-white relative overflow-hidden shadow-lg">
                <div className="flex items-center gap-2 text-[#D6A63C] text-xs font-bold mb-1">
                  <Crown className="w-4 h-4 fill-[#D6A63C]" />
                  <span>Need Help?</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-snug mb-3">
                  Inventory setup, stock sync & warehouse support.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="w-full py-2 px-3 rounded-lg bg-[#D6A63C] hover:bg-[#c3973e] text-black font-extrabold text-xs flex items-center justify-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Contact Support</span>
                  <span>→</span>
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
          2. MAIN WORKSPACE (Header + Body)
          ════════════════════════════════════════════════════════════════ */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-[#071426] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-64 sm:w-80 md:w-96 hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, SKU, orders, warehouses..."
                className="w-full h-9 pl-9 pr-14 text-xs rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-[#D6A63C] focus:bg-white/15 outline-none transition-all font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Warehouse Quick Selector */}
            <select
              value={selectedWarehouseFilter}
              onChange={(e) => setSelectedWarehouseFilter(e.target.value)}
              className="hidden xl:block h-8 px-2.5 rounded-lg border border-white/15 bg-white/10 text-white text-[11px] font-semibold focus:outline-none focus:border-[#D6A63C]"
            >
              <option value="All" className="text-gray-900">All Warehouses</option>
              <option value="Main" className="text-gray-900">Main Warehouse (Gurugram)</option>
              <option value="Delhi" className="text-gray-900">Delhi Warehouse (Okhla)</option>
              <option value="Mumbai" className="text-gray-900">Mumbai Warehouse (BKC)</option>
            </select>

            {/* View Store */}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6A63C]/40 bg-white/5 hover:bg-white/10 hover:border-[#D6A63C] text-[#D6A63C] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
              <ExternalLink className="w-3 h-3 text-[#D6A63C]/70" />
            </Link>

            {/* Notifications */}
            <button
              type="button"
              onClick={() =>
                alert(
                  '📦 Inventory Alerts (5 active):\n• Omega Speedmaster: 7 units remaining (Threshold: 10)\n• Tag Heuer Carrera: 6 units remaining (Threshold: 10)\n• Seiko Prospex: 8 units remaining (Threshold: 15)\n• Main Warehouse capacity reached 84.2%\n• Inward Shipment PO-2026-9041 verified'
                )
              }
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center relative transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#071426]">
                5
              </span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Profile Dropdown */}
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
                    Switch Active Role
                  </div>

                  {Object.values(ROLES)
                    .filter((r) => r !== ROLES.CUSTOMER)
                    .map((r) => {
                      const staff = MOCK_STAFF_ACCOUNTS[r];
                      const isActive = user?.role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setRoleMenuOpen(false);
                            if (r === ROLES.STORE_ADMIN) navigate('/dashboard');
                          }}
                          className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-amber-50 transition-colors cursor-pointer ${
                            isActive ? 'bg-amber-50/70 text-[#D6A63C] font-bold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{staff?.avatar}</span>
                            <span>{r}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#D6A63C]" />}
                        </button>
                      );
                    })}

                  <div className="border-t border-gray-100 mt-1.5 pt-1">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ════════════════════════════════════════════════════════════════
              PAGE HEADER (Title + Date + Import/Export + Add Stock Button)
              ════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold font-sans text-gray-900 tracking-tight flex items-center gap-2">
                <span>Inventory Manager</span>
                <span className="text-xl">📦</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Track, update and manage stock across all products, variants and warehouses.
              </p>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2.5">
              {/* Date Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDateRangeOpen(!dateRangeOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedRange}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {dateRangeOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 text-xs animate-scaleUp">
                    {['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'This Year'].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setSelectedRange(r);
                          setDateRangeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-700"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Import / Export */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setImportExportOpen(!importExportOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>Import / Export</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {importExportOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 text-xs animate-scaleUp">
                    <button
                      onClick={() => {
                        setShowBulkUploadModal(true);
                        setImportExportOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-700 flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D6A63C]" />
                      <span>Bulk Stock Update (CSV)</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-700 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download Stock Report (CSV)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* + Add Stock Entry Button */}
              <button
                type="button"
                onClick={() => setShowAddStockModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E6BA5E] hover:from-[#c3973e] hover:to-[#d4a84f] text-black font-extrabold text-xs shadow-md shadow-[#D6A63C]/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Stock Entry</span>
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              3. FIVE OVERVIEW KPI CARDS (Sparkline Highlights)
              ════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Total Stock Units */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Total Stock Units</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D6A63C] flex items-center justify-center text-sm">
                  <Box className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{kpis.totalUnits}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{kpis.totalUnitsChange}</span>
              </div>
            </div>

            {/* In-Stock Products */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">In-Stock Products</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{kpis.inStock}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{kpis.inStockChange}</span>
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Low Stock Items</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{kpis.lowStock}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{kpis.lowStockChange}</span>
              </div>
            </div>

            {/* Out of Stock */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Out of Stock</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
                  <X className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{kpis.outOfStock}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{kpis.outOfStockChange}</span>
              </div>
            </div>

            {/* Total Stock Value */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Total Stock Value</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D6A63C] flex items-center justify-center text-sm">
                  <span className="font-bold">₹</span>
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-sans text-gray-900 mt-2">{kpis.stockValue}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{kpis.stockValueChange}</span>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              4. ANALYTICS ROW (4 CARDS: Overview Donut, Movement, Warehouses, Quick Actions)
              ════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
            {/* 1. Stock Overview Donut Chart (lg:col-span-3) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-3 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Stock Overview</h3>

              <div className="relative h-36 flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STOCK_OVERVIEW_DATA}
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {STOCK_OVERVIEW_DATA.map((entry, index) => (
                        <Cell key={`donut-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center pointer-events-none">
                  <p className="text-xs font-black font-sans text-gray-900 leading-tight">320</p>
                  <p className="text-[9px] text-gray-400 font-medium">Products</p>
                </div>
              </div>

              {/* Legends Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-gray-50">
                {STOCK_OVERVIEW_DATA.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name} ({item.value})</span>
                    </span>
                    <span className="font-bold text-gray-900">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Stock Movement Chart (lg:col-span-4) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">
                  Stock Movement <span className="text-gray-400 font-normal text-xs">(Last 30 Days)</span>
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Stock In
                  </span>
                  <span className="flex items-center gap-1 text-purple-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Stock Out
                  </span>
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={STOCK_MOVEMENT_CHART_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStockIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorStockOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} domain={[0, 1000]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="stockIn" stroke="#10B981" strokeWidth={2} fill="url(#colorStockIn)" />
                    <Area type="monotone" dataKey="stockOut" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorStockOut)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Warehouses Summary (lg:col-span-2) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">Warehouses (3)</h3>
                <button
                  onClick={() => setShowWarehousesModal(true)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3 my-auto">
                {WAREHOUSE_LIST.map((wh) => (
                  <div key={wh.id} className="text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{wh.name}</span>
                      </span>
                      {wh.isPrimary && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 pl-4">{wh.units}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Quick Actions (lg:col-span-3) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-2 font-bold text-sm text-gray-900">
                <Sparkles className="w-4 h-4 text-[#D6A63C]" />
                <span>Quick Actions</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(true)}
                  className="w-full py-2 px-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] text-xs font-semibold text-gray-800 flex items-center gap-2.5 transition-all text-left cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add Stock Entry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAdjustStockModal(true)}
                  className="w-full py-2 px-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] text-xs font-semibold text-gray-800 flex items-center gap-2.5 transition-all text-left cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Adjust Stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTransferModal(true)}
                  className="w-full py-2 px-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] text-xs font-semibold text-gray-800 flex items-center gap-2.5 transition-all text-left cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Transfer Stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(true)}
                  className="w-full py-2 px-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] text-xs font-semibold text-gray-800 flex items-center gap-2.5 transition-all text-left cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bulk Stock Update</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full py-2 px-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] text-xs font-semibold text-gray-800 flex items-center gap-2.5 transition-all text-left cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-gray-600" />
                  <span>Download Stock Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              5. INVENTORY TABS (All Inventory, In Stock, Low Stock, etc.)
              ════════════════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'all', label: 'All Inventory (320)', icon: Boxes },
              { id: 'inStock', label: 'In Stock (298)', icon: Check },
              { id: 'lowStock', label: 'Low Stock (18)', icon: AlertTriangle },
              { id: 'outOfStock', label: 'Out of Stock (10)', icon: X },
              { id: 'movements', label: 'Stock Movements', icon: ArrowRightLeft },
              { id: 'reorder', label: 'Reorder Alerts', icon: Bell },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B121C] text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D6A63C]' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ════════════════════════════════════════════════════════════════
              6. SEARCH & FILTER BAR
              ════════════════════════════════════════════════════════════════ */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by product name, SKU or brand..."
                className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A63C]/40 focus:border-[#D6A63C] transition-all font-medium"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
              >
                <option value="All">Category</option>
                <option value="Luxury">Luxury</option>
                <option value="Men's">Men's</option>
                <option value="Women's">Women's</option>
                <option value="Sports">Sports</option>
              </select>

              {/* Brand */}
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
              >
                <option value="All">Brand</option>
                <option value="Rolex">Rolex</option>
                <option value="Omega">Omega</option>
                <option value="Cartier">Cartier</option>
                <option value="Patek Philippe">Patek Philippe</option>
              </select>

              {/* Warehouse */}
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
              >
                <option value="All">Warehouse</option>
                <option value="Main">Main Warehouse</option>
                <option value="Delhi">Delhi Warehouse</option>
                <option value="Mumbai">Mumbai Warehouse</option>
              </select>

              {/* Stock Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
              >
                <option value="All">Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              {/* Reset */}
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All');
                  setBrandFilter('All');
                  setWarehouseFilter('All');
                  setStatusFilter('All');
                  setCurrentPage(1);
                  showToast('Inventory filters reset.');
                }}
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              7. INVENTORY TABLE & RIGHT-SIDE LOW STOCK WIDGET
              ════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Main Table Column (lg:col-span-9 or 12 depending on widget) */}
            <div className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            paginatedItems.length > 0 &&
                            paginatedItems.every((i) => selectedItems.includes(i.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(paginatedItems.map((i) => i.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          className="w-4 h-4 accent-[#D6A63C] rounded cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Warehouse</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Reserved</th>
                      <th className="py-3 px-4 font-bold text-gray-800">Available</th>
                      <th className="py-3 px-4">Min. Level</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {paginatedItems.map((item) => {
                      const isSelected = selectedItems.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-amber-50/20 transition-colors ${
                            isSelected ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                setSelectedItems((prev) =>
                                  prev.includes(item.id)
                                    ? prev.filter((id) => id !== item.id)
                                    : [...prev, item.id]
                                )
                              }
                              className="w-4 h-4 accent-[#D6A63C] rounded cursor-pointer"
                            />
                          </td>

                          {/* Product Image & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 p-0.5 flex items-center justify-center flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                                  {item.productName}
                                </h4>
                                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                                  {item.subSpecs}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="py-3 px-4 font-mono font-bold text-gray-700 text-[11px]">
                            {item.sku}
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 text-gray-700 font-medium">
                            {item.category}
                          </td>

                          {/* Warehouse */}
                          <td className="py-3 px-4 font-semibold text-gray-800">
                            {item.warehouse}
                          </td>

                          {/* Current Stock */}
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {item.currentStock}
                          </td>

                          {/* Reserved */}
                          <td className="py-3 px-4 text-gray-500">
                            {item.reservedStock}
                          </td>

                          {/* Available Stock */}
                          <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                            {item.availableStock}
                          </td>

                          {/* Min Level */}
                          <td className="py-3 px-4 text-gray-400">
                            {item.minLevel}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-4">
                            {item.status === 'In Stock' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                In Stock
                              </span>
                            ) : item.status === 'Low Stock' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Out of Stock
                              </span>
                            )}
                          </td>

                          {/* Last Updated */}
                          <td className="py-3 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                            {item.lastUpdated}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View Details */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveItemForAction(item);
                                  showToast(`Viewing details for ${item.productName}`);
                                }}
                                className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Adjust Stock */}
                              <button
                                type="button"
                                onClick={() => {
                                  setAdjustStockForm({
                                    ...adjustStockForm,
                                    sku: item.sku,
                                  });
                                  setShowAdjustStockModal(true);
                                }}
                                className="p-1.5 hover:bg-amber-50 text-gray-600 hover:text-[#D6A63C] rounded-lg"
                                title="Adjust Stock"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>

                              {/* More */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTransferForm({
                                    ...transferForm,
                                    sku: item.sku,
                                  });
                                  setShowTransferModal(true);
                                }}
                                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-black rounded-lg"
                                title="Transfer to another warehouse"
                              >
                                <Truck className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <div>
                  Showing <span className="font-bold text-gray-800">1–{paginatedItems.length}</span> of{' '}
                  <span className="font-bold text-gray-800">{filteredInventory.length} products</span>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-gray-700"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <button className="px-2.5 py-1 rounded-lg bg-[#D6A63C] text-black font-extrabold text-xs">
                      1
                    </button>
                    <button className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-700">2</button>
                    <button className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-700">3</button>
                    <span className="px-1 text-gray-400">...</span>
                    <button className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-700">64</button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(2)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(64)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100"
                    >
                      <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Widget: Low Stock Alerts (lg:col-span-3) */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Low Stock Alerts (18)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('lowStock')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {LOW_STOCK_ALERTS.map((alert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={alert.image}
                        alt={alert.name}
                        className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-100 p-0.5"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{alert.name}</p>
                        <p className="text-[11px] font-semibold text-rose-600">
                          {alert.stockLeft} left{' '}
                          <span className="text-gray-400 font-normal">(Min: {alert.minThreshold})</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReorderForm({
                          sku: 'WH-OMG-001',
                          productName: alert.name,
                          suggestedQty: alert.minThreshold * 2,
                          supplier: 'Swatch Group India Pvt Ltd',
                          notes: `Reordering to meet safety stock threshold of ${alert.minThreshold}`,
                        });
                        setShowReorderModal(true);
                      }}
                      className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-[#D6A63C] text-[#8B6A1A] hover:text-black font-extrabold text-[10px] transition-colors"
                    >
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          8. FUNCTIONAL MODALS (Add Stock, Adjust, Transfer, Reorder, Help)
          ════════════════════════════════════════════════════════════════ */}

      {/* ADD STOCK ENTRY MODAL */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-[#D6A63C]" />
                <span>Add Stock Entry (Inward Receipt)</span>
              </h3>
              <button onClick={() => setShowAddStockModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Product *</label>
                <select
                  value={addStockForm.sku}
                  onChange={(e) => setAddStockForm({ ...addStockForm, sku: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200"
                >
                  {inventoryItems.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.productName} ({item.sku}) - Current: {item.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quantity to Inward *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={addStockForm.quantity}
                    onChange={(e) => setAddStockForm({ ...addStockForm, quantity: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Destination Warehouse</label>
                  <select
                    value={addStockForm.warehouse}
                    onChange={(e) => setAddStockForm({ ...addStockForm, warehouse: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200"
                  >
                    <option value="Main Warehouse">Main Warehouse (Gurugram)</option>
                    <option value="Delhi Warehouse">Delhi Warehouse (Okhla)</option>
                    <option value="Mumbai Warehouse">Mumbai Warehouse (BKC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Supplier / Factory</label>
                <input
                  type="text"
                  value={addStockForm.supplier}
                  onChange={(e) => setAddStockForm({ ...addStockForm, supplier: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Purchase Reference (PO)</label>
                  <input
                    type="text"
                    value={addStockForm.purchaseRef}
                    onChange={(e) => setAddStockForm({ ...addStockForm, purchaseRef: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={addStockForm.unitCost}
                    onChange={(e) => setAddStockForm({ ...addStockForm, unitCost: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={addStockForm.remarks}
                  onChange={(e) => setAddStockForm({ ...addStockForm, remarks: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E6BA5E] text-black font-extrabold shadow-md active:scale-95"
                >
                  Confirm Stock Inward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST STOCK MODAL */}
      {showAdjustStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span>Adjust Stock (Audit Correction)</span>
              </h3>
              <button onClick={() => setShowAdjustStockModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustStockSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product</label>
                <select
                  value={adjustStockForm.sku}
                  onChange={(e) => setAdjustStockForm({ ...adjustStockForm, sku: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200"
                >
                  {inventoryItems.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.productName} (Current: {item.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Adjustment Action</label>
                  <select
                    value={adjustStockForm.adjustmentType}
                    onChange={(e) => setAdjustStockForm({ ...adjustStockForm, adjustmentType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 font-bold"
                  >
                    <option value="increase">Increase (+ Stock)</option>
                    <option value="decrease">Decrease (- Stock)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={adjustStockForm.quantity}
                    onChange={(e) => setAdjustStockForm({ ...adjustStockForm, quantity: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason for Adjustment</label>
                <select
                  value={adjustStockForm.reason}
                  onChange={(e) => setAdjustStockForm({ ...adjustStockForm, reason: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200"
                >
                  <option value="Count Discrepancy Correction">Count Discrepancy Correction</option>
                  <option value="Damaged in Vault Storage">Damaged in Vault Storage</option>
                  <option value="Returned Item Restocked">Returned Item Restocked</option>
                  <option value="Marketing Demonstration Sample">Marketing Demonstration Sample</option>
                  <option value="Quality Inspection Scrap">Quality Inspection Scrap</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Auditor Notes</label>
                <textarea
                  rows={2}
                  value={adjustStockForm.remarks}
                  onChange={(e) => setAdjustStockForm({ ...adjustStockForm, remarks: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAdjustStockModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B121C] text-white font-bold"
                >
                  Apply Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSFER STOCK MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>Inter-Warehouse Stock Transfer</span>
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product to Transfer</label>
                <select
                  value={transferForm.sku}
                  onChange={(e) => setTransferForm({ ...transferForm, sku: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200"
                >
                  {inventoryItems.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.productName} (Available: {item.availableStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">From Warehouse</label>
                  <select
                    value={transferForm.fromWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, fromWarehouse: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Delhi Warehouse">Delhi Warehouse</option>
                    <option value="Mumbai Warehouse">Mumbai Warehouse</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">To Warehouse</label>
                  <select
                    value={transferForm.toWarehouse}
                    onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200"
                  >
                    <option value="Delhi Warehouse">Delhi Warehouse</option>
                    <option value="Mumbai Warehouse">Mumbai Warehouse</option>
                    <option value="Main Warehouse">Main Warehouse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Transfer Quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Transfer Reference</label>
                  <input
                    type="text"
                    value={transferForm.transferRef}
                    onChange={(e) => setTransferForm({ ...transferForm, transferRef: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Transfer Reason</label>
                <input
                  type="text"
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REORDER / PURCHASE REQUEST MODAL */}
      {showReorderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#D6A63C]" />
                <span>Create Purchase Request (Low Stock Reorder)</span>
              </h3>
              <button onClick={() => setShowReorderModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReorderSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product</label>
                <input
                  type="text"
                  readOnly
                  value={`${reorderForm.productName} (${reorderForm.sku})`}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-gray-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Suggested Reorder Qty</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={reorderForm.suggestedQty}
                    onChange={(e) => setReorderForm({ ...reorderForm, suggestedQty: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand Supplier</label>
                  <input
                    type="text"
                    value={reorderForm.supplier}
                    onChange={(e) => setReorderForm({ ...reorderForm, supplier: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Justification Notes</label>
                <textarea
                  rows={2}
                  value={reorderForm.notes}
                  onChange={(e) => setReorderForm({ ...reorderForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowReorderModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E6BA5E] text-black font-extrabold shadow-md active:scale-95"
                >
                  Submit Purchase Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK UPLOAD CSV MODAL */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#D6A63C]" />
                <span>Bulk Stock Update via CSV</span>
              </h3>
              <button onClick={() => setShowBulkUploadModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Upload your inventory count spreadsheet. Product SKUs and warehouse bays will be matched automatically.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50/50 hover:border-[#D6A63C] transition-colors">
              <FileSpreadsheet className="w-10 h-10 text-[#D6A63C] mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-800">Drop Inventory CSV here</p>
              <p className="text-[11px] text-gray-400 mt-1">or click below to upload</p>
              <button
                type="button"
                onClick={() => {
                  showToast('Parsed 320 records! Inventory levels reconciled.');
                  setShowBulkUploadModal(false);
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-[#0B121C] text-white font-bold text-xs"
              >
                Simulate CSV Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WAREHOUSE DETAILS MODAL */}
      {showWarehousesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#D6A63C]" />
                <span>WatchHub Regional Warehouses</span>
              </h3>
              <button onClick={() => setShowWarehousesModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {WAREHOUSE_LIST.map((wh) => (
                <div key={wh.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{wh.name}</span>
                    {wh.isPrimary && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-[11px]">{wh.location}</p>
                  <p className="font-bold text-gray-900 text-sm">{wh.units}</p>
                  <p className="text-[10px] text-gray-400">Capacity: {wh.capacity}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-right">
              <button
                type="button"
                onClick={() => setShowWarehousesModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#0B121C] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT SUPPORT MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D6A63C]" />
                <span>Inventory & Operations Helpdesk</span>
              </h3>
              <button onClick={() => setShowSupportModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Need immediate assistance with stock synchronization, warehouse transfers or high-value timepiece vault intake?
            </p>
            <div className="space-y-2 text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Priority Hotline</span>
                <span className="font-bold text-gray-900">+91 98765 43210 (Ext: 4 - Logistics & Vault)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Email Operations Desk</span>
                <span className="font-bold text-gray-900">inventory-support@watchhub.com</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                showToast('Urgent support ping sent to WatchHub Platform Engineering!');
                setShowSupportModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#D6A63C] text-black font-extrabold text-xs shadow-md"
            >
              Send High-Priority Ping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
