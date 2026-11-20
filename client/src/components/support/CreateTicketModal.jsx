import React from 'react';
import { X } from 'lucide-react';

export default function CreateTicketModal({
  isOpen,
  onClose,
  newTicket,
  setNewTicket,
  onSubmit,
  agents = [],
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#252D42]">
          <div>
            <h3 className="text-lg font-bold text-white">Create Support Ticket</h3>
            <p className="text-xs text-[#A7B1C2]">Log a new inquiry on behalf of a luxury timepiece buyer</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={newTicket.customerName}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, customerName: e.target.value })
                }
                placeholder="e.g. Vikram Singhania"
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                Customer Email *
              </label>
              <input
                type="email"
                required
                value={newTicket.customerEmail}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, customerEmail: e.target.value })
                }
                placeholder="vikram@example.com"
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                Order ID (Optional)
              </label>
              <input
                type="text"
                value={newTicket.orderId}
                onChange={(e) => setNewTicket({ ...newTicket, orderId: e.target.value })}
                placeholder="WH-ORD-9024"
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                Timepiece Model
              </label>
              <input
                type="text"
                value={newTicket.watchModel}
                onChange={(e) => setNewTicket({ ...newTicket, watchModel: e.target.value })}
                placeholder="e.g. Rolex Submariner Date"
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Category</label>
              <select
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              >
                <option value="Shipping & Delivery">Shipping & Delivery</option>
                <option value="Returns & Exchange">Returns & Exchange</option>
                <option value="Refunds & Payments">Refunds & Payments</option>
                <option value="Product Authenticity & Quality">Authenticity & Quality</option>
                <option value="Custom Timepiece Query">Custom Timepiece</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Priority</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Assignee</label>
              <select
                value={newTicket.assignedTo}
                onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
              >
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.name}>
                    {ag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Subject *</label>
            <input
              type="text"
              required
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              placeholder="Summary of the customer inquiry"
              className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
              Description / First Message *
            </label>
            <textarea
              rows="3"
              required
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              placeholder="Detail the issue, tracking delays, or inquiry..."
              className="w-full bg-[#111729] text-white text-xs p-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#252D42] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] hover:shadow-[0_0_15px_rgba(0,217,232,0.4)] cursor-pointer"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
