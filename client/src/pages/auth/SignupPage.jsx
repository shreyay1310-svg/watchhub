import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Crown,
  Store,
  Package,
  Truck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  KeyRound,
  Sparkles,
  ChevronDown,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import OtpInput from '../../components/auth/OtpInput';
import { safeAuthFetch } from '../../utils/authApiHelper';

export const SignupPage = () => {
  const { register, setUser } = useAuth();
  const navigate = useNavigate();

  // Multi-step signup: 1: Details & Role, 2: Real Email OTP Verification, 3: Creation animation
  const [step, setStep] = useState(1);
  const [verifyChannel, setVerifyChannel] = useState('email'); // 'email' or 'phone'

  // Form Fields
  const [role, setRole] = useState(ROLES.CUSTOMER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP State
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendNotice, setResendNotice] = useState('');

  // Creation animation state
  const [creationProgress, setCreationProgress] = useState(15);
  const [creationStatus, setCreationStatus] = useState('Initializing profile credentials...');

  const ROLE_OPTIONS = [
    {
      id: ROLES.CUSTOMER,
      label: 'Customer / Buyer',
      badge: 'Shopping, Orders & Wishlist',
      icon: User,
      color: '#C4913B',
    },
    {
      id: ROLES.SUPER_ADMIN,
      label: 'Super Admin',
      badge: 'Full Platform & System Control',
      icon: Crown,
      color: '#EAB308',
    },
    {
      id: ROLES.STORE_ADMIN,
      label: 'Store Admin / Manager',
      badge: 'Products, Pricing & Discounts',
      icon: Store,
      color: '#3B82F6',
    },
    {
      id: ROLES.INVENTORY_MANAGER,
      label: 'Inventory Manager',
      badge: 'Warehouse & Stock Replenishment',
      icon: Package,
      color: '#10B981',
    },
    {
      id: ROLES.DELIVERY_MANAGER,
      label: 'Delivery Manager',
      badge: 'Shipments & Courier Logistics',
      icon: Truck,
      color: '#F97316',
    },
    {
      id: ROLES.CUSTOMER_SUPPORT,
      label: 'Customer Support',
      badge: 'Tickets, Inquiries & Resolutions',
      icon: Headphones,
      color: '#EC4899',
    },
  ];

  const currentRoleObj = ROLE_OPTIONS.find((r) => r.id === role) || ROLE_OPTIONS[0];

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Validate details and send OTP via Email (or Phone SMS)
  const handleProceedToOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (!cleanDigits || cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = verifyChannel === 'phone' ? '/api/auth/send-phone-otp' : '/api/auth/send-email-otp';
      const payload = verifyChannel === 'phone'
        ? { phone: cleanDigits, name: name.trim(), purpose: 'registration' }
        : { email: cleanEmail, name: name.trim(), purpose: 'registration' };

      const result = await safeAuthFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        setError(result.error || "We couldn't send the verification code. Please try again.");
        setLoading(false);
        return;
      }

      setStep(2);
      setOtpSuccessMessage(result.data?.message || 'Verification code sent to your email address.');
      setResendCooldown(result.data?.cooldownSeconds || 60);
      setEnteredOtp('');
      setOtpError('');
      setLoading(false);
    } catch {
      setError("We couldn't send the verification code. Please try again.");
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setOtpError('');
    setResendNotice('');
    setLoading(true);

    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanDigits = phone.replace(/[^0-9]/g, '').slice(-10);
      const endpoint = verifyChannel === 'phone' ? '/api/auth/send-phone-otp' : '/api/auth/resend-email-otp';
      const payload = verifyChannel === 'phone'
        ? { phone: cleanDigits, purpose: 'registration' }
        : { email: cleanEmail, purpose: 'registration' };

      const result = await safeAuthFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        setOtpError(result.error || "We couldn't send the verification code. Please try again.");
        setLoading(false);
        return;
      }

      setResendCooldown(result.data?.cooldownSeconds || 60);
      setResendNotice(result.data?.message || 'Verification code sent to your email address.');
      setTimeout(() => setResendNotice(''), 5000);
      setLoading(false);
    } catch {
      setOtpError("We couldn't send the verification code. Please try again.");
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and complete backend registration
  const handleVerifyOtpAndCreate = async (e) => {
    if (e) e.preventDefault();
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanDigits = phone.replace(/[^0-9]/g, '').slice(-10);

      const endpoint = verifyChannel === 'phone' ? '/api/auth/verify-phone-otp' : '/api/auth/verify-email-otp';
      const payload = verifyChannel === 'phone'
        ? {
            phone: cleanDigits,
            otp: enteredOtp.trim(),
            purpose: 'registration',
            name: name.trim(),
            email: cleanEmail,
            password: password,
            role: role,
          }
        : {
            email: cleanEmail,
            otp: enteredOtp.trim(),
            purpose: 'registration',
            name: name.trim(),
            phone: '+91 ' + cleanDigits,
            password: password,
            role: role,
          };

      const result = await safeAuthFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!result.ok) {
        let msg = result.error;
        if (result.data?.expired) {
          msg = 'Your verification code has expired. Request a new code.';
        } else if (!msg || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('mismatch')) {
          msg = 'Invalid verification code. Please try again.';
        }
        setOtpError(msg);
        setLoading(false);
        return;
      }

      const verifyData = result.data || {};

      // Store authenticated session
      if (verifyData.accessToken) {
        localStorage.setItem('watchhub_token', verifyData.accessToken);
      }
      if (verifyData.user && setUser) {
        setUser(verifyData.user);
      }

      setLoading(false);
      setStep(3); // Enter creation animation
      setCreationProgress(30);
      setCreationStatus(`Creating verified ${currentRoleObj.label} profile...`);

      setTimeout(() => {
        setCreationProgress(75);
        setCreationStatus(`Configuring permissions & secured encryption...`);
      }, 700);

      setTimeout(() => {
        setCreationProgress(100);
        setCreationStatus('Account activated successfully! Redirecting...');

        setTimeout(() => {
          if (role === ROLES.CUSTOMER) {
            navigate('/');
          } else {
            navigate('/dashboard');
          }
        }, 900);
      }, 1500);
    } catch (err) {
      setOtpError('Network verification error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070918] flex flex-col font-sans selection:bg-[#00D9E8]/30 selection:text-white text-white">
      {/* Top Navbar Header */}
      <header className="h-16 border-b border-[#252D42] bg-[#091426]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">👑</span>
          <span className="text-lg font-black tracking-widest text-white font-serif">
            WATCH<span className="text-[#00D9E8]">HUB</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#A7B1C2] hidden sm:inline">Already a member?</span>
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl bg-[#111729] hover:bg-[#161F38] text-[#00D9E8] border border-[#252D42] font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl bg-[#091426] border border-[#252D42] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
          {/* Left Luxury Showcase Banner */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#111729] via-[#091426] to-[#070918] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#252D42]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] border border-[#00D9E8]/30 text-[11px] font-semibold mb-6">
                <span>✦</span>
                <span>Haute Horlogerie Membership</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-serif">
                Join the Circle of Luxury Collectors
              </h2>
              <p className="text-xs text-[#A7B1C2] mt-3 leading-relaxed">
                Gain verified access to limited-edition timepieces, private atelier viewings, certified authentications, and global armored delivery.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#252D42]/60 text-xs text-[#A7B1C2]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#00D9E8]" />
                <span>100% Certified Authentic Movements</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Verified Email Identity Authentication</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#E7B43F]" />
                <span>Secured Armored Transit Insurance</span>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="md:col-span-7 bg-[#111729]/60 p-6 sm:p-9 relative">
            {/* STEP 1: Registration Form */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#252D42]">
                  <div>
                    <h3 className="text-lg font-bold text-white">Create Your Account</h3>
                    <p className="text-xs text-[#A7B1C2]">Step 1 of 2: Collector Details</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30">
                    Step 1 / 2
                  </span>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleProceedToOtp} className="space-y-3.5 text-xs">
                  {/* Role Selection */}
                  <div>
                    <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                      Account Type / Access Tier
                    </label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-[#091426] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] appearance-none cursor-pointer"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label} — {opt.badge}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#A7B1C2] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Vikram Singhania"
                        className="w-full bg-[#091426] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                      />
                    </div>
                  </div>

                  {/* Email & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                        Email Address (OTP will be sent here) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="collector@example.com"
                          className="w-full bg-[#091426] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9876543210"
                          className="w-full bg-[#091426] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full bg-[#091426] text-white text-xs pl-9 pr-10 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C2] hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full bg-[#091426] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Select OTP Delivery Channel */}
                  <div>
                    <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                      Send 6-Digit Verification Code Via:
                    </label>
                    <div className="grid grid-cols-2 p-1 bg-[#091426] rounded-xl border border-[#252D42]">
                      <button
                        type="button"
                        onClick={() => setVerifyChannel('phone')}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          verifyChannel === 'phone'
                            ? 'bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] shadow'
                            : 'text-[#A7B1C2] hover:text-white'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Phone SMS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerifyChannel('email')}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          verifyChannel === 'email'
                            ? 'bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] shadow'
                            : 'text-[#A7B1C2] hover:text-white'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Inbox</span>
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1 text-[#A7B1C2] text-[11px]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="accent-[#00D9E8] w-4 h-4 rounded cursor-pointer"
                    />
                    <span>
                      I agree to the WatchHub Concierge Terms of Service &amp; Privacy Policy
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D9E8] via-[#00B4D8] to-[#00D9E8] text-[#070918] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,217,232,0.3)] hover:shadow-[0_0_30px_rgba(0,217,232,0.5)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span>Dispatching Verification Code...</span>
                    ) : (
                      <>
                        <span>Send {verifyChannel === 'phone' ? 'Phone SMS' : 'Email'} Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Dedicated OTP Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#252D42]">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Verify Your {verifyChannel === 'phone' ? 'Mobile Phone' : 'Email'}
                    </h3>
                    <p className="text-xs text-[#A7B1C2]">Step 2 of 2: Enter 6-Digit Code</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E7B43F]/15 text-[#E7B43F] border border-[#E7B43F]/30">
                    Step 2 / 2
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#091426] border border-[#252D42] text-center space-y-1">
                  <p className="text-xs text-[#A7B1C2]">
                    We sent a single-use 6-digit verification code to:
                  </p>
                  <p className="text-xs font-bold text-[#00D9E8] truncate">
                    {verifyChannel === 'phone' ? `+91 ${phone.replace(/[^0-9]/g, '').slice(-10)}` : email.trim().toLowerCase()}
                  </p>
                  <p className="text-[10px] text-[#64748B]">
                    {verifyChannel === 'phone' ? 'Please check your phone SMS messages.' : 'Please check your inbox & spam folder.'}
                  </p>
                </div>

                {otpSuccessMessage && (
                  <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{otpSuccessMessage}</span>
                  </div>
                )}

                {otpError && (
                  <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {resendNotice && (
                  <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{resendNotice}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtpAndCreate} className="space-y-4">
                  <OtpInput
                    value={enteredOtp}
                    onChange={setEnteredOtp}
                    length={6}
                    disabled={loading}
                    error={!!otpError}
                  />

                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#A7B1C2]">
                    <Clock className="w-3.5 h-3.5 text-[#00D9E8]" />
                    <span>Valid for 5 minutes &bull; Max 5 attempts</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || enteredOtp.length !== 6}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D9E8] via-[#00B4D8] to-[#00D9E8] text-[#070918] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,217,232,0.3)] hover:shadow-[0_0_30px_rgba(0,217,232,0.5)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Email &amp; Complete Registration</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 border-t border-[#252D42] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[#A7B1C2] hover:text-white"
                    >
                      &larr; Edit Details
                    </button>

                    {resendCooldown > 0 ? (
                      <span className="text-[#64748B]">Resend in {resendCooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#00D9E8] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Resend Code</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: Account Creation Animation */}
            {step === 3 && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#111729] border-2 border-[#00D9E8] text-[#00D9E8] flex items-center justify-center mx-auto text-2xl animate-spin">
                  ⏳
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Activating Collector Profile</h3>
                  <p className="text-xs text-[#A7B1C2] mt-1">{creationStatus}</p>
                </div>

                <div className="w-full max-w-xs mx-auto bg-[#091426] rounded-full h-2 overflow-hidden border border-[#252D42]">
                  <div
                    className="bg-gradient-to-r from-[#00D9E8] to-[#E7B43F] h-full transition-all duration-500 ease-out"
                    style={{ width: `${creationProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
