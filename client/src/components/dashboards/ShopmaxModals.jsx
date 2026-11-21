import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, Printer, CreditCard, AlertCircle } from 'lucide-react';
import api from '../../services/api';

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
  setCustomerPhone,
  onOrderCompleted,
}) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdReceipt, setCreatedReceipt] = useState(null);

  const handleProcessPosOrder = async (method = 'Cash') => {
    if (!posCart.length) {
      setSubmitError('Cart is empty.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await api.post('/store-admin/pos/order', {
        cartItems: posCart.map((it) => ({
          id: it.id,
          qty: it.qty,
        })),
        customerPhone: customerPhone || '9876543210',
        customerName: customerPhone ? `POS Customer (${customerPhone})` : 'Walk-in Customer',
        paymentMethod: method,
      });

      if (response.data && response.data.status === 'success') {
        setCreatedReceipt(response.data.receipt);
        setPaymentSuccess(true);
        if (onOrderCompleted) onOrderCompleted();
      } else {
        setSubmitError(response.data?.message || 'Transaction could not be processed.');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Payment submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = (receipt) => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to print receipts.');
      return;
    }
    const html = `
      <html>
        <head>
          <title>WatchHub Atelier POS Receipt - ${receipt?.orderNumber || 'Sale'}</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #111; max-width: 380px; margin: auto; }
            .center { text-align: center; }
            .line { border-top: 1px dashed #333; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; margin: 4px 0; font-size: 12px; }
            .bold { font-weight: bold; }
            .demo-banner { font-size: 10px; background: #eee; padding: 5px; text-align: center; margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 16px;">WATCHHUB ATELIER</div>
          <div class="center" style="font-size: 11px;">Luxury Horology • POS Station #01</div>
          <div class="center" style="font-size: 10px;">Order: ${receipt?.orderNumber || 'POS'}</div>
          <div class="center" style="font-size: 10px;">${new Date(receipt?.date || Date.now()).toLocaleString()}</div>
          <div class="demo-banner">*** DEMO PAYMENT MODE — NO REAL MONEY CHARGED ***</div>
          <div class="line"></div>
          ${(receipt?.items || posCart)
            .map(
              (item) => `
            <div class="row">
              <span>${item.name} x${item.quantity || item.qty}</span>
              <span>₹${((item.unitPrice || item.price) * (item.quantity || item.qty)).toLocaleString('en-IN')}</span>
            </div>
          `
            )
            .join('')}
          <div class="line"></div>
          <div class="row"><span>Subtotal:</span><span>₹${(receipt?.subtotal || subtotal).toLocaleString('en-IN')}</span></div>
          <div class="row"><span>GST (10%):</span><span>₹${(receipt?.tax || tax).toLocaleString('en-IN')}</span></div>
          <div class="row bold" style="font-size: 14px;"><span>GRAND TOTAL:</span><span>₹${(receipt?.totalAmount || grandTotal).toLocaleString('en-IN')}</span></div>
          <div class="row"><span>Payment:</span><span>${receipt?.paymentMethod || 'Cash'} (Captured)</span></div>
          <div class="line"></div>
          <div class="center" style="font-size: 11px;">Thank you for your patronship.</div>
          <div class="center" style="font-size: 9px; color: #555;">Authentic Certified Luxury Chronographs</div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

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
                  Order Details: {selectedOrder.id || selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  {new Date(selectedOrder.date).toLocaleString()}
                </p>
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
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-300 font-bold block mb-1.5">
                  Ordered Timepieces:
                </span>
                <ul className="space-y-1 bg-[#081033] p-3 rounded-xl border border-white/5 text-slate-200">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((it, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[#00D9FF]">•</span>
                          <span>{it.name || it}</span>
                          {it.qty && <span className="text-slate-400">×{it.qty}</span>}
                        </span>
                        {it.price && (
                          <span className="font-bold text-white">
                            ₹{(it.price * (it.qty || 1)).toLocaleString('en-IN')}
                          </span>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400">Luxury Horology Package</li>
                  )}
                </ul>
              </div>

              <div className="flex justify-between items-center bg-[#050B2D] p-3 rounded-xl border border-[#1E2968] font-bold text-sm">
                <span>Total Amount</span>
                <span className="text-[#00D9FF] text-base">
                  ₹{(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1E2968] mt-5">
              <button
                type="button"
                onClick={() => handlePrintReceipt(selectedOrder)}
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
                setSubmitError('');
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

                {submitError && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

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

                <div className="bg-[#050B2D] p-3 rounded-xl border border-[#1E2968] space-y-1 text-xs mb-3">
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

                <div className="mb-3">
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Customer Mobile (Optional for digital SMS receipt):
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#1265FF]"
                  />
                </div>

                <p className="text-[10px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl mb-3 text-center">
                  ⚠️ Demo Payment Mode — No real money will be charged.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleProcessPosOrder('Cash on Delivery')}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Recording...' : '💵 Cash Payment'}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleProcessPosOrder('UPI (Demo)')}
                    className="py-2.5 rounded-xl bg-[#1265FF] hover:bg-[#0e52d6] disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Recording...' : '⚡ Instant UPI QR'}
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
                  Order <span className="font-bold text-[#00D9FF]">{createdReceipt?.orderNumber}</span> recorded in WatchHubDB database.
                </p>
                <div className="bg-[#050B2D] border border-white/10 p-3 rounded-xl text-left text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Order:</span>
                    <span className="font-mono text-white">{createdReceipt?.orderNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Paid:</span>
                    <span className="font-bold text-emerald-400">
                      ₹{Number(createdReceipt?.totalAmount || grandTotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Mode:</span>
                    <span className="text-[#00D9FF]">{createdReceipt?.paymentMethod}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrintReceipt(createdReceipt)}
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
                <span>Mode</span>
                <span className="text-amber-300 font-semibold">Demo Sandbox Mode</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                await handleProcessPosOrder('Debit/Credit Card (Demo)');
                setCardPaymentModalOpen(false);
                setCheckoutModalOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1265FF] to-[#741BFF] text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              {isSubmitting ? 'Authorizing...' : 'Simulate Card Approval'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
