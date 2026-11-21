import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Home,
  Watch,
  FolderTree,
  Tag,
  Sparkles,
  Flame,
  PenTool,
  Heart,
  ShoppingBag,
  CreditCard,
  User,
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  MapPin,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Award,
  Smartphone,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const CustomerDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const [accountSubmenuOpen, setAccountSubmenuOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Slide-out Drawer Panel */}
      <aside className="relative z-10 w-full max-w-xs sm:max-w-sm bg-[#040A17] border-r border-[#00CFFF]/20 h-full flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] text-[#F8FAFC] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div>
          {/* Top Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#061022]">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1E38] to-[#040A17] border border-[#F4B942]/40 flex items-center justify-center text-lg text-[#F4B942] shadow-[0_0_15px_rgba(244,185,66,0.25)]">
                ⌚
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white block">
                  Watch<span className="text-[#F4B942]">Hub</span>
                </span>
                <span className="text-[8.5px] font-bold text-[#A6B1C8] tracking-[0.25em] uppercase block -mt-0.5">
                  LUXURY WATCHES
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Customer Modules Navigation (Exact Match to Reference Image 1) */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00CFFF]">
              Customer Website Modules
            </div>

            {/* Home */}
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#F4B942]/15 to-transparent border border-[#F4B942]/30 text-[#F4B942] font-semibold text-xs transition-all"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            {/* Watches */}
            <Link
              to="/watches"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Watch className="w-4 h-4 text-[#F4B942]" />
                <span>All Watches</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Brands */}
            <Link
              to="/brands"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-[#00CFFF]" />
                <span>Brands (60+ Global)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Men */}
            <Link
              to="/men"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#1265FF]" />
                <span>Men's Watches</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Women */}
            <Link
              to="/women"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#FF35C8]" />
                <span>Women's Watches</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Kids */}
            <Link
              to="/kids"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🎈</span>
                <span>Kids' Watches</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Smartwatches */}
            <Link
              to="/smartwatches"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-[#39F5A5]" />
                <span>Smartwatches</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Luxury Collection */}
            <Link
              to="/luxury"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-[#F4B942]" />
                <span>Luxury Collection</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Sports Collection */}
            <Link
              to="/sports"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Watch className="w-4 h-4 text-[#00CFFF]" />
                <span>Sports & Divers</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Collections */}
            <Link
              to="/collections"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4 text-[#A855F7]" />
                <span>Signature Collections</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* Categories Overview */}
            <Link
              to="/categories"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-[#F4B942]" />
                <span>All 12 Categories Directory</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* New Arrivals */}
            <Link
              to="/products?tag=new"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                <span>New Arrivals</span>
              </div>
              <span className="text-[9px] font-bold bg-[#00F0FF]/15 text-[#00F0FF] px-1.5 py-0.5 rounded">
                NEW
              </span>
            </Link>

            {/* Best Sellers */}
            <Link
              to="/products?tag=bestseller"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Best Sellers</span>
              </div>
              <span className="text-[9px] font-bold bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">
                HOT
              </span>
            </Link>

            {/* Customize Your Watch */}
            <Link
              to="/customize-watch"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#00CFFF]/10 border border-[#00CFFF]/30 text-[#00CFFF] hover:bg-[#00CFFF]/20 font-bold text-xs transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <PenTool className="w-4 h-4" />
                <span>Customize Your Watch</span>
              </div>
              <span className="text-[9px] bg-[#00CFFF] text-black font-extrabold px-1.5 py-0.5 rounded-full">
                3D STUDIO
              </span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-[#FF35C8]" />
                <span>Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="text-[10px] bg-[#FF35C8] text-white font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#F4B942]" />
                <span>Cart</span>
              </div>
              <span className="text-[10px] bg-[#F4B942] text-black font-bold px-2 py-0.5 rounded-full">
                {cartCount > 0 ? cartCount : 2}
              </span>
            </Link>

            {/* Checkout */}
            <Link
              to="/checkout"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/5 text-[#A6B1C8] hover:text-white font-medium text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-[#39F5A5]" />
                <span>Checkout</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </Link>

            {/* ══════════════════════════════════════════════════════════════
                MY ACCOUNT ACCORDION
                ══════════════════════════════════════════════════════════════ */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAccountSubmenuOpen(!accountSubmenuOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 text-white font-semibold text-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#F4B942]" />
                  <span>My Account</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accountSubmenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountSubmenuOpen && (
                <div className="pl-9 pr-2 py-2 space-y-1.5 text-xs text-[#A6B1C8] bg-black/20 rounded-b-xl border-x border-b border-white/5">
                  <Link
                    to="/orders"
                    onClick={onClose}
                    className="flex items-center gap-2 py-1 hover:text-white"
                  >
                    <span>•</span>
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/track-parcel"
                    onClick={onClose}
                    className="flex items-center gap-2 py-1 hover:text-[#00CFFF]"
                  >
                    <span>•</span>
                    <span>Track My Order</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="flex items-center gap-2 py-1 hover:text-white"
                  >
                    <span>•</span>
                    <span>My Wishlist</span>
                  </Link>
                  <Link
                    to="/customize-watch?tab=saved"
                    onClick={onClose}
                    className="flex items-center gap-2 py-1 hover:text-[#F4B942]"
                  >
                    <span>•</span>
                    <span>My Custom Designs</span>
                  </Link>
                  <Link
                    to="/account?tab=rewards"
                    onClick={onClose}
                    className="flex items-center gap-2 py-1 hover:text-white"
                  >
                    <span>•</span>
                    <span>My Rewards</span>
                  </Link>
                  <Link
                    to="/account?tab=wallet"
                    onClick={onClose}
                    className="flex items-center gap-2 py-1 hover:text-white"
                  >
                    <span>•</span>
                    <span>My Wallet</span>
                  </Link>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center gap-2 py-1 hover:text-white"
                  >
                    <span>•</span>
                    <span>Profile & Settings</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Additional Luxury Services */}
            <div className="pt-3 pb-1 border-t border-white/10 mt-3 space-y-1">
              <Link
                to="/warranty-service"
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2 rounded-lg hover:bg-white/5 text-[#A6B1C8] hover:text-white text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>Warranty & Service</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>

              <Link
                to="/returns-refunds"
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2 rounded-lg hover:bg-white/5 text-[#A6B1C8] hover:text-white text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#00CFFF]" />
                  <span>Returns & Refunds</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>

              <Link
                to="/store-locator"
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2 rounded-lg hover:bg-white/5 text-[#A6B1C8] hover:text-white text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Store Locator</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>

              <Link
                to="/stories"
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2 rounded-lg hover:bg-white/5 text-[#A6B1C8] hover:text-white text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>Watchmaking Stories</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>

              <Link
                to="/support"
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2 rounded-lg hover:bg-white/5 text-[#A6B1C8] hover:text-white text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Headphones className="w-3.5 h-3.5 text-[#39F5A5]" />
                  <span>Support / Help Center</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-white/10 bg-[#061022]">
          {user ? (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F4B942] to-amber-600 text-black font-extrabold flex items-center justify-center text-xs">
                  {user.name ? user.name[0] : 'S'}
                </div>
                <div className="truncate">
                  <p className="font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  onClose();
                  await logout();
                  navigate('/login', { replace: true });
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,185,66,0.3)] hover:brightness-110 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In to WatchHub</span>
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CustomerDrawer;
