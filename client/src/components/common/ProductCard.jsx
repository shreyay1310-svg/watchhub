import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';

export const getBrandInsignia = (brand) => {
  const b = (brand || '').toLowerCase();
  if (b.includes('chronoswiss')) return '🇨🇭 Chronoswiss';
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
  const navigate = useNavigate();
  const { formatPrice } = useCurrencyLanguage();

  if (!product) return null;

  const brandLabel = getBrandInsignia(product.brand);
  const discountVal =
    product.discount ||
    (product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      className={`neon-glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-[#00F0FF]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300 flex flex-col justify-between group h-full ${className}`}
    >
      {/* ════════════════════════════════════════════════════════════════
          1. PRODUCT IMAGE CONTAINER (Fixed 240px, object-fit: contain)
          ════════════════════════════════════════════════════════════════ */}
      <div
        onClick={handleCardClick}
        className="product-image-container w-full h-[230px] sm:h-[240px] bg-[#0B1022]/80 flex items-center justify-center relative overflow-hidden p-3 cursor-pointer select-none"
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
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-[#10182D]/90 border border-white/10 shadow-md flex items-center justify-center transition-all cursor-pointer z-10 hover:border-[#FF35C8]/50 hover:shadow-[0_0_12px_rgba(255,53,200,0.4)] ${
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
      <div className="p-4 flex-1 flex flex-col justify-between bg-[#10182D]/85 backdrop-blur-md">
        <div>
          <span className="text-[10px] text-[#A6B1C8] font-bold uppercase tracking-wider block mb-1">
            {product.category || 'Luxury'}
          </span>
          <h4
            onClick={handleCardClick}
            className="text-[14px] font-bold text-[#F8FAFC] group-hover:text-[#00CFFF] transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-0.5" />
              {product.rating || 4.8}
            </span>
            <span className="text-[#A6B1C8]/80 text-[11px]">
              ({(product.reviewsCount || 1200).toLocaleString()} Reviews)
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          {/* Price Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-base font-extrabold text-[#F8FAFC] tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#A6B1C8]/60 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {discountVal > 0 && (
              <span className="bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(255,69,103,0.2)]">
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
                  : 'bg-gradient-to-r from-[#F4B942] to-[#E5A832] text-[#050816] font-black hover:shadow-[0_0_15px_rgba(244,185,66,0.4)]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-watch-gold" />
              <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickView?.(product)}
              className="py-2 px-2 rounded-lg text-[11px] font-bold text-[#A6B1C8] bg-white/5 border border-white/10 hover:border-[#00F0FF]/50 hover:text-[#00F0FF] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
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

