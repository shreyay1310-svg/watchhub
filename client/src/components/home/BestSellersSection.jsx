import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronRight,
  Crown,
  Zap,
  Sparkles,
  Hourglass,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';

export const BEST_SELLERS_PRODUCTS = [
  {
    id: 'rolex-submariner',
    name: 'Rolex Submariner',
    brand: 'Rolex',
    brandLogo: '👑 ROLEX',
    badgeText: 'Bestseller',
    badgeType: 'gold',
    badgeIcon: Crown,
    movement: 'Automatic',
    dialSize: '41mm',
    rating: 4.8,
    reviewsCount: 320,
    price: 1078000,
    originalPrice: 1250000,
    discount: 14,
    image: '/images/products/bestseller_rolex.png',
    isFeatured: false,
  },
  {
    id: 'omega-speedmaster',
    name: 'Omega Speedmaster',
    brand: 'Omega',
    brandLogo: 'Ω OMEGA',
    badgeText: 'Trending',
    badgeType: 'cyan',
    badgeIcon: Zap,
    movement: 'Chronograph',
    dialSize: '42mm',
    rating: 4.7,
    reviewsCount: 189,
    price: 797500,
    originalPrice: 890000,
    discount: 10,
    image: '/images/products/bestseller_omega.png',
    isFeatured: true, // Cyan highlighted border matching reference!
  },
  {
    id: 'tag-heuer-carrera',
    name: 'TAG Heuer Carrera',
    brand: 'TAG Heuer',
    brandLogo: '🛡️ TAG HEUER',
    badgeText: 'New Arrival',
    badgeType: 'gold',
    badgeIcon: Sparkles,
    movement: 'Automatic',
    dialSize: '39mm',
    rating: 4.6,
    reviewsCount: 142,
    price: 539000,
    originalPrice: 620000,
    discount: 13,
    image: '/images/products/bestseller_tag.png',
    isFeatured: false,
  },
  {
    id: 'seiko-prospex-diver',
    name: 'Seiko Prospex',
    brand: 'Seiko',
    brandLogo: 'SEIKO',
    badgeText: 'Top Rated',
    badgeType: 'gold',
    badgeIcon: Star,
    movement: 'Diver',
    dialSize: '44mm',
    rating: 4.5,
    reviewsCount: 276,
    price: 203500,
    originalPrice: 240000,
    discount: 15,
    image: '/images/products/bestseller_seiko.png',
    isFeatured: false,
  },
  {
    id: 'tissot-prx',
    name: 'Tissot PRX',
    brand: 'Tissot',
    brandLogo: '🇨🇭 TISSOT',
    badgeText: 'Limited Stock',
    badgeType: 'gold',
    badgeIcon: Hourglass,
    movement: 'Quartz',
    dialSize: '40mm',
    rating: 4.6,
    reviewsCount: 511,
    price: 46800,
    originalPrice: 55000,
    discount: 15,
    image: '/images/products/bestseller_tissot.png',
    isFeatured: false,
  },
];

export const BestSellersSection = ({ onToast }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    if (onToast) {
      onToast(`✨ ${product.name} added to your shopping bag!`);
    }
  };

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (onToast) {
      const inWish = isInWishlist(product.id);
      onToast(inWish ? `Removed from wishlist` : `❤️ Saved ${product.name} to wishlist`);
    }
  };

  return (
    <section className="space-y-6 select-none">
      {/* 1. SECTION HEADER matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {/* Small label: MOST COVETED with crown icon */}
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-3.5 h-3.5 text-[#E9B94F]" />
            <span className="text-[11px] font-extrabold text-[#E9B94F] tracking-[0.2em] uppercase">
              MOST COVETED
            </span>
          </div>

          {/* Main heading: Best Sellers */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
            Best Sellers
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#A7B1C2] font-light mt-1 leading-relaxed">
            Our most loved timepieces, chosen by watch enthusiasts worldwide.
          </p>
        </div>

        {/* View All Button on top-right */}
        <Link
          to="/best-sellers"
          className="self-start sm:self-auto px-4 py-1.5 rounded-full border border-[#00D5FF]/40 hover:border-[#00D5FF] text-[#00D5FF] hover:bg-[#00D5FF]/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,213,255,0.15)] cursor-pointer"
        >
          <span>View All</span>
          <span className="text-sm">→</span>
        </Link>
      </div>

      {/* 2. PRODUCT GRID – 5 CARDS IN A SINGLE HORIZONTAL ROW ON DESKTOP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {BEST_SELLERS_PRODUCTS.map((item) => {
          const inWish = isInWishlist(item.id);
          const BadgeIcon = item.badgeIcon;
          const isFeatured = item.isFeatured;

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className={`group relative rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer bg-[#07111F] ${
                isFeatured
                  ? 'border-2 border-[#00D5FF] shadow-[0_0_25px_rgba(0,213,255,0.35)]'
                  : 'border border-[#253247] hover:border-[#E9B94F]/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
              }`}
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#030914] flex items-center justify-center p-2 mb-3 border border-white/5">
                  {/* Badge: Top-Left */}
                  <div
                    className={`absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-bold tracking-wider uppercase backdrop-blur-md ${
                      item.badgeType === 'cyan'
                        ? 'border border-[#00D5FF]/60 text-[#00D5FF] bg-[#00D5FF]/10'
                        : 'border border-[#E9B94F]/60 text-[#E9B94F] bg-[#E9B94F]/10'
                    }`}
                  >
                    <BadgeIcon className="w-2.5 h-2.5" />
                    <span>{item.badgeText}</span>
                  </div>

                  {/* Wishlist Heart Icon: Top-Right */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(item, e)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-xs transition-transform active:scale-90"
                    title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        inWish ? 'text-[#FF35C8] fill-[#FF35C8]' : 'text-slate-300 hover:text-white'
                      }`}
                    />
                  </button>

                  {/* Product Image (100% Uncropped with object-fit: contain) */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain object-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Brand Logo/Header Strip */}
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  <span>{item.brandLogo}</span>
                </div>

                {/* Product Name */}
                <h3
                  className={`text-xs sm:text-[13px] font-bold tracking-tight leading-tight truncate transition-colors ${
                    isFeatured
                      ? 'text-[#00D5FF] group-hover:text-white'
                      : 'text-white group-hover:text-[#E9B94F]'
                  }`}
                >
                  {item.name}
                </h3>

                {/* Specifications: Movement & Dial Size */}
                <div className="flex items-center gap-1.5 text-[10.5px] text-[#A7B1C2] mt-1 font-mono">
                  <span>⚙ {item.movement}</span>
                  <span>&bull;</span>
                  <span>⌀ {item.dialSize}</span>
                </div>

                {/* Star Rating & Reviews Count */}
                <div className="flex items-center gap-1 text-[11px] text-[#E9B94F] mt-1.5">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-bold text-white">{item.rating}</span>
                  <span className="text-[#A7B1C2] font-mono text-[10px]">({item.reviewsCount})</span>
                </div>
              </div>

              {/* Price Row & Add to Cart Action */}
              <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-[#253247]/60">
                <div>
                  <div className="font-mono font-bold text-sm sm:text-base text-white">
                    {formatPrice(item.price)}
                  </div>
                  {item.originalPrice && (
                    <div className="text-[10px] text-slate-500 line-through font-mono">
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Add to Cart Rounded Square Button matching reference */}
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(item, e)}
                  className="w-8 h-8 rounded-xl bg-[#030914] hover:bg-[#E9B94F] text-[#E9B94F] hover:text-black border border-[#E9B94F]/40 hover:border-[#E9B94F] flex items-center justify-center transition-all cursor-pointer shadow-sm group/btn active:scale-95"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BestSellersSection;
