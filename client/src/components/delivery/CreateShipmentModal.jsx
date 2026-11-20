import React from 'react';
import { Truck, X } from 'lucide-react';

export default function CreateShipmentModal({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  couriers = [],
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#00D5FF]" />
            <h3 className="font-serif font-bold text-base text-white">
              Create Outbound Watch Shipment
            </h3>
          </div>
          <button onClick={onClose} className="text-[#A7B1C2] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="e.g. Alok Singhal"
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
              />
            </div>
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Mobile Number</label>
              <input
                type="text"
                required
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[#A7B1C2] font-semibold block mb-1">Watch Model</label>
            <input
              type="text"
              required
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
            />
          </div>

          <div>
            <label className="text-[#A7B1C2] font-semibold block mb-1">Street Address</label>
            <input
              type="text"
              required
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              placeholder="Villa / Flat number, building, sector"
              className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
              />
            </div>
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
              />
            </div>
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">PIN Code</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Carrier Partner</label>
              <select
                value={form.deliveryPartner}
                onChange={(e) => setForm({ ...form, deliveryPartner: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white cursor-pointer"
              >
                {couriers.map((cp) => (
                  <option key={cp.id} value={cp.name}>{cp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#A7B1C2] font-semibold block mb-1">Order Amount (₹)</label>
              <input
                type="number"
                value={form.orderAmount}
                onChange={(e) => setForm({ ...form, orderAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-[#A7B1C2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold"
            >
              Generate Air Waybill & Label
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
