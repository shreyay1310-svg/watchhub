import React, { useState, useEffect, useMemo, Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerSupportLayout from '../../components/support/CustomerSupportLayout';
import {
  INITIAL_SUPPORT_STATS,
  TICKET_STATUS_BREAKDOWN,
  TICKET_TREND_DATA,
  MONTHLY_TICKET_TRENDS,
  CATEGORY_DISTRIBUTION,
  INITIAL_SUPPORT_AGENTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS_RETURNS,
  INITIAL_REFUNDS,
  INITIAL_ESCALATIONS,
  INITIAL_KNOWLEDGE_BASE,
  INITIAL_CANNED_RESPONSES,
  INITIAL_CHATS,
  INITIAL_SUPPORT_SETTINGS,
} from '../../data/supportData';

// Modules
import DashboardModule from '../../components/support/modules/DashboardModule';
import SupportTicketsModule from '../../components/support/modules/SupportTicketsModule';
import LiveChatModule from '../../components/support/modules/LiveChatModule';
import CustomersModule from '../../components/support/modules/CustomersModule';
import OrdersReturnsModule from '../../components/support/modules/OrdersReturnsModule';
import RefundsReplacementsModule from '../../components/support/modules/RefundsReplacementsModule';
import EscalationsModule from '../../components/support/modules/EscalationsModule';
import KnowledgeBaseModule from '../../components/support/modules/KnowledgeBaseModule';
import CannedResponsesModule from '../../components/support/modules/CannedResponsesModule';
import ReportsAnalyticsModule from '../../components/support/modules/ReportsAnalyticsModule';
import TeamPermissionsModule from '../../components/support/modules/TeamPermissionsModule';
import SupportSettingsModule from '../../components/support/modules/SupportSettingsModule';

// Error Boundary
class SupportErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Customer Support Portal Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-[#111729] border border-[#EF4444]/30 text-white space-y-4">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <span className="text-xl">⚠️</span>
            <h3 className="text-lg font-bold">Module Loading Exception</h3>
          </div>
          <p className="text-xs text-[#A7B1C2]">
            An unexpected error occurred while rendering this module.
          </p>
          <pre className="p-4 bg-[#070918] rounded-xl text-xs text-[#EF4444] font-mono overflow-auto">
            {this.state.error?.message || 'Unknown Error'}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-[#00D9E8] text-[#070918] font-bold text-xs rounded-xl"
          >
            Retry Loading
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PATH_TO_TAB = {
  '/customer-support': 'dashboard',
  '/customer-support/dashboard': 'dashboard',
  '/customer-support/tickets': 'tickets',
  '/customer-support/live-chat': 'live-chat',
  '/customer-support/customers': 'customers',
  '/customer-support/orders-returns': 'orders-returns',
  '/customer-support/refunds': 'refunds',
  '/customer-support/escalations': 'escalations',
  '/customer-support/knowledge-base': 'knowledge-base',
  '/customer-support/canned-responses': 'canned-responses',
  '/customer-support/reports': 'reports',
  '/customer-support/team': 'team',
  '/customer-support/settings': 'settings',
};

const TAB_TO_PATH = {
  dashboard: '/customer-support/dashboard',
  tickets: '/customer-support/tickets',
  'live-chat': '/customer-support/live-chat',
  customers: '/customer-support/customers',
  'orders-returns': '/customer-support/orders-returns',
  refunds: '/customer-support/refunds',
  escalations: '/customer-support/escalations',
  'knowledge-base': '/customer-support/knowledge-base',
  'canned-responses': '/customer-support/canned-responses',
  reports: '/customer-support/reports',
  team: '/customer-support/team',
  settings: '/customer-support/settings',
};

export const CustomerSupportDashboardPage = ({ initialTab = 'dashboard' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve current active tab from prop or URL pathname
  const currentPath = location.pathname.toLowerCase();
  const currentTabFromPath = PATH_TO_TAB[currentPath] || initialTab;

  const [activeTab, setActiveTabState] = useState(currentTabFromPath);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Synchronize with URL route
  useEffect(() => {
    if (PATH_TO_TAB[currentPath] && PATH_TO_TAB[currentPath] !== activeTab) {
      setActiveTabState(PATH_TO_TAB[currentPath]);
    }
  }, [currentPath]);

  const handleTabChange = (tabId) => {
    setActiveTabState(tabId);
    const targetPath = TAB_TO_PATH[tabId] || '/customer-support/dashboard';
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  // Central Application Data State
  const [stats, setStats] = useState(INITIAL_SUPPORT_STATS);
  const [statusBreakdown, setStatusBreakdown] = useState(TICKET_STATUS_BREAKDOWN);
  const [trendData, setTrendData] = useState(TICKET_TREND_DATA);
  const [tickets, setTickets] = useState(INITIAL_SUPPORT_TICKETS);
  const [agents, setAgents] = useState(INITIAL_SUPPORT_AGENTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [ordersReturns, setOrdersReturns] = useState(INITIAL_ORDERS_RETURNS);
  const [refunds, setRefunds] = useState(INITIAL_REFUNDS);
  const [escalations, setEscalations] = useState(INITIAL_ESCALATIONS);
  const [knowledgeBase, setKnowledgeBase] = useState(INITIAL_KNOWLEDGE_BASE);
  const [cannedResponses, setCannedResponses] = useState(INITIAL_CANNED_RESPONSES);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [settings, setSettings] = useState(INITIAL_SUPPORT_SETTINGS);

  // Selected Ticket for Cross-Module Navigation
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleOpenCreateTicket = () => {
    handleTabChange('tickets');
  };

  const handleConvertToTicket = (chatItem) => {
    const newId = `TIC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newId,
      customerName: chatItem.customerName,
      customerEmail: chatItem.customerEmail || 'vip@client.com',
      customerPhone: chatItem.customerPhone || '+91 98200 12345',
      orderId: chatItem.orderId || 'WH-ORD-9024',
      watchModel: chatItem.watchModel || 'Rolex Submariner Date',
      category: 'Shipping & Delivery',
      priority: 'High',
      status: 'Open',
      assignedTo: 'Pooja Sharma',
      subject: `Live Chat Inquiry: ${chatItem.watchModel}`,
      description: chatItem.lastMessage || 'Customer requested live support.',
      createdAt: 'Just now',
      slaDue: 'In 2 hours',
      messages: (chatItem.messages || []).map((m) => ({
        id: m.id,
        sender: m.sender === 'agent' ? 'Pooja Sharma' : chatItem.customerName,
        senderType: m.sender === 'agent' ? 'support' : 'customer',
        timestamp: m.timestamp,
        text: m.text,
      })),
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newId);
    handleTabChange('tickets');
  };

  return (
    <CustomerSupportLayout
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      searchQuery={globalSearchQuery}
      setSearchQuery={setGlobalSearchQuery}
      onOpenCreateTicket={handleOpenCreateTicket}
      onOpenQuickChat={() => handleTabChange('live-chat')}
    >
      <SupportErrorBoundary>
        {activeTab === 'dashboard' && (
          <DashboardModule
            stats={stats}
            statusBreakdown={statusBreakdown}
            trendData={trendData}
            tickets={tickets}
            agents={agents}
            onNavigateTab={handleTabChange}
            onOpenCreateTicket={handleOpenCreateTicket}
            onSelectTicket={(ticket) => {
              setSelectedTicketId(ticket.id);
              handleTabChange('tickets');
            }}
          />
        )}

        {activeTab === 'tickets' && (
          <SupportTicketsModule
            tickets={tickets}
            setTickets={setTickets}
            agents={agents}
            cannedResponses={cannedResponses}
            selectedTicketId={selectedTicketId}
            setSelectedTicketId={setSelectedTicketId}
            searchQuery={globalSearchQuery}
            setSearchQuery={setGlobalSearchQuery}
            onOpenCreateModal={handleOpenCreateTicket}
          />
        )}

        {activeTab === 'live-chat' && (
          <LiveChatModule
            chats={chats}
            setChats={setChats}
            cannedResponses={cannedResponses}
            onConvertToTicket={handleConvertToTicket}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersModule
            customers={customers}
            setCustomers={setCustomers}
            onOpenCreateTicketForCustomer={(cust) => {
              handleOpenCreateTicket();
            }}
          />
        )}

        {activeTab === 'orders-returns' && (
          <OrdersReturnsModule
            ordersReturns={ordersReturns}
            setOrdersReturns={setOrdersReturns}
            onNavigateTab={handleTabChange}
          />
        )}

        {activeTab === 'refunds' && (
          <RefundsReplacementsModule
            refunds={refunds}
            setRefunds={setRefunds}
            onOpenCreateTicket={handleOpenCreateTicket}
          />
        )}

        {activeTab === 'escalations' && (
          <EscalationsModule
            escalations={escalations}
            setEscalations={setEscalations}
            agents={agents}
            onOpenTicket={(ticketId) => {
              setSelectedTicketId(ticketId);
              handleTabChange('tickets');
            }}
          />
        )}

        {activeTab === 'knowledge-base' && (
          <KnowledgeBaseModule
            articles={knowledgeBase}
            setArticles={setKnowledgeBase}
          />
        )}

        {activeTab === 'canned-responses' && (
          <CannedResponsesModule
            cannedResponses={cannedResponses}
            setCannedResponses={setCannedResponses}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsAnalyticsModule
            stats={stats}
            monthlyTrends={MONTHLY_TICKET_TRENDS}
            categoryDistribution={CATEGORY_DISTRIBUTION}
            agents={agents}
          />
        )}

        {activeTab === 'team' && (
          <TeamPermissionsModule
            agents={agents}
            setAgents={setAgents}
          />
        )}

        {activeTab === 'settings' && (
          <SupportSettingsModule
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </SupportErrorBoundary>
    </CustomerSupportLayout>
  );
};

export default CustomerSupportDashboardPage;
