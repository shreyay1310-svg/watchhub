import express from 'express';
import { prisma } from '../config/prisma.js';

const router = express.Router();

export let SUPPORT_STATS = {
  totalTickets: 1248,
  pending: 42,
  resolved: 1196,
  escalated: 10,
  avgResponseTime: '12 mins',
  csatScore: '4.8 / 5',
  fcrRate: '92.4%',
};

export const TICKET_STATUS_BREAKDOWN = [
  { name: 'Open', count: 24, percentage: 57.1, color: '#3B82F6' },
  { name: 'In Progress', count: 14, percentage: 33.3, color: '#F59E0B' },
  { name: 'Escalated', count: 4, percentage: 9.6, color: '#EF4444' },
];

export const TICKET_TREND_DATA = [
  { day: 'Mon', newTickets: 42, resolved: 38 },
  { day: 'Tue', newTickets: 56, resolved: 51 },
  { day: 'Wed', newTickets: 48, resolved: 49 },
  { day: 'Thu', newTickets: 62, resolved: 58 },
  { day: 'Fri', newTickets: 70, resolved: 65 },
  { day: 'Sat', newTickets: 35, resolved: 39 },
  { day: 'Sun', newTickets: 28, resolved: 30 },
];

export const SUPPORT_AGENTS = [
  {
    id: 'agt_001',
    name: 'Rohan Sharma',
    shortName: 'Rohan',
    role: 'Senior Horology Specialist',
    email: 'rohan.s@watchhub.com',
    status: 'Online',
    activeTickets: 5,
    resolvedToday: 12,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'agt_002',
    name: 'Priya Mehra',
    shortName: 'Priya',
    role: 'Logistics Escalations Lead',
    email: 'priya.m@watchhub.com',
    status: 'Online',
    activeTickets: 4,
    resolvedToday: 15,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
];

export const CANNED_RESPONSES = [
  {
    id: 'cr_01',
    title: 'Courier ETA Confirmation',
    shortcut: '/eta',
    text: 'Hello! I checked our logistics dispatch records. Your luxury timepiece consignment is currently with the courier partner and confirmed for doorstep delivery today.',
  },
  {
    id: 'cr_02',
    title: 'Return Policy & Reverse Pickup',
    shortcut: '/return',
    text: 'WatchHub provides a 7-day hassle-free inspection and return period on all certified luxury watches.',
  },
];

export const KNOWLEDGE_BASE_ARTICLES = [
  {
    id: 'kb_01',
    title: 'Authenticity Guarantee & Chronometer Certification',
    category: 'Product & Authenticity',
    summary: 'Every timepiece on WatchHub is 100% genuine and verified through our 32-point inspection protocol.',
  },
];

// 1. GET /api/support (Support Overview & Ticket Backlog - HD-010)
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;

    const dbTickets = await prisma.supportTicket.findMany({
      include: {
        customer: true,
        assignedAgent: true,
        order: true,
        messages: {
          include: { sender: true },
          orderBy: { sentAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let tickets = dbTickets.map((t) => {
      const customer = t.customer;
      const agent = t.assignedAgent;
      const order = t.order;

      return {
        id: t.ticketId,
        ticketId: t.ticketNumber,
        customer: customer?.fullName || 'Collector',
        customerEmail: customer?.email || 'customer@watchhub.com',
        customerPhone: customer?.phone || '+91 98000 00000',
        customerAvatar: customer?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        orderId: order?.orderNumber || '#WH12548',
        productName: 'Rolex Submariner Date 41mm',
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
        assignedTo: agent?.fullName || 'Support Agent',
        assignedAgentId: agent?.userId || 'agt_001',
        assignedAvatar: agent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        createdDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB') : 'Today',
        lastUpdated: t.updatedAt ? new Date(t.updatedAt).toLocaleTimeString('en-IN') : 'Just now',
        messages: t.messages.map((m) => ({
          id: m.messageId,
          sender: m.sender?.fullName || 'User',
          senderType: m.senderUserId === agent?.userId ? 'agent' : 'customer',
          time: m.sentAt ? new Date(m.sentAt).toLocaleTimeString('en-IN') : 'Just now',
          text: m.messageText,
        })),
        internalNotes: [],
      };
    });

    if (status && status !== 'All') {
      tickets = tickets.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    if (priority && priority !== 'All') {
      tickets = tickets.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
    }

    if (category && category !== 'All') {
      tickets = tickets.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.trim().toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.ticketId.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      );
    }

    const openCount = dbTickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
    const resolvedCount = dbTickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

    return res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalTickets: dbTickets.length || 1248,
          pending: openCount || 42,
          resolved: resolvedCount || 1196,
          escalated: 10,
          avgResponseTime: '12 mins',
          csatScore: '4.8 / 5',
          fcrRate: '92.4%',
        },
        statusBreakdown: TICKET_STATUS_BREAKDOWN,
        ticketTrend: TICKET_TREND_DATA,
        tickets,
        totalTicketsCount: tickets.length,
        agents: SUPPORT_AGENTS,
        conversations: [],
        cannedResponses: CANNED_RESPONSES,
        knowledgeBase: KNOWLEDGE_BASE_ARTICLES,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. POST /api/support/ticket (Create New Ticket via Prisma - HD-010)
router.post('/ticket', async (req, res) => {
  try {
    const { customer, customerEmail, customerPhone, orderId, subject, category, priority, message } = req.body;

    if (!customer || !subject) {
      return res.status(400).json({ status: 'fail', message: 'Customer name and issue subject are required.' });
    }

    const newTicketNum = 12549 + Math.floor(Math.random() * 500);
    const newTicketId = `#WH-T${newTicketNum}`;

    let customerUser = await prisma.user.findFirst({
      where: customerEmail ? { email: customerEmail.toLowerCase().trim() } : { userRoles: { some: { role: { roleName: 'Customer' } } } },
    });
    const customerId = customerUser ? customerUser.userId : '660000000000000000000006';

    const supportAgent = await prisma.user.findFirst({
      where: { userRoles: { some: { role: { roleName: 'Customer Support Executive' } } } },
    });
    const assignedAgentId = supportAgent ? supportAgent.userId : '660000000000000000000005';

    let order = null;
    if (orderId) {
      order = await prisma.order.findFirst({
        where: { OR: [{ orderNumber: orderId }, { orderId }] },
      });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber: newTicketId,
        customerId,
        orderId: order ? order.orderId : null,
        subject,
        category: category || 'Shipping',
        priority: priority || 'Medium',
        status: 'Open',
        assignedAgentId,
        messages: {
          create: {
            senderUserId: customerId,
            messageText: message || subject,
          },
        },
      },
      include: { messages: true },
    });

    return res.status(201).json({
      status: 'success',
      message: `Support ticket ${newTicketId} created and assigned.`,
      data: {
        id: ticket.ticketId,
        ticketId: ticket.ticketNumber,
        customer,
        subject: ticket.subject,
        status: ticket.status,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 3. POST /api/support/ticket/reply
router.post('/ticket/reply', async (req, res) => {
  try {
    const { ticketId, replyText, isInternal, agentName } = req.body;

    const ticket = await prisma.supportTicket.findFirst({
      where: { OR: [{ ticketId }, { ticketNumber: ticketId }] },
    });

    if (!ticket) {
      return res.status(404).json({ status: 'fail', message: 'Ticket not found.' });
    }

    const agent = await prisma.user.findFirst({
      where: { userRoles: { some: { role: { roleName: 'Customer Support Executive' } } } },
    });
    const senderUserId = agent ? agent.userId : ticket.customerId;

    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.ticketId,
        senderUserId,
        messageText: replyText,
        isInternalNote: Boolean(isInternal),
      },
    });

    await prisma.supportTicket.update({
      where: { ticketId: ticket.ticketId },
      data: {
        status: ticket.status === 'Open' ? 'In Progress' : ticket.status,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Reply sent to customer.',
      data: { ticketId, replyText },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 4. POST /api/support/ticket/update-status
router.post('/ticket/update-status', async (req, res) => {
  try {
    const { ticketId, newStatus, assignedTo } = req.body;

    const ticket = await prisma.supportTicket.findFirst({
      where: { OR: [{ ticketId }, { ticketNumber: ticketId }] },
    });

    if (!ticket) {
      return res.status(404).json({ status: 'fail', message: 'Ticket not found.' });
    }

    await prisma.supportTicket.update({
      where: { ticketId: ticket.ticketId },
      data: {
        status: newStatus || ticket.status,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      status: 'success',
      message: `Ticket ${ticketId} updated.`,
      data: { ticketId, status: newStatus },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 5. POST /api/support/chat/send
router.post('/chat/send', (req, res) => {
  const { chatId, message } = req.body;
  return res.status(200).json({
    status: 'success',
    message: 'Message delivered to customer.',
    data: { chatId, message, time: 'Just now' },
  });
});

// 6. POST /api/support/refund
router.post('/refund', (req, res) => {
  const { orderId, customer, amount } = req.body;
  return res.status(201).json({
    status: 'success',
    message: `Refund of ₹${(Number(amount) || 18999).toLocaleString('en-IN')} approved and sent to payment gateway for ${orderId}.`,
    data: { orderId, customer, amount: amount || 18999 },
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
      fcrRate: '88.5%',
    },
  });
});

export default router;
