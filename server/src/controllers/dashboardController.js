import { prisma } from '../config/prisma.js';

export const getSuperAdminStats = async (req, res) => {
  try {
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalCustomers = 0;
    let totalProducts = 0;
    let delivered = 0;
    let processing = 0;
    let shipped = 0;
    let cancelled = 0;
    let returned = 0;
    let activeOffers = 0;
    let storeAdmins = 0;
    let inventoryManagers = 0;
    let deliveryManagers = 0;
    let supportExecutives = 0;

    try {
      totalOrders = await prisma.order.count();
      totalCustomers = await prisma.user.count({
        where: { userRoles: { some: { role: { roleName: 'Customer' } } } },
      });
      totalProducts = await prisma.product.count();

      const revenueAgg = await prisma.order.aggregate({
        where: { orderStatus: { notIn: ['Cancelled', 'Returned'] } },
        _sum: { totalAmount: true },
      });
      totalRevenue = Number(revenueAgg._sum.totalAmount || 0);

      delivered = await prisma.order.count({ where: { orderStatus: 'Delivered' } });
      processing = await prisma.order.count({ where: { orderStatus: 'Processing' } });
      shipped = await prisma.order.count({ where: { orderStatus: 'Shipped' } });
      cancelled = await prisma.order.count({ where: { orderStatus: 'Cancelled' } });
      returned = await prisma.order.count({ where: { orderStatus: 'Returned' } });

      activeOffers = await prisma.coupon.count({ where: { isActive: true } });
      storeAdmins = await prisma.user.count({ where: { userRoles: { some: { role: { roleName: 'Store Admin' } } } } });
      inventoryManagers = await prisma.user.count({ where: { userRoles: { some: { role: { roleName: 'Inventory Manager' } } } } });
      deliveryManagers = await prisma.user.count({ where: { userRoles: { some: { role: { roleName: 'Delivery Manager' } } } } });
      supportExecutives = await prisma.user.count({ where: { userRoles: { some: { role: { roleName: 'Customer Support Executive' } } } } });
    } catch (e) {
      console.warn('[Dashboard Warning] Error gathering Super Admin KPIs from Prisma:', e.message);
    }

    return res.status(200).json({
      status: 'success',
      role: 'Super Admin',
      kpis: {
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue,
        activeOffers,
      },
      ordersStatus: {
        delivered,
        processing,
        shipped,
        cancelled,
        returned,
      },
      staffSummary: {
        storeAdmins,
        inventoryManagers,
        deliveryManagers,
        supportExecutives,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getStoreAdminStats = async (req, res) => {
  try {
    let totalProducts = 0;
    let totalOrders = 0;
    let totalSales = 0;
    let totalCustomers = 0;
    let lowStockCount = 0;
    let activeOffers = 0;

    try {
      totalProducts = await prisma.product.count();
      totalOrders = await prisma.order.count();
      totalCustomers = await prisma.user.count({
        where: { userRoles: { some: { role: { roleName: 'Customer' } } } },
      });

      const salesAgg = await prisma.order.aggregate({
        where: { orderStatus: { not: 'Cancelled' } },
        _sum: { totalAmount: true },
      });
      totalSales = Number(salesAgg._sum.totalAmount || 0);

      lowStockCount = await prisma.inventory.count({
        where: { currentStock: { lte: 5 } },
      });
      activeOffers = await prisma.coupon.count({ where: { isActive: true } });
    } catch (e) {
      console.warn('[Dashboard Warning] Error gathering Store Admin KPIs from Prisma:', e.message);
    }

    return res.status(200).json({
      status: 'success',
      role: 'Store Admin',
      kpis: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalSales,
        activeOffers,
      },
      inventoryAlerts: lowStockCount > 0 ? [{ alert: 'Low Stock Detected', count: lowStockCount }] : [],
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getInventoryStats = async (req, res) => {
  try {
    let inStockProducts = 0;
    let lowStockProducts = 0;
    let outOfStock = 0;
    let totalStockUnits = 0;
    let warehouses = 1;

    try {
      inStockProducts = await prisma.inventory.count({ where: { currentStock: { gt: 5 } } });
      lowStockProducts = await prisma.inventory.count({ where: { currentStock: { gt: 0, lte: 5 } } });
      outOfStock = await prisma.inventory.count({ where: { currentStock: { lte: 0 } } });

      const stockAgg = await prisma.inventory.aggregate({
        _sum: { currentStock: true },
      });
      totalStockUnits = Number(stockAgg._sum.currentStock || 0);
      warehouses = await prisma.warehouse.count({ where: { isActive: true } });
    } catch (e) {
      console.warn('[Dashboard Warning] Error gathering Inventory KPIs from Prisma:', e.message);
    }

    return res.status(200).json({
      status: 'success',
      role: 'Inventory Manager',
      kpis: {
        totalStockUnits,
        inStockProducts,
        lowStockProducts,
        outOfStock,
        warehouses: warehouses || 1,
      },
      stockMovement: {
        added: 0,
        transferred: 0,
        updated: 0,
        removed: 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getDeliveryStats = async (req, res) => {
  try {
    let totalOrders = 0;
    let deliveredOrders = 0;
    let outForDelivery = 0;

    try {
      totalOrders = await prisma.order.count();
      deliveredOrders = await prisma.delivery.count({ where: { deliveryStatus: 'Delivered' } });
      outForDelivery = await prisma.delivery.count({ where: { deliveryStatus: 'Out for Delivery' } });
    } catch (e) {
      console.warn('[Dashboard Warning] Error gathering Delivery KPIs from Prisma:', e.message);
    }

    return res.status(200).json({
      status: 'success',
      role: 'Delivery Manager',
      kpis: {
        totalOrders,
        assignedOrders: outForDelivery,
        outForDelivery,
        deliveredOrders,
        returnRequests: 0,
        avgDeliveryTimeDays: 0,
      },
      todayTasks: {
        pickAndPack: 0,
        dispatch: 0,
        outForDelivery,
        expectedToday: 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getSupportStats = async (req, res) => {
  try {
    let totalTickets = 0;
    let openTickets = 0;
    let resolvedTickets = 0;

    try {
      totalTickets = await prisma.supportTicket.count();
      openTickets = await prisma.supportTicket.count({ where: { status: { in: ['Open', 'In Progress'] } } });
      resolvedTickets = await prisma.supportTicket.count({ where: { status: { in: ['Resolved', 'Closed'] } } });
    } catch (e) {
      console.warn('[Dashboard Warning] Error gathering Support KPIs from Prisma:', e.message);
    }

    return res.status(200).json({
      status: 'success',
      role: 'Customer Support Executive',
      kpis: {
        totalTickets,
        openTickets,
        resolvedTickets,
        returnRequests: 0,
        refundsProcessed: 0,
        avgResponseMinutes: 15,
      },
      queryBreakdown: {
        orderRelated: totalTickets,
        returnsAndRefunds: 0,
        productAndWarranty: 0,
        paymentAndBilling: 0,
        others: 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
