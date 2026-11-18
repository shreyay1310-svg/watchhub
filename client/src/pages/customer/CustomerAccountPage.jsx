import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import {
  User,
  Package,
  Heart,
  PenTool,
  Award,
  Wallet,
  Bell,
  Lock,
  Headphones,
  MapPin,
  Truck,
  Download,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  LogOut
} from 'lucide-react';

export const CustomerAccountPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user, logout } = useAuth();
  const { wishlist, formatPrice: cartFormatPrice } = useCart();
  const { formatPrice } = useCurrencyLanguage();
  const navigate = useNavigate();

  // Mock Orders with authentic watches matching the reference designs
  const ordersList = [
    {
      id: 'WH125904',
      name: 'Rolex Submariner Date 41mm',
      category: 'Automatic • Oystersteel',
      date: '12 Nov 2026',
      amount: 980000,
      paymentStatus: 'PAID',
      status: 'Delivered',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      awb: 'AWB-SWISS-91823712',
      image: '/images/products/rolex-submariner.png',
    },
    {
      id: 'WH125620',
      name: 'Tissot PRX Powermatic 80',
      category: '40mm • Blue Sunburst Dial',
      date: '05 Nov 2026',
      amount: 42500,
      paymentStatus: 'PAID',
      status: 'In Transit',
      statusColor: 'text-[#00CFFF] bg-[#00CFFF]/10 border-[#00CFFF]/30',
      awb: 'AWB-SWISS-78321045',
      image: '/images/products/tissot-prx.png',
    },
    {
      id: 'WH124801',
      name: 'Chronoswiss Open Gear Flying Tourbillon Paraiba',
      category: 'Manufacture C.303 • Limited Edition',
      date: '18 Oct 2026',
      amount: 3450000,
      paymentStatus: 'PAID',
      status: 'Delivered',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      awb: 'AWB-SWISS-54910283',
      image: '/images/hero/chronoswiss_tourbillon.jpg',
    },
  ];

  const handleDownloadInvoice = (orderId) => {
    alert(`Generating Certified Tax Invoice & Provenance Certificate for Order ${orderId}...`);
  };

  const navItems = [
    { id: 'orders', label: 'My Orders', icon: Package, badge: '3' },
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'custom_designs', label: 'Custom Designs', icon: PenTool },
    { id: 'rewards', label: 'VIP Rewards & Club', icon: Award },
    { id: 'wallet', label: 'Horology Wallet', icon: Wallet },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
    { id: 'security', label: 'Password & Security', icon: Lock },
    { id: 'support', label: 'Support Requests', icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Account Header */}
        <div className="bg-gradient-to-r from-[#061224] via-[#040C1A] to-[#020813] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#F4B942] to-amber-600 text-black font-extrabold flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(244,185,66,0.3)]">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {user?.name || 'Alexander Sterling'}
                </h1>
                <span className="text-[10px] font-bold text-[#F4B942] bg-[#F4B942]/15 border border-[#F4B942]/30 px-2 py-0.5 rounded-full">
                  VIP CONNOISSEUR
                </span>
              </div>
              <p className="text-xs text-[#A6B1C8] mt-0.5">{user?.email || 'collector@watchhub.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/customize-watch"
              className="py-2.5 px-4 rounded-xl border border-[#00CFFF]/40 bg-[#00CFFF]/10 hover:bg-[#00CFFF]/20 text-[#00CFFF] font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Watch Studio</span>
            </Link>
            <button
              onClick={logout}
              className="py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            2-COLUMN LAYOUT: SIDEBAR NAV + CONTENT VIEW
            ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT NAVIGATION TABS (lg:col-span-3) ── */}
          <aside className="lg:col-span-3 bg-[#040C1A] border border-white/10 rounded-3xl p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#00A3FF]/10 text-[#00CFFF] border border-[#00CFFF]/30 shadow-[0_0_15px_rgba(0,207,255,0.15)]'
                      : 'text-[#A6B1C8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* ── RIGHT MAIN PANEL (lg:col-span-9) ── */}
          <section className="lg:col-span-9 bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 min-h-[500px]">
            
            {/* 1. MY ORDERS TAB (Exact match to Section 12) */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Acquisition History &amp; Orders</h2>
                    <p className="text-[11px] text-[#A6B1C8]">Review all certified watch purchases and delivery statuses.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/orders"
                      className="py-1.5 px-3 rounded-xl bg-[#6500FF]/20 text-[#00CFFF] border border-[#6500FF]/40 font-bold text-xs flex items-center gap-1.5 hover:bg-[#6500FF]/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Full Orders &amp; Tracking Portal</span>
                    </Link>
                    <span className="text-xs font-bold text-[#F4B942] bg-[#F4B942]/10 px-3 py-1 rounded-full border border-[#F4B942]/20">
                      {ordersList.length} Acquired
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {ordersList.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#020813] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={order.image}
                          alt={order.name}
                          className="w-16 h-16 rounded-xl object-contain bg-[#061224] border border-white/10 p-1 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#00CFFF]">#{order.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">{order.name}</h4>
                          <p className="text-[11px] text-[#A6B1C8]">{order.category} • Placed {order.date}</p>
                          <p className="text-[11px] text-[#F4B942] font-mono font-bold mt-1">
                            {formatPrice(order.amount)} • {order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <Link
                          to={`/orders?tab=tracking&id=${order.id}`}
                          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-bold text-[11px] flex items-center gap-1.5 shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Order</span>
                        </Link>
                        <Link
                          to={`/orders?tab=detail&id=${order.id}`}
                          className="py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-[11px] font-semibold flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5 text-[#00CFFF]" />
                          <span>Details</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-400" />
                          <span>Invoice</span>
                        </button>
                        <Link
                          to={`/returns-refunds?orderId=${order.id}`}
                          className="py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#F4B942]" />
                          <span>Return</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-fade-in text-xs max-w-xl">
                <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
                  Personal Information & Dossier
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-400">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'Alexander Sterling'}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'collector@watchhub.com'}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Direct Phone Number (Courier Verified)</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Profile changes committed to encrypted vault.')}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            )}

            {/* 3. SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
                  Verified Delivery Addresses
                </h2>
                <div className="p-4 rounded-2xl bg-[#020813] border border-[#00CFFF]/40 space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>Primary Luxury Residence (Default)</span>
                    <span className="text-[#00CFFF] text-[10px]">VERIFIED</span>
                  </div>
                  <p className="text-gray-300">Barton Manor, Luxury Boulevard No. 12, Penthouse Suite 8B</p>
                  <p className="text-gray-400">Mumbai, Maharashtra 400051, India • +91 98765 43210</p>
                </div>
              </div>
            )}

            {/* 4. REWARDS */}
            {activeTab === 'rewards' && (
              <div className="space-y-5 animate-fade-in text-xs">
                <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
                  WatchHub VIP Horology Club
                </h2>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10243C] to-[#040C1A] border border-[#F4B942]/40 text-center space-y-2">
                  <span className="text-2xl">👑</span>
                  <h3 className="text-lg font-bold text-[#F4B942]">VIP Tier: Patron of Chronometry</h3>
                  <p className="text-gray-300 text-xs">
                    You have accumulated <strong className="text-white font-mono">14,250 Horology Points</strong> from certified timepiece acquisitions.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Privileges: First-access allocations to Limited Edition Chronoswiss releases & complimentary annual movement regulation.
                  </p>
                </div>
              </div>
            )}

            {/* 5. HOROLOGY WALLET */}
            {activeTab === 'wallet' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
                  WatchHub Horology Store Credit
                </h2>
                <div className="p-5 rounded-2xl bg-[#020813] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Available Store Balance</p>
                    <p className="text-2xl font-bold font-mono text-[#39F5A5] mt-1">{formatPrice(50000)}</p>
                  </div>
                  <button
                    onClick={() => navigate('/products')}
                    className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                  >
                    Redeem on Collection
                  </button>
                </div>
              </div>
            )}

            {/* 6. NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
                  Concierge Notifications & Alerts
                </h2>
                <div className="p-4 rounded-2xl bg-[#020813] border border-white/10 flex items-start gap-3">
                  <span className="text-base text-[#00CFFF]">🚀</span>
                  <div>
                    <p className="font-bold text-white">Order #WH125620 Reached Destination Hub</p>
                    <p className="text-[#A6B1C8] text-[11px]">Your Tissot PRX has arrived in Mumbai and is scheduled for courier dispatch today.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#020813] border border-white/10 flex items-start gap-3">
                  <span className="text-base text-[#F4B942]">💎</span>
                  <div>
                    <p className="font-bold text-white">Chronoswiss Atelier Release Allocation</p>
                    <p className="text-[#A6B1C8] text-[11px]">Piece No. 4/15 of the Open Gear Flying Tourbillon Paraiba has been verified in Lucerne.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-4 animate-fade-in text-xs max-w-md">
                <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
                  Password & Security Settings
                </h2>
                <div className="space-y-2">
                  <label className="text-gray-400">Current Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-400">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Password updated successfully.')}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs"
                >
                  Update Password
                </button>
              </div>
            )}

            {/* 8. SUPPORT */}
            {activeTab === 'support' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h2 className="text-lg font-serif font-bold text-white border-b border-white/10 pb-3">
                  Customer Support Requests
                </h2>
                <p className="text-[#A6B1C8]">Need guidance with provenance certificates, custom straps or warranty?</p>
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-[#00CFFF]/20 border border-[#00CFFF]/40 text-[#00CFFF] font-bold"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Open Helpdesk & Support Concierge</span>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerAccountPage;
