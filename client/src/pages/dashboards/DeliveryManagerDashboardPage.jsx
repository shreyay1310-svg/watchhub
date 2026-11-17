import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';
import DeliveryManagerLayout from '../../components/delivery/DeliveryManagerLayout';

// 11 Dedicated Modules
import DashboardModule from '../../components/delivery/modules/DashboardModule';
import DeliveryOrdersModule from '../../components/delivery/modules/DeliveryOrdersModule';
import AssignDeliveriesModule from '../../components/delivery/modules/AssignDeliveriesModule';
import ShipmentTrackingModule from '../../components/delivery/modules/ShipmentTrackingModule';
import DeliveryPartnersModule from '../../components/delivery/modules/DeliveryPartnersModule';
import RoutePlanningModule from '../../components/delivery/modules/RoutePlanningModule';
import DeliveryAttemptsModule from '../../components/delivery/modules/DeliveryAttemptsModule';
import ReturnsPickupsModule from '../../components/delivery/modules/ReturnsPickupsModule';
import DeliveryReportsModule from '../../components/delivery/modules/DeliveryReportsModule';
import ServiceAreasModule from '../../components/delivery/modules/ServiceAreasModule';
import DeliverySettingsModule from '../../components/delivery/modules/DeliverySettingsModule';

// Central Data Store
import {
  INITIAL_DELIVERY_STATS,
  SHIPMENT_STATUS_BREAKDOWN,
  COURIER_PARTNERS,
  RIDERS_FLEET,
  INITIAL_DELIVERY_ORDERS,
  INITIAL_DELIVERY_ATTEMPTS,
  INITIAL_RETURNS_PICKUPS,
  INITIAL_SERVICE_AREAS,
  INITIAL_ROUTES,
  INITIAL_DELIVERY_SETTINGS,
} from '../../data/deliveryData';

import {
  CheckCircle,
  X,
  Printer,
  Eye,
  MapPin,
  Clock,
  Truck,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  Plus,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

// Error Boundary for resilient delivery module rendering
class DeliveryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[Delivery Manager Render Error]', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#11172C] border border-rose-500/50 rounded-2xl p-6 text-white text-center space-y-4 my-8 max-w-xl mx-auto shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold">Delivery Module Initializing</h2>
          <p className="text-xs text-[#A7B1C2]">
            {this.state.error?.message || 'Recovering delivery state buffer...'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 bg-[#6500FF] hover:bg-[#5700db] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DELIVERY_PATH_TO_TAB = {
  '/delivery-manager/dashboard': 'dashboard',
  '/delivery-manager': 'dashboard',
  '/delivery': 'dashboard',
  '/store-admin/delivery': 'dashboard',
  '/admin/delivery': 'dashboard',
  '/delivery-manager/orders': 'orders',
  '/delivery-manager/assign': 'assign',
  '/delivery-manager/tracking': 'tracking',
  '/delivery-manager/partners': 'partners',
  '/delivery-manager/routes': 'routes',
  '/delivery-manager/attempts': 'attempts',
  '/delivery-manager/returns': 'returns',
  '/delivery-manager/reports': 'reports',
  '/delivery-manager/areas': 'areas',
  '/delivery-manager/settings': 'settings',
};

const DELIVERY_TAB_TO_PATH = {
  dashboard: '/delivery-manager/dashboard',
  orders: '/delivery-manager/orders',
  assign: '/delivery-manager/assign',
  tracking: '/delivery-manager/tracking',
  partners: '/delivery-manager/partners',
  routes: '/delivery-manager/routes',
  attempts: '/delivery-manager/attempts',
  returns: '/delivery-manager/returns',
  reports: '/delivery-manager/reports',
  areas: '/delivery-manager/areas',
  settings: '/delivery-manager/settings',
};

export default function DeliveryManagerDashboardPage({ initialTab = 'dashboard' }) {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    if (initialTab && initialTab !== 'dashboard') return initialTab;
    const path = (location.pathname || '').toLowerCase().replace(/\/$/, '');
    return DELIVERY_PATH_TO_TAB[path] || initialTab || 'dashboard';
  };

  // Navigation tab state
  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Keep activeTab in sync with browser URL changes
  useEffect(() => {
    const tab = getTabFromPath();
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.pathname, initialTab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    const targetPath = DELIVERY_TAB_TO_PATH[tabId];
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  // Live Application State
  const [stats, setStats] = useState(INITIAL_DELIVERY_STATS);
  const [statusBreakdown, setStatusBreakdown] = useState(SHIPMENT_STATUS_BREAKDOWN);
  const [orders, setOrders] = useState(INITIAL_DELIVERY_ORDERS);
  const [riders, setRiders] = useState(RIDERS_FLEET);
  const [couriers, setCouriers] = useState(COURIER_PARTNERS);
  const [attempts, setAttempts] = useState(INITIAL_DELIVERY_ATTEMPTS);
  const [returnsList, setReturnsList] = useState(INITIAL_RETURNS_PICKUPS);
  const [routesList, setRoutesList] = useState(INITIAL_ROUTES);
  const [serviceAreas, setServiceAreas] = useState(INITIAL_SERVICE_AREAS);
  const [settings, setSettings] = useState(INITIAL_DELIVERY_SETTINGS);

  // Modals
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [showCreateShipmentModal, setShowCreateShipmentModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Form state for creating shipment
  const [createShipmentForm, setCreateShipmentForm] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    productName: 'Rolex Submariner Date 41mm',
    deliveryAddress: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    deliveryPartner: 'Blue Dart Express',
    partnerId: 'cp_bluedart',
    orderAmount: 18999,
    paymentType: 'Prepaid (Razorpay UPI)',
    priority: 'Urgent Express',
    expectedDeliveryDate: '18 Nov 2026, 04:00 PM',
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const el = document.getElementById('global-delivery-search');
        if (el) el.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Assign Orders Handler
  const handleAssignOrders = (orderIds, riderId, partnerName, priority, timeSlot, instructions) => {
    const rider = riders.find((r) => r.id === riderId);
    setOrders((prev) =>
      prev.map((order) => {
        if (orderIds.includes(order.orderId)) {
          return {
            ...order,
            rider: rider ? rider.name : 'Assigned Rider',
            riderId,
            riderPhone: rider ? rider.phone : order.riderPhone,
            deliveryPartner: partnerName || order.deliveryPartner,
            priority: priority || order.priority,
            deliveryStatus: 'Out for Delivery',
            eta: `Assigned to ${rider ? rider.name : 'rider'} (${timeSlot})`,
            notes: instructions || order.notes,
            trackingTimeline: [
              ...order.trackingTimeline,
              {
                stage: 'Rider Assigned',
                date: '17 Nov 2026',
                time: '01:00 PM',
                location: `${order.city} Hub`,
                status: 'Completed',
                desc: `Assigned to ${rider?.name} for doorstep dispatch (${timeSlot}).`,
              },
            ],
          };
        }
        return order;
      })
    );

    // Update rider active orders count
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, activeOrders: r.activeOrders + orderIds.length, status: 'On Delivery' } : r))
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      outForDelivery: prev.outForDelivery + orderIds.length,
    }));

    triggerToast(`Assigned ${orderIds.length} order(s) to ${rider?.name}!`);
  };

  // 2. Update Order Status Handler
  const handleUpdateOrderStatus = (orderId, newStatus, note) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          return {
            ...order,
            deliveryStatus: newStatus,
            trackingTimeline: [
              ...order.trackingTimeline,
              {
                stage: newStatus,
                date: '17 Nov 2026',
                time: '01:15 PM',
                location: `${order.city} Logistics Point`,
                status: newStatus === 'Delivered' ? 'Completed' : 'Active',
                desc: note || `Milestone updated to ${newStatus} by Delivery Manager.`,
              },
            ],
          };
        }
        return order;
      })
    );

    triggerToast(`Order #${orderId} status updated to ${newStatus}`);
  };

  // 3. Add Tracking Checkpoint Event
  const handleAddTrackingEvent = (orderId, newEvent) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          return {
            ...order,
            deliveryStatus: newEvent.stage === 'Delivered' ? 'Delivered' : order.deliveryStatus,
            trackingTimeline: [...order.trackingTimeline, newEvent],
          };
        }
        return order;
      })
    );
    triggerToast(`Checkpoint added to Order #${orderId}`);
  };

  // 4. Create Shipment
  const handleCreateShipmentSubmit = (e) => {
    e.preventDefault();
    const newOrderId = `WH-ORD-${Math.floor(9100 + Math.random() * 900)}`;
    const newAwb = `BLU${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder = {
      orderId: newOrderId,
      awbNumber: newAwb,
      orderDate: 'Today, 17 Nov 2026',
      customerName: createShipmentForm.customerName,
      mobileNumber: createShipmentForm.mobileNumber,
      email: createShipmentForm.email,
      productImage: '/images/products/featured_rolex_submariner.jpg',
      productName: createShipmentForm.productName,
      productCategory: 'Luxury Automatic',
      deliveryAddress: createShipmentForm.deliveryAddress,
      city: createShipmentForm.city,
      state: createShipmentForm.state,
      pincode: createShipmentForm.pincode,
      deliveryPartner: createShipmentForm.deliveryPartner,
      partnerId: createShipmentForm.partnerId,
      rider: 'Unassigned',
      riderId: null,
      riderPhone: null,
      paymentType: createShipmentForm.paymentType,
      orderAmount: createShipmentForm.orderAmount,
      formattedAmount: `₹${Number(createShipmentForm.orderAmount).toLocaleString()}`,
      deliveryStatus: 'Processing',
      priority: createShipmentForm.priority,
      expectedDeliveryDate: createShipmentForm.expectedDeliveryDate,
      eta: 'Processing at Vault',
      coords: { lat: 28.6139, lng: 77.2090 },
      securityOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      notes: 'New shipment generated via Delivery Manager Portal.',
      trackingTimeline: [
        {
          stage: 'Order Confirmed',
          date: '17 Nov 2026',
          time: '01:00 PM',
          location: 'WatchHub Online Store',
          status: 'Completed',
          desc: 'Shipment created and registered in central logistics engine.',
        },
        {
          stage: 'Processing',
          date: '17 Nov 2026',
          time: '01:15 PM',
          location: 'Central Vault WH-01, New Delhi',
          status: 'Active',
          desc: 'Watch undergoing multi-point chronometric inspection.',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setStats((prev) => ({ ...prev, totalShipments: prev.totalShipments + 1 }));
    setShowCreateShipmentModal(false);
    triggerToast(`Shipment created with AWB ${newAwb} for ${newOrder.customerName}`);
  };

  // 5. Toggle Rider Status
  const handleToggleRiderStatus = (riderId) => {
    setRiders((prev) =>
      prev.map((r) => {
        if (r.id === riderId) {
          const next = r.status === 'Available' ? 'Offline' : r.status === 'Offline' ? 'Available' : 'Available';
          return { ...r, status: next };
        }
        return r;
      })
    );
    triggerToast('Rider status updated');
  };

  // 6. Toggle Partner Status
  const handleTogglePartnerStatus = (partnerId) => {
    setCouriers((prev) =>
      prev.map((cp) => (cp.id === partnerId ? { ...cp, status: cp.status === 'Active' ? 'Inactive' : 'Active' } : cp))
    );
    triggerToast('Courier partner status toggled');
  };

  // 7. Add Partner
  const handleAddPartner = (newPartner) => {
    setCouriers((prev) => [...prev, newPartner]);
    triggerToast(`Added ${newPartner.name} to courier network`);
  };

  // 8. Add Rider
  const handleAddRider = (newRider) => {
    setRiders((prev) => [...prev, newRider]);
    triggerToast(`Onboarded rider ${newRider.name}`);
  };

  // 9. Record Delivery Attempt
  const handleRecordAttempt = (newAttempt) => {
    setAttempts((prev) => [newAttempt, ...prev]);
    setStats((prev) => ({
      ...prev,
      deliveryAttempts: prev.deliveryAttempts + 1,
      failedDeliveries: newAttempt.deliveryResult === 'Failed' ? prev.failedDeliveries + 1 : prev.failedDeliveries,
    }));
    triggerToast(`Recorded doorstep attempt for Order #${newAttempt.orderId}`);
  };

  // 10. Schedule Return Pickup
  const handleScheduleReturnPickup = (returnId, riderName, riderId, pickupDate, notes) => {
    setReturnsList((prev) =>
      prev.map((ret) =>
        ret.returnId === returnId
          ? { ...ret, returnStatus: 'Pickup Assigned', assignedRider: riderName, riderId, pickupDate, inspectionNotes: notes }
          : ret
      )
    );
    triggerToast(`Pickup assigned to ${riderName}`);
  };

  // 11. Update Return Status
  const handleUpdateReturnStatus = (returnId, newStatus) => {
    setReturnsList((prev) =>
      prev.map((ret) => (ret.returnId === returnId ? { ...ret, returnStatus: newStatus } : ret))
    );
    triggerToast(`Return #${returnId} marked as ${newStatus}`);
  };

  // 12. Create Route
  const handleCreateRoute = (newRoute) => {
    setRoutesList((prev) => [newRoute, ...prev]);
    triggerToast(`Route ${newRoute.routeName} generated & assigned to ${newRoute.riderName}`);
  };

  // 13. Add Service Area
  const handleAddServiceArea = (newArea) => {
    setServiceAreas((prev) => [...prev, newArea]);
    triggerToast(`Service corridor ${newArea.areaName} activated`);
  };

  // 14. Toggle Service Area Status
  const handleToggleAreaStatus = (areaId) => {
    setServiceAreas((prev) =>
      prev.map((a) => (a.areaId === areaId ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a))
    );
    triggerToast('Service area coverage updated');
  };

  // 15. Save Settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    triggerToast('Logistics SLA and dispatch settings updated');
  };

  return (
    <DeliveryManagerLayout
      activeTab={activeTab}
      setActiveTab={handleSelectTab}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onOpenCreateShipment={() => setShowCreateShipmentModal(true)}
      onOpenSupportModal={() => setShowSupportModal(true)}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#11172C] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#00D5FF]/40 flex items-center gap-3 animate-fade-in text-xs font-semibold backdrop-blur-md">
          <CheckCircle className="w-4 h-4 text-[#00C98B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RENDER THE ACTIVE DEDICATED MODULE (Protected by DeliveryErrorBoundary) */}
      <DeliveryErrorBoundary>
        {activeTab === 'dashboard' && (
          <DashboardModule
            stats={stats}
            statusBreakdown={statusBreakdown}
            orders={orders}
            riders={riders}
            couriers={couriers}
            setActiveTab={handleSelectTab}
            onOpenCreateShipment={() => setShowCreateShipmentModal(true)}
            onSelectOrderForTracking={(order) => {
              setSelectedOrderForTracking(order);
              handleSelectTab('tracking');
            }}
            onSelectOrderForDetail={(order) => setSelectedOrderForDetail(order)}
          />
        )}

        {activeTab === 'orders' && (
          <DeliveryOrdersModule
            orders={orders}
            riders={riders}
            couriers={couriers}
            onOpenCreateShipment={() => setShowCreateShipmentModal(true)}
            onSelectOrderForTracking={(order) => {
              setSelectedOrderForTracking(order);
              handleSelectTab('tracking');
            }}
            onSelectOrderForDetail={(order) => setSelectedOrderForDetail(order)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAssignOrder={(order) => {
              handleSelectTab('assign');
            }}
          />
        )}

        {activeTab === 'assign' && (
          <AssignDeliveriesModule
            orders={orders}
            riders={riders}
            couriers={couriers}
            onAssignOrders={handleAssignOrders}
          />
        )}

        {activeTab === 'tracking' && (
          <ShipmentTrackingModule
            orders={orders}
            riders={riders}
            selectedOrder={selectedOrderForTracking}
            onSelectOrder={(o) => setSelectedOrderForTracking(o)}
            onAddTrackingEvent={handleAddTrackingEvent}
          />
        )}

        {activeTab === 'partners' && (
          <DeliveryPartnersModule
            couriers={couriers}
            riders={riders}
            onAddPartner={handleAddPartner}
            onAddRider={handleAddRider}
            onToggleRiderStatus={handleToggleRiderStatus}
            onTogglePartnerStatus={handleTogglePartnerStatus}
          />
        )}

        {activeTab === 'routes' && (
          <RoutePlanningModule
            routes={routesList}
            orders={orders}
            riders={riders}
            couriers={couriers}
            onCreateRoute={handleCreateRoute}
          />
        )}

        {activeTab === 'attempts' && (
          <DeliveryAttemptsModule
            attempts={attempts}
            orders={orders}
            riders={riders}
            onRecordAttempt={handleRecordAttempt}
            onScheduleReattempt={(attemptId) => {
              triggerToast('Reattempt scheduled for next delivery morning slot');
            }}
          />
        )}

        {activeTab === 'returns' && (
          <ReturnsPickupsModule
            returns={returnsList}
            orders={orders}
            riders={riders}
            onUpdateReturnStatus={handleUpdateReturnStatus}
            onScheduleReturnPickup={handleScheduleReturnPickup}
          />
        )}

        {activeTab === 'reports' && (
          <DeliveryReportsModule
            orders={orders}
            riders={riders}
            couriers={couriers}
            attempts={attempts}
            returns={returnsList}
          />
        )}

        {activeTab === 'areas' && (
          <ServiceAreasModule
            serviceAreas={serviceAreas}
            onAddArea={handleAddServiceArea}
            onToggleAreaStatus={handleToggleAreaStatus}
          />
        )}

        {activeTab === 'settings' && (
          <DeliverySettingsModule
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </DeliveryErrorBoundary>

      {/* MODAL: ORDER DETAILS DRAWER / MODAL */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-white space-y-5 custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#28334B]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedOrderForDetail.productImage}
                  alt={selectedOrderForDetail.productName}
                  className="w-14 h-14 rounded-xl object-contain bg-[#081529] border border-[#28334B] p-1 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-white">
                      Order #{selectedOrderForDetail.orderId}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedOrderForDetail.deliveryStatus === 'Delivered'
                          ? 'bg-[#00C98B]/20 text-[#00C98B]'
                          : 'bg-[#00D5FF]/20 text-[#00D5FF]'
                      }`}
                    >
                      {selectedOrderForDetail.deliveryStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#A7B1C2]">
                    Air Waybill: <strong className="font-mono text-[#00D5FF]">{selectedOrderForDetail.awbNumber}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="text-[#A7B1C2] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product & Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] space-y-1.5">
                <span className="font-bold text-white text-sm block">{selectedOrderForDetail.productName}</span>
                <p className="text-[#A7B1C2]">Category: {selectedOrderForDetail.productCategory}</p>
                <p className="text-[#E9B94F] font-bold text-sm">Value: {selectedOrderForDetail.formattedAmount}</p>
                <p className="text-[#A7B1C2]">Payment: {selectedOrderForDetail.paymentType}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] space-y-1.5">
                <span className="font-bold text-white text-sm block">Customer & Destination</span>
                <p className="text-white font-medium">{selectedOrderForDetail.customerName}</p>
                <p className="text-[#A7B1C2]">{selectedOrderForDetail.mobileNumber}</p>
                <p className="text-[#A7B1C2]">{selectedOrderForDetail.deliveryAddress}, {selectedOrderForDetail.city} - {selectedOrderForDetail.pincode}</p>
              </div>
            </div>

            {/* Shipment & Rider Information */}
            <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#A7B1C2] text-[10px] block">Courier Partner</span>
                <span className="font-bold text-white">{selectedOrderForDetail.deliveryPartner}</span>
              </div>
              <div>
                <span className="text-[#A7B1C2] text-[10px] block">Designated City Rider</span>
                <span className="font-bold text-[#E9B94F]">{selectedOrderForDetail.rider}</span>
                <span className="text-[10px] text-[#A7B1C2] block">{selectedOrderForDetail.riderPhone}</span>
              </div>
              <div>
                <span className="text-[#A7B1C2] text-[10px] block">Expected Delivery ETA</span>
                <span className="font-bold text-[#00C98B]">{selectedOrderForDetail.expectedDeliveryDate}</span>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div>
              <span className="font-bold text-xs text-white block mb-2">Milestone Tracking History</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar text-xs">
                {selectedOrderForDetail.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#081529] border border-[#28334B] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{step.stage}</span>
                      <span className="text-[10px] text-[#A7B1C2]">{step.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#00D5FF] font-mono block">{step.time}</span>
                      <span className="text-[10px] text-[#A7B1C2]">{step.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#28334B]">
              <button
                onClick={() => {
                  setSelectedOrderForTracking(selectedOrderForDetail);
                  setSelectedOrderForDetail(null);
                  setActiveTab('tracking');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#00D5FF] hover:underline"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open Live Map Tracking</span>
              </button>

              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SHIPMENT MODAL */}
      {showCreateShipmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#00D5FF]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Create Outbound Watch Shipment
                </h3>
              </div>
              <button onClick={() => setShowCreateShipmentModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipmentSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={createShipmentForm.customerName}
                    onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, customerName: e.target.value })}
                    placeholder="e.g. Alok Singhal"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={createShipmentForm.mobileNumber}
                    onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, mobileNumber: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Watch Model</label>
                <input
                  type="text"
                  required
                  value={createShipmentForm.productName}
                  onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, productName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={createShipmentForm.deliveryAddress}
                  onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, deliveryAddress: e.target.value })}
                  placeholder="Villa / Flat number, building, sector"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    value={createShipmentForm.city}
                    onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">State</label>
                  <input
                    type="text"
                    value={createShipmentForm.state}
                    onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={createShipmentForm.pincode}
                    onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Carrier Partner</label>
                  <select
                    value={createShipmentForm.deliveryPartner}
                    onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, deliveryPartner: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white cursor-pointer"
                  >
                    {couriers.map((cp) => (
                      <option key={cp.id} value={cp.name}>{cp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Order Amount (₹)</label>
                  <input
                    type="number"
                    value={createShipmentForm.orderAmount}
                    onChange={(e) => setCreateShipmentForm({ ...createShipmentForm, orderAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
                <button
                  type="button"
                  onClick={() => setShowCreateShipmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold"
                >
                  Generate Air Waybill & Label
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HELP & LOGISTICS SUPPORT */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#E9B94F]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Logistics Command Support
                </h3>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B] space-y-1">
                <span className="font-bold text-white block">Central Dispatch Desk (24/7)</span>
                <p className="text-[#A7B1C2]">Phone: +91 1800 209 8890 (Toll Free)</p>
                <p className="text-[#00D5FF]">Email: logistics@watchhub.com</p>
              </div>

              <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B] space-y-1">
                <span className="font-bold text-[#E9B94F] block">Rider Fleet Emergency Hotline</span>
                <p className="text-[#A7B1C2]">Direct line for on-road rider assistance, vehicle breakdown and route divergence.</p>
                <p className="text-white font-mono font-bold mt-1">+91 98110 99881</p>
              </div>

              <div className="p-3 rounded-xl bg-[#081529] border border-[#28334B] space-y-1">
                <span className="font-bold text-[#00C98B] block">Transit Insurance Claim Team</span>
                <p className="text-[#A7B1C2]">For damaged packaging or inspection discrepancies.</p>
                <p className="text-[#00D5FF]">claims@watchhub-insurance.com</p>
              </div>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
            >
              Close Support Desk
            </button>
          </div>
        </div>
      )}
    </DeliveryManagerLayout>
  );
}
