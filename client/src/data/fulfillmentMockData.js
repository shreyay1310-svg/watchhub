// Mock Data for Assigned Orders
export const INITIAL_ASSIGNED_ORDERS = [
  {
    id: '#WH12548',
    customer: 'Ananya Singh',
    city: 'Lucknow, UP',
    watch: 'Rolex Submariner Date 41mm',
    sku: 'W-ROLEX-SUB-41',
    qty: 1,
    priority: 'Urgent Express',
    zone: 'Zone A - Luxury Vault',
    assignedTo: 'Vikram Joshi',
    slaTime: '1h 20m left',
    status: 'Ready to Pick',
    price: '₹11,40,000',
    packaging: 'Luxury Wooden Box'
  },
  {
    id: '#WH12547',
    customer: 'Rahul Verma',
    city: 'Kanpur, UP',
    watch: 'Omega Speedmaster Professional Moonwatch',
    sku: 'W-OMEGA-MOON-01',
    qty: 1,
    priority: 'High',
    zone: 'Zone A - Luxury Vault',
    assignedTo: 'Ramesh Patel',
    slaTime: '2h 45m left',
    status: 'Picking in Progress',
    price: '₹6,40,000',
    packaging: 'Luxury Wooden Box'
  },
  {
    id: '#WH12546',
    customer: 'Priya Yadav',
    city: 'Varanasi, UP',
    watch: 'Cartier Santos de Cartier Large',
    sku: 'W-CART-SANTOS-LG',
    qty: 1,
    priority: 'Standard',
    zone: 'Zone B - Standard Watches',
    assignedTo: 'Sunil Kumar',
    slaTime: '4h 10m left',
    status: 'Ready to Pick',
    price: '₹7,15,000',
    packaging: 'Luxury Wooden Box'
  },
  {
    id: '#WH12545',
    customer: 'Rohit Kumar',
    city: 'Lucknow, UP',
    watch: 'Titan Edge Ceramic Slim',
    sku: 'W-TITAN-EDGE-CER',
    qty: 2,
    priority: 'Standard',
    zone: 'Zone B - Standard Watches',
    assignedTo: 'Deepak Rao',
    slaTime: '5h 00m left',
    status: 'Ready to Pick',
    price: '₹59,998',
    packaging: 'Standard Navy Box'
  },
  {
    id: '#WH12544',
    customer: 'Sneha Patel',
    city: 'Ahmedabad, GJ',
    watch: 'Seiko Prospex Speedtimer Solar',
    sku: 'W-SEIKO-SPEED-01',
    qty: 1,
    priority: 'High',
    zone: 'Zone B - Standard Watches',
    assignedTo: 'Ramesh Patel',
    slaTime: '3h 15m left',
    status: 'Picking in Progress',
    price: '₹58,000',
    packaging: 'Standard Navy Box'
  },
  {
    id: '#WH12543',
    customer: 'Kunal Kapoor',
    city: 'Delhi NCR',
    watch: 'Apple Watch Ultra 2 Titanium 49mm',
    sku: 'W-APPLE-ULTRA-2',
    qty: 1,
    priority: 'Urgent Express',
    zone: 'Zone C - Smartwatches',
    assignedTo: 'Vikram Joshi',
    slaTime: '0h 45m left',
    status: 'Ready to Pick',
    price: '₹89,900',
    packaging: 'Tamper-Evident Box'
  }
];

// Mock Shipments Data
export const INITIAL_SHIPMENTS = [
  {
    id: '#SHP-9901',
    manifestId: 'MNF-BLU-20261104-01',
    orderId: '#WH12548',
    customer: 'Ananya Singh',
    destination: 'Lucknow, UP (226010)',
    courier: 'BlueDart Air Express',
    awb: 'BLU-88912401',
    weight: '0.45 kg',
    status: 'Delivered',
    dispatchTime: '03 Nov, 08:30 PM',
    step: 5,
    eta: 'Delivered 04 Nov, 02:30 PM'
  },
  {
    id: '#SHP-9902',
    manifestId: 'MNF-DLV-20261104-02',
    orderId: '#WH12547',
    customer: 'Rahul Verma',
    destination: 'Kanpur, UP (208001)',
    courier: 'Delhivery Surface Plus',
    awb: 'DLV-44219088',
    weight: '0.62 kg',
    status: 'Out for Delivery',
    dispatchTime: '04 Nov, 04:15 AM',
    step: 4,
    eta: 'Today by 06:00 PM'
  },
  {
    id: '#SHP-9903',
    manifestId: 'MNF-SHD-20261104-03',
    orderId: '#WH12546',
    customer: 'Priya Yadav',
    destination: 'Varanasi, UP (221002)',
    courier: 'Shadowfax Priority',
    awb: 'SHD-90124455',
    weight: '0.50 kg',
    status: 'In Transit',
    dispatchTime: '04 Nov, 09:30 AM',
    step: 3,
    eta: 'Tomorrow, 05 Nov'
  },
  {
    id: '#SHP-9904',
    manifestId: 'MNF-BLU-20261104-01',
    orderId: '#WH12545',
    customer: 'Rohit Kumar',
    destination: 'Lucknow, UP (226024)',
    courier: 'BlueDart Air Express',
    awb: 'BLU-88904512',
    weight: '0.85 kg',
    status: 'Delivered',
    dispatchTime: '02 Nov, 07:00 PM',
    step: 5,
    eta: 'Delivered 03 Nov, 04:15 PM'
  },
  {
    id: '#SHP-9905',
    manifestId: 'MNF-DHL-20261104-04',
    orderId: '#WH12543',
    customer: 'Kunal Kapoor',
    destination: 'Delhi NCR (110001)',
    courier: 'DHL Express VIP',
    awb: 'DHL-77319920',
    weight: '0.38 kg',
    status: 'Packed & Manifested',
    dispatchTime: 'Handover in 30 mins',
    step: 2,
    eta: 'Tomorrow Morning 10:00 AM'
  }
];

// Mock Return Logistics Data
export const INITIAL_RETURNS = [
  {
    id: '#RET-5501',
    orderId: '#WH12541',
    customer: 'Meera Rajput',
    city: 'Jaipur, RJ',
    watch: 'Casio G-Shock Mudmaster Master of G',
    reason: 'Too large for wrist / Size adjustment needed',
    courier: 'BlueDart Reverse Pickup',
    awb: 'BLU-REV-10928',
    pickupStatus: 'Received at Warehouse QC',
    qcChecks: {
      boxIntact: true,
      warrantyCardPresent: true,
      scratchFree: true,
      movementTested: true
    },
    actionStatus: 'Pending Inspection Approval',
    amount: '₹29,995'
  },
  {
    id: '#RET-5502',
    orderId: '#WH12539',
    customer: 'Alok Gupta',
    city: 'Chandigarh, PB',
    watch: 'Fossil Grant Chronograph Leather',
    reason: 'Wrong color strap received in box',
    courier: 'Delhivery Reverse',
    awb: 'DLV-REV-88712',
    pickupStatus: 'Out for Reverse Pickup',
    qcChecks: {
      boxIntact: false,
      warrantyCardPresent: true,
      scratchFree: true,
      movementTested: true
    },
    actionStatus: 'In Transit to Hub',
    amount: '₹12,495'
  },
  {
    id: '#RET-5503',
    orderId: '#WH12535',
    customer: 'Simran Walia',
    city: 'Pune, MH',
    watch: 'Tissot PRX Powermatic 80 Blue',
    reason: 'Changed mind / Preferred Green Dial',
    courier: 'Shadowfax Reverse',
    awb: 'SHD-REV-66152',
    pickupStatus: 'QC Passed & Restocked',
    qcChecks: {
      boxIntact: true,
      warrantyCardPresent: true,
      scratchFree: true,
      movementTested: true
    },
    actionStatus: 'Restocked to Inventory',
    amount: '₹68,000'
  }
];

