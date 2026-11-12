import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { MOCK_PRODUCTS, GLOBAL_WATCH_BRANDS } from '../../data/mockProducts';
import {
  Heart,
  ShoppingCart,
  Star,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Zap,
  Check,
  Flame,
  Clock
} from 'lucide-react';

const CATEGORY_META = {
  all: {
    title: 'All Premium Watches & Horology Catalogue',
    subtitle: 'Explore 30+ world-renowned watch brands from Swiss Haute Horlogerie to Next-Gen AMOLED Wearables.',
    badge: 'FULL TIMEPIECE CATALOGUE',
    gradient: 'from-gray-900 via-watch-navy to-gray-800',
    icon: '⌚'
  },
  men: {
    title: "Men's Luxury Chronograph & Automatic Watches",
    subtitle: 'Precision mechanical movements, ceramic bezels, and masculine stainless steel silhouettes engineered for excellence.',
    badge: "MEN'S HOROLOGY COLLECTION",
    gradient: 'from-slate-900 via-blue-950 to-slate-900',
    icon: '👔'
  },
  women: {
    title: "Women's Diamond & Elegant Timepieces",
    subtitle: 'Graceful mother-of-pearl dials, rose gold finishes, and diamond-studded bezels crafted for timeless royalty.',
    badge: "WOMEN'S ATELIER",
    gradient: 'from-rose-950 via-purple-950 to-slate-900',
    icon: '✨'
  },
  couple: {
    title: 'His & Hers Matching Couple Watches',
    subtitle: 'Celebrate timeless love and anniversaries with synchronized twin-dial luxury collector gift sets.',
    badge: 'COUPLE & ANNIVERSARY DUAL SETS',
    gradient: 'from-pink-950 via-rose-900 to-gray-900',
    icon: '💑'
  },
  partywear: {
    title: 'Partywear & Gala Statement Watches',
    subtitle: 'Dazzling high-polish crystals, emerald and gold dials made to captivate attention at evening celebrations and weddings.',
    badge: 'EVENING & OCCASION GLAMOUR',
    gradient: 'from-amber-950 via-yellow-950 to-gray-900',
    icon: '🥂'
  },
  combo: {
    title: 'Exclusive Combo Offers & Watch Bundles',
    subtitle: 'Curated multi-watch bundles with complimentary luxury leather storage trays and up to 45% savings.',
    badge: 'HOT COMBO VALUE PACKS',
    gradient: 'from-red-950 via-orange-950 to-gray-900',
    icon: '🔥'
  },
  waterproof: {
    title: 'Professional 200M–300M Waterproof Divers',
    subtitle: 'ISO 6425 certified diver watches with unidirectional rotating bezels, helium valves & Super-LumiNova luminescence.',
    badge: 'DEEP DIVE ISO 6425 RATED',
    gradient: 'from-cyan-950 via-blue-900 to-slate-950',
    icon: '🌊'
  },
  digital: {
    title: 'Rugged Digital, Dual-Time & Tactical Watches',
    subtitle: 'Military shock-resistant resin armor, high-contrast digital displays, stopwatch timers and unbreakable build.',
    badge: 'TACTICAL & MIL-SPEC',
    gradient: 'from-zinc-900 via-neutral-900 to-stone-900',
    icon: '⚡'
  },
  smartwatches: {
    title: 'Next-Gen AMOLED Smartwatches & Wearables',
    subtitle: 'Ultra-bright AMOLED displays, Bluetooth calling, GPS navigation, SpO2 & 24/7 cardiac health tracking.',
    badge: 'CONNECTED SMARTWEAR',
    gradient: 'from-indigo-950 via-purple-900 to-slate-950',
    icon: '📱'
  },
  luxury: {
    title: 'Haute Horlogerie & Swiss Luxury Vault',
    subtitle: 'The holy grail of horology — Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer and Breitling.',
    badge: 'SWISS HAUTE HORLOGERIE',
    gradient: 'from-amber-950 via-watch-navy-dark to-yellow-950',
    icon: '👑'
  },
  new: {
    title: 'Curated 2026 Season New Watch Arrivals',
    subtitle: 'Fresh releases, limited seasonal drops, and newly inducted international brand masterpieces in the WatchHub vault.',
    badge: 'JUST ARRIVED IN VAULT',
    gradient: 'from-emerald-950 via-teal-950 to-slate-950',
    icon: '🌟'
  },
  deals: {
    title: 'Flash Lightning Deals & Clearance Vault',
    subtitle: 'Limited-time steep discounts up to 50% off certified luxury and everyday timepieces with instant dispatch.',
    badge: 'LIMITED-TIME FLASH DEALS',
    gradient: 'from-red-950 via-rose-950 to-orange-950',
    icon: '🏷️'
  },
  sports: {
    title: 'Professional Sports, Racing & Tactical Watches',
    subtitle: 'Tachymeter bezels, shock-resistant cases, and high-precision split-second chronographs.',
    badge: 'SPORTS & TACTICAL SERIES',
    gradient: 'from-emerald-950 via-slate-900 to-gray-900',
    icon: '🏎️'
  },
  kids: {
    title: "Kids & Teens Colorful & Smart Watches",
    subtitle: 'Durable, water-resistant and kid-friendly timepieces with safety tracking.',
    badge: 'KIDS HOROLOGY',
    gradient: 'from-indigo-950 via-purple-900 to-slate-900',
    icon: '👦'
  }
};

const NAV_ITEMS = [
  { id: 'men', label: 'Men', cat: 'men' },
  { id: 'women', label: 'Women', cat: 'women' },
  { id: 'couple', label: 'Couple', cat: 'couple' },
  { id: 'partywear', label: 'Partywear', cat: 'partywear' },
  { id: 'combo', label: 'Combo Offers', cat: 'combo', isHot: true },
  { id: 'waterproof', label: 'Waterproof', cat: 'waterproof' },
  { id: 'digital', label: 'Digital', cat: 'digital' },
  { id: 'smartwatches', label: 'Smartwatches', cat: 'smartwatches' },
  { id: 'luxury', label: 'Luxury', cat: 'luxury' },
  { id: 'new', label: 'New Arrivals', tag: 'new', isGreen: true },
  { id: 'deals', label: 'Deals', tag: 'deals', isRed: true },
];

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || '';
  const tagParam = searchParams.get('tag') || '';
  const brandParam = searchParams.get('brand') || '';

  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedTag, setSelectedTag] = useState(tagParam || '');
  const [selectedBrand, setSelectedBrand] = useState(brandParam ? brandParam.charAt(0).toUpperCase() + brandParam.slice(1) : 'All Brands');
  const [selectedGender, setSelectedGender] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000000); // 50 Lakhs max for luxury pieces
  const [sortBy, setSortBy] = useState('popular');
  const [addedItem, setAddedItem] = useState(null);

  // Sync state whenever URL search parameters change
  useEffect(() => {
    if (brandParam) {
      // Find matching case-insensitive brand
      const found = GLOBAL_WATCH_BRANDS.find(b => (typeof b === 'string' ? b : b.name).toLowerCase() === brandParam.toLowerCase());
      setSelectedBrand(found ? (typeof found === 'string' ? found : found.name) : (brandParam.charAt(0).toUpperCase() + brandParam.slice(1)));
    } else {
      setSelectedBrand('All Brands');
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setSelectedTag('');
    } else if (tagParam) {
      setSelectedTag(tagParam);
      setSelectedCategory('all');
    } else {
      setSelectedCategory('all');
      setSelectedTag('');
    }
  }, [categoryParam, tagParam, brandParam]);

  // Determine current active category meta
  const currentMetaKey = selectedTag || (selectedCategory !== 'all' ? selectedCategory : 'all');
  const currentMeta = CATEGORY_META[currentMetaKey] || CATEGORY_META.all;

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      // Tag match (new / deals)
      if (selectedTag === 'new' && !p.isNew && p.rating < 4.8) {
        return false;
      }
      if (selectedTag === 'deals' && p.discount < 20) {
        return false;
      }

      // Category match
      if (selectedCategory !== 'all') {
        let catMatch = p.category.toLowerCase().includes(selectedCategory.toLowerCase());
        if (selectedCategory === 'sports') {
          catMatch = p.category.toLowerCase().includes('waterproof') ||
                     p.category.toLowerCase().includes('digital') ||
                     p.name.toLowerCase().includes('diver') ||
                     p.name.toLowerCase().includes('sports') ||
                     p.description?.toLowerCase().includes('diver');
        }
        if (selectedCategory === 'kids') {
          catMatch = p.category.toLowerCase().includes('digital') || p.price < 5000;
        }
        const genderMatch = selectedCategory === 'men' ? p.gender.toLowerCase() === 'men' :
                            selectedCategory === 'women' ? p.gender.toLowerCase() === 'women' : true;
        if (!catMatch && !genderMatch) return false;
      }

      // Brand match
      if (selectedBrand !== 'All Brands' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Gender match
      if (selectedGender !== 'all' && p.gender.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }

      // Price match
      if (p.price > maxPrice) return false;

      // Search query match
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discount - a.discount;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [selectedCategory, selectedTag, selectedBrand, selectedGender, maxPrice, sortBy, queryParam]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const handleSelectNavPill = (item) => {
    if (item.cat) {
      setSearchParams({ cat: item.cat });
    } else if (item.tag) {
      setSearchParams({ tag: item.tag });
    }
  };

  return (
    <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1 space-y-6">
        {/* Curated Category Hero Header (Screenshot 1 Matching) */}
        <div className={`rounded-3xl bg-gradient-to-r ${currentMeta.gradient} p-6 sm:p-8 text-white relative overflow-hidden shadow-luxury-lg border border-white/10`}>
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold tracking-wider bg-watch-gold text-watch-navy-dark shadow">
              <span>{currentMeta.icon}</span>
              <span>{currentMeta.badge}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {currentMeta.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-gray-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-watch-gold" /> 100% Certified Authentic
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-watch-gold" /> Free Insured Doorstep Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-watch-gold" /> 7-Day Hassle-Free Returns
              </span>
            </div>
          </div>

          <div className="absolute right-4 sm:right-8 -bottom-6 opacity-15 text-9xl select-none pointer-events-none hidden md:block">
            {currentMeta.icon}
          </div>
        </div>

        {/* Horizontal Navigation Pills (Exact match to Screenshot 1) */}
        <div className="bg-white p-2.5 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max text-xs">
            <button
              onClick={() => setSearchParams({})}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === 'all' && !selectedTag
                  ? 'bg-watch-navy-dark text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Categories
            </button>

            {NAV_ITEMS.map((item) => {
              const isActive = (item.cat && selectedCategory === item.cat && !selectedTag) ||
                               (item.tag && selectedTag === item.tag);
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNavPill(item)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-watch-gold text-watch-navy-dark shadow-sm ring-1 ring-amber-400'
                      : item.isHot
                      ? 'text-gray-800 hover:bg-gray-100'
                      : item.isGreen
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : item.isRed
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isHot && (
                    <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      Hot
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Layout: Left Sidebar Filters & Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Filter Sidebar */}
          <aside className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-watch-gold" /> Filter Horology
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTag('');
                  setSelectedBrand('All Brands');
                  setSelectedGender('all');
                  setMaxPrice(5000000);
                  setSearchParams({});
                }}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Watch Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-semibold outline-none focus:border-watch-gold"
              >
                <option value="All Brands">All Global Brands</option>
                {GLOBAL_WATCH_BRANDS.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Gender / Style Filter */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Gender & Fitting</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', 'Men', 'Women'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      selectedGender === g
                        ? 'bg-watch-navy-dark text-white border-watch-navy-dark'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {g === 'all' ? 'All Styles' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-700 font-bold">Max Price Ceiling</label>
                <span className="font-mono font-bold text-gray-900">
                  {maxPrice >= 5000000 ? 'No Limit' : `₹${maxPrice.toLocaleString('en-IN')}`}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="5000000"
                step="25000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-watch-gold cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹5,000</span>
                <span>₹50,00,000 (Luxury)</span>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-gray-300 text-xs font-semibold outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated ★</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount">Biggest Discount %</option>
              </select>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-800">
                Showing {filteredProducts.length} Timepieces
              </span>
              <span className="text-gray-500 font-medium">
                Verified Vault Stock
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-5xl block mb-3">🔍</span>
                <h3 className="text-base font-bold text-gray-800">No matching watches found</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Try relaxing your price range or brand filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedTag('');
                    setSelectedBrand('All Brands');
                    setSelectedGender('all');
                    setMaxPrice(5000000);
                  }}
                  className="btn-gold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((p) => {
                  const inWish = isInWishlist(p.id);
                  const isAdded = addedItem === p.id;
                  return (
                    <div key={p.id} className="card-luxury overflow-hidden flex flex-col justify-between group bg-white rounded-2xl border border-gray-200 hover:shadow-luxury-lg transition-all">
                      {/* Product Image */}
                      <div className="h-56 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/ref_crops/hero-watch-center.jpg';
                            }}
                          />
                        ) : (
                          <span className="text-6xl">⌚</span>
                        )}

                        {/* Discount Badge */}
                        <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                          -{p.discount}% OFF
                        </span>

                        {/* Brand Badge */}
                        <span className="absolute bottom-2 left-3 bg-watch-navy-dark/90 backdrop-blur-sm text-watch-gold text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-watch-gold/30">
                          {p.brand}
                        </span>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(p)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all ${
                            inWish ? 'text-rose-600 fill-rose-600' : 'text-gray-400 hover:text-rose-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-600' : ''}`} />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-center text-[10.5px] text-gray-500 font-bold mb-1">
                            <span className="text-watch-gold font-extrabold uppercase">{p.category}</span>
                            <span>{p.gender}</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-watch-gold transition-colors line-clamp-1">
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

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-black text-gray-900 block">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(p)}
                            className={`text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-watch-navy-dark text-white hover:bg-watch-gold hover:text-watch-navy-dark'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
