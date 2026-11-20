import React from 'react';
import { Bell, X, Check } from 'lucide-react';

export default function DeliveryAlertsModal({
  isOpen,
  onClose,
  currentOrder,
  handleSubscribeUpdates,
  updateChannels,
  setUpdateChannels,
  updatePhoneInput,
  setUpdatePhoneInput,
  subscribedSuccess,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-white/10 overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="bg-[#0B121C] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D4A84F]/20 border border-[#D4A84F]/40 flex items-center justify-center text-[#D4A84F]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Delivery Alerts Subscription</h3>
              <p className="text-[11px] text-gray-400">Order: {currentOrder?.orderId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubscribeUpdates} className="p-5 space-y-4">
          <p className="text-xs text-[#A6B1C8]">
            Choose how you would like to receive real-time notifications for milestone updates:
          </p>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0B1022]/80/50 cursor-pointer hover:border-[#D4A84F]">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">💬</span>
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC]">WhatsApp Instant Alerts</p>
                  <p className="text-[11px] text-[#A6B1C8]">Live milestone updates on WhatsApp</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={updateChannels.whatsapp}
                onChange={(e) =>
                  setUpdateChannels({ ...updateChannels, whatsapp: e.target.checked })
                }
                className="w-4 h-4 accent-[#D4A84F] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0B1022]/80/50 cursor-pointer hover:border-[#D4A84F]">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📱</span>
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC]">SMS Out-for-Delivery Alerts</p>
                  <p className="text-[11px] text-[#A6B1C8]">OTP & driver contact when dispatched</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={updateChannels.sms}
                onChange={(e) =>
                  setUpdateChannels({ ...updateChannels, sms: e.target.checked })
                }
                className="w-4 h-4 accent-[#D4A84F] rounded cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#A6B1C8] uppercase tracking-wider mb-1.5">
              WhatsApp / Mobile Number
            </label>
            <input
              type="tel"
              required
              value={updatePhoneInput}
              onChange={(e) => setUpdatePhoneInput(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs font-mono focus:border-[#D4A84F] focus:outline-hidden"
            />
          </div>

          {subscribedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Subscription confirmed! Live updates enabled.</span>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-[#A6B1C8] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#D4A84F] hover:bg-[#c4983f] text-[#0B121C] font-bold text-xs shadow-md transition-colors"
            >
              Confirm Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
