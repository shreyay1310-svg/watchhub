import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  Eye,
  MousePointerClick,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  Upload,
  Check,
  X
} from 'lucide-react';

const INITIAL_COUPONS = [
  { id: 'c1', code: 'FESTIVAL40', type: 'Percentage (40%)', minOrder: 2999, maxDiscount: 2000, usages: 420, maxUsage: 1000, expiry: '30 Nov 2026', status: 'Active' },
  { id: 'c2', code: 'WATCHHUB10', type: 'Percentage (10%)', minOrder: 999, maxDiscount: 500, usages: 890, maxUsage: 5000, expiry: '31 Dec 2026', status: 'Active' },
  { id: 'c3', code: 'FIRSTBUY', type: 'Percentage (15%)', minOrder: 1499, maxDiscount: 750, usages: 1240, maxUsage: 2500, expiry: '31 Dec 2026', status: 'Active' },
  { id: 'c4', code: 'DIWALILUXURY', type: 'Flat (₹1,500 OFF)', minOrder: 9999, maxDiscount: 1500, usages: 120, maxUsage: 200, expiry: '05 Nov 2026', status: 'Expiring Soon' },
];

const INITIAL_BANNERS = [
  {
    id: 'b1',
    title: 'The Horological Masterpiece Collection',
    subtitle: 'Hand-assembled Swiss movements, 18K solid gold & ceramic bezels.',
    badge: 'LUXURY TIMEPIECES 2026',
    ctaText: 'Explore Haute Horlogerie',
    targetLink: '/products?cat=luxury',
    placement: 'Homepage Hero Slider (Slot 1)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
    impressions: '142,500',
    clicks: '12,480',
    ctr: '8.76%',
    status: 'Active',
    scheduled: '01 Nov – 30 Nov 2026'
  },
  {
    id: 'b2',
    title: 'His & Hers Eternal Bond Pairs',
    subtitle: 'Celebrate anniversaries with synchronized automatic matching dials.',
    badge: 'COUPLE WATCH SPECIAL',
    ctaText: 'Shop Couple Sets',
    targetLink: '/products?cat=couple',
    placement: 'Homepage Hero Slider (Slot 2)',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=80',
    impressions: '98,200',
    clicks: '9,150',
    ctr: '9.31%',
    status: 'Active',
    scheduled: '15 Oct – 15 Nov 2026'
  },
  {
    id: 'b3',
    title: 'Extreme 300M Diver Edition',
    subtitle: 'Helium escape valve, Super-LumiNova luminescence & ISO 6425 tested.',
    badge: 'WATERPROOF DIVERS',
    ctaText: 'Discover Pro Divers',
    targetLink: '/products?cat=waterproof',
    placement: 'Category Promo Spotlight',
    image: '/images/products/omega_speedmaster.jpg',
    impressions: '64,100',
    clicks: '4,890',
    ctr: '7.62%',
    status: 'Active',
    scheduled: '01 Nov – 31 Dec 2026'
  },
  {
    id: 'b4',
    title: 'Next-Gen AMOLED Smartwatches',
    subtitle: 'Blood oxygen ECG monitor, titanium casing & 14-day battery life.',
    badge: 'TECH WEARABLES',
    ctaText: 'View Smartwatches',
    targetLink: '/products?cat=smartwatches',
    placement: 'Category Promo Spotlight',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&q=80',
    impressions: '51,400',
    clicks: '3,920',
    ctr: '7.62%',
    status: 'Draft / Paused',
    scheduled: 'Upcoming Winter Launch'
  }
];

export const OffersCouponsModule = ({ activeSubTab = 'offers', onSubTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeSubTab === 'banners' ? 'banners' : 'offers');

  // Coupons State
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'Percentage (20%)', minOrder: 1999, maxDiscount: 1000, maxUsage: 500, expiry: '31 Dec 2026' });

  // Banners State
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    badge: 'LIMITED EDITION',
    ctaText: 'Shop Now',
    targetLink: '/products',
    placement: 'Homepage Hero Slider (Slot 3)',
    image: '/images/products/rolex_daytona.jpg',
    scheduled: '05 Nov – 31 Dec 2026'
  });

  useEffect(() => {
    if (activeSubTab === 'banners') {
      setCurrentTab('banners');
    } else if (activeSubTab === 'offers') {
      setCurrentTab('offers');
    }
  }, [activeSubTab]);

  const switchTab = (tab) => {
    setCurrentTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const item = {
      id: `c_${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      minOrder: Number(newCoupon.minOrder),
      maxDiscount: Number(newCoupon.maxDiscount),
      usages: 0,
      maxUsage: Number(newCoupon.maxUsage),
      expiry: newCoupon.expiry,
      status: 'Active',
    };
    setCoupons([item, ...coupons]);
    setModalOpen(false);
    setNewCoupon({ code: '', type: 'Percentage (20%)', minOrder: 1999, maxDiscount: 1000, maxUsage: 500, expiry: '31 Dec 2026' });
  };

  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!newBanner.title) return;
    const item = {
      id: `b_${Date.now()}`,
      title: newBanner.title,
      subtitle: newBanner.subtitle,
      badge: newBanner.badge,
      ctaText: newBanner.ctaText,
      targetLink: newBanner.targetLink,
      placement: newBanner.placement,
      image: newBanner.image,
      impressions: '0',
      clicks: '0',
      ctr: '0.0%',
      status: 'Active',
      scheduled: newBanner.scheduled
    };
    setBanners([item, ...banners]);
    setBannerModalOpen(false);
    alert('🎉 New promotional banner created and scheduled on storefront!');
  };

  const toggleBannerStatus = (id) => {
    setBanners(banners.map(b => {
      if (b.id === id) {
        return { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' };
      }
      return b;
    }));
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const handleDeleteBanner = (id) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upper Module Sub-Tab Switcher Bar (Matches Screenshot 2) */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => switchTab('offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'offers'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🏷️</span> Offers & Coupons
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">
              {coupons.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'banners'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🖼️</span> Banners & Promotions
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full font-bold">
              {banners.length}
            </span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 font-semibold pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Marketing CTR: 8.9% Above Industry Benchmark</span>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OFFERS & COUPONS (🏷️ Offers)
          ========================================================================= */}
      {currentTab === 'offers' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>🏷️</span> Promotional Offers & Discount Coupons
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure seasonal campaigns, set cart thresholds and track coupon redemption metrics.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" /> Create New Coupon
            </button>
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-base font-extrabold text-watch-navy tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg inline-block">
                      {c.code}
                    </span>
                    <p className="text-xs font-bold text-gray-700 mt-2">{c.type}</p>
                    <p className="text-[11px] text-gray-500">Min Order: ₹{c.minOrder.toLocaleString('en-IN')} • Cap: ₹{c.maxDiscount.toLocaleString('en-IN')}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Valid till: {c.expiry}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">{c.usages} / {c.maxUsage} used</span>
                    <button onClick={() => handleDeleteCoupon(c.id)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Coupon Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-base font-bold text-gray-900 mb-1">Create Promotional Voucher</h3>
                <p className="text-xs text-gray-500 mb-4">Set redemption parameters and discount limits.</p>

                <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Coupon Code (Uppercase)</label>
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. FESTIVE50"
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 font-mono font-bold outline-none focus:border-watch-gold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Discount Type</label>
                      <select
                        value={newCoupon.type}
                        onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                        className="w-full h-9 px-2 rounded-lg border border-gray-300 outline-none"
                      >
                        <option value="Percentage (10%)">10% Percentage</option>
                        <option value="Percentage (20%)">20% Percentage</option>
                        <option value="Percentage (30%)">30% Percentage</option>
                        <option value="Flat (₹500 OFF)">Flat ₹500 OFF</option>
                        <option value="Flat (₹1,500 OFF)">Flat ₹1,500 OFF</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Min Order Value (₹)</label>
                      <input
                        type="number"
                        value={newCoupon.minOrder}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Max Discount Cap (₹)</label>
                      <input
                        type="number"
                        value={newCoupon.maxDiscount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Max Total Usages</label>
                      <input
                        type="number"
                        value={newCoupon.maxUsage}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxUsage: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={newCoupon.expiry}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiry: e.target.value })}
                      placeholder="e.g. 31 Dec 2026"
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-gold px-5 py-2 rounded-xl font-bold"
                    >
                      Publish Voucher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: BANNERS & PROMOTIONS STUDIO (🖼️ Banners)
          ========================================================================= */}
      {currentTab === 'banners' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>🖼️</span> WatchHub Storefront Banner & Campaign Studio
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage hero slider banners, category spotlights, campaign countdowns, and track click-through rates.
              </p>
            </div>
            <button
              onClick={() => setBannerModalOpen(true)}
              className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-4 h-4" /> Upload New Banner
            </button>
          </div>

          {/* Active Banners Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {banners.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
                {/* Visual Banner Preview Container */}
                <div className="relative h-48 bg-gray-900 overflow-hidden group">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-extrabold tracking-widest text-watch-gold uppercase bg-black/60 px-2.5 py-0.5 rounded w-fit mb-1 border border-watch-gold/40">
                      {b.badge}
                    </span>
                    <h4 className="text-lg font-extrabold leading-tight text-white">{b.title}</h4>
                    <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">{b.subtitle}</p>
                    <div className="mt-2.5">
                      <span className="inline-block px-3 py-1 bg-watch-gold text-watch-navy-dark text-[10.5px] font-black rounded-lg">
                        {b.ctaText} →
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow ${
                      b.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* Banner Metrics & Placement Controls */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-gray-500 text-[11px]">
                    <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      📌 {b.placement}
                    </span>
                    <span className="font-mono">{b.scheduled}</span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Impressions</span>
                      <span className="font-mono font-bold text-gray-900">{b.impressions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Clicks</span>
                      <span className="font-mono font-bold text-gray-900">{b.clicks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">CTR</span>
                      <span className="font-mono font-extrabold text-emerald-600">{b.ctr}</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <a
                      href={b.targetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-watch-gold hover:underline font-semibold text-[11px] flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Preview Landing Page
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBannerStatus(b.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                          b.status === 'Active'
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        {b.status === 'Active' ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Banner Modal */}
          {bannerModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                <h3 className="text-base font-bold text-gray-900 mb-1">Create Promotional Banner</h3>
                <p className="text-xs text-gray-500 mb-4">Add new hero carousel slides or category promo placements.</p>

                <form onSubmit={handleCreateBanner} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Banner Headline</label>
                    <input
                      type="text"
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      placeholder="e.g. The Luxury Tourbillon Exhibition"
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 font-bold outline-none focus:border-watch-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Subheadline Description</label>
                    <input
                      type="text"
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                      placeholder="e.g. Crafted with sapphire crystal and precision Swiss escapement."
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={newBanner.badge}
                        onChange={(e) => setNewBanner({ ...newBanner, badge: e.target.value })}
                        placeholder="e.g. LIMITED EDITION"
                        className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={newBanner.ctaText}
                        onChange={(e) => setNewBanner({ ...newBanner, ctaText: e.target.value })}
                        placeholder="e.g. Shop Collection"
                        className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Target Landing Page URL</label>
                      <input
                        type="text"
                        value={newBanner.targetLink}
                        onChange={(e) => setNewBanner({ ...newBanner, targetLink: e.target.value })}
                        placeholder="e.g. /products?cat=luxury"
                        className="w-full h-9 px-3 rounded-lg border border-gray-300 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Placement Slot</label>
                      <select
                        value={newBanner.placement}
                        onChange={(e) => setNewBanner({ ...newBanner, placement: e.target.value })}
                        className="w-full h-9 px-2 rounded-lg border border-gray-300 outline-none"
                      >
                        <option value="Homepage Hero Slider (Slot 1)">Homepage Hero Slider (Slot 1)</option>
                        <option value="Homepage Hero Slider (Slot 2)">Homepage Hero Slider (Slot 2)</option>
                        <option value="Homepage Hero Slider (Slot 3)">Homepage Hero Slider (Slot 3)</option>
                        <option value="Category Promo Spotlight">Category Promo Spotlight</option>
                        <option value="Top Announcement Strip">Top Announcement Strip</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Banner Image URL</label>
                    <input
                      type="url"
                      value={newBanner.image}
                      onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-9 px-3 rounded-lg border border-gray-300 text-[11px] font-mono outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setBannerModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-gold px-5 py-2 rounded-xl font-bold"
                    >
                      Save & Launch Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OffersCouponsModule;
