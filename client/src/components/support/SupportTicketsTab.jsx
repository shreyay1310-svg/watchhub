import React from 'react';
import { Search, Send } from 'lucide-react';

export default function SupportTicketsTab({
  tickets,
  setTickets,
  filteredTickets,
  searchTicket,
  setSearchTicket,
  filterTicketStatus,
  setFilterTicketStatus,
  activeTicket,
  setActiveTicket,
  replyText,
  setReplyText,
  handleSendTicketReply,
}) {
  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
          <span className="text-[11px] font-semibold text-[#A6B1C8]">Open Tickets</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {tickets.filter(t => t.status === 'Open').length}
          </p>
          <span className="text-[10px] text-amber-600 font-bold">● Immediate agent pickup</span>
        </div>
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
          <span className="text-[11px] font-semibold text-[#A6B1C8]">In Progress</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {tickets.filter(t => t.status === 'In Progress').length}
          </p>
          <span className="text-[10px] text-blue-500 font-bold">● Awaiting warehouse/courier</span>
        </div>
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
          <span className="text-[11px] font-semibold text-[#A6B1C8]">Escalated</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {tickets.filter(t => t.status === 'Escalated').length}
          </p>
          <span className="text-[10px] text-rose-500 font-bold">● Direct manager attention</span>
        </div>
        <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
          <span className="text-[11px] font-semibold text-[#A6B1C8]">Avg Resolution SLA</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">18 min</p>
          <span className="text-[10px] text-emerald-500 font-bold">● Fast response guarantee</span>
        </div>
      </div>

      {/* Ticket Desk Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Queue */}
        <div className="lg:col-span-5 bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm p-4 flex flex-col h-[560px]">
          <div className="space-y-3 pb-3 border-b border-white/10">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                placeholder="Search ticket #, order, customer..."
                className="w-full h-8 pl-9 pr-3 rounded-lg border border-white/15 text-xs outline-none focus:border-watch-gold"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#A6B1C8]">{filteredTickets.length} Tickets Found</span>
              <select
                value={filterTicketStatus}
                onChange={(e) => setFilterTicketStatus(e.target.value)}
                className="border border-white/10 rounded px-2 py-0.5 text-[11px] outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
            {filteredTickets.map((t) => {
              const isSelected = activeTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-watch-gold bg-amber-50/50 shadow-sm'
                      : 'border-white/10 bg-[#10182D]/90 backdrop-blur-md hover:bg-[#0B1022]/80'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] font-bold text-gray-400">{t.id}</span>
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                      t.status === 'Escalated' ? 'bg-rose-100 text-rose-800' :
                      t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h5 className="font-bold text-[#F8FAFC] text-xs mt-1 truncate">{t.subject}</h5>
                  <p className="text-[11px] text-[#A6B1C8] mt-0.5 truncate">{t.customer} • {t.orderId}</p>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400">
                    <span className="font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      {t.category}
                    </span>
                    <span>{t.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Ticket Detail Thread */}
        <div className="lg:col-span-7 bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm p-5 flex flex-col h-[560px]">
          {activeTicket ? (
            <>
              {/* Top Bar */}
              <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#F8FAFC]">{activeTicket.subject}</h4>
                    <span className="font-mono text-xs font-bold text-watch-gold">{activeTicket.id}</span>
                  </div>
                  <p className="text-xs text-[#A6B1C8] mt-0.5">
                    {activeTicket.customer} ({activeTicket.email}) • Order: <span className="font-mono font-bold text-[#F8FAFC]">{activeTicket.orderId}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeTicket.status}
                    onChange={(e) => {
                      const updated = { ...activeTicket, status: e.target.value };
                      setActiveTicket(updated);
                      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
                    }}
                    className="text-xs font-bold border border-white/15 rounded-lg px-2.5 py-1 outline-none"
                  >
                    <option value="Open">Status: Open</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Escalated">Status: Escalated</option>
                    <option value="Resolved">Status: Resolved</option>
                  </select>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                {activeTicket.messages.map((m, idx) => {
                  const isCustomer = !m.sender.includes('Support');
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                          isCustomer
                            ? 'bg-white/5 text-[#F8FAFC] rounded-tl-sm'
                            : 'bg-watch-navy-dark text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="text-[10px] font-bold opacity-75">{m.sender}</p>
                        <p className="leading-relaxed">{m.text}</p>
                        <p className="text-[9px] text-right opacity-60 font-mono mt-1">{m.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Preset Responses */}
              <div className="py-2 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-[10px] font-bold text-gray-400">Quick Reply:</span>
                <button
                  type="button"
                  onClick={() => setReplyText('Hello! Your courier shipment has been marked for priority delivery this afternoon with BlueDart. AWB is active.')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-gray-200 rounded-full whitespace-nowrap text-[#A6B1C8] cursor-pointer"
                >
                  🚀 Priority Dispatch Info
                </button>
                <button
                  type="button"
                  onClick={() => setReplyText('Thank you for reaching out! We have authorized your refund and the bank ARN reference has been sent to your email.')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-gray-200 rounded-full whitespace-nowrap text-[#A6B1C8] cursor-pointer"
                >
                  💳 Refund Authorized
                </button>
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendTicketReply} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type response to customer..."
                  className="flex-1 h-10 px-3.5 rounded-xl border border-white/15 text-xs outline-none focus:border-watch-gold"
                />
                <button
                  type="submit"
                  className="btn-gold px-4 h-10 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Send Reply
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              Select a ticket from the left list to begin replying.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
