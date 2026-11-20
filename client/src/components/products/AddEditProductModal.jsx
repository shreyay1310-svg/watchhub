import React from 'react';
import { X } from 'lucide-react';

export const AddEditProductModal = ({
  showAddEditModal,
  setShowAddEditModal,
  editingProduct,
  formActiveTab,
  setFormActiveTab,
  formData,
  setFormData,
  handleFormSubmit,
  BRAND_LOGOS,
}) => {
  if (!showAddEditModal) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          8. ADD / EDIT PRODUCT MODAL (Comprehensive Multi-Tab Form)
          ════════════════════════════════════════════════════════════════ */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#0B121C] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span className="text-[#D6A63C]">⌚</span>
                  <span>{editingProduct ? 'Edit Product Listing' : 'Add New Watch Product'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Complete official product specifications, inventory, and pricing tiers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Section Navigation Tabs */}
            <div className="bg-[#0B1022]/80 border-b border-white/10 px-5 flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'specs', label: '2. Watch Specs' },
                { id: 'pricing', label: '3. Pricing & Taxes' },
                { id: 'inventory', label: '4. Inventory' },
                { id: 'variants', label: '5. Variants' },
                { id: 'media', label: '6. Media & SEO' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFormActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    formActiveTab === tab.id
                      ? 'bg-[#0B121C] text-[#D6A63C] shadow-xs'
                      : 'text-[#A6B1C8] hover:text-black hover:bg-gray-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: BASIC INFO */}
              {formActiveTab === 'basic' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#A6B1C8] mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rolex Submariner Date 41mm"
                      className="w-full h-10 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">
                      SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      placeholder="e.g. WH-ROL-001"
                      className="w-full h-10 px-3 rounded-xl border border-white/10 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Brand *</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    >
                      {Object.keys(BRAND_LOGOS).map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    >
                      <option value="Luxury Watches">Luxury Watches</option>
                      <option value="Men's Watches">Men's Watches</option>
                      <option value="Women's Watches">Women's Watches</option>
                      <option value="Sports Watches">Sports Watches</option>
                      <option value="Smartwatches">Smartwatches</option>
                      <option value="Kids' Watches">Kids' Watches</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Couple">Couple Pair</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#A6B1C8] mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed luxury watch description, craftsmanship, movement details..."
                      className="w-full p-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: WATCH SPECIFICATIONS */}
              {formActiveTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Dial Size</label>
                    <input
                      type="text"
                      value={formData.specifications.dialSize}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, dialSize: e.target.value },
                        })
                      }
                      placeholder="e.g. 41 mm"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Dial Shape</label>
                    <select
                      value={formData.specifications.dialShape}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, dialShape: e.target.value },
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    >
                      <option value="Round">Round</option>
                      <option value="Square">Square</option>
                      <option value="Rectangle">Rectangle</option>
                      <option value="Octagonal">Octagonal</option>
                      <option value="Tonneau">Tonneau</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Dial Colour</label>
                    <input
                      type="text"
                      value={formData.specifications.dialColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, dialColor: e.target.value },
                        })
                      }
                      placeholder="e.g. Black / Sunburst Blue"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Case Material</label>
                    <input
                      type="text"
                      value={formData.specifications.caseMaterial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, caseMaterial: e.target.value },
                        })
                      }
                      placeholder="e.g. 316L Stainless Steel / Gold"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Strap Material</label>
                    <input
                      type="text"
                      value={formData.specifications.strapMaterial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, strapMaterial: e.target.value },
                        })
                      }
                      placeholder="e.g. Stainless Steel Oyster Bracelet"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Movement Type</label>
                    <input
                      type="text"
                      value={formData.specifications.movementType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, movementType: e.target.value },
                        })
                      }
                      placeholder="e.g. Automatic Self-Winding"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Water Resistance</label>
                    <input
                      type="text"
                      value={formData.specifications.waterResistance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, waterResistance: e.target.value },
                        })
                      }
                      placeholder="e.g. 300M Diver / 50M"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Country of Origin</label>
                    <input
                      type="text"
                      value={formData.specifications.countryOfOrigin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, countryOfOrigin: e.target.value },
                        })
                      }
                      placeholder="e.g. Switzerland"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Official Warranty</label>
                    <input
                      type="text"
                      value={formData.specifications.warranty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, warranty: e.target.value },
                        })
                      }
                      placeholder="e.g. 5 Years International Warranty"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING & TAXES */}
              {formActiveTab === 'pricing' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 18999"
                      className="w-full h-10 px-3 rounded-xl border border-white/10 font-bold focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Original MRP Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="e.g. 24999"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Wholesale Cost Price (₹)</label>
                    <input
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      placeholder="e.g. 12000"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  {/* Profit Margin Preview Card */}
                  <div className="sm:col-span-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#F8FAFC]">Estimated Profit Margin</p>
                      <p className="text-[11px] text-[#A6B1C8]">
                        Selling Price minus Wholesale Cost Price per unit
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-extrabold text-[#D6A63C]">
                        ₹
                        {formData.price && formData.costPrice
                          ? (Number(formData.price) - Number(formData.costPrice)).toLocaleString('en-IN')
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INVENTORY */}
              {formActiveTab === 'inventory' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Available Quantity</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="e.g. 24"
                      className="w-full h-10 px-3 rounded-xl border border-white/10 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Low Stock Warning Threshold</label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Warehouse Location</label>
                    <input
                      type="text"
                      value={formData.warehouseLocation}
                      onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Barcode / EAN</label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="e.g. 8901234567890"
                      className="w-full h-10 px-3 rounded-xl border border-white/10 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: VARIANTS */}
              {formActiveTab === 'variants' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#F8FAFC]">Product Variants (Dials, Straps & Sizes)</p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          variants: [
                            ...formData.variants,
                            { variantSku: '', dialColor: 'Blue', strapColor: 'Silver', size: '41 mm', price: formData.price, stock: 5 },
                          ],
                        })
                      }
                      className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg font-bold"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#0B1022]/80 text-[10px] text-[#A6B1C8] font-bold uppercase">
                        <tr>
                          <th className="p-2">Variant SKU</th>
                          <th className="p-2">Dial</th>
                          <th className="p-2">Strap</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Price (₹)</th>
                          <th className="p-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.variants.map((v, idx) => (
                          <tr key={idx}>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.variantSku}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].variantSku = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                placeholder="SKU-VAR"
                                className="w-full p-1 border rounded font-mono text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.dialColor}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].dialColor = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-full p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.strapColor}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].strapColor = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-full p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.size}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].size = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-full p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].price = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-20 p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].stock = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-16 p-1 border rounded text-[11px]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: MEDIA & SEO */}
              {formActiveTab === 'media' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">Main Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/images/products/rolex-submariner.png"
                      className="w-full h-10 px-3 rounded-xl border border-white/10"
                    />
                    <div className="mt-2 w-24 h-24 rounded-xl border border-white/10 bg-[#0B1022]/80 p-2 flex items-center justify-center">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#A6B1C8] mb-1">SEO URL Slug</label>
                    <input
                      type="text"
                      value={formData.seo?.slug || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, slug: e.target.value },
                        })
                      }
                      placeholder="rolex-submariner-date-41mm"
                      className="w-full h-10 px-3 rounded-xl border border-white/10 font-mono text-[11px]"
                    />
                    <div className="mt-3">
                      <label className="flex items-center gap-2 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 accent-[#D6A63C] rounded"
                        />
                        <span>Mark as Featured Product in Customer Store</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E6BA5E] text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default AddEditProductModal;
