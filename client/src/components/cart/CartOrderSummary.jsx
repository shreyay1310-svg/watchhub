import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';

export default function CartOrderSummary({
  uniqueItemsCount,
  mrpTotal,
  subtotal,
  appliedCoupon,
  couponDiscount,
  deliveryCharges,
  totalAmount,
  totalSavings,
  handleCheckout,
  formatPrice,
}) {
  return (
    <div className="bg-[#0B1628] border border-[#26364D] rounded-2xl p-6 space-y-4 shadow-xl text-xs text-white">
      <h2 className="text-base font-serif font-bold text-white border-b border-[#26364D]/60 pb-3 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="font-sans text-[11px] font-normal text-slate-400 font-mono">
          {uniqueItemsCount} {uniqueItemsCount === 1 ? 'Item' : 'Items'}
        </span>
      </h2>

      <div className="space-y-2.5 font-mono">
        {/* Total MRP */}
        <div className="flex justify-between text-[#A7B1C2]">
          <span>Total MRP</span>
          <span className="text-white">{formatPrice(mrpTotal)}</span>
        </div>

        {/* Product Discount */}
        <div className="flex justify-between text-[#A7B1C2]">
          <span>Product Discount</span>
          <span className="text-[#00C98B] font-bold">
            -{formatPrice(Math.max(0, mrpTotal - subtotal))}
          </span>
        </div>

        {/* Coupon Discount */}
        {appliedCoupon && (
          <div className="flex justify-between text-[#A7B1C2]">
            <span className="text-[#00C98B]">
              Coupon Savings ({appliedCoupon.percent}%)
            </span>
            <span className="text-[#00C98B] font-bold">
              -{formatPrice(couponDiscount)}
            </span>
          </div>
        )}

        {/* Delivery Charges */}
        <div className="flex justify-between text-[#A7B1C2]">
          <span>Delivery Charges</span>
          <span>
            {deliveryCharges === 0 ? (
              <span className="text-[#00C98B] font-bold">FREE (Complimentary)</span>
            ) : (
              <span>{formatPrice(deliveryCharges)}</span>
            )}
          </span>
        </div>

        {/* Taxes */}
        <div className="flex justify-between text-[#A7B1C2]">
          <span>Tax & Duties</span>
          <span className="text-slate-400">Included in Price</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-t border-[#26364D]/80 pt-4 flex justify-between items-baseline">
        <div>
          <span className="text-sm font-bold text-white block">Grand Total</span>
          <span className="text-[10px] text-slate-400 font-light">
            All international duties inclusive
          </span>
        </div>
        <span className="text-2xl font-bold font-mono text-[#E9B94F]">
          {formatPrice(totalAmount)}
        </span>
      </div>

      {/* Savings Banner */}
      {totalSavings > 0 && (
        <div className="p-3 bg-[#00C98B]/10 border border-[#00C98B]/40 text-[#00C98B] rounded-xl text-[11.5px] font-semibold text-center font-mono">
          🎉 You are saving {formatPrice(totalSavings)} on this acquisition!
        </div>
      )}

      {/* Proceed to Checkout CTA */}
      <button
        type="button"
        onClick={handleCheckout}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E9B94F] to-[#D4A33B] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(233,185,79,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
      >
        <span>PROCEED TO CHECKOUT</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Security Footnote */}
      <div className="pt-2 text-center text-[10.5px] text-slate-400 flex items-center justify-center gap-1.5 font-light">
        <Lock className="w-3.5 h-3.5 text-[#E9B94F]" />
        <span>256-bit SSL Encrypted & Verified Secure Payment</span>
      </div>
    </div>
  );
}
