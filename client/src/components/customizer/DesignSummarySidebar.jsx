import React from 'react';
import {
  WATCH_TYPES,
  DIAL_CONFIG,
  CASE_CONFIG,
  STRAP_CONFIG,
  MOVEMENT_CONFIG,
  FEATURES_CONFIG,
} from '../../data/customWatchData';
import { ShoppingCart, Bookmark, Share2 } from 'lucide-react';

export const calculateCustomWatchPrice = (customWatch) => {
  // 1. Base watch price
  const typeObj = WATCH_TYPES.find((t) => t.id === customWatch.watchType) || WATCH_TYPES[0];
  const basePrice = typeObj.basePrice;

  // 2. Custom upgrades
  let upgrades = 0;

  // Dial shape upgrade
  const dialShapeObj = DIAL_CONFIG.shapes.find((s) => s.id === customWatch.dial.shape);
  if (dialShapeObj) upgrades += dialShapeObj.price;

  // Dial color upgrade
  const dialColorObj = DIAL_CONFIG.colors.find((c) => c.id === customWatch.dial.color);
  if (dialColorObj) upgrades += dialColorObj.price;

  // Dial finish upgrade
  const dialFinishObj = DIAL_CONFIG.finishes.find((f) => f.id === customWatch.dial.finish);
  if (dialFinishObj) upgrades += dialFinishObj.price;

  // Case material upgrade
  const caseMatObj = CASE_CONFIG.materials.find((m) => m.id === customWatch.case.material);
  if (caseMatObj) upgrades += caseMatObj.price;

  // Case color upgrade
  const caseColorObj = CASE_CONFIG.colors.find((c) => c.id === customWatch.case.color);
  if (caseColorObj) upgrades += caseColorObj.price;

  // Strap material upgrade
  const strapMatObj = STRAP_CONFIG.materials.find((m) => m.id === customWatch.strap.material);
  if (strapMatObj) upgrades += strapMatObj.price;

  // Movement upgrade
  const movementObj = MOVEMENT_CONFIG.find((m) => m.id === customWatch.movement);
  if (movementObj) upgrades += movementObj.price;

  // Additional features
  if (customWatch.features && customWatch.features.length > 0) {
    customWatch.features.forEach((featId) => {
      const fObj = FEATURES_CONFIG.find((f) => f.id === featId);
      if (fObj) upgrades += fObj.price;
    });
  }

  // 3. Engraving fee
  const engravingFee = customWatch.personalization.backEngraving || customWatch.personalization.dialText ? 300 : 0;

  const total = basePrice + upgrades + engravingFee;

  return {
    basePrice,
    upgrades,
    engravingFee,
    total,
  };
};

export const DesignSummarySidebar = ({
  customWatch,
  onAddToCart,
  onSaveDesign,
  onShare,
  isAddedToCart = false,
  isSaved = false,
}) => {
  const { basePrice, upgrades, engravingFee, total } = calculateCustomWatchPrice(customWatch);

  const watchTypeObj = WATCH_TYPES.find((t) => t.id === customWatch.watchType) || WATCH_TYPES[0];
  const dialShape = DIAL_CONFIG.shapes.find((s) => s.id === customWatch.dial.shape)?.name || 'Round';
  const dialColor = DIAL_CONFIG.colors.find((c) => c.id === customWatch.dial.color)?.name || 'Blue';
  const dialFinish = DIAL_CONFIG.finishes.find((f) => f.id === customWatch.dial.finish)?.name || 'Sunburst';

  const caseMat = CASE_CONFIG.materials.find((m) => m.id === customWatch.case.material)?.name || 'Stainless Steel';
  const caseColor = CASE_CONFIG.colors.find((c) => c.id === customWatch.case.color)?.name || 'Silver';

  const strapMat = STRAP_CONFIG.materials.find((m) => m.id === customWatch.strap.material)?.name || 'Genuine Leather';
  const strapColor = STRAP_CONFIG.colors.find((c) => c.id === customWatch.strap.color)?.name || 'Brown';

  const movement = MOVEMENT_CONFIG.find((m) => m.id === customWatch.movement)?.name || 'Automatic';

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 font-poppins flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
          <span>Your Custom Watch</span>
          <span className="text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-watch-gold/40 px-2 py-0.5 rounded-full">
            Bespoke Edition
          </span>
        </h3>

        {/* Selected Specifications List */}
        <div className="mt-3.5 space-y-3 text-xs">
          {/* Watch Type */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-50">
            <span className="p-1.5 rounded-lg bg-gray-50 text-base">⌚</span>
            <div className="flex-1">
              <span className="text-[10.5px] text-gray-400 font-bold block uppercase tracking-wider">Watch Type</span>
              <span className="font-bold text-gray-900">{watchTypeObj.name}</span>
            </div>
          </div>

          {/* Dial */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-50">
            <span className="p-1.5 rounded-lg bg-gray-50 text-base">⭕</span>
            <div className="flex-1">
              <span className="text-[10.5px] text-gray-400 font-bold block uppercase tracking-wider">Dial</span>
              <span className="font-bold text-gray-900">
                {dialShape}, {customWatch.dial.size} mm, {dialColor} ({dialFinish})
              </span>
            </div>
          </div>

          {/* Case */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-50">
            <span className="p-1.5 rounded-lg bg-gray-50 text-base">🛡️</span>
            <div className="flex-1">
              <span className="text-[10.5px] text-gray-400 font-bold block uppercase tracking-wider">Case</span>
              <span className="font-bold text-gray-900">
                {caseMat}, {caseColor}
              </span>
            </div>
          </div>

          {/* Strap */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-50">
            <span className="p-1.5 rounded-lg bg-gray-50 text-base">🏷️</span>
            <div className="flex-1">
              <span className="text-[10.5px] text-gray-400 font-bold block uppercase tracking-wider">Strap</span>
              <span className="font-bold text-gray-900">
                {strapMat}, {strapColor} ({customWatch.strap.width} mm)
              </span>
            </div>
          </div>

          {/* Movement */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-50">
            <span className="p-1.5 rounded-lg bg-gray-50 text-base">⚙️</span>
            <div className="flex-1">
              <span className="text-[10.5px] text-gray-400 font-bold block uppercase tracking-wider">Movement</span>
              <span className="font-bold text-gray-900">{movement}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-start gap-2.5 pb-2.5 border-b border-gray-50">
            <span className="p-1.5 rounded-lg bg-gray-50 text-base">✨</span>
            <div className="flex-1">
              <span className="text-[10.5px] text-gray-400 font-bold block uppercase tracking-wider">Features</span>
              <span className="font-bold text-gray-900 line-clamp-1">
                {customWatch.features && customWatch.features.length > 0
                  ? customWatch.features
                      .map((fId) => FEATURES_CONFIG.find((fc) => fc.id === fId)?.name)
                      .filter(Boolean)
                      .join(', ')
                  : 'Standard Build'}
              </span>
            </div>
          </div>

          {/* Engraving */}
          <div className="flex items-start gap-2.5">
            <span className="p-1.5 rounded-lg bg-gray-50 text-base">✍️</span>
            <div className="flex-1">
              <span className="text-[10.5px] text-gray-400 font-bold block uppercase tracking-wider">Engraving</span>
              <span className="font-bold text-amber-800">
                {customWatch.personalization.backEngraving
                  ? `"${customWatch.personalization.backEngraving}" on Back Case`
                  : customWatch.personalization.dialText
                  ? `"${customWatch.personalization.dialText}" on Dial`
                  : 'Complimentary None'}
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            ESTIMATED PRICE BREAKDOWN (Exact Match to Reference Mockup)
            ══════════════════════════════════════════════════════════════ */}
        <div className="mt-5 pt-3.5 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5">
            <span>Base Price</span>
            <span className="font-bold text-gray-800">₹{basePrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5">
            <span>Custom Upgrades</span>
            <span className="font-bold text-gray-800">
              {upgrades > 0 ? `+₹${upgrades.toLocaleString('en-IN')}` : '₹0'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span>Engraving</span>
            <span className="font-bold text-gray-800">
              {engravingFee > 0 ? `+₹${engravingFee}` : '₹0'}
            </span>
          </div>

          <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline mb-4">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Total (Estimated)</span>
              <span className="text-[10px] text-emerald-600 font-bold">Includes GST & Free Courier</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ACTIONS: ADD TO CART & SAVE DESIGN
          ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-2 mt-4 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onAddToCart({ ...customWatch, calculatedPrice: total })}
          className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            isAddedToCart
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-watch-gold to-amber-500 text-black hover:brightness-105 active:scale-98'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isAddedToCart ? 'Added Custom Watch to Cart!' : 'Add Custom Watch to Cart'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSaveDesign}
            className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-gray-700 border-gray-200 hover:border-watch-gold hover:text-watch-gold'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved!' : 'Save Design'}</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="py-2 px-3 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:border-watch-gold hover:text-watch-gold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignSummarySidebar;

