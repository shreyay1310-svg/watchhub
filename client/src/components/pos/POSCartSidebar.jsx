import React from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  Percent,
  UserPlus,
  ChevronDown,
  ArrowRight,
  DollarSign,
  RotateCcw,
  Pause,
  CreditCard,
  Check,
} from 'lucide-react';

export default function POSCartSidebar({
  currentSale = [],
  handleNewSale,
  handleHoldSale,
  customersList = [],
  selectedCustomer,
  setSelectedCustomer,
  setShowAddCustomerModal,
  handleUpdateQty,
  handleRemoveFromSale,
  formatPrice,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  appliedCoupon,
  setAppliedCoupon,
  discountType,
  setDiscountType,
  discountValue,
  handleApplyDiscountInput,
  managerAuthorized,
  setManagerPinModalOpen,
  grossSubtotal,
  customerDiscountAmount,
  couponDiscountAmount,
  totalDiscount,
  netTaxableAmount,
  cgstAmount,
  sgstAmount,
  grandTotal,
  setPaymentModalOpen,
}) {
  return (
    <section className="xl:col-span-5 bg-[#11123D] border border-[#23275E] rounded-3xl p-5 shadow-2xl space-y-4 sticky top-4">
          {/* Header of Current Sale */}
          <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-white">Current Sale</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#6500FF]/20 text-[#00D5FF] border border-[#6500FF]/40 text-xs font-mono font-bold">
                  {currentSale.reduce((sum, it) => sum + it.qty, 0)} Items
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-mono">
                Order Ticket #SALE-{Math.floor(1000 + currentSale.length * 24)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleHoldSale}
              className="px-2.5 py-1 rounded-xl bg-[#080923] hover:bg-[#1E1256] text-[#E9B94F] text-[11px] font-bold border border-[#23275E] flex items-center gap-1 cursor-pointer transition-colors"
              title="Hold this sale temporarily"
            >
              <Pause className="w-3 h-3" />
              <span>Hold</span>
            </button>
          </div>

          {/* 5. CUSTOMER SELECTION BAR */}
          <div className="relative bg-[#080923] border border-[#23275E] rounded-2xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10.5px] font-bold text-slate-400 font-mono flex items-center gap-1 uppercase">
                <User className="w-3 h-3 text-[#E9B94F]" /> Client / Customer
              </span>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                className="text-[10.5px] text-[#00D5FF] hover:underline flex items-center gap-0.5 font-bold"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ New Client</span>
              </button>
            </div>

            {/* Selected Customer View & Dropdown Trigger */}
            <div
              onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
              className="flex items-center justify-between p-2 rounded-xl bg-[#11123D] border border-white/5 hover:border-[#6500FF] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6500FF] to-[#E9B94F] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {selectedCustomer.phone} •{' '}
                    <span className="text-[#E9B94F] font-bold">{selectedCustomer.tier}</span>
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Dropdown Menu */}
            {showCustomerDropdown && (
              <div className="absolute left-0 right-0 top-18 z-40 bg-[#080923] border border-[#23275E] rounded-2xl shadow-2xl p-2 space-y-1">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search VIP clients by name/phone..."
                  className="w-full h-8 px-2.5 bg-[#11123D] border border-white/10 rounded-lg text-xs text-white outline-none mb-1 font-mono"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {customersList
                    .filter((c) =>
                      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      c.phone.includes(customerSearch)
                    )
                    .map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setShowCustomerDropdown(false);
                          showToast(`Selected client: ${cust.name}`);
                        }}
                        className={`p-2 rounded-xl text-xs flex justify-between items-center cursor-pointer transition-colors ${selectedCustomer.id === cust.id
                          ? 'bg-[#6500FF] text-white font-bold'
                          : 'hover:bg-[#11123D] text-slate-300'
                          }`}
                      >
                        <div>
                          <p className="font-semibold">{cust.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{cust.phone}</p>
                        </div>
                        <span className="text-[10px] text-[#E9B94F] font-mono">{cust.tier}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. CURRENT SALE ITEMS (Scrollable) */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {currentSale.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono border border-dashed border-[#23275E] rounded-2xl">
                <span>🛒 Current bill is empty.</span>
                <span className="block text-[10px] text-slate-600 mt-1">
                  Select watches from catalog or scan barcode.
                </span>
              </div>
            ) : (
              currentSale.map((it) => (
                <div
                  key={it.id}
                  className="bg-[#080923] border border-[#23275E] rounded-xl p-2.5 flex items-center justify-between gap-3"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-[#11123D] p-1 flex items-center justify-center flex-shrink-0 border border-white/5">
                    <img
                      src={it.image}
                      alt={it.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/watch_placeholder.png';
                      }}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>

                  {/* Title & Brand */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-[#E9B94F] uppercase">{it.brand}</p>
                    <h4 className="text-xs font-bold text-white truncate" title={it.name}>
                      {it.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 font-mono font-semibold">
                      {formatPrice(it.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#11123D] border border-[#23275E] rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(it.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-[#6500FF] hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-mono font-bold text-white">
                      {it.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(it.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-[#6500FF] hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item Net Subtotal */}
                  <div className="text-right font-mono">
                    <p className="text-xs font-bold text-white">
                      {formatPrice(it.price * it.qty)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromSale(it.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                      title="Remove from bill"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 6. DISCOUNTS & COUPON SECTION */}
          <div className="bg-[#080923] border border-[#23275E] rounded-2xl p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                <Percent className="w-3 h-3 text-[#00D5FF]" /> Privilege Discount & Coupon
              </span>
              {appliedCoupon && (
                <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {appliedCoupon.code} (-{appliedCoupon.percent}%)
                </span>
              )}
            </div>

            {/* Quick Discount Buttons */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {[0, 5, 10, 15, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleApplyDiscountInput(pct, 'percentage')}
                  className={`flex-1 py-1 rounded-lg border transition-all cursor-pointer ${discountType === 'percentage' && discountValue === pct
                    ? 'bg-[#6500FF] text-white font-bold border-[#6500FF]'
                    : 'bg-[#11123D] border-[#23275E] text-slate-300 hover:border-slate-400'
                    }`}
                >
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              ))}
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="PROMO CODE (e.g. FESTIVAL40)"
                className="flex-1 h-8 px-2.5 bg-[#11123D] border border-[#23275E] rounded-lg text-xs text-white uppercase font-mono outline-none focus:border-[#00D5FF]"
              />
              <button
                type="submit"
                className="px-3 h-8 rounded-lg bg-[#00D5FF] hover:bg-[#6500FF] text-black hover:text-white font-bold text-xs font-mono transition-colors"
              >
                Apply
              </button>
              {appliedCoupon && (
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon(null);
                    showToast('Coupon removed');
                  }}
                  className="px-2 h-8 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs"
                  title="Remove coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* FINANCIAL SUMMARY & GST BREAKDOWN */}
          <div className="bg-[#080923] border border-[#23275E] rounded-2xl p-3.5 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Gross Subtotal</span>
              <span className="text-white">{formatPrice(grossSubtotal)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Total Privilege Discount</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Taxable Value</span>
              <span className="text-white">{formatPrice(netTaxableAmount)}</span>
            </div>

            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>CGST (9%) + SGST (9%)</span>
              <span className="text-white">{formatPrice(totalGst)}</span>
            </div>

            {/* Prominent Grand Total */}
            <div className="pt-2 border-t border-[#23275E] flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-white block">FINAL PAYABLE</span>
                <span className="text-[10px] text-slate-400">GST Inclusive</span>
              </div>
              <span className="text-2xl font-bold text-[#E9B94F] font-mono">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          {/* 7. ACTION BUTTONS: PROCEED TO PAYMENT */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={currentSale.length === 0}
              onClick={() => setPaymentModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1265FF] via-[#6500FF] to-[#8B00FF] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_25px_rgba(18,101,255,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>COLLECT PAYMENT ({formatPrice(grandTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHoldSale}
                className="flex-1 py-2 rounded-xl bg-[#080923] hover:bg-[#1E1256] text-slate-300 hover:text-white border border-[#23275E] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Pause className="w-3.5 h-3.5 text-[#E9B94F]" />
                <span>Hold Sale</span>
              </button>

              <button
                type="button"
                onClick={handleNewSale}
                className="flex-1 py-2 rounded-xl bg-[#080923] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-[#23275E] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Sale</span>
              </button>
            </div>
          </div>
        </section>
  );
}
