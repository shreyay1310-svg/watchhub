// Mock Initial Tickets
export const INITIAL_TICKETS = [
  {
    id: '#TKT8754',
    customer: 'Ananya Singh',
    email: 'ananya.s@gmail.com',
    phone: '+91 98765 43210',
    subject: 'Order transit delay at Lucknow facility',
    orderId: '#WH12548',
    watch: 'Rolex Submariner Date 41mm',
    priority: 'High',
    status: 'Open',
    time: '15 mins ago',
    category: 'Delivery Delay',
    messages: [
      { sender: 'Ananya Singh', text: 'Hi, tracking shows package arrived at Lucknow hub yesterday morning, but no delivery update today. Can you please check?', time: '10:24 AM' }
    ]
  },
  {
    id: '#TKT8753',
    customer: 'Rahul Verma',
    email: 'rahul.v@gmail.com',
    phone: '+91 98765 22110',
    subject: 'Bracelet link adjustment inquiry for Moonwatch',
    orderId: '#WH12547',
    watch: 'Omega Speedmaster Professional',
    priority: 'Medium',
    status: 'In Progress',
    time: '1 hour ago',
    category: 'Product Sizing',
    messages: [
      { sender: 'Rahul Verma', text: 'Does this watch include the extra half-links in the box or should I take it to an authorized boutique?', time: '09:30 AM' },
      { sender: 'Support Executive', text: 'Hello Rahul! Yes, two extra links and the micro-adjustment spring bar tool are included in the velvet storage tray under the watch cushion.', time: '09:45 AM' }
    ]
  },
  {
    id: '#TKT8752',
    customer: 'Priya Yadav',
    email: 'priya.y@gmail.com',
    phone: '+91 98765 88990',
    subject: 'Refund confirmation & Bank ARN number required',
    orderId: '#WH12546',
    watch: 'Cartier Santos de Cartier Large',
    priority: 'High',
    status: 'Escalated',
    time: '2 hours ago',
    category: 'Payment & Refund',
    messages: [
      { sender: 'Priya Yadav', text: 'My return passed QC yesterday. When will the ₹7,15,000 refund reflect in my HDFC account? Please provide the ARN reference.', time: '08:15 AM' }
    ]
  },
  {
    id: '#TKT8751',
    customer: 'Rohit Kumar',
    email: 'rohit.k@gmail.com',
    phone: '+91 98765 33445',
    subject: 'Request for Extended 2-Year International Warranty PDF',
    orderId: '#WH12545',
    watch: 'Titan Edge Ceramic Slim',
    priority: 'Low',
    status: 'Resolved',
    time: 'Yesterday',
    category: 'Warranty & Papers',
    messages: [
      { sender: 'Rohit Kumar', text: 'Need a digital copy of the warranty certificate for insurance appraisal.', time: 'Yesterday' },
      { sender: 'Support Executive', text: 'Sent to your registered email along with the digital invoice and AD stamp.', time: 'Yesterday' }
    ]
  }
];

// Mock Live Queries
export const INITIAL_QUERIES = [
  {
    id: '#QRY-301',
    customer: 'Kavita Joshi',
    city: 'Mumbai',
    query: 'Is the Patek Philippe Nautilus in stock for same-day boutique trial in Bandra?',
    time: '3 mins ago',
    status: 'Waiting for Agent',
    interestedWatch: 'Patek Philippe Nautilus 5711/1R',
    price: '₹34,50,000'
  },
  {
    id: '#QRY-302',
    customer: 'Tanmay Mehta',
    city: 'Ahmedabad',
    query: 'Do you offer 0% No-Cost EMI on ICICI credit cards for watches above ₹1,00,000?',
    time: '12 mins ago',
    status: 'Chatting',
    interestedWatch: 'TAG Heuer Monaco Chronograph',
    price: '₹7,45,000'
  },
  {
    id: '#QRY-303',
    customer: 'Farhan Akhtar',
    city: 'Hyderabad',
    query: 'Are all luxury timepieces certified 100% authentic with factory warranty cards?',
    time: '28 mins ago',
    status: 'Replied',
    interestedWatch: 'Audemars Piguet Royal Oak Jumbo',
    price: '₹38,00,000'
  }
];

// Mock Orders Lookup Data
export const MOCK_ORDER_LOOKUP = {
  id: '#WH12548',
  date: '02 Nov 2026, 03:45 PM',
  customer: {
    name: 'Ananya Singh',
    email: 'ananya.s@gmail.com',
    phone: '+91 98765 43210',
    tier: 'Gold VIP Member'
  },
  address: 'Flat 402, Royal Palms Residency, Gomti Nagar, Lucknow, UP - 226010',
  items: [
    {
      name: 'Rolex Submariner Date 41mm',
      sku: 'W-ROLEX-SUB-41',
      serial: 'WH-RLX-994821',
      price: '₹11,40,000',
      qty: 1
    }
  ],
  payment: {
    method: 'Razorpay UPI (Net Banking)',
    status: 'Paid / Captured',
    txnId: 'pay_Nz99482199042',
    amount: '₹11,40,000'
  },
  shipping: {
    carrier: 'BlueDart Air Express',
    awb: 'BLU-88912401',
    status: 'Out for Delivery (Lucknow Hub)',
    eta: 'Today by 05:00 PM'
  }
};

// Mock Refunds Data
export const INITIAL_REFUNDS = [
  {
    id: '#RFD-8801',
    orderId: '#WH12546',
    customer: 'Priya Yadav',
    amount: '₹7,15,000',
    method: 'Razorpay Instant UPI',
    arn: 'HDFC-ARN-889210042',
    date: '04 Nov 2026',
    status: 'Refund Authorized',
    reason: 'Customer return - Wrist size exchange requested'
  },
  {
    id: '#RFD-8802',
    orderId: '#WH12541',
    customer: 'Meera Rajput',
    amount: '₹29,995',
    method: 'Original Card (ICICI)',
    arn: 'ICICI-ARN-773199014',
    date: '03 Nov 2026',
    status: 'Settled to Bank',
    reason: 'Watch size exchange'
  },
  {
    id: '#RFD-8803',
    orderId: '#WH12538',
    customer: 'Vikas Sharma',
    amount: '₹89,900',
    method: 'WatchHub Store Credit (+5% bonus)',
    arn: 'W-CREDIT-9921',
    date: '02 Nov 2026',
    status: 'Voucher Credited',
    reason: 'Upgraded to Rolex Explorer'
  }
];

// Mock Complaints
export const INITIAL_COMPLAINTS = [
  {
    id: '#CMP-104',
    severity: 'P0 Critical',
    customer: 'Vikramaditya Rao',
    phone: '+91 99887 76655',
    orderId: '#WH12530',
    issue: 'Outer tamper seal on shipping box appeared damaged upon courier delivery',
    status: 'Under Investigation',
    slaTime: '30 mins left',
    actionTaken: 'Package opened under unboxing video; contents verified intact.'
  },
  {
    id: '#CMP-103',
    severity: 'P1 High',
    customer: 'Devika Sen',
    phone: '+91 98765 11223',
    orderId: '#WH12528',
    issue: 'Courier delayed 3 days past guaranteed anniversary surprise delivery date',
    status: 'Escalated to Logistics Lead',
    slaTime: '1h 15m left',
    actionTaken: 'Courier penalty levied. ₹1,000 apology shopping credit offered.'
  },
  {
    id: '#CMP-102',
    severity: 'P2 Medium',
    customer: 'Kunal Kapoor',
    phone: '+91 98765 44332',
    orderId: '#WH12525',
    issue: 'Missing physical brochure booklet inside the presentation box',
    status: 'Resolved',
    slaTime: 'Resolved',
    actionTaken: 'Official hardcover catalog dispatched via express courier.'
  }
];

// Mock Reviews Data
export const INITIAL_REVIEWS = [
  {
    id: '#REV-701',
    customer: 'Sameer Singhania',
    watch: 'Rolex Submariner Date 41mm',
    rating: 5,
    title: 'Absolute perfection. The crown and ceramic bezel feel incredible.',
    comment: 'Delivered in a heavy piano-finish wooden box with the official warranty card. WatchHub packaging is second to none.',
    date: '03 Nov 2026',
    verified: true,
    status: 'Approved & Published'
  },
  {
    id: '#REV-702',
    customer: 'Aarti Menon',
    watch: 'Cartier Santos de Cartier Large',
    rating: 5,
    title: 'Timeless luxury with the QuickSwitch strap system.',
    comment: 'The blue hands against the opaline silver dial are breathtaking in natural sunlight. Prompt delivery.',
    date: '02 Nov 2026',
    verified: true,
    status: 'Approved & Published'
  },
  {
    id: '#REV-703',
    customer: 'Harsh Vardhan',
    watch: 'Titan Edge Ceramic Slim',
    rating: 4,
    title: 'Incredibly sleek watch, very comfortable on wrist.',
    comment: 'Thinnest watch I have owned. Delivery took 3 days instead of 2, but watch condition is flawless.',
    date: '01 Nov 2026',
    verified: true,
    status: 'Pending Moderation'
  }
];

// Mock Customer Management Data
export const INITIAL_CUSTOMERS = [
  {
    id: '#CUST-1001',
    name: 'Ananya Singh',
    email: 'ananya.s@gmail.com',
    phone: '+91 98765 43210',
    city: 'Lucknow, UP',
    tier: 'Gold VIP',
    totalOrders: 4,
    ltv: '₹14,85,000',
    joined: 'Jan 2025',
    status: 'Active'
  },
  {
    id: '#CUST-1002',
    name: 'Rahul Verma',
    email: 'rahul.v@gmail.com',
    phone: '+91 98765 22110',
    city: 'Kanpur, UP',
    tier: 'Platinum Elite',
    totalOrders: 6,
    ltv: '₹22,40,000',
    joined: 'Aug 2024',
    status: 'Active'
  },
  {
    id: '#CUST-1003',
    name: 'Priya Yadav',
    email: 'priya.y@gmail.com',
    phone: '+91 98765 88990',
    city: 'Varanasi, UP',
    tier: 'Silver',
    totalOrders: 2,
    ltv: '₹7,45,000',
    joined: 'Mar 2026',
    status: 'Active'
  },
  {
    id: '#CUST-1004',
    name: 'Rohit Kumar',
    email: 'rohit.k@gmail.com',
    phone: '+91 98765 33445',
    city: 'Lucknow, UP',
    tier: 'Regular',
    totalOrders: 3,
    ltv: '₹95,000',
    joined: 'May 2026',
    status: 'Active'
  }
];

