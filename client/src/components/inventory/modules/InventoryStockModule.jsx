import React, { useState, useMemo } from 'react';
import {
  Box,
  Boxes,
  Search,
  Filter,
  Plus,
  ArrowRightLeft,
  Download,
  Upload,
  Eye,
  Edit3,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Tag,
  PackagePlus,
  FileSpreadsheet,
  History,
  FileText,
} from 'lucide-react';

import InventoryStockModals from './InventoryStockModals';
export default function InventoryStockModule({
  products = [],
  warehouses = [],
  onAddProduct = () => { },
  onUpdateStock = () => { },
  onTransferStock = () => { },
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [stockUpdateItem, setStockUpdateItem] = useState(null);
  const [transferItem, setTransferItem] = useState(null);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [editProductItem, setEditProductItem] = useState(null);
  const [historyProductItem, setHistoryProductItem] = useState(null);

  // Form states
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    brand: 'Rolex',
    sku: '',
    barcode: '',
    category: 'Luxury Watches',
    warehouse: 'Main Central Vault',
    availableQty: 10,
    minStock: 5,
    unitCost: 500000,
    sellingPrice: 750000,
    supplier: 'Swiss Horology Imports Ltd',
    image: '/images/products/rolex-submariner.png',
  });

  const formatSafeDate = (dateVal) => {
    if (!dateVal) return 'Not Available';
    const safeDate = new Date(dateVal);
    return safeDate && !Number.isNaN(safeDate.getTime())
      ? safeDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : String(dateVal);
  };

  // Required ADD STOCK FORM Fields:
  // Select Product, SKU, Supplier, Warehouse, Quantity Received, Purchase Cost, Batch Number, Received Date, Invoice Number, Notes
  const [addStockForm, setAddStockForm] = useState({
    productId: safeProducts[0]?.id || '',
    sku: safeProducts[0]?.sku || '',
    supplier: safeProducts[0]?.supplier || 'Rolex Geneva SA / Swiss Imports Ltd',
    warehouse: safeProducts[0]?.warehouse || 'Main Central Vault',
    quantityReceived: 5,
    purchaseCost: Number(safeProducts[0]?.unitCost ?? safeProducts[0]?.costPrice ?? 500000),
    batchNumber: `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
    receivedDate: formatSafeDate(new Date()),
    invoiceNumber: `INV-PO-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: 'Verified against chronometer certificate upon delivery.',
  });

  const [stockUpdateForm, setStockUpdateForm] = useState({
    qtyDelta: 0,
    type: 'add',
    reason: 'Restock shipment received',
  });

  const [transferForm, setTransferForm] = useState({
    fromWarehouse: '',
    toWarehouse: 'Delhi Regional Warehouse',
    quantity: 1,
    notes: 'Urgent boutique fulfillment',
  });

  // Extract unique filters safely
  const brands = useMemo(
    () => ['All', ...new Set(safeProducts.map((p) => p?.brand).filter(Boolean))],
    [safeProducts]
  );
  const categories = useMemo(
    () => ['All', ...new Set(safeProducts.map((p) => p?.category).filter(Boolean))],
    [safeProducts]
  );
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return safeProducts
      .filter((p) => {
        if (!p) return false;
        const matchWh =
          selectedWarehouse === 'All' ||
          p.warehouse === selectedWarehouse ||
          p.warehouseId === selectedWarehouse;
        const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchStat = selectedStatus === 'All' || p.status === selectedStatus;
        const q = (searchQuery || '').toLowerCase().trim();
        const matchSearch =
          !q ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.barcode && String(p.barcode).includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q));
        return matchWh && matchBrand && matchCat && matchStat && matchSearch;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === 'stockValue') {
          valA = (Number(a.totalQty ?? a.stock ?? a.quantity ?? 0)) * (Number(a.unitCost ?? a.costPrice ?? a.price ?? 0));
          valB = (Number(b.totalQty ?? b.stock ?? b.quantity ?? 0)) * (Number(b.unitCost ?? b.costPrice ?? b.price ?? 0));
        } else if (typeof valA === 'number' || typeof valB === 'number') {
          valA = Number(valA ?? 0);
          valB = Number(valB ?? 0);
        } else {
          valA = String(valA || '').toLowerCase();
          valB = String(valB || '').toLowerCase();
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [safeProducts, selectedWarehouse, selectedBrand, selectedCategory, selectedStatus, searchQuery, sortField, sortDirection]);

  // Paginated products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handlers
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.sku) {
      alert('Please fill out Product Name and SKU.');
      return;
    }
    const newProduct = {
      id: `inv-${Date.now()}`,
      name: newProductForm.name,
      brand: newProductForm.brand,
      sku: newProductForm.sku,
      barcode: newProductForm.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category: newProductForm.category,
      warehouse: newProductForm.warehouse,
      availableQty: Number(newProductForm.availableQty) || 0,
      reservedQty: 0,
      totalQty: Number(newProductForm.availableQty) || 0,
      damagedQty: 0,
      minStock: Number(newProductForm.minStock) || 5,
      reorderLevel: (Number(newProductForm.minStock) || 5) + 2,
      recommendedOrder: 10,
      unitCost: Number(newProductForm.unitCost) || 0,
      sellingPrice: Number(newProductForm.sellingPrice) || 0,
      status: Number(newProductForm.availableQty) <= 0 ? 'Out of Stock' : Number(newProductForm.availableQty) <= Number(newProductForm.minStock) ? 'Low Stock' : 'In Stock',
      velocity: 'Fast Moving',
      supplier: newProductForm.supplier,
      lastUpdated: 'Just now',
      image: newProductForm.image || '/images/products/rolex-submariner.png',
    };
    onAddProduct(newProduct);
    setShowAddProductModal(false);
  };

  const handleAddStockSubmit = (e) => {
    e.preventDefault();
    const qty = Number(addStockForm.quantityReceived);
    if (!qty || qty <= 0) {
      alert('Please enter a valid positive quantity received.');
      return;
    }
    onUpdateStock(
      addStockForm.productId,
      qty,
      `Inbound PO Invoice ${addStockForm.invoiceNumber} (Batch: ${addStockForm.batchNumber}) from ${addStockForm.supplier}`
    );
    setShowAddStockModal(false);
  };

  const handleStockUpdateSubmit = (e) => {
    e.preventDefault();
    if (!stockUpdateItem) return;
    const delta = stockUpdateForm.type === 'add' ? Number(stockUpdateForm.qtyDelta) : -Number(stockUpdateForm.qtyDelta);
    onUpdateStock(stockUpdateItem.id, delta, stockUpdateForm.reason);
    setStockUpdateItem(null);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferItem) return;
    onTransferStock({
      productId: transferItem.id,
      fromWarehouse: transferItem.warehouse,
      toWarehouse: transferForm.toWarehouse,
      quantity: Number(transferForm.quantity),
      notes: transferForm.notes,
    });
    setTransferItem(null);
  };

  const exportExcelCSV = () => {
    const headers = ['Image,Name,Brand,SKU,Barcode,Category,Warehouse,Available,Reserved,MinStock,UnitCost,StockValue,Status\n'];
    const rows = filteredProducts.map(
      (p) =>
        `"${p.image}","${p.name}","${p.brand}","${p.sku}","${p.barcode}","${p.category}","${p.warehouse}",${p.availableQty},${p.reservedQty},${p.minStock},${p.unitCost},${(p.totalQty || 0) * (p.unitCost || 0)},"${p.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watchhub_inventory_stock_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleImportExcel = () => {
    alert('Import Excel: Please select a formatted .xlsx or .csv catalog file to sync batch inventory.');
  };

  const handleDownloadReport = () => {
    alert('Generating certified Inventory Master Valuation Report (PDF)...');
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header Toolbar & Required TOP ACTIONS (Add Product, Add Stock, Import Excel, Export Excel, Download Inventory Report) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Master Stock Catalog
            </span>
            <span className="text-xs text-[#A7B1C2]">• {filteredProducts.length} Timepiece References</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Inventory (Stock) Management</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Manage central vault SKU records, log supplier inbound deliveries, and control safety buffer allocations.
          </p>
        </div>

        {/* Top Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Stock */}
          <button
            onClick={() => setShowAddStockModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#6500FF]/25 transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Stock</span>
          </button>

          {/* Add Product */}
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-3 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#E9B94F] border border-[#E9B94F]/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* Import Excel */}
          <button
            onClick={handleImportExcel}
            className="px-3 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Import Excel"
          >
            <Upload className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>Import Excel</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={exportExcelCSV}
            className="px-3 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>

          {/* Download Inventory Report */}
          <button
            onClick={handleDownloadReport}
            className="p-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] transition-all cursor-pointer"
            title="Download Inventory Report"
          >
            <Download className="w-4 h-4 text-[#E9B94F]" />
          </button>
        </div>
      </div>

      {/* 2. Search & Multi-Filter Bar */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search by Product, SKU, Barcode */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, or barcode..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          {/* Filter by Brand */}
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

          {/* Filter by Category */}
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

          {/* Filter by Warehouse */}
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

          {/* Filter by Stock Status */}
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
        </div>
      </div>

      {/* 3. Product Table with all Required Columns:
          Product Image, Product Name, Brand, SKU, Barcode, Category, Warehouse, Available Quantity, Reserved Quantity, Minimum Stock, Unit Cost, Stock Value, Stock Status, Actions */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-3">Image</th>
                <th onClick={() => handleSort('name')} className="py-3 px-3 cursor-pointer hover:text-white">
                  Product Name &amp; SKU ↕
                </th>
                <th onClick={() => handleSort('brand')} className="py-3 px-3 cursor-pointer hover:text-white">
                  Brand &amp; Category ↕
                </th>
                <th className="py-3 px-3">Barcode</th>
                <th className="py-3 px-3">Warehouse</th>
                <th onClick={() => handleSort('availableQty')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  Available ↕
                </th>
                <th className="py-3 px-3 text-center">Reserved</th>
                <th className="py-3 px-3 text-center">Min Stock</th>
                <th className="py-3 px-3 text-right">Unit Cost</th>
                <th onClick={() => handleSort('stockValue')} className="py-3 px-3 text-right cursor-pointer hover:text-white">
                  Stock Value ↕
                </th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29305D]/50">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-[#A7B1C2]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Box className="w-10 h-10 text-[#6500FF]/50" />
                      <p className="font-bold text-white text-sm">No Timepieces Found</p>
                      <p className="text-xs text-[#A7B1C2]">No inventory products matched the current filter selection.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedWarehouse('All');
                          setSelectedBrand('All');
                          setSelectedCategory('All');
                          setSelectedStatus('All');
                        }}
                        className="mt-2 px-3.5 py-1.5 rounded-xl bg-[#6500FF]/20 text-[#00D5FF] border border-[#6500FF]/40 text-xs font-semibold hover:bg-[#6500FF]/30 cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const unitCostVal = Number(p?.unitCost ?? p?.costPrice ?? p?.price ?? 0);
                  const totalUnits = Number(p?.totalQty ?? p?.stock ?? p?.quantity ?? (Number(p?.availableQty ?? 0) + Number(p?.reservedQty ?? 0)));
                  const stockVal = totalUnits * unitCostVal;
                  const availableUnits = Number(p?.availableQty ?? p?.availableStock ?? p?.stock ?? 0);
                  const reservedUnits = Number(p?.reservedQty ?? p?.reservedStock ?? 0);
                  const minStockUnits = Number(p?.minStock ?? p?.minLevel ?? 5);

                  return (
                    <tr key={p?.id || p?.sku} className="hover:bg-[#17165A]/40 transition-colors group">
                      {/* Image */}
                      <td className="py-3 px-3">
                        <img
                          src={p?.image || '/images/products/rolex-submariner.png'}
                          alt={p?.name || 'Watch'}
                          className="w-10 h-10 rounded-xl object-contain bg-black/40 border border-[#29305D] p-0.5 shrink-0"
                        />
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-3 px-3">
                        <p
                          onClick={() => setDrawerProduct(p)}
                          className="font-bold text-white text-xs hover:text-[#00D5FF] transition-colors cursor-pointer max-w-[170px] truncate"
                          title={p?.name}
                        >
                          {p?.name || 'Unnamed Timepiece'}
                        </p>
                        <p className="font-mono text-[10px] text-[#00D5FF] mt-0.5">{p?.sku || 'N/A'}</p>
                      </td>

                      {/* Brand & Category */}
                      <td className="py-3 px-3">
                        <p className="font-semibold text-white">{p?.brand || 'Luxury'}</p>
                        <p className="text-[10px] text-[#A7B1C2]">{p?.category || 'Watches'}</p>
                      </td>

                      {/* Barcode */}
                      <td className="py-3 px-3 font-mono text-[10px] text-gray-300">
                        {p?.barcode || '—'}
                      </td>

                      {/* Warehouse */}
                      <td className="py-3 px-3 text-gray-200">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#E9B94F] shrink-0" />
                          <span className="truncate max-w-[110px]">{p?.warehouse || 'Central Vault'}</span>
                        </div>
                      </td>

                      {/* Available Quantity */}
                      <td className="py-3 px-3 text-center font-bold font-mono text-sm">
                        <span className={availableUnits === 0 ? 'text-rose-400' : availableUnits <= minStockUnits ? 'text-amber-400' : 'text-emerald-400'}>
                          {availableUnits.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Reserved Quantity */}
                      <td className="py-3 px-3 text-center font-mono text-gray-300">
                        {reservedUnits.toLocaleString('en-IN')}
                      </td>

                      {/* Minimum Stock */}
                      <td className="py-3 px-3 text-center font-mono text-[#A7B1C2]">
                        {minStockUnits.toLocaleString('en-IN')}
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3 px-3 text-right font-mono text-gray-300">
                        ₹{unitCostVal.toLocaleString('en-IN')}
                      </td>

                      {/* Stock Value */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#E9B94F]">
                        ₹{stockVal.toLocaleString('en-IN')}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${p.status === 'In Stock'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : p.status === 'Low Stock'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${p.status === 'In Stock' ? 'bg-emerald-400' : p.status === 'Low Stock' ? 'bg-amber-400' : 'bg-rose-400'
                              }`}
                          />
                          {p.status}
                        </span>
                      </td>

                      {/* Actions: View Details, Edit Info, Update Stock, Transfer Stock, View History */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Product Details */}
                          <button
                            onClick={() => setDrawerProduct(p)}
                            className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#6500FF]/30 text-[#00D5FF] border border-[#29305D] transition-all cursor-pointer"
                            title="View Details Drawer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Inventory Info */}
                          <button
                            onClick={() => setEditProductItem(p)}
                            className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#E9B94F]/20 text-[#E9B94F] border border-[#29305D] transition-all cursor-pointer"
                            title="Edit Inventory Information"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Update Stock */}
                          <button
                            onClick={() => {
                              setStockUpdateItem(p);
                              setStockUpdateForm({ qtyDelta: 5, type: 'add', reason: 'Vault replenishment' });
                            }}
                            className="p-1.5 rounded-lg bg-[#17165A] hover:bg-emerald-500/20 text-emerald-400 border border-[#29305D] transition-all cursor-pointer"
                            title="Quick Update Stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {/* Transfer Stock */}
                          <button
                            onClick={() => {
                              setTransferItem(p);
                              setTransferForm({
                                fromWarehouse: p.warehouse,
                                toWarehouse: p.warehouse === 'Delhi Regional Warehouse' ? 'Main Central Vault' : 'Delhi Regional Warehouse',
                                quantity: 1,
                                notes: 'Vault rebalance transfer',
                              });
                            }}
                            className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#6500FF] text-white border border-[#29305D] transition-all cursor-pointer"
                            title="Inter-Warehouse Transfer"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* View History */}
                          <button
                            onClick={() => setHistoryProductItem(p)}
                            className="p-1.5 rounded-lg bg-[#17165A] hover:bg-blue-500/20 text-[#00D5FF] border border-[#29305D] transition-all cursor-pointer"
                            title="View Product History"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-3 bg-[#17165A]/40 border-t border-[#29305D] flex items-center justify-between text-xs text-[#A7B1C2]">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#17165A] border border-[#29305D] hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2 text-white font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#17165A] border border-[#29305D] hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <InventoryStockModals
        showAddStockModal={showAddStockModal}
        setShowAddStockModal={setShowAddStockModal}
        addStockForm={addStockForm}
        setAddStockForm={setAddStockForm}
        handleAddStockSubmit={handleAddStockSubmit}
        products={products}
        warehouses={warehouses}
        showAddProductModal={showAddProductModal}
        setShowAddProductModal={setShowAddProductModal}
        newProductForm={newProductForm}
        setNewProductForm={setNewProductForm}
        handleAddProductSubmit={handleAddProductSubmit}
        editItem={editItem}
        setEditItem={setEditItem}
        handleEditSave={handleEditSave}
        historyItem={historyItem}
        setHistoryItem={setHistoryItem}
        stockUpdateItem={stockUpdateItem}
        setStockUpdateItem={setStockUpdateItem}
        handleQuickStockUpdate={handleQuickStockUpdate}
        transferItem={transferItem}
        setTransferItem={setTransferItem}
        transferForm={transferForm}
        setTransferForm={setTransferForm}
        handleTransferSubmit={handleTransferSubmit}
        drawerProduct={drawerProduct}
        setDrawerProduct={setDrawerProduct}
      />
    </div>
  );
}
