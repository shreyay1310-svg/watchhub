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

export default function InventoryStockModule({
  products = [],
  warehouses = [],
  onAddProduct = () => {},
  onUpdateStock = () => {},
  onTransferStock = () => {},
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
    image: '/images/products/featured_rolex_submariner.jpg',
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
      image: newProductForm.image || '/images/products/featured_rolex_submariner.jpg',
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
                          src={p?.image || '/images/products/featured_rolex_submariner.jpg'}
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
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          p.status === 'In Stock'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : p.status === 'Low Stock'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'In Stock' ? 'bg-emerald-400' : p.status === 'Low Stock' ? 'bg-amber-400' : 'bg-rose-400'
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

      {/* REQUIRED ADD STOCK FORM MODAL:
          Fields: Select Product, SKU, Supplier, Warehouse, Quantity Received, Purchase Cost, Batch Number, Received Date, Invoice Number, Notes */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white flex items-center justify-center">
                  <PackagePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Inbound Stock Entry</h3>
                  <p className="text-[10px] text-[#A7B1C2]">Record physical delivery and supplier PO reception</p>
                </div>
              </div>
              <button onClick={() => setShowAddStockModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Select Product */}
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Select Timepiece Product *</label>
                  <select
                    value={addStockForm.productId}
                    onChange={(e) => {
                      const prod = products.find((p) => p.id === e.target.value);
                      if (prod) {
                        setAddStockForm({
                          ...addStockForm,
                          productId: prod.id,
                          sku: prod.sku,
                          supplier: prod.supplier,
                          warehouse: prod.warehouse,
                          purchaseCost: prod.unitCost,
                        });
                      }
                    }}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) — Available: {p.availableQty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. SKU (Readonly/Synced) */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Product SKU</label>
                  <input
                    type="text"
                    disabled
                    value={addStockForm.sku}
                    className="w-full bg-[#17165A]/50 border border-[#29305D] rounded-xl p-2.5 text-gray-400 font-mono"
                  />
                </div>

                {/* 3. Supplier */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supplier / Manufacture *</label>
                  <input
                    type="text"
                    required
                    value={addStockForm.supplier}
                    onChange={(e) => setAddStockForm({ ...addStockForm, supplier: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 4. Warehouse */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Destination Vault *</label>
                  <select
                    value={addStockForm.warehouse}
                    onChange={(e) => setAddStockForm({ ...addStockForm, warehouse: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Quantity Received */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Quantity Received (Units) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={addStockForm.quantityReceived}
                    onChange={(e) => setAddStockForm({ ...addStockForm, quantityReceived: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono font-bold focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 6. Purchase Cost */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Purchase Unit Cost (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addStockForm.purchaseCost}
                    onChange={(e) => setAddStockForm({ ...addStockForm, purchaseCost: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 7. Batch Number */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={addStockForm.batchNumber}
                    onChange={(e) => setAddStockForm({ ...addStockForm, batchNumber: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 8. Received Date */}
                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Received Date</label>
                  <input
                    type="text"
                    value={addStockForm.receivedDate}
                    onChange={(e) => setAddStockForm({ ...addStockForm, receivedDate: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 9. Invoice Number */}
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supplier Invoice / PO Number *</label>
                  <input
                    type="text"
                    required
                    value={addStockForm.invoiceNumber}
                    onChange={(e) => setAddStockForm({ ...addStockForm, invoiceNumber: e.target.value })}
                    placeholder="e.g. INV-ROL-2026-8812"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                {/* 10. Notes */}
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Receipt &amp; Quality Notes</label>
                  <textarea
                    rows={2}
                    value={addStockForm.notes}
                    onChange={(e) => setAddStockForm({ ...addStockForm, notes: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#17165A] rounded-xl border border-[#29305D] flex justify-between items-center">
                <span className="text-[#A7B1C2]">Total Procurement Capital:</span>
                <span className="font-mono font-black text-sm text-[#E9B94F]">
                  ₹{Number((Number(addStockForm?.quantityReceived || 0) * Number(addStockForm?.purchaseCost || 0)) || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Stock Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Add New Product Reference</h3>
              </div>
              <button onClick={() => setShowAddProductModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Watch Model Name *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. Rolex Cosmograph Daytona"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Brand *</label>
                  <select
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  >
                    <option value="Rolex">Rolex</option>
                    <option value="Omega">Omega</option>
                    <option value="TAG Heuer">TAG Heuer</option>
                    <option value="Seiko">Seiko</option>
                    <option value="Tissot">Tissot</option>
                    <option value="Cartier">Cartier</option>
                    <option value="Breitling">Breitling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  >
                    <option value="Luxury Watches">Luxury Watches</option>
                    <option value="Men's Watches">Men's Watches</option>
                    <option value="Women's Watches">Women's Watches</option>
                    <option value="Sports Watches">Sports Watches</option>
                    <option value="Automatic Watches">Automatic Watches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    placeholder="WH-ROL-009"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Barcode</label>
                  <input
                    type="text"
                    value={newProductForm.barcode}
                    onChange={(e) => setNewProductForm({ ...newProductForm, barcode: e.target.value })}
                    placeholder="890123456789"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Warehouse</label>
                  <select
                    value={newProductForm.warehouse}
                    onChange={(e) => setNewProductForm({ ...newProductForm, warehouse: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>{wh.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Initial Stock (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.availableQty}
                    onChange={(e) => setNewProductForm({ ...newProductForm, availableQty: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT INFO */}
      {editProductItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <h3 className="text-base font-bold text-white">Edit Inventory Information</h3>
              <button onClick={() => setEditProductItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[#A7B1C2] mb-1">Product Name</label>
                <input
                  type="text"
                  defaultValue={editProductItem.name}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7B1C2] mb-1">Min Stock Level</label>
                  <input
                    type="number"
                    defaultValue={editProductItem.minStock}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A7B1C2] mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    defaultValue={editProductItem.unitCost}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  defaultValue={editProductItem.sellingPrice}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#29305D]">
              <button
                type="button"
                onClick={() => setEditProductItem(null)}
                className="px-4 py-2 rounded-xl bg-[#17165A] text-[#A7B1C2] font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Updated specs for ${editProductItem.name}.`);
                  setEditProductItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PRODUCT HISTORY */}
      {historyProductItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#00D5FF]" />
                <h3 className="text-base font-bold text-white">Stock Audit Trail: {historyProductItem.sku}</h3>
              </div>
              <button onClick={() => setHistoryProductItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl">
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-[#00D5FF]">HIST-8910</span>
                  <span className="text-emerald-400 font-bold">+10 Units</span>
                </div>
                <p className="font-bold text-white">Inbound PO Restock verified</p>
                <p className="text-[10px] text-[#A7B1C2]">Today, 11:20 AM • Suresh Patel</p>
              </div>

              <div className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl">
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-[#00D5FF]">HIST-8909</span>
                  <span className="text-rose-400 font-bold">-1 Unit</span>
                </div>
                <p className="font-bold text-white">POS Retail Boutique Sale (#INV-WH9012)</p>
                <p className="text-[10px] text-[#A7B1C2]">Today, 10:45 AM • Terminal #04</p>
              </div>

              <div className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl">
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-[#00D5FF]">HIST-8906</span>
                  <span className="text-emerald-400 font-bold">+1 Unit</span>
                </div>
                <p className="font-bold text-white">Physical Safe Count Reconciliation finding</p>
                <p className="text-[10px] text-[#A7B1C2]">15 Nov 2026 • Approved by Director Singhania</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#29305D] flex justify-end">
              <button
                onClick={() => setHistoryProductItem(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK STOCK UPDATE MODAL */}
      {stockUpdateItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <h3 className="text-base font-bold text-white">Adjust Stock: {stockUpdateItem.sku}</h3>
              <button onClick={() => setStockUpdateItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStockUpdateForm({ ...stockUpdateForm, type: 'add' })}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    stockUpdateForm.type === 'add'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                      : 'bg-[#17165A] text-[#A7B1C2] border-[#29305D]'
                  }`}
                >
                  + Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setStockUpdateForm({ ...stockUpdateForm, type: 'subtract' })}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    stockUpdateForm.type === 'subtract'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                      : 'bg-[#17165A] text-[#A7B1C2] border-[#29305D]'
                  }`}
                >
                  - Deduct Stock
                </button>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Quantity Delta</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockUpdateForm.qtyDelta}
                  onChange={(e) => setStockUpdateForm({ ...stockUpdateForm, qtyDelta: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Reason / Notes</label>
                <input
                  type="text"
                  required
                  value={stockUpdateForm.reason}
                  onChange={(e) => setStockUpdateForm({ ...stockUpdateForm, reason: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setStockUpdateItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTER-WAREHOUSE TRANSFER MODAL */}
      {transferItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <h3 className="text-base font-bold text-white">Inter-Vault Stock Transfer</h3>
              <button onClick={() => setTransferItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-[#A7B1C2] mb-1">Destination Vault</label>
                <select
                  value={transferForm.toWarehouse}
                  onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                >
                  {warehouses
                    .filter((wh) => wh.name !== transferItem.warehouse)
                    .map((wh) => (
                      <option key={wh.id} value={wh.name}>{wh.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Transfer Quantity (Max: {transferItem.availableQty})</label>
                <input
                  type="number"
                  min="1"
                  max={transferItem.availableQty}
                  required
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1">Transit / Courier Reference</label>
                <input
                  type="text"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setTransferItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold"
                >
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS DRAWER */}
      {drawerProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border-l border-[#29305D] w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-fade-in text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
                <span className="font-mono text-xs text-[#00D5FF] font-bold">{drawerProduct.sku}</span>
                <button onClick={() => setDrawerProduct(null)} className="text-[#A7B1C2] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center p-4 rounded-2xl bg-[#17165A]/40 border border-[#29305D]">
                <img
                  src={drawerProduct.image}
                  alt={drawerProduct.name}
                  className="w-32 h-32 object-contain bg-black/50 rounded-2xl p-2 mx-auto border border-white/10 mb-3"
                />
                <h3 className="text-base font-black text-white">{drawerProduct.name}</h3>
                <p className="text-xs text-[#E9B94F] font-bold mt-0.5">{drawerProduct.brand} • {drawerProduct.category}</p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-[#17165A]/30 border border-[#29305D]">
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Vault Location:</span>
                  <span className="font-semibold text-white">{drawerProduct?.warehouse || 'Central Vault'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Available Qty:</span>
                  <span className="font-bold text-emerald-400">
                    {Number(drawerProduct?.availableQty ?? drawerProduct?.availableStock ?? drawerProduct?.stock ?? 0).toLocaleString('en-IN')} units
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Reserved Qty:</span>
                  <span className="text-white">
                    {Number(drawerProduct?.reservedQty ?? drawerProduct?.reservedStock ?? 0).toLocaleString('en-IN')} units
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Unit Procurement Cost:</span>
                  <span className="text-white font-mono">
                    ₹{Number(drawerProduct?.unitCost ?? drawerProduct?.costPrice ?? drawerProduct?.price ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Total Stock Value:</span>
                  <span className="text-[#E9B94F] font-mono font-bold">
                    ₹{Number(((drawerProduct?.totalQty ?? drawerProduct?.stock ?? 0) * (drawerProduct?.unitCost ?? drawerProduct?.costPrice ?? drawerProduct?.price ?? 0)) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#A7B1C2]">Barcode:</span>
                  <span className="text-white font-mono">{drawerProduct?.barcode || '—'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#29305D]">
              <button
                onClick={() => setDrawerProduct(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
