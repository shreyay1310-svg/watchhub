import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Upload,
  ArrowUpDown,
  Star,
  Box,
  FileSpreadsheet,
  Check,
  Tag,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

// Brand logos / icons helper
import { BRAND_LOGOS, SEED_ADMIN_PRODUCTS } from '../../../data/seedAdminProducts';
import ProductsTable from '../../products/ProductsTable';
import AddEditProductModal from '../../products/AddEditProductModal';
import ProductViewDetailsModal from '../../products/ProductViewDetailsModal';
import ProductBulkImportModal from '../../products/ProductBulkImportModal';

export const ProductsManagementModule = () => {
  const [products, setProducts] = useState(SEED_ADMIN_PRODUCTS);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'draft' | 'outOfStock' | 'featured'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Add / Edit Form State
  const initialFormState = {
    name: '',
    sku: '',
    brand: 'Rolex',
    category: 'Luxury Watches',
    subcategory: 'Wristwatch',
    productType: 'Analog',
    gender: 'Men',
    price: '',
    originalPrice: '',
    costPrice: '',
    stock: '',
    lowStockThreshold: 10,
    warehouseLocation: 'Zone A - Luxury Vault',
    barcode: '',
    image: '/images/products/rolex-submariner.png',
    description: '',
    isFeatured: false,
    status: 'Active',
    specifications: {
      dialSize: '41 mm',
      dialShape: 'Round',
      dialColor: 'Black',
      caseMaterial: 'Stainless Steel',
      caseColor: 'Silver',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Silver',
      movementType: 'Automatic',
      displayType: 'Analog',
      waterResistance: '100M Water Resistant',
      watchWeight: '150g',
      warranty: '2 Years Manufacturer Warranty',
      countryOfOrigin: 'Switzerland',
    },
    variants: [
      { variantSku: '', dialColor: 'Black', strapColor: 'Silver', size: '41 mm', price: '', stock: '' },
    ],
    seo: {
      metaTitle: '',
      metaDescription: '',
      slug: '',
    },
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formActiveTab, setFormActiveTab] = useState('basic'); // 'basic' | 'specs' | 'pricing' | 'inventory' | 'media' | 'variants' | 'seo'

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Statistics Calculations (Matching UI Reference)
  const stats = useMemo(() => {
    return {
      total: 320,
      active: 298,
      draft: 12,
      outOfStock: 10,
      featured: 45,
      rating: '4.6 / 5',
      reviewsCount: '12,480 reviews',
    };
  }, []);

  // 2. Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Tab Filter
      if (activeTab === 'active' && p.status !== 'Active') return false;
      if (activeTab === 'draft' && p.status !== 'Draft') return false;
      if (activeTab === 'outOfStock' && p.stock > 0 && p.status !== 'Out of Stock') return false;
      if (activeTab === 'featured' && !p.isFeatured) return false;

      // Text Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }

      // Dropdown Filters
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;

      // Price Range Filter
      if (selectedPriceRange !== 'All') {
        if (selectedPriceRange === 'under15k' && p.price >= 15000) return false;
        if (selectedPriceRange === '15k-50k' && (p.price < 15000 || p.price > 50000)) return false;
        if (selectedPriceRange === '50k-500k' && (p.price < 50000 || p.price > 500000)) return false;
        if (selectedPriceRange === 'above500k' && p.price <= 500000) return false;
      }

      return true;
    });
  }, [products, activeTab, searchTerm, selectedCategory, selectedBrand, selectedStatus, selectedPriceRange]);

  // Pagination Slice
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedStatus('All');
    setSelectedPriceRange('All');
    setActiveTab('all');
    setCurrentPage(1);
    showToast('Filters reset to default.');
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFormActiveTab('basic');
    setShowAddEditModal(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory || 'Wristwatch',
      productType: product.productType || 'Analog',
      gender: product.gender || 'Men',
      price: product.price,
      originalPrice: product.originalPrice,
      costPrice: product.costPrice || Math.round(product.price * 0.65),
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold || 10,
      warehouseLocation: product.warehouseLocation || 'Zone A - Luxury Vault',
      barcode: product.barcode || '',
      image: product.image,
      description: product.description || '',
      isFeatured: product.isFeatured || false,
      status: product.status || 'Active',
      specifications: product.specifications || initialFormState.specifications,
      variants: product.variants?.length ? product.variants : initialFormState.variants,
      seo: product.seo || initialFormState.seo,
    });
    setFormActiveTab('basic');
    setShowAddEditModal(true);
  };

  // Duplicate Product
  const handleDuplicateProduct = (product) => {
    const dupSku = `${product.sku}-COPY`;
    const duplicated = {
      ...product,
      id: `p_${Date.now()}`,
      name: `${product.name} (Copy)`,
      sku: dupSku,
      stock: 10,
      status: 'Draft',
    };
    setProducts([duplicated, ...products]);
    showToast(`Product duplicated as ${dupSku}`);
  };

  // Delete Product
  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      setProducts(products.filter((p) => p.id !== productId));
      setSelectedItems(selectedItems.filter((id) => id !== productId));
      showToast(`Deleted "${productName}"`);
    }
  };

  // Handle Form Submission (Add / Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim() || !formData.price) {
      alert('Please fill out the required fields: Product Name, SKU and Selling Price.');
      return;
    }

    const priceNum = Number(formData.price);
    const origNum = Number(formData.originalPrice) || priceNum;
    const costNum = Number(formData.costPrice) || Math.round(priceNum * 0.65);
    const discountCalc = origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;

    if (editingProduct) {
      // Update existing
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                price: priceNum,
                originalPrice: origNum,
                costPrice: costNum,
                discount: discountCalc,
                stock: Number(formData.stock) || 0,
              }
            : p
        )
      );
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      // Create new product
      const newProd = {
        id: `p_${Date.now()}`,
        ...formData,
        price: priceNum,
        originalPrice: origNum,
        costPrice: costNum,
        discount: discountCalc,
        stock: Number(formData.stock) || 10,
        rating: 4.5,
        reviewsCount: 1,
        subSpecs: `${formData.specifications.dialSize} • ${formData.specifications.caseMaterial} • ${formData.specifications.dialColor} Dial`,
      };
      setProducts([newProd, ...products]);
      showToast(`Created new product "${formData.name}"!`);
    }

    setShowAddEditModal(false);
  };

  // Bulk Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (!selectedItems.length) return;
    if (action === 'delete') {
      if (window.confirm(`Delete ${selectedItems.length} selected products?`)) {
        setProducts(products.filter((p) => !selectedItems.includes(p.id)));
        setSelectedItems([]);
        showToast(`${selectedItems.length} products deleted.`);
      }
    } else if (action === 'activate') {
      setProducts(products.map((p) => (selectedItems.includes(p.id) ? { ...p, status: 'Active' } : p)));
      setSelectedItems([]);
      showToast(`Activated ${selectedItems.length} products.`);
    } else if (action === 'deactivate') {
      setProducts(products.map((p) => (selectedItems.includes(p.id) ? { ...p, status: 'Draft' } : p)));
      setSelectedItems([]);
      showToast(`Moved ${selectedItems.length} products to draft.`);
    } else if (action === 'feature') {
      setProducts(products.map((p) => (selectedItems.includes(p.id) ? { ...p, isFeatured: true } : p)));
      setSelectedItems([]);
      showToast(`Marked ${selectedItems.length} products as featured.`);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Brand', 'Category', 'Price', 'OriginalPrice', 'Discount', 'Stock', 'Status', 'Rating'];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.brand,
      p.category,
      p.price,
      p.originalPrice,
      p.discount,
      p.stock,
      p.status,
      p.rating,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WatchHub_Products_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setImportExportOpen(false);
    showToast(`Exported ${filteredProducts.length} products to CSV!`);
  };

  // Download Template
  const handleDownloadTemplate = () => {
    const headers = ['name', 'sku', 'brand', 'category', 'price', 'originalPrice', 'stock', 'status', 'description'];
    const sample = ['Rolex Submariner Gold', 'WH-ROL-SAMPLE', 'Rolex', 'Luxury Watches', '24999', '29999', '15', 'Active', 'Sample watch description'];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sample.join(',')].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'WatchHub_Product_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setImportExportOpen(false);
    showToast('Downloaded CSV product import template.');
  };

  return (
    <div className="space-y-6 font-sans">
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
          1. PAGE HEADER STRIP (Title + Import/Export + Add Product Button)
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <span>Products Management</span>
            <span className="text-xl">📦</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A6B1C8] mt-0.5">
            Add, edit, manage and track all your watch products in one place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Import / Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setImportExportOpen(!importExportOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-[#10182D]/90 backdrop-blur-md hover:bg-[#0B1022]/80 text-[#A6B1C8] text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#A6B1C8]" />
              <span>Import / Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {importExportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#10182D]/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-1.5 z-50 text-xs animate-scaleUp">
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(true);
                    setImportExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-[#A6B1C8] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D6A63C]" />
                  <span>Bulk Import Products (CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-[#A6B1C8] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#D6A63C]" />
                  <span>Download Product Template</span>
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-[#A6B1C8] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Filtered Products</span>
                </button>
              </div>
            )}
          </div>

          {/* + Add New Product Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E6BA5E] hover:from-[#c3973e] hover:to-[#d4a84f] text-black font-extrabold text-xs shadow-md shadow-[#D6A63C]/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. FIVE PRODUCT OVERVIEW CARDS (Sparkline Highlights)
          ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Products */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A6B1C8]">Total Products</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D6A63C] flex items-center justify-center text-sm">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#F8FAFC] mt-2">{stats.total}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <span>↑ +8%</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A6B1C8]">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#F8FAFC] mt-2">{stats.active}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <span>↑ +10%</span>
          </div>
        </div>

        {/* Draft Products */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A6B1C8]">Draft Products</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#F8FAFC] mt-2">{stats.draft}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-1">
            <span>↑ +5%</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A6B1C8]">Out of Stock</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#F8FAFC] mt-2">{stats.outOfStock}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
            <span>↓ -4%</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#A6B1C8]">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D6A63C] flex items-center justify-center text-sm">
              <Star className="w-4 h-4 fill-[#D6A63C]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-[#F8FAFC] mt-2">{stats.rating}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            <span>{stats.reviewsCount}</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. PRODUCT TABS (All Products, Active, Draft, Out of Stock, Featured)
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Products', count: stats.total, icon: Layers },
          { id: 'active', label: 'Active', count: stats.active, icon: Check },
          { id: 'draft', label: 'Draft', count: stats.draft, icon: Tag },
          { id: 'outOfStock', label: 'Out of Stock', count: stats.outOfStock, icon: AlertTriangle },
          { id: 'featured', label: 'Featured', count: stats.featured, icon: Star },
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
                  : 'bg-[#10182D]/90 backdrop-blur-md border border-white/10 text-[#A6B1C8] hover:bg-[#0B1022]/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D6A63C]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isSelected ? 'bg-[#10182D]/90 backdrop-blur-md/20 text-[#D6A63C]' : 'bg-white/5 text-[#A6B1C8]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          4. SEARCH AND FILTERS TOOLBAR
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#10182D]/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        {/* Search Input */}
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
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-white/10 bg-[#0B1022]/80/50 text-[#F8FAFC] focus:bg-[#10182D]/90 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#D6A63C]/40 focus:border-[#D6A63C] transition-all font-medium"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-white/10 bg-[#10182D]/90 backdrop-blur-md text-xs font-semibold text-[#A6B1C8] focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Category: All</option>
            <option value="Luxury Watches">Luxury Watches</option>
            <option value="Men's Watches">Men's Watches</option>
            <option value="Women's Watches">Women's Watches</option>
            <option value="Sports Watches">Sports Watches</option>
            <option value="Smartwatches">Smartwatches</option>
            <option value="Kids' Watches">Kids' Watches</option>
          </select>

          {/* Brand Dropdown */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-white/10 bg-[#10182D]/90 backdrop-blur-md text-xs font-semibold text-[#A6B1C8] focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Brand: All</option>
            <option value="Rolex">Rolex</option>
            <option value="Omega">Omega</option>
            <option value="Patek Philippe">Patek Philippe</option>
            <option value="Audemars Piguet">Audemars Piguet</option>
            <option value="Cartier">Cartier</option>
            <option value="Apple">Apple</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-white/10 bg-[#10182D]/90 backdrop-blur-md text-xs font-semibold text-[#A6B1C8] focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Price Range Dropdown */}
          <select
            value={selectedPriceRange}
            onChange={(e) => {
              setSelectedPriceRange(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-white/10 bg-[#10182D]/90 backdrop-blur-md text-xs font-semibold text-[#A6B1C8] focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Price Range: All</option>
            <option value="under15k">Under ₹15,000</option>
            <option value="15k-50k">₹15,000 – ₹50,000</option>
            <option value="50k-500k">₹50,000 – ₹5,00,000</option>
            <option value="above500k">Above ₹5,00,000</option>
          </select>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-10 px-3 rounded-xl border border-white/10 bg-[#10182D]/90 backdrop-blur-md hover:bg-[#0B1022]/80 text-[#A6B1C8] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#A6B1C8]" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          5. BULK ACTIONS TOOLBAR (Appears when items are selected)
          ════════════════════════════════════════════════════════════════ */}
      {selectedItems.length > 0 && (
        <div className="bg-[#0B121C] text-white p-3 rounded-xl border border-[#D6A63C]/40 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
          <span className="font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D6A63C] text-black flex items-center justify-center text-[10px]">
              {selectedItems.length}
            </span>
            <span>products selected</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              Bulk Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs"
            >
              Bulk Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('feature')}
              className="px-3 py-1.5 rounded-lg bg-[#D6A63C] text-black font-bold text-xs"
            >
              Mark Featured
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* 6 & 7. MAIN PRODUCT TABLE & PAGINATION (Extracted Component) */}
      <ProductsTable
        paginatedProducts={paginatedProducts}
        selectedItems={selectedItems}
        handleSelectAll={handleSelectAll}
        handleToggleSelect={handleToggleSelect}
        handleOpenEditModal={handleOpenEditModal}
        handleDuplicateProduct={handleDuplicateProduct}
        handleDeleteProduct={handleDeleteProduct}
        setShowDetailsModal={setShowDetailsModal}
        stats={stats}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        BRAND_LOGOS={BRAND_LOGOS}
      />

      {/* 8. ADD / EDIT PRODUCT MODAL (Extracted Component) */}
      <AddEditProductModal
        showAddEditModal={showAddEditModal}
        setShowAddEditModal={setShowAddEditModal}
        editingProduct={editingProduct}
        formActiveTab={formActiveTab}
        setFormActiveTab={setFormActiveTab}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        BRAND_LOGOS={BRAND_LOGOS}
      />

      {/* 9. PRODUCT DETAILS MODAL (Extracted Component) */}
      <ProductViewDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
      />

      {/* 10. BULK IMPORT CSV MODAL (Extracted Component) */}
      <ProductBulkImportModal
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
        showToast={showToast}
        handleDownloadTemplate={handleDownloadTemplate}
      />
    </div>
  );
};

export default ProductsManagementModule;
