// Sales Overview Line Chart Data (Weekly: Mon - Sun)
export const WEEKLY_SALES_DATA = {
  'This Week': [
    { day: 'Mon', revenue: 8.5, formatted: '₹8,50,000' },
    { day: 'Tue', revenue: 12.2, formatted: '₹12,20,000' },
    { day: 'Wed', revenue: 14.8, formatted: '₹14,80,000' },
    { day: 'Thu', revenue: 13.5, formatted: '₹13,50,000' },
    { day: 'Fri', revenue: 17.6, formatted: '₹17,60,000' },
    { day: 'Sat', revenue: 24.85, formatted: '₹24,85,075', isPeak: true },
    { day: 'Sun', revenue: 19.4, formatted: '₹19,40,000' },
  ],
  'Last Week': [
    { day: 'Mon', revenue: 7.2, formatted: '₹7,20,000' },
    { day: 'Tue', revenue: 10.5, formatted: '₹10,50,000' },
    { day: 'Wed', revenue: 11.8, formatted: '₹11,80,000' },
    { day: 'Thu', revenue: 14.0, formatted: '₹14,00,000' },
    { day: 'Fri', revenue: 16.2, formatted: '₹16,20,000' },
    { day: 'Sat', revenue: 21.5, formatted: '₹21,50,000', isPeak: true },
    { day: 'Sun', revenue: 18.0, formatted: '₹18,00,000' },
  ],
  'This Month': [
    { day: 'Week 1', revenue: 45.2, formatted: '₹45,20,000' },
    { day: 'Week 2', revenue: 58.7, formatted: '₹58,70,000' },
    { day: 'Week 3', revenue: 72.4, formatted: '₹72,40,000' },
    { day: 'Week 4', revenue: 98.6, formatted: '₹98,60,000', isPeak: true },
  ],
};

// Channel Distribution Donut Data
export const SALES_CHANNEL_DATA = [
  { name: 'Online Store', value: 50, amount: '₹12,450.50', color: '#741BFF' },
  { name: 'POS Terminal', value: 33, amount: '₹8,250.30', color: '#1265FF' },
  { name: 'Mobile App', value: 17, amount: '₹4,149.95', color: '#00D9FF' },
];

// Initial POS Cart Products
export const INITIAL_POS_ITEMS = [
  {
    id: 'pos-1',
    name: 'Rolex Submariner',
    price: 980000,
    qty: 1,
    image: '/images/products/rolex-submariner.png',
    sku: 'WH-ROL-001',
  },
  {
    id: 'pos-2',
    name: 'Omega Speedmaster',
    price: 725000,
    qty: 1,
    image: '/images/products/omega-speedmaster.png',
    sku: 'WH-OMG-001',
  },
  {
    id: 'pos-3',
    name: 'TAG Heuer Carrera',
    price: 490000,
    qty: 1,
    image: '/images/products/tag-heuer-carrera.png',
    sku: 'WH-TAG-001',
  },
  {
    id: 'pos-4',
    name: 'Tissot PRX',
    price: 42500,
    qty: 1,
    image: '/images/products/tissot-prx.png',
    sku: 'WH-TIS-001',
  },
];

// Top Watches Performance Table Data
export const TOP_WATCHES_DATA = [
  {
    id: 'tw-1',
    name: 'Rolex Submariner',
    sold: 245,
    revenue: '₹24,01,000',
    image: '/images/products/rolex-submariner.png',
  },
  {
    id: 'tw-2',
    name: 'Omega Speedmaster',
    sold: 186,
    revenue: '₹13,48,500',
    image: '/images/products/omega-speedmaster.png',
  },
  {
    id: 'tw-3',
    name: 'TAG Heuer Carrera',
    sold: 162,
    revenue: '₹7,93,800',
    image: '/images/products/tag-heuer-carrera.png',
  },
  {
    id: 'tw-4',
    name: 'Tissot PRX',
    sold: 135,
    revenue: '₹5,73,750',
    image: '/images/products/tissot-prx.png',
  },
];

// Recent Orders Table Data
export const RECENT_ORDERS_DATA = [
  {
    id: '#ORD-1256',
    customer: 'John Doe',
    email: 'john.doe@gmail.com',
    amount: '₹1,50,750',
    status: 'Completed',
    statusStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    items: ['Rolex Submariner Date 41mm', 'Leather Travel Case'],
    date: '14 Nov 2026, 02:45 PM',
  },
  {
    id: '#ORD-1255',
    customer: 'Sarah Smith',
    email: 'sarah.smith@outlook.com',
    amount: '₹89,500',
    status: 'Processing',
    statusStyle: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    items: ['Tissot PRX Powermatic 80'],
    date: '14 Nov 2026, 01:15 PM',
  },
  {
    id: '#ORD-1254',
    customer: 'Michael Brown',
    email: 'michael.b@yahoo.com',
    amount: '₹3,20,000',
    status: 'Shipped',
    statusStyle: 'bg-[#741BFF]/20 text-[#A855F7] border border-[#741BFF]/40',
    items: ['Omega Speedmaster Moonwatch'],
    date: '13 Nov 2026, 06:30 PM',
  },
  {
    id: '#ORD-1253',
    customer: 'Emily Davis',
    email: 'emily.davis@corp.com',
    amount: '₹75,250',
    status: 'Pending',
    statusStyle: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    items: ['TAG Heuer Form 1 Quartz'],
    date: '13 Nov 2026, 04:10 PM',
  },
  {
    id: '#ORD-1252',
    customer: 'David Wilson',
    email: 'david.wilson@swiss.ch',
    amount: '₹1,85,600',
    status: 'Completed',
    statusStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    items: ['Cartier Tank Must Large'],
    date: '13 Nov 2026, 11:20 AM',
  },
];

