import React from 'react';
import {
  X,
  Send,
  Bookmark,
  Paperclip,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function TicketDetailDrawerModal({
  activeTicket,
  onClose,
  agents = [],
  handleStatusChange,
  handleAssignAgent,
  isInternalNote,
  setIsInternalNote,
  replyText,
  setReplyText,
  handleSendReply,
  onOpenCannedModal,
  getStatusBadge,
  getPriorityBadge,
}) {
  if (!activeTicket) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl bg-[#091426] border border-[#252D42] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#091426] border-b border-[#252D42] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold font-mono text-[#00D9E8]">
              {activeTicket.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                activeTicket.status
              )}`}
            >
              {activeTicket.status}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(
                activeTicket.priority
              )}`}
            >
              {activeTicket.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeTicket.status}
              onChange={(e) => handleStatusChange(activeTicket.id, e.target.value)}
              className="bg-[#111729] text-white text-xs px-3 py-1.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] cursor-pointer"
            >
              <option value="Open">Status: Open</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Pending">Status: Pending</option>
              <option value="Resolved">Status: Resolved</option>
              <option value="Escalated">Status: Escalated</option>
            </select>

            <select
              value={activeTicket.assignedTo}
              onChange={(e) => handleAssignAgent(activeTicket.id, e.target.value)}
              className="bg-[#111729] text-white text-xs px-3 py-1.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.name}>
                  Assign: {ag.name}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#A7B1C2] hover:text-white hover:bg-[#111729] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Conversation History & Reply Box */}
          <div className="flex-1 flex flex-col border-r border-[#252D42] overflow-hidden bg-[#070918]/60">
            {/* Subject & Description Banner */}
            <div className="p-5 border-b border-[#252D42] bg-[#111729]/40">
              <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#A7B1C2]">
                <span>Category: {activeTicket.category}</span>
                <span>•</span>
                <span>Order: #{activeTicket.orderId}</span>
                <span>•</span>
                <span>Created: {activeTicket.createdAt}</span>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
              {(activeTicket.messages || [
                {
                  id: 'orig',
                  sender: activeTicket.customerName,
                  senderType: 'customer',
                  timestamp: activeTicket.createdAt,
                  text: activeTicket.description,
                },
              ]).map((msg) => {
                const isStaff = msg.senderType === 'support';
                const isInternal = msg.senderType === 'internal';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isInternal
                        ? 'items-center'
                        : isStaff
                        ? 'items-end'
                        : 'items-start'
                    }`}
                  >
                    {isInternal ? (
                      <div className="w-full max-w-lg p-3 rounded-xl bg-[#E7B43F]/10 border border-[#E7B43F]/30 text-xs">
                        <div className="flex items-center justify-between font-semibold text-[#E7B43F] mb-1">
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-3.5 h-3.5" />
                            Internal Staff Note ({msg.sender})
                          </span>
                          <span className="text-[10px]">{msg.timestamp}</span>
                        </div>
                        <p className="text-white/90 leading-relaxed">{msg.text}</p>
                      </div>
                    ) : (
                      <div
                        className={`max-w-lg p-4 rounded-2xl text-xs space-y-1 shadow-md ${
                          isStaff
                            ? 'bg-gradient-to-r from-[#00D9E8]/20 to-[#00B4D8]/20 border border-[#00D9E8]/30 text-white rounded-tr-none'
                            : 'bg-[#111729] border border-[#252D42] text-white rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] text-[#A7B1C2]">
                          <span className="font-semibold text-white">{msg.sender}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <div className="p-4 border-t border-[#252D42] bg-[#091426] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsInternalNote(false)}
                    className={`font-semibold cursor-pointer pb-1 transition-colors ${
                      !isInternalNote
                        ? 'text-[#00D9E8] border-b-2 border-[#00D9E8]'
                        : 'text-[#A7B1C2] hover:text-white'
                    }`}
                  >
                    Public Customer Reply
                  </button>
                  <button
                    onClick={() => setIsInternalNote(true)}
                    className={`font-semibold cursor-pointer pb-1 transition-colors flex items-center gap-1 ${
                      isInternalNote
                        ? 'text-[#E7B43F] border-b-2 border-[#E7B43F]'
                        : 'text-[#A7B1C2] hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                    Internal Note
                  </button>
                </div>

                <button
                  onClick={onOpenCannedModal}
                  className="text-[#00D9E8] hover:underline text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Bookmark className="w-3 h-3" />
                  Insert Canned Template
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows="3"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isInternalNote
                      ? 'Add internal note for support & fulfillment team...'
                      : `Reply to ${activeTicket.customerName}...`
                  }
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none transition-colors resize-none placeholder:text-[#64748B] text-white ${
                    isInternalNote
                      ? 'bg-[#E7B43F]/5 border-[#E7B43F]/30 focus:border-[#E7B43F]'
                      : 'bg-[#111729] border-[#252D42] focus:border-[#00D9E8]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#A7B1C2]">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-[#111729] text-[#A7B1C2] hover:text-white transition-colors"
                    title="Attach tracking receipt or authenticity document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-[#64748B]">Press ⌘ + Enter to send</span>
                </div>

                <button
                  onClick={handleSendReply}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isInternalNote
                      ? 'bg-[#E7B43F] text-[#070918] hover:bg-[#d6a534]'
                      : 'bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] hover:shadow-[0_0_15px_rgba(0,217,232,0.4)]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isInternalNote ? 'Save Note' : 'Send Reply'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Customer 360 Details */}
          <div className="w-full md:w-80 bg-[#111729]/70 p-5 space-y-5 overflow-y-auto custom-scrollbar">
            <div>
              <h4 className="text-xs uppercase font-bold text-[#64748B] tracking-wider mb-3">
                Customer Profile
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#00D9E8]/10 text-[#00D9E8] border border-[#00D9E8]/30 flex items-center justify-center font-bold text-base">
                  {activeTicket.customerName ? activeTicket.customerName[0] : 'C'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{activeTicket.customerName}</p>
                  <p className="text-xs text-[#00D9E8] font-medium">VIP Tier: Platinum</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#252D42]/60">
                  <span className="text-[#A7B1C2]">Email:</span>
                  <span className="text-white font-medium truncate max-w-[150px]">
                    {activeTicket.customerEmail}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#252D42]/60">
                  <span className="text-[#A7B1C2]">Phone:</span>
                  <span className="text-white font-medium">{activeTicket.customerPhone || '+91 98765 43210'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#252D42]/60">
                  <span className="text-[#A7B1C2]">Total Orders:</span>
                  <span className="text-white font-bold">5 Orders</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#252D42]/60">
                  <span className="text-[#A7B1C2]">Lifetime Spend:</span>
                  <span className="text-[#E7B43F] font-bold">₹18,45,000</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#252D42]">
              <h4 className="text-xs uppercase font-bold text-[#64748B] tracking-wider mb-2">
                Order Details
              </h4>
              <div className="p-3 rounded-xl bg-[#091426] border border-[#252D42] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Order Number:</span>
                  <span className="font-mono text-[#00D9E8] font-semibold">
                    #{activeTicket.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Product:</span>
                  <span className="text-white font-medium text-right max-w-[150px] truncate">
                    {activeTicket.watchModel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7B1C2]">Delivery Status:</span>
                  <span className="text-[#10B981] font-semibold">In Transit (BlueDart)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#252D42] space-y-2">
              <button
                onClick={() => handleStatusChange(activeTicket.id, 'Escalated')}
                className="w-full py-2 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Escalate to Concierge Lead</span>
              </button>

              <button
                onClick={() => handleStatusChange(activeTicket.id, 'Resolved')}
                className="w-full py-2 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Resolved</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
