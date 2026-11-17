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
  Building2,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Tag,
} from 'lucide-react';

export default function InventoryStockModule({
  products,
  warehouses,
  onAddProduct,
  onUpdateStock,
  onTransferStock,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [priceSort, setPriceSort] = useState('none');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [stockUpdateItem, setStockUpdateItem] = useState(null);
  const [transferItem, setTransferItem] = useState(null);
  const [drawerProduct, setDrawerProduct] = useState(null);

  // Form states
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    brand: 'Rolex',
    sku: '',
    barcode: '',
    category: 'Luxury Watches',
    warehouse: 'Main Warehouse',
    availableQty: 10,
    minStock: 5,
    unitCost: 500000,
    sellingPrice: 750000,
    supplier: 'Swiss Horology Imports Ltd',
    image: '/images/products/featured_rolex_submariner.jpg',
  });

  const [stockUpdateForm, setStockUpdateForm] = useState({
    qtyDelta: 0,
    type: 'add', // 'add' or 'subtract'
    reason: 'Restock shipment received',
  });

  const [transferForm, setTransferForm] = useState({
    fromWarehouse: '',
    toWarehouse: 'Delhi Warehouse',
    quantity: 1,
    notes: 'Urgent boutique fulfillment',
  });

  // Extract unique filters
  const brands = useMemo(() => ['All', ...new Set(products.map((p) => p.brand))], [products]);
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products]);
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchWh = selectedWarehouse === 'All' || p.warehouse === selectedWarehouse || p.warehouseId === selectedWarehouse;
        const matchBrand = selectedBrand === 'All' || p.brand === selectedBrand;
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchStat = selectedStatus === 'All' || p.status === selectedStatus;
        const matchSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.barcode && p.barcode.includes(searchQuery)) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchWh && matchBrand && matchCat && matchStat && matchSearch;
      })
      .sort((a, b) => {
        if (priceSort === 'price-asc') return a.sellingPrice - b.sellingPrice;
        if (priceSort === 'price-desc') return b.sellingPrice - a.sellingPrice;
        if (priceSort === 'stock-asc') return a.availableQty - b.availableQty;
        if (priceSort === 'stock-desc') return b.availableQty - a.availableQty;
        return 0;
      });
  }, [products, selectedWarehouse, selectedBrand, selectedCategory, selectedStatus, searchQuery, priceSort]);

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
    setShowAddModal(false);
    setNewProductForm({
      name: '',
      brand: 'Rolex',
      sku: '',
      barcode: '',
      category: 'Luxury Watches',
      warehouse: 'Main Warehouse',
      availableQty: 10,
      minStock: 5,
      unitCost: 500000,
      sellingPrice: 750000,
      supplier: 'Swiss Horology Imports Ltd',
      image: '/images/products/featured_rolex_submariner.jpg',
    });
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

  const exportToCSV = () => {
    const headers = ['SKU,Name,Brand,Category,Warehouse,Available,Reserved,Total,MinStock,Status,UnitCost,Price\n'];
    const rows = filteredProducts.map(
      (p) =>
        `"${p.sku}","${p.name}","${p.brand}","${p.category}","${p.warehouse}",${p.availableQty},${p.reservedQty},${p.totalQty},${p.minStock},"${p.status}",${p.unitCost},${p.sellingPrice}`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watchhub_inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Master Catalog
            </span>
            <span className="text-xs text-[#A7B1C2]">• {filteredProducts.length} Timepiece SKUs</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Full Inventory Catalogue (Stock)</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Real-time stock master ledger. Monitor on-hand quantities, safety buffers, and trigger instant stock adjustments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="px-3 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#6500FF]/25 transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Multi-Filter Bar */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Name, Barcode..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
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
                  Cat: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status & Sort */}
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

      {/* 3. Master Inventory Table */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Watch / SKU</th>
                <th className="py-3 px-3">Brand &amp; Category</th>
                <th className="py-3 px-3">Warehouse</th>
                <th className="py-3 px-3 text-center">Available</th>
                <th className="py-3 px-3 text-center">Reserved</th>
                <th className="py-3 px-3 text-center">Min Stock</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29305D]/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#17165A]/40 transition-colors group">
                  {/* Image & Name & SKU */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-contain bg-black/40 border border-[#29305D] p-0.5 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white text-xs hover:text-[#00D5FF] transition-colors cursor-pointer" onClick={() => setDrawerProduct(p)}>
                          {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#A7B1C2]">
                          <span className="font-mono text-[#00D5FF]">{p.sku}</span>
                          <span>•</span>
                          <span className="font-mono">{p.barcode}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Brand & Category */}
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">{p.brand}</p>
                    <p className="text-[10px] text-[#A7B1C2]">{p.category}</p>
                  </td>

                  {/* Warehouse */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-200">
                      <Building2 className="w-3.5 h-3.5 text-[#E9B94F]" />
                      <span>{p.warehouse}</span>
                    </div>
                  </td>

                  {/* Available Stock */}
                  <td className="py-3 px-3 text-center font-bold font-mono text-sm">
                    <span className={p.availableQty === 0 ? 'text-rose-400' : p.availableQty <= p.minStock ? 'text-amber-400' : 'text-emerald-400'}>
                      {p.availableQty}
                    </span>
                  </td>

                  {/* Reserved */}
                  <td className="py-3 px-3 text-center font-mono text-gray-300">
                    {p.reservedQty}
                  </td>

                  {/* Min Stock */}
                  <td className="py-3 px-3 text-center font-mono text-[#A7B1C2]">
                    {p.minStock}
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

                  {/* Price */}
                  <td className="py-3 px-3 text-right font-bold text-white font-mono">
                    ₹{Number(p.sellingPrice).toLocaleString('en-IN')}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View Drawer */}
                      <button
                        onClick={() => setDrawerProduct(p)}
                        className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#6500FF]/30 text-[#00D5FF] border border-[#29305D] transition-all cursor-pointer"
                        title="View Full Product Specs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Stock Update */}
                      <button
                        onClick={() => {
                          setStockUpdateItem(p);
                          setStockUpdateForm({ qtyDelta: 5, type: 'add', reason: 'Vault replenishment' });
                        }}
                        className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#E9B94F]/20 text-[#E9B94F] border border-[#29305D] transition-all cursor-pointer"
                        title="Adjust / Update Stock"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Transfer Modal */}
                      <button
                        onClick={() => {
                          setTransferItem(p);
                          setTransferForm({
                            fromWarehouse: p.warehouse,
                            toWarehouse: p.warehouse === 'Delhi Warehouse' ? 'Main Warehouse' : 'Delhi Warehouse',
                            quantity: 1,
                            notes: 'Store replenishment',
                          });
                        }}
                        className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#6500FF] text-white border border-[#29305D] transition-all cursor-pointer"
                        title="Transfer to Another Warehouse"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Add New Timepiece to Inventory</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Watch Model / Name *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. Rolex Submariner Date 41mm"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Brand *</label>
                  <select
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    <option value="Rolex">Rolex</option>
                    <option value="Omega">Omega</option>
                    <option value="TAG Heuer">TAG Heuer</option>
                    <option value="Seiko">Seiko</option>
                    <option value="Tissot">Tissot</option>
                    <option value="Cartier">Cartier</option>
                    <option value="Audemars Piguet">Audemars Piguet</option>
                    <option value="Patek Philippe">Patek Philippe</option>
                    <option value="Breitling">Breitling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    <option value="Luxury Watches">Luxury Watches</option>
                    <option value="Men's Watches">Men's Watches</option>
                    <option value="Women's Watches">Women's Watches</option>
                    <option value="Sports Watches">Sports Watches</option>
                    <option value="Automatic Watches">Automatic Watches</option>
                    <option value="Smartwatches">Smartwatches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    placeholder="e.g. WH-ROL-005"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Barcode (EAN-13)</label>
                  <input
                    type="text"
                    value={newProductForm.barcode}
                    onChange={(e) => setNewProductForm({ ...newProductForm, barcode: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Initial Warehouse Vault *</label>
                  <select
                    value={newProductForm.warehouse}
                    onChange={(e) => setNewProductForm({ ...newProductForm, warehouse: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.name}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Initial On-Hand Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.availableQty}
                    onChange={(e) => setNewProductForm({ ...newProductForm, availableQty: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Minimum Safety Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={newProductForm.minStock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, minStock: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Unit Procurement Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.unitCost}
                    onChange={(e) => setNewProductForm({ ...newProductForm, unitCost: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Retail Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.sellingPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sellingPrice: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#A7B1C2] mb-1 font-semibold">Supplier / Distributor</label>
                  <input
                    type="text"
                    value={newProductForm.supplier}
                    onChange={(e) => setNewProductForm({ ...newProductForm, supplier: e.target.value })}
                    className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] hover:to-[#7800db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK STOCK UPDATE */}
      {stockUpdateItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Quick Stock Adjustment</h3>
              </div>
              <button onClick={() => setStockUpdateItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#17165A]/50 rounded-xl border border-[#29305D] flex items-center gap-3">
              <img src={stockUpdateItem.image} alt={stockUpdateItem.name} className="w-10 h-10 rounded-lg object-contain bg-black/30" />
              <div>
                <p className="font-bold text-white text-xs">{stockUpdateItem.name}</p>
                <p className="text-[11px] text-[#A7B1C2]">Current Available: <strong className="text-emerald-400">{stockUpdateItem.availableQty}</strong> units</p>
              </div>
            </div>

            <form onSubmit={handleStockUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Action Type</label>
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
                    + Add Stock (Inbound)
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
                    - Deduct Stock (Outbound)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Quantity Delta</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockUpdateForm.qtyDelta}
                  onChange={(e) => setStockUpdateForm({ ...stockUpdateForm, qtyDelta: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Reason / Audit Justification</label>
                <input
                  type="text"
                  required
                  value={stockUpdateForm.reason}
                  onChange={(e) => setStockUpdateForm({ ...stockUpdateForm, reason: e.target.value })}
                  placeholder="e.g. Shipment verified, damaged write-off..."
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setStockUpdateItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INTER-WAREHOUSE TRANSFER */}
      {transferItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Inter-Vault Stock Transfer</h3>
              </div>
              <button onClick={() => setTransferItem(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#17165A]/50 rounded-xl border border-[#29305D]">
              <p className="font-bold text-white text-xs">{transferItem.name}</p>
              <p className="text-[11px] text-[#A7B1C2]">
                Origin: <strong className="text-[#00D5FF]">{transferItem.warehouse}</strong> (Available: {transferItem.availableQty})
              </p>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Destination Vault *</label>
                <select
                  value={transferForm.toWarehouse}
                  onChange={(e) => setTransferForm({ ...transferForm, toWarehouse: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                >
                  {warehouses
                    .filter((wh) => wh.name !== transferItem.warehouse)
                    .map((wh) => (
                      <option key={wh.id} value={wh.name}>
                        {wh.name} ({wh.location})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Units to Transfer</label>
                <input
                  type="number"
                  min="1"
                  max={transferItem.availableQty}
                  required
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="block text-[#A7B1C2] mb-1 font-semibold">Dispatch Notes / Courier Reference</label>
                <input
                  type="text"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  placeholder="e.g. Armored transit consignment #TR-8812"
                  className="w-full bg-[#17165A] border border-[#29305D] rounded-xl p-2.5 text-white focus:outline-hidden focus:border-[#6500FF]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#29305D]">
                <button
                  type="button"
                  onClick={() => setTransferItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-[#A7B1C2] hover:text-white font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  Dispatch Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: PRODUCT DETAILS */}
      {drawerProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border-l border-[#29305D] w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-fade-in text-xs">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
                <span className="font-mono text-xs text-[#00D5FF] font-bold">{drawerProduct.sku}</span>
                <button onClick={() => setDrawerProduct(null)} className="text-[#A7B1C2] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#17165A]/40 border border-[#29305D]">
                <img
                  src={drawerProduct.image}
                  alt={drawerProduct.name}
                  className="w-32 h-32 object-contain bg-black/50 rounded-2xl p-2 border border-white/10 mb-3 shadow-inner"
                />
                <h3 className="text-base font-black text-white">{drawerProduct.name}</h3>
                <p className="text-xs text-[#E9B94F] font-bold mt-0.5">{drawerProduct.brand}</p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-[#17165A]/30 border border-[#29305D]">
                <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">Vault &amp; Stock Metrics</h4>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Warehouse:</span>
                  <span className="font-semibold text-white">{drawerProduct.warehouse}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Available Qty:</span>
                  <span className="font-bold text-emerald-400">{drawerProduct.availableQty} units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Reserved Qty:</span>
                  <span className="text-white">{drawerProduct.reservedQty} units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Min Safety Stock:</span>
                  <span className="text-amber-400 font-semibold">{drawerProduct.minStock} units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Procurement Cost:</span>
                  <span className="text-white font-mono">₹{Number(drawerProduct.unitCost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#A7B1C2]">Selling Price:</span>
                  <span className="text-[#E9B94F] font-mono font-bold">₹{Number(drawerProduct.sellingPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-[#17165A]/30 border border-[#29305D]">
                <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">Supplier &amp; Barcode</h4>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Supplier:</span>
                  <span className="text-white text-right font-medium max-w-[200px] truncate">{drawerProduct.supplier}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                  <span className="text-[#A7B1C2]">Barcode:</span>
                  <span className="text-white font-mono">{drawerProduct.barcode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#A7B1C2]">Last Updated:</span>
                  <span className="text-gray-300">{drawerProduct.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#29305D] flex gap-2">
              <button
                onClick={() => {
                  setStockUpdateItem(drawerProduct);
                  setDrawerProduct(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#17165A] hover:bg-[#6500FF]/30 text-[#00D5FF] border border-[#29305D] font-bold text-center cursor-pointer"
              >
                Adjust Stock
              </button>
              <button
                onClick={() => setDrawerProduct(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold cursor-pointer"
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
