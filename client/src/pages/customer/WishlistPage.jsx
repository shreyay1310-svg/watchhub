import React from 'react';
import { Link } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  return (
    <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist ({wishlist.length} saved items)</h2>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto">
            <span className="text-6xl block mb-3">🤍</span>
            <h3 className="text-lg font-bold text-gray-800">Your Wishlist is Empty</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">Save your favourite watches here and shop them anytime.</p>
            <Link to="/products" className="btn-gold text-xs">
              Explore Watches
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map((p) => (
              <div key={p.id} className="card-luxury overflow-hidden flex flex-col justify-between group">
                <div className="h-48 bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl">⌚</span>
                  )}
                  <span className="absolute bottom-2 left-3 bg-watch-navy/80 text-watch-gold text-[9px] font-bold px-2 py-0.5 rounded">
                    {p.brand}
                  </span>
                  <button
                    onClick={() => toggleWishlist(p)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{p.category}</span>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{p.warranty}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-gray-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(p);
                        toggleWishlist(p);
                      }}
                      className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;

