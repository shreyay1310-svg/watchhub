import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import { CustomerNavbar } from '../../components/common/Header';
import {
  Search,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sparkles,
  User,
  Heart,
  Crown,
  Droplets,
  Clock,
  Settings,
  Activity,
  Smile,
  Cpu,
  Layers,
  Watch,
  Grid,
} from 'lucide-react';
import {
  ALL_CATEGORIES_12,
  GENDER_FILTERS,
  TYPE_FILTERS,
  OCCASION_FILTERS,
  SORT_OPTIONS,
} from '../../data/categoriesData';

export const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGender('All');
    setSelectedType('All');
    setSelectedOccasion('All');
    setSortBy('popular');
  };

  const isFiltering =
    searchQuery.trim() !== '' ||
    selectedGender !== 'All' ||
    selectedType !== 'All' ||
    selectedOccasion !== 'All' ||
    sortBy !== 'popular';

  // Filtered & sorted categories based on actual category data
  const filteredCategories = useMemo(() => {
    return ALL_CATEGORIES_12.filter((cat) => {
      // 1. Search Query (instant filtering)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = cat.name.toLowerCase().includes(q);
        const matchesType = cat.type.toLowerCase().includes(q);
        const matchesOccasion = cat.occasion.toLowerCase().includes(q);
        const matchesGender = cat.gender.toLowerCase().includes(q);
        const matchesDesc = (cat.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesType && !matchesOccasion && !matchesGender && !matchesDesc) {
          return false;
        }
      }

      // 2. Gender Filter (Men, Women, Kids, Unisex)
      if (selectedGender !== 'All') {
        if (selectedGender === 'Unisex') {
          if (cat.gender !== 'Unisex') return false;
        } else if (selectedGender === 'Men') {
          if (cat.gender !== 'Men' && cat.gender !== 'Unisex') return false;
        } else if (selectedGender === 'Women') {
          if (cat.gender !== 'Women' && cat.gender !== 'Unisex') return false;
        } else if (selectedGender === 'Kids') {
          if (cat.gender !== 'Kids') return false;
        }
      }

      // 3. Watch Type Filter (Analog, Digital, Smartwatch, Automatic, Chronograph)
      if (selectedType !== 'All') {
        if (!cat.type.toLowerCase().includes(selectedType.toLowerCase())) {
          return false;
        }
      }

      // 4. Occasion Filter (Casual, Formal, Sports, Party, Luxury, Daily Wear)
      if (selectedOccasion !== 'All') {
        const occQ = selectedOccasion.toLowerCase();
        const catOcc = cat.occasion.toLowerCase();
        if (!catOcc.includes(occQ) && !occQ.includes(catOcc)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'newest') return (b.isNewest ? 1 : 0) - (a.isNewest ? 1 : 0);
      return a.sortOrder - b.sortOrder; // 'popular' preserves default reference layout
    });
  }, [searchQuery, selectedGender, selectedType, selectedOccasion, sortBy]);

  // Render category icon helper matching reference colors
  const renderCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'user':
        return <User className="w-4 h-4 text-[#E6B84F]" />;
      case 'female':
        return <span className="text-sm font-bold text-[#E6B84F] leading-none">♀</span>;
      case 'watch':
        return <Watch className="w-4 h-4 text-[#A855F7]" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-[#E6B84F]" />;
      case 'crown':
        return <Crown className="w-4 h-4 text-[#E6B84F]" />;
      case 'glass':
        return <span className="text-sm text-[#E6B84F] leading-none">🍸</span>;
      case 'droplet':
        return <Droplets className="w-4 h-4 text-[#00D5FF]" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-[#FF35C8] fill-[#FF35C8]/30" />;
      case 'smile':
        return <Smile className="w-4 h-4 text-[#E6B84F]" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 text-[#00D5FF]" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-[#E6B84F]" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-[#E6B84F]" />;
      default:
        return <Clock className="w-4 h-4 text-[#E6B84F]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-[#F8FAFC] font-sans flex flex-col selection:bg-[#E6B84F] selection:text-black">
      {/* 1. Global Luxury Navbar */}
      <CustomerNavbar />

      {/* 2. Page Header with Breadcrumb, Gold Heading & Right Hero Watch Art */}
      <section className="relative bg-[#050B18] border-b border-[#1E2C44]/40 pt-5 pb-8 px-4 sm:px-8 overflow-hidden select-none">
        {/* Right Side Luxury Watch Background Image with soft gradient fade */}
        <div className="absolute top-0 right-0 h-full w-[360px] sm:w-[480px] lg:w-[580px] pointer-events-none opacity-90 overflow-hidden">
          <img
            src="/images/hd_categories/categories_header_watch.png"
            alt="Luxury Bezel Art"
            className="w-full h-full object-cover object-left-top filter drop-shadow-2xl"
          />
          {/* Subtle left-to-right fade gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B18] via-[#050B18]/50 to-transparent" />
          {/* Bottom fade gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050B18] to-transparent" />
        </div>

        <div className="max-w-[1520px] mx-auto relative z-10">
          {/* Breadcrumbs matching "Home > Categories" */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <Link to="/" className="hover:text-[#E6B84F] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#E6B84F] font-medium">Categories</span>
          </nav>

          {/* Main Heading matching "Explore All Categories" with gold highlight & underline */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-white tracking-tight leading-tight">
              Explore All <span className="text-[#E6B84F]">Categories</span>
            </h1>
            {/* Elegant gold underline */}
            <div className="w-16 sm:w-20 h-[2.5px] bg-[#E6B84F] rounded-full my-3 shadow-[0_0_8px_rgba(230,184,79,0.5)]" />
            <p className="text-xs sm:text-sm text-[#8A9BB5] font-light leading-relaxed">
              Find the perfect watch for every style, need and occasion.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Search and Filter Toolbar (Single Horizontal Bar matching Reference Screenshot) */}
      <section className="bg-[#050B18] py-4 px-4 sm:px-8">
        <div className="max-w-[1520px] mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories (e.g. Smartwatch, Sports, Luxury)"
                className="w-full h-11 pl-11 pr-9 rounded-full bg-[#0C1524] border border-[#1E2C44] text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#E6B84F] transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full bg-white/10"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills Toolbar */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {/* Pill 1: All Categories (12) Button with Gold Border */}
              <button
                type="button"
                onClick={handleResetFilters}
                className={`h-11 px-4 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 border ${
                  !isFiltering
                    ? 'border-[#E6B84F] bg-[#E6B84F]/10 text-[#E6B84F] shadow-[0_0_15px_rgba(230,184,79,0.25)]'
                    : 'border-[#1E2C44] bg-[#0C1524] text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                <Layers className="w-4 h-4 text-[#E6B84F]" />
                <span>All Categories (12)</span>
              </button>

              {/* Pill 2: Gender Dropdown */}
              <div className="relative flex-shrink-0">
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className={`h-11 pl-4 pr-9 rounded-full text-xs font-semibold bg-[#0C1524] border transition-all cursor-pointer appearance-none ${
                    selectedGender !== 'All'
                      ? 'border-[#E6B84F] text-[#E6B84F] font-bold bg-[#E6B84F]/10 shadow-[0_0_12px_rgba(230,184,79,0.2)]'
                      : 'border-[#1E2C44] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <option value="All" className="bg-[#0C1524] text-white">
                    👤 Gender (All)
                  </option>
                  {GENDER_FILTERS.filter((g) => g !== 'All').map((g) => (
                    <option key={g} value={g} className="bg-[#0C1524] text-white">
                      Gender: {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Pill 3: Watch Type Dropdown */}
              <div className="relative flex-shrink-0">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`h-11 pl-4 pr-9 rounded-full text-xs font-semibold bg-[#0C1524] border transition-all cursor-pointer appearance-none ${
                    selectedType !== 'All'
                      ? 'border-[#E6B84F] text-[#E6B84F] font-bold bg-[#E6B84F]/10 shadow-[0_0_12px_rgba(230,184,79,0.2)]'
                      : 'border-[#1E2C44] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <option value="All" className="bg-[#0C1524] text-white">
                    ⌚ Watch Type (All)
                  </option>
                  {TYPE_FILTERS.filter((t) => t !== 'All').map((t) => (
                    <option key={t} value={t} className="bg-[#0C1524] text-white">
                      Type: {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Pill 4: Occasion Dropdown */}
              <div className="relative flex-shrink-0">
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className={`h-11 pl-4 pr-9 rounded-full text-xs font-semibold bg-[#0C1524] border transition-all cursor-pointer appearance-none ${
                    selectedOccasion !== 'All'
                      ? 'border-[#E6B84F] text-[#E6B84F] font-bold bg-[#E6B84F]/10 shadow-[0_0_12px_rgba(230,184,79,0.2)]'
                      : 'border-[#1E2C44] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <option value="All" className="bg-[#0C1524] text-white">
                    📅 Occasion (All)
                  </option>
                  {OCCASION_FILTERS.filter((o) => o !== 'All').map((o) => (
                    <option key={o} value={o} className="bg-[#0C1524] text-white">
                      Occasion: {o}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Pill 5: Sort Dropdown */}
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`h-11 pl-4 pr-9 rounded-full text-xs font-semibold bg-[#0C1524] border transition-all cursor-pointer appearance-none ${
                    sortBy !== 'popular'
                      ? 'border-[#E6B84F] text-[#E6B84F] font-bold bg-[#E6B84F]/10 shadow-[0_0_12px_rgba(230,184,79,0.2)]'
                      : 'border-[#1E2C44] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#0C1524] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Reset Filters Button */}
              {isFiltering && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-11 px-4 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Watch Categories Container (12 Category Cards Grid) */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-8 py-5 flex-1 w-full">
        <div className="bg-[#091120] rounded-3xl p-5 sm:p-7 border border-[#192438] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Container Header Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1E2C44]/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#E6B84F]" />
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Featured Watch Categories
                </h2>
              </div>
              <span className="text-[11px] font-bold text-[#00D5FF] bg-[#00D5FF]/10 border border-[#00D5FF]/40 px-3 py-0.5 rounded-full">
                {filteredCategories.length} Categories Available
              </span>
            </div>
            <span className="text-xs text-[#8A9BB5] font-normal hidden sm:inline">
              Click any category card to view full product collection
            </span>
          </div>

          {/* 12 Cards Grid or Empty Search State */}
          {filteredCategories.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#101A2B] text-[#E6B84F] flex items-center justify-center text-2xl mx-auto mb-4 border border-[#E6B84F]/40 shadow-[0_0_20px_rgba(230,184,79,0.2)]">
                🔍
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No Categories Found</h3>
              <p className="text-xs text-[#8A9BB5] mb-5 leading-relaxed">
                No watch category matched "{searchQuery}". Try clearing your filters to explore all 12 curated watch collections.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E6B84F] to-[#D4A84F] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(230,184,79,0.3)] hover:brightness-110 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Responsive 6-column desktop grid with 2 rows */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.link}
                  className="group bg-[#101A2B] border border-[#1E2C44] hover:border-[#E6B84F]/70 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 cursor-pointer overflow-hidden"
                  title={`Explore ${cat.name} Collection (${cat.styles})`}
                >
                  {/* Top: Product Image with dark background frame (aspect-[16/10]) */}
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0A1220] flex items-center justify-center mb-3 border border-white/5">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = cat.fallbackImage;
                      }}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md"
                      loading="lazy"
                    />
                    {/* Soft Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Bottom: Icon + Title + Count + Right Circular Arrow */}
                  <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Left Category Icon */}
                      <div className="w-7 h-7 rounded-full bg-[#0A1220] border border-white/10 group-hover:border-[#E6B84F]/50 flex items-center justify-center flex-shrink-0 transition-colors">
                        {renderCategoryIcon(cat.icon)}
                      </div>

                      {/* Text info */}
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#E6B84F] tracking-tight leading-tight truncate transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-[#8A9BB5] font-medium truncate mt-0.5">
                          {cat.styles}
                        </p>
                      </div>
                    </div>

                    {/* Right Circular Navigation Arrow */}
                    <div className="w-7 h-7 rounded-full border border-white/15 group-hover:border-[#E6B84F] group-hover:bg-[#E6B84F]/10 group-hover:text-[#E6B84F] flex items-center justify-center text-slate-400 transition-all flex-shrink-0 shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 5. Standard Global Footer */}
      <Footer />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C1524] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#E6B84F]/40 flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#E6B84F] animate-pulse flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
