import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle,
  Clock,
  Truck,
  Plus,
  Eye,
  X,
  AlertTriangle,
  UserCheck,
  Calendar,
  FileCheck2,
  ShieldCheck,
  Camera,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ReturnsPickupsModule = ({
  returns = [],
  orders = [],
  riders = [],
  onUpdateReturnStatus = () => {},
  onScheduleReturnPickup = () => {},
}) => {
  const safeReturns = Array.isArray(returns) ? returns : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeRiders = Array.isArray(riders) ? riders : [];

  const [selectedReturnDetail, setSelectedReturnDetail] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleReturnTarget, setScheduleReturnTarget] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    riderId: safeRiders[0]?.id || '',
    pickupDate: '18 Nov 2026, 02:00 PM',
    notes: 'Verify tamper seal before picking up from customer.',
  });

  // KPI Calculations
  const totalReturns = safeReturns.length;
  const pendingPickup = safeReturns.filter((r) => r?.returnStatus === 'Return Requested' || r?.returnStatus === 'Approved').length;
  const pickupAssigned = safeReturns.filter((r) => r?.returnStatus === 'Pickup Assigned').length;
  const pickedUp = safeReturns.filter((r) => r?.returnStatus === 'Picked Up' || r?.returnStatus === 'In Transit').length;
  const receivedAtWarehouse = safeReturns.filter((r) => r?.returnStatus === 'Received at Warehouse' || r?.returnStatus === 'Inspection').length;
  const completed = safeReturns.filter((r) => r?.returnStatus === 'Completed').length;

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleReturnTarget) return;
    const rider = riders.find((r) => r.id === scheduleForm.riderId);
    if (onScheduleReturnPickup) {
      onScheduleReturnPickup(
        scheduleReturnTarget.returnId,
        rider ? rider.name : 'Rider',
        scheduleForm.riderId,
        scheduleForm.pickupDate,
        scheduleForm.notes
      );
    }
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Returns, Exchanges & Reverse Logistics
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Manage customer doorstep pickups, horological quality inspections, warehouse returns and refunds.
          </p>
        </div>
      </div>

      {/* 2. SIX KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#11172C] border border-[#28334B] shadow-md">
          <span className="text-[11px] font-semibold text-[#A7B1C2] block">Total Return Requests</span>
          <span className="text-xl font-bold text-white block mt-1">{totalReturns}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11172C] border border-[#28334B] shadow-md">
          <span className="text-[11px] font-semibold text-[#A7B1C2] block">Pending Pickup</span>
          <span className="text-xl font-bold text-[#FFB020] block mt-1">{pendingPickup}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11172C] border border-[#28334B] shadow-md">
          <span className="text-[11px] font-semibold text-[#A7B1C2] block">Pickup Assigned</span>
          <span className="text-xl font-bold text-[#00D5FF] block mt-1">{pickupAssigned}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11172C] border border-[#28334B] shadow-md">
          <span className="text-[11px] font-semibold text-[#A7B1C2] block">Picked Up / Transit</span>
          <span className="text-xl font-bold text-[#6500FF] block mt-1">{pickedUp}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11172C] border border-[#28334B] shadow-md">
          <span className="text-[11px] font-semibold text-[#A7B1C2] block">At Vault / Inspection</span>
          <span className="text-xl font-bold text-[#E9B94F] block mt-1">{receivedAtWarehouse}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11172C] border border-[#28334B] shadow-md">
          <span className="text-[11px] font-semibold text-[#A7B1C2] block">Completed / Refunded</span>
          <span className="text-xl font-bold text-[#00C98B] block mt-1">{completed}</span>
        </div>
      </div>

      {/* 3. 8-STAGE RETURN WORKFLOW INDICATOR */}
      <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
        <span className="text-xs font-bold text-[#A7B1C2] uppercase tracking-wider block mb-3">
          8-Stage Reverse Logistics Workflow
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[10.5px]">
          {[
            'Return Requested',
            'Approved',
            'Pickup Assigned',
            'Picked Up',
            'In Transit',
            'Received at Warehouse',
            'Inspection',
            'Completed',
          ].map((stage, idx) => (
            <div key={stage} className="p-2 rounded-xl bg-[#081529] border border-[#28334B] flex flex-col items-center">
              <span className="w-5 h-5 rounded-full bg-[#6500FF]/25 border border-[#6500FF]/50 text-[#00D5FF] font-bold text-[10px] flex items-center justify-center mb-1">
                {idx + 1}
              </span>
              <span className="font-semibold text-white leading-tight">{stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RETURNS & REVERSE LOGISTICS TABLE (12 COLUMNS) */}
      <div className="rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#081529] border-b border-[#28334B] text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 pl-4">Return ID</th>
                <th className="py-3.5 px-3">Original Order</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Product Image</th>
                <th className="py-3.5 px-3">Product Name</th>
                <th className="py-3.5 px-3">Return Reason</th>
                <th className="py-3.5 px-3">Pickup Address</th>
                <th className="py-3.5 px-3">Assigned Rider</th>
                <th className="py-3.5 px-3">Pickup Date</th>
                <th className="py-3.5 px-3">Return Status</th>
                <th className="py-3.5 px-3">Refund Status</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28334B] text-white">
              {safeReturns.map((ret) => (
                <tr key={ret.returnId} className="hover:bg-white/5 transition-colors">
                  {/* Return ID */}
                  <td className="py-3 pl-4 font-mono font-bold text-[#00D5FF] whitespace-nowrap">
                    {ret.returnId}
                  </td>

                  {/* Order ID */}
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {ret.originalOrderId}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-semibold text-white block">{ret.customerName}</span>
                    <span className="text-[10px] text-[#A7B1C2]">{ret.customerPhone}</span>
                  </td>

                  {/* Product Image */}
                  <td className="py-3 px-3">
                    <img
                      src={ret.productImage}
                      alt={ret.productName}
                      className="w-10 h-10 rounded-lg object-contain bg-[#081529] border border-[#28334B] p-0.5"
                    />
                  </td>

                  {/* Product Name */}
                  <td className="py-3 px-3 max-w-[160px] truncate font-medium text-white" title={ret.productName}>
                    {ret.productName}
                  </td>

                  {/* Return Reason */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30">
                      {ret.returnReason}
                    </span>
                  </td>

                  {/* Address */}
                  <td className="py-3 px-3 max-w-[160px] truncate text-[#A7B1C2]" title={ret.pickupAddress}>
                    {ret.pickupAddress}
                  </td>

                  {/* Rider */}
                  <td className="py-3 px-3 font-semibold text-[#E9B94F] whitespace-nowrap">
                    {ret.assignedRider}
                  </td>

                  {/* Pickup Date */}
                  <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#A7B1C2]">
                    {ret.pickupDate}
                  </td>

                  {/* Return Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ret.returnStatus === 'Completed'
                          ? 'bg-[#00C98B]/20 text-[#00C98B]'
                          : ret.returnStatus === 'Pickup Assigned'
                          ? 'bg-[#00D5FF]/20 text-[#00D5FF]'
                          : ret.returnStatus === 'Received at Warehouse'
                          ? 'bg-[#6500FF]/20 text-[#00D5FF]'
                          : 'bg-[#FFB020]/20 text-[#FFB020]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {ret.returnStatus}
                    </span>
                  </td>

                  {/* Refund Status */}
                  <td className="py-3 px-3 whitespace-nowrap font-medium text-[11px] text-[#A7B1C2]">
                    {ret.refundStatus}
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReturnDetail(ret)}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#28334B] text-[11px]"
                      >
                        Inspect
                      </button>

                      {ret.returnStatus === 'Return Requested' || ret.returnStatus === 'Approved' ? (
                        <button
                          onClick={() => {
                            setScheduleReturnTarget(ret);
                            setShowScheduleModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold text-[11px] cursor-pointer"
                        >
                          Schedule
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (onUpdateReturnStatus) onUpdateReturnStatus(ret.returnId, 'Completed');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#00C98B]/20 text-[#00C98B] hover:bg-[#00C98B]/30 border border-[#00C98B]/30 font-bold text-[11px] cursor-pointer"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: SCHEDULE PICKUP */}
      {showScheduleModal && scheduleReturnTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <h3 className="font-serif font-bold text-base text-white">
                Schedule Doorstep Watch Pickup
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <span className="text-[#A7B1C2] block mb-1">Return Item</span>
                <p className="font-bold text-white">{scheduleReturnTarget.productName}</p>
                <p className="text-[11px] text-[#A7B1C2]">Reason: {scheduleReturnTarget.returnReason}</p>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Assign Pickup Rider</label>
                <select
                  value={scheduleForm.riderId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, riderId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white cursor-pointer"
                >
                  {riders.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.city} • {r.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Pickup Date & Time Slot</label>
                <input
                  type="text"
                  value={scheduleForm.pickupDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, pickupDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Pickup Inspection Instructions</label>
                <textarea
                  rows="2"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold"
                >
                  Confirm & Dispatch Pickup Rider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPECTION & CONDITION VIEW */}
      {selectedReturnDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#00D5FF]" />
                <h3 className="font-bold text-sm text-white">
                  Inspection Report #{selectedReturnDetail.returnId}
                </h3>
              </div>
              <button onClick={() => setSelectedReturnDetail(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#081529] border border-[#28334B]">
                <img
                  src={selectedReturnDetail.productImage}
                  alt={selectedReturnDetail.productName}
                  className="w-14 h-14 rounded-lg object-contain bg-[#11172C] p-1 flex-shrink-0"
                />
                <div>
                  <span className="font-bold text-white block">{selectedReturnDetail.productName}</span>
                  <span className="text-[11px] text-[#A7B1C2]">Original Order: {selectedReturnDetail.originalOrderId}</span>
                  <span className="text-[10px] text-[#E9B94F] block mt-0.5">Refund Value: ₹{selectedReturnDetail.refundAmount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Customer:</span>
                  <span className="text-white font-medium">{selectedReturnDetail.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Pickup Address:</span>
                  <span className="text-white text-right max-w-[200px] truncate">{selectedReturnDetail.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Current Status:</span>
                  <span className="text-[#00D5FF] font-bold">{selectedReturnDetail.returnStatus}</span>
                </div>
              </div>

              <div>
                <span className="text-[#A7B1C2] block mb-1 font-semibold">Vault Horologist Inspection Notes:</span>
                <p className="p-3 rounded-xl bg-[#081529] border border-[#28334B] text-white leading-relaxed">
                  {selectedReturnDetail.inspectionNotes || 'Inspection pending verification at central vault.'}
                </p>
              </div>

              {selectedReturnDetail.conditionImages?.length > 0 && (
                <div>
                  <span className="text-[#A7B1C2] block mb-1 font-semibold">Condition Photographic Evidence:</span>
                  <img
                    src={selectedReturnDetail.conditionImages[0]}
                    alt="Condition photo"
                    className="w-full h-36 rounded-xl object-cover border border-[#28334B]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
              <button
                onClick={() => setSelectedReturnDetail(null)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsPickupsModule;
