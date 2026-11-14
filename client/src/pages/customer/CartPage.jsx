import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import { Trash2, Plus, Minus, Tag, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    mrpTotal,
    deliveryCharges,
    couponDiscount,
    totalAmount,
    totalSavings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponMsg(res);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (checkoutSuccess) {
    return (
      <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
        <CustomerNavbar />
        <main className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl shadow-xl text-center border border-white/10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#F8FAFC] mb-1">Order Placed Successfully! 🎉</h2>
          <p className="text-xs text-[#A6B1C8] mb-6">
            Thank you for choosing WatchHub. Your luxury order <span className="font-mono font-bold text-[#F8FAFC]">#WH{Math.floor(10000 + Math.random() * 90000)}</span> has been confirmed.
          </p>
          <div className="bg-[#0B1022]/80 p-4 rounded-xl border border-white/10 text-xs text-left mb-6 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">Payment Status:</span>
              <span className="font-bold text-emerald-600">Verified & Paid (Online)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">Estimated Delivery:</span>
              <span className="font-bold text-[#F8FAFC]">Within 3-4 Working Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">Warehouse Fulfillment:</span>
              <span className="font-bold text-blue-600">Assigned to Mumbai Central Hub</span>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Link to="/" className="btn-gold text-xs">
              Continue Shopping
            </Link>
            <Link to="/dashboard" className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-[#A6B1C8] hover:bg-[#0B1022]/80">
              View in Staff Portal
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
        <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Shopping Cart ({cart.length} items)</h2>

        {cart.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-white/10 shadow-sm max-w-lg mx-auto">
            <span className="text-6xl block mb-3">🛒</span>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Your WatchHub cart is empty</h3>
            <p className="text-xs text-[#A6B1C8] mt-1 mb-5">Explore our heritage collections and find your timepiece.</p>
            <Link to="/products" className="btn-gold text-xs">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-white/10 shadow-sm flex items-center justify-between gap-4">
                  <div className="w-20 h-20 bg-[#0B1022]/80 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">⌚</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{item.category}</span>
                    <h4 className="text-sm font-bold text-[#F8FAFC] truncate">{item.name}</h4>
                    <p className="text-xs text-[#A6B1C8]">{item.warranty || '2 Years Warranty'}</p>
                    <div className="mt-2 text-sm font-extrabold text-[#F8FAFC] font-mono">
                      {formatPrice(item.price)}{' '}
                      <span className="text-xs text-gray-400 line-through font-normal ml-1">
                        {formatPrice(item.originalPrice || item.price * 1.4)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1 bg-[#0B1022]/80">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 bg-white/10 rounded flex items-center justify-center text-white hover:bg-white/20 shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 bg-white/10 rounded flex items-center justify-center text-white hover:bg-white/20 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-[#F8FAFC] font-mono">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 mt-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Coupon Card */}
              <div className="bg-[#10182D]/85 p-4 rounded-xl border border-white/10 shadow-sm text-[#F8FAFC]">
                <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-watch-gold" /> Apply Promo Code
                </span>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <div>
                      <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-emerald-600">{appliedCoupon.desc}</p>
                    </div>
                    <button onClick={removeCoupon} className="text-xs font-bold text-rose-600 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. FESTIVAL40"
                      className="flex-1 h-9 px-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-watch-gold uppercase"
                    />
                    <button type="submit" className="bg-watch-navy text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-watch-gold hover:text-watch-navy-dark transition-colors">
                      Apply
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`text-[11px] mt-2 font-medium ${couponMsg.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {couponMsg.message}
                  </p>
                )}
                <p className="text-[10.5px] text-gray-400 mt-2">Try codes: FESTIVAL40, WATCHHUB10, FIRSTBUY</p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-[#10182D]/85 p-5 rounded-xl border border-white/10 shadow-sm space-y-3 text-xs text-[#F8FAFC]">
                <h3 className="text-sm font-bold text-[#F8FAFC] border-b border-white/10 pb-2">Order Summary</h3>

                <div className="flex justify-between text-[#A6B1C8] font-mono">
                  <span>Total MRP</span>
                  <span>{formatPrice(mrpTotal)}</span>
                </div>

                <div className="flex justify-between text-[#A6B1C8] font-mono">
                  <span>Product Discount</span>
                  <span className="text-emerald-400 font-bold">-{formatPrice(mrpTotal - subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-[#A6B1C8] font-mono">
                    <span>Coupon Savings ({appliedCoupon.percent}%)</span>
                    <span className="text-emerald-400 font-bold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#A6B1C8]">
                  <span>Delivery Charges</span>
                  <span>{deliveryCharges === 0 ? <strong className="text-emerald-400 font-mono">FREE</strong> : <span className="font-mono">{formatPrice(deliveryCharges)}</span>}</span>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm font-extrabold text-[#F8FAFC]">
                  <span>Grand Total</span>
                  <span className="text-lg text-[#F4B942] font-mono">{formatPrice(totalAmount)}</span>
                </div>

                <div className="p-2.5 bg-white/5 border border-white/10 text-[#F4B942] rounded-lg text-[11px] font-semibold text-center font-mono">
                  🎉 You are saving {formatPrice(totalSavings)} on this acquisition!
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full btn-gold text-xs py-3 mt-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{isProcessing ? 'Processing Secure Payment...' : 'Proceed to Checkout →'}</span>
                </button>

                <div className="pt-2 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-watch-gold" />
                  <span>256-bit SSL Encrypted & Verified Razorpay Payment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Luxury WatchHub Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;

