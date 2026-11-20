import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Download,
  MapPin,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Package,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

export default function CustomerOrderDetailTab({
  currentOrder,
  formatPrice,
  setActiveView,
  handleTrackOrder,
  handleDownloadInvoice,
  setShowSupportModal,
  setShowCancelModal,
  copiedAwb,
  setCopiedAwb,
}) {
  if (activeView !== 'detail' || !currentOrder) return null;

  return (
          <div className="space-y-6 animate-fade-in">
            {/* Header with Back button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#28334B]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveView('orders');
                    setSearchParams({ tab: 'orders' });
                  }}
                  className="p-2 rounded-xl bg-[#11172C] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white border border-[#28334B] transition-colors cursor-pointer"
                  title="Back to All Orders"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                    Order Details – #{currentOrder.orderId}
                  </h2>
                  <p className="text-xs text-[#A7B1C2] mt-0.5">
                    Placed on {currentOrder.orderDate} • Air Waybill: {currentOrder.awbNumber}
                  </p>
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenTracking(currentOrder.orderId)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white text-xs font-bold shadow-md shadow-[#6500FF]/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Shipment</span>
                </button>
                <button
                  onClick={() => handleDownloadInvoice(currentOrder)}
                  className="px-3.5 py-2 rounded-xl bg-[#11172C] text-[#A7B1C2] hover:text-white border border-[#28334B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>

            {/* Two-Column Order Details Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT SECTION: Product, Customer & Address Information */}
              <div className="lg:col-span-7 space-y-6">
                {/* Product Information Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
                    <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E9B94F]" />
                      Timepiece Information
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#00D5FF]">
                      SKU: {currentOrder.product.sku}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                    <div className="w-36 h-36 rounded-2xl bg-[#081529] border border-[#28334B] p-2 flex items-center justify-center shrink-0">
                      <img
                        src={currentOrder.product.image}
                        alt={currentOrder.product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/products/watch_placeholder.png';
                        }}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>

                    <div className="space-y-2 flex-1 text-left">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E9B94F]">
                        {currentOrder.product.brand}
                      </span>
                      <h4 className="font-serif font-bold text-lg text-white">
                        {currentOrder.product.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-[#A7B1C2]">
                        <p>
                          Model: <strong className="text-white font-mono">{currentOrder.product.modelNumber}</strong>
                        </p>
                        <p>
                          Category: <strong className="text-white">{currentOrder.product.category}</strong>
                        </p>
                        <p>
                          Quantity: <strong className="text-white">{currentOrder.product.quantity} Unit</strong>
                        </p>
                        <p>
                          Unit Price: <strong className="text-[#E9B94F]">₹{Number(currentOrder.product.unitPrice).toLocaleString('en-IN')}</strong>
                        </p>
                      </div>

                      <div className="pt-2 p-3 bg-[#081529] rounded-xl border border-[#28334B] text-xs space-y-1">
                        <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Certified Authenticity &amp; Warranty
                        </span>
                        <p className="text-[#A7B1C2] text-[11px]">
                          {currentOrder.product.warranty}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#28334B] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00D5FF]" />
                    Customer Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-[#081529] rounded-xl border border-[#28334B]">
                      <span className="text-[#A7B1C2] block mb-1">Customer Name</span>
                      <strong className="text-white font-semibold text-sm">{currentOrder.customer.name}</strong>
                    </div>
                    <div className="p-3 bg-[#081529] rounded-xl border border-[#28334B]">
                      <span className="text-[#A7B1C2] block mb-1">Registered Email</span>
                      <strong className="text-white font-mono text-xs truncate block">{currentOrder.customer.email}</strong>
                    </div>
                    <div className="p-3 bg-[#081529] rounded-xl border border-[#28334B]">
                      <span className="text-[#A7B1C2] block mb-1">Mobile Contact</span>
                      <strong className="text-white font-mono text-xs">{currentOrder.customer.phone}</strong>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#28334B] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E9B94F]" />
                    Shipping &amp; Delivery Destination
                  </h3>
                  <div className="p-4 bg-[#081529] rounded-2xl border border-[#28334B] space-y-1.5 text-xs">
                    <p className="font-bold text-white text-sm">{currentOrder.customer.name}</p>
                    <p className="text-gray-300">{currentOrder.deliveryAddress.street}</p>
                    <p className="text-gray-300">
                      {currentOrder.deliveryAddress.city}, {currentOrder.deliveryAddress.state} - {currentOrder.deliveryAddress.pincode}
                    </p>
                    <p className="text-[#E9B94F] font-semibold">{currentOrder.deliveryAddress.country}</p>
                    <div className="pt-2 flex items-center gap-2 text-[11px] text-[#A7B1C2]">
                      <Shield className="w-3.5 h-3.5 text-[#00C98B]" />
                      <span>Tamper-evident luxury dual seal packaging with security escort</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION: Order Financial Summary & Additional Actions */}
              <div className="lg:col-span-5 space-y-6">
                {/* Order Financial Summary Card */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-5">
                  <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#28334B] flex items-center justify-between">
                    <span>Order Financial Summary</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/40">
                      {currentOrder.payment.status}
                    </span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-[#A7B1C2]">
                      <span>Product Price:</span>
                      <span className="text-white font-mono">₹{Number(currentOrder.product.unitPrice).toLocaleString('en-IN')}</span>
                    </div>

                    {currentOrder.product.discount > 0 && (
                      <div className="flex justify-between text-[#00C98B]">
                        <span>VIP Privilege Discount ({currentOrder.product.promoCode}):</span>
                        <span className="font-mono font-semibold">-₹{Number(currentOrder.product.discount).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#A7B1C2]">
                      <span>Shipping &amp; Insurance:</span>
                      <span className="text-[#00D5FF] font-semibold">FREE (Luxury Armored Air)</span>
                    </div>

                    <div className="flex justify-between text-[#A7B1C2]">
                      <span>Applicable GST (18%):</span>
                      <span className="text-white font-mono">₹{Number(currentOrder.product.taxes).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="pt-3 border-t border-[#28334B] flex justify-between items-center text-sm font-bold">
                      <span className="text-white font-serif">Grand Total:</span>
                      <span className="text-xl font-mono text-[#E9B94F]">
                        ₹{Number(currentOrder.product.grandTotal).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Metadata */}
                  <div className="p-3.5 bg-[#081529] rounded-2xl border border-[#28334B] text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#A7B1C2]">Payment Mode:</span>
                      <span className="text-white font-semibold">{currentOrder.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A7B1C2]">Transaction ID:</span>
                      <span className="text-[#00D5FF] font-mono text-[11px]">{currentOrder.payment.transactionId}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Action Buttons */}
                <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-6 shadow-xl space-y-3">
                  <h4 className="text-xs font-bold text-[#A7B1C2] uppercase tracking-wider mb-2">
                    Order Assistance &amp; Actions
                  </h4>

                  <button
                    onClick={() => handleDownloadInvoice(currentOrder)}
                    className="w-full py-2.5 rounded-xl bg-[#081529] hover:bg-[#17165A] text-white border border-[#28334B] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#00D5FF]" />
                    <span>Download Tax Invoice (PDF / TXT)</span>
                  </button>

                  <button
                    onClick={() => handleOpenTracking(currentOrder.orderId)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7410FF] hover:to-[#9B10FF] text-white text-xs font-bold shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Live GPS Shipment</span>
                  </button>

                  <button
                    onClick={() => setShowSupportModal(true)}
                    className="w-full py-2.5 rounded-xl bg-[#081529] hover:bg-[#17165A] text-white border border-[#28334B] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-[#E9B94F]" />
                    <span>Contact Watch Concierge Support</span>
                  </button>

                  {/* Cancellation Button (Only if not yet shipped or delivered) */}
                  {['Processing', 'Confirmed', 'Packed'].includes(currentOrder.status) && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Request Order Cancellation</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
  );
}
