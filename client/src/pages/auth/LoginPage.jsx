import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Truck,
  RotateCcw,
  User,
  Store,
  Package,
  Headphones,
  Crown
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import watchesPedestal from '../../assets/images/watches-pedestal.jpg';

export const LoginPage = () => {
  const { login } = useAuth();
  const [account, setAccount] = useState('customer@watchhub.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Role credentials definitions matching the 5 tabs in reference image (plus Super Admin)
  const ROLE_TABS = [
    {
      id: ROLES.CUSTOMER,
      label: 'Customer',
      icon: User,
      email: 'customer@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.STORE_ADMIN,
      label: 'Store Admin',
      icon: Store,
      email: 'admin@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.INVENTORY_MANAGER,
      label: 'Inventory Manager',
      icon: Package,
      email: 'inventory@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.DELIVERY_MANAGER,
      label: 'Delivery Manager',
      icon: Truck,
      email: 'delivery@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.CUSTOMER_SUPPORT,
      label: 'Customer Support',
      icon: Headphones,
      email: 'support@watchhub.com',
      password: 'Admin@123',
    },
  ];

  const handleRoleSelect = (tab) => {
    setSelectedRole(tab.id);
    setAccount(tab.email);
    setPassword(tab.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    const res = await login(account, password, selectedRole);
    setLoading(false);

    if (res.success) {
      if (res.user.role === ROLES.CUSTOMER) {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#060A10] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-poppins selection:bg-[#C59341] selection:text-white">
      {/* Outer Card Container matching Reference UI */}
      <div className="w-full max-w-6xl rounded-[28px] overflow-hidden shadow-2xl border border-white/10 bg-[#0A101A] grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Subtle Luxury Gold Ambient Arc across top right of card */}
        <div 
          className="absolute top-0 right-0 lg:right-[45%] w-[500px] h-[300px] pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle at 100% 0%, rgba(217, 164, 65, 0.45) 0%, rgba(184, 134, 11, 0.15) 40%, transparent 70%)'
          }}
        />

        {/* ════════════════════════════════════════════════════════════════
            LEFT EDITORIAL PANEL: Dark Luxury Horology & Watches
            ════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#080E17] via-[#0A121E] to-[#070B12]">
          
          {/* Subtle Top Golden Border Curve */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441]/40 to-transparent" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              {/* Gold Octagonal Luxury Watch Icon */}
              <div className="w-8 h-8 flex items-center justify-center text-[#D9A441]">
                <svg viewBox="0 0 40 40" className="w-8 h-8 fill-none stroke-current stroke-[2.2]">
                  {/* Octagonal Bezel */}
                  <polygon points="12,4 28,4 36,12 36,28 28,36 12,36 4,28 4,12" />
                  {/* Round Inner Dial */}
                  <circle cx="20" cy="20" r="10" strokeWidth="1.8" />
                  {/* Hands at 10:10 */}
                  <line x1="20" y1="20" x2="16" y2="14" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="20" x2="25" y2="16" strokeWidth="2" strokeLinecap="round" />
                  {/* Center Pivot */}
                  <circle cx="20" cy="20" r="1.5" className="fill-[#D9A441]" />
                </svg>
              </div>

              {/* Vertical Hairline Divider */}
              <div className="w-[1px] h-6 bg-white/20" />

              {/* Brand Typography */}
              <span className="font-cinzel text-white text-base tracking-[0.25em] font-medium group-hover:text-[#D9A441] transition-colors">
                WATCHHUB
              </span>
            </Link>

            {/* Fine Gold Accent Line */}
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#D9A441] to-transparent mt-8 mb-6" />

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-[1.15] tracking-tight text-white font-normal">
              Time, beautifully <br />
              <span className="italic font-serif text-[#D9A441] font-medium">chosen.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed max-w-sm mt-4 font-light">
              Discover a curated collection of authentic, premium watches from the world's most trusted brands.
            </p>

            {/* 3 Trust Badges */}
            <div className="mt-8 sm:mt-10 space-y-5">
              {/* Badge 1: 100% Authentic */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D9A441] flex-shrink-0 pt-0.5">
                  <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold tracking-wide">100% Authentic</h4>
                  <p className="text-gray-400 text-xs mt-0.5 font-light">Guaranteed original watches with brand warranty</p>
                </div>
              </div>

              {/* Badge 2: Insured Free Delivery */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D9A441] flex-shrink-0 pt-0.5">
                  <Truck className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold tracking-wide">Insured Free Delivery</h4>
                  <p className="text-gray-400 text-xs mt-0.5 font-light">Safe, secure and free delivery on eligible orders</p>
                </div>
              </div>

              {/* Badge 3: 7-Day Easy Returns */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#D9A441] flex-shrink-0 pt-0.5">
                  <RotateCcw className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold tracking-wide">7-Day Easy Returns</h4>
                  <p className="text-gray-400 text-xs mt-0.5 font-light">Hassle-free returns within 7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Watches on Stone Pedestal Image (Aligned to right/bottom of left section) */}
          <div className="absolute right-[-10px] sm:right-2 bottom-0 w-[240px] sm:w-[310px] lg:w-[340px] pointer-events-none select-none z-0 opacity-85 lg:opacity-95">
            <img
              src={watchesPedestal}
              alt="Luxury Swiss Chronograph & Dress Watches"
              className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              style={{
                maskImage: 'linear-gradient(to top, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%)',
                WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%)'
              }}
            />
          </div>

          {/* Bottom Editorial Tagline */}
          <div className="relative z-10 pt-10 sm:pt-14 mt-auto">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#D9A441]/50" />
              <span className="font-serif italic text-[#D9A441] text-xs sm:text-[13px] tracking-wide">
                Curated for every moment
              </span>
              <span className="w-8 h-[1px] bg-[#D9A441]/50" />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT LOGIN CARD: Warm Ivory, Role Tabs & Elegant Form
            ════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 bg-[#FAF7F2] lg:rounded-l-[28px] p-6 sm:p-10 flex flex-col justify-between shadow-[-15px_0_35px_rgba(0,0,0,0.25)] relative z-20">
          
          <div>
            {/* 1. Horizontal Role Switcher Tabs (5 Segments) */}
            <div className="border-b border-[#E8E2D5] pb-3 mb-6">
              <div className="grid grid-cols-5 gap-1 bg-[#F2EDE4] p-1 rounded-xl">
                {ROLE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedRole === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleRoleSelect(tab)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-center transition-all ${
                        isActive
                          ? 'bg-gradient-to-b from-[#C4913B] to-[#AD7929] text-white shadow-sm font-semibold'
                          : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-white/50'
                      }`}
                      title={tab.label}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-[#4A5568]'}`} strokeWidth={1.8} />
                      <span className="text-[10px] leading-tight line-clamp-1 truncate w-full">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Super Admin Quick Access Pill */}
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[10.5px] text-gray-500 font-medium">Testing staff logins?</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(ROLES.SUPER_ADMIN);
                    setAccount('superadmin@watchhub.com');
                    setPassword('Admin@123');
                    setError('');
                  }}
                  className={`text-[10.5px] px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                    selectedRole === ROLES.SUPER_ADMIN
                      ? 'bg-[#101C2B] text-[#D9A441] font-bold'
                      : 'text-gray-500 hover:text-gray-900 bg-gray-200/60'
                  }`}
                >
                  <Crown className="w-3 h-3 text-[#D9A441]" /> Super Admin
                </button>
              </div>
            </div>

            {/* 2. Welcome Back Heading */}
            <div className="mb-6">
              <h2 className="font-serif text-3xl sm:text-[34px] font-bold text-[#0E1724] tracking-tight">
                Welcome back
              </h2>
              <p className="text-gray-500 text-xs sm:text-[13px] mt-1">
                Sign in to your WatchHub account.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            {/* 3. Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Email Field */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E5E0D6] bg-white text-gray-800 text-sm focus:border-[#C4913B] focus:ring-2 focus:ring-[#C4913B]/20 outline-none shadow-xs transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-[#E5E0D6] bg-white text-gray-800 text-sm focus:border-[#C4913B] focus:ring-2 focus:ring-[#C4913B]/20 outline-none shadow-xs transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right mt-1.5">
                  <a
                    href="javascript:void(0)"
                    onClick={() => alert('Password reset link sent to your email address.')}
                    className="text-[#C4913B] hover:underline text-xs font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Sign In Button (Golden-Amber Gradient) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#C4913B] via-[#C99645] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider: OR CONTINUE WITH */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E0D6]"></div>
              </div>
              <span className="relative bg-[#FAF7F2] px-3 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => alert('Redirecting to Google OAuth authentication...')}
              className="w-full h-11 border border-[#E5E0D6] bg-white hover:bg-[#F4EFE6] rounded-xl flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-gray-700 shadow-xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Footer: Create an account */}
          <div className="text-center mt-6 text-xs text-gray-600">
            New to WatchHub?{' '}
            <Link to="/signup" className="text-[#C4913B] font-semibold hover:underline">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
