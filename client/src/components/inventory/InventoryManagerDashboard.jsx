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
import {
  STOCK_MOVEMENT_CHART_DATA,
  STOCK_OVERVIEW_DATA,
  INITIAL_INVENTORY_ITEMS,
} from '../../data/inventoryDashboardData';
import InventorySearchFilterBar from './InventorySearchFilterBar';
import InventoryOverviewCards from './InventoryOverviewCards';
import InventoryDashboardModals from './InventoryDashboardModals';
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
          <div className="w-11 h-11 rounded-2xl bg-[#D6A63C]/15 border border-[#D6A63C]/40 text-[#D6A63C] flex items-center justify-center shrink-0 shadow-neon-gold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Inventory Manager Dashboard
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#10182D] border border-white/10 text-xs font-semibold text-gray-200 hover:border-cyan-500/40 shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {dateRangeOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-[#0B1022] border border-white/15 rounded-xl shadow-2xl py-1 z-20 text-xs">
                {['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'This Year'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setDateRange(range);
                      setDateRangeOpen(false);
                      showToast(`Filtered for ${range}`);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-white/10 transition-colors ${
                      dateRange === range ? 'text-[#D6A63C] font-bold bg-white/5' : 'text-gray-300'
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D97706] text-[#050816] text-xs font-black shadow-neon-gold hover:shadow-[0_0_25px_rgba(244,185,66,0.6)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      <InventoryOverviewCards onOpenWarehousesModal={() => setShowWarehousesModal(true)} />
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
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-neon-cyan'
              : 'bg-[#10182D] text-gray-300 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Box className={`w-3.5 h-3.5 ${activeTableTab === 'All' ? 'text-black' : 'text-cyan-400'}`} />
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
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black shadow-neon-green'
              : 'bg-[#10182D] text-gray-300 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black shadow-neon-gold'
              : 'bg-[#10182D] text-gray-300 hover:bg-white/10 border border-white/10'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
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
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white font-black shadow-[0_0_15px_#FF4567]'
              : 'bg-[#10182D] text-gray-300 hover:bg-white/10 border border-white/10'
          }`}
        >
          <X className="w-3.5 h-3.5 text-red-400" />
          <span>Out of Stock (10)</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAdjustStockModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#10182D] text-gray-300 hover:bg-white/10 border border-white/10 transition-all cursor-pointer ml-auto"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stock Movements</span>
        </button>
      </div>

      {/* 5. SEARCH & MULTI-FILTER BAR */}
      <InventorySearchFilterBar
        tableSearch={tableSearch}
        setTableSearch={setTableSearch}
        setCurrentPage={setCurrentPage}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterBrand={filterBrand}
        setFilterBrand={setFilterBrand}
        filterWarehouse={filterWarehouse}
        setFilterWarehouse={setFilterWarehouse}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        handleResetFilters={handleResetFilters}
        handleExportCSV={handleExportCSV}
      />

      {/* 6. MAIN INVENTORY TABLE */}
      <div className="bg-[#10182D]/90 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0B1022] border-b border-white/10 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-600 bg-[#050816] text-cyan-500 focus:ring-cyan-400"
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
            <tbody className="divide-y divide-white/5">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-500">
                    <Boxes className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-gray-400">No inventory items matched your filter.</p>
                    <p className="text-xs text-gray-500 mt-1">Try resetting filters or changing the search keyword.</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="rounded border-gray-600 bg-[#050816] text-cyan-500 focus:ring-cyan-400"
                      />
                    </td>

                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0B1022] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = '/images/products/rolex-submariner.png';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-white text-xs leading-tight truncate">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            {item.subSpecs}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-3 font-semibold text-cyan-400 font-mono text-[11px]">
                      {item.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-gray-300 font-medium">
                      {item.category}
                    </td>

                    {/* Warehouse */}
                    <td className="py-3 px-3 text-gray-200 font-semibold">
                      {item.warehouse}
                    </td>

                    {/* Current Stock */}
                    <td className="py-3 px-3 text-center font-black text-white text-sm">
                      {item.currentStock}
                    </td>

                    {/* Reserved */}
                    <td className="py-3 px-3 text-center font-semibold text-gray-400">
                      {item.reservedStock}
                    </td>

                    {/* Available */}
                    <td className="py-3 px-3 text-center font-bold text-emerald-400">
                      {item.availableStock}
                    </td>

                    {/* Min. Level */}
                    <td className="py-3 px-3 text-center font-semibold text-gray-500">
                      {item.minLevel}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_8px_rgba(57,245,165,0.2)]'
                            : item.status === 'Low Stock'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_8px_rgba(244,185,66,0.2)]'
                            : 'bg-red-500/10 text-red-300 border border-red-500/30 shadow-[0_0_8px_rgba(255,69,103,0.2)]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3 px-4 text-gray-400 text-[11px] whitespace-nowrap">
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
                          className="p-1 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
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
                          className="p-1 hover:text-amber-400 hover:bg-white/10 rounded-lg transition-colors"
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
                          className="p-1 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
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
        <div className="bg-[#0B1022] border-t border-white/10 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>Showing 1-5 of 320 products</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#050816] border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-hidden"
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
              className="p-1.5 rounded-lg border border-white/10 bg-[#050816] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-white/10 bg-[#050816] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#F4B942] to-[#D97706] text-[#050816] font-black text-xs flex items-center justify-center shadow-neon-gold"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="w-7 h-7 rounded-lg border border-white/10 bg-[#050816] text-gray-300 font-semibold text-xs hover:bg-white/10"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              className="w-7 h-7 rounded-lg border border-white/10 bg-[#050816] text-gray-300 font-semibold text-xs hover:bg-white/10"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(4)}
              className="w-7 h-7 rounded-lg border border-white/10 bg-[#050816] text-gray-300 font-semibold text-xs hover:bg-white/10"
            >
              4
            </button>
            <span className="px-1 text-gray-600">...</span>
            <button
              type="button"
              onClick={() => setCurrentPage(64)}
              className="w-7 h-7 rounded-lg border border-white/10 bg-[#050816] text-gray-300 font-semibold text-xs hover:bg-white/10"
            >
              64
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-white/10 bg-[#050816] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1.5 rounded-lg border border-white/10 bg-[#050816] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <InventoryDashboardModals
        showAddStockModal={showAddStockModal}
        setShowAddStockModal={setShowAddStockModal}
        addForm={addForm}
        setAddForm={setAddForm}
        handleAddStockSubmit={handleAddStockSubmit}
        showAdjustStockModal={showAdjustStockModal}
        setShowAdjustStockModal={setShowAdjustStockModal}
        adjustForm={adjustForm}
        setAdjustForm={setAdjustForm}
        handleAdjustSubmit={handleAdjustSubmit}
        showTransferModal={showTransferModal}
        setShowTransferModal={setShowTransferModal}
        transferForm={transferForm}
        setTransferForm={setTransferForm}
        handleTransferSubmit={handleTransferSubmit}
        activeItemForDetail={activeItemForDetail}
        setActiveItemForDetail={setActiveItemForDetail}
        items={items}
      />
    </div>
  );
}
