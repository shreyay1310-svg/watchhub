export const getSuperAdminStats = (req, res) => {
  res.status(200).json({
    status: 'success',
    role: 'Super Admin',
    kpis: {
      totalOrders: 1248,
      totalCustomers: 5320,
      totalProducts: 320,
      totalRevenue: 1248000,
      activeOffers: 18,
    },
    ordersStatus: {
      delivered: 62,
      processing: 14,
      shipped: 12,
      cancelled: 7,
      returned: 5,
    },
    staffSummary: {
      storeAdmins: 12,
      inventoryManagers: 8,
      deliveryManagers: 10,
      supportExecutives: 6,
    },
  });
};

export const getStoreAdminStats = (req, res) => {
  res.status(200).json({
    status: 'success',
    role: 'Store Admin',
    kpis: {
      totalProducts: 320,
      totalOrders: 1248,
      totalCustomers: 5320,
      totalSales: 1248000,
      activeOffers: 18,
    },
    inventoryAlerts: [
      { product: 'Digital Sports Watch', remaining: 5 },
      { product: 'Classic Chronograph Watch', remaining: 8 },
      { product: 'Smartwatch Pro', remaining: 10 },
    ],
  });
};

export const getInventoryStats = (req, res) => {
  res.status(200).json({
    status: 'success',
    role: 'Inventory Manager',
    kpis: {
      totalStockUnits: 8540,
      inStockProducts: 296,
      lowStockProducts: 24,
      outOfStock: 6,
      warehouses: 3,
    },
    stockMovement: {
      added: 1250,
      transferred: 320,
      updated: 480,
      removed: -140,
    },
  });
};

export const getDeliveryStats = (req, res) => {
  res.status(200).json({
    status: 'success',
    role: 'Delivery Manager',
    kpis: {
      totalOrders: 1248,
      assignedOrders: 320,
      outForDelivery: 286,
      deliveredOrders: 812,
      returnRequests: 24,
      avgDeliveryTimeDays: 2.4,
    },
    todayTasks: {
      pickAndPack: 48,
      dispatch: 36,
      outForDelivery: 112,
      expectedToday: 104,
    },
  });
};

export const getSupportStats = (req, res) => {
  res.status(200).json({
    status: 'success',
    role: 'Customer Support Executive',
    kpis: {
      totalTickets: 1248,
      openTickets: 186,
      resolvedTickets: 1020,
      returnRequests: 48,
      refundsProcessed: 124500,
      avgResponseMinutes: 4.8,
    },
    queryBreakdown: {
      orderRelated: 38,
      returnsAndRefunds: 22,
      productAndWarranty: 16,
      paymentAndBilling: 14,
      others: 10,
    },
  });
};

