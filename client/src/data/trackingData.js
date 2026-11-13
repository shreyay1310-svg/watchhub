// Centralized WatchHub Parcel Tracking Database & State Engine
// Matches the official WatchHub Parcel Tracking Dashboard UI reference

export const TRACKING_STAGES = [
  { id: 1, key: 'placed', label: 'Order Placed', defaultDesc: 'Your order has been received and confirmed.' },
  { id: 2, key: 'payment', label: 'Payment Confirmed', defaultDesc: 'Payment has been successfully processed.' },
  { id: 3, key: 'packed', label: 'Order Packed', defaultDesc: 'Your watch has been packed securely in WatchHub luxury packaging.' },
  { id: 4, key: 'shipped', label: 'Shipped', defaultDesc: 'Order has been handed over to courier partner.' },
  { id: 5, key: 'in_transit', label: 'In Transit', defaultDesc: 'Your parcel is in transit to the destination city.' },
  { id: 6, key: 'hub_arrived', label: 'Arrived at Destination Hub', defaultDesc: 'Parcel has arrived at the local courier delivery hub.' },
  { id: 7, key: 'out_delivery', label: 'Out for Delivery', defaultDesc: 'Courier executive is on the way to your shipping address.' },
  { id: 8, key: 'delivered', label: 'Delivered', defaultDesc: 'Shipment delivered safely with OTP verification.' },
];

export const MOCK_ORDERS = [
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
    courierTrackingUrl: 'https://www.delhivery.com/track/package/DLV7894563210',
    expectedDelivery: '16 Nov 2026',
    deliveryTimeWindow: 'Estimated between 10:00 AM – 8:00 PM',
    currentLocation: 'Gurugram Hub, Haryana',
    lastUpdated: '15 Nov 2026, 11:20 AM',
    mapCoords: { lat: 28.4595, lng: 77.0266, name: 'Gurugram Hub' },
    activeStageId: 5, // 1 to 8 (5 = In Transit)
    timeline: [
      {
        stageId: 1,
        title: 'Order Placed',
        time: '13 Nov 2026, 10:30 AM',
        location: 'New Delhi HQ',
        description: 'Your order has been received and confirmed.',
        completed: true,
      },
      {
        stageId: 2,
        title: 'Payment Confirmed',
        time: '13 Nov 2026, 10:32 AM',
        location: 'Razorpay Secure Gateway',
        description: 'Payment has been successfully processed.',
        completed: true,
      },
      {
        stageId: 3,
        title: 'Order Packed',
        time: '13 Nov 2026, 02:15 PM',
        location: 'Central Vault, New Delhi',
        description: 'Your watch has been packed securely in WatchHub luxury packaging with tamper-evident seal.',
        completed: true,
      },
      {
        stageId: 4,
        title: 'Shipped',
        time: '14 Nov 2026, 08:45 AM',
        location: 'Delhi Sorting Facility',
        description: 'Order has been handed over to Delhivery.',
        completed: true,
      },
      {
        stageId: 5,
        title: 'In Transit',
        time: '15 Nov 2026, 11:20 AM',
        location: 'Gurugram Hub, Haryana',
        description: 'Your parcel is in transit to the destination city (Current location: Gurugram Hub).',
        completed: false,
        active: true,
      },
      {
        stageId: 6,
        title: 'Arrived at Destination Hub',
        time: 'Expected 16 Nov 2026, 07:00 AM',
        location: 'Local Sorting Center',
        description: 'Shipment will arrive at destination city sorting facility.',
        completed: false,
      },
      {
        stageId: 7,
        title: 'Out for Delivery',
        time: 'Expected 16 Nov 2026, 10:00 AM',
        location: 'Your Local Area',
        description: 'Designated courier delivery executive will attempt delivery with OTP.',
        completed: false,
      },
      {
        stageId: 8,
        title: 'Delivered',
        time: 'Expected 16 Nov 2026, By 08:00 PM',
        location: 'Doorstep Delivery',
        description: 'Direct handover with 100% authenticity inspection & warranty card.',
        completed: false,
      },
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
    courierTrackingUrl: 'https://www.bluedart.com',
    expectedDelivery: 'Today, 13 Nov 2026',
    deliveryTimeWindow: 'Estimated between 11:00 AM – 3:00 PM',
    currentLocation: 'Lucknow Delivery Hub, UP',
    lastUpdated: '13 Nov 2026, 09:30 AM',
    mapCoords: { lat: 26.8467, lng: 80.9462, name: 'Lucknow Hub' },
    activeStageId: 7, // Out for Delivery
    timeline: [
      { stageId: 1, title: 'Order Placed', time: '11 Nov 2026, 04:15 PM', description: 'Your order has been confirmed.', completed: true },
      { stageId: 2, title: 'Payment Confirmed', time: '11 Nov 2026, 04:17 PM', description: 'Prepaid payment verified.', completed: true },
      { stageId: 3, title: 'Order Packed', time: '12 Nov 2026, 10:00 AM', description: 'Packed in wooden collector case.', completed: true },
      { stageId: 4, title: 'Shipped', time: '12 Nov 2026, 02:30 PM', description: 'Dispatched via BlueDart Apex Air.', completed: true },
      { stageId: 5, title: 'In Transit', time: '12 Nov 2026, 09:40 PM', description: 'Air cargo landed at destination airport.', completed: true },
      { stageId: 6, title: 'Arrived at Destination Hub', time: '13 Nov 2026, 06:15 AM', description: 'Scanned at Lucknow delivery branch.', completed: true },
      { stageId: 7, title: 'Out for Delivery', time: '13 Nov 2026, 09:30 AM', description: 'Executive Rajesh Kumar (+91 94150 12345) is out for delivery with OTP verification.', completed: false, active: true },
      { stageId: 8, title: 'Delivered', time: 'Expected Today by 3:00 PM', description: 'Delivery pending customer verification.', completed: false },
    ],
  },
  {
    orderId: 'WH12547',
    awbNumber: 'ECOM4567891230',
    registeredEmail: 'rahul@example.com',
    registeredPhone: '+91 97234 56789',
    customerName: 'Rahul Verma',
    product: {
      name: 'Rolex Cosmograph Daytona Gold',
      category: 'Luxury',
      brand: 'Rolex',
      quantity: 1,
      price: 21999,
      formattedPrice: '₹21,999',
      image: '/images/products/featured_rolex_daytona.jpg',
    },
    orderDate: '08 Nov 2026, 02:40 PM',
    paymentStatus: 'Paid',
    courierPartner: 'Delhivery',
    courierTrackingUrl: 'https://www.delhivery.com',
    expectedDelivery: '11 Nov 2026',
    deliveryTimeWindow: 'Delivered at 01:25 PM',
    currentLocation: 'Delivered (Kanpur, UP)',
    lastUpdated: '11 Nov 2026, 01:25 PM',
    mapCoords: { lat: 26.4499, lng: 80.3319, name: 'Delivered - Kanpur' },
    activeStageId: 8, // Delivered
    timeline: [
      { stageId: 1, title: 'Order Placed', time: '08 Nov 2026, 02:40 PM', description: 'Order confirmed successfully.', completed: true },
      { stageId: 2, title: 'Payment Confirmed', time: '08 Nov 2026, 02:42 PM', description: 'UPI transaction completed.', completed: true },
      { stageId: 3, title: 'Order Packed', time: '09 Nov 2026, 11:15 AM', description: 'Packed with dual tamper seals.', completed: true },
      { stageId: 4, title: 'Shipped', time: '09 Nov 2026, 05:00 PM', description: 'Dispatched from New Delhi hub.', completed: true },
      { stageId: 5, title: 'In Transit', time: '10 Nov 2026, 08:30 AM', description: 'Transit between northern hubs.', completed: true },
      { stageId: 6, title: 'Arrived at Destination Hub', time: '10 Nov 2026, 08:00 PM', description: 'Received at Kanpur South facility.', completed: true },
      { stageId: 7, title: 'Out for Delivery', time: '11 Nov 2026, 09:10 AM', description: 'Courier agent departed for delivery.', completed: true },
      { stageId: 8, title: 'Delivered', time: '11 Nov 2026, 01:25 PM', description: 'Package handed over safely. Signed by recipient.', completed: true, active: true },
    ],
  },
];

// Helper to look up an order by Order ID, AWB, or partial string
export const findTrackingOrder = (query) => {
  if (!query) return MOCK_ORDERS[0];
  const cleaned = query.trim().toUpperCase().replace('#', '');
  
  const found = MOCK_ORDERS.find(
    (order) =>
      order.orderId.toUpperCase() === cleaned ||
      order.awbNumber.toUpperCase() === cleaned ||
      order.orderId.toUpperCase().includes(cleaned) ||
      order.awbNumber.toUpperCase().includes(cleaned)
  );

  if (found) return found;

  // Dynamic Generator for arbitrary Order ID / AWB lookup
  const isAwb = cleaned.length >= 10 && !cleaned.startsWith('WH');
  const genOrderId = isAwb ? `WH2026${cleaned.slice(-4)}` : (cleaned.startsWith('WH') ? cleaned : `WH-${cleaned}`);
  const genAwb = isAwb ? cleaned : `DLV${Math.abs(cleaned.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1000000000))}`;

  return {
    orderId: genOrderId,
    awbNumber: genAwb,
    registeredEmail: 'customer@watchhub.com',
    registeredPhone: '+91 98765 43210',
    customerName: 'Valued WatchHub Customer',
    product: {
      name: 'Rolex Submariner Date 41mm',
      category: 'Luxury Timepiece',
      brand: 'Rolex',
      quantity: 1,
      price: 18999,
      formattedPrice: '₹18,999',
      image: '/images/products/featured_rolex_submariner.jpg',
    },
    orderDate: '13 Nov 2026, 10:30 AM',
    paymentStatus: 'Paid',
    courierPartner: 'Delhivery',
    courierTrackingUrl: `https://www.delhivery.com/track/package/${genAwb}`,
    expectedDelivery: '16 Nov 2026',
    deliveryTimeWindow: 'Estimated between 10:00 AM – 8:00 PM',
    currentLocation: 'Gurugram Hub, Haryana',
    lastUpdated: '15 Nov 2026, 11:20 AM',
    mapCoords: { lat: 28.4595, lng: 77.0266, name: 'Gurugram Hub' },
    activeStageId: 5,
    timeline: MOCK_ORDERS[0].timeline,
  };
};
