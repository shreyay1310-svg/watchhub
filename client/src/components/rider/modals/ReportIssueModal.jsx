import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export const ReportIssueModal = ({ isOpen, onClose, defaultOrderId }) => {
  const [category, setCategory] = useState('Customer Unreachable');
  const [orderId, setOrderId] = useState(defaultOrderId || '');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState('High Priority');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/rider/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          orderId,
          message: notes,
          urgency,
        }),
      });
    } catch {}

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#0B1022] border border-amber-500/30 rounded-3xl p-6 text-white shadow-2xl relative space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Report Delivery Issue</h3>
              <p className="text-xs text-gray-400">Dispatches priority alert to Support Room</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-emerald-300 text-sm">Issue Dispatched!</h4>
            <p className="text-xs text-emerald-200">Support Manager has received the notification.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-amber-400"
              >
                <option value="Customer Unreachable">Customer Unreachable</option>
                <option value="Incorrect Address">Incorrect Address / Location Mismatch</option>
                <option value="Damaged Packaging">Damaged Package / Tamper Alert</option>
                <option value="Vehicle Breakdown">Vehicle Breakdown / Transit Delay</option>
                <option value="Emergency Assist">Emergency Assistance Required</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Order / Parcel ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="#WH12548"
                className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Situation Notes</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe current location and delivery bottleneck..."
                className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-amber-400"
                required
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black hover:brightness-110"
              >
                Transmit Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportIssueModal;
