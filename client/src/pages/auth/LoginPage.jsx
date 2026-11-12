import React, { useState, useEffect } from 'react';
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
  Smartphone,
  Phone,
  MessageSquare,
  Plus,
  UserPlus,
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
  const [showAddGoogleAccount, setShowAddGoogleAccount] = useState(false);
  const [newGoogleName, setNewGoogleName] = useState('');
  const [newGoogleEmail, setNewGoogleEmail] = useState('');
  const [googleAddError, setGoogleAddError] = useState('');

  // Stored Google Accounts (Persisted in localStorage)
  const [googleAccounts, setGoogleAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('watchhub_google_accounts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'acc_shreyas',
        name: 'Shreyas Y.',
        email: 'shreyas.watchhub@gmail.com',
        avatarBg: '#34A853',
        initial: 'S',
        badge: 'VIP Member',
      },
      {
        id: 'acc_ananya',
        name: 'Ananya Singh',
        email: 'ananya.singh@gmail.com',
        avatarBg: '#4285F4',
        initial: 'A',
        badge: 'Verified Buyer',
      },
    ];
  });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: input (mobile/email), 2: otp + new password
  const [forgotChannel, setForgotChannel] = useState('phone'); // 'phone' | 'email'
  const [forgotPhone, setForgotPhone] = useState('9876543210');
  const [forgotEmail, setForgotEmail] = useState('customer@watchhub.com');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [smsToast, setSmsToast] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown countdown for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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

  // Google OAuth Account Selection & Linking
  const handleGoogleSelect = async (accountName, email) => {
    setGoogleLoading(true);
    const res = await loginWithGoogle({
      id: `usr_google_${Date.now()}`,
      name: accountName,
      email: email,
      role: ROLES.CUSTOMER,
      avatar: '👤',
      provider: 'Google OAuth 2.0',
      isGoogleUser: true,
      permissions: ['orders.own', 'cart.own', 'wishlist.own'],
    });
    setGoogleLoading(false);
    setShowGoogleModal(false);
    setShowAddGoogleAccount(false);

    if (res.success) {
      setSuccessMessage(`Google Account Linked! Welcome back, ${accountName}.`);
      setTimeout(() => {
        navigate('/');
      }, 700);
    }
  };

  // Add & Link a new custom Google account
  const handleAddNewGoogleAccount = (e) => {
    e.preventDefault();
    if (!newGoogleName.trim()) {
      setGoogleAddError('Please enter your full name.');
      return;
    }
    if (!newGoogleEmail.trim() || !newGoogleEmail.includes('@')) {
      setGoogleAddError('Please enter a valid Google/Gmail address.');
      return;
    }
    setGoogleAddError('');

    const colors = ['#4285F4', '#34A853', '#EA4335', '#FBBC05', '#8E24AA'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newAcc = {
      id: `acc_${Date.now()}`,
      name: newGoogleName.trim(),
      email: newGoogleEmail.trim().toLowerCase(),
      avatarBg: randomColor,
      initial: newGoogleName.trim()[0].toUpperCase(),
      badge: 'Linked Google Account',
    };

    const updated = [newAcc, ...googleAccounts.filter((a) => a.email !== newAcc.email)];
    setGoogleAccounts(updated);
    try {
      localStorage.setItem('watchhub_google_accounts', JSON.stringify(updated));
    } catch {}

    // Instantly authenticate with this new Google account
    handleGoogleSelect(newAcc.name, newAcc.email);
  };

  // Forgot password flow (supports Customer Mobile SMS & Email)
  const handleSendOtp = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setForgotError('');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setEnteredOtp(otp); // prefill for instant convenience

    if (forgotChannel === 'phone') {
      const cleanDigits = forgotPhone.replace(/[^0-9]/g, '');
      if (cleanDigits.length < 10) {
        setForgotError('Please enter a valid 10-digit mobile number.');
        return;
      }
      const tenDigit = cleanDigits.slice(-10);
      setForgotPhone(tenDigit);

      // Trigger Realistic Simulated Mobile SMS Toast
      setSmsToast({
        phone: `+91 ${tenDigit.slice(0, 5)} ${tenDigit.slice(5)}`,
        otp: otp,
        time: 'Just now',
      });
      setTimeout(() => setSmsToast(null), 12000);
    } else {
      if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
        setForgotError('Please enter a valid email address.');
        return;
      }
    }

    setForgotStep(2);
    setResendCooldown(30);
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
    const targetIdentifier = forgotChannel === 'phone' ? forgotPhone : forgotEmail;
    await resetPassword(targetIdentifier, newPassword);
    setPassword(newPassword);

    const loginId = forgotChannel === 'phone' ? 'customer@watchhub.com' : forgotEmail;
    setAccount(loginId);

    setForgotSuccess(
      forgotChannel === 'phone'
        ? 'Mobile OTP verified! Password updated successfully. Signing you in...'
        : 'Password updated successfully! Signing you in...'
    );

    setTimeout(async () => {
      await login(loginId, newPassword);
      setShowForgotModal(false);
      setForgotSuccess('');
      setForgotStep(1);
      setSmsToast(null);
      navigate('/');
    }, 900);
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
            alt="WatchHub – Every second, a statement"
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
          GOOGLE OAUTH ACCOUNT SELECTION & LINKING MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-poppins">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 relative animate-scale-up">
            <button
              onClick={() => {
                setShowGoogleModal(false);
                setShowAddGoogleAccount(false);
                setGoogleAddError('');
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Brand Header */}
            <div className="flex items-center gap-2.5 mb-1.5">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <h4 className="font-bold text-gray-900 text-base">Sign in with Google</h4>
            </div>
            <p className="text-xs text-gray-500 mb-4">Choose an account to link with WatchHub</p>

            {googleLoading ? (
              <div className="py-10 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-[#4285F4] animate-spin" />
                <span className="text-xs font-semibold text-gray-700">Linking Google Account...</span>
                <span className="text-[11px] text-gray-400">Verifying secure OAuth credentials</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* List of Connected Google Accounts */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                  {googleAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => handleGoogleSelect(acc.name, acc.email)}
                      className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-gray-200/90 hover:bg-[#F8FAFD] hover:border-[#4285F4]/50 transition-all text-left cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0"
                          style={{ backgroundColor: acc.avatarBg || '#4285F4' }}
                        >
                          {acc.initial || acc.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#1a73e8] transition-colors">
                            {acc.name}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">{acc.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 bg-gray-100 group-hover:bg-[#E8F0FE] group-hover:text-[#1967D2] px-2 py-0.5 rounded-full font-medium transition-colors flex-shrink-0 ml-2">
                        {acc.badge || 'Google'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Add/Link Another Google Account Form */}
                {showAddGoogleAccount ? (
                  <form onSubmit={handleAddNewGoogleAccount} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/90 space-y-2.5 text-xs animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-[11px] flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5 text-[#4285F4]" />
                        Link Another Google Account
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddGoogleAccount(false);
                          setGoogleAddError('');
                        }}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    {googleAddError && (
                      <p className="text-[11px] text-rose-600 bg-rose-50 p-1.5 rounded-lg border border-rose-200">{googleAddError}</p>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={newGoogleName}
                        onChange={(e) => setNewGoogleName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full h-9 px-3 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#4285F4] bg-white"
                        required
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Google Email Address</label>
                      <input
                        type="email"
                        value={newGoogleEmail}
                        onChange={(e) => setNewGoogleEmail(e.target.value)}
                        placeholder="e.g. yourname@gmail.com"
                        className="w-full h-9 px-3 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#4285F4] bg-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-9 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Link & Continue with this Account</span>
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddGoogleAccount(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-gray-300 hover:border-[#4285F4] hover:bg-blue-50/40 text-gray-700 transition-all text-left text-xs font-medium cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Use another Google account</p>
                      <p className="text-[10.5px] text-gray-500">Link your personal Gmail or Google Workspace</p>
                    </div>
                  </button>
                )}

                {/* Footer security notes */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Google OAuth 2.0 Verified
                  </span>
                  <a
                    href="https://accounts.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4285F4] hover:underline"
                  >
                    accounts.google.com
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Realistic Simulated Mobile SMS Toast Notification ── */}
      {smsToast && (
        <div className="fixed top-5 right-5 sm:right-8 z-[100] max-w-sm w-full bg-[#0D1522] text-white p-4 rounded-2xl shadow-2xl border border-[#C4913B]/50 animate-bounce-in flex items-start gap-3.5 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C4913B] to-[#8C601E] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-[#F5D88A] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                SMS Message · {smsToast.time}
              </span>
              <button
                onClick={() => setSmsToast(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-100 font-medium mt-1 leading-snug">
              WatchHub OTP: Your password reset code is{' '}
              <strong className="font-mono text-sm font-bold text-[#F5D88A] bg-black/40 px-1.5 py-0.5 rounded border border-[#C4913B]/40">
                {smsToast.otp}
              </strong>
              . Valid for 10 mins.
            </p>
            <p className="text-[10.5px] text-gray-400 mt-1 flex items-center gap-1">
              <span>Delivered to</span>
              <span className="text-gray-300 font-semibold">{smsToast.phone}</span>
            </p>
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
              onClick={() => {
                setShowForgotModal(false);
                setSmsToast(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#C4913B] mb-3">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">Reset Your Password</h3>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">
              {forgotStep === 1
                ? (forgotChannel === 'phone'
                    ? 'Enter customer mobile number to receive an instant verification OTP via SMS.'
                    : 'Enter your registered email address to receive an instant verification OTP.')
                : `Enter the 6-digit OTP sent to your ${forgotChannel === 'phone' ? 'mobile number' : 'email'} and choose your new password.`}
            </p>

            {/* Step 1: Channel Switcher (Mobile SMS vs Email) */}
            {forgotStep === 1 && (
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-2xl mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setForgotChannel('phone');
                    setForgotError('');
                  }}
                  className={`h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    forgotChannel === 'phone'
                      ? 'bg-white text-[#C4913B] shadow-sm font-bold border border-gray-200/80'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile SMS OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotChannel('email');
                    setForgotError('');
                  }}
                  className={`h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    forgotChannel === 'email'
                      ? 'bg-white text-[#C4913B] shadow-sm font-bold border border-gray-200/80'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </button>
              </div>
            )}

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
                {forgotChannel === 'phone' ? (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1.5">Customer Mobile Number</label>
                    <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#C4913B] focus-within:ring-2 focus-within:ring-[#C4913B]/20 transition-all">
                      <div className="bg-gray-50 border-r border-gray-300 px-3 flex items-center gap-1.5 text-gray-700 font-semibold text-xs sm:text-sm select-none">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="98765 43210"
                        className="w-full h-11 px-3 text-xs sm:text-sm outline-none font-medium tracking-wide text-gray-900"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" /> SMS OTP Delivery Ready
                      </span>
                      <span>Default: 9876543210</span>
                    </div>
                  </div>
                ) : (
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
                )}

                <button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{forgotChannel === 'phone' ? 'Send OTP to Customer Mobile' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
                {/* Generated OTP Notice with Mobile badge */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/90 p-3 rounded-2xl text-amber-950 text-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs flex items-center gap-1.5 text-amber-900">
                        {forgotChannel === 'phone' ? (
                          <>
                            <Smartphone className="w-4 h-4 text-[#C4913B]" />
                            <span>OTP sent via SMS to <strong className="text-gray-900">+91 {forgotPhone}</strong></span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 text-[#C4913B]" />
                            <span>OTP sent to <strong className="text-gray-900">{forgotEmail}</strong></span>
                          </>
                        )}
                      </p>
                      <p className="text-[11px] text-amber-700 mt-0.5">Auto-filled for instant verification convenience.</p>
                    </div>
                    <div className="bg-white border border-amber-200 px-2.5 py-1 rounded-xl text-center shadow-xs">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">OTP</span>
                      <span className="font-mono text-sm font-bold text-[#C4913B] tracking-wider">{generatedOtp}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 482910"
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 font-mono text-center tracking-widest text-base font-bold focus:border-[#C4913B] outline-none bg-gray-50/50"
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

                {/* Resend Link and Channel Info */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-gray-500 hover:text-gray-800 underline"
                  >
                    Change number
                  </button>

                  {resendCooldown > 0 ? (
                    <span className="text-gray-400 font-medium">Resend SMS in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleSendOtp(e)}
                      className="text-[#C4913B] font-semibold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP on Mobile</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Update Password</span>
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
