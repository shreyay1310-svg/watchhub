import React, { useState } from 'react';
import { Search, Plus, Filter, Edit, Trash2, Tag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../../data/mockProducts';

export const ProductsManagementModule = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Men',
    brand: 'WatchHub Heritage',
    price: '',
    originalPrice: '',
    stock: '',
    emoji: '⌚',
    waterproof: '50M Water Resistant',
  });

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    const item = {
      id: `p_${Date.now()}`,
      name: newProd.name,
      category: newProd.category,
      brand: newProd.brand,
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice || newProd.price * 1.3),
      discount: 25,
      stock: Number(newProd.stock || 20),
      rating: 4.5,
      reviewsCount: 1,
      emoji: newProd.emoji,
      warranty: '2 Years Manufacturer Warranty',
      waterproof: newProd.waterproof,
    };
    setProducts([item, ...products]);
    setModalOpen(false);
    setNewProd({ name: '', category: 'Men', brand: 'WatchHub Heritage', price: '', originalPrice: '', stock: '', emoji: '⌚', waterproof: '50M Water Resistant' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this watch listing?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>⌚</span> Watch Product Catalog & Merchandising
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage 320+ luxury watch listings, pricing tiers, specifications and inventory reserves.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" /> Add New Watch
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by watch name or brand..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 outline-none focus:border-watch-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 font-semibold">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold bg-white text-gray-800"
          >
            <option value="All">All Categories ({products.length})</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Partywear">Partywear</option>
            <option value="Combo Offers">Combo Offers</option>
            <option value="Waterproof">Waterproof</option>
            <option value="Digital">Digital</option>
            <option value="Smartwatches">Smartwatches</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10.5px]">
              <tr>
                <th className="py-3.5 px-4">Watch Model</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Waterproof</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 flex-shrink-0 overflow-hidden shadow-xs">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">⌚</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-[11px] text-watch-gold font-semibold">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 text-gray-800 font-semibold px-2 py-0.5 rounded-full text-[10.5px]">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    ₹{p.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[11px] text-gray-400 line-through font-normal ml-1">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                      p.stock > 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.stock <= 15 && <AlertTriangle className="w-3 h-3" />}
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{p.waterproof}</td>
                  <td className="py-3 px-4 text-amber-600 font-bold">★ {p.rating} ({p.reviewsCount})</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => alert(`Edit watch specifications for ${p.name}`)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-watch-gold" title="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">Add New Timepiece</h3>
            <p className="text-xs text-gray-500 mb-4">Provide specifications, pricing and initial inventory reserve.</p>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Watch Model Name</label>
                <input
                  type="text"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Royal Chronograph Silver 42mm"
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold bg-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Partywear">Partywear</option>
                    <option value="Combo Offers">Combo Offers</option>
                    <option value="Waterproof">Waterproof</option>
                    <option value="Digital">Digital</option>
                    <option value="Smartwatches">Smartwatches</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="2999"
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    placeholder="4999"
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    placeholder="50"
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs py-2 px-4">
                  Publish Watch Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagementModule;

