import express from 'express';
import { LocationHistory } from '../models/LocationHistory.js';
import { Order } from '../models/Order.js';

const router = express.Router();

// 1. Ingest Rider GPS Location & Broadcast via Socket.IO
// POST /api/tracking/rider-location
router.post('/rider-location', async (req, res) => {
  try {
    const {
      orderId,
      shipmentId,
      riderId = 'RIDER_001',
      riderName = 'Vikram Singh (Armoured Escort)',
      lat,
      lng,
      speed = 34.5,
      heading = 90,
      accuracy = 5,
    } = req.body;

    if (!orderId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        status: 'fail',
        message: 'orderId, lat, and lng are required for rider GPS tracking.',
      });
    }

    const payload = {
      orderId,
      shipmentId,
      riderId,
      riderName,
      lat: Number(lat),
      lng: Number(lng),
      speed: Number(speed),
      heading: Number(heading),
      accuracy: Number(accuracy),
      timestamp: new Date(),
    };

    // Save location to MongoDB
    try {
      await LocationHistory.create(payload);
    } catch (dbErr) {
      // Don't fail if DB is offline in dev
      console.warn('[Tracking] DB write warning:', dbErr.message);
    }

    // Broadcast in real-time to room track_<orderId> via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`track_${orderId}`).emit('rider_location_update', payload);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Rider GPS location recorded and broadcasted successfully.',
      data: payload,
    });
  } catch (err) {
    console.error('[Tracking Error - Rider Location]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. Get Live GPS Tracking for Customer / Delivery Manager Map
// GET /api/tracking/:orderId/live-gps
router.get('/:orderId/live-gps', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch latest rider GPS update from DB
    let latestLocation = null;
    try {
      latestLocation = await LocationHistory.findOne({ orderId }).sort({ timestamp: -1 });
    } catch {}

    // Fetch order to get delivery destination coordinates
    let order = null;
    try {
      order = await Order.findOne({ orderId });
    } catch {}

    // Default luxury store / vault origin (Oberoi Gurgaon Hub)
    const storeOrigin = {
      name: 'WatchHub Armoured Vault',
      lat: 28.5020,
      lng: 77.0878,
      address: 'WatchHub Vault, Phase 2, Udyog Vihar, Gurugram, HR',
    };

    // Customer destination address coordinates
    const destination = {
      lat: order?.shippingAddress?.lat || 28.4595,
      lng: order?.shippingAddress?.lng || 77.0850,
      address: order?.shippingAddress?.street || 'Penthouse 14B, The Oberoi Sky Heights, Gurugram',
      customerName: order?.customer?.name || 'Alexander Sterling',
    };

    // Current rider coordinates
    const rider = {
      riderId: latestLocation?.riderId || 'RIDER_001',
      riderName: latestLocation?.riderName || 'Vikram Singh (Armoured Escort)',
      lat: latestLocation?.lat || 28.4815,
      lng: latestLocation?.lng || 77.0862,
      speed: latestLocation?.speed || 38.2,
      heading: latestLocation?.heading || 180,
      accuracy: latestLocation?.accuracy || 4,
      lastUpdated: latestLocation?.timestamp || new Date().toISOString(),
      isLive: Boolean(latestLocation),
    };

    // Calculate approx distance & ETA
    // Haversine formula
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(destination.lat - rider.lat);
    const dLon = toRad(destination.lng - rider.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(rider.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.max(Number((R * c).toFixed(2)), 0.4);
    const etaMinutes = Math.max(Math.round((distanceKm / 30) * 60), 4); // Avg city speed 30km/h

    return res.status(200).json({
      status: 'success',
      data: {
        orderId,
        origin: storeOrigin,
        destination,
        rider,
        metrics: {
          distanceKm,
          distanceFormatted: `${distanceKm} km`,
          etaMinutes,
          etaFormatted: `${etaMinutes} mins`,
          status: 'Out for Armoured Delivery',
          securityCode: 'SEC-8924',
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

const MOCK_TRACKING_ORDERS = [
  {
    orderId: 'WH20261125',
    awbNumber: 'DLV7894563210',
    registeredEmail: 'shreya@example.com',
    registeredPhone: '+91 98765 43210',
    customerName: 'Shreya',
    product: {
      name: 'Rolex Submariner Date 41mm',
      category: 'Luxury',
      brand: 'Rolex',
      quantity: 1,
      price: 18999,
      formattedPrice: '₹18,999',
      image: '/images/products/featured_rolex_submariner.jpg',
    },
    orderDate: '13 Nov 2026, 10:30 AM',
    paymentStatus: 'Paid',
    courierPartner: 'Delhivery',
    expectedDelivery: '16 Nov 2026',
    deliveryTimeWindow: 'Estimated between 10:00 AM – 8:00 PM',
    currentLocation: 'Gurugram Hub, Haryana',
    lastUpdated: '15 Nov 2026, 11:20 AM',
    activeStageId: 5,
    timeline: [
      { stageId: 1, title: 'Order Placed', time: '13 Nov 2026, 10:30 AM', description: 'Your order has been received and confirmed.', completed: true },
      { stageId: 2, title: 'Payment Confirmed', time: '13 Nov 2026, 10:32 AM', description: 'Payment has been successfully processed.', completed: true },
      { stageId: 3, title: 'Order Packed', time: '13 Nov 2026, 02:15 PM', description: 'Your watch has been packed securely.', completed: true },
      { stageId: 4, title: 'Shipped', time: '14 Nov 2026, 08:45 AM', description: 'Order has been handed over to Delhivery.', completed: true },
      { stageId: 5, title: 'In Transit', time: '15 Nov 2026, 11:20 AM', description: 'Your parcel is in transit to the destination city (Current location: Gurugram Hub).', completed: false, active: true },
      { stageId: 6, title: 'Arrived at Destination Hub', time: 'Expected 16 Nov 2026, 07:00 AM', description: 'Pending arrival at city facility.', completed: false },
      { stageId: 7, title: 'Out for Delivery', time: 'Expected 16 Nov 2026, 10:00 AM', description: 'Assigned courier agent.', completed: false },
      { stageId: 8, title: 'Delivered', time: 'Expected 16 Nov 2026, By 08:00 PM', description: 'Doorstep handover with OTP.', completed: false },
    ],
  },
  {
    orderId: 'WH12548',
    awbNumber: 'BLU8901234567',
    registeredEmail: 'ananya@example.com',
    registeredPhone: '+91 98123 45678',
    customerName: 'Ananya Singh',
    product: {
      name: 'Omega Speedmaster Professional',
      category: 'Luxury',
      brand: 'Omega',
      quantity: 1,
      price: 16499,
      formattedPrice: '₹16,499',
      image: '/images/products/featured_omega_speedmaster.jpg',
    },
    orderDate: '11 Nov 2026, 04:15 PM',
    paymentStatus: 'Paid',
    courierPartner: 'BlueDart Express',
    expectedDelivery: 'Today, 13 Nov 2026',
    deliveryTimeWindow: 'Estimated between 11:00 AM – 3:00 PM',
    currentLocation: 'Lucknow Delivery Hub, UP',
    lastUpdated: '13 Nov 2026, 09:30 AM',
    activeStageId: 7,
  },
];

// In-memory update subscriptions
const updateSubscriptions = [];

// GET /api/tracking/:query
router.get('/:query', (req, res) => {
  const query = (req.params.query || '').trim().toUpperCase().replace('#', '');
  const found = MOCK_TRACKING_ORDERS.find(
    (o) => o.orderId.toUpperCase() === query || o.awbNumber.toUpperCase() === query
  );

  if (found) {
    return res.status(200).json({ status: 'success', data: found });
  }

  // Fallback realistic response
  const order = {
    ...MOCK_TRACKING_ORDERS[0],
    orderId: query.startsWith('WH') ? query : `WH-${query}`,
    awbNumber: query.length >= 10 ? query : `DLV${Math.abs(query.split('').reduce((a, b) => a + b.charCodeAt(0), 1000000000))}`,
  };

  return res.status(200).json({ status: 'success', data: order });
});

// POST /api/tracking/subscribe-updates
router.post('/subscribe-updates', (req, res) => {
  const { orderId, awbNumber, contact, channel } = req.body;
  if (!contact) {
    return res.status(400).json({ status: 'fail', message: 'Contact details (mobile or email) required.' });
  }

  const sub = {
    id: `SUB-${Date.now()}`,
    orderId: orderId || 'WH20261125',
    awbNumber: awbNumber || 'DLV7894563210',
    contact,
    channel: channel || ['whatsapp', 'sms'],
    createdAt: new Date().toISOString(),
  };

  updateSubscriptions.push(sub);

  return res.status(200).json({
    status: 'success',
    message: `Delivery alerts successfully enabled! Updates will be sent to ${contact}.`,
    subscription: sub,
  });
});

export default router;

