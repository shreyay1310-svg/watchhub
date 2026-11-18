import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Heart,
  ChevronRight,
  ChevronLeft,
  Truck,
  RotateCcw,
  Award,
  Headphones,
  ShoppingBag,
  Sparkles,
  Lock,
  Star,
  Clock,
  Watch,
  X,
  Check,
} from 'lucide-react';

// Recommended complementary timepieces for "You May Also Like" carousel
const RECOMMENDATIONS = [
  {
    id: 'rolex-daytona',
    name: 'Rolex Cosmograph Daytona Gold',
    brand: 'ROLEX',
    category: 'Luxury Chronograph',
    dialSize: '40mm',
    movement: 'Calibre 4130 Superlative Chronometer',
    caseMaterial: '18K Yellow Gold',
    warranty: '5 Years Official International Warranty',
    price: 2199900,
    originalPrice: 2450000,
    discount: 10,
    rating: 4.9,
    reviewsCount: 412,
    image: '/images/products/rolex-daytona.png',
  },
  {
    id: 'omega-speedmaster',
    name: 'Omega Speedmaster Professional Moonwatch',
    brand: 'OMEGA',
    category: 'Master Chronometer',
    dialSize: '42mm',
    movement: 'Calibre 3861 Manual Co-Axial',
    caseMaterial: '316L Stainless Steel',
    warranty: '5 Years Official Omega Warranty',
    price: 797500,
    originalPrice: 890000,
    discount: 10,
    rating: 4.8,
    reviewsCount: 295,
    image: '/images/products/omega-speedmaster.png',
  },
  {
    id: 'tag-carrera-blue',
    name: 'TAG Heuer Carrera Calibre 5',
    brand: 'TAG HEUER',
    category: 'Automatic Sport Elegance',
    dialSize: '39mm',
    movement: 'Calibre 5 Automatic',
    caseMaterial: 'Fine-Brushed Steel',
    warranty: '2 Years Manufacturer Warranty',
    price: 539000,
    originalPrice: 620000,
    discount: 13,
    rating: 4.7,
    reviewsCount: 142,
    image: '/images/products/tag-heuer-carrera.png',
  },
  {
    id: 'seiko-prospex-diver',
    name: 'Seiko Prospex 200M Diver',
    brand: 'SEIKO',
    category: 'Professional Diver',
    dialSize: '44mm',
    movement: '6R35 Automatic (70h Reserve)',
    caseMaterial: 'Stainless Steel with Super-Hard Coating',
    warranty: '3 Years International Warranty',
    price: 203500,
    originalPrice: 240000,
    discount: 15,
    rating: 4.6,
    reviewsCount: 276,
    image: '/images/products/seiko-prospex-diver.png',
  },
  {
    id: 'tissot-prx-blue',
    name: 'Tissot PRX Powermatic 80 Blue',
    brand: 'TISSOT',
    category: 'Integrated Bracelet',
    dialSize: '40mm',
    movement: 'Powermatic 80 with Nivachron',
    caseMaterial: '316L Stainless Steel',
    warranty: '2 Years Official Tissot Warranty',
    price: 46800,
    originalPrice: 55000,
    discount: 15,
    rating: 4.8,
    reviewsCount: 511,
    image: '/images/products/tissot-prx.png',
  },
  {
    id: 'rolex-submariner-black',
    name: 'Rolex Submariner Date 41mm',
    brand: 'ROLEX',
    category: 'Oyster Perpetual Diver',
    dialSize: '41mm',
    movement: 'Calibre 3235 Chronometer',
    caseMaterial: 'Oystersteel with Cerachrom',
    warranty: '5 Years Official International Warranty',
    price: 1078000,
    originalPrice: 1250000,
    discount: 14,
    rating: 4.9,
    reviewsCount: 320,
    image: '/images/products/rolex-submariner.png',
  },
];

export const CartPage = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    mrpTotal,
    deliveryCharges,
    couponDiscount,
    totalAmount,
    totalSavings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const { formatPrice } = useCurrencyLanguage();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const carouselRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const uniqueItemsCount = cart.length;

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) {
      setCouponMsg({ success: false, message: 'Please enter a promo code.' });
      return;
    }
    const res = applyCoupon(couponInput.trim());
    setCouponMsg(res);
    if (res.success) {
      showToast(`✨ Promo code ${couponInput.trim().toUpperCase()} applied successfully!`);
      setCouponInput('');
    }
  };

  const handleApplyCouponCode = (code) => {
    setCouponInput(code);
    const res = applyCoupon(code);
    setCouponMsg(res);
    if (res.success) {
      showToast(`✨ Promo code ${code} applied successfully!`);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('⚠️ Your cart is empty. Add a timepiece before proceeding.');
      return;
    }
    navigate('/checkout');
  };

  const handleScrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddSampleItem = () => {
    const sample = RECOMMENDATIONS[0];
    addToCart(sample, 1);
    showToast(`✨ ${sample.name} added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-[#030914] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E9B94F] selection:text-black">
      <CustomerNavbar />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1628] border border-[#00D5FF] text-white px-5 py-3 rounded-2xl shadow-[0_10px_35px_rgba(0,213,255,0.3)] flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#00D5FF]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-10">
        {/* 1. PAGE HEADER & BREADCRUMB */}
        <div className="space-y-3 border-b border-[#26364D]/60 pb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#A7B1C2] font-mono">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#E9B94F] font-semibold">Shopping Cart</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
                  Shopping Cart{' '}
                  <span className="text-[#E9B94F] font-sans font-normal text-xl sm:text-2xl">
                    ({uniqueItemsCount} {uniqueItemsCount === 1 ? 'Item' : 'Items'})
                  </span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B1C2] font-light mt-1">
                Review your selected timepieces and proceed to checkout.
              </p>
            </div>

            {cart.length > 0 && (
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-[#0B1628] border border-[#26364D] text-[#A7B1C2]">
                  <strong className="text-white font-bold">{uniqueItemsCount}</strong> Unique Timepieces •{' '}
                  <strong className="text-white font-bold">{totalQuantity}</strong> Total Units
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-mono underline"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. MAIN CONTENT (CART ITEMS + SIDEBAR SUMMARY) OR EMPTY STATE */}
        {cart.length === 0 ? (
          /* 10. EMPTY CART STATE */
          <div className="bg-[#0B1628] border border-[#26364D] rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-[#081426] border border-[#E9B94F]/40 flex items-center justify-center mx-auto text-[#E9B94F] shadow-[0_0_30px_rgba(233,185,79,0.2)]">
              <ShoppingBag className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Your Watch Collection Awaits
              </h2>
              <p className="text-xs sm:text-sm text-[#A7B1C2] font-light max-w-md mx-auto leading-relaxed">
                Your cart is currently empty. Discover your perfect timepiece from our curated international manufactures.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                to="/watches"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E9B94F] to-[#D4A33B] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center gap-2"
              >
                <span>Explore Watches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/best-sellers"
                className="px-6 py-2.5 rounded-full bg-[#081426] hover:bg-[#0E1F3B] border border-[#00D5FF]/50 text-[#00D5FF] text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                View Best Sellers
              </Link>
              <button
                type="button"
                onClick={handleAddSampleItem}
                className="px-5 py-2.5 rounded-full bg-[#030914] hover:bg-[#07111F] border border-[#26364D] text-[#E9B94F] text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Populate cart with demo Rolex Daytona"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add Sample Luxury Watch</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ════════════════════════════════════════════════════════════
                LEFT SECTION: HORIZONTAL PRODUCT CARDS (8 Columns)
                ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const inWish = isInWishlist(item.id);
                const originalPrice = item.originalPrice || Math.round((item.price || 0) * 1.25);
                const hasDiscount = originalPrice > (item.price || 0);
                const discountPercent = hasDiscount
                  ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
                  : 0;

                // Fallbacks for luxury horological specs
                const brand = item.brand || 'SWISS MANUFACTURE';
                const dialSize = item.dialSize || '41mm';
                const movement = item.movement || 'Automatic Chronometer';
                const caseMaterial =
                  item.caseMaterial || (item.name?.toLowerCase().includes('gold') ? '18K Yellow Gold' : '316L Oystersteel');
                const warranty = item.warranty || '5 Years Official International Warranty';

                return (
                  <div
                    key={item.id}
                    className="group bg-[#0B1628] border border-[#26364D] hover:border-[#00D5FF]/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-lg flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    {/* Watch Image Box with Dark Pedestal & Contain */}
                    <div className="relative w-full sm:w-36 h-36 rounded-xl bg-[#030914] border border-white/5 p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image || '/images/products/watch_placeholder.png'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/products/watch_placeholder.png';
                        }}
                        className="w-full h-full object-contain object-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#00C98B]/20 border border-[#00C98B]/50 text-[#00C98B] font-mono text-[9.5px] font-bold">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Product Details Middle Block */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Brand & Authenticity Tag */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#E9B94F] uppercase font-mono">
                          {brand}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-[#00C98B] bg-[#00C98B]/10 px-2 py-0.5 rounded-full border border-[#00C98B]/30">
                          <Check className="w-2.5 h-2.5" /> 100% Certified Authentic
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="text-base sm:text-lg font-serif font-bold text-white tracking-tight hover:text-[#00D5FF] transition-colors cursor-pointer truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h3>

                      {/* Horological Specifications Strip */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#A7B1C2] font-mono">
                        <span className="flex items-center gap-1">
                          <Watch className="w-3 h-3 text-[#00D5FF]" /> {item.category || 'Luxury'}
                        </span>
                        <span>•</span>
                        <span>⌀ {dialSize}</span>
                        <span>•</span>
                        <span>⚙ {movement}</span>
                        <span>•</span>
                        <span>🛡️ {caseMaterial}</span>
                      </div>

                      {/* Warranty Strip */}
                      <div className="flex items-center gap-1 text-[10.5px] text-slate-400">
                        <Award className="w-3 h-3 text-[#E9B94F]" />
                        <span>{warranty}</span>
                      </div>

                      {/* Pricing Row */}
                      <div className="flex items-baseline gap-2 pt-1 font-mono">
                        <span className="text-base sm:text-lg font-bold text-white">
                          {formatPrice(item.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                        <span className="text-[10.5px] text-slate-400">
                          ({formatPrice(item.price * item.quantity)} total)
                        </span>
                      </div>
                    </div>

                    {/* Right Controls: Quantity & Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#26364D]/60">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-[#081426] border border-[#26364D] rounded-xl p-1 shadow-inner">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-[#030914] hover:bg-[#E9B94F] text-slate-300 hover:text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center font-mono font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-[#030914] hover:bg-[#E9B94F] text-slate-300 hover:text-black flex items-center justify-center transition-all cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Wishlist & Delete Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            toggleWishlist(item);
                            showToast(
                              inWish
                                ? `Removed ${item.name} from wishlist`
                                : `❤️ Added ${item.name} to wishlist`
                            );
                          }}
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs transition-all ${
                            inWish
                              ? 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                              : 'bg-[#081426] border-[#26364D] text-slate-400 hover:text-white hover:border-[#E9B94F]/40'
                          }`}
                          title={inWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(item.id);
                            showToast(`Removed ${item.name} from cart`);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#081426] hover:bg-rose-500/20 border border-[#26364D] hover:border-rose-500/40 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                          title="Remove from Cart"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ════════════════════════════════════════════════════════════
                RIGHT SECTION: PROMO CODE & ORDER SUMMARY (4 Columns)
                ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-4 space-y-6">
              {/* 3. PROMO CODE CARD */}
              <div className="bg-[#0B1628] border border-[#26364D] rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Tag className="w-3.5 h-3.5 text-[#E9B94F]" />
                    <span>Apply Promo Code</span>
                  </span>
                  {appliedCoupon && (
                    <span className="text-[10px] font-bold text-[#00C98B] bg-[#00C98B]/10 px-2 py-0.5 rounded-full border border-[#00C98B]/30 font-mono">
                      {appliedCoupon.percent}% OFF APPLIED
                    </span>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="p-3 bg-[#00C98B]/10 border border-[#00C98B]/40 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00C98B]" />
                        <span className="font-mono font-bold text-xs text-white">
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#00C98B] mt-0.5 font-light">
                        {appliedCoupon.desc} • Savings: {formatPrice(couponDiscount)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        showToast('Coupon removed');
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold hover:underline font-mono"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. FESTIVAL40"
                      className="flex-1 h-10 px-3.5 bg-[#081426] border border-[#26364D] rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-[#E9B94F] font-mono uppercase tracking-wider transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 h-10 bg-gradient-to-r from-[#E9B94F] to-[#D4A33B] text-black text-xs font-bold rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-sm"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Feedback message */}
                {couponMsg && !appliedCoupon && (
                  <p
                    className={`text-[11px] font-mono ${
                      couponMsg.success ? 'text-[#00C98B]' : 'text-rose-400'
                    }`}
                  >
                    {couponMsg.message}
                  </p>
                )}

                {/* Suggested Coupons Chips */}
                <div className="space-y-1.5 pt-1 border-t border-white/5">
                  <span className="text-[10.5px] text-slate-400 block font-mono">
                    Suggested Privilege Codes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { code: 'FESTIVAL40', label: 'FESTIVAL40 (-40%)' },
                      { code: 'WATCHHUB10', label: 'WATCHHUB10 (-10%)' },
                      { code: 'FIRSTBUY', label: 'FIRSTBUY (-15%)' },
                    ].map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCouponCode(c.code)}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#081426] hover:bg-[#030914] border border-[#26364D] hover:border-[#E9B94F]/60 text-slate-300 hover:text-[#E9B94F] transition-all"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. ORDER SUMMARY CARD */}
              <div className="bg-[#0B1628] border border-[#26364D] rounded-2xl p-6 space-y-4 shadow-xl text-xs text-white">
                <h2 className="text-base font-serif font-bold text-white border-b border-[#26364D]/60 pb-3 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="font-sans text-[11px] font-normal text-slate-400 font-mono">
                    {uniqueItemsCount} {uniqueItemsCount === 1 ? 'Item' : 'Items'}
                  </span>
                </h2>

                <div className="space-y-2.5 font-mono">
                  {/* Total MRP */}
                  <div className="flex justify-between text-[#A7B1C2]">
                    <span>Total MRP</span>
                    <span className="text-white">{formatPrice(mrpTotal)}</span>
                  </div>

                  {/* Product Discount */}
                  <div className="flex justify-between text-[#A7B1C2]">
                    <span>Product Discount</span>
                    <span className="text-[#00C98B] font-bold">
                      -{formatPrice(Math.max(0, mrpTotal - subtotal))}
                    </span>
                  </div>

                  {/* Coupon Discount */}
                  {appliedCoupon && (
                    <div className="flex justify-between text-[#A7B1C2]">
                      <span className="text-[#00C98B]">
                        Coupon Savings ({appliedCoupon.percent}%)
                      </span>
                      <span className="text-[#00C98B] font-bold">
                        -{formatPrice(couponDiscount)}
                      </span>
                    </div>
                  )}

                  {/* Delivery Charges */}
                  <div className="flex justify-between text-[#A7B1C2]">
                    <span>Delivery Charges</span>
                    <span>
                      {deliveryCharges === 0 ? (
                        <span className="text-[#00C98B] font-bold">FREE (Complimentary)</span>
                      ) : (
                        <span>{formatPrice(deliveryCharges)}</span>
                      )}
                    </span>
                  </div>

                  {/* Taxes */}
                  <div className="flex justify-between text-[#A7B1C2]">
                    <span>Tax & Duties</span>
                    <span className="text-slate-400">Included in Price</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="border-t border-[#26364D]/80 pt-4 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-white block">Grand Total</span>
                    <span className="text-[10px] text-slate-400 font-light">
                      All international duties inclusive
                    </span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-[#E9B94F]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                {/* Savings Banner */}
                {totalSavings > 0 && (
                  <div className="p-3 bg-[#00C98B]/10 border border-[#00C98B]/40 text-[#00C98B] rounded-xl text-[11.5px] font-semibold text-center font-mono">
                    🎉 You are saving {formatPrice(totalSavings)} on this acquisition!
                  </div>
                )}

                {/* Proceed to Checkout CTA */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E9B94F] to-[#D4A33B] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(233,185,79,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Security Footnote */}
                <div className="pt-2 text-center text-[10.5px] text-slate-400 flex items-center justify-center gap-1.5 font-light">
                  <Lock className="w-3.5 h-3.5 text-[#E9B94F]" />
                  <span>256-bit SSL Encrypted & Verified Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            5. YOU MAY ALSO LIKE SECTION (RECOMMENDATIONS CAROUSEL)
            ════════════════════════════════════════════════════════════ */}
        <section className="space-y-6 pt-6 border-t border-[#26364D]/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E9B94F]" />
                <span className="text-[11px] font-extrabold text-[#E9B94F] tracking-[0.2em] uppercase">
                  CURATED RECOMMENDATIONS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                You May Also Like
              </h2>
              <p className="text-xs sm:text-sm text-[#A7B1C2] font-light mt-0.5">
                Handpicked timepieces to complement your collection.
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleScrollCarousel('left')}
                className="w-8 h-8 rounded-full bg-[#0B1628] hover:bg-[#0E1F3B] border border-[#26364D] hover:border-[#00D5FF] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollCarousel('right')}
                className="w-8 h-8 rounded-full bg-[#0B1628] hover:bg-[#0E1F3B] border border-[#26364D] hover:border-[#00D5FF] text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {RECOMMENDATIONS.map((rec) => {
              const inWish = isInWishlist(rec.id);

              return (
                <div
                  key={rec.id}
                  className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start group bg-[#0B1628] border border-[#26364D] hover:border-[#E9B94F]/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-md"
                >
                  <div>
                    {/* Watch Image */}
                    <div
                      onClick={() => navigate(`/product/${rec.id}`)}
                      className="relative w-full aspect-[4/3] rounded-xl bg-[#030914] border border-white/5 p-2 flex items-center justify-center mb-3 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={rec.image}
                        alt={rec.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/products/watch_placeholder.png';
                        }}
                        className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(rec);
                          showToast(
                            inWish
                              ? `Removed ${rec.name} from wishlist`
                              : `❤️ Saved ${rec.name} to wishlist`
                          );
                        }}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-xs transition-colors ${
                          inWish ? 'text-rose-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Brand */}
                    <span className="text-[10px] font-bold text-[#E9B94F] uppercase tracking-wider font-mono block mb-1">
                      {rec.brand}
                    </span>

                    {/* Product Name */}
                    <h3
                      onClick={() => navigate(`/product/${rec.id}`)}
                      className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00D5FF] transition-colors truncate cursor-pointer"
                      title={rec.name}
                    >
                      {rec.name}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1 text-[11px] text-[#E9B94F] mt-1.5 font-mono">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-white">{rec.rating}</span>
                      <span className="text-slate-500">({rec.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Price & Quick Add */}
                  <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-[#26364D]/60">
                    <div>
                      <div className="font-mono font-bold text-sm text-white">
                        {formatPrice(rec.price)}
                      </div>
                      {rec.originalPrice && (
                        <div className="text-[10px] text-slate-500 line-through font-mono">
                          {formatPrice(rec.originalPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(rec, 1);
                        showToast(`✨ ${rec.name} added to cart!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#030914] hover:bg-[#E9B94F] text-[#E9B94F] hover:text-black border border-[#E9B94F]/40 hover:border-[#E9B94F] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                      title="Quick Add to Cart"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            6. TRUST AND BENEFITS STRIP
            ════════════════════════════════════════════════════════════ */}
        <section className="bg-[#081426] border border-[#26364D] rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center sm:text-left">
            {/* Benefit 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1628] border border-[#E9B94F]/40 flex items-center justify-center text-[#E9B94F] flex-shrink-0 shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Free Shipping Above ₹999</h4>
                <p className="text-[10.5px] text-[#A7B1C2] font-light">Complimentary express courier</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1628] border border-[#E9B94F]/40 flex items-center justify-center text-[#E9B94F] flex-shrink-0 shadow-sm">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">7-Day Easy Returns</h4>
                <p className="text-[10.5px] text-[#A7B1C2] font-light">Hassle-free exchange policy</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1628] border border-[#E9B94F]/40 flex items-center justify-center text-[#E9B94F] flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">100% Authentic Genuine</h4>
                <p className="text-[10.5px] text-[#A7B1C2] font-light">Certified Swiss horology</p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1628] border border-[#E9B94F]/40 flex items-center justify-center text-[#E9B94F] flex-shrink-0 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Official Brand Warranty</h4>
                <p className="text-[10.5px] text-[#A7B1C2] font-light">Global manufacturer coverage</p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#0B1628] border border-[#E9B94F]/40 flex items-center justify-center text-[#E9B94F] flex-shrink-0 shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">24×7 Customer Support</h4>
                <p className="text-[10.5px] text-[#A7B1C2] font-light">Dedicated concierge service</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. LUXURY WATCHHUB FOOTER */}
      <Footer />
    </div>
  );
};

export default CartPage;
