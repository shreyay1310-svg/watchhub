import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CustomerNavbar } from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { getProductImage, getProductAlt } from '../../utils/productImageMap';
import { NAVBAR_PAGES_CONFIG } from '../../data/navbarPagesConfig';
import CatalogQuickViewModal from '../../components/catalog/CatalogQuickViewModal';
import CatalogMobileFilterDrawer from '../../components/catalog/CatalogMobileFilterDrawer';
import {
  Heart, ShoppingCart, Star, SlidersHorizontal, ChevronDown, ChevronRight, RotateCcw,
  Sparkles, ShieldCheck, Truck, Award, Zap, Check, Eye, X, ArrowRight, Filter,
  Layers, Sparkle, Compass, Grid3X3, LayoutGrid
} from 'lucide-react';

export const CategoryCatalogPage = ({ pageKey = 'watches' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  const config = NAVBAR_PAGES_CONFIG[pageKey] || NAVBAR_PAGES_CONFIG.watches;

  // URL Query Sync
  const querySub = searchParams.get('sub') || searchParams.get('style') || searchParams.get('filter') || searchParams.get('type') || searchParams.get('activity') || searchParams.get('series') || 'all';
  const queryBrand = searchParams.get('brand') || 'all';
  const querySort = searchParams.get('sort') || 'featured';
  const queryPrice = searchParams.get('price') || 'all';

  // Filters State
  const [selectedSub, setSelectedSub] = useState(querySub);
  const [selectedBrand, setSelectedBrand] = useState(queryBrand);
  const [selectedPriceRange, setSelectedPriceRange] = useState(queryPrice);
  const [selectedMovement, setSelectedMovement] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(querySort);
  const [gridCols, setGridCols] = useState(4); // 3 or 4 cols

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mobile Filters Drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Keep state synced when URL changes
  useEffect(() => {
    setSelectedSub(querySub);
    setSelectedBrand(queryBrand);
    setSortBy(querySort);
    setSelectedPriceRange(queryPrice);
    setCurrentPage(1);
  }, [querySub, queryBrand, querySort, queryPrice, pageKey]);

  // Update query params when filters change
  const handleSubChange = (subId, link) => {
    if (link) {
      navigate(link);
      return;
    }
    setSelectedSub(subId);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (subId === 'all') {
      newParams.delete('sub');
      newParams.delete('style');
      newParams.delete('filter');
    } else {
      newParams.set('sub', subId);
    }
    setSearchParams(newParams);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (brand === 'all') {
      newParams.delete('brand');
    } else {
      newParams.set('brand', brand);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedSub('all');
    setSelectedBrand('all');
    setSelectedPriceRange('all');
    setSelectedMovement('all');
    setSelectedRating('all');
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Base Products for this Category
  const baseCategoryProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(config.baseFilter);
  }, [config]);

  // Derived available brands within this category
  const availableBrands = useMemo(() => {
    const brandsMap = {};
    baseCategoryProducts.forEach((p) => {
      if (p.brand) {
        brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
      }
    });
    return Object.entries(brandsMap).sort((a, b) => b[1] - a[1]);
  }, [baseCategoryProducts]);

  // Full Filtered Products
  const filteredProducts = useMemo(() => {
    let result = baseCategoryProducts.filter((p) => config.subFilter(p, selectedSub));

    // Brand Filter
    if (selectedBrand !== 'all') {
      result = result.filter(
        (p) => p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Price Range Filter
    if (selectedPriceRange !== 'all') {
      if (selectedPriceRange === 'under-25k') {
        result = result.filter((p) => p.price < 25000);
      } else if (selectedPriceRange === '25k-100k') {
        result = result.filter((p) => p.price >= 25000 && p.price <= 100000);
      } else if (selectedPriceRange === '100k-500k') {
        result = result.filter((p) => p.price > 100000 && p.price <= 500000);
      } else if (selectedPriceRange === 'above-500k') {
        result = result.filter((p) => p.price > 500000);
      }
    }

    // Movement Filter
    if (selectedMovement !== 'all') {
      result = result.filter((p) => {
        const mov = (p.movement || '').toLowerCase();
        if (selectedMovement === 'automatic') return mov.includes('automatic') || mov.includes('self');
        if (selectedMovement === 'mechanical') return mov.includes('manual') || mov.includes('hand') || mov.includes('tourbillon');
        if (selectedMovement === 'quartz') return mov.includes('quartz');
        if (selectedMovement === 'digital') return mov.includes('digital') || p.category === 'Digital';
        if (selectedMovement === 'smart') return p.category === 'Smartwatches' || mov.includes('processor');
        return true;
      });
    }

    // Rating Filter
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter((p) => p.rating >= minRating);
    }

    // In Stock Only
    if (inStockOnly) {
      result = result.filter((p) => (p.stock || 0) > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [
    baseCategoryProducts,
    config,
    selectedSub,
    selectedBrand,
    selectedPriceRange,
    selectedMovement,
    selectedRating,
    inStockOnly,
    sortBy,
  ]);

  // Paginated Slicing
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const activeSubLabel = useMemo(() => {
    const found = config.subcategories.find((s) => s.id === selectedSub);
    return found ? found.label : selectedSub;
  }, [config, selectedSub]);

  const hasActiveFilters =
    selectedSub !== 'all' ||
    selectedBrand !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedMovement !== 'all' ||
    selectedRating !== 'all' ||
    inStockOnly;

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] font-sans antialiased select-none flex flex-col justify-between">
      {/* 1. Global Navigation Bar */}
      <CustomerNavbar />

      <main className="flex-1 pb-16">
        {/* 2. Breadcrumb Navigation */}
        <div className="border-b border-white/[0.08] bg-[#030B1A]/80 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center gap-2 text-xs text-[#A6B1C8]">
            <Link to="/" className="hover:text-[#00CFFF] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <Link
              to={config.route}
              onClick={() => handleSubChange('all')}
              className={`transition-colors ${selectedSub === 'all' ? 'text-[#F4B942] font-semibold' : 'hover:text-[#00CFFF]'
                }`}
            >
              {config.badge}
            </Link>
            {selectedSub !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-[#00CFFF] font-semibold capitalize">
                  {activeSubLabel}
                </span>
              </>
            )}
            {selectedBrand !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-white font-semibold">
                  {selectedBrand}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 3. Premium Category Hero Banner */}
        <section className={`relative overflow-hidden bg-gradient-to-b ${config.gradient} border-b border-white/[0.08] py-12 sm:py-16`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00CFFF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F4B942]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4B942]/15 border border-[#F4B942]/30 text-[#F4B942] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                <Sparkles className="w-3 h-3 text-[#F4B942]" />
                <span>{config.badge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
                {config.title}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#A6B1C8] leading-relaxed">
                {config.subtitle}
              </p>
            </div>

            {/* Quick Category Sub-Navigation Cards / Pills */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#00CFFF]">
                  Explore Subcategories
                </p>
                {pageKey === 'watches' && (
                  <Link
                    to="/customize-watch"
                    className="text-xs text-[#F4B942] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>🎨 Launch 3D Configurator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {config.subcategories.map((sub) => {
                  const isActive = selectedSub === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubChange(sub.id, sub.link)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${isActive
                        ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#1265FF]/20 border-[#00CFFF] text-white shadow-[0_0_20px_rgba(0,207,255,0.25)]'
                        : 'bg-[#040C1A]/80 border-white/10 text-[#A6B1C8] hover:border-[#F4B942]/50 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <span className="text-xl mb-1.5 block group-hover:scale-110 transition-transform">
                        {sub.icon}
                      </span>
                      <span className="text-xs font-bold block truncate">
                        {sub.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Main Two-Column Layout: Left Filters + Right Product Grid */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── LEFT DESKTOP FILTER SIDEBAR ── */}
            <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6 bg-[#040C1A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Filter className="w-4 h-4 text-[#00CFFF]" />
                  <span>Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#F4B942] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* Subcategory Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8] block mb-2.5">
                  Category Style
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1">
                  {config.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubChange(sub.id, sub.link)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${selectedSub === sub.id
                        ? 'bg-[#00CFFF]/20 text-[#00CFFF] font-bold border border-[#00CFFF]/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{sub.icon}</span>
                        <span>{sub.label}</span>
                      </span>
                      {selectedSub === sub.id && <Check className="w-3.5 h-3.5 text-[#00CFFF]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8] block mb-2.5">
                    Brand
                  </label>
                  <div className="space-y-1 max-h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1">
                    <button
                      type="button"
                      onClick={() => handleBrandChange('all')}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${selectedBrand === 'all'
                        ? 'bg-[#F4B942]/20 text-[#F4B942] font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span>All Brands</span>
                      <span className="text-[10px] text-gray-500">{baseCategoryProducts.length}</span>
                    </button>
                    {availableBrands.map(([brand, count]) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleBrandChange(brand)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${selectedBrand.toLowerCase() === brand.toLowerCase()
                          ? 'bg-[#F4B942]/20 text-[#F4B942] font-bold border border-[#F4B942]/30'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <span className="truncate">{brand}</span>
                        <span className="text-[10px] text-gray-500">{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8] block mb-2.5">
                  Price Range
                </label>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-25k', label: 'Under ₹25,000' },
                    { id: '25k-100k', label: '₹25,000 – ₹1,00,000' },
                    { id: '100k-500k', label: '₹1,00,000 – ₹5,00,000' },
                    { id: 'above-500k', label: 'Above ₹5,00,000' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPriceRange(p.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${selectedPriceRange === p.id
                        ? 'bg-[#00CFFF]/20 text-[#00CFFF] font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span>{p.label}</span>
                      {selectedPriceRange === p.id && <Check className="w-3.5 h-3.5 text-[#00CFFF]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Movement Filter */}
              <div className="pt-4 border-t border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8] block mb-2.5">
                  Movement / Calibre
                </label>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'all', label: 'All Movements' },
                    { id: 'automatic', label: 'Automatic Mechanical' },
                    { id: 'mechanical', label: 'Manual Wind / Tourbillon' },
                    { id: 'quartz', label: 'High-Precision Quartz' },
                    { id: 'digital', label: 'Digital / Multi-Display' },
                    { id: 'smart', label: 'Connected Smart Engine' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMovement(m.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${selectedMovement === m.id
                        ? 'bg-[#F4B942]/20 text-[#F4B942] font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span>{m.label}</span>
                      {selectedMovement === m.id && <Check className="w-3.5 h-3.5 text-[#F4B942]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="pt-4 border-t border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8] block mb-2.5">
                  Minimum Rating
                </label>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'all', label: 'Any Rating' },
                    { id: '4.9', label: '4.9★ & Above (Top Rated)' },
                    { id: '4.7', label: '4.7★ & Above' },
                    { id: '4.5', label: '4.5★ & Above' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRating(r.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${selectedRating === r.id
                        ? 'bg-[#00CFFF]/20 text-[#00CFFF] font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <span>{r.label}</span>
                      {selectedRating === r.id && <Check className="w-3.5 h-3.5 text-[#00CFFF]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Only Toggle */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                  <span>In-Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-[#00CFFF] cursor-pointer"
                  />
                </label>
              </div>
            </aside>

            {/* ── RIGHT PRODUCT CONTENT ── */}
            <div className="flex-1 w-full space-y-6">

              {/* Toolbar: Count, Mobile Filter Button, Active Pills, Sort & Grid Switcher */}
              <div className="bg-[#040C1A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Left: Product Count & Mobile Filter Trigger */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#00CFFF]" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-[#00CFFF]" />
                    )}
                  </button>

                  <p className="text-xs text-[#A6B1C8]">
                    Showing{' '}
                    <span className="font-bold text-white">
                      {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                      –
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </span>{' '}
                    of <span className="font-bold text-[#F4B942]">{filteredProducts.length}</span> timepieces
                  </p>
                </div>

                {/* Right: Sort By Dropdown & Grid Toggle */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#A6B1C8] hidden sm:inline">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[#061024] text-xs font-semibold text-white border border-white/10 rounded-xl px-3 py-1.5 outline-none focus:border-[#00CFFF] transition-colors cursor-pointer"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="newest">New Arrivals</option>
                    </select>
                  </div>

                  {/* Grid Column Switcher (3 vs 4 cols on large screens) */}
                  <div className="hidden xl:flex items-center bg-[#061024] border border-white/10 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => setGridCols(3)}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${gridCols === 3 ? 'bg-[#00CFFF]/20 text-[#00CFFF]' : 'text-gray-400 hover:text-white'
                        }`}
                      title="3 Columns"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGridCols(4)}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${gridCols === 4 ? 'bg-[#00CFFF]/20 text-[#00CFFF]' : 'text-gray-400 hover:text-white'
                        }`}
                      title="4 Columns"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-gray-400">Active filters:</span>
                  {selectedSub !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00CFFF]/15 border border-[#00CFFF]/30 text-[#00CFFF]">
                      <span>Style: {activeSubLabel}</span>
                      <button
                        type="button"
                        onClick={() => handleSubChange('all')}
                        className="hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedBrand !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4B942]/15 border border-[#F4B942]/30 text-[#F4B942]">
                      <span>Brand: {selectedBrand}</span>
                      <button
                        type="button"
                        onClick={() => handleBrandChange('all')}
                        className="hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                      <span>Price Filter</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPriceRange('all')}
                        className="hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-rose-400 hover:underline cursor-pointer ml-1 font-semibold"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
                    } gap-6`}
                >
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        product={product}
                        isInWishlist={isInWishlist(product.id)}
                        onAddToCart={() => addToCart(product)}
                        onToggleWishlist={() => toggleWishlist(product)}
                        onQuickView={() => setQuickViewProduct(product)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty Search / Filter State */
                <div className="bg-[#040C1A]/60 border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-2xl text-[#F4B942]">
                    ⌚
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    No Timepieces Match Your Filters
                  </h3>
                  <p className="text-xs text-[#A6B1C8] leading-relaxed">
                    We could not find any watches matching your selected criteria in {config.title}. Try clearing some filters or browse all styles.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#1265FF] text-white font-bold text-xs shadow-lg shadow-[#00CFFF]/20 hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}

              {/* 5. Pagination */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#040C1A] border border-white/10 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                        ? 'bg-gradient-to-r from-[#00CFFF] to-[#1265FF] text-white shadow-md shadow-[#00CFFF]/30'
                        : 'bg-[#040C1A] border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#040C1A] border border-white/10 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* 6. Luxury Atelier Customizer Banner */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-8 mt-16">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A1428] via-[#0D1C38] to-[#060D1E] border border-[#00CFFF]/30 p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-xl space-y-3 z-10 text-center md:text-left">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#F4B942]">
                BESPOKE TIMEPIECE CRAFTSMANSHIP
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Can't Find Your Ideal Timepiece? Design Your Own.
              </h2>
              <p className="text-xs sm:text-sm text-[#A6B1C8] leading-relaxed">
                Step into the WatchHub Atelier 3D Customizer. Select your watch dial, case material, Swiss skeleton movement, ceramic bezel, and hand-stitched alligator strap with bespoke laser engraving.
              </p>
              <div className="pt-2">
                <Link
                  to="/customize-watch"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F4B942] to-[#E5A82E] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-[#F4B942]/20 transition-all cursor-pointer"
                >
                  <span>Launch 3D Watch Configurator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex-shrink-0 flex items-center justify-center z-10">
              <img
                src="/images/products/chronoswiss-tourbillon.png"
                alt="WatchHub Atelier Customizer - Chronoswiss Flying Tourbillon"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,207,255,0.35)]"
                onError={(e) => {
                  e.target.src = '/images/products/watch_placeholder.png';
                }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* 7. Mobile Filters Slide-over Drawer */}
      <CatalogMobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        config={config}
        selectedSub={selectedSub}
        handleSubChange={handleSubChange}
        availableBrands={availableBrands}
        selectedBrand={selectedBrand}
        handleBrandChange={handleBrandChange}
        baseCategoryProductsCount={baseCategoryProducts.length}
        handleResetFilters={handleResetFilters}
      />

      {/* 8. Quick View Modal */}
      <CatalogQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        onNavigateDetails={(id) => navigate(`/product/${id}`)}
        formatPrice={formatPrice}
      />

      {/* 9. Global WatchHub Footer */}
      <Footer />
    </div>
  );
};

export default CategoryCatalogPage;
