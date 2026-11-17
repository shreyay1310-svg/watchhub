import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InventoryManagerLayout from '../../components/inventory/InventoryManagerLayout';
import {
  INITIAL_INVENTORY_PRODUCTS,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_STOCK_ADJUSTMENTS,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_INVENTORY_HISTORY,
} from '../../data/inventoryData';

// 11 Dedicated Inventory Manager Modules
import DashboardModule from '../../components/inventory/modules/DashboardModule';
import StockOverviewModule from '../../components/inventory/modules/StockOverviewModule';
import InventoryStockModule from '../../components/inventory/modules/InventoryStockModule';
import StockMovementsModule from '../../components/inventory/modules/StockMovementsModule';
import StockAdjustmentsModule from '../../components/inventory/modules/StockAdjustmentsModule';
import WarehouseManagementModule from '../../components/inventory/modules/WarehouseManagementModule';
import ReorderAlertsModule from '../../components/inventory/modules/ReorderAlertsModule';
import PurchaseRequestsModule from '../../components/inventory/modules/PurchaseRequestsModule';
import StockReportsModule from '../../components/inventory/modules/StockReportsModule';
import InventoryHistoryModule from '../../components/inventory/modules/InventoryHistoryModule';
import InventorySettingsModule from '../../components/inventory/modules/InventorySettingsModule';

import {
  X,
  Bell,
  HelpCircle,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';

// Error Boundary to prevent any module issue from rendering a blank page
class InventoryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('[Inventory Manager Render Error]', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#11123D] border border-rose-500/50 rounded-2xl p-6 text-white text-center space-y-4 my-8 max-w-xl mx-auto shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold">Inventory Module Initializing</h2>
          <p className="text-xs text-[#A7B1C2]">
            {this.state.error?.message || 'Recovering state buffer from vault master...'}
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

const PATH_TO_TAB = {
  '/inventory-manager/dashboard': 'dashboard',
  '/inventory-manager': 'dashboard',
  '/inventory-manager/stock-overview': 'overview',
  '/inventory-manager/inventory': 'stock',
  '/inventory': 'stock',
  '/inventory-manager/stock-movements': 'movements',
  '/inventory-manager/stock-adjustments': 'adjustments',
  '/inventory-manager/warehouses': 'warehouses',
  '/inventory-manager/reorder-alerts': 'reorder',
  '/inventory-manager/purchase-requests': 'requests',
  '/inventory-manager/reports': 'reports',
  '/inventory-manager/history': 'history',
  '/inventory-manager/settings': 'settings',
};

const TAB_TO_PATH = {
  dashboard: '/inventory-manager/dashboard',
  overview: '/inventory-manager/stock-overview',
  stock: '/inventory-manager/inventory',
  movements: '/inventory-manager/stock-movements',
  adjustments: '/inventory-manager/stock-adjustments',
  warehouses: '/inventory-manager/warehouses',
  reorder: '/inventory-manager/reorder-alerts',
  requests: '/inventory-manager/purchase-requests',
  reports: '/inventory-manager/reports',
  history: '/inventory-manager/history',
  settings: '/inventory-manager/settings',
};

export default function InventoryManagerDashboardPage({ initialTab }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTabFromPath = PATH_TO_TAB[location.pathname] || initialTab || 'dashboard';
  const [activeTab, setActiveTab] = useState(currentTabFromPath);
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize activeTab when browser URL changes (e.g. back/forward navigation or direct links)
  useEffect(() => {
    const tabFromRoute = PATH_TO_TAB[location.pathname];
    if (tabFromRoute && tabFromRoute !== activeTab) {
      setActiveTab(tabFromRoute);
    }
  }, [location.pathname]);

  // Live Shared State
  const [products, setProducts] = useState(INITIAL_INVENTORY_PRODUCTS || []);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES || []);
  const [movements, setMovements] = useState(INITIAL_STOCK_MOVEMENTS || []);
  const [adjustments, setAdjustments] = useState(INITIAL_STOCK_ADJUSTMENTS || []);
  const [purchaseRequests, setPurchaseRequests] = useState(INITIAL_PURCHASE_REQUESTS || []);
  const [history, setHistory] = useState(INITIAL_INVENTORY_HISTORY || []);

  // Global Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Modals for Header Actions
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reorder alert count
  const reorderAlertsCount = products.filter(
    (p) => p.availableQty <= p.reorderLevel || p.status === 'Low Stock' || p.status === 'Out of Stock'
  ).length;

  // Handlers for Inventory Actions
  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
    const histEntry = {
      id: `HIST-${Math.floor(8900 + Math.random() * 999)}`,
      productName: newProduct.name,
      sku: newProduct.sku,
      warehouse: newProduct.warehouse,
      previousStock: 0,
      updatedStock: newProduct.availableQty,
      changeType: 'New SKU Master Creation',
      diff: `+${newProduct.availableQty}`,
      modifiedBy: 'Suresh Patel (Inventory Lead)',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      exactTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      remarks: 'Product catalogue master entry initialized with chronometer specs.',
    };
    setHistory([histEntry, ...history]);
    showToast(`Added ${newProduct.name} to ${newProduct.warehouse} inventory.`);
  };

  const handleUpdateStock = (productId, delta, reason) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const newQty = Math.max(0, target.availableQty + delta);
    const newTotal = Math.max(0, target.totalQty + delta);
    let newStatus = 'In Stock';
    if (newQty === 0) newStatus = 'Out of Stock';
    else if (newQty <= target.minStock) newStatus = 'Low Stock';

    setProducts(
      products.map((p) =>
        p.id === productId
          ? {
              ...p,
              availableQty: newQty,
              totalQty: newTotal,
              status: newStatus,
              lastUpdated: 'Just now',
            }
          : p
      )
    );

    // Add movement
    const newMov = {
      id: `MOV-${Math.floor(9800 + Math.random() * 999)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      productName: target.name,
      sku: target.sku,
      type: delta > 0 ? 'Stock In' : 'Stock Out',
      quantity: delta,
      fromLocation: delta > 0 ? 'External Supplier' : target.warehouse,
      toLocation: delta > 0 ? target.warehouse : 'Boutique Dispatch',
      performedBy: 'Suresh Patel (Inventory Lead)',
      reference: `ADJ-SYS-${Math.floor(100 + Math.random() * 900)}`,
    };
    setMovements([newMov, ...movements]);

    // Add History
    const histEntry = {
      id: `HIST-${Math.floor(8900 + Math.random() * 999)}`,
      productName: target.name,
      sku: target.sku,
      warehouse: target.warehouse,
      previousStock: target.availableQty,
      updatedStock: newQty,
      changeType: delta > 0 ? 'Manual Stock Replenishment' : 'Manual Stock Deduction',
      diff: delta > 0 ? `+${delta}` : `${delta}`,
      modifiedBy: 'Suresh Patel (Inventory Lead)',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      exactTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      remarks: reason || 'Manual adjustment entered via stock master panel.',
    };
    setHistory([histEntry, ...history]);

    showToast(`Stock updated for ${target.name} (${delta > 0 ? '+' : ''}${delta} Units).`);
  };

  const handleTransferStock = ({ productId, fromWarehouse, toWarehouse, quantity, notes }) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const newQty = Math.max(0, target.availableQty - quantity);
    setProducts(
      products.map((p) =>
        p.id === productId
          ? {
              ...p,
              availableQty: newQty,
              totalQty: Math.max(0, target.totalQty - quantity),
              status: newQty === 0 ? 'Out of Stock' : newQty <= target.minStock ? 'Low Stock' : 'In Stock',
              lastUpdated: 'Just now',
            }
          : p
      )
    );

    // Add movement
    const newMov = {
      id: `MOV-${Math.floor(9800 + Math.random() * 999)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      productName: target.name,
      sku: target.sku,
      type: 'Warehouse Transfer',
      quantity: -quantity,
      fromLocation: fromWarehouse,
      toLocation: toWarehouse,
      performedBy: 'Suresh Patel (Inventory Lead)',
      reference: notes || 'Inter-Hub Secure Transfer',
    };
    setMovements([newMov, ...movements]);

    showToast(`Dispatched transfer of ${quantity} units of ${target.name} to ${toWarehouse}.`);
  };

  const handleCreateAdjustment = (newAdj) => {
    setAdjustments([newAdj, ...adjustments]);
    showToast(`Submitted stock adjustment ${newAdj.id} for manager approval.`);
  };

  const handleApproveRejectAdjustment = (adjId, newStatus, managerNote) => {
    const adj = adjustments.find((a) => a.id === adjId);
    if (!adj) return;

    setAdjustments(
      adjustments.map((a) => (a.id === adjId ? { ...a, status: newStatus, managerNote } : a))
    );

    if (newStatus === 'Approved') {
      // Reconcile product stock
      const prod = products.find((p) => p.sku === adj.sku);
      if (prod) {
        setProducts(
          products.map((p) =>
            p.sku === adj.sku
              ? {
                  ...p,
                  availableQty: Math.max(0, p.availableQty + adj.diff),
                  totalQty: Math.max(0, p.totalQty + adj.diff),
                  status:
                    p.availableQty + adj.diff <= 0
                      ? 'Out of Stock'
                      : p.availableQty + adj.diff <= p.minStock
                      ? 'Low Stock'
                      : 'In Stock',
                }
              : p
          )
        );
      }

      // Add History
      const histEntry = {
        id: `HIST-${Math.floor(8900 + Math.random() * 999)}`,
        productName: adj.productName,
        sku: adj.sku,
        warehouse: adj.warehouse,
        previousStock: adj.recordedStock,
        updatedStock: adj.physicalStock,
        changeType: 'Physical Stock Correction',
        diff: adj.diff > 0 ? `+${adj.diff}` : `${adj.diff}`,
        modifiedBy: 'Suresh Patel (Inventory Lead)',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        exactTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        remarks: `Reconciled via approved adjustment ${adj.id}: ${adj.reason}`,
      };
      setHistory([histEntry, ...history]);
      showToast(`Adjustment ${adjId} APPROVED and stock reconciled.`);
    } else {
      showToast(`Adjustment ${adjId} REJECTED.`);
    }
  };

  const handleAddWarehouse = (newWh) => {
    setWarehouses([...warehouses, newWh]);
    showToast(`Vault ${newWh.name} successfully registered.`);
  };

  const handleUpdateWarehouse = (updatedWh) => {
    setWarehouses(warehouses.map((wh) => (wh.id === updatedWh.id ? updatedWh : wh)));
    showToast(`Warehouse details for ${updatedWh.name} updated.`);
  };

  const handleGeneratePurchaseRequest = (prData) => {
    const newPR = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      supplier: prData.supplier,
      destinationWarehouse: prData.destinationWarehouse,
      requiredByDate: '25 Nov 2026',
      priority: prData.priority || 'Standard',
      status: 'Submitted',
      stage: 'Submitted',
      createdBy: 'Suresh Patel (Inventory Lead)',
      items: prData.items,
      totalCost: prData.totalCost,
      notes: prData.notes || 'Automated reorder alert generation.',
    };
    setPurchaseRequests([newPR, ...purchaseRequests]);
    showToast(`Purchase Request ${newPR.id} generated successfully!`);
    setActiveTab('requests');
  };

  const handleUpdatePRStatus = (prId, newStatus) => {
    setPurchaseRequests(
      purchaseRequests.map((pr) =>
        pr.id === prId ? { ...pr, status: newStatus, stage: newStatus } : pr
      )
    );
    showToast(`Purchase Request ${prId} updated to ${newStatus}.`);
  };

  const handleNavigateTab = (tabId, opts = {}) => {
    setActiveTab(tabId);
    if (TAB_TO_PATH[tabId] && location.pathname !== TAB_TO_PATH[tabId]) {
      navigate(TAB_TO_PATH[tabId]);
    }
  };

  return (
    <InventoryManagerLayout
      activeTab={activeTab}
      onSelectTab={handleNavigateTab}
      selectedWarehouse={selectedWarehouse}
      onSelectWarehouse={(wh) => setSelectedWarehouse(wh)}
      onSearch={(q) => setSearchQuery(q)}
      onOpenNotifications={() => setShowNotificationsModal(true)}
      onOpenSupport={() => setShowSupportModal(true)}
      warehouses={warehouses}
      reorderAlertsCount={reorderAlertsCount}
    >
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#17165A] border border-[#00D5FF] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00D5FF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dynamic Module Content with Error Boundary */}
      <InventoryErrorBoundary>
        {/* MODULE 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardModule
            products={products}
            warehouses={warehouses}
            movements={movements}
            adjustments={adjustments}
            purchaseRequests={purchaseRequests}
            onNavigateTab={handleNavigateTab}
            onQuickStockAction={handleUpdateStock}
          />
        )}

        {/* MODULE 2: STOCK OVERVIEW */}
        {activeTab === 'overview' && (
          <StockOverviewModule
            products={products}
            warehouses={warehouses}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {/* MODULE 3: INVENTORY (STOCK) */}
        {activeTab === 'stock' && (
          <InventoryStockModule
            products={products}
            warehouses={warehouses}
            onAddProduct={handleAddProduct}
            onUpdateStock={handleUpdateStock}
            onTransferStock={handleTransferStock}
          />
        )}

        {/* MODULE 4: STOCK MOVEMENTS */}
        {activeTab === 'movements' && (
          <StockMovementsModule
            movements={movements}
            warehouses={warehouses}
          />
        )}

        {/* MODULE 5: STOCK ADJUSTMENTS */}
        {activeTab === 'adjustments' && (
          <StockAdjustmentsModule
            adjustments={adjustments}
            products={products}
            warehouses={warehouses}
            onCreateAdjustment={handleCreateAdjustment}
            onApproveRejectAdjustment={handleApproveRejectAdjustment}
          />
        )}

        {/* MODULE 6: WAREHOUSE MANAGEMENT */}
        {activeTab === 'warehouses' && (
          <WarehouseManagementModule
            warehouses={warehouses}
            products={products}
            onAddWarehouse={handleAddWarehouse}
            onUpdateWarehouse={handleUpdateWarehouse}
            onTransferStock={handleTransferStock}
          />
        )}

        {/* MODULE 7: REORDER ALERTS */}
        {activeTab === 'reorder' && (
          <ReorderAlertsModule
            products={products}
            onGeneratePurchaseRequest={handleGeneratePurchaseRequest}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {/* MODULE 8: PURCHASE REQUESTS */}
        {activeTab === 'requests' && (
          <PurchaseRequestsModule
            purchaseRequests={purchaseRequests}
            products={products}
            warehouses={warehouses}
            onCreatePR={handleGeneratePurchaseRequest}
            onUpdatePRStatus={handleUpdatePRStatus}
          />
        )}

        {/* MODULE 9: STOCK REPORTS */}
        {activeTab === 'reports' && (
          <StockReportsModule
            products={products}
            warehouses={warehouses}
            movements={movements}
          />
        )}

        {/* MODULE 10: INVENTORY HISTORY */}
        {activeTab === 'history' && (
          <InventoryHistoryModule
            history={history}
          />
        )}

        {/* MODULE 11: SETTINGS */}
        {activeTab === 'settings' && (
          <InventorySettingsModule />
        )}
      </InventoryErrorBoundary>

      {/* SUPPORT MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9B94F]/20 text-[#E9B94F] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Central Vault Operations Support</h3>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#A7B1C2] leading-relaxed">
              For urgent inter-warehouse transfer escorts, armored logistics transit dispatch, or safe reconciliation locks, reach our 24/7 Swiss horological vault support team:
            </p>

            <div className="space-y-2 p-3.5 bg-[#17165A]/40 rounded-xl border border-[#29305D]">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00D5FF]" />
                <div>
                  <p className="font-bold text-white">+91 124 889 0044 (Ext. 201)</p>
                  <p className="text-[10px] text-[#A7B1C2]">Direct Vault Operations Line</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#29305D]/50">
                <Mail className="w-4 h-4 text-[#E9B94F]" />
                <div>
                  <p className="font-bold text-white">vault-ops@watchhub.luxury</p>
                  <p className="text-[10px] text-[#A7B1C2]">Official Procurement Escalation Desk</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#29305D] flex justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Live Vault Alerts</h3>
              </div>
              <button onClick={() => setShowNotificationsModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-red-400">Omega Seamaster Diver 300M</span>
                  <span className="text-[10px] text-red-300">0 Stock</span>
                </div>
                <p className="text-[11px] text-[#A7B1C2]">Mumbai Warehouse has reached 0 available stock.</p>
              </div>

              <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-400">Rolex Daytona Gold</span>
                  <span className="text-[10px] text-amber-300">Low Stock (6 left)</span>
                </div>
                <p className="text-[11px] text-[#A7B1C2]">Main Central Vault buffer below safety threshold (8).</p>
              </div>

              <div className="p-3 bg-[#17165A]/40 border border-[#29305D] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">PO-2026-904 Arrived</span>
                  <span className="text-[10px] text-[#00D5FF]">Delivered</span>
                </div>
                <p className="text-[11px] text-[#A7B1C2]">10 Rolex Submariner timepieces stocked in Gurugram vault.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#29305D] flex justify-between">
              <button
                onClick={() => {
                  setShowNotificationsModal(false);
                  setActiveTab('reorder');
                }}
                className="text-xs text-[#E9B94F] hover:underline font-bold"
              >
                View Reorder Alerts Center →
              </button>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#17165A] hover:bg-[#202275] text-white font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </InventoryManagerLayout>
  );
}
