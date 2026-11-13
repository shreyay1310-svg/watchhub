import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Sparkles,
  User,
  Heart,
  Crown,
  Droplet,
  Clock,
  Settings,
  Activity,
  Smile,
  Cpu,
  Layers,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { CustomerNavbar } from '../../components/common/Header';
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
  const [newsletterEmail, setNewsletterEmail] = useState('');
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

  // Filtered & sorted categories
  const filteredCategories = useMemo(() => {
    return ALL_CATEGORIES_12.filter((cat) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = cat.name.toLowerCase().includes(q);
        const matchesType = cat.type.toLowerCase().includes(q);
        const matchesOccasion = cat.occasion.toLowerCase().includes(q);
        const matchesGender = cat.gender.toLowerCase().includes(q);
        const matchesDesc = cat.description.toLowerCase().includes(q);
        if (!matchesName && !matchesType && !matchesOccasion && !matchesGender && !matchesDesc) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender !== 'All') {
        if (selectedGender === 'Unisex' && cat.gender !== 'Unisex') return false;
        if (selectedGender === 'Men' && cat.gender !== 'Men' && cat.gender !== 'Unisex') return false;
        if (selectedGender === 'Women' && cat.gender !== 'Women' && cat.gender !== 'Unisex') return false;
        if (selectedGender === 'Kids' && cat.gender !== 'Kids') return false;
      }

      // Type filter
      if (selectedType !== 'All') {
        if (!cat.type.toLowerCase().includes(selectedType.toLowerCase())) {
          return false;
        }
      }

      // Occasion filter
      if (selectedOccasion !== 'All') {
        if (!cat.occasion.toLowerCase().includes(selectedOccasion.toLowerCase().split(' ')[0])) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'styles_desc') return b.count - a.count;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      return 0; // 'popular' preserves default editorial sequence
    });
  }, [searchQuery, selectedGender, selectedType, selectedOccasion, sortBy]);

  // Render category icon helper
  const renderCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'user':
        return <User className="w-4 h-4 text-gray-700" />;
      case 'female':
        return <span className="text-sm font-bold text-gray-700">♀</span>;
      case 'watch':
        return <span className="text-sm">⌚</span>;
      case 'activity':
        return <Activity className="w-4 h-4 text-gray-700" />;
      case 'crown':
        return <Crown className="w-4 h-4 text-watch-gold" />;
      case 'glass':
        return <span className="text-sm">🍸</span>;
      case 'droplet':
        return <Droplet className="w-4 h-4 text-blue-600" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'users':
        return <Smile className="w-4 h-4 text-amber-600" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 text-gray-700" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-gray-700" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-amber-700" />;
      default:
        return <Clock className="w-4 h-4 text-gray-700" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-poppins flex flex-col selection:bg-watch-gold selection:text-black">
      {/* 1. WatchHub Standard Luxury Navbar */}
      <CustomerNavbar />

      {/* 2. Hero Section matching Target Reference Mockup exactly */}
      <section className="bg-gradient-to-b from-[#070C14] via-[#0B121C] to-[#0D1623] text-white pt-6 pb-12 px-4 sm:px-8 border-b border-white/10 relative overflow-hidden">
        {/* Subtle luxury golden dial background blur */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-watch-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block opacity-25 pointer-events-none">
          <div className="w-64 h-64 rounded-full border-2 border-watch-gold/40 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-watch-gold/30 flex items-center justify-center">
              <span className="text-6xl text-watch-gold/60 font-serif">⌚</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-watch-gold transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-watch-gold font-medium">Categories</span>
          </nav>

          {/* Headline & Gold Underline Bar */}
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight mb-2">
              Explore All{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5B04E] via-[#F2D082] to-[#C9A15B]">
                Categories
              </span>
            </h1>
            <div className="w-16 h-1 bg-[#D9A441] rounded-full mb-3"></div>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Find the perfect watch for every style, need and occasion.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Controls & Filter Bar matching Target Reference Mockup exactly */}
      <section className="bg-[#0B121C] border-b border-white/10 shadow-md sticky top-[68px] z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input Pill */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories (e.g. Smartwatch, Sports, Luxury...)"
              className="w-full h-10 pl-11 pr-4 text-xs sm:text-sm rounded-full bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-watch-gold/50 shadow-xs font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills with Working Interactive Filtering */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {/* Pill 1: All Categories (12) Button with Gold Border */}
            <button
              type="button"
              onClick={handleResetFilters}
              className={`h-10 px-4 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 border ${
                !isFiltering
                  ? 'border-[#D9A441] bg-[#16202E] text-watch-gold shadow-sm'
                  : 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-watch-gold" />
              <span>All Categories (12)</span>
            </button>

            {/* Pill 2: Gender Dropdown */}
            <div className="relative flex-shrink-0">
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className={`h-10 pl-3.5 pr-8 rounded-full text-xs font-semibold bg-white/5 border transition-all cursor-pointer appearance-none ${
                  selectedGender !== 'All'
                    ? 'border-[#D9A441] text-watch-gold font-bold bg-[#16202E]'
                    : 'border-white/10 text-gray-300 hover:border-white/25'
                }`}
              >
                <option value="All" className="bg-[#0B121C] text-white">👤 Gender (All)</option>
                {GENDER_FILTERS.filter((g) => g !== 'All').map((g) => (
                  <option key={g} value={g} className="bg-[#0B121C] text-white">
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Pill 3: Watch Type Dropdown */}
            <div className="relative flex-shrink-0">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`h-10 pl-3.5 pr-8 rounded-full text-xs font-semibold bg-white/5 border transition-all cursor-pointer appearance-none ${
                  selectedType !== 'All'
                    ? 'border-[#D9A441] text-watch-gold font-bold bg-[#16202E]'
                    : 'border-white/10 text-gray-300 hover:border-white/25'
                }`}
              >
                <option value="All" className="bg-[#0B121C] text-white">⬖ Watch Type (All)</option>
                {TYPE_FILTERS.filter((t) => t !== 'All').map((t) => (
                  <option key={t} value={t} className="bg-[#0B121C] text-white">
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Pill 4: Occasion Dropdown */}
            <div className="relative flex-shrink-0">
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className={`h-10 pl-3.5 pr-8 rounded-full text-xs font-semibold bg-white/5 border transition-all cursor-pointer appearance-none ${
                  selectedOccasion !== 'All'
                    ? 'border-[#D9A441] text-watch-gold font-bold bg-[#16202E]'
                    : 'border-white/10 text-gray-300 hover:border-white/25'
                }`}
              >
                <option value="All" className="bg-[#0B121C] text-white">📅 Occasion (All)</option>
                {OCCASION_FILTERS.filter((o) => o !== 'All').map((o) => (
                  <option key={o} value={o} className="bg-[#0B121C] text-white">
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Pill 5: Sort Dropdown */}
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`h-10 pl-3.5 pr-8 rounded-full text-xs font-semibold bg-white/5 border transition-all cursor-pointer appearance-none ${
                  sortBy !== 'popular'
                    ? 'border-[#D9A441] text-watch-gold font-bold bg-[#16202E]'
                    : 'border-white/10 text-gray-300 hover:border-white/25'
                }`}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0B121C] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear All Button */}
            {isFiltering && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-3.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. 12 Image-Based Category Cards Grid matching Target Reference Mockup exactly */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {filteredCategories.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-xs p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-watch-gold flex items-center justify-center text-2xl mx-auto mb-4 border border-watch-gold/30">
              🔍
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Categories Found</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              We couldn't find any category matching "{searchQuery}". Try clearing your filters to explore all 12 watch collections.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black font-extrabold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/90 shadow-sm">
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-gray-900">
                  {isFiltering ? 'Filtered Categories' : 'Featured Watch Categories'}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {filteredCategories.length} Categories Available
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                Click any category card to view full product collection
              </span>
            </div>

            {/* 6 columns grid on desktop (2 rows of 6 = 12 cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.link}
                  className="group bg-white border border-gray-200/90 hover:border-[#D9A441] rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer overflow-hidden"
                  title={`Browse ${cat.name} Collection (${cat.styles})`}
                >
                  {/* Top: 1:1 / 4:3 Aspect Ratio Product Photo */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-2.5">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = cat.fallbackImage;
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    />
                    {/* Subtle Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Bottom: Icon + Title + Count + Arrow */}
                  <div className="flex items-center justify-between gap-1.5 px-1 py-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Left Category Icon */}
                      <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-amber-50 group-hover:border group-hover:border-watch-gold/40 flex items-center justify-center flex-shrink-0 transition-colors">
                        {renderCategoryIcon(cat.icon)}
                      </div>

                      {/* Text info */}
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-gray-900 group-hover:text-black tracking-tight leading-tight truncate">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                          {cat.styles}
                        </p>
                      </div>
                    </div>

                    {/* Right Circular Arrow Button */}
                    <div className="w-6 h-6 rounded-full border border-gray-200 group-hover:border-watch-gold group-hover:bg-watch-gold group-hover:text-black flex items-center justify-center text-gray-400 transition-all flex-shrink-0 shadow-2xs">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 5. Standard WatchHub Footer */}
      <footer className="bg-[#070B12] text-gray-300 text-xs py-10 px-4 sm:px-8 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⌚</span>
              <h4 className="text-lg font-bold text-white font-serif">
                Watch<span className="text-watch-gold">Hub</span>
              </h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              India's premier destination for genuine luxury, sports and fashion wristwatches.
            </p>
            <div className="flex items-center gap-3 text-base">
              <span>📘</span> <span>📸</span> <span>🐦</span> <span>▶️</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3">Shop Categories</h5>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link to="/categories" className="text-watch-gold font-bold hover:underline">✨ All 12 Categories</Link></li>
              <li><Link to="/products?cat=men" className="hover:text-watch-gold">Men's Watches</Link></li>
              <li><Link to="/products?cat=women" className="hover:text-watch-gold">Women's Watches</Link></li>
              <li><Link to="/products?cat=smartwatches" className="hover:text-watch-gold">Smartwatches & Wearables</Link></li>
              <li><Link to="/products?cat=luxury" className="hover:text-watch-gold">Swiss Haute Horlogerie</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3">Customer Support</h5>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link to="/cart" className="hover:text-watch-gold">Track Your Order</Link></li>
              <li><Link to="/mobile-app" className="hover:text-watch-gold">Download Android APK</Link></li>
              <li><Link to="/brands" className="hover:text-watch-gold">Global Brands Directory (60)</Link></li>
              <li><Link to="/dashboard" className="text-watch-gold font-bold hover:underline">👑 Employee Staff Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3">VIP Newsletter</h5>
            <p className="text-[11px] text-gray-400 mb-2">Subscribe to receive seasonal category previews & discounts.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  triggerToast('Subscribed to VIP category notifications!');
                  setNewsletterEmail('');
                }
              }}
              className="flex gap-1.5"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-white/10 text-white text-xs px-3 py-2 rounded-lg outline-none border border-white/20 flex-1 placeholder:text-gray-500"
              />
              <button type="submit" className="btn-gold text-xs px-3 py-2 cursor-pointer font-bold">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-center text-gray-500 text-[11px]">
          © 2026 WatchHub – The World of Watches. All rights reserved.
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B121C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-watch-gold/40 flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-watch-gold animate-pulse flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
