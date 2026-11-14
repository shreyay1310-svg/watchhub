import express from 'express';

const router = express.Router();

// Support Dashboard KPIs
let SUPPORT_STATS = {
  totalTickets: 1248,
  totalTicketsTrend: '+12%',
  resolved: 1096,
  resolvedTrend: '+15%',
  pending: 108,
  pendingTrend: '-8%',
  escalated: 24,
  escalatedTrend: '-20%',
  avgResponseTime: '4m 32s',
  avgResponseTimeTrend: '-28%',
  csat: '4.8 / 5',
  csatTrend: '+0.2',
};

// Donut Chart Breakdown
let TICKET_STATUS_BREAKDOWN = [
  { name: 'Resolved', count: 1096, percentage: 87.8, color: '#10B981' },
  { name: 'In Progress', count: 44, percentage: 3.5, color: '#3B82F6' },
  { name: 'Pending', count: 64, percentage: 5.1, color: '#F59E0B' },
  { name: 'Escalated', count: 24, percentage: 1.9, color: '#EF4444' },
  { name: 'Open', count: 20, percentage: 1.7, color: '#6B7280' },
];

// Weekly Ticket Trend
const TICKET_TREND_DATA = [
  { day: 'Mon', tickets: 48 },
  { day: 'Tue', tickets: 92 },
  { day: 'Wed', tickets: 140 },
  { day: 'Thu', tickets: 168 },
  { day: 'Fri', tickets: 145 },
  { day: 'Sat', tickets: 180 },
  { day: 'Sun', tickets: 228 },
];

// Support Agents
let SUPPORT_AGENTS = [
  {
    id: 'agt_001',
    name: 'Rohan Singh',
    shortName: 'Rohan',
    email: 'rohan.s@watchhub.in',
    status: 'Online',
    ticketsResolved: 142,
    csat: '98%',
    role: 'Senior Support Agent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'agt_002',
    name: 'Neha Sharma',
    shortName: 'Neha',
    email: 'neha.s@watchhub.in',
    status: 'Online',
    ticketsResolved: 126,
    csat: '97%',
    role: 'Support Specialist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'agt_003',
    name: 'Amit Kumar',
    shortName: 'Amit',
    email: 'amit.k@watchhub.in',
    status: 'Away',
    ticketsResolved: 118,
    csat: '96%',
    role: 'Customer Care Executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'agt_004',
    name: 'Pooja Gupta',
    shortName: 'Pooja',
    email: 'pooja.g@watchhub.in',
    status: 'Online',
    ticketsResolved: 185,
    csat: '99%',
    role: 'Support Manager',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
];

// Support Tickets Database (Matching image exactly)
let SUPPORT_TICKETS = [
  {
    id: 'tkt_001',
    ticketId: '#WH-T12548',
    customer: 'Ananya Singh',
    customerEmail: 'ananya.singh@example.com',
    customerPhone: '+91 98123 45678',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    orderId: '#WH12548',
    productName: 'Rolex Submariner Date 41mm',
    subject: 'Order not delivered yet',
    category: 'Shipping',
    categoryColor: '#4338CA',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Rohan',
    assignedAgentId: 'agt_001',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    createdDate: 'Today, 09:15 AM',
    lastUpdated: 'Today, 11:24 AM',
    slaDeadline: '2h 30m remaining',
    messages: [
      {
        id: 'msg_01',
        sender: 'Ananya Singh',
        senderType: 'customer',
        time: 'Today, 09:15 AM',
        text: 'Hi WatchHub team, my order #WH12548 shows out for delivery in Lucknow since 9 AM, but the delivery partner has not arrived yet. Could you please check with rider Rohan Singh?',
      },
      {
        id: 'msg_02',
        sender: 'Rohan (Support)',
        senderType: 'agent',
        time: 'Today, 09:20 AM',
        text: 'Hello Ananya, thank you for reaching out! I checked with our dispatch center. Rider Rohan Singh is currently on the Gomti Nagar sector route and his confirmed ETA at your address is 12:40 PM.',
      },
      {
        id: 'msg_03',
        sender: 'Ananya Singh',
        senderType: 'customer',
        time: 'Today, 11:20 AM',
        text: 'Thank you for the quick check! Will someone call prior to doorbell ringing?',
      },
      {
        id: 'msg_04',
        sender: 'Rohan (Support)',
        senderType: 'agent',
        time: 'Today, 11:24 AM',
        text: 'Yes! The rider has an automated delivery notification system and will call your registered number (+91 98123 45678) 10 minutes prior to arrival.',
      },
    ],
    internalNotes: [
      { author: 'Rohan Singh', time: '11:22 AM', text: 'Checked BlueDart / Shadowfax GPS radar. Rider vehicle is 2.8 km away.' },
    ],
  },
  {
    id: 'tkt_002',
    ticketId: '#WH-T12547',
    customer: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    customerPhone: '+91 98234 56789',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    orderId: '#WH12547',
    productName: 'Omega Speedmaster Professional',
    subject: 'Return request for smartwatch',
    category: 'Returns',
    categoryColor: '#059669',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Neha',
    assignedAgentId: 'agt_002',
    assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    createdDate: 'Today, 08:30 AM',
    lastUpdated: 'Today, 10:05 AM',
    slaDeadline: '4h 15m remaining',
    messages: [
      {
        id: 'msg_11',
        sender: 'Rahul Verma',
        senderType: 'customer',
        time: 'Today, 08:30 AM',
        text: 'I ordered the smartwatch combo but received the analog chronograph edition. I would like to schedule a reverse pickup.',
      },
      {
        id: 'msg_12',
        sender: 'Neha (Support)',
        senderType: 'agent',
        time: 'Today, 10:05 AM',
        text: 'Hello Rahul, our apologies for the mix-up! We have approved your return request #RET-8905. Courier partner Delhivery will pick up the package tomorrow.',
      },
    ],
    internalNotes: [],
  },
  {
    id: 'tkt_003',
    ticketId: '#WH-T12546',
    customer: 'Priya Yadav',
    customerEmail: 'priya.y@example.com',
    customerPhone: '+91 98345 67890',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    orderId: '#WH12546',
    productName: 'Cartier Tank Must',
    subject: 'Refund not received',
    category: 'Refunds',
    categoryColor: '#E11D48',
    priority: 'High',
    status: 'Pending',
    assignedTo: 'Amit',
    assignedAgentId: 'agt_003',
    assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    createdDate: 'Today, 07:45 AM',
    lastUpdated: 'Today, 09:40 AM',
    slaDeadline: '1h 10m remaining (Urgent)',
    messages: [
      {
        id: 'msg_21',
        sender: 'Priya Yadav',
        senderType: 'customer',
        time: 'Today, 07:45 AM',
        text: 'Return pickup for #WH12480 was completed 3 days ago. The bank account still does not reflect the refund amount of ₹14,999.',
      },
      {
        id: 'msg_22',
        sender: 'Amit (Support)',
        senderType: 'agent',
        time: 'Today, 09:40 AM',
        text: 'Hi Priya, our accounts team verified the gateway ARN #REF-559021. Banking partners usually settle within 24 to 48 business hours.',
      },
    ],
    internalNotes: [
      { author: 'Amit Kumar', time: '09:35 AM', text: 'Checked Razorpay dashboard. Gateway payout status is PENDING_SETTLEMENT.' },
    ],
  },
  {
    id: 'tkt_004',
    ticketId: '#WH-T12545',
    customer: 'Rohit Kumar',
    customerEmail: 'rohit.k@example.com',
    customerPhone: '+91 98456 78901',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    orderId: '#WH12545',
    productName: 'Smartwatch Pro AMOLED',
    subject: 'Wrong product received',
    category: 'Replacement',
    categoryColor: '#2563EB',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'Rohan',
    assignedAgentId: 'agt_001',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    createdDate: 'Yesterday, 03:20 PM',
    lastUpdated: 'Yesterday, 06:12 PM',
    slaDeadline: 'Resolved within SLA',
    messages: [
      {
        id: 'msg_31',
        sender: 'Rohit Kumar',
        senderType: 'customer',
        time: 'Yesterday, 03:20 PM',
        text: 'I ordered the Space Grey dial edition, but opened the box to find Midnight Blue.',
      },
      {
        id: 'msg_32',
        sender: 'Rohan (Support)',
        senderType: 'agent',
        time: 'Yesterday, 06:12 PM',
        text: 'Hi Rohit, expedited replacement shipment #WH12555 has been initiated from our Delhi hub.',
      },
    ],
    internalNotes: [],
  },
  {
    id: 'tkt_005',
    ticketId: '#WH-T12544',
    customer: 'Sneha Patel',
    customerEmail: 'sneha.patel@example.com',
    customerPhone: '+91 98567 89012',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    orderId: '#WH12544',
    productName: 'Patek Philippe Nautilus 5711',
    subject: 'Product warranty query',
    category: 'Product Info',
    categoryColor: '#7C3AED',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Neha',
    assignedAgentId: 'agt_002',
    assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    createdDate: 'Yesterday, 01:10 PM',
    lastUpdated: 'Yesterday, 04:25 PM',
    slaDeadline: 'Resolved within 3h 15m',
    messages: [
      {
        id: 'msg_41',
        sender: 'Sneha Patel',
        senderType: 'customer',
        time: 'Yesterday, 01:10 PM',
        text: 'How do I register the international warranty certificate for my Patek timepiece?',
      },
      {
        id: 'msg_42',
        sender: 'Neha (Support)',
        senderType: 'agent',
        time: 'Yesterday, 04:25 PM',
        text: 'Hello Sneha, all luxury watches purchased via WatchHub are pre-activated with the official brand manufacturer. You can download your digital certificate directly from your account page.',
      },
    ],
    internalNotes: [],
  },
  {
    id: 'tkt_006',
    ticketId: '#WH-T12540',
    customer: 'Vikram Malhotra',
    customerEmail: 'vikram.m@example.com',
    customerPhone: '+91 98678 90123',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    orderId: '#WH12543',
    productName: 'Rolex Cosmograph Daytona Gold',
    subject: 'Escalation: Transit delay on luxury consignment',
    category: 'Shipping',
    categoryColor: '#4338CA',
    priority: 'High',
    status: 'Escalated',
    assignedTo: 'Pooja',
    assignedAgentId: 'agt_004',
    assignedAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    createdDate: '13 Nov 2026, 11:00 AM',
    lastUpdated: '13 Nov 2026, 04:30 PM',
    slaDeadline: 'Escalated to Lead Manager',
    messages: [
      {
        id: 'msg_51',
        sender: 'Vikram Malhotra',
        senderType: 'customer',
        time: '13 Nov 2026, 11:00 AM',
        text: 'This is a high-value anniversary gift. I was promised morning delivery.',
      },
      {
        id: 'msg_52',
        sender: 'Pooja (Support Manager)',
        senderType: 'agent',
        time: '13 Nov 2026, 04:30 PM',
        text: 'Dear Mr. Malhotra, I have personally overseen the dispatch. Handover successfully completed at 11:15 AM today.',
      },
    ],
    internalNotes: [
      { author: 'Pooja Gupta', time: '11:15 AM', text: 'Verified doorstep OTP with customer Vikram Malhotra.' },
    ],
  },
];

// Recent Conversations (Live Chat)
let RECENT_CONVERSATIONS = [
  {
    id: 'chat_01',
    customer: 'Ananya Singh',
    avatarInitials: 'AS',
    avatarColor: 'bg-emerald-500',
    lastMessage: 'My order #WH12548 is delayed, can you check ...',
    time: '2 min ago',
    unreadCount: 1,
    online: true,
    ticketId: '#WH-T12548',
  },
  {
    id: 'chat_02',
    customer: 'Rahul Verma',
    avatarInitials: 'RV',
    avatarColor: 'bg-amber-500',
    lastMessage: 'I want to return the smartwatch. Please guide...',
    time: '10 min ago',
    unreadCount: 0,
    online: false,
    ticketId: '#WH-T12547',
  },
  {
    id: 'chat_03',
    customer: 'Priya Yadav',
    avatarInitials: 'PY',
    avatarColor: 'bg-purple-500',
    lastMessage: 'Do you offer an extended warranty?',
    time: '18 min ago',
    unreadCount: 0,
    online: true,
    ticketId: '#WH-T12546',
  },
];

// Canned Responses
const CANNED_RESPONSES = [
  {
    id: 'cr_01',
    title: 'Order Tracking & Delivery Status',
    text: 'Hello {customer_name}, thank you for contacting WatchHub! Your order {order_id} is currently {status} with courier partner {courier_name} (AWB: {awb}). Current expected delivery is {eta}.',
  },
  {
    id: 'cr_02',
    title: 'Return Request Approval',
    text: 'Dear {customer_name}, your return request has been approved under our 7-Day Hassle-Free Policy. A rider will arrive at your address within 24-48 hours. Please ensure the watch is packed in its original luxury box with warranty cards.',
  },
  {
    id: 'cr_03',
    title: 'Refund Timeline & Gateway Update',
    text: 'Hi {customer_name}, the refund of {amount} has been approved and processed through our payment gateway. It usually reflects in your original payment method within 3–5 working days.',
  },
  {
    id: 'cr_04',
    title: 'Official Warranty Verification',
    text: 'Dear {customer_name}, every timepiece sold on WatchHub comes with 100% authentic brand warranty. Your digital warranty card is stored under your account profile and is valid at all authorized service centers nationwide.',
  },
];

// Knowledge Base Articles
const KNOWLEDGE_BASE_ARTICLES = [
  {
    id: 'kb_01',
    title: 'How to Track Your Parcel in Real Time',
    category: 'Orders & Tracking',
    views: '14,250',
    summary: 'Enter your 9-digit Order ID (e.g. WH12548) or Courier AWB number on the WatchHub Track Parcel portal to view live rider GPS telemetry and SLA milestones.',
  },
  {
    id: 'kb_02',
    title: 'WatchHub 7-Day Return & Replacement Policy',
    category: 'Returns & Refunds',
    views: '11,400',
    summary: 'Timepieces are eligible for free doorstep pickup within 7 days of delivery, provided original security tags, wooden packaging, and warranty cards are intact.',
  },
  {
    id: 'kb_03',
    title: 'Refund Timelines Across Payment Modes',
    category: 'Payments & Refunds',
    views: '9,800',
    summary: 'UPI and Net Banking refunds are credited within 24–48 hours. Credit/Debit card refunds reflect in 3–5 business days depending on the issuing bank.',
  },
  {
    id: 'kb_04',
    title: 'Custom Watch Ordering, Assembly & SLAs',
    category: 'Custom Watches',
    views: '8,200',
    summary: 'Bespoke timepieces built through the WatchHub Customizer require 3–5 business days of master horologist assembly, water-resistance pressure testing, and precision calibration.',
  },
];

// 1. GET /api/support
router.get('/', (req, res) => {
  const { status, priority, category, agent, search } = req.query;

  let filtered = [...SUPPORT_TICKETS];

  if (status && status !== 'All') {
    filtered = filtered.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  }

  if (priority && priority !== 'All') {
    filtered = filtered.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  if (agent && agent !== 'All') {
    filtered = filtered.filter((t) => t.assignedTo.toLowerCase() === agent.toLowerCase());
  }

  if (search) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.ticketId.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.orderId.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    status: 'success',
    data: {
      stats: SUPPORT_STATS,
      statusBreakdown: TICKET_STATUS_BREAKDOWN,
      ticketTrend: TICKET_TREND_DATA,
      tickets: filtered,
      totalTicketsCount: SUPPORT_TICKETS.length,
      agents: SUPPORT_AGENTS,
      conversations: RECENT_CONVERSATIONS,
      cannedResponses: CANNED_RESPONSES,
      knowledgeBase: KNOWLEDGE_BASE_ARTICLES,
    },
  });
});

// 2. POST /api/support/ticket (Create New Ticket)
router.post('/ticket', (req, res) => {
  const { customer, customerEmail, customerPhone, orderId, productName, subject, category, priority, message } = req.body;

  if (!customer || !subject) {
    return res.status(400).json({ status: 'fail', message: 'Customer name and issue subject are required.' });
  }

  const newTicketNum = 12549 + SUPPORT_TICKETS.length;
  const newTicketId = `#WH-T${newTicketNum}`;
  const assignedAgent = SUPPORT_AGENTS[Math.floor(Math.random() * SUPPORT_AGENTS.length)];

  const categoryColorMap = {
    'Shipping': '#4338CA',
    'Returns': '#059669',
    'Refunds': '#E11D48',
    'Replacement': '#2563EB',
    'Product Info': '#7C3AED',
    'Warranty': '#D97706',
  };

  const newTicket = {
    id: `tkt_${Date.now()}`,
    ticketId: newTicketId,
    customer,
    customerEmail: customerEmail || 'customer@example.com',
    customerPhone: customerPhone || '+91 98000 00000',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    orderId: orderId || `#WH${12550 + Math.floor(Math.random() * 50)}`,
    productName: productName || 'Luxury Timepiece',
    subject,
    category: category || 'Shipping',
    categoryColor: categoryColorMap[category] || '#4338CA',
    priority: priority || 'Medium',
    status: 'Open',
    assignedTo: assignedAgent.shortName,
    assignedAgentId: assignedAgent.id,
    assignedAvatar: assignedAgent.avatar,
    createdDate: 'Just now',
    lastUpdated: 'Just now',
    slaDeadline: '4h remaining',
    messages: [
      {
        id: `msg_${Date.now()}`,
        sender: customer,
        senderType: 'customer',
        time: 'Just now',
        text: message || subject,
      },
    ],
    internalNotes: [],
  };

  SUPPORT_TICKETS.unshift(newTicket);
  SUPPORT_STATS.totalTickets += 1;
  SUPPORT_STATS.pending += 1;

  return res.status(201).json({
    status: 'success',
    message: `Support ticket ${newTicketId} created and assigned to ${assignedAgent.name}.`,
    data: newTicket,
  });
});

// 3. POST /api/support/ticket/reply
router.post('/ticket/reply', (req, res) => {
  const { ticketId, replyText, isInternal, agentName } = req.body;

  const ticket = SUPPORT_TICKETS.find((t) => t.ticketId === ticketId || t.id === ticketId);
  if (!ticket) {
    return res.status(404).json({ status: 'fail', message: 'Ticket not found.' });
  }

  const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (isInternal) {
    ticket.internalNotes.push({
      author: agentName || 'Support Agent',
      time: nowStr,
      text: replyText,
    });
    return res.status(200).json({ status: 'success', message: 'Internal note saved.', data: ticket });
  }

  ticket.messages.push({
    id: `msg_${Date.now()}`,
    sender: `${agentName || 'Agent'} (Support)`,
    senderType: 'agent',
    time: nowStr,
    text: replyText,
  });

  ticket.lastUpdated = `Today, ${nowStr}`;
  if (ticket.status === 'Open') ticket.status = 'In Progress';

  return res.status(200).json({
    status: 'success',
    message: 'Reply sent to customer.',
    data: ticket,
  });
});

// 4. POST /api/support/ticket/update-status
router.post('/ticket/update-status', (req, res) => {
  const { ticketId, newStatus, assignedTo } = req.body;

  const ticket = SUPPORT_TICKETS.find((t) => t.ticketId === ticketId || t.id === ticketId);
  if (!ticket) {
    return res.status(404).json({ status: 'fail', message: 'Ticket not found.' });
  }

  if (newStatus) {
    ticket.status = newStatus;
    if (newStatus === 'Resolved') {
      SUPPORT_STATS.resolved += 1;
      if (SUPPORT_STATS.pending > 0) SUPPORT_STATS.pending -= 1;
    } else if (newStatus === 'Escalated') {
      SUPPORT_STATS.escalated += 1;
    }
  }

  if (assignedTo) {
    const agt = SUPPORT_AGENTS.find((a) => a.shortName === assignedTo || a.name === assignedTo);
    if (agt) {
      ticket.assignedTo = agt.shortName;
      ticket.assignedAgentId = agt.id;
      ticket.assignedAvatar = agt.avatar;
    }
  }

  ticket.lastUpdated = 'Just now';

  return res.status(200).json({
    status: 'success',
    message: `Ticket ${ticketId} updated.`,
    data: ticket,
  });
});

// 5. POST /api/support/chat/send
router.post('/chat/send', (req, res) => {
  const { chatId, message, sender } = req.body;

  const chat = RECENT_CONVERSATIONS.find((c) => c.id === chatId);
  if (chat) {
    chat.lastMessage = message;
    chat.time = 'Just now';
  }

  return res.status(200).json({
    status: 'success',
    message: 'Message delivered to customer.',
    data: { chatId, message, time: 'Just now' },
  });
});

// 6. POST /api/support/refund
router.post('/refund', (req, res) => {
  const { orderId, customer, amount, reason } = req.body;

  const refundRecord = {
    id: `REF-${Date.now()}`,
    orderId: orderId || '#WH12548',
    customer: customer || 'Customer',
    amount: amount || 18999,
    reason: reason || 'Defective packaging or order cancellation',
    status: 'Approved & Initiated via Gateway',
    timestamp: new Date().toISOString(),
  };

  return res.status(201).json({
    status: 'success',
    message: `Refund of ₹${refundRecord.amount.toLocaleString('en-IN')} approved and sent to payment gateway for ${orderId}.`,
    data: refundRecord,
  });
});

// 7. GET /api/support/reports
router.get('/reports', (req, res) => {
  const { type = 'daily' } = req.query;

  return res.status(200).json({
    status: 'success',
    data: {
      type,
      generatedAt: new Date().toISOString(),
      csatScore: '4.8 / 5',
      fcrRate: '88.5%', // First Contact Resolution
      avgHandleTimeMinutes: 6.4,
      ticketsByCategory: [
        { category: 'Shipping & Delivery', count: 540 },
        { category: 'Returns & Exchange', count: 320 },
        { category: 'Refunds & Payments', count: 210 },
        { category: 'Product Warranty & Repair', count: 120 },
        { category: 'Custom Watch Enquiries', count: 58 },
      ],
    },
  });
});

export default router;
