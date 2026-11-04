import React, { useState } from 'react';
import { Search, Filter, Eye, Truck, CheckCircle2, Clock, XCircle, Printer } from 'lucide-react';

const INITIAL_ORDERS = [
  { id: '#WH12548', customer: 'Ananya Singh', email: 'ananya@gmail.com', city: 'Lucknow', items: 'Classic Chronograph Watch (x1)', amount: 2999, payment: 'Paid (UPI)', status: 'Delivered', date: '04 Nov 2026', courier: 'BlueDart Express', trackingId: 'BLU-889124' },
  { id: '#WH12547', customer: 'Rahul Verma', email: 'rahul.v@gmail.com', city: 'Kanpur', items: 'Combo – Men & Women Pair (x1)', amount: 3499, payment: 'Paid (Card)', status: 'Out for Delivery', date: '04 Nov 2026', courier: 'Delhivery', trackingId: 'DLV-442190' },
  { id: '#WH12546', customer: 'Priya Yadav', email: 'priya.y@gmail.com', city: 'Varanasi', items: 'Elegant Partywear Watch (x1)', amount: 1899, payment: 'Pending (COD)', status: 'Processing', date: '03 Nov 2026', courier: 'Shadowfax', trackingId: 'SHD-901244' },
  { id: '#WH12545', customer: 'Rohit Kumar', email: 'rohit@gmail.com', city: 'Lucknow', items: 'Smartwatch Pro AMOLED (x1)', amount: 2749, payment: 'Paid (UPI)', status: 'Delivered', date: '03 Nov 2026', courier: 'BlueDart Express', trackingId: 'BLU-889045' },
  { id: '#WH12544', customer: 'Sneha Patel', email: 'sneha@gmail.com', city: 'Sitapur', items: 'Waterproof Diver 200M (x1)', amount: 3299, payment: 'Refunded', status: 'Cancelled', date: '02 Nov 2026', courier: 'N/A', trackingId: 'N/A' },
  { id: '#WH12543', customer: 'Kunal Kapoor', email: 'kunal@gmail.com', city: 'Delhi NCR', items: 'Digital Sports Tactical Watch (x2)', amount: 2798, payment: 'Paid (Card)', status: 'Shipped', date: '02 Nov 2026', courier: 'BlueDart Express', trackingId: 'BLU-773199' },
];

export const OrdersManagementModule = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Processing': return 'bg-amber-100 text-amber-800';
      default: return 'bg-rose-100 text-rose-800';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🛒</span> Orders Fulfillment & Lifecycle Management
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor, pack, assign courier tracking and process customer orders across India.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, customer, city..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 outline-none focus:border-watch-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold bg-white text-gray-800"
          >
            <option value="All">All Statuses ({orders.length})</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10.5px]">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Courier / Tracking</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold font-mono text-gray-900">{o.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{o.customer}</p>
                    <p className="text-[11px] text-gray-500">{o.city}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-700 max-w-[180px] truncate">{o.items}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">₹{o.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                      {o.payment}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className={`text-[10.5px] font-bold px-2 py-1 rounded-full outline-none cursor-pointer border-0 ${getStatusBadge(o.status)}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-800 font-medium">{o.courier}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{o.trackingId}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-watch-gold"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Order Invoice {selectedOrder.id}</h3>
                <p className="text-xs text-gray-400">Date: {selectedOrder.date}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadge(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-800">Customer Details:</p>
                <p className="text-gray-600">{selectedOrder.customer} ({selectedOrder.email})</p>
                <p className="text-gray-600">Shipping Location: {selectedOrder.city}, India</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-800">Purchased Timepiece:</p>
                <p className="text-gray-700">{selectedOrder.items}</p>
                <p className="font-bold text-watch-navy mt-1">Total Paid: ₹{selectedOrder.amount.toLocaleString('en-IN')} via {selectedOrder.payment}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-800">Logistics & Tracking:</p>
                <p className="text-gray-600">Carrier: {selectedOrder.courier}</p>
                <p className="text-gray-600 font-mono">Waybill Tracking ID: {selectedOrder.trackingId}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-5 mt-4 border-t border-gray-100">
              <button
                onClick={() => alert(`Printing official tax invoice for ${selectedOrder.id}...`)}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-watch-gold font-semibold"
              >
                <Printer className="w-4 h-4" /> Print Tax Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-gold text-xs py-1.5 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagementModule;

