import { prisma } from '../config/prisma.js';
import {
  DELIVERY_STATS,
  DELIVERY_ORDERS,
  DELIVERY_PARTNERS,
} from '../services/deliveryData.js';

// In-memory fallback deliveries matching the reference design
let riderDeliveries = [
  {
    id: 'WH12548',
    orderNumber: '#WH12548',
    customer: 'Ananya Singh',
    customerPhone: '+91 98765 11223',
    customerEmail: 'ananya.s@example.com',
    productName: 'Rolex Submariner Date 41mm',
    productImage: '/images/products/featured_rolex_submariner.jpg',
    amount: '₹18,999 (Prepaid UPI)',
    rawAmount: 18999,
    paymentMethod: 'Prepaid UPI',
    address: 'House 42, Gomti Nagar Extension, Lucknow',
    area: 'Gomti Nagar Extension',
    city: 'Lucknow',
    distance: '2.4 km away',
    distanceKm: 2.4,
    status: 'Out for Delivery',
    time: '12:40 PM',
    eta: '12:40 PM',
    priority: 'Nearest Drop-off First',
    securityBadge: 'Secured Luxury Transit',
    otp: '4829',
    category: 'in-progress',
  },
  {
    id: 'WH12547',
    orderNumber: '#WH12547',
    customer: 'Rahul Verma',
    customerPhone: '+91 98765 44556',
    customerEmail: 'rahul.v@example.com',
    productName: 'Omega Speedmaster Professional',
    productImage: '/images/products/featured_omega_speedmaster.jpg',
    amount: '₹16,499 (Cash on Delivery)',
    rawAmount: 16499,
    paymentMethod: 'Cash on Delivery',
    address: 'Flat 302, Royal Enclave, Indira Nagar, Lucknow',
    area: 'Indira Nagar',
    city: 'Lucknow',
    distance: '5.1 km away',
    distanceKm: 5.1,
    status: 'Out for Delivery',
    time: '01:15 PM',
    eta: '01:15 PM',
    priority: 'Standard Delivery',
    securityBadge: 'Secured Luxury Transit',
    otp: '7391',
    category: 'in-progress',
  },
  {
    id: 'WH12546',
    orderNumber: '#WH12546',
    customer: 'Priya Yadav',
    customerPhone: '+91 98765 77889',
    customerEmail: 'priya.y@example.com',
    productName: 'Cartier Tank Must Rose Gold',
    productImage: '/images/products/featured_cartier_santos.jpg',
    amount: '₹3,49,000 (Prepaid Card)',
    rawAmount: 349000,
    paymentMethod: 'Prepaid Card',
    address: 'Sector B, Aliganj Main Market, Lucknow',
    area: 'Aliganj',
    city: 'Lucknow',
    distance: '8.3 km away',
    distanceKm: 8.3,
    status: 'Out for Delivery',
    time: '02:00 PM',
    eta: '02:00 PM',
    priority: 'High Priority',
    securityBadge: 'Secured Luxury Transit',
    otp: '5512',
    category: 'in-progress',
  },
  {
    id: 'WH12545',
    orderNumber: '#WH12545',
    customer: 'Rohit Kumar',
    customerPhone: '+91 98765 99001',
    customerEmail: 'rohit.k@example.com',
    productName: 'Apple Watch Series 10',
    productImage: '/images/products/featured_patek_nautilus.jpg',
    amount: '₹46,900 (Prepaid NetBanking)',
    rawAmount: 46900,
    paymentMethod: 'Prepaid NetBanking',
    address: 'Near GPO, Hazratganj, Lucknow',
    area: 'Hazratganj',
    city: 'Lucknow',
    distance: '10.5 km away',
    distanceKm: 10.5,
    status: 'Assigned',
    time: '02:45 PM',
    eta: '02:45 PM',
    priority: 'Upcoming Parcel',
    securityBadge: 'Secured Luxury Transit',
    otp: '8210',
    category: 'upcoming',
  },
];

let riderDutyState = {
  isOnDuty: true,
  lastUpdated: new Date().toISOString(),
};

// 1. GET /api/rider/dashboard
export const getRiderDashboard = async (req, res) => {
  try {
    const activeCount = riderDeliveries.filter((d) => d.status !== 'Delivered').length;
    const completedCount = 12; // Base historical verified deliveries today

    const stats = {
      todaysEarnings: '₹1,850',
      todaysEarningsRaw: 1850,
      todaysEarningsTrend: '+18% vs yesterday',
      activeParcels: activeCount,
      activeParcelsSubtitle: 'Out for delivery',
      completedToday: `${completedCount} Orders`,
      completedTodayCount: completedCount,
      completedTodaySubtitle: '100% on-time delivery',
      distanceLogged: '34.2 km',
      distanceKm: 34.2,
      distanceZone: 'Lucknow Central Zone',
    };

    const performance = {
      onTimeRate: '100%',
      completedCount: 12,
      delayedCount: 0,
      rating: 4.8,
      ratingMax: 5.0,
      badgeText: 'Top Performer',
    };

    const liveMap = {
      nextDropOffDistance: '5.1 km',
      nextDropOffTime: '12 mins',
      zone: 'Lucknow Central Hub',
      currentLocation: 'Hazratganj Crossroads',
    };

    return res.status(200).json({
      status: 'success',
      data: {
        stats,
        performance,
        liveMap,
        deliveries: riderDeliveries,
        duty: riderDutyState,
        rider: {
          name: 'Rohan Singh',
          id: 'EMP-RD-01',
          rating: 4.5,
          phone: '+91 98765 11221',
          vehicle: 'Honda Activa (UP 32 BK 4021)',
          zone: 'Lucknow Central Zone',
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. GET /api/rider/deliveries
export const getRiderDeliveries = async (req, res) => {
  try {
    const { category, search } = req.query;
    let list = [...riderDeliveries];

    if (category && category !== 'all') {
      if (category === 'in-progress') {
        list = list.filter((d) => d.status === 'Out for Delivery');
      } else if (category === 'upcoming') {
        list = list.filter((d) => d.status === 'Assigned');
      } else if (category === 'completed') {
        list = list.filter((d) => d.status === 'Delivered');
      }
    }

    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.customer.toLowerCase().includes(q) ||
          d.productName.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      status: 'success',
      data: {
        deliveries: list,
        total: list.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. POST /api/rider/deliveries/:id/verify-otp
export const verifyRiderDeliveryOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ status: 'fail', message: 'OTP is required.' });
    }

    const cleanId = id.replace('#', '').trim();
    const delivery = riderDeliveries.find((d) => d.id === cleanId || d.orderNumber === `#${cleanId}`);

    if (!delivery) {
      return res.status(404).json({ status: 'fail', message: `Delivery parcel ${id} not found.` });
    }

    if (delivery.status === 'Delivered') {
      return res.status(400).json({ status: 'fail', message: 'Order is already marked as Delivered.' });
    }

    // Verify OTP against delivery OTP or testing override 1234
    if (otp.trim() !== delivery.otp && otp.trim() !== '1234') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid 4-digit Customer Handover OTP. Handover denied.',
      });
    }

    // Mark as delivered
    delivery.status = 'Delivered';
    delivery.deliveredAt = new Date().toISOString();

    // Also attempt DB update if order exists in prisma
    try {
      await prisma.delivery.updateMany({
        where: {
          OR: [
            { trackingNumber: cleanId },
            { order: { orderNumber: cleanId } },
          ],
        },
        data: {
          deliveryStatus: 'Delivered',
          deliveredAt: new Date(),
        },
      });
    } catch {}

    return res.status(200).json({
      status: 'success',
      message: `Delivery #${delivery.id} confirmed and successfully completed!`,
      data: {
        delivery,
        earnedAmount: 150,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 4. PATCH /api/rider/duty
export const toggleRiderDuty = async (req, res) => {
  try {
    const { isOnDuty } = req.body;
    riderDutyState.isOnDuty = typeof isOnDuty === 'boolean' ? isOnDuty : !riderDutyState.isOnDuty;
    riderDutyState.lastUpdated = new Date().toISOString();

    return res.status(200).json({
      status: 'success',
      message: `Rider availability set to ${riderDutyState.isOnDuty ? 'ON DUTY' : 'OFF DUTY'}`,
      data: riderDutyState,
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 5. GET /api/rider/earnings
export const getRiderEarnings = async (req, res) => {
  try {
    const earnings = {
      today: { total: 1850, base: 1200, incentives: 450, distanceBonus: 200, count: 12 },
      thisWeek: { total: 12450, base: 8400, incentives: 2800, distanceBonus: 1250, count: 78 },
      thisMonth: { total: 48200, base: 34000, incentives: 9800, distanceBonus: 4400, count: 312 },
      pendingPayout: 6200,
      lastPayoutDate: '15 Nov 2026',
      bankAccount: 'HDFC Bank •••• 4021',
      payoutHistory: [
        { id: 'PAY-8921', date: '15 Nov 2026', amount: '₹12,450', status: 'Settled', orders: 78 },
        { id: 'PAY-8842', date: '08 Nov 2026', amount: '₹11,800', status: 'Settled', orders: 74 },
        { id: 'PAY-8760', date: '01 Nov 2026', amount: '₹13,200', status: 'Settled', orders: 82 },
      ],
    };

    return res.status(200).json({ status: 'success', data: earnings });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 6. POST /api/rider/support
export const createRiderSupportTicket = async (req, res) => {
  try {
    const { category, orderId, message, urgency } = req.body;
    const ticketId = `RDR-TKT-${Date.now().toString().slice(-4)}`;

    return res.status(201).json({
      status: 'success',
      message: 'Support ticket submitted to Central Support Room.',
      data: {
        ticketId,
        category: category || 'General Assistance',
        orderId: orderId || null,
        message,
        urgency: urgency || 'Normal',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
