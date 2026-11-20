import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, Printer, CreditCard } from 'lucide-react';

export default function ShopmaxModals({
  selectedOrder,
  setSelectedOrder,
  checkoutModalOpen,
  setCheckoutModalOpen,
  cardPaymentModalOpen,
  setCardPaymentModalOpen,
  posCart,
  setPosCart,
  subtotal,
  tax,
  grandTotal,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  tenderedCash,
  setTenderedCash,
  customerPhone,
  setCustomerPhone
}) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          MODAL 1: ORDER DETAILS MODAL
          ════════════════════════════════════════════════════════════════ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-lg w-full border border-[#1E2968] p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#1E2968] pb-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1265FF]/20 flex items-center justify-center text-[#00D9FF]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Order Details: {selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-400">{selectedOrder.date}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#081033] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-400 block text-[11px]">Customer</span>
                  <p className="font-bold text-white">{selectedOrder.customer}</p>
                  <p className="text-slate-400 text-[10px]">{selectedOrder.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${selectedOrder.statusStyle}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-300 font-bold block mb-1.5">
                  Ordered Timepieces:
                </span>
                <ul className="space-y-1 bg-[#081033] p-3 rounded-xl border border-white/5 text-slate-200">
                  {selectedOrder.items?.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#00D9FF]">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center bg-[#050B2D] p-3 rounded-xl border border-[#1E2968] font-bold text-sm">
                <span>Total Amount Paid</span>
                <span className="text-[#00D9FF] text-base">{selectedOrder.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1E2968] mt-5">
              <button
                type="button"
                onClick={() => {
                  alert(`🖨️ Printing Tax Invoice for ${selectedOrder.id}...`);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#1265FF] hover:bg-[#0e52d6] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 2: POS CHECKOUT CONFIRMATION MODAL
          ════════════════════════════════════════════════════════════════ */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-md w-full border border-[#1E2968] p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setCheckoutModalOpen(false);
                setPaymentSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1265FF]/20 text-[#00D9FF] flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">POS Terminal Checkout</h3>
                  <p className="text-xs text-slate-400">
                    Review cart & complete counter customer transaction
                  </p>
                </div>

                <div className="space-y-2 text-xs bg-[#081033] p-3 rounded-xl border border-white/5 max-h-40 overflow-y-auto mb-3">
                  {posCart.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-slate-300">
                      <span>
                        {it.name} <span className="text-[#00D9FF]">×{it.qty}</span>
                      </span>
                      <span className="font-semibold text-white">
                        ₹{(it.price * it.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#050B2D] p-3 rounded-xl border border-[#1E2968] space-y-1 text-xs mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST (10%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-white/10">
                    <span>Grand Total</span>
                    <span className="text-base text-[#00D9FF]">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPaymentSuccess(true)}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    💵 Cash Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSuccess(true)}
                    className="py-2.5 rounded-xl bg-[#1265FF] hover:bg-[#0e52d6] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    ⚡ Instant UPI QR
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Transaction Approved!</h3>
                <p className="text-xs text-slate-300">
                  Payment of ₹{grandTotal.toLocaleString('en-IN')} received successfully.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert('🖨️ Printing POS Thermal Receipt Slip...');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutModalOpen(false);
                      setPaymentSuccess(false);
                      setPosCart([]);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#1265FF] text-white font-bold text-xs cursor-pointer"
                  >
                    New Sale
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 3: PAY WITH CARD TERMINAL SIMULATION
          ════════════════════════════════════════════════════════════════ */}
      {cardPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0B1445] text-white rounded-2xl max-w-sm w-full border border-[#1E2968] p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setCardPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#1265FF]/20 text-[#00D9FF] flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">Swipe or Tap Card on Terminal</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Authorized Total: ₹{grandTotal.toLocaleString('en-IN')}
            </p>

            <div className="bg-[#081033] p-4 rounded-xl border border-white/10 space-y-2 text-xs mb-4">
              <div className="flex justify-between text-slate-400">
                <span>Terminal ID</span>
                <span className="font-mono text-white">WH-POS-04</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Protocol</span>
                <span className="text-[#00D9FF]">EMV Chip & Contactless</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert('💳 Card Swiped! Payment Authorized via ICICI Merchant Gateway.');
                setCardPaymentModalOpen(false);
                setPosCart([]);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1265FF] to-[#741BFF] text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Simulate Card Approval
            </button>
          </div>
        </div>
      )}
    </>
  );
}
