import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { MOCK_PRODUCTS, brandLinks } from '../../data/mockProducts';
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
  Zap,
  Clock,
} from 'lucide-react';

// Banners cropped from user reference design
import bannerWaterproof from '../../assets/images/banners/banner-waterproof.jpg';
import bannerLuxury from '../../assets/images/banners/banner-luxury.jpg';
import bannerSmart from '../../assets/images/banners/banner-smartwatches.jpg';
import bannerCouples from '../../assets/images/banners/banner-couples.jpg';

// Cropped Brand & Category Assets (Exact 1:1 match to reference design)
import heroWatchCenter from '../../assets/images/ref_crops/hero-watch-center.jpg';

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
  const [currentBanner, setCurrentBanner] = useState(2); // 2: Smartwatches active by default matching Image 2
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [addedItem, setAddedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const brandsRowRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollBrandsLeft = () => {
    if (brandsRowRef.current) {
      brandsRowRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollBrandsRight = () => {
    if (brandsRowRef.current) {
      brandsRowRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Live Countdown Timer (matching "02d : 14h : 36m : 20s")
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

  // 5 Moveable Reference Banner Slides (Matching Image 2 exact UI)
  const BANNER_SLIDES = [
    {
      id: 'luxury',
      label: 'Luxury Collection',
      icon: '💎',
      title: 'Premium Luxury Watches',
      subtitle: 'Timeless Craftsmanship, Modern Elegance.',
      img: bannerLuxury,
      link: '/products?cat=luxury',
      accent: '#D9A441',
    },
    {
      id: 'waterproof',
      label: 'Waterproof',
      icon: '💧',
      title: 'Waterproof Watches',
      subtitle: 'Built for Adventure, Ready for Every Challenge.',
      img: bannerWaterproof,
      link: '/products?cat=waterproof',
      accent: '#38BDF8',
    },
    {
      id: 'smartwatches',
      label: 'Smartwatches',
      icon: '⌚',
      title: 'Smarter on Your Wrist',
      subtitle: 'Health Tracking • Fitness Modes • Bluetooth Calling • Long Battery Life',
      img: bannerSmart,
      link: '/products?cat=smartwatches',
      accent: '#A855F7',
    },
    {
      id: 'couples',
      label: 'Couple Collection',
      icon: '❤️',
      title: 'Perfect Time Together',
      subtitle: 'Matching Watches for Every Special Bond.',
      img: bannerCouples,
      link: '/products?cat=combo',
      accent: '#F43F5E',
    },
    {
      id: 'new_arrivals',
      label: 'New Arrivals',
      icon: '⭐',
      title: '2026 Vault Arrivals',
      subtitle: 'Exclusive New Editions Just Landed.',
      img: bannerLuxury,
      link: '/products?tag=new',
      accent: '#10B981',
    },
  ];

  // Auto-slide every 4.5 seconds unless user is hovering or dragging
  useEffect(() => {
    if (isHovered || isDragging) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, isDragging, BANNER_SLIDES.length]);

  const handlePrevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? BANNER_SLIDES.length - 1 : prev - 1));
  };

  const handleNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  // Touch & Mouse Drag / Swipe Handlers for physical moveable feel
  const handleDragStart = (clientX) => {
    setTouchStartX(clientX);
    setTouchEndX(clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    setTouchEndX(clientX);
    setDragOffset(clientX - touchStartX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = touchEndX - touchStartX;
    if (diff > 45) {
      handlePrevBanner();
    } else if (diff < -45) {
      handleNextBanner();
    }
    setDragOffset(0);
  };

  const handleSlideClick = (slide) => {
    // If it was just a click and not a drag swipe
    if (Math.abs(touchEndX - touchStartX) < 12) {
      showToast(`✨ Opening ${slide.title}...`);
      navigate(slide.link);
    }
  };

  // Popular Brands Matching Image 2
  const POPULAR_BRANDS = [
    { name: 'Rolex', img: brandRolex, slug: 'rolex' },
    { name: 'Omega', img: brandOmega, slug: 'omega' },
    { name: 'Tissot', img: brandTissot, slug: 'tissot' },
    { name: 'Fossil', img: brandFossil, slug: 'fossil' },
    { name: 'Seiko', img: brandSeiko, slug: 'seiko' },
    { name: 'Casio', img: brandCasio, slug: 'casio' },
    { name: 'Citizen', img: brandCitizen, slug: 'citizen' },
    { name: 'Titan', img: brandTitan, slug: 'titan' },
    { name: 'Timex', img: brandTimex, slug: 'timex' },
    { name: 'Fastrack', img: brandFastrack, slug: 'fastrack' },
    { name: 'Poise', img: brandPoise, slug: 'poise' },
  ];

  // 8 Category Visual Cards from Reference UI
  const CATEGORY_CARDS = [
    { name: "Men's Watches", img: '/images/hd_categories/cat_men.jpg', cat: 'men', icon: '👔', styles: '1,240+ Styles', desc: 'Chronos, Automatics & Steel' },
    { name: "Women's Watches", img: '/images/hd_categories/cat_women.jpg', cat: 'women', icon: '🌸', styles: '980+ Styles', desc: 'Rose Gold, Diamond & Chic' },
    { name: 'Smartwatches', img: '/images/hd_categories/cat_smartwatches.jpg', cat: 'smartwatches', icon: '⌚', styles: '650+ Styles', desc: 'AMOLED, BT Calling & Health', active: true },
    { name: 'Sports Watches', img: '/images/hd_categories/cat_sports.jpg', cat: 'sports', icon: '🏃', styles: '720+ Styles', desc: 'Rugged Shock-Proof & Outdoor' },
    { name: 'Luxury Watches', img: '/images/hd_categories/cat_luxury.jpg', cat: 'luxury', icon: '👑', styles: '410+ Styles', desc: 'Certified Swiss Haute Horlogerie' },
    { name: 'Party Wear', img: '/images/hd_categories/cat_party.jpg', cat: 'partywear', icon: '🥂', styles: '360+ Styles', desc: 'Cocktail & Evening Statements' },
    { name: 'Waterproof', img: '/images/hd_categories/cat_waterproof.jpg', cat: 'waterproof', icon: '💧', styles: '540+ Styles', desc: '100M-300M Deep Diver Grade' },
    { name: 'Combo Offers', img: '/images/hd_categories/cat_combo.jpg', cat: 'combo', icon: '💑', styles: '320+ Styles', desc: 'Synchronized Twin Couple Sets' },
  ];

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
    : MOCK_PRODUCTS.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const tab = activeFilterTab.toLowerCase();
        if (tab === 'waterproof') {
          return cat.includes('waterproof') || (p.waterproof && (p.waterproof.includes('200M') || p.waterproof.includes('300M') || p.waterproof.includes('Diver')));
        }
        if (tab === 'digital') {
          return cat.includes('digital') || name.includes('digital') || name.includes('g-shock') || name.includes('a168');
        }
        if (tab === 'smartwatches') {
          return cat.includes('smartwatch') || name.includes('smartwatch') || name.includes('apple watch') || name.includes('galaxy watch');
        }
        if (tab === 'combo') {
          return cat.includes('combo') || cat.includes('couple') || name.includes('pair') || name.includes('twin') || name.includes('bandhan');
        }
        if (tab === 'luxury') {
          return cat.includes('luxury') || ['rolex', 'omega', 'patek', 'audemars', 'cartier', 'breitling', 'rado'].includes(brand);
        }
        return cat.includes(tab);
      }).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-poppins selection:bg-watch-gold selection:text-black">
      {/* 1. Header (Navbar matching Reference UI) */}
      <CustomerNavbar />

      <main className="flex-1 pb-16">
        {/* ════════════════════════════════════════════════════════════════
            2. MOVEABLE 4-SLIDE HERO BANNER CAROUSEL
            ════════════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-[#070C14] via-[#09111D] to-[#060A10] text-white relative px-3 sm:px-6 lg:px-8 py-5 sm:py-8 border-b border-white/5">
          {/* Subtle cosmic silk smoke atmosphere glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#D9A441]/10 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* ── THE 4-SLIDE MOVEABLE STAGE ── */}
            <div
              className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 bg-[#070B12] select-none cursor-grab active:cursor-grabbing group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                handleDragEnd();
              }}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
            >
              {/* Horizontal Moveable Track */}
              <div
                className="flex"
                style={{
                  transform: `translateX(calc(-${currentBanner * 100}% + ${dragOffset}px))`,
                  transition: isDragging ? 'none' : 'transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {BANNER_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    onClick={() => handleSlideClick(slide)}
                    className="w-full flex-shrink-0 relative aspect-[1020/338] min-h-[160px] sm:min-h-[240px] md:min-h-[300px] lg:min-h-[360px] cursor-pointer"
                  >
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700"
                    />

                    {/* Gradient overlay at bottom for controls legibility */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevBanner();
                }}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextBanner();
                }}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer z-30"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Bottom Indicator Dots (Moveable Pagination) */}
              <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                {BANNER_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentBanner(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentBanner === idx
                        ? 'w-7 sm:w-8 bg-[#D9A441] shadow-[0_0_12px_rgba(217,164,65,0.8)]'
                        : 'w-2 bg-white/40 hover:bg-white/80'
                    }`}
                    title={`Slide ${idx + 1}: ${slide.label}`}
                  />
                ))}
              </div>
            </div>

            {/* ── 5 QUICK-SELECT INTERACTIVE CATEGORY CHIPS (Exact Match to Image 2) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mt-4">
              {BANNER_SLIDES.map((slide, idx) => {
                const isActive = currentBanner === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentBanner(idx)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl border text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0E1520] border-[#D9A441] shadow-[0_0_15px_rgba(217,164,65,0.4)] text-white ring-1 ring-[#D9A441]'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <span className="text-sm">{slide.icon}</span>
                    <span className="truncate">{slide.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── FESTIVAL 40% OFF COUNTDOWN FLASH OFFER STRIP (Exact Match to Image 2) ── */}
            <div className="mt-4 bg-gradient-to-r from-amber-500/10 via-[#D9A441]/15 to-amber-500/10 border border-[#D9A441]/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-white backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9A441] to-[#B98332] text-black flex items-center justify-center font-black flex-shrink-0 shadow-md">
                  <Zap className="w-5 h-5 fill-black text-black" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>Limited Time Festival Flash Offer</span>
                    <span className="text-[10px] bg-red-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                      40% OFF
                    </span>
                  </h4>
                  <p className="text-[11.5px] text-gray-300 mt-0.5">
                    Get Flat 40% OFF on luxury & sports brands. Use code: <strong className="text-[#D9A441] font-mono font-bold">WATCHHUB40</strong>
                  </p>
                </div>
              </div>

              {/* Timer & CTA */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span className="text-gray-300 text-[11px] font-sans font-medium">Ends in:</span>
                  <span className="text-[#D9A441]">{String(timeLeft.days).padStart(2, '0')}d</span> :
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                  <span className="text-red-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
                <button
                  type="button"
                  onClick={handleGrabOffer}
                  className="bg-gradient-to-r from-[#D9A441] to-[#B98332] hover:from-[#E5B04E] hover:to-[#C6903E] active:scale-[0.98] text-black font-extrabold text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-watch-gold/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Grab 40% OFF →</span>
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
            4. SHOP BY POPULAR BRANDS (Exact Match to Image 2 Reference UI)
            ════════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Shop by Popular Brands
              </h3>
              <div className="w-12 h-1 bg-[#D9A441] rounded-full mt-1.5" />
            </div>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-watch-gold flex items-center gap-1 transition-colors"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Authentic Brand Carousel with Left & Right Nav Buttons */}
          <div className="relative flex items-center gap-2">
            {/* Circular Prev Arrow */}
            <button
              type="button"
              onClick={scrollBrandsLeft}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:border-watch-gold hover:text-watch-gold text-gray-700 flex items-center justify-center flex-shrink-0 transition-all shadow-xs hover:shadow-md cursor-pointer"
              title="Scroll brands backward"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Brands Row */}
            <div ref={brandsRowRef} className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto scrollbar-none scroll-smooth py-1 flex-1">
              {POPULAR_BRANDS.map((b) => {
                const officialUrl = brandLinks[b.name] || `https://www.${b.slug}.com/`;
                return (
                  <a
                    key={b.slug}
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-amber-50/40 border border-gray-200 hover:border-watch-gold rounded-2xl p-2 sm:p-2.5 flex items-center justify-center shadow-xs hover:shadow-md transition-all duration-300 flex-shrink-0 w-24 sm:w-28 h-12 cursor-pointer group"
                    title={`${b.name} - Visit Official Website`}
                    aria-label={`Visit official ${b.name} website`}
                  >
                    <img
                      src={b.img}
                      alt={`${b.name} Official Logo`}
                      className="max-h-7 max-w-[85%] object-contain pointer-events-none group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                );
              })}
            </div>

            {/* Circular Next Arrow */}
            <button
              type="button"
              onClick={scrollBrandsRight}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:border-watch-gold hover:text-watch-gold text-gray-700 flex items-center justify-center flex-shrink-0 transition-all shadow-xs hover:shadow-md cursor-pointer"
              title="Scroll brands forward"
            >
              <ChevronRight className="w-4 h-4" />
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

          {/* 8 Clean Visual Category Cards with 3D Hover Flip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORY_CARDS.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/products?cat=${cat.cat}`)}
                className="h-44 [perspective:1000px] cursor-pointer group"
              >
                <div className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-2xl shadow-sm group-hover:shadow-xl">
                  {/* Front Side: Clear High-Res Image + Legible Label */}
                  <div
                    className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-2xl overflow-hidden border flex flex-col justify-between ${
                      cat.active ? 'border-watch-gold ring-1 ring-watch-gold/40 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <div className="h-28 bg-gray-50 overflow-hidden flex items-center justify-center relative">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-2 sm:p-2.5 flex items-center justify-between bg-white text-gray-900 border-t border-gray-100">
                      <span
                        className={`text-[11px] sm:text-xs font-bold leading-tight ${
                          cat.active ? 'text-watch-gold' : ''
                        }`}
                      >
                        {cat.name}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1 ${
                          cat.active ? 'bg-watch-gold text-black' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Back Side (3D Hover Flip): Luxury Midnight Navy Card */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#070B12] via-[#0B121C] to-[#111D2E] rounded-2xl border-1.5 border-watch-gold/70 shadow-2xl p-2.5 flex flex-col items-center justify-between text-center text-white">
                    <span className="text-xl mt-1">{cat.icon}</span>
                    <div>
                      <h4 className="text-[12px] font-bold text-watch-gold leading-tight">{cat.name}</h4>
                      <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 bg-watch-gold/20 text-yellow-300 rounded-full border border-watch-gold/30">
                        {cat.styles}
                      </span>
                      <p className="text-[8.5px] text-gray-400 mt-1 line-clamp-1">{cat.desc}</p>
                    </div>
                    <div className="w-full py-1 bg-gradient-to-r from-watch-gold to-yellow-600 text-black text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1 shadow-md">
                      <span>Explore</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
              </div>
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
                  <div
                    onClick={() => navigate(`/products?q=${encodeURIComponent(p.name)}`)}
                    className="h-60 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/images/ref_crops/hero-watch-center.jpg';
                      }}
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
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(p);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all cursor-pointer ${
                        inWish ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                      title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
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
                      <h4
                        onClick={() => navigate(`/products?q=${encodeURIComponent(p.name)}`)}
                        className="text-sm font-bold text-gray-900 group-hover:text-watch-gold transition-colors line-clamp-1 cursor-pointer"
                      >
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