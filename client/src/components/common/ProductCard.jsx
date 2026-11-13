import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

export const getBrandInsignia = (brand) => {
  const b = (brand || '').toLowerCase();
  if (b.includes('rolex')) return '👑 Rolex';
  if (b.includes('omega')) return 'Ω Omega';
  if (b.includes('patek')) return '❖ Patek Philippe';
  if (b.includes('audemars') || b.includes('ap')) return 'AP Audemars Piguet';
  if (b.includes('cartier')) return 'Cartier';
  if (b.includes('apple')) return ' Apple';
  if (b.includes('fossil')) return 'Fossil';
  if (b.includes('seiko')) return 'Seiko';
  if (b.includes('tissot')) return 'T+ Tissot';
  if (b.includes('casio')) return 'Casio';
  if (b.includes('citizen')) return 'Citizen';
  if (b.includes('titan')) return 'Titan';
  if (b.includes('timex')) return 'Timex';
  return brand || 'WatchHub';
};

/**
 * Reusable ProductCard Component
 * Displays complete, uncropped watch photography with object-fit: contain,
 * centered alignment, fixed container height, and non-overlapping badges.
 */
export const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onNavigate,
  isInWishlist = false,
  isAdded = false,
  className = '',
}) => {
  if (!product) return null;

  const brandLabel = getBrandInsignia(product.brand);
  const discountVal =
    product.discount ||
    (product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-watch-gold hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full ${className}`}
    >
      {/* ════════════════════════════════════════════════════════════════
          1. PRODUCT IMAGE CONTAINER (Fixed 240px, object-fit: contain)
          ════════════════════════════════════════════════════════════════ */}
      <div
        onClick={() => onNavigate?.(product)}
        className="product-image-container w-full h-[230px] sm:h-[240px] bg-[#f8f8f8] flex items-center justify-center relative overflow-hidden p-3 cursor-pointer select-none"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/ref_crops/hero-watch-center.jpg';
          }}
          className="w-full h-full object-contain object-center block transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge (Top-Left, non-blocking) */}
        {discountVal > 0 && (
          <span className="absolute top-3 left-3 bg-[#EE3B3B] text-white text-[10.5px] font-black px-2.5 py-0.5 rounded shadow-sm z-10 pointer-events-none">
            -{discountVal}% OFF
          </span>
        )}

        {/* Brand Insignia (Bottom-Left inside image container, never overlaps details below) */}
        <span className="absolute bottom-2.5 left-3 bg-[#0B121C]/90 backdrop-blur-sm text-watch-gold text-[10px] font-bold px-2.5 py-0.5 rounded border border-watch-gold/30 shadow flex items-center gap-1 z-10 pointer-events-none">
          {brandLabel}
        </span>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all cursor-pointer z-10 hover:shadow-lg ${
            isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. PRODUCT INFORMATION & ACTIONS
          ════════════════════════════════════════════════════════════════ */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
            {product.category || 'Luxury'}
          </span>
          <h4
            onClick={() => onNavigate?.(product)}
            className="text-[14px] font-bold text-gray-900 group-hover:text-watch-gold transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-0.5" />
              {product.rating || 4.8}
            </span>
            <span className="text-gray-400 text-[11px]">
              ({(product.reviewsCount || 1200).toLocaleString('en-IN')} Reviews)
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          {/* Price Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-gray-900">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountVal > 0 && (
              <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-extrabold px-2 py-0.5 rounded">
                {discountVal}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Quick View */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAddToCart?.(product)}
              className={`py-2 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0B121C] text-white hover:bg-watch-gold hover:text-black'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-watch-gold" />
              <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickView?.(product)}
              className="py-2 px-2 rounded-lg text-[11px] font-bold text-gray-700 bg-white border border-gray-200 hover:border-watch-gold hover:text-watch-gold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500" />
              <span>Quick View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

