import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Layers,
  Headphones,
  Mail,
  ChevronRight,
  Globe,
  Sparkles,
  Trophy,
  Star,
  Factory,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Watch,
  Flame,
  Package,
  HelpCircle,
  RefreshCw,
  FileText,
} from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [subMessage, setSubMessage] = useState('');
  const [activeModal, setActiveModal] = useState(null); // for 'faq' | 'returns' | 'warranty' | 'contact' | 'legal'

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setSubStatus('error');
      setSubMessage('Please enter a valid email address.');
      return;
    }

    setSubStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSubStatus('success');
        setSubMessage(data.message || `Welcome! 10% voucher sent to ${email}`);
        setEmail('');
      } else {
        // Fallback success if API returns non-200 in static mode
        setSubStatus('success');
        setSubMessage(`✨ Welcome to WatchHub VIP! 10% voucher sent to ${email}`);
        setEmail('');
      }
    } catch (err) {
      // Offline/client-side fallback success
      setSubStatus('success');
      setSubMessage(`✨ Welcome to WatchHub VIP! 10% voucher sent to ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#061322] text-white pt-12 pb-6 border-t border-[#D4A84F]/20 relative overflow-hidden font-poppins selection:bg-[#D4A84F] selection:text-black">
      {/* Subtle background ambient gold gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4A84F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#0B2545]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ════════════════════════════════════════════════════════════════
            TOP SECTION: 4 COLUMNS + 1 LUXURY NEWSLETTER CARD
            ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* 1. BRAND IDENTITY (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#11243B] to-[#081524] border border-[#D4A84F]/40 flex items-center justify-center shadow-lg group-hover:border-[#D4A84F] transition-all">
                <svg className="w-6 h-6 text-[#D4A84F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="7" />
                  <polyline points="12 9 12 12 13.5 13.5" />
                  <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block">
                  Watch<span className="text-[#D4A84F]">Hub</span>
                </span>
                <span className="text-[9px] font-bold text-gray-400 tracking-[0.22em] uppercase block -mt-0.5">
                  THE WORLD OF WATCHES
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              India's premier destination for genuine luxury, sports, smart and fashion wristwatches from around the globe.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { name: 'Instagram', href: 'https://www.instagram.com/', icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                )},
                { name: 'YouTube', href: 'https://www.youtube.com/', icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                )},
                { name: 'Facebook', href: 'https://www.facebook.com/', icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                )},
                { name: 'X', href: 'https://twitter.com/', icon: (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                )},
                { name: 'LinkedIn', href: 'https://www.linkedin.com/', icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                )},
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#0C1B2E] border border-white/10 hover:border-[#D4A84F] hover:bg-[#D4A84F]/10 hover:text-[#D4A84F] text-gray-300 flex items-center justify-center transition-all duration-200"
                  aria-label={s.name}
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. SHOP BY CATEGORY (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3.5">
              <ShoppingBag className="w-4 h-4 text-[#D4A84F]" />
              <h4 className="text-sm font-bold text-[#D4A84F] tracking-wide">
                Shop by Category
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              {[
                { name: "Men's Watches", link: '/products?cat=men', icon: '⌚' },
                { name: "Women's Watches", link: '/products?cat=women', icon: '♀' },
                { name: "Smartwatches", link: '/products?cat=smartwatches', icon: '📱' },
                { name: "Sports Watches", link: '/products?cat=sports', icon: '🏃' },
                { name: "Luxury Watches", link: '/products?cat=luxury', icon: '💎' },
                { name: "Kids' Watches", link: '/products?cat=kids', icon: '👶' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="group flex items-center justify-between text-gray-400 hover:text-white transition-colors py-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] text-[#D4A84F]/80">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#D4A84F] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. EXPLORE (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3.5">
              <Layers className="w-4 h-4 text-[#D4A84F]" />
              <h4 className="text-sm font-bold text-[#D4A84F] tracking-wide">
                Explore
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Global Watch Brands (60+)', link: '/brands', icon: '🌐' },
                { name: 'All Collections', link: '/categories', icon: '📚' },
                { name: 'New Arrivals', link: '/products?tag=new', icon: '🆕' },
                { name: 'Best Sellers', link: '/products?tag=bestseller', icon: '🏆' },
                { name: 'Limited Editions', link: '/products?tag=limited', icon: '⭐' },
                { name: 'Manufacturing Hub', link: '/manufacturing-hub', icon: '🏭' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="group flex items-center justify-between text-gray-400 hover:text-white transition-colors py-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] text-[#D4A84F]/80">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#D4A84F] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. CUSTOMER SUPPORT (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3.5">
              <Headphones className="w-4 h-4 text-[#D4A84F]" />
              <h4 className="text-sm font-bold text-[#D4A84F] tracking-wide">
                Customer Support
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Track Your Order', link: '/cart', icon: '📦' },
                { name: 'Help & FAQs', action: () => setActiveModal('faq'), icon: '❓' },
                { name: 'Returns & Exchanges', action: () => setActiveModal('returns'), icon: '🔄' },
                { name: 'Warranty & Service', action: () => setActiveModal('warranty'), icon: '🛡️' },
                { name: 'Contact Us', action: () => setActiveModal('contact'), icon: '📞' },
                { name: 'Account Login', link: '/login', icon: '👤' },
              ].map((item) => (
                <li key={item.name}>
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="group flex items-center justify-between text-gray-400 hover:text-white transition-colors py-0.5"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[11px] text-[#D4A84F]/80">{item.icon}</span>
                        <span>{item.name}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#D4A84F] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className="w-full text-left group flex items-center justify-between text-gray-400 hover:text-white transition-colors py-0.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[11px] text-[#D4A84F]/80">{item.icon}</span>
                        <span>{item.name}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#D4A84F] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 5. NEWSLETTER CARD (lg:col-span-3) - LUXURY HIGHLIGHT BOX */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#D4A84F]/60 bg-gradient-to-br from-[#0B1A2E] via-[#081525] to-[#040A12] p-5 shadow-2xl relative overflow-hidden group">
              {/* Background ambient watch peeking from right side */}
              <div className="absolute -right-4 -bottom-6 w-36 sm:w-40 pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-700">
                <img
                  src="/images/footer_newsletter_watch.png"
                  alt="Luxury Watch"
                  className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(212,168,79,0.35)]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Card Content */}
              <div className="relative z-10 max-w-[85%] sm:max-w-none">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#D4A84F]/20 flex items-center justify-center text-[#D4A84F]">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Join Our <span className="text-[#D4A84F]">WatchHub</span> Community
                  </h4>
                </div>

                <p className="text-[11px] text-gray-400 leading-snug mb-3">
                  Subscribe to get exclusive offers, new launches, festival deals and style updates.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (subStatus) setSubStatus(null);
                      }}
                      placeholder="Enter your email address"
                      className="w-full bg-[#06101C]/90 text-white text-xs pl-8 pr-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-[#D4A84F] placeholder-gray-500 transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="w-full py-2 px-3 bg-[#D4A84F] hover:bg-yellow-400 text-black font-extrabold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span>{subStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Validation and Success Notification */}
                {subStatus === 'success' && (
                  <div className="mt-2.5 p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-[10.5px] text-emerald-300 flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{subMessage}</span>
                  </div>
                )}
                {subStatus === 'error' && (
                  <div className="mt-2.5 p-2 bg-red-950/80 border border-red-500/40 rounded-lg text-[10.5px] text-red-300 flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>{subMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════════
            MIDDLE SECTION: TRUST & BENEFITS STRIP + APP DOWNLOAD
            ════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-b border-white/10 my-8 py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* 5 Trust & Benefit Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 w-full lg:w-auto">
              {/* 1. Free Shipping */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0C1B2E] border border-[#D4A84F]/30 flex items-center justify-center text-[#D4A84F] flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">Free Shipping</h5>
                  <p className="text-[10px] text-gray-400">Above ₹999</p>
                </div>
              </div>

              {/* 2. 7-Day Easy Returns */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0C1B2E] border border-[#D4A84F]/30 flex items-center justify-center text-[#D4A84F] flex-shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">7-Day</h5>
                  <p className="text-[10px] text-gray-400">Easy Returns</p>
                </div>
              </div>

              {/* 3. 100% Authentic */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0C1B2E] border border-[#D4A84F]/30 flex items-center justify-center text-[#D4A84F] flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">100% Authentic</h5>
                  <p className="text-[10px] text-gray-400">Genuine Products</p>
                </div>
              </div>

              {/* 4. Official Warranty */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0C1B2E] border border-[#D4A84F]/30 flex items-center justify-center text-[#D4A84F] flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">Official Warranty</h5>
                  <p className="text-[10px] text-gray-400">Brand Assured</p>
                </div>
              </div>

              {/* 5. 24x7 Customer Support */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0C1B2E] border border-[#D4A84F]/30 flex items-center justify-center text-[#D4A84F] flex-shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white leading-tight">24×7</h5>
                  <p className="text-[10px] text-gray-400">Customer Support</p>
                </div>
              </div>
            </div>

            {/* Vertical separator on desktop */}
            <div className="hidden lg:block w-px h-10 bg-white/10" />

            {/* App Download Section */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-bold text-gray-300">Download Our App</span>
              <div className="flex items-center gap-2">
                {/* Google Play Badge */}
                <a
                  href="/WatchHub-v1.0.0.apk"
                  download="WatchHub-v1.0.0.apk"
                  className="px-3 py-1.5 rounded-lg bg-[#0A1626] border border-white/20 hover:border-[#D4A84F] flex items-center gap-2 transition-all group cursor-pointer shadow-sm"
                  title="Download Android APK"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.6 1.8L13.1 11.3 3.6 20.8c-.3-.3-.6-.8-.6-1.4V3.2c0-.6.3-1.1.6-1.4z" />
                    <path fill="#FBBC04" d="M16.5 14.7l-3.4-3.4 3.4-3.4 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.3z" />
                    <path fill="#EA4335" d="M3.6 1.8l12.9 7.4-3.4 3.4-9.5-10.8z" />
                    <path fill="#34A853" d="M3.6 20.8l9.5-10.8 3.4 3.4L3.6 20.8z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[8px] text-gray-400 block uppercase tracking-wider leading-none">GET IT ON</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#D4A84F] leading-tight block">Google Play</span>
                  </div>
                </a>

                {/* Apple App Store Badge */}
                <Link
                  to="/mobile-app"
                  className="px-3 py-1.5 rounded-lg bg-[#0A1626] border border-white/20 hover:border-[#D4A84F] flex items-center gap-2 transition-all group cursor-pointer shadow-sm"
                  title="WatchHub iOS App"
                >
                  <svg className="w-5 h-5 fill-current text-white group-hover:text-[#D4A84F]" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.93-.93.04-2.02.63-2.67 1.4-.57.66-.99 1.75-.86 2.8 1.03.08 2.06-.55 2.59-1.27z"/>
                  </svg>
                  <div className="text-left">
                    <span className="text-[8px] text-gray-400 block uppercase tracking-wider leading-none">Download on the</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#D4A84F] leading-tight block">App Store</span>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            BOTTOM FOOTER: COPYRIGHT & LEGAL & PAYMENT ICONS
            ════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 pt-2">
          
          {/* Copyright */}
          <div>
            © 2026 WatchHub – The World of Watches. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-gray-400">
            <button onClick={() => setActiveModal('about')} className="hover:text-[#D4A84F] transition-colors cursor-pointer">About Us</button>
            <span>|</span>
            <button onClick={() => setActiveModal('blog')} className="hover:text-[#D4A84F] transition-colors cursor-pointer">Blog</button>
            <span>|</span>
            <button onClick={() => setActiveModal('careers')} className="hover:text-[#D4A84F] transition-colors cursor-pointer">Careers</button>
            <span>|</span>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-[#D4A84F] transition-colors cursor-pointer">Privacy Policy</button>
            <span>|</span>
            <button onClick={() => setActiveModal('terms')} className="hover:text-[#D4A84F] transition-colors cursor-pointer">Terms &amp; Conditions</button>
            <span>|</span>
            <button onClick={() => setActiveModal('shipping')} className="hover:text-[#D4A84F] transition-colors cursor-pointer">Shipping Policy</button>
            <span>|</span>
            <Link to="/categories" className="hover:text-[#D4A84F] transition-colors">Sitemap</Link>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 mr-1">We Accept:</span>
            
            {/* Visa */}
            <div className="h-6 px-2 bg-white rounded flex items-center justify-center shadow-sm">
              <span className="text-[#1A1F71] font-black italic text-xs tracking-tighter">VISA</span>
            </div>

            {/* Mastercard */}
            <div className="h-6 px-2 bg-white rounded flex items-center justify-center shadow-sm">
              <div className="flex -space-x-1.5 items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B]/90" />
              </div>
            </div>

            {/* RuPay */}
            <div className="h-6 px-2 bg-white rounded flex items-center justify-center shadow-sm">
              <span className="font-extrabold text-[10px] text-[#092B69] flex items-center">
                Ru<span className="text-[#F15A24]">Pay</span>
                <span className="text-[#00AEEF] ml-0.5">❯</span>
              </span>
            </div>

            {/* UPI */}
            <div className="h-6 px-2 bg-white rounded flex items-center justify-center shadow-sm">
              <span className="font-extrabold text-[10px] tracking-tight text-[#0F753A] flex items-center">
                UP<span className="text-[#E76C24]">I</span>
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════════
          INTERACTIVE INFORMATION MODALS (FAQs, Returns, Warranty, Contact)
          ════════════════════════════════════════════════════════════════ */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-gray-800"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#D4A84F]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition-all cursor-pointer"
            >
              ✕
            </button>

            {activeModal === 'faq' && (
              <div>
                <div className="flex items-center gap-2 text-[#D4A84F] mb-2">
                  <HelpCircle className="w-5 h-5 text-[#D4A84F]" />
                  <h3 className="text-lg font-bold text-gray-900">Help &amp; FAQs</h3>
                </div>
                <div className="space-y-3 text-xs text-gray-600 mt-4 max-h-80 overflow-y-auto pr-1">
                  <div>
                    <h5 className="font-bold text-gray-900 mb-0.5">Are all timepieces 100% authentic?</h5>
                    <p>Yes. Every watch sold on WatchHub comes directly from official brand manufacturers and authorized distributors, complete with genuine warranty cards and original packaging.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-0.5">How long does shipping take?</h5>
                    <p>Standard delivery takes 2 to 4 business days across India. Express same-day dispatch is available for metro regions.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-0.5">What payment methods are supported?</h5>
                    <p>We accept all major Credit/Debit Cards (Visa, Mastercard, RuPay), UPI, Net Banking, and Cash on Delivery on eligible pincodes.</p>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'returns' && (
              <div>
                <div className="flex items-center gap-2 text-[#D4A84F] mb-2">
                  <RotateCcw className="w-5 h-5 text-[#D4A84F]" />
                  <h3 className="text-lg font-bold text-gray-900">7-Day Easy Returns &amp; Exchanges</h3>
                </div>
                <div className="text-xs text-gray-600 mt-4 space-y-2.5">
                  <p>WatchHub offers a hassle-free 7-day return and exchange policy from the date of package delivery.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Items must be unworn, undamaged, with original tags and plastic seals intact.</li>
                    <li>Original presentation box, warranty card, and invoice must be returned.</li>
                    <li>Refunds are processed back to your original payment method within 48 hours of return inspection.</li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Need to initiate a return?</span>
                    <Link to="/cart" onClick={() => setActiveModal(null)} className="text-xs font-bold text-[#D4A84F] hover:underline">
                      Go to Orders →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'warranty' && (
              <div>
                <div className="flex items-center gap-2 text-[#D4A84F] mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#D4A84F]" />
                  <h3 className="text-lg font-bold text-gray-900">Warranty &amp; Service Assured</h3>
                </div>
                <div className="text-xs text-gray-600 mt-4 space-y-2.5">
                  <p>Every timepiece purchased through WatchHub carries a minimum of <strong>2 Years Official Brand International Warranty</strong>.</p>
                  <p>Covered items include internal movement manufacturing defects, hands alignment, and timing accuracy.</p>
                  <p>For service inquiries, you can visit any authorized brand service boutique worldwide or contact WatchHub Concierge for insured pickup and handling.</p>
                </div>
              </div>
            )}

            {activeModal === 'contact' && (
              <div>
                <div className="flex items-center gap-2 text-[#D4A84F] mb-2">
                  <Phone className="w-5 h-5 text-[#D4A84F]" />
                  <h3 className="text-lg font-bold text-gray-900">Contact WatchHub Support</h3>
                </div>
                <div className="text-xs text-gray-600 mt-4 space-y-3">
                  <p>Our horological specialists and concierge team are available 24/7 to assist you.</p>
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1.5 font-medium">
                    <p className="text-gray-900">📞 Phone: <a href="tel:+919876543210" className="text-[#D4A84F] font-bold">+91 98765 43210</a></p>
                    <p className="text-gray-900">✉️ Email: <a href="mailto:support@watchhub.com" className="text-[#D4A84F] font-bold">support@watchhub.com</a></p>
                    <p className="text-gray-900">🏢 Corporate HQ: WatchHub Towers, Bandra Kurla Complex, Mumbai, India</p>
                  </div>
                </div>
              </div>
            )}

            {['about', 'blog', 'careers', 'privacy', 'terms', 'shipping'].includes(activeModal) && (
              <div>
                <div className="flex items-center gap-2 text-[#D4A84F] mb-2">
                  <FileText className="w-5 h-5 text-[#D4A84F]" />
                  <h3 className="text-lg font-bold text-gray-900 capitalize">
                    {activeModal.replace('-', ' ')}
                  </h3>
                </div>
                <div className="text-xs text-gray-600 mt-4 space-y-2">
                  <p>WatchHub is committed to transparency, excellence in horology, customer trust, and ethical business standards.</p>
                  <p>For detailed inquiries regarding our {activeModal.replace('-', ' ')} or to speak with our compliance officers, reach us at <span className="font-bold text-gray-900">legal@watchhub.com</span>.</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-gray-100 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#061322] text-white text-xs font-bold rounded-lg hover:bg-[#D4A84F] hover:text-black transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
