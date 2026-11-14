import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { GLOBAL_BRANDS_60 } from '../../data/brandsData';
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
  ShoppingBag
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  // Hero carousel slides based on Chronoswiss collection
  const heroSlides = [
    {
      id: 'tourbillon',
      badge: 'LIMITED TO 15 PIECES',
      exclusiveTag: 'CHRONOSWISS EXCLUSIVE',
      modelCode: 'CH-3123-PABL',
      title: 'OPEN GEAR FLYING TOURBILLON PARAIBA',
      description:
        'A masterpiece of precision, engineering and timeless design. The world’s first 3-D regulator with an inverted flying tourbillon cage floating over hand-guilloched Paraiba waves.',
      price: 3450000,
      image: '/images/hero/chronoswiss_tourbillon.jpg',
      availability: 'AVAILABLE',
      productId: 'chronoswiss-tourbillon',
      modelSwitcherLabel: 'OPEN GEAR FLYING TOURBILLON',
    },
    {
      id: 'opus',
      badge: 'LIMITED TO 50 PIECES',
      exclusiveTag: 'MANUFACTURE SKELETON',
      modelCode: 'CH-7543T-BK',
      title: 'OPUS CHRONOGRAPH TITANIUM',
      description:
        'The historic pioneer of modern skeletonized automatic chronographs. Ultra-light Grade 5 titanium case housing the hand-chamfered Calibre C.741S with exposed column wheel.',
      price: 1450000,
      image: '/images/hero/chronograph_black.jpg',
      availability: 'IN STOCK',
      productId: 'chronoswiss-opus-chronograph',
      modelSwitcherLabel: 'OPUS CHRONOGRAPH TITANIUM',
    },
    {
      id: 'spacetimer',
      badge: 'ASTRONOMICAL COMPLICATION',
      exclusiveTag: 'METEORITE DIAL',
      modelCode: 'CH-9343-ME',
      title: 'SPACE TIMER JUPITER',
      description:
        'Displaying astronomical moon phases with a translucent titanium dial and hand-polished floating hour rings inspired by celestial mechanics.',
      price: 1850000,
      image: '/images/products/featured_patek_nautilus.jpg',
      availability: 'RESERVED',
      productId: 'patek-nautilus',
      modelSwitcherLabel: 'SPACE TIMER JUPITER',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const currentHero = heroSlides[activeSlide];

  // Auto rotate hero every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Luxury Arched Category Pedestals (Matching Reference Image 1)
  const categoryPedestals = [
    { name: 'Men', label: "Men's Watches", link: '/products?gender=Men', image: '/images/products/featured_rolex_submariner.jpg' },
    { name: 'Women', label: "Women's Watches", link: '/products?gender=Women', image: '/images/products/featured_cartier_tank.jpg' },
    { name: 'Kids', label: "Kids' Watches", link: '/products?gender=Kids', image: '/images/hd_categories/cat_kids.jpg' },
    { name: 'Smartwatches', label: 'Smartwatches', link: '/products?category=Smartwatches', image: '/images/products/featured_apple_watch.jpg' },
    { name: 'Luxury', label: 'Luxury Watches', link: '/products?category=Luxury', image: '/images/products/featured_rolex_daytona.jpg' },
    { name: 'Sports', label: 'Sports Watches', link: '/products?category=Sports', image: '/images/products/featured_omega_seamaster.jpg' },
    { name: 'Limited Edition', label: 'Limited Edition', link: '/products?tag=limited', image: '/images/hero/chronoswiss_tourbillon.jpg' },
  ];

  // Best Sellers (From Reference Image 1)
  const bestSellers = [
    {
      id: 'rolex-submariner',
      name: 'Rolex Submariner',
      category: 'Automatic • 41mm',
      price: 980000,
      rating: 4.8,
      reviewsCount: 320,
      image: '/images/products/featured_rolex_submariner.jpg',
      brand: 'Rolex',
    },
    {
      id: 'omega-speedmaster',
      name: 'Omega Speedmaster',
      category: 'Chronograph • 42mm',
      price: 725000,
      rating: 4.7,
      reviewsCount: 189,
      image: '/images/products/featured_omega_speedmaster.jpg',
      brand: 'Omega',
    },
    {
      id: 'tag-carrera',
      name: 'TAG Heuer Carrera',
      category: 'Automatic • 39mm',
      price: 490000,
      rating: 4.6,
      reviewsCount: 142,
      image: '/images/products/breitling_pilot.jpg',
      brand: 'TAG Heuer',
    },
    {
      id: 'seiko-prospex',
      name: 'Seiko Prospex',
      category: 'Diver • 44mm',
      price: 185000,
      rating: 4.5,
      reviewsCount: 276,
      image: '/images/products/seiko_diver_waterproof.jpg',
      brand: 'Seiko',
    },
    {
      id: 'tissot-prx',
      name: 'Tissot PRX',
      category: 'Quartz • 40mm',
      price: 42500,
      rating: 4.6,
      reviewsCount: 511,
      image: '/images/products/tissot_prx.jpg',
      brand: 'Tissot',
    },
  ];

  // Top 16 Global Brands Showcase
  const topBrands = GLOBAL_BRANDS_60.slice(0, 16);

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
          1. FULL-SCREEN CINEMATIC SWISS LUXURY HERO SECTION
          (Exact 1:1 Match to Chronoswiss & Reference Image 1)
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[640px] sm:min-h-[720px] lg:min-h-[800px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#020813] via-[#051022] to-[#020813] border-b border-white/[0.08]">
        
        {/* Electric Blue Lighting Curve & Vignette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] bg-radial from-[#00CFFF]/20 via-[#0051B3]/10 to-transparent pointer-events-none rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#020813_95%)] pointer-events-none" />

        {/* Top Floating Content Container */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
          
          {/* Hero Left: Exclusive Badges, Title, Description & CTAs */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#00CFFF] bg-[#00CFFF]/15 border border-[#00CFFF]/30 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,207,255,0.25)]">
                {currentHero.exclusiveTag}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#A6B1C8]">
                {currentHero.modelCode}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]">
              {currentHero.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#A6B1C8] leading-relaxed max-w-md font-light">
              {currentHero.description}
            </p>

            {/* CTAs matching Chronoswiss & Reference Image 1 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
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

          {/* Hero Center: Enormous Uncropped Chronoswiss Watch with Blue Light Glow */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[480px]">
            {/* Ambient Cyan Radial Pedestal */}
            <div className="absolute inset-0 bg-radial from-[#00CFFF]/25 via-transparent to-transparent blur-2xl rounded-full scale-90 pointer-events-none" />

            <Link
              to={`/product/${currentHero.productId}`}
              className="relative z-10 w-full h-[360px] sm:h-[460px] flex items-center justify-center group cursor-pointer"
            >
              <img
                src={currentHero.image}
                alt={currentHero.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105 select-none"
              />
            </Link>
          </div>

          {/* Hero Right: Atelier Video Preview Card & Status Badge */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-end space-y-4">
            {/* Availability Indicator */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-semibold text-emerald-400">
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

        {/* Hero Bottom Carousel Model Switcher (Chronoswiss Navigation Style) */}
        <div className="relative z-20 border-t border-white/[0.08] bg-[#020813]/80 backdrop-blur-md py-4 px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Left Model Switcher */}
            <div className="flex items-center gap-4 text-[11px] font-mono tracking-wider">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all flex items-center gap-2 cursor-pointer ${
                    activeSlide === idx
                      ? 'text-[#00CFFF] font-bold'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{slide.modelSwitcherLabel}</span>
                </button>
              ))}
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-6 bg-[#00CFFF]' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
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

          {/* 7 Arched Pedestal Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {categoryPedestals.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group p-3 rounded-3xl bg-[#040C1A] border border-white/10 hover:border-[#00CFFF]/50 hover:shadow-[0_0_25px_rgba(0,207,255,0.2)] flex flex-col items-center justify-between text-center transition-all duration-300"
              >
                {/* Arched image container */}
                <div className="w-full aspect-[4/5] rounded-2xl bg-[#020813] border border-white/5 p-2 flex items-center justify-center overflow-hidden relative mb-2">
                  <div className="absolute inset-0 bg-radial from-[#00CFFF]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#00CFFF] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. TWO FEATURED SPOTLIGHT CARDS
            (Customize Your Watch + New Arrivals from Image 1)
            ════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Spotlight 1: Customize Your Watch Studio (lg:col-span-7) */}
          <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#061426] via-[#040C1A] to-[#020813] border border-[#00CFFF]/30 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.7)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#00CFFF]/15 via-transparent to-transparent pointer-events-none blur-3xl" />
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-extrabold text-[#00CFFF] tracking-widest uppercase bg-[#00CFFF]/15 border border-[#00CFFF]/30 px-3 py-0.5 rounded-full inline-block">
                3D CONFIGURATOR STUDIO
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Customize Your Watch
              </h3>
              <p className="text-xs text-[#A6B1C8] max-w-md">
                Design your own unique timepiece with premium dial guilloché, case materials, hand-stitched alligator straps, and personalized laser engravings.
              </p>
            </div>

            {/* Exploded Parts Visualization */}
            <div className="my-6 py-4 flex items-center justify-around gap-2 text-center text-[10.5px] text-[#A6B1C8] border-y border-white/5 relative z-10">
              <div className="flex flex-col items-center gap-1 group/part">
                <span className="text-2xl group-hover/part:scale-125 transition-transform">⭕</span>
                <span className="font-semibold text-white">Dial</span>
              </div>
              <span className="text-gray-600">→</span>
              <div className="flex flex-col items-center gap-1 group/part">
                <span className="text-2xl group-hover/part:scale-125 transition-transform">🛡️</span>
                <span className="font-semibold text-white">Case</span>
              </div>
              <span className="text-gray-600">→</span>
              <div className="flex flex-col items-center gap-1 group/part">
                <span className="text-2xl group-hover/part:scale-125 transition-transform">🏷️</span>
                <span className="font-semibold text-white">Strap</span>
              </div>
              <span className="text-gray-600">→</span>
              <div className="flex flex-col items-center gap-1 group/part">
                <span className="text-2xl group-hover/part:scale-125 transition-transform">✍️</span>
                <span className="font-semibold text-white">Engraving</span>
              </div>
            </div>

            <div className="relative z-10">
              <Link
                to="/customize-watch"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-[0_0_20px_rgba(244,185,66,0.3)] hover:brightness-110 transition-all cursor-pointer"
              >
                <span>Start Customizing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Spotlight 2: New Arrivals Showcase (lg:col-span-5) */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#10243C] to-[#040C1A] border border-white/10 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.7)] relative overflow-hidden group">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-[#F4B942] tracking-widest uppercase bg-[#F4B942]/15 border border-[#F4B942]/30 px-3 py-0.5 rounded-full inline-block">
                LATEST RELEASES
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">
                New Arrivals
              </h3>
              <p className="text-xs text-[#A6B1C8]">
                The latest timepieces from the world’s top horological manufactures.
              </p>
            </div>

            <div className="my-4 h-44 flex items-center justify-center">
              <img
                src="/images/hero/chronograph_black.jpg"
                alt="New Arrival Chronograph"
                className="h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div>
              <Link
                to="/products?tag=new"
                className="py-3 px-6 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 transition-all"
              >
                <span>Explore Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5. BEST SELLERS TIMEPIECES ROW
            (Rolex, Omega, TAG Heuer, Seiko, Tissot from Image 1)
            ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
                MOST COVETED
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Best Sellers
              </h3>
            </div>
            <Link
              to="/products?tag=bestseller"
              className="text-xs font-bold text-[#00CFFF] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bestSellers.map((item) => (
              <div
                key={item.id}
                className="bg-[#040C1A] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-[#00CFFF]/40 hover:shadow-[0_0_20px_rgba(0,207,255,0.2)] transition-all group"
              >
                {/* Top image container */}
                <div
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="w-full h-44 rounded-xl bg-[#020813] border border-white/5 p-2 flex items-center justify-center cursor-pointer overflow-hidden relative mb-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-xs transition-colors ${
                      isInWishlist(item.id) ? 'text-[#FF35C8]' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">♥</span>
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h4
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="text-xs font-bold text-white group-hover:text-[#00CFFF] transition-colors truncate cursor-pointer"
                  >
                    {item.name}
                  </h4>
                  <p className="text-[10.5px] text-[#A6B1C8]">{item.category}</p>
                  <div className="flex items-center gap-1 text-[11px] text-[#F4B942]">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold">{item.rating}</span>
                    <span className="text-gray-500">({item.reviewsCount})</span>
                  </div>
                </div>

                {/* Price and Cart Button */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                  <span className="font-mono font-bold text-sm text-white">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(item, 1);
                      showToast(`✨ ${item.name} added to shopping bag!`);
                    }}
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#F4B942] hover:text-black text-[#F4B942] border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            6. EDITORIAL SECTIONS (Craftsmanship, Heritage, Watchmaking Stories)
            (Exact Match to Chronoswiss Reference Image 2)
            ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
              SWISS HOROLOGY EXCELLENCE
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Craftsmanship, Heritage & Stories
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card A: Craftsmanship */}
            <div className="rounded-3xl bg-[#040C1A] border border-white/10 p-6 space-y-4 hover:border-[#00CFFF]/40 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black relative">
                  <img
                    src="/images/hero/chronoswiss_website_ref.jpg"
                    alt="Master Watchmaker with Loupe"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <span className="absolute top-3 left-3 bg-black/70 text-[#00CFFF] text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border border-[#00CFFF]/30">
                    CRAFTSMANSHIP
                  </span>
                </div>
                <h4 className="text-base font-serif font-bold text-white">
                  The Hand of the Master Watchmaker
                </h4>
                <p className="text-xs text-[#A6B1C8] leading-relaxed">
                  Every tourbillon escapement and regulator bridge is chamfered, mirror-polished, and calibrated under optical magnification in our Lucerne ateliers.
                </p>
              </div>
              <Link
                to="/stories"
                className="text-xs font-bold text-[#00CFFF] hover:underline flex items-center gap-1 pt-2"
              >
                <span>Read Craftsmanship Story</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card B: Heritage */}
            <div className="rounded-3xl bg-[#040C1A] border border-white/10 p-6 space-y-4 hover:border-[#F4B942]/40 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black relative">
                  <img
                    src="/images/hero/chronoswiss_tourbillon.jpg"
                    alt="Tourbillon Mechanical Movement"
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-black/70 text-[#F4B942] text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border border-[#F4B942]/30">
                    HERITAGE
                  </span>
                </div>
                <h4 className="text-base font-serif font-bold text-white">
                  The Historic Regulator Legacy
                </h4>
                <p className="text-xs text-[#A6B1C8] leading-relaxed">
                  From 18th-century observatory wall clocks to revolutionary modern wrist regulators, explore the heritage of non-overlapping dial architecture.
                </p>
              </div>
              <Link
                to="/stories"
                className="text-xs font-bold text-[#F4B942] hover:underline flex items-center gap-1 pt-2"
              >
                <span>Explore Atelier History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card C: Watchmaking Stories */}
            <div className="rounded-3xl bg-[#040C1A] border border-white/10 p-6 space-y-4 hover:border-[#39F5A5]/40 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black relative">
                  <img
                    src="/images/hero/chronoswiss_website_ref.jpg"
                    alt="Watchmaker Journal and Sketches"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <span className="absolute top-3 left-3 bg-black/70 text-[#39F5A5] text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border border-[#39F5A5]/30">
                    WATCHMAKING STORIES
                  </span>
                </div>
                <h4 className="text-base font-serif font-bold text-white">
                  Architectural Sketches & Journals
                </h4>
                <p className="text-xs text-[#A6B1C8] leading-relaxed">
                  Handwritten horologist notes and geometric blueprints detailing the calculations behind inverted balance wheels and Paraiba color science.
                </p>
              </div>
              <Link
                to="/stories"
                className="text-xs font-bold text-[#39F5A5] hover:underline flex items-center gap-1 pt-2"
              >
                <span>Read Collector's Journal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            7. GLOBAL WATCH BRANDS SHOWCASE (60+ BRANDS)
            (Rolex, Omega, Chronoswiss, Patek, Audemars, Cartier, etc.)
            ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
                WORLD CLASS HOROLOGY
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Global Watch Brands
              </h3>
            </div>
            <Link
              to="/brands"
              className="text-xs font-bold text-[#00CFFF] hover:underline flex items-center gap-1"
            >
              <span>Explore All 60+ Brands</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {topBrands.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-[#040C1A] border border-white/10 hover:border-[#F4B942]/50 flex flex-col items-center justify-between text-center transition-all group"
              >
                <span className="text-lg mb-1">{b.flag || '🇨🇭'}</span>
                <Link
                  to={`/products?brand=${encodeURIComponent(b.name)}`}
                  className="text-xs font-bold text-white group-hover:text-[#F4B942] transition-colors truncate w-full"
                >
                  {b.name}
                </Link>
                <p className="text-[9px] text-[#A6B1C8] mt-0.5">Est. {b.founded}</p>
                <div className="mt-2 pt-2 border-t border-white/5 w-full flex items-center justify-between text-[10px]">
                  <Link
                    to={`/products?brand=${encodeURIComponent(b.name)}`}
                    className="text-[#00CFFF] hover:underline"
                  >
                    Shop
                  </Link>
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white"
                    title={`Official ${b.name} website`}
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
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
