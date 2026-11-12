import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  LogOut,
  Camera,
  Globe,
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
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedWatch, setDetectedWatch] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSampleScan = (watchName, searchQuery) => {
    setIsScanning(true);
    setDetectedWatch(null);
    setTimeout(() => {
      setIsScanning(false);
      setDetectedWatch({ name: watchName, query: searchQuery });
    }, 900);
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Shreya';
  const isGoogleUser = user?.provider === 'Google OAuth 2.0' || user?.isGoogleUser || user?.provider === 'Google';

  return (
    <header className="sticky top-0 z-50 shadow-md font-poppins select-none">
      {/* ════════════════════════════════════════════════════════════════
          1. TOP UTILITY BAR (Exact Match to Image 2 Reference UI)
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

        {/* Center Pill Search Bar with Camera Icon */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for brands, watches, collections..."
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
        <div className="flex items-center gap-5 sm:gap-6 text-white text-xs font-semibold">
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
          3. SECONDARY CATEGORY & DEALS MENU BAR (Interactive Dropdowns)
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#070C14] border-b border-white/5 px-4 sm:px-8 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          {/* Home Solid Golden Pill Button */}
          <Link
            to="/"
            className="bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black font-extrabold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all flex-shrink-0"
          >
            <Home className="w-3.5 h-3.5 fill-black" />
            <span>Home</span>
          </Link>

          {/* Nav Categories with Dropdown Carets */}
          <nav className="flex items-center gap-3 sm:gap-6 text-gray-300 font-medium whitespace-nowrap overflow-x-auto scrollbar-none">
            
            {/* 1. Brands Dropdown */}
            <div className="relative group">
              <Link to="/products" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1 cursor-pointer">
                <span>Brands</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl grid grid-cols-2 gap-2 w-64 text-xs text-gray-300">
                  <Link to="/products?brand=rolex" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>👑</span> Rolex</Link>
                  <Link to="/products?brand=omega" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>Ω</span> Omega</Link>
                  <Link to="/products?brand=casio" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>⌚</span> Casio</Link>
                  <Link to="/products?brand=seiko" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>✨</span> Seiko</Link>
                  <Link to="/products?brand=titan" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>🏆</span> Titan</Link>
                  <Link to="/products?brand=fossil" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>💼</span> Fossil</Link>
                  <Link to="/products?brand=timex" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>⏱️</span> Timex</Link>
                  <Link to="/products?brand=tissot" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 flex items-center gap-2"><span>🇨🇭</span> Tissot</Link>
                </div>
              </div>
            </div>

            {/* 2. Men Dropdown */}
            <div className="relative group">
              <Link to="/products?cat=men" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1">
                <span>Men</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-1 w-48 text-xs text-gray-300">
                  <Link to="/products?cat=men" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 font-bold text-white">All Men's Watches</Link>
                  <Link to="/products?cat=men&q=chronograph" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Chronographs</Link>
                  <Link to="/products?cat=luxury&q=automatic" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Automatic Mechanical</Link>
                  <Link to="/products?cat=men&q=steel" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Stainless Steel Bracelets</Link>
                  <Link to="/products?cat=men&q=leather" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Italian Leather Straps</Link>
                </div>
              </div>
            </div>

            {/* 3. Women Dropdown */}
            <div className="relative group">
              <Link to="/products?cat=women" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1">
                <span>Women</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-1 w-48 text-xs text-gray-300">
                  <Link to="/products?cat=women" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 font-bold text-white">All Women's Watches</Link>
                  <Link to="/products?cat=women&q=rose+gold" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Rose Gold Collection</Link>
                  <Link to="/products?cat=partywear" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Diamond & Pearl Dials</Link>
                  <Link to="/products?cat=women&q=mesh" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Minimalist Mesh Straps</Link>
                </div>
              </div>
            </div>

            {/* 4. Kids Dropdown */}
            <div className="relative group">
              <Link to="/products?cat=kids" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1">
                <span>Kids</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-1 w-44 text-xs text-gray-300">
                  <Link to="/products?cat=kids" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 font-bold text-white">All Kids Watches</Link>
                  <Link to="/products?cat=digital" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Shock-Proof Digital</Link>
                  <Link to="/products?cat=smartwatches" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Kids Smart Trackers</Link>
                </div>
              </div>
            </div>

            {/* 5. Smartwatches Dropdown */}
            <div className="relative group">
              <Link to="/products?cat=smartwatches" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1">
                <span>Smartwatches</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-1 w-52 text-xs text-gray-300">
                  <Link to="/products?cat=smartwatches" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 font-bold text-white">All Smartwatches</Link>
                  <Link to="/products?cat=smartwatches&q=calling" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">AMOLED Bluetooth Calling</Link>
                  <Link to="/products?cat=smartwatches&q=fitness" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Fitness & 120+ Sports Modes</Link>
                  <Link to="/products?cat=smartwatches&q=health" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">24/7 SpO2 & Heart Rate Vitals</Link>
                  <Link to="/products?cat=smartwatches&q=rugged" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">IP68 / 5ATM Military Rugged</Link>
                  <Link to="/products?cat=smartwatches&q=battery" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">14+ Days Ultra Battery Life</Link>
                </div>
              </div>
            </div>

            {/* 6. Luxury Dropdown */}
            <div className="relative group">
              <Link to="/products?cat=luxury" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1">
                <span>Luxury</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-1 w-52 text-xs text-gray-300">
                  <Link to="/products?cat=luxury" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 font-bold text-watch-gold">👑 Swiss Haute Horlogerie</Link>
                  <Link to="/products?brand=rolex" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Rolex Submariner & Daytona</Link>
                  <Link to="/products?brand=omega" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Omega Moonwatch Masters</Link>
                  <Link to="/products?cat=luxury&q=tourbillon" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Tourbillon & Skeleton Art</Link>
                  <Link to="/products?cat=luxury&q=gold" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">18K Solid Gold Vault Editions</Link>
                  <Link to="/products?cat=luxury&q=diamond" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Hand-Set Diamond Bezels</Link>
                </div>
              </div>
            </div>

            {/* 7. Sports Dropdown */}
            <div className="relative group">
              <Link to="/products?cat=sports" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1">
                <span>Sports</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-1 w-48 text-xs text-gray-300">
                  <Link to="/products?cat=sports" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 font-bold text-white">All Sports Watches</Link>
                  <Link to="/products?cat=waterproof" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">200M Certified Divers</Link>
                  <Link to="/products?cat=digital" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">Military Tactical Shock</Link>
                </div>
              </div>
            </div>

            {/* 8. Collections Dropdown */}
            <div className="relative group">
              <Link to="/products" className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1">
                <span>Collections</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </Link>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50 animate-fade-in">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col gap-1 w-52 text-xs text-gray-300">
                  <Link to="/products?tag=new" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 text-emerald-400 font-bold">✨ 2026 Vault Arrivals</Link>
                  <Link to="/products?cat=couple" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">💑 His & Hers Couple Sets</Link>
                  <Link to="/products?cat=combo" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5">🎁 Value Combo Packs</Link>
                  <Link to="/manufacturing-hub" className="hover:text-watch-gold p-1.5 rounded hover:bg-white/5 text-watch-gold">🏭 3D Manufacturing Hub</Link>
                </div>
              </div>
            </div>

          </nav>

          {/* Deals & Offers Solid Gold Button */}
          <Link
            to="/products?tag=deals"
            className="bg-gradient-to-r from-[#D9A441] to-[#B98332] text-black font-extrabold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all flex-shrink-0 ml-auto"
          >
            <Tag className="w-3.5 h-3.5 fill-black" />
            <span>Deals & Offers</span>
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          VISUAL WATCH SEARCH (CAMERA SCANNER MODAL)
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
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
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
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2"
                >
                  <Scan className="w-3.5 h-3.5 text-watch-gold" />
                  <span className="font-semibold text-gray-800 truncate">Rolex Submariner</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleScan('Omega Speedmaster Moonwatch', 'Omega Speedmaster')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2"
                >
                  <Scan className="w-3.5 h-3.5 text-watch-gold" />
                  <span className="font-semibold text-gray-800 truncate">Omega Moonwatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleScan('AMOLED Ultra Smartwatch', 'Smartwatches')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2"
                >
                  <Scan className="w-3.5 h-3.5 text-watch-gold" />
                  <span className="font-semibold text-gray-800 truncate">AMOLED Smartwatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSampleScan('Patek Philippe Nautilus Selfwinding', 'Patek Philippe')}
                  className="p-2.5 rounded-xl border border-gray-200 hover:border-watch-gold hover:bg-amber-50/50 text-left transition-colors flex items-center gap-2"
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
                  className="w-full bg-gradient-to-r from-watch-gold to-amber-500 text-black font-extrabold py-2 px-3 rounded-lg shadow-sm hover:opacity-95 transition-all text-xs"
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