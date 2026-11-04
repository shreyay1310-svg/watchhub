import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Truck, ShieldCheck, ChevronDown, LogOut } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const CustomerNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm font-poppins">
      {/* Top Bar */}
      <div className="bg-watch-navy text-white text-[11px] py-1.5 px-8 hidden sm:flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-watch-gold-light">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Original Certified Watches
          </span>
          <span className="flex items-center gap-1.5 text-gray-300">
            <Truck className="w-3.5 h-3.5" /> Free Express Delivery on orders above ₹999
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/track-order" className="hover:text-watch-gold-light transition-colors">Track Order</Link>
          <span className="text-gray-500">|</span>
          <Link to="/dashboard" className="text-watch-gold font-semibold hover:underline">
            👑 Staff Portal
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-watch-navy to-watch-gold flex items-center justify-center text-xl shadow-md border border-watch-gold/30">
            ⌚
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-watch-navy leading-none tracking-tight">
              Watch<span className="text-watch-gold">Hub</span>
            </h1>
            <p className="text-[9.5px] text-gray-500 tracking-wide mt-0.5">Premium Watches for Every Style</p>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for watches, brands, categories..."
            className="w-full h-10 pl-4 pr-11 text-xs rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:border-watch-gold focus:ring-2 focus:ring-watch-gold/20 outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 w-9 bg-watch-gold hover:bg-watch-gold-dark text-watch-navy-dark rounded-full flex items-center justify-center transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/mobile-app"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors shadow-sm"
          >
            <span>📱</span> Mobile App (APK)
          </Link>

          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 text-gray-700 hover:text-watch-gold transition-colors relative p-1.5"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium hidden lg:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-gray-700 hover:text-watch-gold transition-colors relative p-1.5"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-medium hidden lg:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-watch-gold text-watch-navy-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Auth Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full py-1 px-3 text-xs font-semibold text-watch-navy transition-all"
              >
                <span>{user.avatar || '👤'}</span>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-gray-500 text-[11px] truncate">{user.email}</p>
                    <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/my-orders"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3.5 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    📦 My Orders
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3.5 py-2 hover:bg-gray-50 text-watch-gold font-semibold"
                  >
                    👑 Role Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-1.5 border-t border-gray-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-watch-navy hover:bg-watch-navy-light text-white font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Login / Signup</span>
            </Link>
          )}
        </div>
      </div>

      {/* Category Bar */}
      <div className="bg-white border-t border-gray-100 overflow-x-auto scrollbar-none px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1 text-xs">
          <Link
            to="/products"
            className="bg-watch-navy text-white font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 flex-shrink-0 hover:bg-watch-navy-light transition-colors"
          >
            <span>☰ All Categories</span>
          </Link>
          <div className="flex items-center gap-1 text-gray-700 font-medium whitespace-nowrap pl-2">
            <Link to="/products?cat=men" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Men</Link>
            <Link to="/products?cat=women" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Women</Link>
            <Link to="/products?cat=couple" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Couple</Link>
            <Link to="/products?cat=partywear" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Partywear</Link>
            <Link to="/products?cat=combo" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors flex items-center gap-1">
              Combo Offers <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">Hot</span>
            </Link>
            <Link to="/products?cat=waterproof" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Waterproof</Link>
            <Link to="/products?cat=digital" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Digital</Link>
            <Link to="/products?cat=smartwatches" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Smartwatches</Link>
            <Link to="/products?cat=luxury" className="px-3 py-1.5 hover:text-watch-gold rounded transition-colors">Luxury</Link>
            <Link to="/products?tag=new" className="px-3 py-1.5 text-emerald-600 font-semibold hover:text-emerald-700 rounded transition-colors">
              New Arrivals
            </Link>
            <Link to="/products?tag=deals" className="px-3 py-1.5 text-red-600 font-semibold hover:text-red-700 rounded transition-colors">
              Deals
            </Link>
            <Link
              to="/manufacturing-hub"
              className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-watch-gold to-amber-500 text-watch-navy-dark font-extrabold text-[11px] shadow-sm hover:scale-105 transition-all flex items-center gap-1"
            >
              <span>🏭</span> Manufacturing Hub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;

