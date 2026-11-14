import express from 'express';

const router = express.Router();

// Mock Initial Delivery Dashboard Stats
let DELIVERY_STATS = {
  totalShipments: 1248,
  totalShipmentsTrend: '+12%',
  outForDelivery: 312,
  outForDeliveryTrend: '+18%',
  delivered: 892,
  deliveredTrend: '+14%',
  deliveryAttempts: 36,
  deliveryAttemptsTrend: '-20%',
  returnsPickups: 8,
  returnsPickupsTrend: '-11%',
};

// Shipment Status Breakdown (matches reference Donut chart)
let SHIPMENT_STATUS_BREAKDOWN = [
  { name: 'Delivered', count: 892, percentage: 71.5, color: '#10B981' },
  { name: 'Out for Delivery', count: 312, percentage: 25.0, color: '#3B82F6' },
  { name: 'In Transit', count: 34, percentage: 2.7, color: '#F59E0B' },
  { name: 'Failed / Attempted', count: 10, percentage: 0.8, color: '#EF4444' },
];

// Delivery Partners / Riders
let DELIVERY_PARTNERS = [
  {
    id: 'rd_001',
    name: 'Rohan Singh',
    empId: 'EMP-RD-01',
    phone: '+91 98765 11221',
    area: 'Gomti Nagar, Lucknow',
    city: 'Lucknow',
    status: 'On Delivery', // 'Available', 'On Delivery', 'Off Duty'
    activeOrders: 28,
    completedToday: 14,
    failedAttempts: 1,
    successRate: '96%',
    vehicle: 'Honda Activa (UP 32 BK 4021)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedDate: '12 Jan 2025',
    currentLocation: {
      lat: 26.8505,
      lng: 80.9850,
      areaName: 'Lohia Hospital Xing, Gomti Nagar',
      lastPing: '2 mins ago',
      verified: true,
    },
  },
  {
    id: 'rd_002',
    name: 'Amit Kumar',
    empId: 'EMP-RD-02',
    phone: '+91 98765 22332',
    area: 'Indira Nagar, Lucknow',
    city: 'Lucknow',
    status: 'On Delivery',
    activeOrders: 24,
    completedToday: 12,
    failedAttempts: 1,
    successRate: '95%',
    vehicle: 'TVS Jupiter (UP 32 DX 8812)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    joinedDate: '05 Mar 2025',
    currentLocation: {
      lat: 26.8780,
      lng: 80.9950,
      areaName: 'Munshi Pulia, Indira Nagar',
      lastPing: '4 mins ago',
      verified: true,
    },
  },
  {
    id: 'rd_003',
    name: 'Neha Sharma',
    empId: 'EMP-RD-03',
    phone: '+91 98765 33443',
    area: 'Aliganj, Lucknow',
    city: 'Lucknow',
    status: 'On Delivery',
    activeOrders: 20,
    completedToday: 15,
    failedAttempts: 0,
    successRate: '98%',
    vehicle: 'Ather 450X EV (UP 32 EV 1092)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    joinedDate: '20 Jul 2025',
    currentLocation: {
      lat: 26.8920,
      lng: 80.9450,
      areaName: 'Kapoorthala, Aliganj',
      lastPing: '1 min ago',
      verified: true,
    },
  },
  {
    id: 'rd_004',
    name: 'Vikas Patel',
    empId: 'EMP-RD-04',
    phone: '+91 98765 44554',
    area: 'Hazratganj, Lucknow',
    city: 'Lucknow',
    status: 'Available',
    activeOrders: 18,
    completedToday: 9,
    failedAttempts: 1,
    successRate: '94%',
    vehicle: 'Bajaj Pulsar (UP 32 GH 3345)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    joinedDate: '10 Nov 2025',
    currentLocation: {
      lat: 26.8480,
      lng: 80.9460,
      areaName: 'Central Logistics Hub, Hazratganj',
      lastPing: '5 mins ago',
      verified: true,
    },
  },
  {
    id: 'rd_005',
    name: 'Arjun Mishra',
    empId: 'EMP-RD-05',
    phone: '+91 98765 55665',
    area: 'Jankipuram, Lucknow',
    city: 'Lucknow',
    status: 'Available',
    activeOrders: 15,
    completedToday: 8,
    failedAttempts: 1,
    successRate: '93%',
    vehicle: 'Hero Splendor (UP 32 MN 7712)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    joinedDate: '15 Jan 2026',
    currentLocation: {
      lat: 26.9150,
      lng: 80.9420,
      areaName: 'Engineering College Xing, Jankipuram',
      lastPing: '8 mins ago',
      verified: true,
    },
  },
  {
    id: 'rd_006',
    name: 'Sangeeta Rao',
    empId: 'EMP-RD-06',
    phone: '+91 98765 66776',
    area: 'Kanpur Central, Kanpur',
    city: 'Kanpur',
    status: 'Off Duty',
    activeOrders: 0,
    completedToday: 0,
    failedAttempts: 0,
    successRate: '97%',
    vehicle: 'Honda Grazia (UP 78 CD 5521)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    joinedDate: '01 Feb 2026',
    currentLocation: {
      lat: 26.4499,
      lng: 80.3319,
      areaName: 'Kanpur Hub (Off-Duty)',
      lastPing: '1 hr ago',
      verified: true,
    },
  },
];

// Delivery Orders Database (Matching the reference UI exactly)
let DELIVERY_ORDERS = [
  {
    id: 'dlv_001',
    orderId: '#WH12548',
    customer: 'Ananya Singh',
    customerPhone: '+91 98123 45678',
    customerEmail: 'ananya.s@example.com',
    productName: 'Rolex Submariner Date 41mm',
    productShortName: 'Rolex Submariner',
    productImage: '/images/products/featured_rolex_submariner.jpg',
    address: 'Flat 402, Royal Palms, Gomti Nagar',
    area: 'Gomti Nagar, Lucknow',
    city: 'Lucknow',
    pincode: '226010',
    riderId: 'rd_001',
    riderName: 'Rohan Singh',
    riderPhone: '+91 98765 11221',
    riderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'BlueDart Express',
    awbNumber: 'BLU8901234567',
    status: 'Out for Delivery', // 'Assigned', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed', 'Returned'
    eta: '12:40 PM',
    expectedDeliveryDate: 'Today, 14 Nov 2026',
    paymentType: 'Prepaid',
    orderAmount: 18999,
    formattedAmount: '₹18,999',
    priority: 'Urgent Express',
    timeSlot: '11:00 AM – 02:00 PM',
    orderDate: '13 Nov 2026, 04:30 PM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '13 Nov 2026, 04:30 PM', location: 'WatchHub Vault, Gurugram', completed: true },
      { step: 2, title: 'Packed', time: '13 Nov 2026, 06:15 PM', location: 'Main Fulfillment Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '13 Nov 2026, 08:00 PM', location: 'Dispatch Bay A-12', completed: true },
      { step: 4, title: 'Picked Up', time: '14 Nov 2026, 05:30 AM', location: 'Transit Hub, Delhi-NCR', completed: true },
      { step: 5, title: 'In Transit', time: '14 Nov 2026, 08:45 AM', location: 'Highway Express Corridor', completed: true },
      { step: 6, title: 'Reached Destination Hub', time: '14 Nov 2026, 10:15 AM', location: 'Lucknow Central Hub', completed: true },
      { step: 7, title: 'Out for Delivery', time: '14 Nov 2026, 11:30 AM', location: 'Gomti Nagar Route Sector', completed: true, active: true },
      { step: 8, title: 'Delivered', time: 'Expected 12:40 PM', location: 'Doorstep Handover', completed: false },
    ],
  },
  {
    id: 'dlv_002',
    orderId: '#WH12547',
    customer: 'Rahul Verma',
    customerPhone: '+91 98234 56789',
    customerEmail: 'rahul.v@example.com',
    productName: 'Omega Speedmaster Professional',
    productShortName: 'Omega Speedmaster',
    productImage: '/images/products/featured_omega_speedmaster.jpg',
    address: 'B-14, Sector 14, Indira Nagar',
    area: 'Indira Nagar, Lucknow',
    city: 'Lucknow',
    pincode: '226016',
    riderId: 'rd_002',
    riderName: 'Amit Kumar',
    riderPhone: '+91 98765 22332',
    riderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'Delhivery',
    awbNumber: 'DLV7894563211',
    status: 'Out for Delivery',
    eta: '01:10 PM',
    expectedDeliveryDate: 'Today, 14 Nov 2026',
    paymentType: 'Prepaid',
    orderAmount: 16499,
    formattedAmount: '₹16,499',
    priority: 'High',
    timeSlot: '12:00 PM – 03:00 PM',
    orderDate: '13 Nov 2026, 03:10 PM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '13 Nov 2026, 03:10 PM', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: '13 Nov 2026, 05:00 PM', location: 'Main Fulfillment Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '13 Nov 2026, 07:15 PM', location: 'Dispatch Bay B-04', completed: true },
      { step: 4, title: 'Picked Up', time: '14 Nov 2026, 06:00 AM', location: 'Delhi Express Logistics', completed: true },
      { step: 5, title: 'In Transit', time: '14 Nov 2026, 09:00 AM', location: 'Lucknow Express Way', completed: true },
      { step: 6, title: 'Reached Destination Hub', time: '14 Nov 2026, 10:45 AM', location: 'Indira Nagar Hub', completed: true },
      { step: 7, title: 'Out for Delivery', time: '14 Nov 2026, 11:45 AM', location: 'Indira Nagar Route Sector', completed: true, active: true },
      { step: 8, title: 'Delivered', time: 'Expected 01:10 PM', location: 'Doorstep Handover', completed: false },
    ],
  },
  {
    id: 'dlv_003',
    orderId: '#WH12546',
    customer: 'Priya Yadav',
    customerPhone: '+91 98345 67890',
    customerEmail: 'priya.y@example.com',
    productName: 'Cartier Tank Must',
    productShortName: 'Cartier Tank Must',
    productImage: '/images/products/featured_cartier_tank.jpg',
    address: 'C-82, Sector B, Aliganj',
    area: 'Aliganj, Lucknow',
    city: 'Lucknow',
    pincode: '226024',
    riderId: 'rd_003',
    riderName: 'Neha Sharma',
    riderPhone: '+91 98765 33443',
    riderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'DTDC Express',
    awbNumber: 'DTDC98765432',
    status: 'In Transit',
    eta: '02:20 PM',
    expectedDeliveryDate: 'Today, 14 Nov 2026',
    paymentType: 'COD',
    orderAmount: 349000,
    formattedAmount: '₹3,49,000',
    priority: 'Standard',
    timeSlot: '01:00 PM – 04:00 PM',
    orderDate: '13 Nov 2026, 01:25 PM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '13 Nov 2026, 01:25 PM', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: '13 Nov 2026, 03:40 PM', location: 'Fulfillment Vault 1', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '13 Nov 2026, 06:30 PM', location: 'Dispatch Bay C', completed: true },
      { step: 4, title: 'Picked Up', time: '14 Nov 2026, 07:15 AM', location: 'Central Hub', completed: true },
      { step: 5, title: 'In Transit', time: '14 Nov 2026, 11:00 AM', location: 'Ring Road Feeder Transit', completed: true, active: true },
      { step: 6, title: 'Reached Destination Hub', time: 'Expected 01:15 PM', location: 'Aliganj Local Hub', completed: false },
      { step: 7, title: 'Out for Delivery', time: 'Expected 01:45 PM', location: 'Aliganj Area Route', completed: false },
      { step: 8, title: 'Delivered', time: 'Expected 02:20 PM', location: 'Doorstep Handover', completed: false },
    ],
  },
  {
    id: 'dlv_004',
    orderId: '#WH12545',
    customer: 'Rohit Kumar',
    customerPhone: '+91 98456 78901',
    customerEmail: 'rohit.k@example.com',
    productName: 'Smartwatch Pro AMOLED',
    productShortName: 'Smartwatch Pro',
    productImage: '/images/products/featured_apple_watch.jpg',
    address: 'Shop 12, Mayfair Complex, Hazratganj',
    area: 'Hazratganj, Lucknow',
    city: 'Lucknow',
    pincode: '226001',
    riderId: 'rd_004',
    riderName: 'Vikas Patel',
    riderPhone: '+91 98765 44554',
    riderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'Shadowfax',
    awbNumber: 'SFX564738291',
    status: 'Assigned',
    eta: '—',
    expectedDeliveryDate: '15 Nov 2026',
    paymentType: 'Prepaid',
    orderAmount: 46900,
    formattedAmount: '₹46,900',
    priority: 'Standard',
    timeSlot: '10:00 AM – 01:00 PM',
    orderDate: '14 Nov 2026, 09:20 AM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '14 Nov 2026, 09:20 AM', location: 'WatchHub Store', completed: true },
      { step: 2, title: 'Packed', time: '14 Nov 2026, 10:15 AM', location: 'Hub Dispatch Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '14 Nov 2026, 11:30 AM', location: 'Sorting Bay D', completed: true, active: true },
      { step: 4, title: 'Picked Up', time: 'Pending Pickup', location: 'Warehouse Gate 2', completed: false },
      { step: 5, title: 'In Transit', time: 'Scheduled', location: 'Hazratganj Loop', completed: false },
      { step: 6, title: 'Reached Destination Hub', time: 'Scheduled', location: 'Central Sorting Hub', completed: false },
      { step: 7, title: 'Out for Delivery', time: 'Scheduled', location: 'Hazratganj Route', completed: false },
      { step: 8, title: 'Delivered', time: 'Expected 15 Nov 2026', location: 'Customer Location', completed: false },
    ],
  },
  {
    id: 'dlv_005',
    orderId: '#WH12544',
    customer: 'Sneha Patel',
    customerPhone: '+91 98567 89012',
    customerEmail: 'sneha.p@example.com',
    productName: 'Patek Philippe Nautilus 5711',
    productShortName: 'Patek Philippe Nautilus',
    productImage: '/images/products/featured_patek_nautilus.jpg',
    address: 'House 88, Sector 6, Jankipuram',
    area: 'Jankipuram, Lucknow',
    city: 'Lucknow',
    pincode: '226021',
    riderId: 'rd_005',
    riderName: 'Arjun Mishra',
    riderPhone: '+91 98765 55665',
    riderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'BlueDart Express',
    awbNumber: 'BLU998877665',
    status: 'Assigned',
    eta: '—',
    expectedDeliveryDate: '15 Nov 2026',
    paymentType: 'Prepaid',
    orderAmount: 5499000,
    formattedAmount: '₹54,99,000',
    priority: 'Urgent Express',
    timeSlot: '02:00 PM – 05:00 PM',
    orderDate: '14 Nov 2026, 08:45 AM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '14 Nov 2026, 08:45 AM', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: '14 Nov 2026, 10:00 AM', location: 'Armed Security Packaging', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '14 Nov 2026, 11:20 AM', location: 'Vault Bay V-1', completed: true, active: true },
      { step: 4, title: 'Picked Up', time: 'Pending Pickup', location: 'Secure Logistics Gate', completed: false },
      { step: 5, title: 'In Transit', time: 'Scheduled', location: 'Jankipuram Route', completed: false },
      { step: 6, title: 'Reached Destination Hub', time: 'Scheduled', location: 'North Hub Facility', completed: false },
      { step: 7, title: 'Out for Delivery', time: 'Scheduled', location: 'Jankipuram Sector', completed: false },
      { step: 8, title: 'Delivered', time: 'Expected 15 Nov 2026', location: 'Doorstep Handover', completed: false },
    ],
  },
  {
    id: 'dlv_006',
    orderId: '#WH12543',
    customer: 'Vikram Malhotra',
    customerPhone: '+91 98678 90123',
    customerEmail: 'vikram.m@example.com',
    productName: 'Rolex Cosmograph Daytona Gold',
    productShortName: 'Rolex Daytona',
    productImage: '/images/products/featured_rolex_daytona.jpg',
    address: 'Villa 19, Park Road, Mahanagar',
    area: 'Mahanagar, Lucknow',
    city: 'Lucknow',
    pincode: '226006',
    riderId: 'rd_001',
    riderName: 'Rohan Singh',
    riderPhone: '+91 98765 11221',
    riderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'Delhivery',
    awbNumber: 'DLV887766554',
    status: 'Delivered',
    eta: 'Delivered at 11:15 AM',
    expectedDeliveryDate: '14 Nov 2026',
    paymentType: 'Prepaid',
    orderAmount: 21999,
    formattedAmount: '₹21,999',
    priority: 'Urgent Express',
    timeSlot: '10:00 AM – 01:00 PM',
    orderDate: '13 Nov 2026, 01:10 PM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '13 Nov 2026, 01:10 PM', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: '13 Nov 2026, 03:00 PM', location: 'Main Fulfillment Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '13 Nov 2026, 05:00 PM', location: 'Dispatch Bay A', completed: true },
      { step: 4, title: 'Picked Up', time: '14 Nov 2026, 06:15 AM', location: 'Delhi Express Logistics', completed: true },
      { step: 5, title: 'In Transit', time: '14 Nov 2026, 08:30 AM', location: 'Express Corridor', completed: true },
      { step: 6, title: 'Reached Destination Hub', time: '14 Nov 2026, 09:45 AM', location: 'Lucknow Central Hub', completed: true },
      { step: 7, title: 'Out for Delivery', time: '14 Nov 2026, 10:15 AM', location: 'Mahanagar Sector', completed: true },
      { step: 8, title: 'Delivered', time: '14 Nov 2026, 11:15 AM', location: 'Handed to Vikram Malhotra (OTP 7812)', completed: true, active: true },
    ],
  },
  {
    id: 'dlv_007',
    orderId: '#WH12542',
    customer: 'Pooja Sharma',
    customerPhone: '+91 98789 01234',
    customerEmail: 'pooja.s@example.com',
    productName: 'Audemars Piguet Royal Oak',
    productShortName: 'AP Royal Oak',
    productImage: '/images/products/featured_ap_royal_oak.jpg',
    address: 'Tower 4, 1102, Vibhuti Khand',
    area: 'Vibhuti Khand, Lucknow',
    city: 'Lucknow',
    pincode: '226010',
    riderId: 'rd_002',
    riderName: 'Amit Kumar',
    riderPhone: '+91 98765 22332',
    riderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'DTDC Express',
    awbNumber: 'DTDC44332211',
    status: 'Failed',
    eta: 'Attempted 10:30 AM',
    expectedDeliveryDate: '14 Nov 2026',
    paymentType: 'COD',
    orderAmount: 4299000,
    formattedAmount: '₹42,99,000',
    priority: 'High',
    timeSlot: '10:00 AM – 01:00 PM',
    orderDate: '13 Nov 2026, 02:40 PM',
    deliveryAttemptsCount: 1,
    failureReason: 'Customer Unavailable',
    failureRemarks: 'Customer was not at home; phone answered by family requesting evening re-attempt after 6 PM.',
    nextAttemptDate: '14 Nov 2026, 06:00 PM',
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '13 Nov 2026, 02:40 PM', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: '13 Nov 2026, 04:30 PM', location: 'Fulfillment Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '13 Nov 2026, 07:00 PM', location: 'Dispatch Bay B', completed: true },
      { step: 4, title: 'Picked Up', time: '14 Nov 2026, 06:30 AM', location: 'Transit Hub', completed: true },
      { step: 5, title: 'In Transit', time: '14 Nov 2026, 08:45 AM', location: 'Transit Route', completed: true },
      { step: 6, title: 'Reached Destination Hub', time: '14 Nov 2026, 09:30 AM', location: 'Vibhuti Khand Hub', completed: true },
      { step: 7, title: 'Out for Delivery', time: '14 Nov 2026, 10:00 AM', location: 'Vibhuti Khand Route', completed: true },
      { step: 8, title: 'Delivery Attempt Failed', time: '14 Nov 2026, 10:30 AM', location: 'Customer Unavailable (Rescheduled to 6 PM)', completed: false, active: true },
    ],
  },
  {
    id: 'dlv_008',
    orderId: '#WH12541',
    customer: 'Rajesh Gupta',
    customerPhone: '+91 98890 12345',
    customerEmail: 'rajesh.g@example.com',
    productName: 'Omega Seamaster Diver 300M',
    productShortName: 'Omega Seamaster',
    productImage: '/images/products/featured_omega_seamaster.jpg',
    address: '45, Cloth Market, Aminabad',
    area: 'Aminabad, Lucknow',
    city: 'Lucknow',
    pincode: '226018',
    riderId: 'rd_003',
    riderName: 'Neha Sharma',
    riderPhone: '+91 98765 33443',
    riderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'BlueDart Express',
    awbNumber: 'BLU112233445',
    status: 'Delivered',
    eta: 'Delivered at 10:45 AM',
    expectedDeliveryDate: '14 Nov 2026',
    paymentType: 'Prepaid',
    orderAmount: 14999,
    formattedAmount: '₹14,999',
    priority: 'Standard',
    timeSlot: '09:00 AM – 12:00 PM',
    orderDate: '13 Nov 2026, 11:20 AM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '13 Nov 2026, 11:20 AM', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: '13 Nov 2026, 01:15 PM', location: 'Fulfillment Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '13 Nov 2026, 03:40 PM', location: 'Dispatch Bay A', completed: true },
      { step: 4, title: 'Picked Up', time: '14 Nov 2026, 06:00 AM', location: 'Transit Hub', completed: true },
      { step: 5, title: 'In Transit', time: '14 Nov 2026, 08:15 AM', location: 'Express Route', completed: true },
      { step: 6, title: 'Reached Destination Hub', time: '14 Nov 2026, 09:15 AM', location: 'Aminabad Hub', completed: true },
      { step: 7, title: 'Out for Delivery', time: '14 Nov 2026, 09:45 AM', location: 'Aminabad Sector', completed: true },
      { step: 8, title: 'Delivered', time: '14 Nov 2026, 10:45 AM', location: 'Handed to Rajesh Gupta (OTP 9904)', completed: true, active: true },
    ],
  },
  {
    id: 'dlv_009',
    orderId: '#WH12540',
    customer: 'Divya Nair',
    customerPhone: '+91 98901 23456',
    customerEmail: 'divya.n@example.com',
    productName: 'Apple Watch Series 10',
    productShortName: 'Apple Watch 10',
    productImage: '/images/products/featured_apple_watch.jpg',
    address: 'B-102, LDA Colony, Ashiyana',
    area: 'Ashiyana, Lucknow',
    city: 'Lucknow',
    pincode: '226012',
    riderId: 'rd_004',
    riderName: 'Vikas Patel',
    riderPhone: '+91 98765 44554',
    riderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'Shadowfax',
    awbNumber: 'SFX990011223',
    status: 'Picked Up',
    eta: '03:45 PM',
    expectedDeliveryDate: 'Today, 14 Nov 2026',
    paymentType: 'Prepaid',
    orderAmount: 46900,
    formattedAmount: '₹46,900',
    priority: 'Standard',
    timeSlot: '02:00 PM – 05:00 PM',
    orderDate: '14 Nov 2026, 07:10 AM',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '14 Nov 2026, 07:10 AM', location: 'WatchHub Store', completed: true },
      { step: 2, title: 'Packed', time: '14 Nov 2026, 08:30 AM', location: 'Hub Dispatch Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '14 Nov 2026, 09:45 AM', location: 'Dispatch Bay C', completed: true },
      { step: 4, title: 'Picked Up', time: '14 Nov 2026, 11:00 AM', location: 'Warehouse Gate 1', completed: true, active: true },
      { step: 5, title: 'In Transit', time: 'Scheduled 01:00 PM', location: 'Ashiyana Express Link', completed: false },
      { step: 6, title: 'Reached Destination Hub', time: 'Scheduled 02:00 PM', location: 'South City Hub', completed: false },
      { step: 7, title: 'Out for Delivery', time: 'Scheduled 02:45 PM', location: 'Ashiyana Sector', completed: false },
      { step: 8, title: 'Delivered', time: 'Expected 03:45 PM', location: 'Customer Location', completed: false },
    ],
  },
  {
    id: 'dlv_010',
    orderId: '#WH12539',
    customer: 'Kunal Kapoor',
    customerPhone: '+91 98012 34567',
    customerEmail: 'kunal.k@example.com',
    productName: 'Tag Heuer Carrera Chronograph',
    productShortName: 'Tag Heuer Carrera',
    productImage: '/images/products/featured_ap_royal_oak.jpg',
    address: 'Old Haveli 14, Chowk',
    area: 'Chowk, Lucknow',
    city: 'Lucknow',
    pincode: '226003',
    riderId: 'rd_005',
    riderName: 'Arjun Mishra',
    riderPhone: '+91 98765 55665',
    riderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    courierPartner: 'Delhivery',
    awbNumber: 'DLV334455667',
    status: 'Returned',
    eta: 'Returned to Hub',
    expectedDeliveryDate: '13 Nov 2026',
    paymentType: 'COD',
    orderAmount: 285000,
    formattedAmount: '₹2,85,000',
    priority: 'Standard',
    timeSlot: '01:00 PM – 04:00 PM',
    orderDate: '12 Nov 2026, 04:15 PM',
    deliveryAttemptsCount: 1,
    failureReason: 'Customer Refused',
    failureRemarks: 'Customer refused parcel citing duplicate purchase; returned to local sorting hub.',
    nextAttemptDate: 'N/A (Returned)',
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: '12 Nov 2026, 04:15 PM', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: '12 Nov 2026, 06:00 PM', location: 'Hub Dispatch Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: '13 Nov 2026, 07:30 AM', location: 'Dispatch Bay B', completed: true },
      { step: 4, title: 'Picked Up', time: '13 Nov 2026, 09:00 AM', location: 'Warehouse Gate', completed: true },
      { step: 5, title: 'In Transit', time: '13 Nov 2026, 11:30 AM', location: 'Chowk Feeder', completed: true },
      { step: 6, title: 'Reached Destination Hub', time: '13 Nov 2026, 01:00 PM', location: 'Chowk Hub', completed: true },
      { step: 7, title: 'Out for Delivery', time: '13 Nov 2026, 02:15 PM', location: 'Chowk Sector', completed: true },
      { step: 8, title: 'Customer Refused & Returned', time: '13 Nov 2026, 03:45 PM', location: 'Returned to Lucknow Hub Facility', completed: true, active: true },
    ],
  },
];

// Delivery Routes
let DELIVERY_ROUTES = [
  {
    id: 'rt_001',
    routeCode: 'RT-LKO-01',
    name: 'Gomti Nagar & Mahanagar Express Loop',
    assignedRiderId: 'rd_001',
    assignedRiderName: 'Rohan Singh',
    city: 'Lucknow',
    totalStops: 14,
    completedStops: 8,
    totalDistance: '18.4 km',
    estimatedDuration: '2h 45m',
    status: 'In Progress',
    stops: [
      { sequence: 1, orderId: '#WH12543', customer: 'Vikram Malhotra', area: 'Mahanagar', status: 'Delivered', time: '11:15 AM' },
      { sequence: 2, orderId: '#WH12548', customer: 'Ananya Singh', area: 'Gomti Nagar', status: 'Out for Delivery', time: '12:40 PM' },
      { sequence: 3, orderId: '#WH12532', customer: 'Deepak Sharma', area: 'Vipin Khand', status: 'Scheduled', time: '01:15 PM' },
      { sequence: 4, orderId: '#WH12528', customer: 'Smita Ray', area: 'Patrakarpuram', status: 'Scheduled', time: '01:50 PM' },
    ],
  },
  {
    id: 'rt_002',
    routeCode: 'RT-LKO-02',
    name: 'Indira Nagar & Polytechnic Loop',
    assignedRiderId: 'rd_002',
    assignedRiderName: 'Amit Kumar',
    city: 'Lucknow',
    totalStops: 12,
    completedStops: 6,
    totalDistance: '15.2 km',
    estimatedDuration: '2h 10m',
    status: 'In Progress',
    stops: [
      { sequence: 1, orderId: '#WH12547', customer: 'Rahul Verma', area: 'Indira Nagar', status: 'Out for Delivery', time: '01:10 PM' },
      { sequence: 2, orderId: '#WH12542', customer: 'Pooja Sharma', area: 'Vibhuti Khand', status: 'Failed - Rescheduled 6 PM', time: '10:30 AM' },
      { sequence: 3, orderId: '#WH12530', customer: 'Aman Srivastava', area: 'Sector 18 Indira Nagar', status: 'Scheduled', time: '02:00 PM' },
    ],
  },
  {
    id: 'rt_003',
    routeCode: 'RT-LKO-03',
    name: 'Aliganj & Kapoorthala Loop',
    assignedRiderId: 'rd_003',
    assignedRiderName: 'Neha Sharma',
    city: 'Lucknow',
    totalStops: 10,
    completedStops: 7,
    totalDistance: '12.8 km',
    estimatedDuration: '1h 50m',
    status: 'In Progress',
    stops: [
      { sequence: 1, orderId: '#WH12541', customer: 'Rajesh Gupta', area: 'Aminabad', status: 'Delivered', time: '10:45 AM' },
      { sequence: 2, orderId: '#WH12546', customer: 'Priya Yadav', area: 'Aliganj', status: 'In Transit', time: '02:20 PM' },
    ],
  },
  {
    id: 'rt_004',
    routeCode: 'RT-LKO-04',
    name: 'Hazratganj & Raj Bhavan Central',
    assignedRiderId: 'rd_004',
    assignedRiderName: 'Vikas Patel',
    city: 'Lucknow',
    totalStops: 9,
    completedStops: 2,
    totalDistance: '11.0 km',
    estimatedDuration: '1h 35m',
    status: 'Scheduled',
    stops: [
      { sequence: 1, orderId: '#WH12545', customer: 'Rohit Kumar', area: 'Hazratganj', status: 'Assigned', time: '03:15 PM' },
      { sequence: 2, orderId: '#WH12540', customer: 'Divya Nair', area: 'Ashiyana', status: 'Picked Up', time: '03:45 PM' },
    ],
  },
];

// Delivery Attempts Ledger (Failed & Rescheduled cases)
let DELIVERY_ATTEMPTS = [
  {
    id: 'att_001',
    orderId: '#WH12542',
    customer: 'Pooja Sharma',
    phone: '+91 98789 01234',
    productName: 'Audemars Piguet Royal Oak',
    riderId: 'rd_002',
    riderName: 'Amit Kumar',
    attemptDateTime: '14 Nov 2026, 10:30 AM',
    reason: 'Customer Unavailable', // 'Customer Unavailable', 'Incorrect Address', 'Customer Refused', 'Phone Not Reachable', 'Other'
    customerContactResult: 'Spoke with customer family member. Customer is in office meeting until 5 PM.',
    remarks: 'Customer requested evening re-attempt after 6:00 PM at same address.',
    nextAttemptDate: '14 Nov 2026, 06:00 PM',
    status: 'Rescheduled',
    area: 'Vibhuti Khand, Lucknow',
  },
  {
    id: 'att_002',
    orderId: '#WH12539',
    customer: 'Kunal Kapoor',
    phone: '+91 98012 34567',
    productName: 'Tag Heuer Carrera Chronograph',
    riderId: 'rd_005',
    riderName: 'Arjun Mishra',
    attemptDateTime: '13 Nov 2026, 03:45 PM',
    reason: 'Customer Refused',
    customerContactResult: 'Customer verified in person at doorstep.',
    remarks: 'Customer stated spouse placed identical order on another account. Refused handover.',
    nextAttemptDate: 'N/A (Returned)',
    status: 'Escalated to Support',
    area: 'Chowk, Lucknow',
  },
  {
    id: 'att_003',
    orderId: '#WH12535',
    customer: 'Manisha Roy',
    phone: '+91 98111 22334',
    productName: 'Cartier Santos de Cartier',
    riderId: 'rd_004',
    riderName: 'Vikas Patel',
    attemptDateTime: '14 Nov 2026, 09:15 AM',
    reason: 'Phone Not Reachable',
    customerContactResult: '3 automated phone calls and 1 WhatsApp reminder sent.',
    remarks: 'Security gate required prior resident clearance. Will re-attempt on afternoon loop.',
    nextAttemptDate: '14 Nov 2026, 04:30 PM',
    status: 'Pending Re-attempt',
    area: 'Hazratganj, Lucknow',
  },
];

// Returns & Pickups
let RETURNS_PICKUPS = [
  {
    id: 'ret_001',
    returnRequestId: 'RET-8901',
    originalOrderId: '#WH12510',
    customer: 'Aditya Sen',
    customerPhone: '+91 98222 33445',
    productName: 'Rolex Cosmograph Daytona',
    pickupAddress: 'Flat 402, Royal Palms, Gomti Nagar',
    area: 'Gomti Nagar, Lucknow',
    assignedRiderId: 'rd_001',
    assignedRiderName: 'Rohan Singh',
    pickupDate: '14 Nov 2026',
    timeSlot: '03:00 PM – 06:00 PM',
    status: 'Pickup Assigned', // 'Return Requested', 'Pickup Assigned', 'Pickup Scheduled', 'Picked Up', 'Returned to Warehouse', 'Completed'
    reason: 'Size adjustment needed (wants 42mm instead of 40mm)',
  },
  {
    id: 'ret_002',
    returnRequestId: 'RET-8902',
    originalOrderId: '#WH12498',
    customer: 'Siddharth Mehra',
    customerPhone: '+91 98333 44556',
    productName: 'Smartwatch Pro AMOLED',
    pickupAddress: 'Plot 14, Sector C, Mahanagar',
    area: 'Mahanagar, Lucknow',
    assignedRiderId: 'rd_003',
    assignedRiderName: 'Neha Sharma',
    pickupDate: '14 Nov 2026',
    timeSlot: '11:00 AM – 02:00 PM',
    status: 'Picked Up',
    reason: 'Color exchange requested (wants Silver Steel)',
  },
  {
    id: 'ret_003',
    returnRequestId: 'RET-8903',
    originalOrderId: '#WH12480',
    customer: 'Kavita Reddy',
    customerPhone: '+91 98444 55667',
    productName: 'Waterproof Diver 200M',
    pickupAddress: 'House 23, Civil Lines, Lucknow',
    area: 'Civil Lines, Lucknow',
    assignedRiderId: 'rd_002',
    assignedRiderName: 'Amit Kumar',
    pickupDate: '13 Nov 2026',
    timeSlot: '04:00 PM – 07:00 PM',
    status: 'Returned to Warehouse',
    reason: 'Defective clasp lock mechanism',
  },
  {
    id: 'ret_004',
    returnRequestId: 'RET-8904',
    originalOrderId: '#WH12455',
    customer: 'Deepak Verma',
    customerPhone: '+91 98555 66778',
    productName: 'Titan Raga Delight Gold',
    pickupAddress: 'Flat 101, Gomti Enclave, Lucknow',
    area: 'Gomti Nagar, Lucknow',
    assignedRiderId: 'rd_004',
    assignedRiderName: 'Vikas Patel',
    pickupDate: '12 Nov 2026',
    timeSlot: '10:00 AM – 01:00 PM',
    status: 'Completed',
    reason: 'Quality issue refund completed',
  },
];

// Delivery Notification Feed
let DELIVERY_NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'Out for Delivery: Order #WH12548',
    message: 'Rider Rohan Singh is en route to Ananya Singh in Gomti Nagar. ETA: 12:40 PM.',
    type: 'out_for_delivery',
    timestamp: '11:30 AM',
    read: false,
  },
  {
    id: 'notif_002',
    title: 'Order Delivered: #WH12543',
    message: 'Rolex Cosmograph Daytona successfully delivered to Vikram Malhotra with verified OTP.',
    type: 'delivered',
    timestamp: '11:15 AM',
    read: false,
  },
  {
    id: 'notif_003',
    title: 'Delivery Failed: Order #WH12542',
    message: 'Amit Kumar reported customer unavailable at Vibhuti Khand. Rescheduled for 6:00 PM.',
    type: 'failed',
    timestamp: '10:30 AM',
    read: false,
  },
  {
    id: 'notif_004',
    title: 'Return Parcel Picked Up',
    message: 'Return RET-8902 picked up from Siddharth Mehra by Neha Sharma.',
    type: 'return',
    timestamp: '10:10 AM',
    read: true,
  },
  {
    id: 'notif_005',
    title: 'Route RT-LKO-01 Activated',
    message: 'Rohan Singh started Gomti Nagar & Mahanagar Express Loop with 14 stops.',
    type: 'route',
    timestamp: '09:45 AM',
    read: true,
  },
];

// 1. GET /api/delivery
router.get('/', (req, res) => {
  const { status, area, riderId, search, dateRange } = req.query;

  let filteredOrders = [...DELIVERY_ORDERS];

  if (status && status !== 'All') {
    filteredOrders = filteredOrders.filter(
      (o) => o.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (area && area !== 'All') {
    filteredOrders = filteredOrders.filter(
      (o) => o.area.toLowerCase().includes(area.toLowerCase()) || o.city.toLowerCase() === area.toLowerCase()
    );
  }

  if (riderId && riderId !== 'All') {
    filteredOrders = filteredOrders.filter((o) => o.riderId === riderId);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.awbNumber.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.riderName.toLowerCase().includes(q) ||
        o.area.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    status: 'success',
    data: {
      stats: DELIVERY_STATS,
      statusBreakdown: SHIPMENT_STATUS_BREAKDOWN,
      orders: filteredOrders,
      totalOrdersCount: DELIVERY_ORDERS.length,
      partners: DELIVERY_PARTNERS,
      routes: DELIVERY_ROUTES,
      attempts: DELIVERY_ATTEMPTS,
      returns: RETURNS_PICKUPS,
      notifications: DELIVERY_NOTIFICATIONS,
      liveTrackingOrder: DELIVERY_ORDERS.find((o) => o.orderId === '#WH12548') || DELIVERY_ORDERS[0],
    },
  });
});

// 2. POST /api/delivery/create-shipment
router.post('/create-shipment', (req, res) => {
  const {
    customer,
    customerPhone,
    customerEmail,
    productName,
    address,
    area,
    city,
    pincode,
    courierPartner,
    paymentType,
    orderAmount,
    priority,
    timeSlot,
    assignedRiderId,
  } = req.body;

  if (!customer || !productName || !address) {
    return res.status(400).json({
      status: 'fail',
      message: 'Customer name, product name, and delivery address are required.',
    });
  }

  const newOrderNum = 12549 + DELIVERY_ORDERS.length;
  const rider = DELIVERY_PARTNERS.find((p) => p.id === assignedRiderId) || DELIVERY_PARTNERS[0];
  const courier = courierPartner || 'BlueDart Express';
  const courierPrefix = courier.includes('BlueDart') ? 'BLU' : courier.includes('Delhivery') ? 'DLV' : 'DTDC';
  const awb = `${courierPrefix}${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const newShipment = {
    id: `dlv_${Date.now()}`,
    orderId: `#WH${newOrderNum}`,
    customer,
    customerPhone: customerPhone || '+91 98000 00000',
    customerEmail: customerEmail || 'customer@example.com',
    productName,
    productShortName: productName.split(' ').slice(0, 3).join(' '),
    productImage: '/images/products/featured_rolex_submariner.jpg',
    address,
    area: area || 'Central Sector, Lucknow',
    city: city || 'Lucknow',
    pincode: pincode || '226001',
    riderId: rider.id,
    riderName: rider.name,
    riderPhone: rider.phone,
    riderAvatar: rider.avatar,
    courierPartner: courier,
    awbNumber: awb,
    status: 'Assigned',
    eta: 'Pending Dispatch',
    expectedDeliveryDate: 'Tomorrow',
    paymentType: paymentType || 'Prepaid',
    orderAmount: Number(orderAmount) || 18999,
    formattedAmount: `₹${(Number(orderAmount) || 18999).toLocaleString('en-IN')}`,
    priority: priority || 'Standard',
    timeSlot: timeSlot || '10:00 AM – 01:00 PM',
    orderDate: 'Just now',
    deliveryAttemptsCount: 0,
    trackingTimeline: [
      { step: 1, title: 'Order Confirmed', time: 'Just now', location: 'WatchHub Vault', completed: true },
      { step: 2, title: 'Packed', time: 'Just now', location: 'Fulfillment Center', completed: true },
      { step: 3, title: 'Ready for Dispatch', time: 'Scheduled', location: 'Dispatch Bay', completed: true, active: true },
      { step: 4, title: 'Picked Up', time: 'Pending', location: 'Warehouse Gate', completed: false },
      { step: 5, title: 'In Transit', time: 'Pending', location: 'En route', completed: false },
      { step: 6, title: 'Reached Destination Hub', time: 'Pending', location: 'Local Sorting Center', completed: false },
      { step: 7, title: 'Out for Delivery', time: 'Pending', location: 'Assigned Courier Route', completed: false },
      { step: 8, title: 'Delivered', time: 'Pending', location: 'Customer Location', completed: false },
    ],
  };

  DELIVERY_ORDERS.unshift(newShipment);
  DELIVERY_STATS.totalShipments += 1;

  // Add notification
  DELIVERY_NOTIFICATIONS.unshift({
    id: `notif_${Date.now()}`,
    title: `New Shipment Created: ${newShipment.orderId}`,
    message: `Shipment for ${customer} assigned to ${rider.name}. AWB: ${awb}.`,
    type: 'shipment',
    timestamp: 'Just now',
    read: false,
  });

  return res.status(201).json({
    status: 'success',
    message: `Shipment created successfully with AWB ${awb}.`,
    data: newShipment,
  });
});

// 3. POST /api/delivery/assign
router.post('/assign', (req, res) => {
  const { orderIds, riderId, priority, timeSlot } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({ status: 'fail', message: 'Please select at least one order to assign.' });
  }

  const rider = DELIVERY_PARTNERS.find((p) => p.id === riderId);
  if (!rider) {
    return res.status(404).json({ status: 'fail', message: 'Delivery partner not found.' });
  }

  if (rider.status === 'Off Duty') {
    return res.status(400).json({
      status: 'fail',
      message: `Cannot assign orders to ${rider.name} because rider is currently Off Duty.`,
    });
  }

  let assignedCount = 0;
  DELIVERY_ORDERS = DELIVERY_ORDERS.map((order) => {
    if (orderIds.includes(order.orderId) || orderIds.includes(order.id)) {
      assignedCount++;
      return {
        ...order,
        riderId: rider.id,
        riderName: rider.name,
        riderPhone: rider.phone,
        riderAvatar: rider.avatar,
        priority: priority || order.priority,
        timeSlot: timeSlot || order.timeSlot,
        status: order.status === 'Delivered' ? order.status : 'Assigned',
      };
    }
    return order;
  });

  rider.activeOrders += assignedCount;

  // Notification
  DELIVERY_NOTIFICATIONS.unshift({
    id: `notif_${Date.now()}`,
    title: `${assignedCount} Orders Assigned`,
    message: `${assignedCount} orders successfully assigned to ${rider.name}. Priority: ${priority || 'Standard'}.`,
    type: 'assignment',
    timestamp: 'Just now',
    read: false,
  });

  return res.status(200).json({
    status: 'success',
    message: `Successfully assigned ${assignedCount} orders to ${rider.name}.`,
    data: { assignedCount, riderName: rider.name },
  });
});

// 4. POST /api/delivery/update-status
router.post('/update-status', (req, res) => {
  const { orderId, newStatus, remarks } = req.body;

  const orderIndex = DELIVERY_ORDERS.findIndex(
    (o) => o.orderId === orderId || o.id === orderId
  );

  if (orderIndex === -1) {
    return res.status(404).json({ status: 'fail', message: 'Order not found.' });
  }

  const prevStatus = DELIVERY_ORDERS[orderIndex].status;
  DELIVERY_ORDERS[orderIndex].status = newStatus;

  // Update timestamps and timelines accordingly
  const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (newStatus === 'Delivered') {
    DELIVERY_ORDERS[orderIndex].eta = `Delivered at ${nowStr}`;
    DELIVERY_STATS.delivered += 1;
    if (DELIVERY_STATS.outForDelivery > 0) DELIVERY_STATS.outForDelivery -= 1;
  } else if (newStatus === 'Out for Delivery') {
    DELIVERY_ORDERS[orderIndex].eta = 'Estimated 45 mins';
    DELIVERY_STATS.outForDelivery += 1;
  } else if (newStatus === 'Failed') {
    DELIVERY_ORDERS[orderIndex].eta = `Attempted at ${nowStr}`;
    DELIVERY_STATS.deliveryAttempts += 1;
    if (DELIVERY_STATS.outForDelivery > 0) DELIVERY_STATS.outForDelivery -= 1;
  }

  // Push notification
  DELIVERY_NOTIFICATIONS.unshift({
    id: `notif_${Date.now()}`,
    title: `Order ${orderId} Status: ${newStatus}`,
    message: remarks || `Order status updated from ${prevStatus} to ${newStatus}.`,
    type: 'status_update',
    timestamp: 'Just now',
    read: false,
  });

  return res.status(200).json({
    status: 'success',
    message: `Order ${orderId} updated to ${newStatus}.`,
    data: DELIVERY_ORDERS[orderIndex],
  });
});

// 5. POST /api/delivery/partner
router.post('/partner', (req, res) => {
  const { name, phone, area, city, vehicle, status, avatar } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ status: 'fail', message: 'Rider name and phone number are required.' });
  }

  const newPartner = {
    id: `rd_${Date.now()}`,
    name,
    empId: `EMP-RD-0${DELIVERY_PARTNERS.length + 1}`,
    phone,
    area: area || 'Lucknow Central',
    city: city || 'Lucknow',
    status: status || 'Available',
    activeOrders: 0,
    completedToday: 0,
    failedAttempts: 0,
    successRate: '100%',
    vehicle: vehicle || 'Two Wheeler',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    joinedDate: 'Today',
    currentLocation: {
      lat: 26.8467,
      lng: 80.9462,
      areaName: 'Central Logistics Hub',
      lastPing: 'Just now',
      verified: true,
    },
  };

  DELIVERY_PARTNERS.push(newPartner);

  return res.status(201).json({
    status: 'success',
    message: `Delivery partner ${name} registered successfully.`,
    data: newPartner,
  });
});

// 6. POST /api/delivery/attempt-failure
router.post('/attempt-failure', (req, res) => {
  const { orderId, reason, remarks, nextAttemptDate } = req.body;

  const order = DELIVERY_ORDERS.find((o) => o.orderId === orderId);
  if (!order) {
    return res.status(404).json({ status: 'fail', message: 'Order not found.' });
  }

  const newAttempt = {
    id: `att_${Date.now()}`,
    orderId,
    customer: order.customer,
    phone: order.customerPhone,
    productName: order.productName,
    riderId: order.riderId,
    riderName: order.riderName,
    attemptDateTime: new Date().toLocaleString('en-IN'),
    reason: reason || 'Customer Unavailable',
    customerContactResult: 'Call logged via automated IVR.',
    remarks: remarks || 'Attempted delivery at doorstep.',
    nextAttemptDate: nextAttemptDate || 'Tomorrow morning',
    status: 'Rescheduled',
    area: order.area,
  };

  DELIVERY_ATTEMPTS.unshift(newAttempt);
  order.status = 'Failed';
  order.deliveryAttemptsCount = (order.deliveryAttemptsCount || 0) + 1;
  order.failureReason = reason;
  DELIVERY_STATS.deliveryAttempts += 1;

  return res.status(200).json({
    status: 'success',
    message: `Delivery failure recorded for ${orderId}. Re-attempt scheduled for ${nextAttemptDate}.`,
    data: newAttempt,
  });
});

// 7. POST /api/delivery/return-pickup
router.post('/return-pickup', (req, res) => {
  const { originalOrderId, customer, productName, pickupAddress, area, assignedRiderId, reason, pickupDate } = req.body;

  const rider = DELIVERY_PARTNERS.find((p) => p.id === assignedRiderId) || DELIVERY_PARTNERS[0];
  const newReturnId = `RET-${Math.floor(1000 + Math.random() * 9000)}`;

  const newReturn = {
    id: `ret_${Date.now()}`,
    returnRequestId: newReturnId,
    originalOrderId: originalOrderId || '#WH12550',
    customer: customer || 'Customer',
    customerPhone: '+91 98000 11223',
    productName: productName || 'Luxury Timepiece',
    pickupAddress: pickupAddress || 'Lucknow',
    area: area || 'Lucknow Central',
    assignedRiderId: rider.id,
    assignedRiderName: rider.name,
    pickupDate: pickupDate || 'Tomorrow',
    timeSlot: '11:00 AM – 02:00 PM',
    status: 'Pickup Assigned',
    reason: reason || 'Customer Return Request',
  };

  RETURNS_PICKUPS.unshift(newReturn);
  DELIVERY_STATS.returnsPickups += 1;

  return res.status(201).json({
    status: 'success',
    message: `Return pickup request ${newReturnId} created and assigned to ${rider.name}.`,
    data: newReturn,
  });
});

// 8. GET /api/delivery/reports
router.get('/reports', (req, res) => {
  const { type = 'daily' } = req.query;

  const reportData = {
    reportType: type,
    generatedAt: new Date().toISOString(),
    metrics: {
      totalDispatched: 346,
      successfulDeliveries: 312,
      onTimeDeliveryRate: '94.8%',
      firstAttemptDeliveryRate: '92.4%',
      averageDeliveryTimeMinutes: 38,
      failedAttempts: 8,
      returnsProcessed: 4,
    },
    topRiders: DELIVERY_PARTNERS.map((p) => ({
      name: p.name,
      empId: p.empId,
      delivered: p.completedToday,
      successRate: p.successRate,
      area: p.area,
    })),
  };

  return res.status(200).json({
    status: 'success',
    data: reportData,
  });
});

export default router;
