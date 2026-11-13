import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Package,
  User,
  ChevronDown,
  ChevronRight,
  LogOut,
  Camera,
  Headphones,
  Phone,
  Tag,
  Home,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Upload,
  X,
  Scan,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MEGA_MENU_CONFIG } from '../../data/megaMenuData';

export const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedWatch, setDetectedWatch] = useState(null);
  const menuTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const navTabs = [
    { id: 'brands', label: 'Brands' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'kids', label: 'Kids' },
    { id: 'smartwatches', label: 'Smartwatches' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'sports', label: 'Sports' },
    { id: 'collections', label: 'Collections' },
  ];

  const handleMenuEnter = (id) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setActiveMegaMenu(id);
  };

  const handleMenuLeave = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const handleMenuToggle = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMegaMenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.mega-menu-trigger') && !e.target.closest('.mega-menu-dropdown-panel')) {
        setActiveMegaMenu(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        setProfileOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
      if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSampleScan = (watchName, scanQuery) => {
    setIsScanning(true);
    setDetectedWatch(null);
    setTimeout(() => {
      setIsScanning(false);
      setDetectedWatch({ name: watchName, query: scanQuery });
    }, 900);
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Shreya';
  const isGoogleUser = user?.provider === 'Google OAuth 2.0' || user?.isGoogleUser || user?.provider === 'Google';
  const currentMenu = activeMegaMenu ? MEGA_MENU_CONFIG[activeMegaMenu] : null;

  return (
    <header className="sticky top-0 z-50 shadow-md font-poppins select-none">
      {/* ════════════════════════════════════════════════════════════════
          1. TOP UTILITY BAR (Exact Match to Reference UI)
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#070B12] text-gray-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/5 hidden md:flex justify-between items-center">
        {/* Left Information */}
        <div className="flex items-center gap-4 text-gray-300 font-medium">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <ShieldCheck className="w-3.5 h-3.5 text-watch-gold" /> 100% Authentic
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Truck className="w-3.5 h-3.5 text-watch-gold" /> Free Shipping Above ₹999
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-watch-gold" /> 7-Day Easy Returns
          </span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Headphones className="w-3.5 h-3.5 text-watch-gold" /> 24x7 Support
          </span>
        </div>

        {/* Right Contacts */}
        <div className="flex items-center gap-4 text-gray-300 font-medium">
          <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-watch-gold" /> +91 98765 43210
          </a>
          <span className="text-gray-600">|</span>
          <a href="mailto:support@watchhub.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="text-watch-gold">✉</span> support@watchhub.com
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. MAIN LUXURY NAVBAR (Midnight Navy + Crisp White Search)
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0B121C] border-b border-white/10 px-4 sm:px-8 h-[68px] flex items-center justify-between gap-4 sm:gap-8">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden p-1 text-gray-300 hover:text-watch-gold transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-full border border-watch-gold/40 flex items-center justify-center text-xl text-watch-gold shadow-sm bg-black/30 group-hover:border-watch-gold transition-colors">
              ⌚
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-white tracking-tight leading-none">
                Watch<span className="text-watch-gold">Hub</span>
              </h1>
              <p className="text-[8.5px] font-bold tracking-[0.22em] text-watch-gold uppercase mt-0.5">
                THE WORLD OF WATCHES
              </p>
            </div>
          </Link>
        </div>

        {/* Center Pill Search Bar with Camera Icon */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for brands, watches, categories..."
            className="w-full h-11 pl-11 pr-11 text-xs rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-watch-gold/40 shadow-xs transition-all font-medium"
          />
          <button
            type="button"
            onClick={() => setShowVisualSearch(true)}
            title="Visual Watch Search / Scan"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-watch-gold transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions: Wishlist, Cart & Profile Dropdown */}
        <div className="flex items-center gap-4 sm:gap-6 text-white text-xs font-semibold">
          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 hover:text-watch-gold transition-colors py-1 cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Track Parcel Button (Exact Match to Mockup) */}
          <Link
            to="/track-parcel"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-watch-gold/40 bg-white/5 hover:bg-white/10 hover:border-watch-gold text-white text-xs font-semibold transition-all cursor-pointer shadow-xs group"
          >
            <Package className="w-4 h-4 text-watch-gold group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Track Parcel</span>
          </Link>

          {/* Cart Link with Gold Badge */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 hover:text-watch-gold transition-colors py-1 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-watch-gold to-amber-500 text-black text-[9.5px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 0 ? cartCount : 2}
              </span>
            </div>
            <span className="ml-1 hidden sm:inline">Cart</span>
          </Link>

          {/* User Profile or Sign In Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-[#D9A441]/40 rounded-full py-1.5 px-3 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs"
              >
                {isGoogleUser ? (
                  <span className="w-3.5 h-3.5 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </span>
                ) : (
                  <User className="w-3.5 h-3.5 text-watch-gold" />
                )}
                <span>Hi, {displayName}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0E1724] text-white rounded-xl shadow-2xl border border-white/10 py-1.5 z-50 text-xs animate-scale-up">
                  <div className="px-3.5 py-2 border-b border-white/10">
                    <p className="font-bold text-white flex items-center justify-between">
                      <span className="truncate">{user.name}</span>
                      {isGoogleUser && (
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-mono">
                          Google
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="inline-block bg-watch-gold/20 text-watch-gold border border-watch-gold/30 text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                        {user.role}
                      </span>
                      {isGoogleUser && (
                        <span className="inline-flex items-center gap-1 bg-[#4285F4]/20 text-[#8AB4F8] border border-[#4285F4]/30 text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Linked
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/cart"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3.5 py-2 hover:bg-white/5 text-gray-300 hover:text-white"
                  >
                    📦 My Orders & Tracking
                  </Link>
                  <Link
                    to="/mobile-app"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3.5 py-2 hover:bg-white/5 text-gray-300 hover:text-white"
                  >
                    📱 Download Android App
                  </Link>
                  <Link
                    to="/manufacturing-hub"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3.5 py-2 hover:bg-white/5 text-watch-gold font-semibold"
                  >
                    🏭 Manufacturing Hub
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3.5 py-2 hover:bg-white/5 text-watch-gold font-semibold"
                  >
                    👑 Staff Portal
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-500/10 text-red-400 flex items-center gap-1.5 border-t border-white/10 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#D9A441] to-[#B98332] hover:from-[#E5B04E] hover:to-[#C6903E] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-sm transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 fill-black" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. SECONDARY CATEGORY & MEGA MENU BAR
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#070C14] border-b border-white/5 px-4 sm:px-8 py-2 relative z-40 overflow-visible">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 text-xs relative">
          {/* Home Solid Golden Pill Button */}
          <Link
            to="/"
            className="bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black font-extrabold text-xs px-3.5 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all flex-shrink-0"
          >
            <Home className="w-3.5 h-3.5 fill-black" />
            <span>Home</span>
          </Link>

          {/* Nav Categories with Interactive Mega Menu Carets */}
          <nav className="flex items-center gap-1 sm:gap-2 lg:gap-3 text-gray-300 font-medium whitespace-nowrap overflow-x-auto sm:overflow-visible scrollbar-none py-0.5">
            {navTabs.map((tab) => {
              const isActive = activeMegaMenu === tab.id;
              return (
                <React.Fragment key={tab.id}>
                  <div
                    className="relative mega-menu-trigger"
                    onMouseEnter={() => handleMenuEnter(tab.id)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleMenuToggle(tab.id, e)}
                      className={`flex items-center gap-1 py-1 cursor-pointer transition-all text-xs font-semibold ${
                        isActive
                          ? 'border border-[#D4A84F] text-[#D4A84F] bg-[#D4A84F]/10 rounded-lg px-2.5 shadow-xs'
                          : 'border border-transparent text-gray-300 hover:text-watch-gold px-2 sm:px-2.5'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                          isActive ? 'rotate-180 text-watch-gold' : 'group-hover:text-watch-gold'
                        }`}
                      />
                    </button>
                  </div>

                  {/* ── Positioned after Sports and before Collections ── */}
                  {tab.id === 'sports' && (
                    <Link
                      to="/customize-watch"
                      className="border border-[#D4A84F] text-[#D4A84F] bg-[#D4A84F]/10 hover:bg-[#D4A84F]/25 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-all shadow-xs text-xs whitespace-nowrap group/custom"
                    >
                      <span className="text-[9px] bg-watch-gold text-black font-extrabold px-1.5 py-0.2 rounded-full uppercase leading-tight">
                        NEW
                      </span>
                      <span>Customize Your Watch</span>
                      <span className="text-sm group-hover/custom:rotate-12 transition-transform">✏️</span>
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Deals & Offers Solid Gold Button */}
          <Link
            to="/products?tag=deals"
            className="bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black font-extrabold text-xs px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all flex-shrink-0 ml-auto"
          >
            <Tag className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">Deals & Offers</span>
            <span className="sm:hidden">Deals</span>
          </Link>

          {/* ══════════════════════════════════════════════════════════════
              FULL-WIDTH MEGA MENU DROPDOWN PANEL (Exact Match to Mockup)
              ══════════════════════════════════════════════════════════════ */}
          {currentMenu && (
            <div
              onMouseEnter={() => {
                if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
              }}
              onMouseLeave={handleMenuLeave}
              className="mega-menu-dropdown-panel absolute left-1/2 -translate-x-1/2 top-full w-[96vw] max-w-7xl pt-2 z-50 animate-fade-in"
            >
              <div className="bg-[#09111E]/95 backdrop-blur-2xl border border-watch-gold/40 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-5 text-gray-200">
                <div className="flex flex-col lg:flex-row gap-5 items-stretch">
                  {/* Left Column: Featured Showcase Card */}
                  <div className="w-full lg:w-56 xl:w-60 flex-shrink-0 bg-gradient-to-br from-[#101D30] via-[#0A1320] to-[#050B13] border border-watch-gold/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        {currentMenu.featured.title}{' '}
                        <span className="text-watch-gold block">{currentMenu.featured.highlight}</span>
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                        {currentMenu.featured.subtitle}
                      </p>
                    </div>

                    <div className="my-3 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-watch-gold/10 blur-xl rounded-full scale-75 group-hover:scale-95 transition-transform" />
                      <img
                        src={currentMenu.featured.image}
                        alt={currentMenu.featured.title}
                        className="w-36 h-36 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300 relative z-10"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/products/featured_rolex_daytona.jpg';
                        }}
                      />
                    </div>

                    <Link
                      to={currentMenu.featured.link}
                      onClick={() => setActiveMegaMenu(null)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-watch-gold hover:text-white transition-colors"
                    >
                      <span>{currentMenu.featured.ctaText || 'Explore Now'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Right Columns: 5 Structured Category Columns */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 pl-0 lg:pl-5 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0">
                    {currentMenu.columns.map((col, colIdx) => (
                      <div key={colIdx} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-watch-gold font-bold text-xs pb-1.5 border-b border-white/10">
                          <span className="text-sm">{col.icon}</span>
                          <span className="truncate">{col.title}</span>
                        </div>
                        <ul className="space-y-1">
                          {col.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link
                                to={item.link}
                                onClick={() => setActiveMegaMenu(null)}
                                className="group flex items-center justify-between text-[11px] text-gray-300 hover:text-white hover:bg-white/5 py-1 px-1.5 rounded-md transition-colors"
                              >
                                <span className="flex items-center gap-1.5 truncate">
                                  {item.badge && (
                                    <span className="text-[10px] text-amber-400 font-bold flex-shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                  <span className="group-hover:text-amber-300 transition-colors truncate">
                                    {item.label}
                                  </span>
                                </span>
                                <ChevronRight className="w-3 h-3 text-gray-500 opacity-60 group-hover:opacity-100 group-hover:text-watch-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Strip: Badges & Solid Gold CTA Button */}
                <div className="border-t border-white/10 mt-5 pt-3.5 flex flex-wrap items-center justify-between gap-3">
                  {/* Left Badges */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs">
                    {currentMenu.bottomBadges?.map((badge, bIdx) => (
                      <Link
                        key={bIdx}
                        to={badge.link}
                        onClick={() => setActiveMegaMenu(null)}
                        className="flex items-center gap-1.5 text-gray-300 hover:text-watch-gold transition-colors text-xs"
                      >
                        <span className="text-amber-400">{badge.label.split(' ')[0]}</span>
                        <span className="font-medium text-[11px]">
                          {badge.label.substring(badge.label.indexOf(' ') + 1)}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Right CTA Button */}
                  <Link
                    to={currentMenu.bottomCta?.link || '/products'}
                    onClick={() => setActiveMegaMenu(null)}
                    className="bg-gradient-to-r from-[#F4B333] to-[#D99A1E] text-black font-extrabold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all ml-auto"
                  >
                    <span>{currentMenu.bottomCta?.text || 'Explore All Timepieces →'}</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          4. MOBILE SLIDE-OVER NAVIGATION DRAWER
          ════════════════════════════════════════════════════════════════ */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex font-poppins md:hidden animate-fade-in">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#09111E] text-white h-full overflow-y-auto p-5 z-50 border-r border-watch-gold/30 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-watch-gold/40 flex items-center justify-center text-watch-gold bg-black/30">
                    ⌚
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-serif text-white">WatchHub</h2>
                    <p className="text-[8px] text-watch-gold tracking-widest font-sans uppercase">Categories & Brands</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={(e) => { handleSearch(e); setMobileDrawerOpen(false); }} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 1,200+ watches..."
                  className="w-full h-10 pl-9 pr-3 text-xs rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-watch-gold"
                />
              </form>

              {/* Accordion Categories */}
              <div className="space-y-1 text-xs">
                {navTabs.map((tab) => {
                  const isExpanded = mobileAccordion === tab.id;
                  const menuObj = MEGA_MENU_CONFIG[tab.id];
                  return (
                    <div key={tab.id} className="border-b border-white/5 py-1">
                      <button
                        type="button"
                        onClick={() => setMobileAccordion(isExpanded ? null : tab.id)}
                        className="w-full flex items-center justify-between py-2 text-left text-gray-200 hover:text-watch-gold font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-watch-gold">
                            {tab.id === 'brands' ? '👑' : tab.id === 'smartwatches' ? '📱' : tab.id === 'luxury' ? '💎' : '⌚'}
                          </span>
                          <span>{tab.label}</span>
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180 text-watch-gold' : ''}`} />
                      </button>

                      {isExpanded && menuObj && (
                        <div className="pl-4 pr-1 py-2 space-y-3 bg-white/5 rounded-xl mt-1 text-[11px] animate-fade-in">
                          {menuObj.columns.map((col, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-watch-gold font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <span>{col.icon}</span> {col.title}
                              </p>
                              <div className="grid grid-cols-2 gap-1 pl-1">
                                {col.items.slice(0, 4).map((it, iIdx) => (
                                  <Link
                                    key={iIdx}
                                    to={it.link}
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className="text-gray-300 hover:text-white py-0.5 truncate"
                                  >
                                    • {it.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}

                          <Link
                            to={menuObj.bottomCta?.link || '/products'}
                            onClick={() => setMobileDrawerOpen(false)}
                            className="block w-full py-2 text-center bg-watch-gold text-black font-extrabold rounded-lg mt-2 text-xs"
                          >
                            {menuObj.bottomCta?.text || 'Explore All →'}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct Quick Links */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
                <Link
                  to="/customize-watch"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-watch-gold/15 border border-watch-gold/40 text-watch-gold font-bold shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <span>✏️</span>
                    <span>Customize Your Watch</span>
                  </span>
                  <span className="text-[9px] bg-watch-gold text-black font-extrabold px-1.5 py-0.5 rounded-full uppercase">NEW</span>
                </Link>
                <Link
                  to="/track-parcel"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-watch-gold text-white font-semibold shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-watch-gold" />
                    <span>Track Your Parcel</span>
                  </span>
                  <span className="text-[10px] font-bold text-watch-gold">Live GPS →</span>
                </Link>
                <Link
                  to="/brands"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-1.5 text-watch-gold font-semibold"
                >
                  <span>👑 Global 60+ Brands Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/categories"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-1.5 text-gray-300 hover:text-white"
                >
                  <span>✨ All 12 Watch Categories</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/manufacturing-hub"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-1.5 text-gray-300 hover:text-white"
                >
                  <span>🏭 3D Manufacturing Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/mobile-app"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-1.5 text-gray-300 hover:text-white"
                >
                  <span>📱 Download Android App</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Drawer Bottom */}
            <div className="pt-4 border-t border-white/10 text-center text-[10px] text-gray-500">
              <p>© 2026 WatchHub – The World of Watches</p>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          5. VISUAL WATCH SEARCH (CAMERA SCANNER MODAL)
          ════════════════════════════════════════════════════════════════ */}
      {showVisualSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in font-poppins text-gray-800">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative animate-scale-up">
            <button
              onClick={() => {
                setShowVisualSearch(false);
                setDetectedWatch(null);
                setIsScanning(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-xl bg-watch-gold/20 flex items-center justify-center text-watch-gold-dark font-bold text-sm">
                📷
              </span>
              <h3 className="text-lg font-bold text-gray-900">AI Visual Watch Recognition</h3>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              Upload a watch photo or click a sample to find matching timepieces instantly.
            </p>

            {/* Scanner Box */}
            <div className="border-2 border-dashed border-gray-200 hover:border-watch-gold rounded-2xl p-6 text-center bg-gray-50/50 mb-5 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-800">Drop a watch photo here, or browse files</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Supports JPG, PNG & WEBP formats up to 10MB</p>
            </div>

            {/* Quick Sample Detections */}
            <div className="space-y-2 mb-5">
              <p className="text-xs font-bold text-gray-700">Or try 1-click sample watch scans:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSampleScan('Rolex Submariner Oystersteel', 'Rolex Submariner')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5 text-watch-gold" />
                  <span className="font-semibold text-gray-800 truncate">Rolex Submariner</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleScan('Omega Speedmaster Moonwatch', 'Omega Speedmaster')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5 text-watch-gold" />
                  <span className="font-semibold text-gray-800 truncate">Omega Moonwatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleScan('AMOLED Ultra Smartwatch', 'Smartwatches')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5 text-watch-gold" />
                  <span className="font-semibold text-gray-800 truncate">AMOLED Smartwatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleScan('Patek Philippe Nautilus Selfwinding', 'Patek Philippe')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5 text-watch-gold" />
                  <span className="font-semibold text-gray-800 truncate">Patek Nautilus</span>
                </button>
              </div>
            </div>

            {/* Scanning Indicator / Result */}
            {isScanning && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-center gap-2 animate-pulse">
                <Scan className="w-4 h-4 animate-spin text-watch-gold" />
                <span>AI analyzing dial geometry, bezel markers & movement...</span>
              </div>
            )}

            {detectedWatch && (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-900 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Detected: {detectedWatch.name} (98.4% Confidence Match)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowVisualSearch(false);
                    navigate(`/products?q=${encodeURIComponent(detectedWatch.query)}`);
                  }}
                  className="w-full bg-gradient-to-r from-watch-gold to-amber-500 text-black font-extrabold py-2 px-3 rounded-lg shadow-sm hover:opacity-95 transition-all text-xs cursor-pointer"
                >
                  View Matching Watches in Vault →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomerNavbar;
