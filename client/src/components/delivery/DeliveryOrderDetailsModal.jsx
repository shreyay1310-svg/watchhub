import React from 'react';
import { X, MapPin } from 'lucide-react';

export default function DeliveryOrderDetailsModal({
  selectedOrder,
  onClose,
  onOpenTracking,
}) {
  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-white space-y-5 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#28334B]">
          <div className="flex items-center gap-3">
            <img
              src={selectedOrder.productImage}
              alt={selectedOrder.productName}
              className="w-14 h-14 rounded-xl object-contain bg-[#081529] border border-[#28334B] p-1 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">
                  Order #{selectedOrder.orderId}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedOrder.deliveryStatus === 'Delivered'
                      ? 'bg-[#00C98B]/20 text-[#00C98B]'
                      : 'bg-[#00D5FF]/20 text-[#00D5FF]'
                  }`}
                >
                  {selectedOrder.deliveryStatus}
                </span>
              </div>
              <p className="text-xs text-[#A7B1C2]">
                Air Waybill: <strong className="font-mono text-[#00D5FF]">{selectedOrder.awbNumber}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A7B1C2] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product & Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] space-y-1.5">
            <span className="font-bold text-white text-sm block">{selectedOrder.productName}</span>
            <p className="text-[#A7B1C2]">Category: {selectedOrder.productCategory}</p>
            <p className="text-[#E9B94F] font-bold text-sm">Value: {selectedOrder.formattedAmount}</p>
            <p className="text-[#A7B1C2]">Payment: {selectedOrder.paymentType}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] space-y-1.5">
            <span className="font-bold text-white text-sm block">Customer & Destination</span>
            <p className="text-white font-medium">{selectedOrder.customerName}</p>
            <p className="text-[#A7B1C2]">{selectedOrder.mobileNumber}</p>
            <p className="text-[#A7B1C2]">{selectedOrder.deliveryAddress}, {selectedOrder.city} - {selectedOrder.pincode}</p>
          </div>
        </div>

        {/* Shipment & Rider Information */}
        <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[#A7B1C2] text-[10px] block">Courier Partner</span>
            <span className="font-bold text-white">{selectedOrder.deliveryPartner}</span>
          </div>
          <div>
            <span className="text-[#A7B1C2] text-[10px] block">Designated City Rider</span>
            <span className="font-bold text-[#E9B94F]">{selectedOrder.rider}</span>
            <span className="text-[10px] text-[#A7B1C2] block">{selectedOrder.riderPhone}</span>
          </div>
          <div>
            <span className="text-[#A7B1C2] text-[10px] block">Expected Delivery ETA</span>
            <span className="font-bold text-[#00C98B]">{selectedOrder.expectedDeliveryDate}</span>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div>
          <span className="font-bold text-xs text-white block mb-2">Milestone Tracking History</span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs">
            {selectedOrder.trackingTimeline.map((step, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#081529] border border-[#28334B] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">{step.stage}</span>
                  <span className="text-[10px] text-[#A7B1C2]">{step.desc}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#00D5FF] font-mono block">{step.time}</span>
                  <span className="text-[10px] text-[#A7B1C2]">{step.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#28334B]">
          <button
            onClick={() => onOpenTracking(selectedOrder)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#00D5FF] hover:underline"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Live Map Tracking</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
