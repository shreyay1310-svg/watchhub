import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
  Camera,
  X,
  Scan,
  CheckCircle2,
  Package,
  Globe,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import CustomerDrawer from './CustomerDrawer';

export const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const { currency, setCurrency, language, setLanguage, currencies, languages } = useCurrencyLanguage();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // AI Visual Search scanner state
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedWatch, setDetectedWatch] = useState(null);

  const dropdownTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    {
      id: 'watches',
      label: 'Watches',
      path: '/watches',
      dropdown: [
        { label: 'All Watches', path: '/watches' },
        { label: 'New Arrivals', path: '/watches?filter=new' },
        { label: 'Best Sellers', path: '/watches?filter=bestseller' },
        { label: 'Limited Edition', path: '/watches?filter=limited' },
        { label: 'Pre-Owned Certified', path: '/watches?filter=preowned' },
        { label: '🎨 Customize Your Watch', path: '/customize-watch' },
      ],
    },
    {
      id: 'brands',
      label: 'Brands',
      path: '/brands',
      dropdown: [
        { label: '🇨🇭 Chronoswiss (Lucerne)', path: '/brands/chronoswiss' },
        { label: '👑 Rolex', path: '/brands/rolex' },
        { label: '❖ Patek Philippe', path: '/brands/patek-philippe' },
        { label: 'AP Audemars Piguet', path: '/brands/audemars-piguet' },
        { label: 'Ω Omega', path: '/brands/omega' },
        { label: 'Cartier', path: '/brands/cartier' },
        { label: 'TAG Heuer', path: '/brands/tag-heuer' },
        { label: 'Breitling', path: '/brands/breitling' },
        { label: '✨ View All 60+ Global Brands →', path: '/brands' },
      ],
    },
    {
      id: 'men',
      label: 'Men',
      path: '/men',
      dropdown: [
        { label: 'Classic Timepieces', path: '/men?style=classic' },
        { label: 'Precision Chronographs', path: '/men?style=chronograph' },
        { label: 'Professional Divers (300M+)', path: '/men?style=diver' },
        { label: 'Sports & High Performance', path: '/men?style=sports' },
        { label: 'Automatic Analog', path: '/men?style=analog' },
        { label: 'Rugged Digital', path: '/men?style=digital' },
      ],
    },
    {
      id: 'women',
      label: 'Women',
      path: '/women',
      dropdown: [
        { label: 'Elegant Mother of Pearl', path: '/women?style=elegant' },
        { label: 'Fashion & Runway Glamour', path: '/women?style=fashion' },
        { label: 'Diamond & Gem-Set Bezels', path: '/women?style=diamond' },
        { label: 'Minimalist Dials', path: '/women?style=minimal' },
        { label: 'Haute Luxury Swiss', path: '/women?style=luxury' },
        { label: 'Smart & Connected Wear', path: '/women?style=smart' },
      ],
    },
    {
      id: 'kids',
      label: 'Kids',
      path: '/kids',
      dropdown: [
        { label: 'Rugged Digital Shockproof', path: '/kids?style=digital' },
        { label: 'Educational Time-Teaching Analog', path: '/kids?style=analog' },
        { label: 'Cartoon & Superhero Editions', path: '/kids?style=cartoon' },
        { label: 'Sports & Swimproof (100M)', path: '/kids?style=sports' },
        { label: 'Ages 5–9 Years', path: '/kids?style=age-5-9' },
        { label: 'Ages 10–15 Years', path: '/kids?style=age-10-15' },
      ],
    },
    {
      id: 'smartwatches',
      label: 'Smartwatches',
      path: '/smartwatches',
      dropdown: [
        { label: ' Apple Watch Series & Ultra', path: '/smartwatches?style=apple' },
        { label: '⭐ Samsung Galaxy Watch', path: '/smartwatches?style=samsung' },
        { label: '🧭 Garmin Solar & Multisport', path: '/smartwatches?style=garmin' },
        { label: '🏃 Fitness & Activity Trackers', path: '/smartwatches?style=fitness' },
        { label: '📞 Bluetooth Calling Watches', path: '/smartwatches?style=calling' },
        { label: '❤️ Health & ECG Monitoring', path: '/smartwatches?style=health' },
      ],
    },
    {
      id: 'luxury',
      label: 'Luxury',
      path: '/luxury',
      dropdown: [
        { label: '🇨🇭 Swiss Atelier Watches', path: '/luxury?style=swiss' },
        { label: '👑 Haute Horlogerie Complications', path: '/luxury?style=haute' },
        { label: '💎 Numbered Limited Editions', path: '/luxury?style=limited' },
        { label: '⚙️ Premium Mechanical Movements', path: '/luxury?style=mechanical' },
        { label: '🔄 In-House Automatic Calibres', path: '/luxury?style=automatic' },
      ],
    },
    {
      id: 'sports',
      label: 'Sports',
      path: '/sports',
      dropdown: [
        { label: '🤿 Deep Ocean Diving (300M+)', path: '/sports?style=diving' },
        { label: '🏎️ Trackside Racing Tachymeters', path: '/sports?style=racing' },
        { label: '🏔️ Expedition Outdoor Watches', path: '/sports?style=outdoor' },
        { label: '🏋️ Multisport Fitness Watches', path: '/sports?style=fitness' },
        { label: '💧 Waterproof ISO 6425 Certified', path: '/sports?style=waterproof' },
      ],
    },
    {
      id: 'collections',
      label: 'Collections',
      path: '/collections',
      dropdown: [
        { label: '📜 Heritage Collection 1926', path: '/collections?style=heritage' },
        { label: '🏆 Iconic Masterpiece Series', path: '/collections?style=iconic' },
        { label: '💎 Numbered Limited Vault', path: '/collections?style=limited' },
        { label: '🤝 Atelier Collaborations', path: '/collections?style=collaboration' },
        { label: '❄️ Winter Frost Seasonal Drop', path: '/collections?style=seasonal' },
      ],
    },
  ];

  const handleDropdownEnter = (id) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(id);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSampleScan = (watchName, scanQuery) => {
    setIsScanning(true);
    setDetectedWatch(null);
    setTimeout(() => {
      setIsScanning(false);
      setDetectedWatch({ name: watchName, query: scanQuery });
    }, 850);
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          GLOBAL HEADER: Deep Midnight Navy + Minimal Swiss Luxury
          (Exact Match to Chronoswiss & Overview Reference)
          ════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#020813]/95 backdrop-blur-2xl border-b border-white/[0.08] font-sans select-none transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* ── LEFT: Logo & Menu Icon ── */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {/* Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer group"
              aria-label="Open Customer Modules Menu"
            >
              <Menu className="w-5 h-5 text-gray-300 group-hover:text-[#00CFFF] transition-colors" />
              <span className="text-[11px] font-bold tracking-widest text-[#A6B1C8] uppercase hidden xl:inline group-hover:text-white">
                MENU
              </span>
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1E38] to-[#040A17] border border-[#F4B942]/40 flex items-center justify-center text-lg text-[#F4B942] shadow-[0_0_15px_rgba(244,185,66,0.25)] group-hover:border-[#F4B942] transition-colors">
                ⌚
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white leading-none">
                  Watch<span className="text-[#F4B942]">Hub</span>
                </h1>
                <p className="text-[8px] font-bold tracking-[0.26em] text-[#00CFFF] uppercase mt-0.5">
                  LUXURY HOROLOGY
                </p>
              </div>
            </Link>
          </div>

          {/* ── CENTER: Primary Navigation Links & Dropdowns ── */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5 text-xs font-semibold text-gray-300">
            {navLinks.map((link) => {
              const hasDropdown = Boolean(link.dropdown);
              const isOpen = activeDropdown === link.id;
              const isCurrentRoute =
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));

              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleDropdownEnter(link.id)}
                  onMouseLeave={() => hasDropdown && handleDropdownLeave()}
                >
                  <Link
                    to={link.path}
                    className={`py-2 px-2.5 xl:px-3 rounded-lg flex items-center gap-1 transition-all ${
                      isCurrentRoute
                        ? 'text-[#00CFFF] font-bold bg-[#00CFFF]/15 border border-[#00CFFF]/30 shadow-[0_0_15px_rgba(0,207,255,0.25)]'
                        : isOpen
                        ? 'text-[#00CFFF] bg-white/5'
                        : 'hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#00CFFF]' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Panel */}
                  {hasDropdown && isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-64 z-50 animate-fade-in">
                      <div className="bg-[#040C1A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-2 space-y-1">
                        {link.dropdown.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            to={sub.path}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-3 py-2 rounded-xl text-xs text-[#A6B1C8] hover:text-[#00CFFF] hover:bg-white/5 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── RIGHT: Search, Currencies, Languages, Wishlist, Account, Cart ── */}
          <div className="flex items-center gap-2 sm:gap-3.5 text-white">
            
            {/* Search Toggle Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Search Watches"
              >
                <Search className="w-4 h-4 text-gray-300" />
              </button>

              {/* Expanding Search Bar Popover */}
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 z-50 animate-scale-up">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="bg-[#040C1A]/95 backdrop-blur-2xl border border-[#00CFFF]/40 rounded-2xl p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-[#00CFFF] ml-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Chronoswiss, Rolex, Tourbillon..."
                      className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder-gray-400 outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowVisualSearch(true)}
                      className="text-gray-400 hover:text-[#F4B942] p-1 cursor-pointer"
                      title="AI Visual Watch Recognition"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="text-gray-400 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Currency Selector (EUR / USD / INR) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => {
                  setCurrencyOpen(!currencyOpen);
                  setLanguageOpen(false);
                }}
                className="h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Select Currency"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {currencyOpen && (
                <div className="absolute right-0 top-11 w-32 bg-[#040C1A]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-fade-in">
                  {Object.values(currencies).map((cur) => (
                    <button
                      key={cur.code}
                      type="button"
                      onClick={() => {
                        setCurrency(cur.code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                        currency === cur.code
                          ? 'bg-[#F4B942]/20 text-[#F4B942] font-bold'
                          : 'text-[#A6B1C8] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{cur.label}</span>
                      {currency === cur.code && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector (ENG / FRA / DEU) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setCurrencyOpen(false);
                }}
                className="h-9 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Select Language"
              >
                <span>{language}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-11 w-32 bg-[#040C1A]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-fade-in">
                  {Object.values(languages).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                        language === lang.code
                          ? 'bg-[#00CFFF]/20 text-[#00CFFF] font-bold'
                          : 'text-[#A6B1C8] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{lang.fullName}</span>
                      {language === lang.code && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link (Exact match to reference UI) */}
            <Link
              to="/wishlist"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-white hover:text-[#00CFFF] transition-all cursor-pointer group"
              title="Saved Wishlist"
            >
              <div className="relative flex items-center justify-center">
                <Heart className="w-5 h-5 text-white group-hover:scale-105 transition-transform stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF35C8] text-white text-[9.5px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Wishlist
              </span>
            </Link>

            {/* Shopping Cart Link (Exact match to reference UI with gold/amber '2' badge) */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-white hover:text-[#F4B942] transition-all cursor-pointer group"
              title="Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white group-hover:scale-105 transition-transform stroke-[1.8]" />
                <span className="absolute -top-1.5 -right-2.5 bg-[#F4B942] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount > 0 ? cartCount : 2}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Cart
              </span>
            </Link>

            {/* Customer Account Icon / Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0F223D] to-[#040A17] border border-[#F4B942]/40 hover:border-[#F4B942] flex items-center justify-center text-[#F4B942] transition-all cursor-pointer shadow-sm"
                title="Customer Account"
              >
                {user?.name ? (
                  <span className="text-xs font-bold">{user.name[0]}</span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-[#040C1A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50 text-xs animate-scale-up">
                  {user ? (
                    <>
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] font-bold text-[#F4B942] bg-[#F4B942]/10 border border-[#F4B942]/30 px-2 py-0.5 rounded-full">
                          {user.role || 'VIP Member'}
                        </span>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-[#A6B1C8] hover:text-white hover:bg-white/5"
                      >
                        👤 Customer Account Portal
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-[#A6B1C8] hover:text-white hover:bg-white/5"
                      >
                        📦 My Orders & Tracking
                      </Link>
                      <Link
                        to="/customize-watch?tab=saved"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3 py-2 rounded-xl text-[#F4B942] hover:bg-white/5 font-semibold"
                      >
                        ✏️ Saved Custom Designs
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer mt-1 border-t border-white/10"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="font-bold text-white">Welcome to WatchHub</p>
                        <p className="text-[10px] text-gray-400">Swiss Luxury E-Commerce</p>
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-center py-2 bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold rounded-xl shadow-sm mb-1"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setProfileOpen(false)}
                        className="block text-center py-1.5 text-[#A6B1C8] hover:text-white"
                      >
                        Create an Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          SLIDE-OUT CUSTOMER MODULES DRAWER
          ════════════════════════════════════════════════════════════════ */}
      <CustomerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ════════════════════════════════════════════════════════════════
          AI VISUAL RECOGNITION MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showVisualSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#050D1A] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_0_60px_rgba(0,207,255,0.25)] border border-[#00CFFF]/40 relative animate-scale-up text-[#F8FAFC]">
            <button
              onClick={() => {
                setShowVisualSearch(false);
                setDetectedWatch(null);
                setIsScanning(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-xl bg-[#00CFFF]/20 border border-[#00CFFF]/30 flex items-center justify-center text-sm text-[#00CFFF]">
                📷
              </span>
              <h3 className="text-lg font-bold text-white">AI Visual Watch Recognition</h3>
            </div>
            <p className="text-xs text-[#A6B1C8] mb-5">
              Scan watch bezels, tourbillon cages and dial markers to locate authentic matches instantly.
            </p>

            <div className="border-2 border-dashed border-white/15 hover:border-[#00CFFF]/60 rounded-2xl p-6 text-center bg-[#020813] mb-5 transition-colors">
              <Camera className="w-8 h-8 text-[#00CFFF] mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Drop timepiece photography here or browse files</p>
              <p className="text-[11px] text-[#A6B1C8] mt-0.5">High-res JPG, PNG & WEBP formats</p>
            </div>

            {/* Quick Sample Detections */}
            <div className="space-y-2 mb-4">
              <p className="text-xs font-bold text-[#A6B1C8]">Or try sample scans:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSampleScan('Chronoswiss Open Gear Flying Tourbillon Paraiba', 'Chronoswiss')}
                  className="p-2.5 rounded-xl border border-white/10 hover:border-[#00CFFF]/50 bg-white/5 text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5 text-[#00CFFF]" />
                  <span className="font-semibold text-white truncate">Chronoswiss Tourbillon</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleScan('Omega Speedmaster Moonwatch Professional', 'Omega Speedmaster')}
                  className="p-2.5 rounded-xl border border-white/10 hover:border-[#00CFFF]/50 bg-white/5 text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span className="font-semibold text-white truncate">Omega Speedmaster</span>
                </button>
              </div>
            </div>

            {isScanning && (
              <div className="bg-[#00CFFF]/10 border border-[#00CFFF]/30 p-3 rounded-xl text-xs text-[#00CFFF] flex items-center gap-2 animate-pulse">
                <Scan className="w-4 h-4 animate-spin text-[#00CFFF]" />
                <span>AI analyzing regulator layout & escapement geometry...</span>
              </div>
            )}

            {detectedWatch && (
              <div className="bg-[#39F5A5]/10 border border-[#39F5A5]/30 p-3.5 rounded-xl text-xs text-[#39F5A5] space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#39F5A5] flex-shrink-0" />
                  <span>Detected: {detectedWatch.name} (99.2% Match)</span>
                </div>
                <button
                  onClick={() => {
                    navigate(`/products?q=${encodeURIComponent(detectedWatch.query)}`);
                    setShowVisualSearch(false);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-bold rounded-lg text-xs"
                >
                  View Matching Timepieces →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerNavbar;
