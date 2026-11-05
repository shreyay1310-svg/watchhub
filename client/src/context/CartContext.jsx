import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('watchhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('watchhub_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('watchhub_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('watchhub_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const mrpTotal = cart.reduce((sum, item) => sum + (item.originalPrice || item.price * 1.4) * (item.quantity || 1), 0);
  const deliveryCharges = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const couponDiscount = appliedCoupon ? (subtotal * (appliedCoupon.percent / 100)) : 0;
  const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryCharges);
  const totalSavings = (mrpTotal - subtotal) + couponDiscount;

  const applyCoupon = (code) => {
    const validCoupons = {
      'WATCHLUX40': { percent: 40, code: 'WATCHLUX40', desc: '40% OFF Flash Offer' },
      'FESTIVAL40': { percent: 40, code: 'FESTIVAL40', desc: 'Festival 40% OFF' },
      'WATCHHUB10': { percent: 10, code: 'WATCHHUB10', desc: '10% Instant Discount' },
      'FIRSTBUY': { percent: 15, code: 'FIRSTBUY', desc: '15% First Order Discount' },
    };
    const c = validCoupons[code.toUpperCase()];
    if (c) {
      setAppliedCoupon(c);
      return { success: true, message: `Coupon applied: ${c.desc}!` };
    }
    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        wishlistCount: wishlist.length,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        subtotal,
        mrpTotal,
        deliveryCharges,
        couponDiscount,
        totalAmount,
        totalSavings,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

