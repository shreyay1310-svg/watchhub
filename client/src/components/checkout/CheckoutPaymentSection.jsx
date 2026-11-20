import React from 'react';
import {
  ShieldCheck,
  QrCode,
  CreditCard,
  Building,
  Banknote,
  AlertCircle,
  Lock,
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
}) {
  if (currentStep !== 5) return null;

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[#00CFFF]/20 text-[#00CFFF] flex items-center justify-center text-xs">5</span>
        Select Payment Gateway Method
      </h3>

      {/* Payment options */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'razorpay', label: 'Razorpay VIP', icon: ShieldCheck, featured: true },
          { id: 'upi', label: 'Direct UPI', icon: QrCode },
          { id: 'card', label: 'Credit Card', icon: CreditCard },
          { id: 'netbanking', label: 'Net Banking', icon: Building },
          { id: 'cod', label: 'COD Escort', icon: Banknote },
        ].map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPaymentMethod(p.id)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                paymentMethod === p.id
                  ? 'bg-[#F4B942]/15 border-[#F4B942] text-[#F4B942] shadow-[0_0_15px_rgba(244,185,66,0.3)]'
                  : 'bg-[#020813] border-white/10 text-gray-300 hover:border-white/20'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#6500FF] to-[#00D5FF] text-[9px] font-black text-white uppercase tracking-tighter">
                  Official
                </span>
              )}
              <Icon className="w-5 h-5 mx-auto mb-1.5 text-inherit" />
              <span className="block font-bold text-[11px]">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Razorpay Gateway Panel */}
      {paymentMethod === 'razorpay' && (
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0b1528] to-[#040C1A] border border-[#00CFFF]/40 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00CFFF]/20 text-[#00CFFF] flex items-center justify-center font-bold">
                ₹
              </div>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>Razorpay Standard Checkout</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    256-Bit Encrypted
                  </span>
                </h4>
                <p className="text-[11px] text-[#A6B1C8]">
                  Official PCI-DSS Level 1 Gateway supporting all Indian & international cards, UPI, and net banking.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-semibold text-gray-300">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              ⚡ Instant UPI &amp; QR
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              💳 Visa / Mastercard / Amex
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              🏦 50+ Top Banks
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              🛡️ Zero Fraud Liability
            </div>
          </div>
        </div>
      )}

      {/* Sub-form based on other payment methods */}
      {paymentMethod === 'upi' && (
        <div className="p-4 rounded-2xl bg-[#020813] border border-white/10 space-y-3">
          <p className="text-gray-300 font-semibold">Instant UPI VPA / Handle</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@okhdfcbank"
            className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#00CFFF]"
          />
          <p className="text-[10.5px] text-gray-400">
            Supports Google Pay, PhonePe, Paytm, BHIM and all major Swiss & Indian banks.
          </p>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="p-4 rounded-2xl bg-[#020813] border border-white/10 space-y-3">
          <div className="space-y-1">
            <label className="text-gray-400 text-[11px]">Card Number</label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-400 text-[11px]">Valid Thru (MM/YY)</label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400 text-[11px]">CVV / CVC</label>
              <input
                type="password"
                maxLength={4}
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="p-4 rounded-2xl bg-[#020813] border border-amber-500/30 text-amber-300 text-xs space-y-1">
          <p className="font-bold">Armoured Escort Cash On Delivery</p>
          <p className="text-[11px] text-gray-300">
            A one-time cryptographic authorization code will be sent via SMS when the courier arrives at your location.
          </p>
        </div>
      )}

      {paymentError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{paymentError}</span>
        </div>
      )}

      <div className="pt-4 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="text-gray-400 hover:text-white cursor-pointer"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleFinalPayment}
          className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-black text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(244,185,66,0.4)] hover:brightness-110 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Connecting Razorpay Gateway...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>
                {paymentMethod === 'razorpay'
                  ? `Pay with Razorpay (${formatPrice(grandTotal > 0 ? grandTotal : 3453500)})`
                  : `Authorize & Pay ${formatPrice(grandTotal > 0 ? grandTotal : 3453500)}`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
