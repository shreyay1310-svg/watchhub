import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import {
  RotateCcw,
  CheckCircle2,
  Upload,
  Truck,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const ReturnsRefundsPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedOrder = searchParams.get('orderId') || 'WH125904';
  const { formatPrice } = useCurrencyLanguage();

  const [selectedOrder, setSelectedOrder] = useState(preselectedOrder);
  const [returnReason, setReturnReason] = useState('fit_preference');
  const [notes, setNotes] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableOrders = [
    {
      id: 'WH125904',
      watch: 'Rolex Submariner Date 41mm',
      amount: 980000,
      date: '12 Nov 2026',
      eligibleUntil: '19 Nov 2026 (7-Day Complimentary Policy)',
    },
    {
      id: 'WH125620',
      watch: 'Tissot PRX Powermatic 80',
      amount: 42500,
      date: '05 Nov 2026',
      eligibleUntil: 'Eligible for Service / Exchange',
    },
    {
      id: 'WH124801',
      watch: 'Chronoswiss Open Gear Flying Tourbillon Paraiba',
      amount: 3450000,
      date: '18 Oct 2026',
      eligibleUntil: 'Atelier Concierge Exchange Only',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#F4B942] tracking-widest uppercase block">
            CONFIDENCE & SATISFACTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            7-Day Complimentary Returns & Exchanges
          </h1>
          <p className="text-xs text-[#A6B1C8] mt-2">
            Every unworn timepiece can be returned or exchanged within 7 days with complimentary insured door-to-door courier pickup.
          </p>
        </div>

        {isSubmitted ? (
          <div className="max-w-xl mx-auto bg-[#040C1A] border border-[#00CFFF]/40 rounded-3xl p-8 text-center space-y-4 animate-scale-up">
            <CheckCircle2 className="w-14 h-14 text-[#39F5A5] mx-auto" />
            <h2 className="text-xl font-serif font-bold text-white">Return Request Authorized</h2>
            <p className="text-xs text-[#A6B1C8]">
              Your return manifest for order <strong className="text-white font-mono">{selectedOrder}</strong> has been logged. An armoured courier has been dispatched for verification and reverse pickup on <strong>Tomorrow, 11:30 AM</strong>.
            </p>
            <div className="p-4 rounded-2xl bg-[#020813] border border-white/10 text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Reverse AWB</span>
                <span className="text-[#00CFFF]">RET-SWISS-481920</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Refund Settlement</span>
                <span className="text-[#39F5A5]">Original Payment Rail (100% Refund)</span>
              </div>
            </div>
            <Link
              to="/account"
              className="inline-block py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-bold text-xs"
            >
              Return to Account Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Return Form (lg:col-span-7) */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Select Order & Provide Return Details
              </h3>

              {/* Order Selection */}
              <div className="space-y-2">
                <label className="text-gray-300 font-semibold">Select Order for Return / Exchange</label>
                <div className="space-y-2">
                  {availableOrders.map((ord) => (
                    <label
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedOrder === ord.id
                          ? 'bg-[#00CFFF]/10 border-[#00CFFF]'
                          : 'bg-[#020813] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="returnOrder"
                          checked={selectedOrder === ord.id}
                          onChange={() => setSelectedOrder(ord.id)}
                          className="accent-[#00CFFF]"
                        />
                        <div>
                          <p className="font-bold text-white font-mono">#{ord.id} • {ord.watch}</p>
                          <p className="text-[10.5px] text-[#A6B1C8]">{ord.eligibleUntil}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-[#F4B942]">
                        {formatPrice(ord.amount)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Return Reason</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white outline-none cursor-pointer"
                >
                  <option value="fit_preference">Dial Size / Bracelet Fit Preference</option>
                  <option value="exchange_model">Exchange for a Different Horology Model</option>
                  <option value="unopened_mind">Changed Mind (Box & Seal Completely Untouched)</option>
                  <option value="service_calibration">Requires Atelier Timing Calibration</option>
                </select>
              </div>

              {/* Upload Images */}
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Upload Photo Verification of Untampered Box & Seal</label>
                <div
                  onClick={() => setFileUploaded(true)}
                  className="border-2 border-dashed border-white/15 hover:border-[#00CFFF]/50 rounded-2xl p-6 text-center bg-[#020813] cursor-pointer transition-colors"
                >
                  <Upload className="w-7 h-7 text-[#00CFFF] mx-auto mb-2" />
                  <p className="text-xs text-white font-bold">
                    {fileUploaded ? '✓ Watch Box Photo Attached (100% Seal Verified)' : 'Click to attach watch condition photography'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Supports JPG, PNG & WEBP</p>
                </div>
              </div>

              {/* Additional comments */}
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Special Instructions for Armed Valet Courier</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring private residence bell, confirm serial number with client..."
                  className="w-full p-3 rounded-xl bg-[#020813] border border-white/10 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold rounded-xl shadow-md cursor-pointer hover:brightness-110"
              >
                Schedule Armoured Return Courier
              </button>
            </form>

            {/* Right Instructions Panel (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-[#040C1A] border border-white/10 rounded-3xl p-6 space-y-4 text-xs text-[#A6B1C8]">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F4B942]" /> 7-Day Guarantee Conditions
              </h3>
              <p>
                WatchHub guarantees an unconditional 7-day inspection period for all timepieces. To qualify for a full refund or exchange:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#00CFFF]">✓</span> Timepiece must remain unworn and free of microscopic scratches.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00CFFF]">✓</span> Original factory protective films, tags, and bezel protectors intact.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00CFFF]">✓</span> Presentation box, certificate of origin, warranty card, and manual included.
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ReturnsRefundsPage;
