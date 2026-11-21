import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import GoogleMapAddressPicker from '../../components/common/GoogleMapAddressPicker';
import CheckoutPaymentSection from '../../components/checkout/CheckoutPaymentSection';
import { getProductImage, getProductAlt } from '../../utils/productImageMap';
import {
  ShieldCheck, CheckCircle2, Lock, Truck, CreditCard, QrCode, Building,
  Wallet, Banknote, ChevronRight, ArrowRight, Package, Calendar, Sparkles,
  Download, MapPin, Compass, AlertCircle, ExternalLink,
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrencyLanguage();
  const navigate = useNavigate();

  // Multi-step: 1: Login/Guest, 2: Address, 3: Shipping, 4: Summary, 5: Payment, 6: Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Address modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [addressCoords, setAddressCoords] = useState({ lat: 28.4595, lng: 77.0850 });

  // Form states
  const [guestEmail, setGuestEmail] = useState(user?.email || 'collector@watchhub.com');
  const [address, setAddress] = useState({
    fullName: user?.name || 'Alexander Sterling',
    street: 'Penthouse 14B, The Oberoi Sky Heights, Golf Course Road',
    apartment: 'Suite 14B',
    landmark: 'Near DLF CyberCity',
    city: 'Gurugram',
    state: 'Haryana',
    postalCode: '122002',
    country: 'India',
    phone: '+91 98765 43210',
    lat: 28.4595,
    lng: 77.0850,
  });

  const [shippingMethod, setShippingMethod] = useState('armoured'); // 'standard' | 'express' | 'armoured'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('collector@okhdfcbank');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Alexander Sterling',
    expiry: '12/28',
    cvv: '•••',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotal = typeof getCartTotal === 'function' ? getCartTotal() : (cart || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shippingFees = {
    standard: 0,
    express: 1200,
    armoured: 3500,
  };
  const currentShippingFee = shippingFees[shippingMethod] || 0;
  const grandTotal = subtotal + currentShippingFee;

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Callback when address is selected from Google Maps
  const handleMapAddressSelect = (selected) => {
    setAddress((prev) => ({
      ...prev,
      street: selected.street || selected.formattedAddress || prev.street,
      apartment: selected.apartment || prev.apartment,
      landmark: selected.landmark || prev.landmark,
      city: selected.city || prev.city,
      state: selected.state || prev.state,
      postalCode: selected.pincode || prev.postalCode,
      lat: selected.lat,
      lng: selected.lng,
    }));
    setAddressCoords({ lat: selected.lat, lng: selected.lng });
  };

  const finalizeOrderConfirmation = (serverOrder = null) => {
    setIsProcessing(false);
    const newOrder = {
      orderId: serverOrder?.orderId || `WH-${Math.floor(100000 + Math.random() * 900000)}`,
      awbNumber: serverOrder?.awbNumber || `AWB-SWISS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: cart.length > 0 ? [...cart] : [{ name: 'Chronoswiss Open Gear Flying Tourbillon Paraiba', price: 3450000, quantity: 1, image: '/images/products/chronoswiss-tourbillon.png' }],
      amount: serverOrder?.amount || (grandTotal > 0 ? grandTotal : 3453500),
      shippingAddress: { ...address },
      shippingMethod,
      paymentMethod: `Demo Payment Mode — ${paymentMethod.toUpperCase()}`,
      paymentId: `PAY_DEMO_${Date.now()}`,
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID / CAPTURED',
      status: serverOrder?.orderStatus || 'Order Placed (Handcrafting Dispatch Preparation)',
      lat: address.lat,
      lng: address.lng,
    };

    setConfirmedOrder(newOrder);
    setCurrentStep(6);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalPayment = async () => {
    if (!paymentMethod) {
      setPaymentError('Please select a payment method before authorizing payment.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const response = await fetch('/api/payments/dummy-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.length > 0 ? cart : [{ name: 'Rolex Submariner Date 41mm', price: 18999, quantity: 1 }],
          shippingMethod,
          paymentMethod,
          shippingAddress: address,
          simulateFailure,
          customerEmail: guestEmail,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Payment authorization was declined.');
      }

      finalizeOrderConfirmation(data.order);
    } catch (err) {
      console.warn('[Checkout Dummy Payment Note]', err.message);
      setPaymentError(err.message || 'Payment authorization failed.');
      setIsProcessing(false);
    }
  };

  const STEPS = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Address' },
    { num: 3, label: 'Shipping' },
    { num: 4, label: 'Review' },
    { num: 5, label: 'Payment' },
  ];

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Step Indicator Header (Steps 1–5 only) */}
        {currentStep <= 5 && (
          <div className="mb-10">
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold text-[#F4B942] tracking-widest uppercase block">
                SECURE LUXURY CHECKOUT
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Complete Your Acquisition
              </h1>
            </div>

            {/* Stepper Tabs */}
            <div className="flex items-center justify-center max-w-2xl mx-auto">
              {STEPS.map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep === step.num
                          ? 'bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] shadow-[0_0_15px_rgba(0,207,255,0.4)] scale-110'
                          : currentStep > step.num
                          ? 'bg-[#39F5A5] text-[#020813]'
                          : 'bg-white/10 text-gray-400 border border-white/10'
                      }`}
                    >
                      {currentStep > step.num ? '✓' : step.num}
                    </div>
                    <span className="text-[10px] font-semibold text-[#A6B1C8] hidden sm:inline">
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-all ${
                        currentStep > step.num ? 'bg-[#39F5A5]' : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 6: ORDER CONFIRMATION & RECEIPT
            ════════════════════════════════════════════════════════════════ */}
        {currentStep === 6 && confirmedOrder && (
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#061224] to-[#040C1A] border border-[#00CFFF]/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,207,255,0.25)] text-center animate-scale-up space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#39F5A5]/20 border border-[#39F5A5]/50 text-[#39F5A5] flex items-center justify-center text-2xl mx-auto shadow-[0_0_20px_rgba(57,245,165,0.4)]">
              ✓
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#F4B942] uppercase tracking-widest block">
                ACQUISITION CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Thank You for Your Patronage
              </h2>
              <p className="text-xs text-[#A6B1C8] mt-2 max-w-md mx-auto">
                Your order <strong className="text-white font-mono">{confirmedOrder.orderId}</strong> has been received by our Swiss logistics atelier. A confirmation dossier has been sent to <span className="text-[#00CFFF]">{confirmedOrder.shippingAddress.phone}</span> and email.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#020813] border border-white/10 rounded-2xl p-5 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Order Reference</span>
                <span className="text-white font-bold">{confirmedOrder.orderId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Tracking Airway Bill (AWB)</span>
                <span className="text-[#00CFFF] font-bold">{confirmedOrder.awbNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Acquisition Total</span>
                <span className="text-[#F4B942] font-bold text-sm">{formatPrice(confirmedOrder.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-gray-400">Delivery Method</span>
                <span className="text-white capitalize">{confirmedOrder.shippingMethod} Armoured Freight</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Destination</span>
                <span className="text-white">{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.country}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={`/track-parcel?orderId=${confirmedOrder.orderId}`}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,207,255,0.3)] hover:brightness-110"
              >
                <Truck className="w-4 h-4" />
                <span>Live Satellite Parcel Tracking</span>
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto py-3 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEPS 1 TO 5 INTERFACE (2 COLUMNS)
            ════════════════════════════════════════════════════════════════ */}
        {currentStep <= 5 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT FORM STEP CONTAINER (lg:col-span-7) ── */}
            <div className="lg:col-span-7 bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* STEP 1: IDENTITY */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00CFFF]/20 text-[#00CFFF] flex items-center justify-center text-xs">1</span>
                    Customer Identity & Contact Dossier
                  </h3>
                  <p className="text-[#A6B1C8]">
                    {user ? `Signed in as ${user.name} (${user.email})` : 'Continue as guest or sign in for automated VIP concierge tracking.'}
                  </p>

                  <div className="space-y-2">
                    <label className="block text-gray-300 font-semibold">Primary Contact Email Address</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-[#020813] border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
                      required
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs flex items-center gap-2 shadow-sm hover:brightness-110 cursor-pointer"
                    >
                      <span>Proceed to Delivery Address</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ADDRESS */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#00CFFF]/20 text-[#00CFFF] flex items-center justify-center text-xs">2</span>
                      Private Delivery Destination
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#6500FF]/30 hover:brightness-110 cursor-pointer self-start sm:self-auto"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#F4B942]" />
                      <span>Select on Google Maps</span>
                    </button>
                  </div>

                  {/* GPS Pin Status Ribbon */}
                  <div className="p-2.5 rounded-xl bg-[#020813] border border-[#00CFFF]/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Armoured Geofence Coordinates:</span>
                      <strong className="text-white font-mono">
                        {Number(address.lat).toFixed(4)}° N, {Number(address.lng).toFixed(4)}° E
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="text-[#00CFFF] hover:underline font-semibold cursor-pointer"
                    >
                      Adjust Pin
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-semibold">Recipient Full Name</label>
                      <input
                        type="text"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-300 font-semibold">Mobile Phone (Courier OTP)</label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">Street & Building Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-semibold">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-300 font-semibold">State / Region</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-300 font-semibold">Postal Code</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-gray-400 hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs flex items-center gap-2 shadow-sm hover:brightness-110 cursor-pointer"
                    >
                      <span>Select Shipping Method</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SHIPPING METHOD */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00CFFF]/20 text-[#00CFFF] flex items-center justify-center text-xs">3</span>
                    Select Transit Security Method
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'armoured',
                        title: 'Armoured Satellite Courier (Recommended)',
                        desc: 'Dedicated high-security vehicle with armed escort, satellite GPS and temperature vault.',
                        cost: 3500,
                        time: '1–2 Business Days',
                      },
                      {
                        id: 'express',
                        title: 'Express Priority Air Freight',
                        desc: 'Direct air transport with tamper-evident seal and signature-required delivery.',
                        cost: 1200,
                        time: '2–3 Business Days',
                      },
                      {
                        id: 'standard',
                        title: 'Standard Insured Delivery',
                        desc: 'Fully insured ground delivery across all states.',
                        cost: 0,
                        time: '4–5 Business Days',
                      },
                    ].map((m) => (
                      <label
                        key={m.id}
                        onClick={() => setShippingMethod(m.id)}
                        className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          shippingMethod === m.id
                            ? 'bg-[#00CFFF]/10 border-[#00CFFF] shadow-[0_0_20px_rgba(0,207,255,0.2)]'
                            : 'bg-[#020813] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === m.id}
                            onChange={() => setShippingMethod(m.id)}
                            className="accent-[#00CFFF] mt-1"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{m.title}</p>
                            <p className="text-[11px] text-[#A6B1C8] mt-0.5">{m.desc}</p>
                            <span className="inline-block mt-1 text-[10px] text-emerald-400 font-mono">
                              Est. Window: {m.time}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-white font-mono text-xs whitespace-nowrap">
                          {m.cost === 0 ? 'Complimentary' : formatPrice(m.cost)}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-gray-400 hover:text-white"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs flex items-center gap-2 shadow-sm hover:brightness-110 cursor-pointer"
                    >
                      <span>Review Acquisition Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: ORDER REVIEW */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00CFFF]/20 text-[#00CFFF] flex items-center justify-center text-xs">4</span>
                    Review Acquisition Specifications
                  </h3>

                  <div className="bg-[#020813] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#A6B1C8]">Destination</span>
                      <span className="text-white text-right font-medium">
                        {address.fullName}, {address.street}, {address.city}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#A6B1C8]">Courier Service</span>
                      <span className="text-[#00CFFF] capitalize font-medium">
                        {shippingMethod} Freight ({formatPrice(currentShippingFee)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A6B1C8]">Authentication Guarantee</span>
                      <span className="text-[#39F5A5] font-semibold">100% Manufacture Certified</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-gray-400 hover:text-white"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-extrabold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,207,255,0.4)] hover:brightness-110 cursor-pointer"
                    >
                      <span>Proceed to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT GATEWAY */}
              <CheckoutPaymentSection
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                upiId={upiId}
                setUpiId={setUpiId}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                paymentError={paymentError}
                isProcessing={isProcessing}
                handleFinalPayment={handleFinalPayment}
                grandTotal={grandTotal}
                formatPrice={formatPrice}
                simulateFailure={simulateFailure}
                setSimulateFailure={setSimulateFailure}
              />
            </div>

            {/* ── RIGHT COLUMN: CART SUMMARY SIDEBAR (lg:col-span-5) ── */}
            <div className="lg:col-span-5 bg-[#040C1A] border border-white/10 rounded-3xl p-6 space-y-5 text-xs">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center justify-between">
                <span>Acquisition Summary</span>
                <span className="text-[#00CFFF]">{cart.length > 0 ? `${cart.length} Timepieces` : '1 Timepiece'}</span>
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-none">
                {(cart.length > 0 ? cart : [
                  {
                    id: 'chronoswiss-tourbillon',
                    name: 'Chronoswiss Open Gear Flying Tourbillon Paraiba',
                    price: 3450000,
                    quantity: 1,
                    image: '/images/products/chronoswiss-tourbillon.png',
                  }
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/5">
                    <img
                      src={getProductImage(item)}
                      alt={getProductAlt(item)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/watch_placeholder.png';
                      }}
                      className="w-12 h-12 rounded-xl object-contain bg-[#020813] border border-white/10 p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatPrice((item.price || 3450000) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 text-[#A6B1C8] pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">{formatPrice(subtotal > 0 ? subtotal : 3450000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-white font-mono">
                    {currentShippingFee === 0 ? 'Free' : formatPrice(currentShippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Customs & Horology Tax</span>
                  <span className="text-emerald-400 font-mono">Included</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10 text-sm font-bold">
                  <span className="text-white">Grand Total</span>
                  <span className="text-[#F4B942] font-mono text-base">
                    {formatPrice(grandTotal > 0 ? grandTotal : 3453500)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Precision Google Maps Address Geolocation Modal */}
        <GoogleMapAddressPicker
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onSelectAddress={handleMapAddressSelect}
          initialCoords={addressCoords}
          initialAddress={address.street}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
