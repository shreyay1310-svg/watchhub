import React, { useState } from 'react';
import {
  UserCheck,
  Truck,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  Send,
  Plus,
  ShieldCheck,
  Check,
  X,
  Phone,
  Sparkles,
} from 'lucide-react';

export const AssignDeliveriesModule = ({
  orders,
  riders,
  couriers,
  onAssignOrders,
}) => {
  // Selected orders (array of Order IDs)
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Assignment Form State
  const [selectedPartnerId, setSelectedPartnerId] = useState('cp_bluedart');
  const [selectedRiderId, setSelectedRiderId] = useState('rd_001');
  const [deliveryPriority, setDeliveryPriority] = useState('Urgent Express');
  const [deliveryDate, setDeliveryDate] = useState('Today, 17 Nov 2026');
  const [timeSlot, setTimeSlot] = useState('Afternoon Prime (12:00 PM – 03:00 PM)');
  const [specialInstructions, setSpecialInstructions] = useState('Luxury insured box. Require customer photo ID or OTP upon doorstep handover.');

  // Confirmation Alert
  const [confirmationNotice, setConfirmationNotice] = useState('');

  // Unassigned orders
  const unassignedOrders = orders.filter((o) => o.rider === 'Unassigned' || o.deliveryStatus === 'Pending');
  const assignedOrders = orders.filter((o) => o.rider !== 'Unassigned' && o.deliveryStatus !== 'Pending');
  const availableRiders = riders.filter((r) => r.status === 'Available');

  // Selected Rider details
  const currentRider = riders.find((r) => r.id === selectedRiderId) || riders[0];
  const currentPartner = couriers.find((c) => c.id === selectedPartnerId) || couriers[0];

  // Toggle order selection
  const handleToggleOrder = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAllUnassigned = () => {
    if (selectedOrderIds.length === unassignedOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(unassignedOrders.map((o) => o.orderId));
    }
  };

  // Submit assignment
  const handlePerformAssignment = (e) => {
    e.preventDefault();
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one order to assign.');
      return;
    }

    if (!selectedRiderId) {
      alert('Please select an active rider.');
      return;
    }

    // Call parent handler
    onAssignOrders(selectedOrderIds, selectedRiderId, currentPartner.name, deliveryPriority, timeSlot, specialInstructions);

    setConfirmationNotice(
      `Successfully assigned ${selectedOrderIds.length} order(s) to ${currentRider.name} via ${currentPartner.name}!`
    );
    setSelectedOrderIds([]);
    setTimeout(() => setConfirmationNotice(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & TOP SUMMARY CARDS */}
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
          Assign Deliveries & Fleet Allocation
        </h1>
        <p className="text-xs text-[#A7B1C2] mt-0.5">
          Dispatch pending customer watch orders to verified courier partners and designated city delivery riders.
        </p>
      </div>

      {confirmationNotice && (
        <div className="p-4 rounded-xl bg-[#00C98B]/15 border border-[#00C98B]/40 text-[#00C98B] flex items-center justify-between text-xs font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#00C98B]" />
            <span>{confirmationNotice}</span>
          </div>
          <button onClick={() => setConfirmationNotice('')} className="text-[#00C98B] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Unassigned Orders */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Unassigned Orders</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#FFB020]">{unassignedOrders.length}</span>
            <span className="text-[10px] text-[#A7B1C2] bg-white/5 px-2 py-0.5 rounded-full">Requires Rider</span>
          </div>
        </div>

        {/* 2. Available Riders */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Available Riders</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#00C98B]">{availableRiders.length}</span>
            <span className="text-[10px] text-[#A7B1C2] bg-white/5 px-2 py-0.5 rounded-full">Ready for Dispatch</span>
          </div>
        </div>

        {/* 3. Assigned Orders */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Assigned Orders</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-[#00D5FF]">{assignedOrders.length}</span>
            <span className="text-[10px] text-[#A7B1C2] bg-white/5 px-2 py-0.5 rounded-full">In Active Pipeline</span>
          </div>
        </div>

        {/* 4. Total Fleet Capacity */}
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Total Fleet Capacity</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-white">{riders.length * 25}</span>
            <span className="text-[10px] text-[#A7B1C2] bg-white/5 px-2 py-0.5 rounded-full">Max Daily Drops</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: LEFT (UNASSIGNED ORDERS) + RIGHT (RIDERS & ASSIGNMENT FORM) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SECTION: UNASSIGNED ORDERS LIST (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B] mb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Orders Awaiting Rider ({unassignedOrders.length})
                </h3>
                <p className="text-xs text-[#A7B1C2]">
                  Select single or multiple orders for batch rider dispatch
                </p>
              </div>

              {unassignedOrders.length > 0 && (
                <button
                  onClick={handleSelectAllUnassigned}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#00D5FF] border border-[#28334B] cursor-pointer"
                >
                  {selectedOrderIds.length === unassignedOrders.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {unassignedOrders.length === 0 ? (
              <div className="py-16 text-center text-[#A7B1C2] space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#00C98B]/20 text-[#00C98B] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-white">All Orders Assigned!</p>
                <p className="text-xs text-[#A7B1C2]">No pending unassigned delivery orders at this time.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {unassignedOrders.map((order) => {
                  const isChecked = selectedOrderIds.includes(order.orderId);
                  return (
                    <div
                      key={order.orderId}
                      onClick={() => handleToggleOrder(order.orderId)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-[#081529] border-[#6500FF] shadow-md shadow-[#6500FF]/20 ring-1 ring-[#6500FF]'
                          : 'bg-[#081529]/60 hover:bg-[#081529] border-[#28334B]'
                      }`}
                    >
                      {/* Custom Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border mt-1 flex-shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[#6500FF] border-[#6500FF] text-white'
                            : 'border-[#28334B] bg-[#11172C]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>

                      {/* Product Image */}
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-12 h-12 rounded-lg object-contain bg-[#11172C] border border-[#28334B] p-0.5 flex-shrink-0"
                      />

                      {/* Order Info */}
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{order.orderId}</span>
                          <span className="font-bold text-[#E9B94F]">{order.formattedAmount}</span>
                        </div>
                        <p className="font-medium text-[#A7B1C2] truncate">{order.productName}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#A7B1C2]">
                          <span className="text-white font-medium">{order.customerName}</span>
                          <span>•</span>
                          <span className="text-[#00D5FF] flex items-center gap-0.5 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {order.city} ({order.deliveryAddress})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30">
                            {order.priority || 'Standard'}
                          </span>
                          <span className="text-[10px] text-[#A7B1C2]">
                            Delivery by: {order.expectedDeliveryDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#28334B] mt-3 flex items-center justify-between text-xs text-[#A7B1C2]">
            <span>Selected for batch assignment: <strong className="text-white">{selectedOrderIds.length}</strong></span>
            {selectedOrderIds.length > 0 && (
              <span className="text-[#00D5FF] font-bold animate-pulse">Ready to allocate rider →</span>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: RIDER SELECTION & ASSIGNMENT FORM (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-5">
          <div>
            <h3 className="font-serif font-bold text-base text-white">
              Fleet Allocation & Dispatch Form
            </h3>
            <p className="text-xs text-[#A7B1C2]">
              Assign selected watch orders to rider and set dispatch parameters.
            </p>
          </div>

          <form onSubmit={handlePerformAssignment} className="space-y-4">
            {/* Courier Partner Select */}
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                1. Select Logistics / Courier Partner
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
              >
                {couriers.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.name} ({cp.serviceAreas} • Rating {cp.rating}★)
                  </option>
                ))}
              </select>
            </div>

            {/* Rider Fleet Cards Grid */}
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                2. Select City Rider ({availableRiders.length} Available)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {riders.map((rider) => {
                  const isSelected = selectedRiderId === rider.id;
                  const isAvailable = rider.status === 'Available';
                  return (
                    <div
                      key={rider.id}
                      onClick={() => setSelectedRiderId(rider.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#081529] border-[#6500FF] shadow-md shadow-[#6500FF]/25 ring-1 ring-[#6500FF]'
                          : 'bg-[#081529]/60 hover:bg-[#081529] border-[#28334B]'
                      }`}
                    >
                      <img
                        src={rider.avatar}
                        alt={rider.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[#28334B] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white truncate">{rider.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                              isAvailable
                                ? 'bg-[#00C98B]/20 text-[#00C98B]'
                                : 'bg-[#00D5FF]/20 text-[#00D5FF]'
                            }`}
                          >
                            {rider.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#A7B1C2] truncate">{rider.area}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#E9B94F] mt-0.5">
                          <span>{rider.vehicleType}</span>
                          <span className="text-[#A7B1C2]">{rider.activeOrders} active drops</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Priority & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Delivery Priority
                </label>
                <select
                  value={deliveryPriority}
                  onChange={(e) => setDeliveryPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
                >
                  <option value="Urgent Express">Urgent Express (Within 2-4 Hours)</option>
                  <option value="Same Day VIP">Same Day VIP (Evening Handover)</option>
                  <option value="Standard Next-Day">Standard Next-Day (24 Hours)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Delivery Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white focus:outline-none focus:border-[#6500FF] cursor-pointer"
                >
                  <option value="Morning Express (09:00 AM – 12:00 PM)">Morning Express (09:00 AM – 12:00 PM)</option>
                  <option value="Afternoon Prime (12:00 PM – 03:00 PM)">Afternoon Prime (12:00 PM – 03:00 PM)</option>
                  <option value="Evening VIP (03:00 PM – 07:00 PM)">Evening VIP (03:00 PM – 07:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                Special Delivery Instructions
              </label>
              <textarea
                rows="2"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Rider instructions: e.g. Contact customer 15m prior, carry POS terminal for COD..."
                className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white placeholder-[#A7B1C2]/60 focus:outline-none focus:border-[#6500FF]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={selectedOrderIds.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedOrderIds.length > 0
                  ? 'bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white shadow-[#6500FF]/30 cursor-pointer border border-[#8B00FF]/50'
                  : 'bg-white/5 text-[#A7B1C2] border border-[#28334B] cursor-not-allowed opacity-50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>
                Assign & Dispatch {selectedOrderIds.length > 0 ? `(${selectedOrderIds.length} Orders)` : 'Selected Orders'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignDeliveriesModule;
