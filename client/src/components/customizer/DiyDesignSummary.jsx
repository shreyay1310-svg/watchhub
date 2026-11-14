import React from 'react';
import { ShoppingCart, Bookmark, Share2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { DIY_ACCESSORIES_CATALOG } from '../../data/diyCustomizerData';

// Price calculation helper
export const calculateDiyPrice = (config) => {
  const watchBasePrice = config.watchBase?.price || 24999;

  // Band 1 beads cost
  const b1Count = config.band1.beadsCount || 15;
  const b1UnitPrice = config.band1.primaryBead?.basePrice || 130;
  const band1BeadsTotal = b1Count * b1UnitPrice;

  // Band 1 accessories cost
  let band1AccessoriesTotal = 0;
  const band1AccessoriesList = (config.band1.accessories || []).map((acc) => {
    const item = DIY_ACCESSORIES_CATALOG.find((a) => a.id === acc.id) || {};
    const cost = (item.price || 60) * acc.count;
    band1AccessoriesTotal += cost;
    return {
      ...item,
      count: acc.count,
      totalCost: cost,
    };
  });

  // Band 2 cost (if double band)
  let band2Total = 0;
  let band2BeadsTotal = 0;
  let band2AccessoriesList = [];
  if (config.bandMode === 'double') {
    const b2Count = config.band2.beadsCount || 15;
    const b2UnitPrice = config.band2.primaryBead?.basePrice || 160;
    band2BeadsTotal = b2Count * b2UnitPrice;

    let b2AccTotal = 0;
    band2AccessoriesList = (config.band2.accessories || []).map((acc) => {
      const item = DIY_ACCESSORIES_CATALOG.find((a) => a.id === acc.id) || {};
      const cost = (item.price || 60) * acc.count;
      b2AccTotal += cost;
      return {
        ...item,
        count: acc.count,
        totalCost: cost,
      };
    });
    band2Total = band2BeadsTotal + b2AccTotal;
  }

  const grandTotal = watchBasePrice + band1BeadsTotal + band1AccessoriesTotal + (config.bandMode === 'double' ? band2Total : 0);

  return {
    watchBasePrice,
    band1BeadsTotal,
    band1AccessoriesTotal,
    band1AccessoriesList,
    band2BeadsTotal,
    band2AccessoriesList,
    grandTotal,
  };
};

export const DiyDesignSummary = ({
  config,
  onAddToCart,
  onSaveDesign,
  onShareDesign,
  onResetDesign,
  isAddedToCart,
  isSaved,
}) => {
  const {
    watchBasePrice,
    band1BeadsTotal,
    band1AccessoriesList,
    band2BeadsTotal,
    band2AccessoriesList,
    grandTotal,
  } = calculateDiyPrice(config);

  return (
    <div className="rounded-2xl p-4 md:p-5 bg-[#0B1026]/90 backdrop-blur-xl border border-purple-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Design Summary
          </h3>
          <span className="text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            In Stock &bull; Ships in 48h
          </span>
        </div>

        {/* Itemized Bill of Materials matching Gemloo Reference Image 2 */}
        <div className="space-y-2.5 text-xs">
          {/* Smartwatch Base */}
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400/80 border border-white/30" />
              <span className="text-slate-300">
                {config.watchBase?.name || 'Smartwatch Base (Rose Gold)'}
              </span>
            </div>
            <span className="font-mono font-semibold text-white">
              ₹{watchBasePrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Band 1 Primary Beads */}
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/30"
                style={{ backgroundColor: config.band1.primaryBead?.imageColor || '#4ECDC4' }}
              />
              <span className="text-slate-300">
                {config.band1.primaryBead?.name || 'Amazonite Beads'} ({config.band1.beadSize || 8} mm) &times; {config.band1.beadsCount || 15}
              </span>
            </div>
            <span className="font-mono font-semibold text-white">
              ₹{band1BeadsTotal.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Band 1 Accessories */}
          {band1AccessoriesList.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs">{acc.icon || '✨'}</span>
                <span className="text-slate-300">
                  {acc.name} &times; {acc.count}
                </span>
              </div>
              <span className="font-mono font-semibold text-white">
                ₹{acc.totalCost.toLocaleString('en-IN')}
              </span>
            </div>
          ))}

          {/* If Double Band: Band 2 Beads & Accessories */}
          {config.bandMode === 'double' && (
            <>
              <div className="flex items-center justify-between py-1 border-b border-white/5 text-purple-300">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: config.band2.primaryBead?.imageColor || '#FFFFFF' }}
                  />
                  <span>
                    Band 2: {config.band2.primaryBead?.name || 'Pearl'} ({config.band2.beadSize || 8} mm) &times; {config.band2.beadsCount || 15}
                  </span>
                </div>
                <span className="font-mono font-semibold">
                  ₹{band2BeadsTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {band2AccessoriesList.map((acc) => (
                <div key={`b2-${acc.id}`} className="flex items-center justify-between py-1 border-b border-white/5 text-purple-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{acc.icon || '✨'}</span>
                    <span>
                      Band 2: {acc.name} &times; {acc.count}
                    </span>
                  </div>
                  <span className="font-mono font-semibold">
                    ₹{acc.totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Bottom Total & Primary Action CTA */}
      <div className="mt-5 pt-4 border-t border-white/10">
        {/* Total Price Row */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Total Price
          </span>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono tracking-tight text-white drop-shadow-[0_2px_10px_rgba(244,185,66,0.3)]">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
            <div className="text-[10px] text-slate-400">Includes GST & Insured Express Delivery</div>
          </div>
        </div>

        {/* Primary Add to Cart Button matching Gemloo purple button */}
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:shadow-[0_0_35px_rgba(168,85,247,0.65)] transition-all duration-300 active:scale-[0.99]"
        >
          {isAddedToCart ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        {/* Secondary Actions: Save Design | Share | Reset */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            type="button"
            onClick={onSaveDesign}
            className={`py-2 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-purple-600/30 border-purple-400/50 text-purple-200'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={onShareDesign}
            className="py-2 px-2 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={onResetDesign}
            className="py-2 px-2 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiyDesignSummary;
