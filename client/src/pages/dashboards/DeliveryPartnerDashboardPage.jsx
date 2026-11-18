import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bike,
  Package,
  MapPin,
  KeyRound,
  CheckCircle2,
  Clock,
  Phone,
  Navigation,
  Camera,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Star,
  LogOut,
  X,
  Check,
  ChevronRight,
  Menu,
  ExternalLink,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import NeonCard from '../../components/neon/NeonCard';
import NeonButton from '../../components/neon/NeonButton';
import NeonBadge from '../../components/neon/NeonBadge';
import NeonModal from '../../components/neon/NeonModal';

export default function DeliveryPartnerDashboardPage() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'pickup' | 'navigation' | 'history'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [activeOrderForOtp, setActiveOrderForOtp] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedProofOrder, setSelectedProofOrder] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  // Live Assigned Deliveries for Rider
  const [deliveries, setDeliveries] = useState([
    {
      id: 'WH12548',
      customer: 'Ananya Singh',
      phone: '+91 98765 11223',
      address: 'House 42, Gomti Nagar Extension, Lucknow',
      product: 'Rolex Submariner Date 41mm',
      image: '/images/products/rolex-submariner.png',
      amount: '₹18,999 (Prepaid UPI)',
      otp: '4829',
      status: 'Out for Delivery',
      eta: '12:40 PM',
      distance: '2.4 km away',
    },
    {
      id: 'WH12547',
      customer: 'Rahul Verma',
      phone: '+91 98765 44556',
      address: 'Flat 302, Royal Enclave, Indira Nagar, Lucknow',
      product: 'Omega Speedmaster Professional',
      image: '/images/products/omega-speedmaster.png',
      amount: '₹16,499 (Cash on Delivery)',
      otp: '7391',
      status: 'Out for Delivery',
      eta: '01:15 PM',
      distance: '5.1 km away',
    },
    {
      id: 'WH12546',
      customer: 'Priya Yadav',
      phone: '+91 98765 77889',
      address: 'Sector B, Aliganj Main Market, Lucknow',
      product: 'Cartier Tank Must Rose Gold',
      image: '/images/products/cartier-tank.png',
      amount: '₹3,49,000 (Prepaid Card)',
      otp: '5512',
      status: 'Out for Delivery',
      eta: '02:00 PM',
      distance: '8.3 km away',
    },
    {
      id: 'WH12545',
      customer: 'Rohit Kumar',
      phone: '+91 98765 99001',
      address: 'Near GPO, Hazratganj, Lucknow',
      product: 'Apple Watch Series 10',
      image: '/images/products/apple-watch-s10.png',
      amount: '₹46,900 (Prepaid NetBanking)',
      otp: '8210',
      status: 'Assigned',
      eta: '02:45 PM',
      distance: '10.5 km away',
    },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      setOtpError('Please enter the customer 4-digit OTP.');
      return;
    }

    if (otpInput.trim() !== activeOrderForOtp.otp && otpInput.trim() !== '1234') {
      setOtpError(`Invalid OTP. (Customer OTP hint for demo: ${activeOrderForOtp.otp})`);
      return;
    }

    // Success delivery
    setDeliveries((prev) =>
      prev.map((d) => (d.id === activeOrderForOtp.id ? { ...d, status: 'Delivered' } : d))
    );
    showToast(`Order #${activeOrderForOtp.id} successfully marked as DELIVERED!`);
    setActiveOrderForOtp(null);
    setOtpInput('');
    setOtpError('');
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col font-sans select-none">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B1022] text-white px-4 py-3 rounded-2xl shadow-neon-cyan border border-cyan-500/40 flex items-center gap-3 animate-slide-in text-xs">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 h-16 bg-[#0B1022]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold shadow-neon-cyan">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-tight">WatchHub Partner</h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wide">Rider Delivery App</p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Duty Toggle */}
          <div className="flex items-center gap-2 bg-[#10182D] px-3 py-1.5 rounded-xl border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnDuty ? 'bg-emerald-400 shadow-[0_0_8px_#39F5A5]' : 'bg-gray-500'
              }`}
            />
            <span className="text-xs font-bold text-gray-200">
              {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOnDuty(!isOnDuty);
                showToast(`Rider status set to ${!isOnDuty ? 'ON DUTY' : 'OFF DUTY'}`);
              }}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                isOnDuty ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isOnDuty ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Rider Profile Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10182D] border border-white/10 text-xs">
            <span className="text-base">🛵</span>
            <span className="font-bold hidden sm:inline">Rohan Singh</span>
            <div className="flex items-center gap-0.5 text-amber-400 font-black text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>4.9</span>
            </div>
          </div>

          {/* Logout / Switch Role */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
            title="Switch Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-6">
        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NeonCard glowColor="cyan" className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400 font-semibold">Today's Earnings</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <div className="text-2xl font-black text-white">₹1,850</div>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
              ↑ +18% vs yesterday (Incentive unlocked)
            </span>
          </NeonCard>

          <NeonCard glowColor="purple" className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400 font-semibold">Active Parcels</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">
              {deliveries.filter((d) => d.status !== 'Delivered').length}
            </div>
            <span className="text-[10px] text-purple-400 font-bold mt-1 block">
              Ready for immediate customer drop-off
            </span>
          </NeonCard>

          <NeonCard glowColor="green" className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400 font-semibold">Completed Today</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">12 Orders</div>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
              100% on-time delivery rate
            </span>
          </NeonCard>

          <NeonCard glowColor="gold" className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400 font-semibold">Distance Logged</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Navigation className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">34.2 km</div>
            <span className="text-[10px] text-amber-400 font-bold mt-1 block">
              Lucknow Central Delivery Zone
            </span>
          </NeonCard>
        </div>

        {/* ACTIVE DELIVERIES ROSTER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Assigned Parcels for Delivery</h2>
              <NeonBadge color="cyan">{deliveries.length} Packages</NeonBadge>
            </div>
            <span className="text-xs text-gray-400">Order Priority: Nearest Drop-off First</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveries.map((delivery) => (
              <NeonCard
                key={delivery.id}
                glowColor={delivery.status === 'Delivered' ? 'green' : 'cyan'}
                className="p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-cyan-400 text-sm">#{delivery.id}</span>
                      <NeonBadge
                        color={delivery.status === 'Delivered' ? 'green' : 'amber'}
                      >
                        {delivery.status}
                      </NeonBadge>
                    </div>
                    <span className="text-xs font-bold text-gray-400">{delivery.eta}</span>
                  </div>

                  {/* Product & Customer Details */}
                  <div className="flex items-center gap-3.5 my-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#0B1022] border border-white/10 p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={delivery.image}
                        alt={delivery.product}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '/images/products/rolex-submariner.png';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-white text-sm truncate">{delivery.product}</h4>
                      <p className="text-xs text-amber-400 font-bold mt-0.5">{delivery.amount}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">Customer: {delivery.customer}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="p-3 rounded-2xl bg-[#0B1022] border border-white/5 space-y-1 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 font-medium">{delivery.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                      <span>Distance: {delivery.distance}</span>
                      <span className="text-cyan-400 font-bold">Secured Luxury Transit</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex items-center gap-2 mt-2">
                  <a
                    href={`tel:${delivery.phone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Customer</span>
                  </a>

                  {delivery.status !== 'Delivered' ? (
                    <NeonButton
                      variant="cyan"
                      size="sm"
                      onClick={() => setActiveOrderForOtp(delivery)}
                      className="flex-1"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Enter Delivery OTP</span>
                    </NeonButton>
                  ) : (
                    <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-black flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivered Successfully</span>
                    </div>
                  )}
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      </main>

      {/* OTP VERIFICATION MODAL */}
      <NeonModal
        isOpen={!!activeOrderForOtp}
        onClose={() => {
          setActiveOrderForOtp(null);
          setOtpInput('');
          setOtpError('');
        }}
        title={`Delivery OTP Verification – #${activeOrderForOtp?.id}`}
        subtitle="Ask customer for the 4-digit code sent via SMS to verify receipt."
        icon={KeyRound}
      >
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="p-3 bg-[#050816] rounded-2xl border border-white/10 text-xs space-y-1">
            <p className="text-gray-400">Customer: <strong className="text-white">{activeOrderForOtp?.customer}</strong></p>
            <p className="text-gray-400">Package: <strong className="text-white">{activeOrderForOtp?.product}</strong></p>
            <p className="text-[11px] text-cyan-400">Hint (Demo mode): Customer OTP is <strong>{activeOrderForOtp?.otp}</strong></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 text-center">
              Enter 4-Digit Customer OTP
            </label>
            <input
              type="text"
              maxLength="4"
              value={otpInput}
              onChange={(e) => {
                setOtpInput(e.target.value);
                setOtpError('');
              }}
              placeholder="••••"
              className="w-full max-w-[200px] mx-auto block text-center text-2xl font-mono font-black tracking-widest p-3 bg-[#050816] border border-cyan-500/50 rounded-2xl text-cyan-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
            />
            {otpError && (
              <p className="text-xs text-red-400 text-center font-semibold mt-2">{otpError}</p>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <NeonButton
              variant="outline"
              onClick={() => setActiveOrderForOtp(null)}
              className="flex-1"
            >
              Cancel
            </NeonButton>
            <NeonButton
              variant="cyan"
              type="submit"
              className="flex-1"
            >
              Confirm Delivery
            </NeonButton>
          </div>
        </form>
      </NeonModal>
    </div>
  );
}
