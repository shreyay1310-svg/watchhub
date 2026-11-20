import React from 'react';
import { X, Check } from 'lucide-react';

export default function CatalogMobileFilterDrawer({
  isOpen,
  onClose,
  config,
  selectedSub,
  handleSubChange,
  availableBrands,
  selectedBrand,
  handleBrandChange,
  baseCategoryProductsCount,
  handleResetFilters,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
      />
      <div className="relative z-10 w-full max-w-xs bg-[#040A17] border-r border-[#00CFFF]/20 h-full p-5 overflow-y-auto space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="font-bold text-white text-sm">Filters & Refinements</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Subcategories */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8] block mb-2">
            Subcategory
          </label>
          <div className="space-y-1">
            {config.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  handleSubChange(sub.id, sub.link);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                  selectedSub === sub.id
                    ? 'bg-[#00CFFF]/20 text-[#00CFFF] font-bold'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span>
                  {sub.icon} {sub.label}
                </span>
                {selectedSub === sub.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Brands */}
        {availableBrands.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <label className="text-xs font-bold uppercase tracking-wider text-[#A6B1C8] block mb-2">
              Brand
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  handleBrandChange('all');
                  onClose();
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                  selectedBrand === 'all'
                    ? 'bg-[#F4B942]/20 text-[#F4B942] font-bold'
                    : 'text-gray-300'
                }`}
              >
                All Brands ({baseCategoryProductsCount})
              </button>
              {availableBrands.map(([brand, count]) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => {
                    handleBrandChange(brand);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    selectedBrand.toLowerCase() === brand.toLowerCase()
                      ? 'bg-[#F4B942]/20 text-[#F4B942] font-bold'
                      : 'text-gray-300'
                  }`}
                >
                  <span>{brand}</span>
                  <span className="text-[10px] text-gray-500">{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex gap-2">
          <button
            type="button"
            onClick={() => {
              handleResetFilters();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-white/5 text-xs text-gray-300 hover:text-white"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-[#00CFFF] text-xs font-bold text-black"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
