import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import BrandLogo from '../../components/common/BrandLogo';
import { GLOBAL_BRANDS_60, getBrandDescription } from '../../data/brandsData';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import {
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Eye,
  Award,
  Globe,
  Clock,
  X,
} from 'lucide-react';

export const BrandListingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  // Find Brand by Slug or ID or Name
  const brand = useMemo(() => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    return (
      GLOBAL_BRANDS_60.find(
        (b) =>
          b.id.toLowerCase() === cleanSlug ||
          b.name.toLowerCase().replace(/[\s&]+/g, '-') === cleanSlug ||
          b.name.toLowerCase() === cleanSlug
      ) || {
        id: cleanSlug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '),
        country: 'Switzerland',
        flag: '🇨🇭',
        category: 'Luxury',
        website: `https://www.${cleanSlug}.com/`,
        founded: '1888',
        tagline: 'Timeless Haute Horlogerie Excellence',
        logoType: cleanSlug.replace(/[^a-z0-9]/g, ''),
        description: `Experience the exceptional craftsmanship, precision calibres, and iconic timepieces of ${slug}. Each watch is hand-assembled to Swiss standards.`,
      }
    );
  }, [slug]);

  // Filtering & Sorting State
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedMovement, setSelectedMovement] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Curated Watches for this Brand (from MOCK_PRODUCTS or dynamically tailored for brand)
  const brandWatches = useMemo(() => {
    if (!brand) return [];
    const directMatches = MOCK_PRODUCTS.filter(
      (p) =>
        p.brand?.toLowerCase() === brand.name.toLowerCase() ||
        p.brand?.toLowerCase().includes(brand.id.toLowerCase()) ||
        p.name?.toLowerCase().includes(brand.name.toLowerCase())
    );

    if (directMatches.length >= 4) {
      return directMatches;
    }

    // Supplementary tailored luxury timepieces for this brand
    const sampleWatches = [
      {
        id: `${brand.id}-flagship-chronometer`,
        name: `${brand.name} Chronometer Master 41mm`,
        brand: brand.name,
        category: 'Luxury',
        gender: 'Men',
        price: brand.category === 'Luxury' ? 780000 : 85000,
        originalPrice: brand.category === 'Luxury' ? 890000 : 98000,
        discount: 12,
        rating: 4.9,
        reviewsCount: 148,
        image: '/images/products/rolex-submariner.png',
        movement: 'Manufacture Calibre Automatic',
        waterResistance: '100M / 10 ATM',
        caseMaterial: 'Satin-Brushed Stainless Steel',
        warranty: '5 Years Atelier International Warranty',
        description: `Flagship timepiece by ${brand.name}. Hand-finished case, anti-reflective sapphire crystal, and certified chronometer precision.`,
      },
      {
        id: `${brand.id}-heritage-edition`,
        name: `${brand.name} Heritage Edition Titanium`,
        brand: brand.name,
        category: 'Heritage',
        gender: 'Men',
        price: brand.category === 'Luxury' ? 540000 : 62000,
        originalPrice: brand.category === 'Luxury' ? 620000 : 72000,
        discount: 15,
        rating: 4.8,
        reviewsCount: 92,
        image: '/images/products/omega-speedmaster.png',
        movement: 'Manual Mechanical Chronograph',
        waterResistance: '50M / 5 ATM',
        caseMaterial: 'Grade 5 Lightweight Titanium',
        warranty: '5 Years Atelier International Warranty',
        description: `Commemorative release paying homage to ${brand.name}'s founding atelier in ${brand.country} (${brand.founded}).`,
      },
      {
        id: `${brand.id}-sport-diver`,
        name: `${brand.name} Seamaster Diver 300M`,
        brand: brand.name,
        category: 'Sports',
        gender: 'Men',
        price: brand.category === 'Luxury' ? 420000 : 45000,
        originalPrice: brand.category === 'Luxury' ? 490000 : 54000,
        discount: 14,
        rating: 4.7,
        reviewsCount: 176,
        image: '/images/products/omega-seamaster.png',
        movement: 'Automatic Co-Axial Diver',
        waterResistance: '300M / 1000ft Professional',
        caseMaterial: 'Stainless Steel with Ceramic Bezel',
        warranty: '5 Years Atelier International Warranty',
        description: `Rugged maritime diver engineered with helium escape valve and high-contrast Super-LumiNova indexes.`,
      },
      {
        id: `${brand.id}-elegance-automatic`,
        name: `${brand.name} Elegance Slim Automatic`,
        brand: brand.name,
        category: 'Women',
        gender: 'Women',
        price: brand.category === 'Luxury' ? 380000 : 38000,
        originalPrice: brand.category === 'Luxury' ? 440000 : 45000,
        discount: 10,
        rating: 4.9,
        reviewsCount: 64,
        image: '/images/products/cartier-tank.png',
        movement: 'Ultra-Thin Automatic Calibre',
        waterResistance: '30M / 3 ATM',
        caseMaterial: 'Rose Gold PVD & White Sunburst Dial',
        warranty: '5 Years Atelier International Warranty',
        description: `Refined formal dress watch featuring brilliant-cut diamond hour markers and alligator embossed leather strap.`,
      },
      {
        id: `${brand.id}-smart-connected`,
        name: `${brand.name} Connected AMOLED Watch`,
        brand: brand.name,
        category: 'Smartwatches',
        gender: 'Unisex',
        price: 48000,
        originalPrice: 56000,
        discount: 14,
        rating: 4.6,
        reviewsCount: 230,
        image: '/images/products/apple-watch-s10.png',
        movement: 'Connected Digital Sensor Core',
        waterResistance: '50M Water Resistant',
        caseMaterial: 'Space-Grade Aluminum',
        warranty: '2 Years Manufacturer Warranty',
        description: `Next-generation connected wearable pairing Swiss aesthetic heritage with biometric health & notification tracking.`,
      },
    ];

    return [...directMatches, ...sampleWatches];
  }, [brand]);

  // Filtered & Sorted Watches
  const filteredWatches = useMemo(() => {
    return brandWatches
      .filter((w) => {
        // Collection
        if (selectedCollection !== 'All') {
          if (selectedCollection === 'Men' && w.gender !== 'Men') return false;
          if (selectedCollection === 'Women' && w.gender !== 'Women') return false;
          if (selectedCollection === 'Sports' && w.category !== 'Sports') return false;
          if (selectedCollection === 'Luxury' && w.category !== 'Luxury') return false;
        }

        // Movement
        if (selectedMovement !== 'All') {
          if (
            selectedMovement === 'Automatic' &&
            !w.movement?.toLowerCase().includes('automatic')
          )
            return false;
          if (
            selectedMovement === 'Chronograph' &&
            !w.name?.toLowerCase().includes('chronograph') &&
            !w.movement?.toLowerCase().includes('chronograph')
          )
            return false;
          if (
            selectedMovement === 'Quartz' &&
            !w.movement?.toLowerCase().includes('quartz') &&
            !w.name?.toLowerCase().includes('quartz')
          )
            return false;
        }

        // Price Range
        if (selectedPriceRange !== 'All') {
          if (selectedPriceRange === 'under-50k' && w.price >= 50000) return false;
          if (
            selectedPriceRange === '50k-200k' &&
            (w.price < 50000 || w.price > 200000)
          )
            return false;
          if (
            selectedPriceRange === '200k-1000k' &&
            (w.price < 200000 || w.price > 1000000)
          )
            return false;
          if (selectedPriceRange === 'above-1000k' && w.price < 1000000)
            return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [brandWatches, selectedCollection, selectedMovement, selectedPriceRange, sortBy]);

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#020813] text-white flex flex-col justify-between">
        <CustomerNavbar />
        <div className="py-24 text-center">
          <p className="text-xl font-bold">Brand Not Found</p>
          <Link to="/brands" className="text-[#00CFFF] underline mt-3 inline-block">
            View All 60+ Global Brands
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const brandDescription = getBrandDescription(brand);

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

      {/* ── BREADCRUMB ── */}
      <div className="bg-[#040C1A] border-b border-white/[0.08] py-2.5 px-4 sm:px-8 text-xs text-[#A6B1C8]">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          <Link to="/brands" className="hover:text-white transition-colors">
            Global Brands Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[#F4B942] font-semibold">{brand.name}</span>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-10 w-full flex-1">
        
        {/* ════════════════════════════════════════════════════════════════
            1. LUXURY BRAND HERO BANNER & OFFICIAL LINK
            ════════════════════════════════════════════════════════════════ */}
        <section className="rounded-3xl bg-gradient-to-r from-[#030917] via-[#08152B] to-[#030917] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gold/cyan ambient lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-radial from-[#00CFFF]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-radial from-[#F4B942]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: Brand Identity & Verification */}
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#F4B942] bg-[#F4B942]/15 border border-[#F4B942]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#F4B942]" />
                  <span>OFFICIAL MANUFACTURE PARTNER</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>{brand.flag}</span>
                  <span>{brand.country}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Est. {brand.founded}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                {brand.name}
              </h1>

              {brand.tagline && (
                <p className="text-xs sm:text-sm font-serif italic text-[#00CFFF]">
                  "{brand.tagline}"
                </p>
              )}

              <p className="text-xs sm:text-sm text-[#A6B1C8] leading-relaxed font-light">
                {brandDescription}
              </p>

              {/* Guarantees Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>100% Certified Authentic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00CFFF]" />
                  <span>5-Year Official Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#39F5A5]" />
                  <span>Direct Swiss Atelier Import</span>
                </div>
              </div>
            </div>

            {/* Right: Authentic Logo & Official Website Button */}
            <div className="flex flex-col items-center sm:items-end gap-4 w-full lg:w-auto">
              {/* Logo Card */}
              <div className="w-48 sm:w-56 h-24 rounded-2xl bg-white/95 border border-white/20 p-3 flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
                <BrandLogo logoType={brand.logoType} brandName={brand.name} />
              </div>

              {/* Official Brand Website External Link (Requested in PART 5) */}
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#F4B942] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
                title={`Open official ${brand.name} portal in a new tab`}
              >
                <span>Visit Official {brand.name} Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F4B942] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            2. FILTER & SORT TOOLBAR
            ════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#040C1A] border border-white/[0.08] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-bold text-slate-400 flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00CFFF]" />
              <span>Filters:</span>
            </span>

            {/* Collection Filter */}
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="bg-[#081022] border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none cursor-pointer focus:border-[#00CFFF]"
            >
              <option value="All">All Collections</option>
              <option value="Men">Men's Timepieces</option>
              <option value="Women">Women's Atelier</option>
              <option value="Sports">Sports & Divers</option>
              <option value="Luxury">Haute Horlogerie</option>
            </select>

            {/* Movement Filter */}
            <select
              value={selectedMovement}
              onChange={(e) => setSelectedMovement(e.target.value)}
              className="bg-[#081022] border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none cursor-pointer focus:border-[#00CFFF]"
            >
              <option value="All">All Movements</option>
              <option value="Automatic">Automatic Self-Winding</option>
              <option value="Chronograph">Mechanical Chronograph</option>
              <option value="Quartz">Precision Quartz</option>
            </select>

            {/* Price Filter */}
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="bg-[#081022] border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none cursor-pointer focus:border-[#00CFFF]"
            >
              <option value="All">All Price Ranges</option>
              <option value="under-50k">Under ₹50,000</option>
              <option value="50k-200k">₹50,000 – ₹2,00,000</option>
              <option value="200k-1000k">₹2,00,000 – ₹10,00,000</option>
              <option value="above-1000k">Luxury ₹10,00,000+</option>
            </select>

            {/* Reset Filters */}
            {(selectedCollection !== 'All' ||
              selectedMovement !== 'All' ||
              selectedPriceRange !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCollection('All');
                  setSelectedMovement('All');
                  setSelectedPriceRange('All');
                }}
                className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right Sort & Count */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-mono text-[11px]">
              {filteredWatches.length} Watches Available
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#081022] border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none cursor-pointer focus:border-[#F4B942]"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>

        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. PRODUCT GRID (100% Complete, Uncropped Watches)
            ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredWatches.map((watch) => {
              const inWish = isInWishlist(watch.id);
              return (
                <div
                  key={watch.id}
                  className="rounded-2xl bg-[#040C1A] border border-white/10 hover:border-[#00CFFF]/50 hover:shadow-[0_0_25px_rgba(0,207,255,0.2)] p-4 flex flex-col justify-between transition-all group"
                >
                  {/* Top Uncropped Watch Container (PART 1 Guarantee) */}
                  <div
                    onClick={() => navigate(`/product/${watch.id}`)}
                    className="w-full h-60 rounded-xl bg-gradient-to-b from-[#060D1A] to-[#02060F] p-4 flex items-center justify-center relative overflow-hidden cursor-pointer mb-3 border border-white/5 select-none"
                  >
                    <img
                      src={watch.image}
                      alt={watch.name}
                      className="max-h-full max-w-full w-auto h-auto object-contain object-center filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300 block mx-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/watch_placeholder.png';
                      }}
                    />

                    {/* Discount Badge */}
                    {watch.discount > 0 && (
                      <span className="absolute top-2.5 left-2.5 bg-[#FF35C8] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md pointer-events-none">
                        -{watch.discount}% OFF
                      </span>
                    )}

                    {/* Quick View Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(watch);
                      }}
                      className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 text-slate-300 hover:text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(watch);
                      }}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-xs transition-colors cursor-pointer shadow-md ${
                        inWish ? 'text-[#FF35C8]' : 'text-slate-400 hover:text-white'
                      }`}
                      title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Watch Information */}
                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-wider block">
                        {watch.brand}
                      </span>
                      <h3
                        onClick={() => navigate(`/product/${watch.id}`)}
                        className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00CFFF] transition-colors truncate cursor-pointer"
                        title={watch.name}
                      >
                        {watch.name}
                      </h3>
                      <p className="text-[11px] text-[#A6B1C8] truncate">
                        {watch.caseMaterial || watch.movement || 'Atelier Masterpiece'}
                      </p>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1.5 text-xs text-[#F4B942] pt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{watch.rating || 4.8}</span>
                      <span className="text-slate-500 text-[11px]">
                        ({watch.reviewsCount || 84})
                      </span>
                    </div>

                    {/* Price & Action Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] mt-2">
                      <div>
                        <span className="font-mono font-extrabold text-sm sm:text-base text-white">
                          {formatPrice(watch.price)}
                        </span>
                        {watch.originalPrice && (
                          <span className="block text-[10px] text-slate-500 line-through">
                            {formatPrice(watch.originalPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(watch, 1);
                          triggerToast(`✨ Added ${watch.name} to your shopping bag!`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#F4B942] hover:text-black text-[#F4B942] border border-white/10 flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer shadow-sm"
                        title="Add to Shopping Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWatches.length === 0 && (
            <div className="text-center py-16 bg-[#040C1A] rounded-3xl border border-white/10 p-8">
              <p className="text-lg font-bold text-white">No watches match this filter criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCollection('All');
                  setSelectedMovement('All');
                  setSelectedPriceRange('All');
                }}
                className="mt-3 px-5 py-2 rounded-full bg-[#00CFFF] text-black font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. BRAND HERITAGE & ATELIER STORY ACCORDION
            ════════════════════════════════════════════════════════════════ */}
        <section className="rounded-3xl bg-[#040C1A] border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
                ATELIER HERITAGE
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                About the House of {brand.name}
              </h2>
            </div>
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#00CFFF] hover:underline flex items-center gap-1"
            >
              <span>Explore Official Manufacturer Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-[#A6B1C8] leading-relaxed">
            <div className="bg-[#020813] p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="font-bold text-white text-sm">Chronometric Precision</h4>
              <p>
                Each {brand.name} timepiece undergoes rigorous laboratory chronometer testing for thermal resistance, anti-magnetism up to 15,000 Gauss, and rate stability across 5 positions.
              </p>
            </div>

            <div className="bg-[#020813] p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="font-bold text-white text-sm">Master Craftsmanship</h4>
              <p>
                From hand-beveled anglage on movement bridges to guilloché dial engraving, {brand.name} adheres to the highest traditions of haute horlogerie.
              </p>
            </div>

            <div className="bg-[#020813] p-4 rounded-2xl border border-white/5 space-y-2">
              <h4 className="font-bold text-white text-sm">Global Authenticity</h4>
              <p>
                WatchHub guarantees 100% factory authenticity with individual serial number verification, original warranty card, and atelier travel presentation case.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════════════════════════
          5. QUICK VIEW MODAL
          ════════════════════════════════════════════════════════════════ */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#040C1A] text-white rounded-3xl max-w-2xl w-full border border-white/15 p-6 shadow-2xl relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Left Uncropped Image */}
              <div className="h-64 rounded-2xl bg-[#020813] p-4 flex items-center justify-center border border-white/5">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/watch_placeholder.png';
                  }}
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                />
              </div>

              {/* Right Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-wider">
                    {quickViewProduct.brand}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {quickViewProduct.name}
                  </h3>
                  <p className="text-slate-400 mt-1">{quickViewProduct.description}</p>
                </div>

                <div className="text-base font-mono font-bold text-[#00CFFF]">
                  {formatPrice(quickViewProduct.price)}
                </div>

                <div className="space-y-1 text-slate-300">
                  <p>• Movement: {quickViewProduct.movement || 'Automatic'}</p>
                  <p>• Water Resistance: {quickViewProduct.waterResistance || '100M'}</p>
                  <p>• Warranty: {quickViewProduct.warranty || '5 Years Official'}</p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      triggerToast(`✨ Added to cart!`);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs shadow-md"
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${quickViewProduct.id}`}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BrandListingPage;
