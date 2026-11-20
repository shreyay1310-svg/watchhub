import React from 'react';
import {
  Edit3,
  Trash2,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Star,
  Check,
} from 'lucide-react';

export const ProductsTable = ({
  paginatedProducts,
  selectedItems,
  handleSelectAll,
  handleToggleSelect,
  handleOpenEditModal,
  handleDuplicateProduct,
  handleDeleteProduct,
  setShowDetailsModal,
  stats,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  BRAND_LOGOS,
}) => {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          6. MAIN PRODUCT TABLE
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/10 bg-[#0B1022]/80/70 text-[11px] font-bold text-[#A6B1C8] uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProducts.length > 0 &&
                      paginatedProducts.every((p) => selectedItems.includes(p.id))
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-[#D6A63C] rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-[#F8FAFC]">
                    <span>Product</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </span>
                </th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-[#F8FAFC]">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </span>
                </th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-50">
              {paginatedProducts.map((p) => {
                const isSelected = selectedItems.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-amber-50/20 transition-colors ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(p.id)}
                        className="w-4 h-4 accent-[#D6A63C] rounded cursor-pointer"
                      />
                    </td>

                    {/* Product Name & Subspecs */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0B1022]/80 border border-white/10 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/products/watch_placeholder.png';
                            }}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#F8FAFC] leading-snug line-clamp-1">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                            {p.subSpecs || `${p.specifications?.dialSize || '41 mm'} • ${p.specifications?.caseMaterial || 'Steel'} • ${p.specifications?.dialColor || 'Dial'}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono font-bold text-[#A6B1C8] text-[11px]">
                      {p.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#A6B1C8] font-medium whitespace-nowrap">
                      {p.category}
                    </td>

                    {/* Brand */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#F8FAFC] whitespace-nowrap">
                        <span className="text-sm">{BRAND_LOGOS[p.brand] || '⌚'}</span>
                        <span>{p.brand}</span>
                      </div>
                    </td>

                    {/* Price & Discount */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>
                        <span className="font-bold text-[#F8FAFC] text-xs">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="line-through text-gray-400 text-[10px]">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[9.5px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                              -{p.discount}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 font-bold text-[#F8FAFC]">
                      {p.stock}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {p.status === 'Active' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      ) : p.status === 'Low Stock' || p.stock <= 10 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Low Stock
                        </span>
                      ) : p.status === 'Draft' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-white/5 text-[#A6B1C8] border border-white/10">
                          Draft
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#F8FAFC]">
                        <Star className="w-3.5 h-3.5 text-[#D6A63C] fill-[#D6A63C]" />
                        <span>{p.rating}</span>
                        <span className="text-gray-400 font-normal">
                          ({p.reviewsCount?.toLocaleString('en-IN') || 120})
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setShowDetailsModal(p)}
                          className="p-1.5 hover:bg-white/5 text-[#A6B1C8] hover:text-black rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 hover:bg-white/5 text-[#A6B1C8] hover:text-[#D6A63C] rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1.5 hover:bg-white/5 text-[#A6B1C8] hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            7. PAGINATION STRIP
            ════════════════════════════════════════════════════════════════ */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A6B1C8]">
          <div>
            Showing <span className="font-bold text-[#F8FAFC]">1–{paginatedProducts.length}</span> of{' '}
            <span className="font-bold text-[#F8FAFC]">{stats.total} products</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Items Per Page */}
            <div className="flex items-center gap-1.5">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#10182D]/90 backdrop-blur-md font-semibold text-[#A6B1C8]"
              >
                <option value={8}>8 per page</option>
                <option value={16}>16 per page</option>
                <option value={24}>24 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button className="px-2.5 py-1 rounded-lg bg-[#D6A63C] text-black font-extrabold text-xs">
                1
              </button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-white/5 text-[#A6B1C8]">2</button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-white/5 text-[#A6B1C8]">3</button>
              <span className="px-1 text-gray-400">...</span>
              <button className="px-2.5 py-1 rounded-lg hover:bg-white/5 text-[#A6B1C8]">40</button>

              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(40)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ProductsTable;
