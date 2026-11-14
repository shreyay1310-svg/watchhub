import React from 'react';
import { X, CheckCircle2, ShoppingCart, Download, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import DiyBraceletCanvas from './DiyBraceletCanvas';
import { calculateDiyPrice } from './DiyDesignSummary';

export const DiyFinishPreviewModal = ({
  isOpen,
  onClose,
  config,
  onAddToCart,
  isAddedToCart,
}) => {
  if (!isOpen) return null;

  const {
    watchBasePrice,
    band1BeadsTotal,
    band1AccessoriesList,
    band2BeadsTotal,
    band2AccessoriesList,
    grandTotal,
  } = calculateDiyPrice(config);

  const watchBase = config.watchBase;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#090E24] border border-purple-500/30 p-5 md:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-600/30 text-purple-300 border border-purple-500/40">
                Bespoke Atelier Edition
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Configuration Verified
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide mt-1">
              Your Customized WatchHub Timepiece
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Grand Total</span>
            <span className="text-2xl font-bold font-mono text-champagne-gold text-[#F4B942]">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Two-Column Grid: Preview Canvas on Left, Full Specs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
          {/* Left Canvas Preview */}
          <div className="lg:col-span-7">
            <DiyBraceletCanvas config={config} />
          </div>

          {/* Right Specification Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl p-4 bg-[#050816] border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Atelier Specifications
              </h3>

              {/* Watch Base */}
              <div className="text-xs space-y-1">
                <div className="text-slate-400">Smartwatch Body:</div>
                <div className="text-white font-medium">{watchBase.name}</div>
                <div className="text-[11px] text-slate-400">{watchBase.caseMaterial}</div>
              </div>

              {/* Band configuration */}
              <div className="text-xs space-y-1 pt-2 border-t border-white/5">
                <div className="text-slate-400">Wrist Dimensions & Fit:</div>
                <div className="text-purple-300 font-mono font-medium">
                  {config.wristSizeCm} cm ({(config.wristSizeCm / 2.54).toFixed(1)} inches) &bull;{' '}
                  <span className="capitalize">{config.bandMode} Band</span>
                </div>
              </div>

              {/* Band 1 Details */}
              <div className="text-xs space-y-1 pt-2 border-t border-white/5">
                <div className="text-slate-400">Band 1 (Inner Strand):</div>
                <div className="text-white">
                  {config.band1.primaryBead?.name} ({config.band1.beadSize}mm) &times; {config.band1.beadsCount}
                </div>
                {band1AccessoriesList.length > 0 && (
                  <div className="text-[11px] text-slate-400">
                    Accessories: {band1AccessoriesList.map((a) => `${a.name} (${a.count})`).join(', ')}
                  </div>
                )}
              </div>

              {/* Band 2 Details (if Double) */}
              {config.bandMode === 'double' && (
                <div className="text-xs space-y-1 pt-2 border-t border-white/5">
                  <div className="text-slate-400">Band 2 (Outer Strand):</div>
                  <div className="text-white">
                    {config.band2.primaryBead?.name} ({config.band2.beadSize}mm) &times; {config.band2.beadsCount}
                  </div>
                  {band2AccessoriesList.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      Accessories: {band2AccessoriesList.map((a) => `${a.name} (${a.count})`).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quality & Authenticity Guarantee */}
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-center gap-3 text-xs text-purple-200">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <span className="font-semibold">WatchHub Atelier Guarantee:</span> 100% genuine natural gemstones, 18K gold ion-plating, and 2-year warranty included.
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={onAddToCart}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isAddedToCart ? 'Added to Cart!' : 'Add Custom Watch to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiyFinishPreviewModal;
