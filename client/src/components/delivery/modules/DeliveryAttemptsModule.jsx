import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  RotateCcw,
  Plus,
  Phone,
  Image,
  Calendar,
  X,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const DeliveryAttemptsModule = ({
  attempts = [],
  orders = [],
  riders = [],
  onRecordAttempt = () => {},
  onScheduleReattempt = () => {},
}) => {
  const safeAttempts = Array.isArray(attempts) ? attempts : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeRiders = Array.isArray(riders) ? riders : [];

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedAttemptDetail, setSelectedAttemptDetail] = useState(null);

  // New Attempt Form
  const [attemptForm, setAttemptForm] = useState({
    orderId: safeOrders[0]?.orderId || '',
    riderId: safeRiders[0]?.id || '',
    attemptDate: '17 Nov 2026',
    attemptTime: '01:30 PM',
    attemptNumber: 1,
    deliveryResult: 'Failed',
    failureReason: 'Customer Unavailable',
    remarks: 'Doorbell rang; security guard mentioned resident is out until evening.',
    nextAttemptDate: '18 Nov 2026, 11:00 AM',
    proofUrl: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?auto=format&fit=crop&w=300&q=80',
  });

  // KPI Calculations
  const totalAttempts = safeAttempts.length;
  const successfulAttempts = safeAttempts.filter((a) => a?.deliveryResult === 'Successful').length;
  const failedAttempts = safeAttempts.filter((a) => a?.deliveryResult === 'Failed').length;
  const pendingReattempts = safeAttempts.filter((a) => a?.status === 'Pending Reattempt').length;

  const handleSubmitAttempt = (e) => {
    e.preventDefault();
    const order = orders.find((o) => o.orderId === attemptForm.orderId);
    const rider = riders.find((r) => r.id === attemptForm.riderId);

    const newAttempt = {
      attemptId: `ATT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: attemptForm.orderId,
      customerName: order ? order.customerName : 'Customer',
      customerPhone: order ? order.mobileNumber : '+91 98765 00000',
      riderName: rider ? rider.name : 'Rider',
      riderId: attemptForm.riderId,
      deliveryAddress: order ? `${order.deliveryAddress}, ${order.city}` : 'Doorstep address',
      attemptDate: attemptForm.attemptDate,
      attemptTime: attemptForm.attemptTime,
      attemptNumber: Number(attemptForm.attemptNumber),
      deliveryResult: attemptForm.deliveryResult,
      failureReason: attemptForm.deliveryResult === 'Successful' ? 'None (Successful)' : attemptForm.failureReason,
      proofOfAttempt: attemptForm.proofUrl,
      remarks: attemptForm.remarks,
      nextAttemptDate: attemptForm.nextAttemptDate,
      status: attemptForm.deliveryResult === 'Successful' ? 'Delivered' : 'Pending Reattempt',
    };

    if (onRecordAttempt) {
      onRecordAttempt(newAttempt);
    }
    setShowRecordModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Delivery Attempts & Exception Auditing
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Log doorstep attempt exceptions, geotagged proof photos, customer unavailability reasons and reattempt schedules.
          </p>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer border border-[#8B00FF]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Record Delivery Attempt</span>
        </button>
      </div>

      {/* 2. FOUR KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Total Doorstep Attempts</span>
          <span className="text-2xl font-bold text-white block mt-1">{totalAttempts}</span>
          <span className="text-[10px] text-[#A7B1C2] mt-0.5 block">Audit recorded</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Successful Attempts</span>
          <span className="text-2xl font-bold text-[#00C98B] block mt-1">{successfulAttempts}</span>
          <span className="text-[10px] text-[#00C98B] mt-0.5 block">Verified & Handed Over</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Failed Attempts</span>
          <span className="text-2xl font-bold text-[#FF4966] block mt-1">{failedAttempts}</span>
          <span className="text-[10px] text-[#FF4966] mt-0.5 block">With Geotagged Proof</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Pending Reattempts</span>
          <span className="text-2xl font-bold text-[#FFB020] block mt-1">{pendingReattempts}</span>
          <span className="text-[10px] text-[#FFB020] mt-0.5 block">Queued in Dispatch</span>
        </div>
      </div>

      {/* 3. ATTEMPTS AUDIT TABLE (13 COLUMNS) */}
      <div className="rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl overflow-hidden">
        <div className="p-4 bg-[#081529] border-b border-[#28334B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FFB020]" />
            <h3 className="font-bold text-sm text-white">
              Doorstep Handover Exception Ledger
            </h3>
          </div>
          <span className="text-xs text-[#A7B1C2]">
            Max 3 attempts allowed before return to central vault
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#081529]/80 border-b border-[#28334B] text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 pl-4">Attempt ID</th>
                <th className="py-3.5 px-3">Order ID</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Rider</th>
                <th className="py-3.5 px-3">Address</th>
                <th className="py-3.5 px-3">Date & Time</th>
                <th className="py-3.5 px-3">Attempt #</th>
                <th className="py-3.5 px-3">Result</th>
                <th className="py-3.5 px-3">Failure Reason</th>
                <th className="py-3.5 px-3">Proof Photo</th>
                <th className="py-3.5 px-3">Next Attempt</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28334B] text-white">
              {safeAttempts.map((att) => (
                <tr key={att.attemptId} className="hover:bg-white/5 transition-colors">
                  {/* Attempt ID */}
                  <td className="py-3 pl-4 font-mono text-[11px] font-bold text-[#00D5FF] whitespace-nowrap">
                    {att.attemptId}
                  </td>

                  {/* Order ID */}
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                    {att.orderId}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-semibold text-white block">{att.customerName}</span>
                    <span className="text-[10px] text-[#A7B1C2]">{att.customerPhone}</span>
                  </td>

                  {/* Rider */}
                  <td className="py-3 px-3 font-semibold text-[#E9B94F] whitespace-nowrap">
                    {att.riderName}
                  </td>

                  {/* Address */}
                  <td className="py-3 px-3 max-w-[180px] truncate text-[#A7B1C2]" title={att.deliveryAddress}>
                    {att.deliveryAddress}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                    <span className="text-white block">{att.attemptDate}</span>
                    <span className="text-[#A7B1C2]">{att.attemptTime}</span>
                  </td>

                  {/* Attempt Number */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="w-5 h-5 rounded-full bg-white/10 inline-flex items-center justify-center font-bold text-[11px]">
                      {att.attemptNumber}
                    </span>
                  </td>

                  {/* Result */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        att.deliveryResult === 'Successful'
                          ? 'bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/30'
                          : 'bg-[#FF4966]/20 text-[#FF4966] border border-[#FF4966]/30'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {att.deliveryResult}
                    </span>
                  </td>

                  {/* Failure Reason */}
                  <td className="py-3 px-3 whitespace-nowrap font-medium text-[#FFB020]">
                    {att.failureReason}
                  </td>

                  {/* Proof */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {att.proofOfAttempt ? (
                      <button
                        onClick={() => setSelectedAttemptDetail(att)}
                        className="flex items-center gap-1 text-[11px] text-[#00D5FF] hover:underline cursor-pointer"
                      >
                        <Image className="w-3.5 h-3.5" />
                        <span>View Photo</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-500">None</span>
                    )}
                  </td>

                  {/* Next Attempt */}
                  <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#A7B1C2]">
                    {att.nextAttemptDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedAttemptDetail(att)}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#28334B] text-[11px]"
                      >
                        Details
                      </button>
                      {att.deliveryResult === 'Failed' && (
                        <button
                          onClick={() => {
                            if (onScheduleReattempt) onScheduleReattempt(att.attemptId);
                            alert(`Reattempt rescheduled for Order ${att.orderId}`);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#FFB020]/20 text-[#FFB020] hover:bg-[#FFB020]/30 border border-[#FFB020]/40 text-[11px] font-bold"
                        >
                          Reschedule
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

      {/* MODAL 1: RECORD ATTEMPT */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#28334B]">
              <h3 className="font-serif font-bold text-base text-white">
                Record Delivery Attempt
              </h3>
              <button onClick={() => setShowRecordModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAttempt} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Select Order</label>
                <select
                  value={attemptForm.orderId}
                  onChange={(e) => setAttemptForm({ ...attemptForm, orderId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                >
                  {orders.map((o) => (
                    <option key={o.orderId} value={o.orderId}>
                      {o.orderId} - {o.customerName} ({o.productName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Delivering Rider</label>
                  <select
                    value={attemptForm.riderId}
                    onChange={(e) => setAttemptForm({ ...attemptForm, riderId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  >
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Attempt Number</label>
                  <select
                    value={attemptForm.attemptNumber}
                    onChange={(e) => setAttemptForm({ ...attemptForm, attemptNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  >
                    <option value={1}>Attempt 1</option>
                    <option value={2}>Attempt 2</option>
                    <option value={3}>Attempt 3 (Final)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Delivery Result</label>
                  <select
                    value={attemptForm.deliveryResult}
                    onChange={(e) => setAttemptForm({ ...attemptForm, deliveryResult: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  >
                    <option value="Failed">Failed / Incomplete</option>
                    <option value="Successful">Successful Handover</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Failure Reason</label>
                  <select
                    value={attemptForm.failureReason}
                    onChange={(e) => setAttemptForm({ ...attemptForm, failureReason: e.target.value })}
                    disabled={attemptForm.deliveryResult === 'Successful'}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white disabled:opacity-40"
                  >
                    <option value="Customer Unavailable">Customer Unavailable</option>
                    <option value="Incorrect Address">Incorrect Address</option>
                    <option value="Customer Refused">Customer Refused Handover</option>
                    <option value="Phone Not Reachable">Phone Not Reachable</option>
                    <option value="Payment Issue">Payment Issue (COD)</option>
                    <option value="Other">Other Operational Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Rider Verification Remarks</label>
                <textarea
                  rows="2"
                  value={attemptForm.remarks}
                  onChange={(e) => setAttemptForm({ ...attemptForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Scheduled Next Reattempt</label>
                <input
                  type="text"
                  value={attemptForm.nextAttemptDate}
                  onChange={(e) => setAttemptForm({ ...attemptForm, nextAttemptDate: e.target.value })}
                  placeholder="e.g. Tomorrow, 18 Nov 2026, 11:00 AM"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold"
                >
                  Submit Exception Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW ATTEMPT DETAILS WITH GEOTAGGED PROOF */}
      {selectedAttemptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF4966]" />
                <h3 className="font-bold text-sm text-white">
                  Attempt Audit #{selectedAttemptDetail.attemptId}
                </h3>
              </div>
              <button onClick={() => setSelectedAttemptDetail(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Order ID:</span>
                  <span className="font-bold text-white">{selectedAttemptDetail.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Customer:</span>
                  <span className="text-white">{selectedAttemptDetail.customerName} ({selectedAttemptDetail.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Assigned Rider:</span>
                  <span className="text-[#E9B94F] font-bold">{selectedAttemptDetail.riderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Result:</span>
                  <span className="text-[#FF4966] font-bold">{selectedAttemptDetail.deliveryResult}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Reason:</span>
                  <span className="text-[#FFB020] font-bold">{selectedAttemptDetail.failureReason}</span>
                </div>
              </div>

              <div>
                <span className="text-[#A7B1C2] block mb-1 font-semibold">Geotagged Doorstep Proof Photo:</span>
                <img
                  src={selectedAttemptDetail.proofOfAttempt}
                  alt="Proof of attempt"
                  className="w-full h-44 rounded-xl object-cover border border-[#28334B]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B]">
                <span className="text-[#A7B1C2] block font-semibold">Rider Field Remarks:</span>
                <p className="text-white mt-1 leading-relaxed">{selectedAttemptDetail.remarks}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
              <button
                onClick={() => setSelectedAttemptDetail(null)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAttemptsModule;
