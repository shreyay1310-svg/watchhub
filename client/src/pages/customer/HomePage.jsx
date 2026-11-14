import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import BrandLogo from '../../components/common/BrandLogo';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { GLOBAL_BRANDS_60, getBrandDescription } from '../../data/brandsData';
import CustomizeAndNewArrivalsSection from '../../components/home/CustomizeAndNewArrivalsSection';
import BestSellersSection from '../../components/home/BestSellersSection';
import CraftsmanshipStoriesSection from '../../components/home/CraftsmanshipStoriesSection';
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Lock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Play,
  RotateCw,
  PenTool,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  Watch,
  Star,
  Eye,
  ShoppingBag,
  Search,
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  // Hero carousel slides: Rolex Submariner Date, Patek Philippe Nautilus, Omega Speedmaster Professional
  const heroSlides = [
    {
      id: 'rolex-submariner',
      brand: 'ROLEX',
      badge: 'SWISS CHRONOMETER',
      exclusiveTag: 'OYSTER PERPETUAL',
      modelCode: 'REF. 126610LN',
      title: 'ROLEX SUBMARINER DATE',
      subtitle: 'Black Dial • Oystersteel • Cerachrom Bezel',
      description:
        'The definitive archetype of the diver’s watch. Crafted in corrosion-resistant Oystersteel with a high-gloss black dial, unidirectional Cerachrom ceramic bezel, Chromalight blue luminescence, and solid Oyster bracelet with Glidelock extension.',
      price: 18999,
      image: '/images/hero/hero_rolex_submariner.jpg',
      availability: 'IN STOCK',
      productId: 'rolex-submariner',
      modelSwitcherLabel: 'ROLEX SUBMARINER DATE',
      themeGlow: 'from-[#052818]/40 via-[#020813] to-[#020813]',
      radialGlow: 'from-[#10b981]/25',
      badgeColor: 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/30',
    },
    {
      id: 'patek-nautilus',
      brand: 'PATEK PHILIPPE',
      badge: 'HAUTE HORLOGERIE',
      exclusiveTag: 'GENEVA ATELIER',
      modelCode: 'REF. 5711/1A-010',
      title: 'PATEK PHILIPPE NAUTILUS 5711',
      subtitle: 'Sunburst Blue Dial • Stainless Steel',
      description:
        'The undisputed holy grail of luxury sports horology. Designed by Gérald Genta, featuring the famous rounded octagonal bezel with lateral hinges, horizontally embossed azure blue dial, and ultra-thin automatic Calibre 26-330 S C.',
      price: 5499000,
      image: '/images/hero/hero_patek_nautilus.jpg',
      availability: 'RESERVED',
      productId: 'patek-nautilus',
      modelSwitcherLabel: 'PATEK PHILIPPE NAUTILUS 5711',
      themeGlow: 'from-[#002B4D]/40 via-[#020813] to-[#020813]',
      radialGlow: 'from-[#00CFFF]/25',
      badgeColor: 'text-[#00CFFF] bg-[#00CFFF]/15 border-[#00CFFF]/30',
    },
    {
      id: 'omega-speedmaster',
      brand: 'OMEGA',
      badge: 'MOONWATCH MASTER',
      exclusiveTag: 'NASA FLIGHT-QUALIFIED',
      modelCode: 'REF. 310.30.42.50.01.001',
      title: 'OMEGA SPEEDMASTER PROFESSIONAL',
      subtitle: 'Tri-Compax Chronograph • Moonwatch',
      description:
        'The legendary manual-wind chronograph worn by Apollo astronauts on the Moon. Stepped black dial with dot-over-ninety anodised aluminium bezel, Hesalite crystal, and Co-Axial Master Chronometer Calibre 3861 with 15,000 gauss magnetic resistance.',
      price: 16499,
      image: '/images/hero/hero_omega_speedmaster.jpg',
      availability: 'IN STOCK',
      productId: 'omega-speedmaster',
      modelSwitcherLabel: 'OMEGA SPEEDMASTER PRO',
      themeGlow: 'from-[#2D0A14]/40 via-[#020813] to-[#020813]',
      radialGlow: 'from-[#E11D48]/25',
      badgeColor: 'text-[#F4B942] bg-[#F4B942]/15 border-[#F4B942]/30',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const currentHero = heroSlides[activeSlide];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Optional Autoplay (strictly disabled by default per user specification)
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoplay, heroSlides.length]);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNextSlide();
    } else if (diff < -50) {
      handlePrevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Luxury Arched Category Pedestals (Matching Reference Screenshot)
  const categoryPedestals = [
    {
      name: 'Men',
      label: "Men's Watches",
      description: "Premium men's analog and chronograph watches.",
      link: '/men',
      image: '/images/hd_categories/cat_men.jpg',
    },
    {
      name: 'Women',
      label: "Women's Watches",
      description: 'Elegant rose-gold, diamond and minimalist watches.',
      link: '/women',
      image: '/images/hd_categories/cat_women.jpg',
    },
    {
      name: 'Kids',
      label: "Kids' Watches",
      description: "Colourful, durable children's watches.",
      link: '/kids',
      image: '/images/hd_categories/cat_kids.jpg',
    },
    {
      name: 'Smartwatches',
      label: 'Smartwatches',
      description: 'Modern touchscreen smartwatches.',
      link: '/smartwatches',
      image: '/images/hd_categories/cat_smartwatches.jpg',
    },
    {
      name: 'Luxury',
      label: 'Luxury Watches',
      description: 'Premium mechanical and automatic watches.',
      link: '/luxury',
      image: '/images/hd_categories/cat_luxury.jpg',
    },
    {
      name: 'Sports',
      label: 'Sports Watches',
      description: 'Rugged sports, diving and chronograph watches.',
      link: '/sports',
      image: '/images/hd_categories/cat_sports.jpg',
    },
    {
      name: 'Limited Edition',
      label: 'Limited Edition',
      description: 'Exclusive skeleton and tourbillon watches.',
      link: '/limited-edition',
      image: '/images/hd_categories/cat_limited_edition.jpg',
    },
  ];


  // Interactive 60+ Global Watch Brands State & Filtering
  const [brandSearch, setBrandSearch] = useState('');
  const [brandCountry, setBrandCountry] = useState('All');
  const [brandSort, setBrandSort] = useState('asc');
  const [showAllBrands, setShowAllBrands] = useState(false);

  const brandCountries = useMemo(() => {
    const list = Array.from(new Set(GLOBAL_BRANDS_60.map((b) => b.country)));
    return ['All', ...list.sort()];
  }, []);

  const filteredHomeBrands = useMemo(() => {
    return GLOBAL_BRANDS_60.filter((b) => {
      if (brandSearch.trim()) {
        const q = brandSearch.toLowerCase().trim();
        if (
          !b.name.toLowerCase().includes(q) &&
          !b.country.toLowerCase().includes(q) &&
          !b.category.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (brandCountry !== 'All' && b.country !== brandCountry) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (brandSort === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
  }, [brandSearch, brandCountry, brandSort]);

  const displayedHomeBrands =
    showAllBrands || brandSearch.trim() || brandCountry !== 'All'
      ? filteredHomeBrands
      : filteredHomeBrands.slice(0, 24);

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#061426] border border-[#00CFFF]/50 text-white px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,207,255,0.3)] flex items-center gap-3 animate-fade-in text-xs font-semibold backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-[#00CFFF] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          1. FULL-SCREEN CINEMATIC LUXURY 3-WATCH CAROUSEL HERO SECTION
          (Rolex Submariner • Patek Philippe Nautilus • Omega Speedmaster)
          ════════════════════════════════════════════════════════════════ */}
      <section
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] flex flex-col justify-between overflow-hidden bg-gradient-to-b ${currentHero.themeGlow} border-b border-white/[0.08] transition-colors duration-700 select-none`}
      >
        {/* Dynamic Ambient Glow matching active watch */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] bg-radial ${currentHero.radialGlow} via-transparent to-transparent pointer-events-none rounded-full blur-3xl transition-all duration-700`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#020813_95%)] pointer-events-none" />

        {/* Top Floating Content Container */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
          
          {/* Hero Left: Exclusive Badges, Title, Description & CTAs */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-extrabold tracking-widest uppercase border px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all ${currentHero.badgeColor}`}>
                {currentHero.exclusiveTag}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#A6B1C8]">
                {currentHero.modelCode}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B942] block mb-1">
                {currentHero.brand}
              </span>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-bold text-white tracking-tight leading-[1.12]">
                {currentHero.title}
              </h2>
              {currentHero.subtitle && (
                <p className="text-xs sm:text-sm font-semibold text-[#00CFFF] mt-1">
                  {currentHero.subtitle}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#A6B1C8] leading-relaxed max-w-md font-light">
              {currentHero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to={`/product/${currentHero.productId}`}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-[#020813] font-black text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(244,185,66,0.35)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer tracking-wider uppercase"
              >
                <span>Shop Collection</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                to="/customize-watch"
                className="py-3 px-5 rounded-xl border border-[#00CFFF]/50 bg-[#00CFFF]/10 hover:bg-[#00CFFF]/25 text-[#00CFFF] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,207,255,0.2)]"
              >
                <span>Customize Now</span>
                <span className="text-[#F4B942]">★</span>
              </Link>
            </div>
          </div>

          {/* Hero Center: Large Individual Uncropped Watch with Left/Right Arrows */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[480px] xl:min-h-[520px]">
            {/* Ambient Radial Pedestal */}
            <div className="absolute inset-0 bg-radial from-[#00CFFF]/20 via-transparent to-transparent blur-2xl rounded-full scale-90 pointer-events-none" />

            {/* Left Carousel Navigation Arrow */}
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous Watch Slide"
              className="absolute left-0 sm:-left-3 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#040C1A]/85 hover:bg-[#00CFFF]/20 border border-white/15 hover:border-[#00CFFF]/70 text-white flex items-center justify-center transition-all shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-[#00CFFF] transition-colors" />
            </button>

            {/* Large Single Watch Image (100% Uncropped with Pedestal) */}
            <Link
              to={`/product/${currentHero.productId}`}
              className="relative z-10 w-full h-[360px] sm:h-[460px] xl:h-[500px] flex items-center justify-center group cursor-pointer"
              title={`View ${currentHero.title} Details`}
            >
              <img
                key={currentHero.id}
                src={currentHero.image}
                alt={currentHero.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] transition-all duration-500 ease-out group-hover:scale-105 select-none animate-fade-in"
                onError={(e) => {
                  e.target.src = '/images/products/featured_rolex_submariner.jpg';
                }}
              />
            </Link>

            {/* Right Carousel Navigation Arrow */}
            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next Watch Slide"
              className="absolute right-0 sm:-right-3 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#040C1A]/85 hover:bg-[#00CFFF]/20 border border-white/15 hover:border-[#00CFFF]/70 text-white flex items-center justify-center transition-all shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer group"
            >
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#00CFFF] transition-colors" />
            </button>
          </div>

          {/* Hero Right: Video Preview Card & Status Badge */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-end space-y-4">
            {/* Availability Indicator */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentHero.availability}</span>
            </div>

            {/* Watchmaking Video Preview Thumbnail Card */}
            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="w-44 bg-[#040C1A] border border-white/10 hover:border-[#00CFFF]/40 rounded-2xl p-2.5 shadow-[0_15px_30px_rgba(0,0,0,0.7)] group cursor-pointer transition-all"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-2">
                <img
                  src="/images/hero/chronoswiss_website_ref.jpg"
                  alt="Watchmaker Atelier"
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#00CFFF] text-black flex items-center justify-center text-xs shadow-[0_0_15px_rgba(0,207,255,0.6)]">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold text-white leading-tight">
                Watchmaking Video Preview
              </p>
              <p className="text-[9px] text-[#A6B1C8] mt-0.5">Atelier Lucerne 4K</p>
            </div>
          </div>
        </div>

        {/* Hero Bottom Carousel Controls (Model Switcher & 3 Indicator Dots) */}
        <div className="relative z-20 border-t border-white/[0.08] bg-[#020813]/85 backdrop-blur-md py-4 px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Left: Model Names Switcher Tabs */}
            <div className="flex items-center gap-4 text-[11px] font-mono tracking-wider overflow-x-auto max-w-full pb-1 sm:pb-0">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                    activeSlide === idx
                      ? 'text-[#00CFFF] font-bold'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeSlide === idx ? 'bg-[#00CFFF]' : 'bg-current'}`} />
                  <span>{slide.modelSwitcherLabel}</span>
                </button>
              ))}
            </div>

            {/* Right: Slide Indicator Dots & Autoplay Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-gray-500">
                0{activeSlide + 1} / 0{heroSlides.length}
              </span>

              {/* 3 Slide Indicator Dots */}
              <div className="flex items-center gap-2">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === idx
                        ? 'w-8 bg-[#00CFFF] shadow-[0_0_12px_rgba(0,207,255,0.7)]'
                        : 'w-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  />
                ))}
              </div>

              {/* Autoplay Play/Pause Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoplay(!isAutoplay)}
                className={`p-1 rounded-md text-[10px] border transition-colors cursor-pointer flex items-center gap-1 ${
                  isAutoplay
                    ? 'border-[#00CFFF]/40 text-[#00CFFF] bg-[#00CFFF]/10'
                    : 'border-white/10 text-gray-400 hover:text-white'
                }`}
                title={isAutoplay ? 'Pause Carousel Autoplay' : 'Enable Carousel Autoplay'}
              >
                <span>{isAutoplay ? '⏸ Autoplay' : '▶ Autoplay'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. TRUST STRIP: 5 SWISS LUXURY GUARANTEES
          (Exact Match to Reference Image 1)
          ════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#030917] border-b border-white/[0.08] py-4 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <div className="flex items-center justify-center gap-2.5 py-1">
            <ShieldCheck className="w-4 h-4 text-[#F4B942]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">100% Authentic</p>
              <p className="text-[10px] text-[#A6B1C8]">Certified Watches</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 py-1">
            <Award className="w-4 h-4 text-[#00CFFF]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Global Warranty</p>
              <p className="text-[10px] text-[#A6B1C8]">Service & Support</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 py-1">
            <Truck className="w-4 h-4 text-[#39F5A5]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Free Shipping</p>
              <p className="text-[10px] text-[#A6B1C8]">On all Orders</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 py-1">
            <RotateCcw className="w-4 h-4 text-[#FF35C8]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Easy Returns</p>
              <p className="text-[10px] text-[#A6B1C8]">7 Days Policy</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 py-1 col-span-2 sm:col-span-1">
            <Lock className="w-4 h-4 text-[#F4B942]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Secure Payments</p>
              <p className="text-[10px] text-[#A6B1C8]">Encrypted & Safe</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 space-y-16 w-full flex-1">
        
        {/* ════════════════════════════════════════════════════════════════
            3. SHOP BY CATEGORY: LUXURY ARCHED PEDESTALS
            (Exact Match to Reference Image 1)
            ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
                CURATED SELECTIONS
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Shop by Category
              </h3>
            </div>
            <Link
              to="/categories"
              className="text-xs font-bold text-[#00CFFF] hover:underline flex items-center gap-1"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 7 Arched Pedestal Cards Grid (Exact Match to User Reference Screenshot) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
            {categoryPedestals.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-[#040C1A] border border-[#00CFFF]/20 hover:border-[#00CFFF]/70 hover:shadow-[0_0_25px_rgba(0,207,255,0.25)] flex flex-col items-center justify-between text-center transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer"
                title={`${cat.name} — ${cat.description}`}
              >
                {/* Arched image container */}
                <div className="w-full aspect-[4/5] rounded-xl sm:rounded-2xl bg-[#020813] border border-white/5 p-2 flex items-center justify-center overflow-hidden relative mb-2.5">
                  <div className="absolute inset-0 bg-radial from-[#00CFFF]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-contain object-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#00CFFF] transition-colors tracking-wide">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. TWO FEATURED SPOTLIGHT CARDS
            (Customize Your Watch & 3-Watch New Arrivals Carousel)
            ════════════════════════════════════════════════════════════════ */}
        <CustomizeAndNewArrivalsSection />

        {/* ════════════════════════════════════════════════════════════════
            5. BEST SELLERS TIMEPIECES ROW
            (Rolex, Omega, TAG Heuer, Seiko, Tissot - HD Reference Match)
            ════════════════════════════════════════════════════════════════ */}
        <BestSellersSection onToast={showToast} />

        {/* ════════════════════════════════════════════════════════════════
            6. EDITORIAL SECTIONS (Craftsmanship, Heritage & Inspiring Stories)
            (Exact Match to WatchHub Swiss Horology Reference Image)
            ════════════════════════════════════════════════════════════════ */}
        <section className="pt-6 border-t border-white/10">
          <CraftsmanshipStoriesSection />
        </section>

        {/* ════════════════════════════════════════════════════════════════
            7. GLOBAL WATCH BRANDS SHOWCASE (60+ BRANDS WITH ORIGINAL LOGOS)
            (Rolex, Omega, Chronoswiss, Patek, Audemars, Cartier, etc.)
            ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
                WORLD CLASS HOROLOGY DIRECTORY
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Global Watch Brands ({GLOBAL_BRANDS_60.length}+ Iconic Houses)
              </h3>
              <p className="text-xs text-[#A6B1C8] mt-0.5">
                Explore authentic manufacture ateliers across Switzerland, Japan, Germany, India, and the UK.
              </p>
            </div>
            <Link
              to="/brands"
              className="text-xs font-bold text-[#00CFFF] hover:underline flex items-center gap-1.5 bg-[#00CFFF]/10 border border-[#00CFFF]/30 px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <span>Explore All {GLOBAL_BRANDS_60.length}+ Brands</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Search, Country Filter, and Sort Controls */}
          <div className="bg-[#040C1A] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search 60+ brands (Rolex, Omega, Casio, Titan, etc.)..."
                className="w-full bg-[#020813] border border-white/10 rounded-xl pl-9 pr-7 py-2 text-white placeholder-slate-500 outline-none focus:border-[#00CFFF]"
              />
              {brandSearch && (
                <button
                  type="button"
                  onClick={() => setBrandSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Country Pills / Select */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold text-[11px] hidden sm:inline">Country:</span>
              <select
                value={brandCountry}
                onChange={(e) => setBrandCountry(e.target.value)}
                className="bg-[#020813] border border-white/10 rounded-xl px-3 py-2 text-white outline-none cursor-pointer focus:border-[#00CFFF] text-xs"
              >
                {brandCountries.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? '🌐 All Countries' : c}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setBrandSort(brandSort === 'asc' ? 'desc' : 'asc')}
                className="bg-[#020813] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-white flex items-center gap-1 cursor-pointer"
                title="Alphabetical Sorting"
              >
                <span>{brandSort === 'asc' ? 'A → Z' : 'Z → A'}</span>
              </button>
            </div>
          </div>

          {/* 8 Cards Per Row Grid on Large Screens (PART 6 Specification) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-3">
            {displayedHomeBrands.map((b) => (
              <div
                key={b.id}
                className="group relative bg-[#040C1A] border border-white/10 hover:border-[#F4B942]/60 rounded-2xl p-3 flex flex-col justify-between text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,185,66,0.25)] hover:-translate-y-1 select-none overflow-hidden"
              >
                {/* Corner Official Website Link (PART 5) */}
                <a
                  href={b.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={`Open official ${b.name} website (${b.website})`}
                  className="absolute top-2 right-2 text-slate-500 hover:text-[#F4B942] z-10 p-0.5 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Clickable Brand Area linking to /brands/:slug (PART 4) */}
                <Link
                  to={`/brands/${b.id}`}
                  className="w-full flex flex-col items-center flex-1 cursor-pointer"
                >
                  {/* Authentic Brand Logo in Clean Luxury Pedestal (PART 3) */}
                  <div className="w-full h-14 rounded-xl bg-white/95 border border-white/15 p-1.5 flex items-center justify-center mb-2 shadow-inner group-hover:bg-white transition-colors">
                    <BrandLogo logoType={b.logoType} brandName={b.name} />
                  </div>

                  {/* Brand Name */}
                  <h4 className="text-xs font-bold text-white group-hover:text-[#F4B942] transition-colors truncate w-full">
                    {b.name}
                  </h4>

                  {/* Country Badge */}
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <span>{b.flag}</span>
                    <span className="truncate">{b.country}</span>
                  </div>

                  {/* Short Brand Description (PART 2) */}
                  <p className="text-[9.5px] text-slate-400 font-light line-clamp-2 mt-1 leading-snug min-h-[24px]">
                    {getBrandDescription(b)}
                  </p>

                  {/* Shop Brand Link with Small Arrow (PART 2) */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 w-full flex items-center justify-center gap-1 text-[10.5px] font-bold text-[#00CFFF] group-hover:text-[#F4B942] transition-colors">
                    <span>Shop Brand</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Toggle View All / Load More Button */}
          {!brandSearch && brandCountry === 'All' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00CFFF]/20 to-[#1265FF]/20 hover:from-[#00CFFF]/30 hover:to-[#1265FF]/30 border border-[#00CFFF]/40 text-[#00CFFF] font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {showAllBrands
                  ? 'Show Less Brands'
                  : `View All ${GLOBAL_BRANDS_60.length}+ International Brands`}
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Atelier Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#050D1A] rounded-3xl max-w-2xl w-full p-6 border border-[#00CFFF]/40 shadow-[0_0_50px_rgba(0,207,255,0.3)] relative animate-scale-up text-white">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-serif font-bold mb-1">
              Atelier Lucerne: Handcrafting the Flying Tourbillon
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Watch master watchmakers calibrate hairsprings and engrave guilloché wave patterns.
            </p>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center relative">
              <img
                src="/images/hero/chronoswiss_website_ref.jpg"
                alt="Watchmaker Atelier"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#00CFFF] text-black flex items-center justify-center text-xl shadow-[0_0_30px_rgba(0,207,255,0.6)] animate-pulse">
                  ▶
                </div>
                <span className="text-xs font-bold tracking-widest uppercase bg-black/70 px-3 py-1 rounded-full border border-white/20">
                  4K Horology Documentary • 03:45
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
