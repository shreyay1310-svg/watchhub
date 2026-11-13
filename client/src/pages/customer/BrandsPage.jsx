import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ExternalLink,
  RotateCcw,
  Globe,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Crown,
} from 'lucide-react';
import { CustomerNavbar } from '../../components/common/Header';
import BrandLogo from '../../components/common/BrandLogo';
import { GLOBAL_BRANDS_60, REGIONAL_SECTIONS } from '../../data/brandsData';

export const BrandsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('All');
    setSelectedCategory('All');
    setSelectedLetter('All');
    setSortBy('name-asc');
  };

  // Distinct countries and categories for filters
  const countries = useMemo(() => {
    const list = Array.from(new Set(GLOBAL_BRANDS_60.map((b) => b.country)));
    return ['All', ...list.sort()];
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set(GLOBAL_BRANDS_60.map((b) => b.category)));
    return ['All', ...list.sort()];
  }, []);

  const alphabet = useMemo(() => {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }, []);

  // Filtered & sorted brands
  const filteredBrands = useMemo(() => {
    return GLOBAL_BRANDS_60.filter((brand) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = brand.name.toLowerCase().includes(q);
        const matchesCountry = brand.country.toLowerCase().includes(q);
        const matchesCategory = brand.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesCategory) return false;
      }

      // Country filter
      if (selectedCountry !== 'All' && brand.country !== selectedCountry) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && brand.category !== selectedCategory) {
        return false;
      }

      // Alphabet filter
      if (selectedLetter !== 'All' && !brand.name.toUpperCase().startsWith(selectedLetter)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'country') return a.country.localeCompare(b.country);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  }, [searchQuery, selectedCountry, selectedCategory, selectedLetter, sortBy]);

  const isFiltering =
    searchQuery.trim() !== '' ||
    selectedCountry !== 'All' ||
    selectedCategory !== 'All' ||
    selectedLetter !== 'All' ||
    sortBy !== 'name-asc';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-poppins flex flex-col selection:bg-watch-gold selection:text-black">
      {/* 1. Header Navigation */}
      <CustomerNavbar />

      {/* 2. Breadcrumbs & Hero Header */}
      <section className="bg-gradient-to-b from-[#070C14] via-[#0B121C] to-[#0D1623] text-white pt-6 pb-12 px-4 sm:px-8 border-b border-white/10 relative overflow-hidden">
        {/* Subtle Luxury Dial Glow Background */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-watch-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-watch-gold transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-watch-gold font-medium">Brands</span>
          </nav>

          {/* Hero Titles */}
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight mb-3">
              Explore the World's Finest{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5B04E] via-[#F2D082] to-[#C9A15B]">
                Watch Brands
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light mb-6">
              Discover 60 iconic watchmakers from around the world, all in one destination.
            </p>

            {/* 4 Luxury Stat Pills matching reference mockup */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-200 transition-colors">
                <span className="text-sm">👑</span>
                <span className="font-semibold text-white">60 Global Brands</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-200 transition-colors">
                <span className="text-sm">🌐</span>
                <span className="font-semibold text-white">6 Regions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-200 transition-colors">
                <span className="text-sm">🛡️</span>
                <span className="font-semibold text-white">Official Websites</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-200 transition-colors">
                <span className="text-sm">✔️</span>
                <span className="font-semibold text-white">Trusted & Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search, Filters & A-Z Quick Bar */}
      <section className="bg-white border-b border-gray-200 shadow-xs sticky top-[68px] z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Top Row: Search Input + Select Dropdowns + Clear All */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands (e.g. Rolex, Casio, Seiko...)"
                className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-watch-gold/40 focus:border-watch-gold transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {/* Country Filter */}
              <div className="relative flex-shrink-0">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="h-10 pl-3 pr-8 text-xs font-semibold rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-watch-gold/30 cursor-pointer appearance-none"
                >
                  <option value="All">🌐 All Countries</option>
                  {countries.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative flex-shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 pl-3 pr-8 text-xs font-semibold rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-watch-gold/30 cursor-pointer appearance-none"
                >
                  <option value="All">🏷️ All Categories</option>
                  {categories.filter((cat) => cat !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 pl-3 pr-8 text-xs font-semibold rounded-full bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-watch-gold/30 cursor-pointer appearance-none"
                >
                  <option value="name-asc">🔤 A-Z (All)</option>
                  <option value="name-desc">🔤 Z-A</option>
                  <option value="country">🌍 By Country</option>
                  <option value="category">⭐ By Category</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>

              {/* Clear All Button */}
              {isFiltering && (
                <button
                  onClick={handleClearFilters}
                  className="h-10 px-3.5 text-xs font-semibold rounded-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Alphabet Filter Bar + Total Counter */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-100 overflow-x-auto">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              <button
                onClick={() => setSelectedLetter('All')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                  selectedLetter === 'All'
                    ? 'bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              {alphabet.map((letter) => {
                const hasBrands = GLOBAL_BRANDS_60.some((b) =>
                  b.name.toUpperCase().startsWith(letter)
                );
                return (
                  <button
                    key={letter}
                    onClick={() => hasBrands && setSelectedLetter(letter)}
                    disabled={!hasBrands}
                    className={`w-7 h-7 rounded-full text-xs font-semibold transition-all flex items-center justify-center flex-shrink-0 ${
                      selectedLetter === letter
                        ? 'bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black font-extrabold shadow-xs'
                        : hasBrands
                        ? 'text-gray-700 hover:bg-gray-200 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Total Brands Pill */}
            <div className="flex-shrink-0 bg-[#0B121C] text-white px-3.5 py-1 rounded-full text-xs font-bold border border-watch-gold/30 shadow-xs flex items-center gap-1.5">
              <span>Total Brands:</span>
              <span className="text-watch-gold">{filteredBrands.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Cards Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {filteredBrands.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-xs p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-watch-gold flex items-center justify-center text-2xl mx-auto mb-4 border border-watch-gold/30">
              🔍
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Brands Found</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              We couldn't find any brand matching "{searchQuery || selectedLetter}". Try clearing your
              filters or searching for another watchmaker.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black font-extrabold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : isFiltering ? (
          /* Filtered View: Single Grid of Results */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Matching Brands</span>
                <span className="text-xs font-normal text-gray-500">
                  ({filteredBrands.length} brands found)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredBrands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} onVisit={triggerToast} />
              ))}
            </div>
          </div>
        ) : (
          /* Default Structured Catalog: 6 Categorized Regional Sections matching Reference Mockup */
          <div className="space-y-8">
            {/* 1. Swiss Luxury Watches (25 Brands) */}
            <SectionBlock
              section={REGIONAL_SECTIONS[0]}
              brands={GLOBAL_BRANDS_60.filter((b) => b.section === 'swiss')}
              onVisit={triggerToast}
              columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            />

            {/* 2 & 3. Japanese Collection & American & Fashion Watches */}
            <div className="space-y-8">
              <SectionBlock
                section={REGIONAL_SECTIONS[1]}
                brands={GLOBAL_BRANDS_60.filter((b) => b.section === 'japanese')}
                onVisit={triggerToast}
                columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              />

              <SectionBlock
                section={REGIONAL_SECTIONS[2]}
                brands={GLOBAL_BRANDS_60.filter((b) => b.section === 'american')}
                onVisit={triggerToast}
                columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              />
            </div>

            {/* 4. Smartwatch & Sports Brands (8 Brands) */}
            <SectionBlock
              section={REGIONAL_SECTIONS[3]}
              brands={GLOBAL_BRANDS_60.filter((b) => b.section === 'smartwatch')}
              onVisit={triggerToast}
              columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            />

            {/* 5. European Watchmakers (7 Brands) */}
            <SectionBlock
              section={REGIONAL_SECTIONS[4]}
              brands={GLOBAL_BRANDS_60.filter((b) => b.section === 'european')}
              onVisit={triggerToast}
              columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            />

            {/* 6. Indian Watch Brands (5 Brands) */}
            <SectionBlock
              section={REGIONAL_SECTIONS[5]}
              brands={GLOBAL_BRANDS_60.filter((b) => b.section === 'indian')}
              onVisit={triggerToast}
              columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            />
          </div>
        )}
      </main>

      {/* 5. Footer */}
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
            <h5 className="font-bold text-white mb-3">Quick Navigation</h5>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link to="/brands" className="text-watch-gold font-bold hover:underline">👑 Global Watch Brands (60)</Link></li>
              <li><Link to="/products" className="hover:text-watch-gold">All Watches</Link></li>
              <li><Link to="/products?cat=luxury" className="hover:text-watch-gold">Swiss Haute Horlogerie</Link></li>
              <li><Link to="/products?cat=men" className="hover:text-watch-gold">Men's Watches</Link></li>
              <li><Link to="/manufacturing-hub" className="text-watch-gold font-bold hover:underline">🏭 Manufacturing Hub</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3">Customer Support</h5>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link to="/cart" className="hover:text-watch-gold">Track Your Order</Link></li>
              <li><Link to="/mobile-app" className="hover:text-watch-gold">Download Android APK</Link></li>
              <li><Link to="/dashboard" className="text-watch-gold font-bold hover:underline">👑 Employee Staff Portal</Link></li>
              <li><Link to="/login" className="hover:text-watch-gold">Account Login</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3">VIP Newsletter</h5>
            <p className="text-[11px] text-gray-400 mb-2">Subscribe to receive exclusive drops & brand catalogs.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  triggerToast('Thank you for subscribing to VIP brand updates!');
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

/**
 * Section block representing one regional group (Swiss, Japanese, American, etc.)
 */
const SectionBlock = ({ section, brands, onVisit, columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' }) => {
  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="text-lg sm:text-xl">{section.flag}</span>
          <h2 className="text-base sm:text-lg font-bold font-serif text-gray-900 tracking-tight">
            {section.title}
          </h2>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
            {brands.length} Brands
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-400 hidden sm:inline">
          Official Manufacturer Portals
        </span>
      </div>

      {/* Grid of Brand Cards */}
      <div className={`grid ${columns} gap-3.5`}>
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} onVisit={onVisit} />
        ))}
      </div>
    </section>
  );
};

/**
 * Individual Brand Card matching reference mockup exactly:
 * - Clean white card
 * - Centered high-resolution logo
 * - Bold brand name
 * - Flag + country badge
 * - External link icon with tooltip
 * - Hover golden border & lift
 * - Click opens official website in new tab
 */
const BrandCard = ({ brand, onVisit }) => {
  return (
    <a
      href={brand.website}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onVisit && onVisit(`Opening official website for ${brand.name}...`)}
      title={`Visit Official ${brand.name} Website (${brand.website})`}
      className="group relative bg-white border border-gray-200/80 hover:border-watch-gold rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer select-none overflow-hidden"
    >
      {/* Corner External Link Icon */}
      <div className="absolute top-2.5 right-2.5 text-gray-300 group-hover:text-watch-gold transition-colors">
        <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
      </div>

      {/* Centered Brand Logo */}
      <div className="w-full h-14 flex items-center justify-center mb-2 px-1">
        <BrandLogo logoType={brand.logoType} brandName={brand.name} />
      </div>

      {/* Brand Name */}
      <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 group-hover:text-black tracking-tight leading-snug line-clamp-1 mb-1">
        {brand.name}
      </h3>

      {/* Country Badge */}
      <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500">
        <span className="text-xs">{brand.flag}</span>
        <span className="font-medium">{brand.country}</span>
      </div>
    </a>
  );
};

export default BrandsPage;
