import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight,
} from 'lucide-react';
import watchBannerImg from '../../assets/images/watch-cut.png';

const CATEGORIES = [
  { name: 'Partywear Watches', icon: '🎉', count: '120+ Styles', cat: 'partywear' },
  { name: 'Combo Offers', icon: '🎁', count: 'Up to 50% Off', cat: 'combo' },
  { name: 'Waterproof Watches', icon: '💧', count: '50M - 200M', cat: 'waterproof' },
  { name: 'Digital Watches', icon: '📱', count: 'Shock-proof', cat: 'digital' },
  { name: 'Smartwatches', icon: '⌚', count: 'AMOLED & Calling', cat: 'smartwatches' },
  { name: 'Luxury Collection', icon: '👑', count: 'Swiss & Heritage', cat: 'luxury' },
  { name: "Men's Watches", icon: '👨', count: 'Chronographs', cat: 'men' },
  { name: "Women's Watches", icon: '👩', count: 'Rose Gold & Mesh', cat: 'women' },
  { name: 'Couple Watches', icon: '💑', count: 'Perfect Pairs', cat: 'couple' },
  { name: 'Sports Watches', icon: '🏃', count: 'Military Tactical', cat: 'digital' },
];

export const HomePage = () => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [activeTab, setActiveTab] = useState('All');
  const [addedItem, setAddedItem] = useState(null);

  const filterTabs = ['All', 'Partywear', 'Waterproof', 'Digital', 'Smartwatches', 'Combo Offers'];

  const filteredProducts = activeTab === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category.toLowerCase().includes(activeTab.toLowerCase().split(' ')[0]));

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  return (
    <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
      <CustomerNavbar />

      <main className="flex-1 space-y-10 pb-16">
        {/* 1. Hero Showcase Section */}
        <section className="bg-watch-navy-dark text-white relative overflow-hidden py-10 sm:py-14 px-4 sm:px-8 border-b border-gray-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 z-10">
              <span className="text-xs font-bold text-watch-gold tracking-widest uppercase inline-block">
                ★ New Arrival 2026
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Premium Watches <br />
                <span className="text-gray-200">for Every Occasion</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
                From Classic Elegance to Smart Innovation – Find Your Perfect Timepiece Engineered for Perfection.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/products" className="btn-gold text-xs">
                  Shop Now →
                </Link>
                <Link
                  to="/products?cat=luxury"
                  className="px-5 py-2.5 rounded-lg border border-white/20 hover:border-watch-gold text-white hover:text-watch-gold text-xs font-bold transition-all"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            {/* Center Watch Photo + Festival Offer Card */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end gap-6 relative">
              <img
                src={watchBannerImg}
                alt="WatchHub Luxury Watch"
                className="w-56 sm:w-64 object-contain drop-shadow-[0_20px_40px_rgba(217,164,65,0.35)]"
              />

              {/* Festival Offer Floating Badge Card */}
              <div className="bg-white/10 backdrop-blur-md border border-watch-gold/40 rounded-2xl p-4 text-center text-white max-w-[170px] shadow-2xl">
                <span className="text-xl">🎁</span>
                <p className="text-xs font-bold text-watch-gold mt-1">Festival Offer</p>
                <p className="text-[11px] text-gray-300 leading-tight mt-0.5">Up to</p>
                <p className="text-2xl font-black text-white">40% OFF</p>
                <p className="text-[10px] text-gray-300 mb-2">on Selected Watches</p>
                <Link
                  to="/products?tag=deals"
                  className="block bg-watch-gold text-watch-navy-dark font-extrabold text-[10.5px] py-1.5 px-3 rounded-lg hover:bg-watch-gold-dark transition-colors"
                >
                  Shop Deals →
                </Link>
              </div>
            </div>
          </div>

          {/* 4 Trust Badges Strip */}
          <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-watch-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-white">Free Delivery</p>
                <p className="text-[10.5px] text-gray-400">on orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-watch-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-white">100% Original</p>
                <p className="text-[10.5px] text-gray-400">Certified Branded Watches</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-watch-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-white">Easy Returns</p>
                <p className="text-[10.5px] text-gray-400">Within 7 Days Hassle-Free</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-watch-gold flex-shrink-0" />
              <div>
                <p className="font-bold text-white">Secure Payment</p>
                <p className="text-[10.5px] text-gray-400">UPI, Cards, COD & Net Banking</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Shop by Category (10 rounded cards horizontal scroll) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Shop by Category</h3>
              <p className="text-xs text-gray-500">Discover timepieces handpicked for every occasion</p>
            </div>
            <Link to="/products" className="text-xs font-semibold text-watch-gold hover:underline flex items-center gap-1">
              View All Categories <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?cat=${cat.cat}`}
                className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-watch-gold shadow-sm hover:shadow-md transition-all text-center group flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <p className="text-xs font-bold text-gray-800 group-hover:text-watch-gold leading-tight">
                  {cat.name}
                </p>
                <span className="text-[9.5px] text-gray-400 mt-1">{cat.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Three Promotional Feature Banners */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Banner 1 */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#2a1324] to-[#421b3a] text-white flex justify-between items-center relative overflow-hidden shadow-md">
            <div>
              <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Partywear Collection</span>
              <h4 className="text-lg font-bold mt-1 leading-snug">Make Every Occasion Special</h4>
              <Link to="/products?cat=partywear" className="inline-block mt-3 bg-white text-gray-900 font-bold text-xs py-1.5 px-3.5 rounded-lg hover:bg-watch-gold transition-colors">
                Shop Now →
              </Link>
            </div>
            <span className="text-5xl opacity-80">💎</span>
          </div>

          {/* Banner 2 */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0c1829] to-[#162a47] text-white flex justify-between items-center relative overflow-hidden shadow-md border border-watch-gold/20">
            <div>
              <span className="text-[10px] font-bold text-watch-gold uppercase tracking-wider">Combo Offers</span>
              <h4 className="text-lg font-bold mt-1 leading-snug">Buy More, Save More!</h4>
              <p className="text-xs text-amber-300 font-bold mt-0.5">Up to 50% OFF</p>
              <Link to="/products?cat=combo" className="inline-block mt-3 bg-watch-gold text-watch-navy-dark font-bold text-xs py-1.5 px-3.5 rounded-lg hover:bg-watch-gold-dark transition-colors">
                Shop Combos →
              </Link>
            </div>
            <span className="text-5xl opacity-80">🎁</span>
          </div>

          {/* Banner 3 */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0a232e] to-[#12394a] text-white flex justify-between items-center relative overflow-hidden shadow-md">
            <div>
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Waterproof Watches</span>
              <h4 className="text-lg font-bold mt-1 leading-snug">Built for Every Adventure</h4>
              <Link to="/products?cat=waterproof" className="inline-block mt-3 bg-white text-gray-900 font-bold text-xs py-1.5 px-3.5 rounded-lg hover:bg-watch-gold transition-colors">
                Shop Waterproof →
              </Link>
            </div>
            <span className="text-5xl opacity-80">💧</span>
          </div>
        </section>

        {/* 4. Trending Watches with Filter Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Trending Watches</h3>
              <p className="text-xs text-gray-500">Most coveted luxury & sports timepieces this month</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-gray-200/60 p-1 rounded-full text-xs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-watch-navy text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid (3-4 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const inWish = isInWishlist(p.id);
              const isAdded = addedItem === p.id;
              return (
                <div key={p.id} className="card-luxury overflow-hidden flex flex-col justify-between group">
                  {/* Image wrap with Real Watch Image */}
                  <div className="h-56 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                        ⌚
                      </span>
                    )}

                    {/* Discount badge */}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      -{p.discount}% OFF
                    </span>

                    {/* Brand Pill */}
                    <span className="absolute bottom-2 left-3 bg-watch-navy/80 backdrop-blur-sm text-watch-gold text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border border-watch-gold/30">
                      {p.brand}
                    </span>

                    {/* Wishlist button */}
                    <button
                      onClick={() => toggleWishlist(p)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all ${
                        inWish ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                        {p.category} • {p.brand}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-watch-gold transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs">
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
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-watch-navy text-white hover:bg-watch-gold hover:text-watch-navy-dark'
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

      {/* Footer */}
      <footer className="bg-watch-navy text-gray-300 text-xs py-10 px-4 sm:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Watch<span className="text-watch-gold">Hub</span></h4>
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
              <li><Link to="/products?cat=men" className="hover:text-watch-gold">Men's Watches</Link></li>
              <li><Link to="/products?cat=women" className="hover:text-watch-gold">Women's Watches</Link></li>
              <li><Link to="/products?cat=smartwatches" className="hover:text-watch-gold">Smartwatches</Link></li>
              <li><Link to="/dashboard" className="text-watch-gold font-bold hover:underline">👑 Employee Staff Portal</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3">Customer Support</h5>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link to="/track-order" className="hover:text-watch-gold">Track Your Order</Link></li>
              <li><a href="javascript:void(0)" onClick={() => alert('7-day return policy valid on all original unboxed watches.')} className="hover:text-watch-gold">Return Policy</a></li>
              <li><a href="javascript:void(0)" onClick={() => alert('Support helpline: 1800-WATCHHUB (Mon-Sat, 9AM-8PM)')} className="hover:text-watch-gold">Help Center</a></li>
              <li><Link to="/login" className="hover:text-watch-gold">Account Login</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3">Stay in the Loop</h5>
            <p className="text-[11px] text-gray-400 mb-2">Subscribe to receive exclusive drops & festival vouchers.</p>
            <div className="flex gap-1.5">
              <input type="email" placeholder="Enter your email" className="bg-white/10 text-white text-xs px-3 py-2 rounded-lg outline-none border border-white/20 flex-1" />
              <button onClick={() => alert('Subscribed to WatchHub newsletter!')} className="btn-gold text-xs px-3 py-2">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-800 text-center text-gray-500 text-[11px]">
          © 2026 WatchHub – Premium Watches for Every Style. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

