import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import DashboardHeader from '../../components/dashboards/DashboardHeader';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import watchBannerImg from '../../assets/images/watch-cut.png';

// Import All Role Module Components
import UsersManagementModule from '../../components/dashboards/modules/UsersManagementModule';
import ProductsManagementModule from '../../components/dashboards/modules/ProductsManagementModule';
import OrdersManagementModule from '../../components/dashboards/modules/OrdersManagementModule';
import InventoryManagementModule from '../../components/dashboards/modules/InventoryManagementModule';
import CustomerSupportModule from '../../components/dashboards/modules/CustomerSupportModule';
import OffersCouponsModule from '../../components/dashboards/modules/OffersCouponsModule';
import SettingsAuditModule from '../../components/dashboards/modules/SettingsAuditModule';
import CategoriesBrandsModule from '../../components/dashboards/modules/CategoriesBrandsModule';
import DeliveryModule from '../../components/dashboards/modules/DeliveryModule';
import ReportsAnalyticsModule from '../../components/dashboards/modules/ReportsAnalyticsModule';
import ManufacturingHubModule from '../../components/dashboards/modules/ManufacturingHubModule';
import CustomizationManagementModule from '../../components/dashboards/modules/CustomizationManagementModule';

export const ROLE_CONFIGS = {
  [ROLES.SUPER_ADMIN]: {
    title: 'Super Admin Dashboard 👑',
    subtitle: 'Manage the entire WatchHub platform — users, products, orders, inventory, offers and more.',
    bannerTitle: 'Platform Control Center',
    bannerSubtitle: 'Complete management of your watch store in one place.',
    kpis: [
      { label: 'Total Orders', value: '1,248', change: '+12%', isUp: true, icon: '🛒', color: 'bg-amber-50 text-amber-600' },
      { label: 'Total Customers', value: '5,320', change: '+18%', isUp: true, icon: '👥', color: 'bg-purple-50 text-purple-600' },
      { label: 'Total Products', value: '320', change: '+6%', isUp: true, icon: '⌚', color: 'bg-blue-50 text-blue-600' },
      { label: 'Total Revenue', value: '₹12,48,000', change: '+22%', isUp: true, icon: '₹', color: 'bg-rose-50 text-rose-600' },
      { label: 'Active Offers', value: '18', change: '+5%', isUp: true, icon: '🏷️', color: 'bg-emerald-50 text-emerald-600' },
    ],
    trendTitle: 'Sales Overview',
    trendData: [
      { name: 'Apr', val: 2.1 },
      { name: 'May', val: 3.4 },
      { name: 'Jun', val: 4.8 },
      { name: 'Jul', val: 5.2 },
      { name: 'Aug', val: 7.1 },
      { name: 'Sep', val: 7.9 },
      { name: 'Oct', val: 9.8 },
    ],
    donutTitle: 'Orders Status',
    donutTotal: '1,248 Orders',
    donutData: [
      { name: 'Delivered', value: 62, color: '#3b82f6' },
      { name: 'Processing', value: 14, color: '#f59e0b' },
      { name: 'Shipped', value: 12, color: '#8b5cf6' },
      { name: 'Cancelled', value: 7, color: '#f43f5e' },
      { name: 'Returned', value: 5, color: '#14b8a6' },
    ],
    widgetTitle: '👥 User & Role Summary',
    widgetItems: [
      { label: 'Customers', val: '5,320' },
      { label: 'Store Admins', val: '12' },
      { label: 'Inventory Managers', val: '8' },
      { label: 'Delivery Managers', val: '10' },
      { label: 'Support Executives', val: '6' },
    ],
    tableTitle: 'Recent Orders',
    tableHeaders: ['Order ID', 'Customer', 'Amount', 'Status', 'Date'],
    tableRows: [
      { id: '#WH12548', c1: 'Ananya Singh', c2: '₹2,999', status: 'Delivered', c4: '04 Nov 2026' },
      { id: '#WH12547', c1: 'Rahul Verma', c2: '₹3,499', status: 'Shipped', c4: '04 Nov 2026' },
      { id: '#WH12546', c1: 'Priya Yadav', c2: '₹1,899', status: 'Processing', c4: '03 Nov 2026' },
      { id: '#WH12545', c1: 'Rohit Kumar', c2: '₹2,749', status: 'Delivered', c4: '03 Nov 2026' },
      { id: '#WH12544', c1: 'Sneha Patel', c2: '₹3,299', status: 'Cancelled', c4: '02 Nov 2026' },
    ],
    centerTitle: 'Top Selling Products',
    centerItems: [
      { name: 'Classic Chronograph Watch', rating: '★ 4.5 (1.2k)', badge: '324 Sold', emoji: '⌚' },
      { name: 'Smartwatch Pro', rating: '★ 4.5 (3.4k)', badge: '287 Sold', emoji: '📱' },
      { name: 'Elegant Partywear Watch', rating: '★ 4.6 (980)', badge: '256 Sold', emoji: '🕰️' },
    ],
    quickActions: [
      { label: 'Add Product', icon: '➕', tab: 'products' },
      { label: 'Add Category', icon: '📁', tab: 'categories' },
      { label: 'Create Offer', icon: '🏷️', tab: 'offers' },
      { label: 'Manage Users', icon: '👥', tab: 'users' },
      { label: 'View Reports', icon: '📈', tab: 'reports' },
      { label: 'System Settings', icon: '⚙️', tab: 'settings' },
    ],
  },

  [ROLES.STORE_ADMIN]: {
    title: 'Store Admin Dashboard 🏪',
    subtitle: 'Manage products, inventory, orders and promotions for your WatchHub store.',
    bannerTitle: 'Store Management Center',
    bannerSubtitle: 'Control your store products, inventory, orders and offers in one place.',
    kpis: [
      { label: 'Total Products', value: '320', change: '+6%', isUp: true, icon: '⌚', color: 'bg-amber-50 text-amber-600' },
      { label: 'Total Orders', value: '1,248', change: '+12%', isUp: true, icon: '🛒', color: 'bg-purple-50 text-purple-600' },
      { label: 'Total Customers', value: '5,320', change: '+18%', isUp: true, icon: '👥', color: 'bg-blue-50 text-blue-600' },
      { label: 'Total Sales', value: '₹12,48,000', change: '+22%', isUp: true, icon: '₹', color: 'bg-rose-50 text-rose-600' },
      { label: 'Active Offers', value: '18', change: '+5%', isUp: true, icon: '🏷️', color: 'bg-emerald-50 text-emerald-600' },
    ],
    trendTitle: 'Sales Overview',
    trendData: [
      { name: 'Apr', val: 2.1 },
      { name: 'May', val: 3.4 },
      { name: 'Jun', val: 4.8 },
      { name: 'Jul', val: 5.2 },
      { name: 'Aug', val: 7.1 },
      { name: 'Sep', val: 7.9 },
      { name: 'Oct', val: 9.8 },
    ],
    donutTitle: 'Orders Status',
    donutTotal: '1,248 Orders',
    donutData: [
      { name: 'Delivered', value: 62, color: '#3b82f6' },
      { name: 'Processing', value: 14, color: '#f59e0b' },
      { name: 'Shipped', value: 12, color: '#8b5cf6' },
      { name: 'Cancelled', value: 7, color: '#f43f5e' },
      { name: 'Returned', value: 5, color: '#14b8a6' },
    ],
    widgetTitle: '⚠️ Inventory Alerts',
    widgetItems: [
      { label: 'Digital Sports Watch', val: 'Low Stock (5 left)' },
      { label: 'Classic Chronograph Watch', val: 'Low Stock (8 left)' },
      { label: 'Smartwatch Pro', val: 'Low Stock (10 left)' },
    ],
    tableTitle: 'Recent Orders',
    tableHeaders: ['Order ID', 'Customer', 'Amount', 'Status', 'Date'],
    tableRows: [
      { id: '#WH12548', c1: 'Ananya Singh', c2: '₹2,999', status: 'Delivered', c4: '04 Nov 2026' },
      { id: '#WH12547', c1: 'Rahul Verma', c2: '₹3,499', status: 'Shipped', c4: '04 Nov 2026' },
      { id: '#WH12546', c1: 'Priya Yadav', c2: '₹1,899', status: 'Processing', c4: '03 Nov 2026' },
      { id: '#WH12545', c1: 'Rohit Kumar', c2: '₹2,749', status: 'Delivered', c4: '03 Nov 2026' },
      { id: '#WH12544', c1: 'Sneha Patel', c2: '₹3,299', status: 'Cancelled', c4: '02 Nov 2026' },
    ],
    centerTitle: 'Top Selling Products',
    centerItems: [
      { name: 'Classic Chronograph Watch', rating: '★ 4.5 (1.2k)', badge: '324 Sold', emoji: '⌚' },
      { name: 'Smartwatch Pro', rating: '★ 4.5 (3.4k)', badge: '287 Sold', emoji: '📱' },
      { name: 'Elegant Partywear Watch', rating: '★ 4.6 (980)', badge: '256 Sold', emoji: '🕰️' },
    ],
    quickActions: [
      { label: 'Add Product', icon: '➕', tab: 'products' },
      { label: 'Update Stock', icon: '📦', tab: 'inventory' },
      { label: 'Create Offer', icon: '🏷️', tab: 'offers' },
      { label: 'Upload Banner', icon: '🖼️', tab: 'banners' },
      { label: 'View Orders', icon: '🛒', tab: 'orders' },
      { label: 'Generate Report', icon: '📈', tab: 'reports' },
    ],
  },

  [ROLES.INVENTORY_MANAGER]: {
    title: 'Inventory Manager Dashboard 📦',
    subtitle: 'Manage stock, warehouse, and inventory operations for WatchHub.',
    bannerTitle: 'Inventory Control Center',
    bannerSubtitle: 'Track stock levels, update inventory and manage stock across warehouses.',
    kpis: [
      { label: 'Total Stock (Units)', value: '8,540', change: '+6%', isUp: true, icon: '📦', color: 'bg-amber-50 text-amber-600' },
      { label: 'In Stock Products', value: '296', change: '+8%', isUp: true, icon: '✅', color: 'bg-blue-50 text-blue-600' },
      { label: 'Low Stock Products', value: '24', change: '-25%', isUp: false, icon: '⚠️', color: 'bg-purple-50 text-purple-600' },
      { label: 'Out of Stock', value: '6', change: '-40%', isUp: false, icon: '❌', color: 'bg-rose-50 text-rose-600' },
      { label: 'Warehouses', value: '3', change: 'Active', isUp: true, icon: '🏢', color: 'bg-emerald-50 text-emerald-600' },
    ],
    trendTitle: 'Stock Overview',
    trendData: [
      { name: 'Apr', val: 5.2 },
      { name: 'May', val: 5.8 },
      { name: 'Jun', val: 6.4 },
      { name: 'Jul', val: 7.0 },
      { name: 'Aug', val: 7.9 },
      { name: 'Sep', val: 8.2 },
      { name: 'Oct', val: 8.5 },
    ],
    donutTitle: 'Stock Status',
    donutTotal: '296 Products',
    donutData: [
      { name: 'In Stock', value: 82, color: '#3b82f6' },
      { name: 'Low Stock', value: 12, color: '#f59e0b' },
      { name: 'Out of Stock', value: 6, color: '#f43f5e' },
    ],
    widgetTitle: '🔄 Stock Movement',
    widgetItems: [
      { label: '↑ Stock Added', val: '+1,250 Units' },
      { label: '⇄ Stock Transferred', val: '320 Units' },
      { label: '↻ Stock Updated', val: '480 Units' },
      { label: '↓ Stock Removed', val: '-140 Units' },
    ],
    tableTitle: 'Recent Stock Updates',
    tableHeaders: ['Product', 'SKU', 'Update Type', 'Quantity', 'Date'],
    tableRows: [
      { id: 'Classic Chronograph', c1: 'WHC-001', c2: 'Stock Added', status: '+100', c4: '04 Nov 2026' },
      { id: 'Smartwatch Pro', c1: 'WHS-010', c2: 'Stock Updated', status: '+50', c4: '04 Nov 2026' },
      { id: 'Elegant Partywear', c1: 'WHP-005', c2: 'Stock Removed', status: '-20', c4: '03 Nov 2026' },
      { id: 'Digital Sports Watch', c1: 'WHD-008', c2: 'Stock Added', status: '+150', c4: '03 Nov 2026' },
      { id: 'Waterproof Dive Watch', c1: 'WHW-006', c2: 'Stock Updated', status: '+75', c4: '02 Nov 2026' },
    ],
    centerTitle: 'Low Stock Products (24)',
    centerItems: [
      { name: 'Digital Sports Watch', rating: '★ 4.4 (760)', badge: '5 left', emoji: '📱' },
      { name: 'Classic Chronograph Watch', rating: '★ 4.5 (1.2k)', badge: '8 left', emoji: '⌚' },
      { name: 'Smartwatch Pro', rating: '★ 4.5 (3.4k)', badge: '10 left', emoji: '⌚' },
    ],
    quickActions: [
      { label: 'Add Stock', icon: '➕', tab: 'stock_update' },
      { label: 'Transfer Stock', icon: '⇄', tab: 'inventory' },
      { label: 'Update Stock', icon: '🔄', tab: 'stock_update' },
      { label: 'Manage Warehouses', icon: '🏢', tab: 'warehouses' },
      { label: 'View Low Stock', icon: '⚠️', tab: 'inventory' },
      { label: 'Inventory Report', icon: '📈', tab: 'stock_reports' },
    ],
  },

  [ROLES.DELIVERY_MANAGER]: {
    title: 'Delivery Manager Dashboard 🚚',
    subtitle: 'Manage order dispatch, delivery, tracking and returns for WatchHub.',
    bannerTitle: 'Delivery Operations Center',
    bannerSubtitle: 'Process, dispatch and track all orders for timely delivery.',
    kpis: [
      { label: 'Total Orders', value: '1,248', change: '+12%', isUp: true, icon: '🛒', color: 'bg-amber-50 text-amber-600' },
      { label: 'Assigned Orders', value: '320', change: '+8%', isUp: true, icon: '📦', color: 'bg-purple-50 text-purple-600' },
      { label: 'Out for Delivery', value: '286', change: '+15%', isUp: true, icon: '🚚', color: 'bg-blue-50 text-blue-600' },
      { label: 'Delivered Orders', value: '812', change: '+18%', isUp: true, icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
      { label: 'Return Requests', value: '24', change: '-20%', isUp: false, icon: '🔄', color: 'bg-rose-50 text-rose-600' },
      { label: 'Avg. Delivery Time', value: '2.4 Days', change: '-18%', isUp: true, icon: '⏱️', color: 'bg-emerald-50 text-emerald-600' },
    ],
    trendTitle: 'Delivery Trend',
    trendData: [
      { name: 'Apr', val: 240 },
      { name: 'May', val: 380 },
      { name: 'Jun', val: 490 },
      { name: 'Jul', val: 550 },
      { name: 'Aug', val: 680 },
      { name: 'Sep', val: 740 },
      { name: 'Oct', val: 812 },
    ],
    donutTitle: 'Order Status Distribution',
    donutTotal: '1,248 Orders',
    donutData: [
      { name: 'Delivered', value: 65, color: '#3b82f6' },
      { name: 'Out for Delivery', value: 23, color: '#f59e0b' },
      { name: 'Processing', value: 6, color: '#8b5cf6' },
      { name: 'Returned', value: 4, color: '#f43f5e' },
      { name: 'Cancelled', value: 2, color: '#14b8a6' },
    ],
    widgetTitle: "📅 Today's Delivery Tasks",
    widgetItems: [
      { label: 'Orders to Pick & Pack', val: '48' },
      { label: 'Orders to Dispatch', val: '36' },
      { label: 'Out for Delivery', val: '112' },
      { label: 'Expected Deliveries Today', val: '104' },
    ],
    tableTitle: 'Recent Deliveries',
    tableHeaders: ['Order ID', 'Customer', 'Location', 'Status', 'Delivery Date'],
    tableRows: [
      { id: '#WH12548', c1: 'Ananya Singh', c2: 'Lucknow', status: 'Delivered', c4: '04 Nov 2026' },
      { id: '#WH12547', c1: 'Rahul Verma', c2: 'Kanpur', status: 'Out for Delivery', c4: '04 Nov 2026' },
      { id: '#WH12546', c1: 'Priya Yadav', c2: 'Varanasi', status: 'Processing', c4: '03 Nov 2026' },
      { id: '#WH12545', c1: 'Rohit Kumar', c2: 'Lucknow', status: 'Delivered', c4: '03 Nov 2026' },
      { id: '#WH12544', c1: 'Sneha Patel', c2: 'Sitapur', status: 'Out for Delivery', c4: '02 Nov 2026' },
    ],
    centerTitle: 'Live Delivery Tracking',
    centerItems: [
      { name: 'Order Confirmed', rating: '03 Nov, 10:24 AM', badge: 'Completed', emoji: '✅' },
      { name: 'Packed at Warehouse', rating: '03 Nov, 04:30 PM', badge: 'Completed', emoji: '📦' },
      { name: 'Out for Delivery', rating: '04 Nov, 09:15 AM', badge: 'Active', emoji: '🚚' },
      { name: 'Delivered (Expected)', rating: '04 Nov, by 6:00 PM', badge: 'Pending', emoji: '🏠' },
    ],
    quickActions: [
      { label: 'Assign Delivery', icon: '👤', tab: 'assigned_orders' },
      { label: 'Update Status', icon: '✏️', tab: 'shipments' },
      { label: 'Scan Package', icon: '📷', tab: 'pick_pack' },
      { label: 'Track Order', icon: '📍', tab: 'track_orders' },
      { label: 'Handle Return', icon: '🔄', tab: 'returns' },
      { label: 'Generate Report', icon: '📊', tab: 'delivery_reports' },
    ],
  },

  [ROLES.CUSTOMER_SUPPORT]: {
    title: 'Customer Support Dashboard 🎧',
    subtitle: 'Manage customer queries, tickets, returns and provide the best support experience for WatchHub.',
    bannerTitle: 'Customer Support Center',
    bannerSubtitle: 'Resolve queries, manage requests and keep our customers happy.',
    kpis: [
      { label: 'Total Tickets', value: '1,248', change: '+12%', isUp: true, icon: '🎫', color: 'bg-amber-50 text-amber-600' },
      { label: 'Open Tickets', value: '186', change: '+6%', isUp: false, icon: '⏳', color: 'bg-purple-50 text-purple-600' },
      { label: 'Resolved Tickets', value: '1,020', change: '+18%', isUp: true, icon: '✅', color: 'bg-blue-50 text-blue-600' },
      { label: 'Return Requests', value: '48', change: '+10%', isUp: false, icon: '🔄', color: 'bg-rose-50 text-rose-600' },
      { label: 'Refunds Processed', value: '₹1,24,500', change: '+22%', isUp: true, icon: '₹', color: 'bg-rose-50 text-rose-600' },
      { label: 'Avg. Response Time', value: '4.8 Min', change: '-25%', isUp: true, icon: '⏱️', color: 'bg-emerald-50 text-emerald-600' },
    ],
    trendTitle: 'Ticket Trend',
    trendData: [
      { name: 'Apr', val: 80 },
      { name: 'May', val: 120 },
      { name: 'Jun', val: 140 },
      { name: 'Jul', val: 160 },
      { name: 'Aug', val: 190 },
      { name: 'Sep', val: 210 },
      { name: 'Oct', val: 250 },
    ],
    donutTitle: 'Ticket Status Overview',
    donutTotal: '1,248 Tickets',
    donutData: [
      { name: 'Resolved', value: 82, color: '#3b82f6' },
      { name: 'Open', value: 15, color: '#f59e0b' },
      { name: 'In Progress', value: 6, color: '#8b5cf6' },
      { name: 'Escalated', value: 3, color: '#f43f5e' },
    ],
    widgetTitle: '💬 Query Categories',
    widgetItems: [
      { label: 'Order Related', val: '38%' },
      { label: 'Returns & Refunds', val: '22%' },
      { label: 'Product & Warranty', val: '16%' },
      { label: 'Payment & Billing', val: '14%' },
      { label: 'Others', val: '10%' },
    ],
    tableTitle: 'Recent Support Tickets',
    tableHeaders: ['Ticket ID', 'Customer', 'Subject', 'Status', 'Priority'],
    tableRows: [
      { id: '#TKT8754', c1: 'Ananya Singh', c2: 'Order not delivered', status: 'Open', c4: 'High' },
      { id: '#TKT8753', c1: 'Rahul Verma', c2: 'Return request', status: 'In Progress', c4: 'Medium' },
      { id: '#TKT8752', c1: 'Priya Yadav', c2: 'Refund not received', status: 'Open', c4: 'High' },
      { id: '#TKT8751', c1: 'Rohit Kumar', c2: 'Product warranty', status: 'Resolved', c4: 'Low' },
      { id: '#TKT8750', c1: 'Sneha Patel', c2: 'Wrong item received', status: 'Resolved', c4: 'Medium' },
    ],
    centerTitle: 'Recent Customer Chats',
    centerItems: [
      { name: 'Ananya Singh', rating: 'Can you help me track my order?', badge: '10:24 AM', emoji: 'AS' },
      { name: 'Rahul Verma', rating: 'I want to return my watch.', badge: '10:05 AM', emoji: 'RV' },
      { name: 'Priya Yadav', rating: 'Is there any warranty on this product?', badge: '09:47 AM', emoji: 'PY' },
    ],
    quickActions: [
      { label: 'Reply to Tickets', icon: '💬', tab: 'support_tickets' },
      { label: 'Process Return', icon: '🔄', tab: 'returns_refunds' },
      { label: 'Initiate Refund', icon: '💳', tab: 'returns_refunds' },
      { label: 'Order Lookup', icon: '🔍', tab: 'orders_lookup' },
      { label: 'Update Ticket', icon: '✏️', tab: 'support_tickets' },
      { label: 'Escalate Issue', icon: '⚠️', tab: 'complaints' },
    ],
  },
};

export const RoleDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const currentRole = user?.role || ROLES.SUPER_ADMIN;
  const config = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS[ROLES.SUPER_ADMIN];

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('delivered') || s.includes('resolved') || s.startsWith('+')) {
      return 'bg-emerald-100 text-emerald-800';
    }
    if (s.includes('processing') || s.includes('in progress') || s.includes('out for delivery')) {
      return 'bg-amber-100 text-amber-800';
    }
    if (s.includes('shipped') || s.includes('active')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-rose-100 text-rose-800';
  };

  // Render the Selected Navigation Module Component
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'manufacturing_hub':
        return <ManufacturingHubModule />;
      case 'custom_watches':
        return <CustomizationManagementModule />;
      case 'users':
        return <UsersManagementModule />;
      case 'products':
        return <ProductsManagementModule />;
      case 'categories':
        return <CategoriesBrandsModule />;
      case 'orders':
      case 'payments':
        return <OrdersManagementModule />;
      case 'inventory':
      case 'stock_update':
      case 'stock_requests':
      case 'warehouses':
        return <InventoryManagementModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
      case 'assigned_orders':
      case 'pick_pack':
      case 'shipments':
      case 'track_orders':
      case 'returns':
        return <DeliveryModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
      case 'support_tickets':
      case 'customer_queries':
      case 'orders_lookup':
      case 'returns_refunds':
      case 'complaints':
      case 'reviews_ratings':
      case 'reviews':
      case 'customer_management':
        return <CustomerSupportModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
      case 'offers':
      case 'banners':
        return <OffersCouponsModule activeSubTab={activeTab} onSubTabChange={setActiveTab} />;
      case 'reports':
      case 'stock_reports':
      case 'delivery_reports':
        return <ReportsAnalyticsModule />;
      case 'settings':
      case 'store_settings':
        return <SettingsAuditModule />;
      default:
        // Default Dashboard View (Matching Reference PDF Pages 1-5)
        return (
          <div className="space-y-6">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{config.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{config.subtitle}</p>
              </div>
              <button
                onClick={() => alert('Filter: Last 30 Days data displayed.')}
                className="flex items-center gap-2 bg-white border border-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:border-watch-gold"
              >
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>Last 30 Days</span>
              </button>
            </div>

            {/* Hero Luxury Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-watch-navy-dark via-watch-navy to-gray-900 p-6 text-white flex items-center justify-between shadow-luxury-lg overflow-hidden relative border border-gray-800">
              <div className="relative z-10 max-w-lg">
                <span className="text-[11px] font-bold text-watch-gold uppercase tracking-wider block mb-1">
                  WatchHub
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight mb-1">{config.bannerTitle}</h3>
                <p className="text-xs text-gray-300">{config.bannerSubtitle}</p>
              </div>
              <div className="hidden sm:block relative z-10">
                <img src={watchBannerImg} alt="Watch" className="h-28 object-contain drop-shadow-2xl" />
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {config.kpis.map((kpi, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-500">{kpi.label}</span>
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${kpi.color}`}>
                      {kpi.icon}
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 mt-2">{kpi.value}</div>
                  <div className="flex items-center gap-1 text-[11px] font-bold mt-1">
                    {kpi.isUp ? (
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> {kpi.change}
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" /> {kpi.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Trend Chart */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-800">{config.trendTitle}</h4>
                  <span className="text-[11px] text-gray-400 font-medium">Revenue ⌄</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={config.trendData}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D9A441" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#D9A441" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="val" stroke="#D9A441" strokeWidth={2.5} fill="url(#colorTrend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut Status Chart */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <h4 className="text-xs font-bold text-gray-800 mb-2">{config.donutTitle}</h4>
                <div className="flex items-center justify-around gap-2">
                  <div className="w-28 h-28 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={config.donutData} innerRadius={28} outerRadius={46} dataKey="value" stroke="#fff" strokeWidth={2}>
                          {config.donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <p className="text-[10px] font-extrabold text-gray-800 leading-tight">{config.donutTotal.split(' ')[0]}</p>
                      <p className="text-[8px] text-gray-400">{config.donutTotal.split(' ')[1]}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    {config.donutData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                          {d.name}
                        </span>
                        <span className="font-bold text-gray-900">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Widget List */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-800">{config.widgetTitle}</h4>
                  <button onClick={() => setActiveTab('users')} className="text-[11px] text-blue-600 font-semibold hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2">
                  {config.widgetItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                      <span className="text-gray-700 font-medium">{item.label}</span>
                      <span className="font-bold text-gray-900">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Grid: Table, Center Ranking, Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Data Table */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm lg:col-span-1 overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-800">{config.tableTitle}</h4>
                  <button onClick={() => setActiveTab('orders')} className="text-[11px] text-blue-600 font-semibold hover:underline">
                    View All →
                  </button>
                </div>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase">
                      {config.tableHeaders.map((h, i) => (
                        <th key={i} className="pb-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {config.tableRows.map((r, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2.5 font-bold font-mono text-gray-900">{r.id}</td>
                        <td className="py-2.5 text-gray-600">{r.c1}</td>
                        <td className="py-2.5 font-bold text-gray-800">{r.c2}</td>
                        <td className="py-2.5">
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(r.status)}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-400 text-[10px]">{r.c4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Center Ranking List */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-800">{config.centerTitle}</h4>
                  <button onClick={() => setActiveTab('products')} className="text-[11px] text-blue-600 font-semibold hover:underline">
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {config.centerItems.map((prod, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <span className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {prod.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                        <p className="text-[10px] text-gray-500">{prod.rating}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {prod.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions 6-grid */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-bold text-gray-800 mb-3">⚡ Quick Actions</h4>
                <div className="grid grid-cols-3 gap-2">
                  {config.quickActions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(act.tab)}
                      className="p-3 bg-gray-50 hover:bg-white hover:border-watch-gold border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5 shadow-sm"
                    >
                      <span className="text-lg">{act.icon}</span>
                      <span className="text-[10.5px] font-semibold text-gray-800 text-center leading-tight">
                        {act.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
      {/* Upper Navigation Header (Switch Modules Horizontally) */}
      <DashboardHeader activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Main Body with Module Render */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {renderActiveModule()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>WatchHub | Role Dashboards, Technology Stack & Access Control • v2.4</span>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button onClick={() => setActiveTab('settings')} className="hover:text-watch-gold">
            System Settings
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('reports')} className="hover:text-watch-gold">
            Reports & Analytics
          </button>
          <span>•</span>
          <a href="/" className="text-watch-gold hover:underline">
            Visit Customer Store
          </a>
        </div>
      </footer>
    </div>
  );
};

export default RoleDashboard;
