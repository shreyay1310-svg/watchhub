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
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Shreya';

  return (
    <header className="sticky top-0 z-50 shadow-md font-poppins select-none">
      {/* ════════════════════════════════════════════════════════════════
          1. TOP UTILITY BAR (Exact Match to Reference UI)
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#070B12] text-gray-300 text-[11px] py-1 px-4 sm:px-8 border-b border-white/5 hidden md:flex justify-between items-center">
        {/* Left Information */}
        <div className="flex items-center gap-4 text-gray-300 font-medium">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <Globe className="w-3.5 h-3.5 text-watch-gold" /> Global Watch Destination
          </span>
          <span className="text-gray-600">|</span>
          <span className="hover:text-white transition-colors">100% Authentic</span>
          <span className="text-gray-600">|</span>
          <span className="hover:text-white transition-colors">Free Shipping Above ₹999</span>
          <span className="text-gray-600">|</span>
          <span className="hover:text-white transition-colors">7-Day Easy Returns</span>
        </div>

        {/* Right Contacts & Staff Portal */}
        <div className="flex items-center gap-4 text-gray-300 font-medium">
          <Link to="/customer-support" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Headphones className="w-3.5 h-3.5 text-watch-gold" /> Help & Support
          </Link>
          <span className="text-gray-600">|</span>
          <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-watch-gold" /> +91 98765 43210
          </a>
          <span className="text-gray-600">|</span>
          <Link to="/dashboard" className="text-watch-gold font-bold hover:underline">
            👑 Staff Portal
          </Link>
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
            onClick={() => navigate('/products')}
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

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-full py-1.5 px-3 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-watch-gold" />
              <span>Hi, {displayName}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0E1724] text-white rounded-xl shadow-2xl border border-white/10 py-1.5 z-50 text-xs animate-scale-up">
                <div className="px-3.5 py-2 border-b border-white/10">
                  <p className="font-bold text-white">{user?.name || 'Shreya (VIP Member)'}</p>
                  <p className="text-gray-400 text-[11px] truncate">{user?.email || 'shreya@watchhub.com'}</p>
                  <span className="inline-block mt-1 bg-watch-gold/20 text-watch-gold border border-watch-gold/30 text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                    {user?.role || 'VIP Customer'}
                  </span>
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

                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-500/10 text-red-400 flex items-center gap-1.5 border-t border-white/10 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3.5 py-2 hover:bg-white/5 text-watch-gold font-bold border-t border-white/10 mt-1"
                  >
                    Sign In to Account
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. SECONDARY CATEGORY & DEALS MENU BAR (Exact Match to Image 2)
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
            {/* Brands Dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setBrandsOpen(!brandsOpen)}
                className="flex items-center gap-1 hover:text-watch-gold transition-colors py-1 cursor-pointer"
              >
                <span>Brands</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-watch-gold transition-colors" />
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full pt-2 z-50">
                <div className="bg-[#0B121C] border border-white/10 rounded-xl p-3 shadow-2xl grid grid-cols-2 gap-2 w-56 text-xs text-gray-300">
                  <Link to="/products?brand=rolex" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Rolex</Link>
                  <Link to="/products?brand=omega" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Omega</Link>
                  <Link to="/products?brand=casio" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Casio</Link>
                  <Link to="/products?brand=seiko" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Seiko</Link>
                  <Link to="/products?brand=titan" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Titan</Link>
                  <Link to="/products?brand=fossil" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Fossil</Link>
                  <Link to="/products?brand=timex" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Timex</Link>
                  <Link to="/products?brand=citizen" className="hover:text-watch-gold p-1 rounded hover:bg-white/5">Citizen</Link>
                </div>
              </div>
            </div>

            <Link to="/products?cat=men" className="flex items-center gap-1 hover:text-watch-gold transition-colors">
              <span>Men</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </Link>

            <Link to="/products?cat=women" className="flex items-center gap-1 hover:text-watch-gold transition-colors">
              <span>Women</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </Link>

            <Link to="/products?cat=kids" className="flex items-center gap-1 hover:text-watch-gold transition-colors">
              <span>Kids</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </Link>

            <Link to="/products?cat=smartwatches" className="hover:text-watch-gold transition-colors">
              Smartwatches
            </Link>

            <Link to="/products?cat=luxury" className="flex items-center gap-1 hover:text-watch-gold transition-colors">
              <span>Luxury</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </Link>

            <Link to="/products?cat=sports" className="flex items-center gap-1 hover:text-watch-gold transition-colors">
              <span>Sports</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </Link>

            <Link to="/products?cat=partywear" className="hover:text-watch-gold transition-colors">
              Party Wear
            </Link>

            <Link to="/products" className="flex items-center gap-1 hover:text-watch-gold transition-colors">
              <span>Collections</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </Link>
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
    </header>
  );
};

export default CustomerNavbar;