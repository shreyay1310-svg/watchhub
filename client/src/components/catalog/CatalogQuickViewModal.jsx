import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { getProductImage, getProductAlt } from '../../utils/productImageMap';

export default function CatalogQuickViewModal({
  product,
  onClose,
  onAddToCart,
  onNavigateDetails,
  formatPrice,
}) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#040C1A] border border-[#00CFFF]/40 rounded-3xl max-w-2xl w-full p-6 text-white relative shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="w-full h-64 bg-gradient-to-b from-[#060D1A] to-[#02060F] rounded-2xl flex items-center justify-center p-4 border border-white/10">
            <img
              src={getProductImage(product)}
              alt={getProductAlt(product)}
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
              onError={(e) => {
                e.target.src = '/images/products/watch_placeholder.png';
              }}
            />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4B942]">
              {product.brand} • {product.category}
            </span>
            <h3 className="text-lg font-bold font-serif leading-snug">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-[#00CFFF]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#1265FF] text-white font-bold text-xs shadow-md shadow-[#00CFFF]/25 cursor-pointer flex items-center justify-center gap-2 hover:opacity-90"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateDetails(product.id);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
