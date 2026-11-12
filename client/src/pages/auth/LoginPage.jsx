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
  CheckCircle2,
  X,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import luxuryHeroPanel from '../../assets/images/luxury-hero-panel.jpg';
import GoldenStarsBackground from '../../components/common/GoldenStarsBackground';

export const LoginPage = () => {
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [account, setAccount] = useState('customer@watchhub.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Modals state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp + new password
  const [forgotEmail, setForgotEmail] = useState('customer@watchhub.com');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

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
      setSuccessMessage(`Welcome back! Logged in as ${res.user.name || selectedRole}.`);
      setTimeout(() => {
        if (res.user.role === ROLES.CUSTOMER) {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }, 700);
    } else {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  // Google OAuth simulation
  const handleGoogleSelect = async (accountName, email) => {
    setGoogleLoading(true);
    const res = await loginWithGoogle({
      id: `usr_google_${Date.now()}`,
      name: accountName,
      email: email,
      role: ROLES.CUSTOMER,
      avatar: '👤',
      provider: 'Google OAuth 2.0',
      permissions: ['orders.own', 'cart.own', 'wishlist.own'],
    });
    setGoogleLoading(false);
    setShowGoogleModal(false);

    if (res.success) {
      setSuccessMessage(`Google Authentication Successful! Welcome, ${accountName}.`);
      setTimeout(() => {
        navigate('/');
      }, 700);
    }
  };

  // Forgot password flow
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotError('');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setEnteredOtp(otp); // prefill for instant convenience
    setForgotStep(2);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      setForgotError('Invalid verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotError('');
    await resetPassword(forgotEmail, newPassword);
    setPassword(newPassword);
    setAccount(forgotEmail);
    setForgotSuccess('Password updated successfully! You can now sign in.');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess('');
      setForgotStep(1);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050912] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-poppins selection:bg-[#C59341] selection:text-white relative overflow-hidden">
      {/* ── Premium Animated Golden Stars Background (Pointer-events: none, z-0) ── */}
      <GoldenStarsBackground />

      {/* 2-Column Luxury Split Card matching Reference Design */}
      <div className="w-full max-w-5xl rounded-[28px] overflow-hidden shadow-2xl border border-white/10 bg-[#0A101A] grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
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
            <div className="mb-5">
              <h2 className="font-serif text-3xl sm:text-[34px] font-bold text-[#0E1724] tracking-tight">
                Welcome back
              </h2>
              <p className="text-gray-500 text-xs sm:text-[13px] mt-1">
                Sign in to your WatchHub account.
              </p>
            </div>

            {/* Success Notification */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl mb-4 flex items-center gap-2 shadow-xs animate-fade-in font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

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
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotEmail(account);
                      setForgotStep(1);
                      setForgotError('');
                      setForgotSuccess('');
                    }}
                    className="text-[#C4913B] hover:underline text-xs font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Sign In Button (Golden-Amber Gradient) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#C4913B] via-[#C99645] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
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
              onClick={() => setShowGoogleModal(true)}
              className="w-full h-11 border border-[#E5E0D6] bg-white hover:bg-[#F4EFE6] active:scale-[0.99] rounded-xl flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-gray-700 shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
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

      {/* ════════════════════════════════════════════════════════════════
          GOOGLE OAUTH ACCOUNT SELECTION MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-poppins">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 relative animate-scale-up">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-semibold text-gray-800 text-sm">Sign in with Google</span>
            </div>
            <p className="text-xs text-gray-500 mb-5">Choose an account to continue to WatchHub India</p>

            {googleLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-[#4285F4] animate-spin" />
                <span className="text-xs font-semibold text-gray-700">Connecting Google Account...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleGoogleSelect('Ananya Singh', 'ananya.singh@gmail.com')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[#4285F4] text-white flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">Ananya Singh</p>
                    <p className="text-[11px] text-gray-500 truncate">ananya.singh@gmail.com</p>
                  </div>
                </button>

                <button
                  onClick={() => handleGoogleSelect('Shreyas Y.', 'shreyas.watchhub@gmail.com')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[#34A853] text-white flex items-center justify-center font-bold text-sm">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">Shreyas Y. (VIP Member)</p>
                    <p className="text-[11px] text-gray-500 truncate">shreyas.watchhub@gmail.com</p>
                  </div>
                </button>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-bit Secure OAuth
                  </span>
                  <button
                    onClick={() => handleGoogleSelect('WatchHub Customer', account || 'user@gmail.com')}
                    className="text-[#4285F4] font-semibold hover:underline"
                  >
                    Use current email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          FORGOT PASSWORD & INSTANT OTP RESET MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-poppins">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative animate-scale-up">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#C4913B] mb-3">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">Reset Your Password</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-5">
              {forgotStep === 1
                ? 'Enter your registered email address to receive an instant verification OTP.'
                : 'Enter the verification OTP and choose your new password.'}
            </p>

            {forgotError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl mb-3 text-center">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5">Registered Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@watchhub.com"
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-[#C4913B] outline-none"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
                {/* Generated OTP Notice */}
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-xs">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span>🔑</span> Verification OTP: <span className="font-mono text-base font-bold text-[#C4913B]">{generatedOtp}</span>
                  </p>
                  <p className="text-[10.5px] text-amber-700 mt-0.5">Auto-filled for instant verification convenience.</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 482910"
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 font-mono text-center tracking-widest text-base font-bold focus:border-[#C4913B] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs focus:border-[#C4913B] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs focus:border-[#C4913B] outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>Update Password & Sign In</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
