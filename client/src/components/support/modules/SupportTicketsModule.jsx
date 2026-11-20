import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  ChevronDown,
  X,
  Send,
  MessageSquare,
  ShieldAlert,
  ArrowUpDown,
  Paperclip,
  Bookmark,
  RefreshCw,
  Eye,
  MoreVertical,
  Check,
} from 'lucide-react';

import TicketDetailDrawerModal from '../TicketDetailDrawerModal';
import CreateTicketModal from '../CreateTicketModal';

export const SupportTicketsModule = ({
  tickets = [],
  setTickets,
  agents = [],
  cannedResponses = [],
  selectedTicketId,
  setSelectedTicketId,
  searchQuery,
  setSearchQuery,
  onOpenCreateModal,
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Drawer / Detail modal state
  const [activeTicket, setActiveTicket] = useState(
    tickets.find((t) => t.id === selectedTicketId) || null
  );
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showCannedModal, setShowCannedModal] = useState(false);

  // Create Ticket Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderId: '',
    watchModel: '',
    category: 'Shipping & Delivery',
    priority: 'Medium',
    subject: '',
    description: '',
    assignedTo: 'Pooja Sharma',
  });

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch =
        !q ||
        ticket.id?.toLowerCase().includes(q) ||
        ticket.customerName?.toLowerCase().includes(q) ||
        ticket.customerEmail?.toLowerCase().includes(q) ||
        ticket.orderId?.toLowerCase().includes(q) ||
        ticket.subject?.toLowerCase().includes(q) ||
        ticket.watchModel?.toLowerCase().includes(q);

      // Status
      const matchesStatus =
        statusFilter === 'All' || ticket.status?.toLowerCase() === statusFilter.toLowerCase();

      // Priority
      const matchesPriority =
        priorityFilter === 'All' || ticket.priority?.toLowerCase() === priorityFilter.toLowerCase();

      // Category
      const matchesCategory =
        categoryFilter === 'All' || ticket.category?.toLowerCase() === categoryFilter.toLowerCase();

      // Agent
      const matchesAgent =
        agentFilter === 'All' || ticket.assignedTo?.toLowerCase() === agentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAgent;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter, agentFilter]);

  // Handle adding reply
  const handleSendReply = () => {
    if (!replyText.trim() || !activeTicket) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'Pooja Sharma (Customer Support)',
      senderType: isInternalNote ? 'internal' : 'support',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText.trim(),
    };

    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: isInternalNote ? t.status : 'In Progress',
          messages: [...(t.messages || []), newMessage],
        };
      }
      return t;
    });

    setTickets(updated);
    setActiveTicket({
      ...activeTicket,
      status: isInternalNote ? activeTicket.status : 'In Progress',
      messages: [...(activeTicket.messages || []), newMessage],
    });
    setReplyText('');
    setIsInternalNote(false);
  };

  // Handle status update
  const handleStatusChange = (ticketId, newStatus) => {
    const updated = tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t));
    setTickets(updated);
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket({ ...activeTicket, status: newStatus });
    }
  };

  // Handle priority update
  const handlePriorityChange = (ticketId, newPriority) => {
    const updated = tickets.map((t) => (t.id === ticketId ? { ...t, priority: newPriority } : t));
    setTickets(updated);
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket({ ...activeTicket, priority: newPriority });
    }
  };

  // Handle assign agent
  const handleAssignAgent = (ticketId, agentName) => {
    const updated = tickets.map((t) => (t.id === ticketId ? { ...t, assignedTo: agentName } : t));
    setTickets(updated);
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket({ ...activeTicket, assignedTo: agentName });
    }
  };

  // Handle Create Ticket submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newId = `TIC-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = {
      id: newId,
      customerName: newTicket.customerName,
      customerEmail: newTicket.customerEmail,
      customerPhone: newTicket.customerPhone || '+91 98765 43210',
      orderId: newTicket.orderId || 'WH-ORD-NEW',
      watchModel: newTicket.watchModel || 'Luxury Timepiece',
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'Open',
      assignedTo: newTicket.assignedTo,
      subject: newTicket.subject,
      description: newTicket.description,
      createdAt: 'Just now',
      slaDue: 'In 4 hours',
      messages: [
        {
          id: 'msg_1',
          sender: newTicket.customerName,
          senderType: 'customer',
          timestamp: 'Just now',
          text: newTicket.description,
        },
      ],
    };

    setTickets([created, ...tickets]);
    setCreateModalOpen(false);
    setNewTicket({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      orderId: '',
      watchModel: '',
      category: 'Shipping & Delivery',
      priority: 'Medium',
      subject: '',
      description: '',
      assignedTo: 'Pooja Sharma',
    });
    setActiveTicket(created);
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
      case 'urgent':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      case 'high':
        return 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30';
      case 'medium':
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
      case 'low':
      default:
        return 'bg-[#00D9E8]/15 text-[#00D9E8] border-[#00D9E8]/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'in progress':
        return 'bg-[#00D9E8]/15 text-[#00D9E8] border-[#00D9E8]/30';
      case 'open':
        return 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30';
      case 'pending':
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
      case 'escalated':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const statusTabs = ['All', 'Open', 'In Progress', 'Pending', 'Resolved', 'Escalated'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Support Tickets
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 font-semibold">
              {filteredTickets.length} Tickets
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Manage, triage, and resolve client inquiries with live SLA monitoring
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs hover:shadow-[0_0_20px_rgba(0,217,232,0.4)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filter Tabs: Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar border-b border-[#252D42]">
        {statusTabs.map((tab) => {
          const count =
            tab === 'All'
              ? tickets.length
              : tickets.filter((t) => t.status?.toLowerCase() === tab.toLowerCase()).length;
          const isActive = statusFilter === tab;

          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'border-[#00D9E8] text-[#00D9E8] bg-[#111729]'
                  : 'border-transparent text-[#A7B1C2] hover:text-white hover:bg-[#111729]/50'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  isActive ? 'bg-[#00D9E8]/20 text-[#00D9E8]' : 'bg-[#070918] text-[#64748B]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Dropdowns Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search by ID, customer, order, watch model..."
            className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] placeholder:text-[#64748B] transition-colors"
          />
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-[#111729] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#111729] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Shipping & Delivery">Shipping & Delivery</option>
            <option value="Returns & Exchange">Returns & Exchange</option>
            <option value="Refunds & Payments">Refunds & Payments</option>
            <option value="Product Authenticity & Quality">Authenticity & Quality</option>
            <option value="Custom Timepiece Query">Custom Timepiece</option>
            <option value="Technical Support">Technical Support</option>
          </select>
        </div>

        {/* Agent Filter */}
        <div>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="w-full bg-[#111729] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] cursor-pointer"
          >
            <option value="All">All Assigned Agents</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.name}>
                {ag.name} ({ag.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tickets Table */}
      <div className="rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#091426] border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Ticket ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Subject & Watch</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Assignee</th>
                <th className="py-3.5 px-4 font-semibold">SLA Due</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D42]/60">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-[#64748B]">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare className="w-10 h-10 text-[#252D42] mb-3" />
                      <p className="text-sm font-semibold text-white">No Tickets Found</p>
                      <p className="text-xs text-[#A7B1C2] mt-1">
                        Try adjusting your search or active filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className="hover:bg-[#070918]/60 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#00D9E8]">
                      {ticket.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] flex items-center justify-center font-bold text-[10px] border border-[#00D9E8]/30">
                          {ticket.customerName ? ticket.customerName[0] : 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-[#00D9E8] transition-colors">
                            {ticket.customerName}
                          </p>
                          <p className="text-[10px] text-[#64748B]">{ticket.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white truncate max-w-[220px]">
                        {ticket.subject}
                      </p>
                      <p className="text-[10px] text-[#A7B1C2] truncate max-w-[220px]">
                        {ticket.watchModel || 'Order #' + ticket.orderId}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2]">
                      <span className="truncate max-w-[140px] block">{ticket.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                        <span>{ticket.assignedTo || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] text-[11px] whitespace-nowrap">
                      {ticket.slaDue || '4h left'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTicket(ticket);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] font-bold text-[11px] transition-colors border border-[#00D9E8]/30"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Conversation Drawer Modal */}
      <TicketDetailDrawerModal
        activeTicket={activeTicket}
        onClose={() => setActiveTicket(null)}
        agents={agents}
        handleStatusChange={handleStatusChange}
        handleAssignAgent={handleAssignAgent}
        isInternalNote={isInternalNote}
        setIsInternalNote={setIsInternalNote}
        replyText={replyText}
        setReplyText={setReplyText}
        handleSendReply={handleSendReply}
        onOpenCannedModal={() => setShowCannedModal(true)}
        getStatusBadge={getStatusBadge}
        getPriorityBadge={getPriorityBadge}
      />

      {/* Quick Canned Response Selector Modal */}
      {showCannedModal && (
        <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091426] border border-[#252D42] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <h3 className="text-sm font-bold text-white">Select Canned Response</h3>
              <button
                onClick={() => setShowCannedModal(false)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {(cannedResponses.length > 0 ? cannedResponses : [
                {
                  id: 'can_1',
                  title: 'Order Tracking & Courier Delay Update',
                  content:
                    'Dear {customer_name}, your timepiece is securely en route under armed transit insurance. Estimated delivery is within 24 hours.',
                },
                {
                  id: 'can_2',
                  title: 'Return Pickup Scheduled',
                  content:
                    'Dear {customer_name}, our courier partner will arrive within 24-48 hours for biometric tamper-evident pickup of your timepiece.',
                },
                {
                  id: 'can_3',
                  title: 'Refund Approved Notice',
                  content:
                    'Dear {customer_name}, your refund of {refund_amount} has been initiated to your original payment method via Razorpay.',
                },
              ]).map((canned) => (
                <div
                  key={canned.id}
                  onClick={() => {
                    const parsed = canned.content
                      .replace('{customer_name}', activeTicket?.customerName || 'Client')
                      .replace('{order_id}', activeTicket?.orderId || 'WH-ORD')
                      .replace('{refund_amount}', '₹1,25,000');
                    setReplyText(parsed);
                    setShowCannedModal(false);
                  }}
                  className="p-3 rounded-xl bg-[#111729] border border-[#252D42] hover:border-[#00D9E8] transition-colors cursor-pointer group"
                >
                  <p className="text-xs font-bold text-white group-hover:text-[#00D9E8]">
                    {canned.title}
                  </p>
                  <p className="text-[11px] text-[#A7B1C2] mt-1 line-clamp-2">{canned.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create New Ticket Modal */}
      <CreateTicketModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        onSubmit={handleCreateSubmit}
        agents={agents}
      />
    </div>
  );
};

export default SupportTicketsModule;
