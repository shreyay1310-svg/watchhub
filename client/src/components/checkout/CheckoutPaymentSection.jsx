import React from 'react';
import {
  ShieldCheck,
  QrCode,
  CreditCard,
  Building,
  Banknote,
  AlertCircle,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPaymentSection({
  currentStep,
  setCurrentStep,
  paymentMethod,
  setPaymentMethod,
  upiId,
  setUpiId,
  cardDetails,
  setCardDetails,
  paymentError,
  isProcessing,
  handleFinalPayment,
  grandTotal,
  formatPrice,
  simulateFailure = false,
  setSimulateFailure,
}) {
  if (currentStep !== 5) return null;

  const paymentOptions = [
    { id: 'upi', label: 'Instant UPI / QR (Demo)', icon: QrCode, badge: 'Popular' },
    { id: 'card', label: 'Credit / Debit Card (Demo)', icon: CreditCard, badge: 'Secure' },
    { id: 'netbanking', label: 'Net Banking (Demo)', icon: Building },
    { id: 'cod', label: 'Cash on Delivery Escort', icon: Banknote },
  ];

  return (
    <div className="space-y-5 animate-fade-in text-xs">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#F4B942]/20 text-[#F4B942] flex items-center justify-center text-xs font-mono">
            5
          </span>
          <span>Select Payment Method</span>
        </h3>
        <p className="text-[11px] text-[#A6B1C8] mt-1">
          Choose your preferred transaction channel. All payments run in local dummy mode.
        </p>
      </div>

      {/* Demo Architecture Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-[#F4B942]/10 border border-[#F4B942]/30 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#F4B942] shrink-0" />
        <div className="text-[11px] text-amber-200">
          <p className="font-bold">Demo Payment Mode — No real money will be charged</p>
          <p className="text-amber-200/80 text-[10px]">
            Zero cloud payment gateway dependencies. Transactions generate persistent records in WatchHubDB.
          </p>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {paymentOptions.map((p) => {
          const Icon = p.icon;
          const isSelected = paymentMethod === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPaymentMethod(p.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-[#F4B942]/15 border-[#F4B942] text-[#F4B942] shadow-[0_0_15px_rgba(244,185,66,0.25)]'
                  : 'bg-[#020813] border-white/10 text-gray-300 hover:border-white/20'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6500FF] to-[#00D5FF] text-[9px] font-black text-white uppercase tracking-tighter">
                  {p.badge}
                </span>
              )}
              <Icon className="w-5 h-5 mx-auto mb-2 text-inherit" />
              <span className="block font-bold text-[11px] leading-tight">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Method Specific Panels */}
      {paymentMethod === 'upi' && (
        <div className="p-4 rounded-2xl bg-[#081026] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#00D9FF]" />
              <span>Simulated UPI VPA / Handle</span>
            </p>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Demo Active
            </span>
          </div>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="collector@okhdfcbank"
            className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#F4B942]"
          />
          <p className="text-[10.5px] text-[#A6B1C8]">
            Simulates instant payment authorization via UPI Apps (Google Pay, PhonePe, Paytm).
          </p>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="p-4 rounded-2xl bg-[#081026] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#00D9FF]" />
              <span>Simulated Credit / Debit Card</span>
            </p>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              256-bit Sandbox
            </span>
          </div>
          <div className="space-y-1">
            <label className="text-gray-400 text-[11px]">Card Number</label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-[#F4B942]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-400 text-[11px]">Valid Thru (MM/YY)</label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-[#F4B942]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 text-[11px]">CVV</label>
              <input
                type="password"
                maxLength={4}
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-[#F4B942]"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'netbanking' && (
        <div className="p-4 rounded-2xl bg-[#081026] border border-white/10 space-y-2">
          <p className="text-white font-semibold flex items-center gap-1.5">
            <Building className="w-4 h-4 text-[#00D9FF]" />
            <span>Simulated Net Banking Portal</span>
          </p>
          <p className="text-[11px] text-[#A6B1C8]">
            Simulates retail &amp; corporate net banking authorization from major Swiss &amp; Indian banking partners.
          </p>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="p-4 rounded-2xl bg-[#081026] border border-amber-500/30 text-amber-300 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <Banknote className="w-4 h-4" />
            <span>Armoured Escort Cash On Delivery</span>
          </p>
          <p className="text-[11px] text-gray-300">
            A one-time OTP cryptographic confirmation will be required upon delivery by our armoured logistics partner.
          </p>
        </div>
      )}

      {/* Test Simulation Controls */}
      {setSimulateFailure && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white">Simulate Payment Failure</p>
            <p className="text-[10px] text-slate-400">
              Toggle to test issuing bank decline handling and error recovery.
            </p>
          </div>
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
            className="w-4 h-4 accent-[#F4B942] cursor-pointer"
          />
        </div>
      )}

      {paymentError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{paymentError}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="text-gray-400 hover:text-white cursor-pointer px-3 py-2 text-xs"
        >
          ← Back to Review
        </button>
        <button
          type="button"
          disabled={isProcessing || !paymentMethod}
          onClick={handleFinalPayment}
          className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-black text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(244,185,66,0.4)] hover:brightness-110 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Processing Transaction...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>
                Confirm &amp; Pay {formatPrice(grandTotal > 0 ? grandTotal : 3453500)}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
