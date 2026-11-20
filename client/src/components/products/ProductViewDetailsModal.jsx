import React from 'react';
import { X } from 'lucide-react';

export const ProductViewDetailsModal = ({
  showDetailsModal,
  setShowDetailsModal,
}) => {
  if (!showDetailsModal) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          9. PRODUCT DETAILS MODAL (View Details)
          ════════════════════════════════════════════════════════════════ */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#0B121C] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⌚</span>
                <div>
                  <h3 className="font-bold text-base leading-snug">{showDetailsModal.name}</h3>
                  <p className="text-xs text-[#D6A63C] font-mono">SKU: {showDetailsModal.sku}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailsModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Image */}
                <div className="md:col-span-4 bg-[#0B1022]/80 rounded-2xl border border-white/10 p-4 flex items-center justify-center">
                  <img
                    src={showDetailsModal.image}
                    alt={showDetailsModal.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/watch_placeholder.png';
                    }}
                    className="w-48 h-48 object-contain"
                  />
                </div>

                {/* Core Overview */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {showDetailsModal.brand} • {showDetailsModal.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {showDetailsModal.status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold font-sans text-[#F8FAFC]">
                      ₹{showDetailsModal.price.toLocaleString('en-IN')}
                    </span>
                    {showDetailsModal.originalPrice && (
                      <span className="line-through text-gray-400 text-sm">
                        ₹{showDetailsModal.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {showDetailsModal.discount > 0 && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        -{showDetailsModal.discount}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-[#A6B1C8] leading-relaxed">{showDetailsModal.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px]">
                    <div className="p-2 rounded-xl bg-[#0B1022]/80">
                      <span className="text-gray-400 block">Available Stock</span>
                      <span className="font-bold text-[#F8FAFC] text-sm">{showDetailsModal.stock} units</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0B1022]/80">
                      <span className="text-gray-400 block">Wholesale Cost</span>
                      <span className="font-bold text-[#F8FAFC] text-sm">
                        ₹{showDetailsModal.costPrice?.toLocaleString('en-IN') || '—'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#0B1022]/80">
                      <span className="text-gray-400 block">Customer Rating</span>
                      <span className="font-bold text-[#F8FAFC] text-sm flex items-center gap-1">
                        ★ {showDetailsModal.rating} ({showDetailsModal.reviewsCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="font-bold text-[#F8FAFC] text-sm mb-3">Technical Specifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0B1022]/80/50 p-4 rounded-xl border border-white/10">
                  {Object.entries(showDetailsModal.specifications || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-semibold text-[#F8FAFC]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Variants List */}
              {showDetailsModal.variants?.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-bold text-[#F8FAFC] text-sm mb-2">Available Variants</h4>
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0B1022]/80 text-[10px] text-[#A6B1C8] font-bold uppercase">
                        <tr>
                          <th className="p-2">Variant SKU</th>
                          <th className="p-2">Dial</th>
                          <th className="p-2">Strap</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {showDetailsModal.variants.map((v, i) => (
                          <tr key={i}>
                            <td className="p-2 font-mono font-bold">{v.variantSku}</td>
                            <td className="p-2">{v.dialColor}</td>
                            <td className="p-2">{v.strapColor}</td>
                            <td className="p-2">{v.size}</td>
                            <td className="p-2 font-bold">₹{v.price?.toLocaleString('en-IN')}</td>
                            <td className="p-2">{v.stock} units</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ProductViewDetailsModal;
