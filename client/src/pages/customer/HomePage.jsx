import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Heart,
  ShoppingCart,
  Star,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Tag,
} from 'lucide-react';

// Cropped Reference Assets (Exact 1:1 match to reference design)
import heroWatchCenter from '../../assets/images/ref_crops/hero-watch-center.jpg';
import tabLuxury from '../../assets/images/ref_crops/tab-luxury.jpg';
import tabSmart from '../../assets/images/ref_crops/tab-smart.jpg';
import tabSports from '../../assets/images/ref_crops/tab-sports.jpg';
import tabParty from '../../assets/images/ref_crops/tab-party.jpg';

import brandRolex from '../../assets/images/ref_crops/brand-rolex.jpg';
import brandOmega from '../../assets/images/ref_crops/brand-omega.jpg';
import brandCasio from '../../assets/images/ref_crops/brand-casio.jpg';
import brandSeiko from '../../assets/images/ref_crops/brand-seiko.jpg';
import brandTitan from '../../assets/images/ref_crops/brand-titan.jpg';
import brandFossil from '../../assets/images/ref_crops/brand-fossil.jpg';
import brandTimex from '../../assets/images/ref_crops/brand-timex.jpg';
import brandCitizen from '../../assets/images/ref_crops/brand-citizen.jpg';
import brandTissot from '../../assets/images/ref_crops/brand-tissot.jpg';
import brandFastrack from '../../assets/images/ref_crops/brand-fastrack.jpg';
import brandPoise from '../../assets/images/ref_crops/brand-poise.jpg';

import catMen from '../../assets/images/ref_crops/cat-men.jpg';
import catWomen from '../../assets/images/ref_crops/cat-women.jpg';
import catSmart from '../../assets/images/ref_crops/cat-smart.jpg';
import catSports from '../../assets/images/ref_crops/cat-sports.jpg';
import catLuxury from '../../assets/images/ref_crops/cat-luxury.jpg';
import catParty from '../../assets/images/ref_crops/cat-party.jpg';
import catWaterproof from '../../assets/images/ref_crops/cat-waterproof.jpg';
import catCombo from '../../assets/images/ref_crops/cat-combo.jpg';

export const HomePage = () => {
  const { addToCart, toggleWishlist, isInWishlist, applyCoupon } = useCart();
  const navigate = useNavigate();
  const [activeHeroTab, setActiveHeroTab] = useState(0); // 0: Luxury, 1: Smart, 2: Sports, 3: Party
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [addedItem, setAddedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const brandsRowRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollBrandsRight = () => {
    if (brandsRowRef.current) {
      brandsRowRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Live Countdown Timer (matching "02 Days 14 Hrs 36 Min 20 Sec")
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4 Interactive Hero Slides with distinct centerpiece imagery
  const HERO_SLIDES = [
    {
      id: 'luxury',
      label: 'Luxury Collection',
      thumb: tabLuxury,
      centerImage: heroWatchCenter,
      eyebrow: '👑 THE LUXURY COLLECTION —',
      title1: 'Timeless',
      title2: 'Elegance',
      subtitle: "Explore iconic timepieces from the world's most prestigious brands.",
      ctaText: 'Shop Luxury Watches →',
      link: '/products?cat=luxury',
    },
    {
      id: 'smartwatches',
      label: 'Smartwatches',
      thumb: tabSmart,
      centerImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      eyebrow: '⚡ NEXT-GEN AMOLED WEARABLES —',
      title1: 'Smart',
      title2: 'Innovation',
      subtitle: 'Bluetooth calling, ultra-bright AMOLED display and 24/7 fitness tracking.',
      ctaText: 'Explore Smartwatches →',
      link: '/products?cat=smartwatches',
    },
    {
      id: 'sports',
      label: 'Sports Series',
      thumb: tabSports,
      centerImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      eyebrow: '🌊 WATERPROOF DIVER EDITIONS —',
      title1: 'Extreme',
      title2: 'Performance',
      subtitle: 'Engineered for adventure with ISO certified 200M water resistance & sapphire glass.',
      ctaText: 'Shop Sports Series →',
      link: '/products?cat=waterproof',
    },
    {
      id: 'party',
      label: 'Party Wear',
      thumb: tabParty,
      centerImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      eyebrow: '✨ EVENING & GALA GLAMOUR —',
      title1: 'Radiant',
      title2: 'Celebration',
      subtitle: 'Diamond studded bezels, mother-of-pearl dials and royal gold accents.',
      ctaText: 'Shop Party Wear →',
      link: '/products?cat=partywear',
    },
  ];

  // 11 Popular Brands from Reference UI
  const POPULAR_BRANDS = [
    { name: 'Rolex', img: brandRolex, slug: 'rolex' },
    { name: 'Omega', img: brandOmega, slug: 'omega' },
    { name: 'Casio', img: brandCasio, slug: 'casio' },
    { name: 'Seiko', img: brandSeiko, slug: 'seiko' },
    { name: 'Titan', img: brandTitan, slug: 'titan' },
    { name: 'Fossil', img: brandFossil, slug: 'fossil' },
    { name: 'Timex', img: brandTimex, slug: 'timex' },
    { name: 'Citizen', img: brandCitizen, slug: 'citizen' },
    { name: 'Tissot', img: brandTissot, slug: 'tissot' },
    { name: 'Fastrack', img: brandFastrack, slug: 'fastrack' },
    { name: 'Poise', img: brandPoise, slug: 'poise' },
  ];

  // 8 Category Visual Cards from Reference UI
  const CATEGORY_CARDS = [
    { name: "Men's Watches", img: catMen, cat: 'men' },
    { name: "Women's Watches", img: catWomen, cat: 'women' },
    { name: 'Smartwatches', img: catSmart, cat: 'smartwatches' },
    { name: 'Sports Watches', img: catSports, cat: 'sports' },
    { name: 'Luxury Watches', img: catLuxury, cat: 'luxury' },
    { name: 'Party Wear', img: catParty, cat: 'partywear' },
    { name: 'Waterproof', img: catWaterproof, cat: 'waterproof' },
    { name: 'Combo Offers', img: catCombo, cat: 'combo' },
  ];

  const currentSlide = HERO_SLIDES[activeHeroTab];

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    showToast(`🛒 "${product.name}" added to cart!`);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const handleToggleWishlist = (product) => {
    toggleWishlist(product);
    const inWish = isInWishlist(product.id);
    showToast(inWish ? `💔 Removed from wishlist` : `❤️ Added to wishlist!`);
  };

  const handleGrabOffer = (e) => {
    e.preventDefault();
    applyCoupon('WATCHLUX40');
    showToast('🎉 40% OFF Coupon WATCHLUX40 Applied! Opening Flash Deals...');
    setTimeout(() => {
      navigate('/products?tag=deals');
    }, 600);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('⚠️ Please enter a valid email address');
      return;
    }
    showToast(`✨ Subscribed ${newsletterEmail} to VIP WatchHub Club!`);
    setNewsletterEmail('');
  };

  const filterTabs = ['All', 'Luxury', 'Waterproof', 'Digital', 'Smartwatches', 'Combo'];

  const filteredProducts = activeFilterTab === 'All'
    ? MOCK_PRODUCTS.slice(0, 8)
    : MOCK_PRODUCTS.filter(p => p.category.toLowerCase().includes(activeFilterTab.toLowerCase())).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-poppins selection:bg-watch-gold selection:text-black">
      {/* 1. Header (Navbar matching Reference UI) */}
      <CustomerNavbar />

      <main className="flex-1 pb-16">
        {/* ════════════════════════════════════════════════════════════════
            2. HERO SHOWCASE SECTION (Opulent Midnight Navy Stage)
            ════════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-[#070C14] via-[#09111D] to-[#060A10] text-white relative overflow-hidden px-4 sm:px-8 py-8 sm:py-12 border-b border-white/5">
          {/* Subtle cosmic silk smoke atmosphere glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#D9A441]/10 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            
            {/* ── LEFT COLUMN: 4 Interactive Category Pills ── */}
            <div className="lg:col-span-3 space-y-2.5 sm:space-y-3 order-2 lg:order-1">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = activeHeroTab === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveHeroTab(idx)}
                    className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl transition-all text-left cursor-pointer border ${
                      isActive
                        ? 'bg-black/50 border-[#D9A441] shadow-[0_0_20px_rgba(217,164,65,0.25)]'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="w-12 h-10 sm:w-14 sm:h-11 rounded-xl overflow-hidden bg-black/60 flex-shrink-0 flex items-center justify-center border border-white/10">
                      <img
                        src={slide.thumb}
                        alt={slide.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-[13px] font-bold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {slide.label}
                      </p>
                      {isActive && (
                        <span className="text-[10px] text-watch-gold font-semibold tracking-wider uppercase block mt-0.5">
                          ● Featured View
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── CENTER COLUMN: Hero Headline, Showcase Watch & Controls ── */}
            <div className="lg:col-span-6 flex flex-col md:flex-row items-center justify-between gap-4 order-1 lg:order-2 relative">
              {/* Text Side */}
              <div className="space-y-3 max-w-sm text-center md:text-left z-20">
                <span className="text-[11px] font-bold text-watch-gold tracking-widest uppercase inline-block">
                  {currentSlide.eyebrow}
                </span>

                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] font-serif">
                  <span className="text-white block">{currentSlide.title1}</span>
                  <span className="text-[#D9A441] italic font-serif block mt-0.5">
                    {currentSlide.title2}
                  </span>
                </h2>

                <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                  {currentSlide.subtitle}
                </p>

                <div className="pt-2">
                  <Link
                    to={currentSlide.link}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9A441] to-[#B98332] hover:from-[#E5B04E] hover:to-[#C6903E] text-black font-extrabold text-xs sm:text-sm py-3 px-6 rounded-full shadow-lg hover:shadow-watch-gold/30 transition-all cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                  </Link>
                </div>
              </div>

              {/* Showcase Dual-Tone Watch Centerpiece Image (Seamless cosmic dark stage integration) */}
              <div className="relative flex items-center justify-center">
                <div className="w-60 sm:w-72 lg:w-80 group overflow-hidden rounded-2xl">
                  <img
                    key={currentSlide.id}
                    src={currentSlide.centerImage || heroWatchCenter}
                    alt={currentSlide.label}
                    className="w-full h-72 sm:h-80 object-cover rounded-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-all duration-700 select-none animate-fade-in"
                  />
                </div>

                {/* Left & Right Glass Arrows */}
                <button
                  type="button"
                  onClick={() => setActiveHeroTab((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                  className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHeroTab((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1))}
                  className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Indicator Dots */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHeroTab(i)}
                    className={`h-1.5 transition-all rounded-full ${
                      activeHeroTab === i ? 'w-6 bg-watch-gold' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Glassmorphic Countdown Offer Card ── */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end order-3">
              <div className="w-full max-w-[280px] bg-white/[0.06] backdrop-blur-md border border-white/15 rounded-3xl p-5 text-center text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-watch-gold/10 rounded-full blur-2xl pointer-events-none" />

                <span className="text-xs font-semibold text-gray-300 block">
                  Limited Time Offer
                </span>

                <h3 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-0.5 tracking-tight">
                  <span className="text-[#D9A441]">40%</span> OFF
                </h3>

                <p className="text-[11px] text-gray-400 mb-4">
                  On Selected Premium Brands
                </p>

                {/* 4 Digital Timer Squares (Real live countdown) */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  <div className="bg-black/50 border border-white/10 rounded-xl py-2 px-1">
                    <span className="font-mono text-base font-bold text-white block">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-semibold">Days</span>
                  </div>
                  <div className="bg-black/50 border border-white/10 rounded-xl py-2 px-1">
                    <span className="font-mono text-base font-bold text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-semibold">Hrs</span>
                  </div>
                  <div className="bg-black/50 border border-white/10 rounded-xl py-2 px-1">
                    <span className="font-mono text-base font-bold text-white block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-semibold">Min</span>
                  </div>
                  <div className="bg-black/50 border border-white/10 rounded-xl py-2 px-1">
                    <span className="font-mono text-base font-bold text-watch-gold block">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-semibold">Sec</span>
                  </div>
                </div>

                {/* Solid Gold Grab Offer CTA */}
                <button
                  type="button"
                  onClick={handleGrabOffer}
                  className="w-full bg-gradient-to-r from-[#D9A441] to-[#B98332] hover:from-[#E5B04E] hover:to-[#C6903E] active:scale-[0.98] text-black font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-watch-gold/30 transition-all cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-black" />
                  <span>Grab the Offer →</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. TRUST VALUE STRIP (Exact Match to Reference UI)
            ════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#080E18] border-b border-white/5 py-4 px-4 sm:px-8 text-xs text-gray-300">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-watch-gold/10 border border-watch-gold/30 flex items-center justify-center text-watch-gold flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-[13px]">Free Delivery</p>
                <p className="text-[11px] text-gray-400">On Orders Above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-watch-gold/10 border border-watch-gold/30 flex items-center justify-center text-watch-gold flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-[13px]">100% Original</p>
                <p className="text-[11px] text-gray-400">Genuine Branded Watches</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-watch-gold/10 border border-watch-gold/30 flex items-center justify-center text-watch-gold flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-[13px]">Easy Returns</p>
                <p className="text-[11px] text-gray-400">Within 7 Days</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-watch-gold/10 border border-watch-gold/30 flex items-center justify-center text-watch-gold flex-shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-[13px]">Secure Payments</p>
                <p className="text-[11px] text-gray-400">UPI, Cards, NetBanking & More</p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. SHOP BY POPULAR BRANDS (Exact Match to Reference UI)
            ════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Shop by Popular Brands
            </h3>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-watch-gold flex items-center gap-1 transition-colors"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 11 Authentic Brand Pills Row */}
          <div ref={brandsRowRef} className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-2">
            {POPULAR_BRANDS.map((b) => (
              <Link
                key={b.slug}
                to={`/products?brand=${b.slug}`}
                className="bg-white hover:bg-amber-50/50 border border-gray-200 hover:border-watch-gold rounded-2xl p-2 sm:p-2.5 flex items-center justify-center shadow-xs hover:shadow-md transition-all flex-shrink-0 w-24 sm:w-28 h-12"
                title={`Shop ${b.name} watches`}
              >
                <img
                  src={b.img}
                  alt={b.name}
                  className="max-h-8 max-w-full object-contain"
                />
              </Link>
            ))}

            {/* Circular Next Arrow with smooth scrolling */}
            <button
              type="button"
              onClick={scrollBrandsRight}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-watch-gold hover:bg-watch-gold hover:text-black text-gray-600 flex items-center justify-center flex-shrink-0 transition-all shadow-xs cursor-pointer"
              title="Scroll brands forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5. SHOP BY CATEGORY (8 Photographic Cards from Reference UI)
            ════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h3>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-watch-gold flex items-center gap-1 transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 8 Clean Visual Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORY_CARDS.map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?cat=${cat.cat}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-watch-gold shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Watch Photographic Visual */}
                <div className="h-24 sm:h-28 bg-gray-50 overflow-hidden flex items-center justify-center">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                {/* Footer Label with Arrow */}
                <div className="p-2 sm:p-2.5 flex items-center justify-between bg-white text-gray-900 group-hover:text-watch-gold transition-colors">
                  <span className="text-[11.5px] sm:text-xs font-bold truncate leading-tight">
                    {cat.name}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-watch-gold group-hover:text-black flex items-center justify-center transition-colors flex-shrink-0 ml-1">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            6. FEATURED CATALOG WITH TABS & QUICK-ADD
            ════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Featured Timepieces
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Handpicked Swiss mechanical movements, smart wear & diver chronographs
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-gray-100 p-1 rounded-full text-xs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilterTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeFilterTab === tab
                      ? 'bg-[#0B121C] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const inWish = isInWishlist(p.id);
              const isAdded = addedItem === p.id;
              return (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-watch-gold hover:shadow-xl transition-all flex flex-col justify-between group">
                  {/* Image Container with Badges */}
                  <div className="h-60 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      -{p.discount}% OFF
                    </span>

                    {/* Brand Pill */}
                    <span className="absolute bottom-2 left-3 bg-[#0B121C]/85 backdrop-blur-sm text-watch-gold text-[9.5px] font-black px-2.5 py-0.5 rounded-md border border-watch-gold/30">
                      {p.brand}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleToggleWishlist(p)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all cursor-pointer ${
                        inWish ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                        {p.category}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-watch-gold transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 text-xs">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-0.5" />
                          {p.rating}
                        </span>
                        <span className="text-gray-400 text-[11px]">({p.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-gray-900">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-400 line-through ml-2">
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0B121C] text-white hover:bg-watch-gold hover:text-black'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{isAdded ? 'Added!' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer className="bg-[#070B12] text-gray-300 text-xs py-10 px-4 sm:px-8 border-t border-white/10">
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
              <li><Link to="/products" className="hover:text-watch-gold">All Watches</Link></li>
              <li><Link to="/products?cat=luxury" className="hover:text-watch-gold">Swiss Haute Horlogerie</Link></li>
              <li><Link to="/products?cat=men" className="hover:text-watch-gold">Men's Watches</Link></li>
              <li><Link to="/products?cat=women" className="hover:text-watch-gold">Women's Watches</Link></li>
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
            <p className="text-[11px] text-gray-400 mb-2">Subscribe to receive exclusive drops & festival vouchers.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
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

      {/* Floating Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B121C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-watch-gold/40 flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-watch-gold animate-pulse flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default HomePage;