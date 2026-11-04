import React, { useState } from 'react';
import { Plus, FolderPlus, Tag, Layers, CheckCircle } from 'lucide-react';

const INITIAL_CATEGORIES = [
  { id: 'cat_1', name: "Men's Watches", slug: 'men', icon: '👨', count: 64, status: 'Active', banner: 'Active' },
  { id: 'cat_2', name: "Women's Watches", slug: 'women', icon: '👩', count: 48, status: 'Active', banner: 'Active' },
  { id: 'cat_3', name: 'Couple Watches', slug: 'couple', icon: '💑', count: 32, status: 'Active', banner: 'Active' },
  { id: 'cat_4', name: 'Partywear Watches', slug: 'partywear', icon: '🎉', count: 45, status: 'Active', banner: 'Active' },
  { id: 'cat_5', name: 'Combo Offers', slug: 'combo', icon: '🎁', count: 28, status: 'Active', banner: 'Active' },
  { id: 'cat_6', name: 'Waterproof Watches', slug: 'waterproof', icon: '💧', count: 36, status: 'Active', banner: 'Active' },
  { id: 'cat_7', name: 'Digital Tactical Watches', slug: 'digital', icon: '📱', count: 24, status: 'Active', banner: 'Active' },
  { id: 'cat_8', name: 'Smartwatches AMOLED', slug: 'smartwatches', icon: '⌚', count: 40, status: 'Active', banner: 'Active' },
  { id: 'cat_9', name: 'Luxury Tourbillon & Swiss', slug: 'luxury', icon: '👑', count: 18, status: 'Active', banner: 'Active' },
  { id: 'cat_10', name: 'Sports & Military Watches', slug: 'sports', icon: '🏃', count: 20, status: 'Active', banner: 'Active' },
  { id: 'cat_11', name: 'Kids Watches', slug: 'kids', icon: '👶', count: 15, status: 'Active', banner: 'Active' },
];

const BRANDS = [
  { name: 'Rolex', models: 45, country: 'Geneva, Switzerland', tier: 'Ultra Luxury' },
  { name: 'Omega', models: 38, country: 'Biel, Switzerland', tier: 'Swiss Luxury' },
  { name: 'Patek Philippe', models: 18, country: 'Plan-les-Ouates, Switzerland', tier: 'High Horology' },
  { name: 'Audemars Piguet', models: 22, country: 'Le Brassus, Switzerland', tier: 'High Horology' },
  { name: 'Cartier', models: 32, country: 'Paris, France', tier: 'Prestige Jewelry & Watches' },
  { name: 'TAG Heuer', models: 40, country: 'La Chaux-de-Fonds, Switzerland', tier: 'Avant-Garde Luxury' },
  { name: 'Breitling', models: 26, country: 'Grenchen, Switzerland', tier: 'Aviation Luxury' },
  { name: 'Tissot', models: 60, country: 'Le Locle, Switzerland', tier: 'Swiss Heritage' },
  { name: 'Rado', models: 25, country: 'Lengnau, Switzerland', tier: 'High-Tech Ceramic' },
  { name: 'Seiko', models: 85, country: 'Tokyo, Japan', tier: 'Japanese Precision' },
  { name: 'Citizen', models: 55, country: 'Tokyo, Japan', tier: 'Eco-Drive Solar' },
  { name: 'Casio & G-Shock', models: 95, country: 'Tokyo, Japan', tier: 'Digital & Tactical' },
  { name: 'Titan', models: 120, country: 'Bangalore, India', tier: 'Heritage & Elegance' },
  { name: 'Fossil', models: 70, country: 'Texas, USA', tier: 'American Fashion' },
  { name: 'Apple Watch', models: 30, country: 'California, USA', tier: 'Smart Wearables' },
  { name: 'Samsung Galaxy', models: 25, country: 'Seoul, South Korea', tier: 'Smart Wearables' },
  { name: 'Garmin', models: 20, country: 'Schaffhausen, Switzerland', tier: 'Multisport GPS' },
  { name: 'Hublot', models: 16, country: 'Nyon, Switzerland', tier: 'Contemporary Luxury' },
  { name: 'Emporio Armani', models: 34, country: 'Milan, Italy', tier: 'Designer Fashion' },
  { name: 'Tommy Hilfiger', models: 36, country: 'New York, USA', tier: 'Modern Classic' },
];

export const CategoriesBrandsModule = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', icon: '⌚' });

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.name) return;
    const item = {
      id: `cat_${Date.now()}`,
      name: newCat.name,
      slug: newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, '-'),
      icon: newCat.icon || '⌚',
      count: 0,
      status: 'Active',
      banner: 'Active',
    };
    setCategories([...categories, item]);
    setModalOpen(false);
    setNewCat({ name: '', slug: '', icon: '⌚' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>📁</span> Categories & Brand Partnerships
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize store navigation hierarchies, merchandising categories and official brand partner registries.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-watch-gold hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 flex-shrink-0">
                {c.icon}
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">{c.name}</p>
                <p className="text-[11px] text-gray-400 font-mono">/{c.slug}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {c.count} models
            </span>
          </div>
        ))}
      </div>

      {/* Brand Partners */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <span>👑</span> Official Manufacturer Brands
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {BRANDS.map((b, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="font-bold text-gray-800">{b.name}</p>
              <p className="text-gray-500 text-[11px] mt-0.5">{b.country}</p>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/60 text-[10.5px]">
                <span className="text-gray-400">{b.tier}</span>
                <span className="font-bold text-watch-navy">{b.models} models</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">Create Watch Category</h3>
            <p className="text-xs text-gray-500 mb-4">Add a new merchandising group to the storefront.</p>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Category Title</label>
                <input
                  type="text"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="e.g. Vintage Mechanical Watches"
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={newCat.slug}
                    onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                    placeholder="vintage-mechanical"
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Icon / Emoji</label>
                  <input
                    type="text"
                    value={newCat.icon}
                    onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                    placeholder="🕰️"
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold text-center text-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs py-2 px-4">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesBrandsModule;

