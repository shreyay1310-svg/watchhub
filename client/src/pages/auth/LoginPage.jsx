import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Store,
  Package,
  Truck,
  Headphones,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import luxuryHeroPanel from '../../assets/images/luxury-hero-panel.jpg';

export const LoginPage = () => {
  const { login } = useAuth();
  const [account, setAccount] = useState('customer@watchhub.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Exactly matching the 5 role tabs from the reference UI
  const ROLE_TABS = [
    {
      id: ROLES.CUSTOMER,
      line1: 'Customer',
      line2: '',
      icon: User,
      email: 'customer@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.STORE_ADMIN,
      line1: 'Store',
      line2: 'Admin',
      icon: Store,
      email: 'admin@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.INVENTORY_MANAGER,
      line1: 'Inventory',
      line2: 'Manager',
      icon: Package,
      email: 'inventory@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.DELIVERY_MANAGER,
      line1: 'Delivery',
      line2: 'Manager',
      icon: Truck,
      email: 'delivery@watchhub.com',
      password: 'Admin@123',
    },
    {
      id: ROLES.CUSTOMER_SUPPORT,
      line1: 'Customer',
      line2: 'Support',
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
      {/* 2-Column Luxury Split Card matching Reference Design */}
      <div className="w-full max-w-5xl rounded-[28px] overflow-hidden shadow-2xl border border-white/10 bg-[#0A101A] grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* ════════════════════════════════════════════════════════════════
            LEFT EDITORIAL PANEL: Pure, Uncompromised Luxury Watch Visual
            ════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[560px] lg:min-h-[640px] bg-[#070B12] overflow-hidden flex flex-col justify-between">
          {/* Integrated High-Resolution Luxury Hero Graphic (Zero text ghosting) */}
          <img
            src={luxuryHeroPanel}
            alt="WatchHub – Time, beautifully chosen"
            className="absolute inset-0 w-full h-full object-cover object-left-top select-none pointer-events-none"
          />

          {/* Clickable Brand Link over top-left logo area */}
          <Link
            to="/"
            title="Go to WatchHub Homepage"
            className="absolute top-8 left-8 sm:top-12 sm:left-12 w-48 h-10 z-20 cursor-pointer"
          />
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT LOGIN CARD: Warm Ivory, Seamless 5-Tab Bar & Form
            ════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 bg-[#FAF7F2] lg:rounded-l-[28px] p-6 sm:p-10 flex flex-col justify-between shadow-[-15px_0_35px_rgba(0,0,0,0.25)] relative z-20">
          
          <div>
            {/* 1. Horizontal Segmented Role Tabs (5 Clean Segments, No Text Cut-Off) */}
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#F2EDE4] rounded-xl border border-[#E8E2D5] mb-6">
              {ROLE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedRole === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleRoleSelect(tab)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-center transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-[#C4913B] to-[#AD7929] text-white shadow-sm font-semibold'
                        : 'text-[#4A5568] hover:text-[#1A202C] hover:bg-white/60'
                    }`}
                    title={`${tab.line1} ${tab.line2}`.trim()}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-[#4A5568]'}`} strokeWidth={1.8} />
                    <span className="text-[10px] leading-tight block font-medium">
                      {tab.line1}
                    </span>
                    {tab.line2 && (
                      <span className="text-[10px] leading-tight block font-medium">
                        {tab.line2}
                      </span>
                    )}
                  </button>
                );
              })}
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
              {/* Email Address */}
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
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#E5E0D6] bg-white text-gray-900 text-sm focus:border-[#C4913B] focus:ring-2 focus:ring-[#C4913B]/20 outline-none shadow-xs transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
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
                    className="w-full h-12 pl-10 pr-11 rounded-xl border border-[#E5E0D6] bg-white text-gray-900 text-sm focus:border-[#C4913B] focus:ring-2 focus:ring-[#C4913B]/20 outline-none shadow-xs transition-all"
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
                    onClick={() => alert('Password reset link sent to registered email address.')}
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

            {/* Continue with Google */}
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
