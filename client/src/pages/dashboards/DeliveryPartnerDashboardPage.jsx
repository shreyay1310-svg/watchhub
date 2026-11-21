import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RiderLayout from '../../components/rider/RiderLayout';
import DashboardModule from '../../components/rider/modules/DashboardModule';
import AssignedDeliveriesModule from '../../components/rider/modules/AssignedDeliveriesModule';
import CompletedOrdersModule from '../../components/rider/modules/CompletedOrdersModule';
import EarningsPayoutsModule from '../../components/rider/modules/EarningsPayoutsModule';
import DeliveryHistoryModule from '../../components/rider/modules/DeliveryHistoryModule';
import PerformanceModule from '../../components/rider/modules/PerformanceModule';
import MyProfileModule from '../../components/rider/modules/MyProfileModule';
import SupportModule from '../../components/rider/modules/SupportModule';
import SettingsModule from '../../components/rider/modules/SettingsModule';
import DeliveryOtpModal from '../../components/rider/modals/DeliveryOtpModal';
import ReportIssueModal from '../../components/rider/modals/ReportIssueModal';

const INITIAL_DELIVERIES = [
  {
    id: 'WH12548',
    orderNumber: '#WH12548',
    customer: 'Ananya Singh',
    customerPhone: '+91 98765 11223',
    customerEmail: 'ananya.s@example.com',
    productName: 'Rolex Submariner Date 41mm',
    productImage: '/images/products/rolex-submariner.png',
    amount: '₹18,999 (Prepaid UPI)',
    rawAmount: 18999,
    paymentMethod: 'Prepaid UPI',
    address: 'House 42, Gomti Nagar Extension, Lucknow',
    distance: '2.4 km away',
    status: 'Out for Delivery',
    time: '12:40 PM',
    eta: '12:40 PM',
    otp: '4829',
  },
  {
    id: 'WH12547',
    orderNumber: '#WH12547',
    customer: 'Rahul Verma',
    customerPhone: '+91 98765 44556',
    customerEmail: 'rahul.v@example.com',
    productName: 'Omega Speedmaster Professional',
    productImage: '/images/products/omega-speedmaster.png',
    amount: '₹16,499 (Cash on Delivery)',
    rawAmount: 16499,
    paymentMethod: 'Cash on Delivery',
    address: 'Flat 302, Royal Enclave, Indira Nagar, Lucknow',
    distance: '5.1 km away',
    status: 'Out for Delivery',
    time: '01:15 PM',
    eta: '01:15 PM',
    otp: '7391',
  },
  {
    id: 'WH12546',
    orderNumber: '#WH12546',
    customer: 'Priya Yadav',
    customerPhone: '+91 98765 77889',
    customerEmail: 'priya.y@example.com',
    productName: 'Cartier Tank Must Rose Gold',
    productImage: '/images/products/cartier-tank.png',
    amount: '₹3,49,000 (Prepaid Card)',
    rawAmount: 349000,
    paymentMethod: 'Prepaid Card',
    address: 'Sector B, Aliganj Main Market, Lucknow',
    distance: '8.3 km away',
    status: 'Out for Delivery',
    time: '02:00 PM',
    eta: '02:00 PM',
    otp: '5512',
  },
  {
    id: 'WH12545',
    orderNumber: '#WH12545',
    customer: 'Rohit Kumar',
    customerPhone: '+91 98765 99001',
    customerEmail: 'rohit.k@example.com',
    productName: 'Apple Watch Series 10',
    productImage: '/images/products/apple-watch-s10.png',
    amount: '₹46,900 (Prepaid NetBanking)',
    rawAmount: 46900,
    paymentMethod: 'Prepaid NetBanking',
    address: 'Near GPO, Hazratganj, Lucknow',
    distance: '10.5 km away',
    status: 'Assigned',
    time: '02:45 PM',
    eta: '02:45 PM',
    otp: '8210',
  },
];

export default function DeliveryPartnerDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);

  // Modals
  const [selectedOtpDelivery, setSelectedOtpDelivery] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Sync tab with URL if needed
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('assigned')) setActiveTab('assigned');
    else if (path.includes('completed')) setActiveTab('completed');
    else if (path.includes('earnings')) setActiveTab('earnings');
    else if (path.includes('history')) setActiveTab('history');
    else if (path.includes('performance')) setActiveTab('performance');
    else if (path.includes('profile')) setActiveTab('profile');
    else if (path.includes('support')) setActiveTab('support');
    else if (path.includes('settings')) setActiveTab('settings');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  // Fetch live dashboard deliveries from backend
  useEffect(() => {
    let isMounted = true;
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/rider/dashboard');
        const json = await res.json();
        if (json.status === 'success' && json.data && isMounted) {
          if (json.data.deliveries && json.data.deliveries.length > 0) {
            setDeliveries(json.data.deliveries);
          }
          if (json.data.duty) {
            setIsOnDuty(json.data.duty.isOnDuty);
          }
        }
      } catch (e) {
        console.warn('Rider live sync note:', e);
      }
    };
    fetchLive();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleVerifySuccess = (deliveryId) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, status: 'Delivered' } : d))
    );
  };

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardModule
            deliveries={deliveries}
            onOpenOtpModal={(d) => setSelectedOtpDelivery(d)}
            onOpenIssueModal={() => setIsIssueModalOpen(true)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'assigned':
        return (
          <AssignedDeliveriesModule
            deliveries={deliveries}
            onOpenOtpModal={(d) => setSelectedOtpDelivery(d)}
            onOpenIssueModal={() => setIsIssueModalOpen(true)}
          />
        );
      case 'completed':
        return <CompletedOrdersModule deliveries={deliveries} />;
      case 'earnings':
        return <EarningsPayoutsModule />;
      case 'history':
        return <DeliveryHistoryModule />;
      case 'performance':
        return <PerformanceModule />;
      case 'profile':
        return <MyProfileModule isOnDuty={isOnDuty} />;
      case 'support':
        return <SupportModule onOpenIssueModal={() => setIsIssueModalOpen(true)} />;
      case 'settings':
        return <SettingsModule isOnDuty={isOnDuty} setIsOnDuty={setIsOnDuty} />;
      default:
        return (
          <DashboardModule
            deliveries={deliveries}
            onOpenOtpModal={(d) => setSelectedOtpDelivery(d)}
            onOpenIssueModal={() => setIsIssueModalOpen(true)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <RiderLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isOnDuty={isOnDuty}
      setIsOnDuty={setIsOnDuty}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      assignedCount={deliveries.filter((d) => d.status !== 'Delivered').length}
    >
      {renderModule()}

      {/* Delivery OTP Handover Verification Modal */}
      <DeliveryOtpModal
        isOpen={!!selectedOtpDelivery}
        onClose={() => setSelectedOtpDelivery(null)}
        delivery={selectedOtpDelivery}
        onVerifySuccess={handleVerifySuccess}
      />

      {/* Emergency / Report Issue Modal */}
      <ReportIssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        defaultOrderId={deliveries[0]?.id || ''}
      />
    </RiderLayout>
  );
}
