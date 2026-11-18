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
      {activeTicket && (
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
                  onClick={() => setActiveTicket(null)}
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
                      onClick={() => setShowCannedModal(true)}
                      className="text-[#00D9E8] hover:underline text-xs flex items-center gap-1"
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
                    className="w-full py-2 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Escalate to Concierge Lead</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(activeTicket.id, 'Resolved')}
                    className="w-full py-2 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Resolved</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#252D42]">
              <div>
                <h3 className="text-lg font-bold text-white">Create Support Ticket</h3>
                <p className="text-xs text-[#A7B1C2]">Log a new inquiry on behalf of a luxury timepiece buyer</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
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
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] hover:shadow-[0_0_15px_rgba(0,217,232,0.4)]"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsModule;
