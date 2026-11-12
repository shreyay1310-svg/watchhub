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
  Gift,
  Truck,
  Crown,
  Store,
  Package,
  Headphones,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Smartphone,
  KeyRound,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Multi-step signup: 1: Details & Role, 2: OTP Verification, 3: "Account is being created..."
  const [step, setStep] = useState(1);

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

  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [smsToast, setSmsToast] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Creation animation state
  const [creationProgress, setCreationProgress] = useState(15);
  const [creationStatus, setCreationStatus] = useState('Initializing profile credentials...');

  // Available User Types / Roles
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

  // Step 1: Validate details and send OTP
  const handleProceedToOtp = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
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

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp(code); // prefilled for instant verification convenience

    // Trigger SMS Push Notification Toast
    setSmsToast({
      phone: `+91 ${cleanDigits.slice(-10).slice(0, 5)} ${cleanDigits.slice(-10).slice(5)}`,
      otp: code,
      time: 'Just now',
    });
    setTimeout(() => setSmsToast(null), 12000);

    setStep(2);
    setResendCooldown(30);
  };

  // Step 2: Verify OTP and transition to creation animation
  const handleVerifyOtpAndCreate = (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      setOtpError('Invalid 6-digit OTP code.');
      return;
    }

    setOtpError('');
    setStep(3); // Enter "User account is being created..." screen!
    setCreationProgress(25);
    setCreationStatus(`Creating ${currentRoleObj.label} profile...`);

    setTimeout(() => {
      setCreationProgress(65);
      setCreationStatus(`Configuring ${currentRoleObj.label} permissions & 256-bit credentials...`);
    }, 700);

    setTimeout(async () => {
      setCreationProgress(95);
      setCreationStatus('Finalizing secure session...');

      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
      await register(name, email, password, '+91 ' + cleanPhone, role);

      setCreationProgress(100);
      setCreationStatus('User account created successfully! Redirecting...');

      setTimeout(() => {
        if (role === ROLES.CUSTOMER) {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-watch-navy flex flex-col font-poppins selection:bg-watch-gold selection:text-black">
      {/* ── Simulated SMS Push Notification Toast ── */}
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
                className="text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-100 font-medium mt-1 leading-snug">
              WatchHub Registration: Your OTP is{' '}
              <strong className="font-mono text-sm font-bold text-[#F5D88A] bg-black/40 px-1.5 py-0.5 rounded border border-[#C4913B]/40">
                {smsToast.otp}
              </strong>
              . Valid for 10 minutes.
            </p>
            <p className="text-[10.5px] text-gray-400 mt-1 flex items-center gap-1">
              <span>Delivered to</span>
              <span className="text-gray-300 font-semibold">{smsToast.phone}</span>
            </p>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="h-16 px-6 sm:px-12 bg-watch-navy-dark border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-watch-gold flex items-center justify-center text-lg border border-watch-gold/40 shadow">
            ⌚
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white leading-none">
              Watch<span className="text-watch-gold">Hub</span>
            </h1>
            <p className="text-[9px] text-gray-400 mt-0.5">Premium Watches for Every Style</p>
          </div>
        </Link>
        <Link to="/login" className="text-xs text-watch-gold font-semibold hover:underline flex items-center gap-1">
          <span>Already have an account?</span>
          <span className="font-bold underline">Login</span>
        </Link>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#0a111c]">
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl bg-[#0b1320] border border-white/10 grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Brand Panel */}
          <div className="md:col-span-5 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0c1524] to-[#121926] text-white border-b md:border-b-0 md:border-r border-white/5">
            <div>
              <span className="text-xs font-bold text-watch-gold tracking-widest uppercase block mb-1">
                JOIN WATCHHUB 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-6">
                Create Your <br />
                <span className="text-watch-gold">{currentRoleObj.label}</span>
              </h2>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-watch-gold/10 border border-watch-gold/20 flex items-center justify-center text-watch-gold flex-shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span>Flat 15% Welcome Voucher & luxury privileges</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-watch-gold/10 border border-watch-gold/20 flex items-center justify-center text-watch-gold flex-shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>Priority Free Express Shipping across all 28 states</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-watch-gold/10 border border-watch-gold/20 flex items-center justify-center text-watch-gold flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Instant role verification with OTP security</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-gray-400 flex items-center justify-between">
              <span>Trusted by 50,000+ members</span>
              <span className="text-watch-gold font-bold">100% Authentic</span>
            </div>
          </div>

          {/* Right Interactive Signup Panel */}
          <div className="md:col-span-7 bg-white p-7 sm:p-9 relative">
            
            {/* ════════════════════════════════════════════════════════════════
                STEP 1: FILL DETAILS & SELECT USER TYPE
                ════════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Create Account</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Select user type and fill in your details.</p>
                  </div>
                  <span className="text-[11px] font-bold text-watch-gold bg-watch-gold/10 px-2.5 py-1 rounded-full border border-watch-gold/20">
                    Step 1 of 2
                  </span>
                </div>

                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl mb-3 text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleProceedToOtp} className="space-y-3 text-xs">
                  {/* ── Type of User (Role Selection) ── */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Type of User <span className="text-amber-600 font-normal">(User, Admin, Store Manager, etc.)</span>
                    </label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-11 px-3.5 pr-9 rounded-xl border border-gray-300 font-semibold text-gray-800 text-xs sm:text-sm focus:border-watch-gold outline-none bg-gray-50/70 appearance-none cursor-pointer"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label} — {opt.badge}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ananya Singh"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-300 focus:border-watch-gold outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Mobile Number Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-300 focus:border-watch-gold outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Mobile Number (For OTP)</label>
                      <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-watch-gold">
                        <div className="bg-gray-50 border-r border-gray-300 px-2.5 flex items-center text-[11px] font-semibold text-gray-600">
                          +91
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="9876543210"
                          className="w-full h-10 px-2.5 outline-none font-medium tracking-wide"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full h-10 pl-9 pr-8 rounded-xl border border-gray-300 focus:border-watch-gold outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-300 focus:border-watch-gold outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="accent-watch-gold w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-gray-600 text-[11px]">
                      I agree to the <span className="text-watch-gold font-bold hover:underline">Terms of Service</span> &{' '}
                      <span className="text-watch-gold font-bold hover:underline">Privacy Policy</span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span>Proceed to Verify OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 2: OTP VERIFICATION ("phir sari details ke baad otp dale")
                ════════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="animate-fade-in py-2">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#C4913B] mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-gray-900">Enter Verification OTP</h3>
                  <span className="text-[11px] font-bold text-watch-gold bg-watch-gold/10 px-2.5 py-1 rounded-full border border-watch-gold/20">
                    Step 2 of 2
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Please enter the 6-digit OTP sent to your registered mobile and email.
                </p>

                {otpError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl mb-3 text-center">
                    {otpError}
                  </div>
                )}

                {/* OTP Dispatch Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/90 p-3 rounded-2xl text-amber-950 text-xs shadow-xs mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs flex items-center gap-1.5 text-amber-900">
                        <Smartphone className="w-4 h-4 text-[#C4913B]" />
                        <span>SMS OTP Sent to <strong className="text-gray-900">+91 {phone.slice(-10)}</strong></span>
                      </p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Registering as: <strong className="font-semibold text-gray-800">{currentRoleObj.label}</strong>
                      </p>
                    </div>
                    <div className="bg-white border border-amber-200 px-3 py-1 rounded-xl text-center shadow-xs">
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">OTP CODE</span>
                      <span className="font-mono text-base font-bold text-[#C4913B] tracking-wider">{generatedOtp}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleVerifyOtpAndCreate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1.5">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 482910"
                      className="w-full h-12 px-3 rounded-xl border border-gray-300 font-mono text-center tracking-widest text-lg font-bold focus:border-watch-gold outline-none bg-gray-50/50"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gray-500 hover:text-gray-800 underline cursor-pointer"
                    >
                      ← Edit details
                    </button>

                    {resendCooldown > 0 ? (
                      <span className="text-gray-400 font-medium">Resend OTP in {resendCooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleProceedToOtp(e)}
                        className="text-watch-gold font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify OTP & Create Account</span>
                  </button>
                </form>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                STEP 3: "user account is being created..." MESSAGE & PROGRESS
                ════════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="py-10 text-center animate-fade-in flex flex-col items-center justify-center">
                {/* Glowing rotating chronometer icon */}
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center shadow-lg relative">
                    <span className="text-3xl animate-pulse">⌚</span>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C4913B] animate-spin"></div>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
                  User account is being created...
                </h3>
                <p className="text-xs text-gray-600 mb-6 max-w-xs font-medium">
                  {creationStatus}
                </p>

                {/* Animated Progress Bar */}
                <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200 mb-4">
                  <div
                    className="bg-gradient-to-r from-[#C4913B] to-[#F5D88A] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${creationProgress}%` }}
                  ></div>
                </div>

                {/* Role and security indicator */}
                <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full text-[11px] text-gray-600 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-watch-gold" />
                  <span>Configuring {currentRoleObj.label} access & privileges</span>
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
