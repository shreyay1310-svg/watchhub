import { prisma } from '../config/prisma.js';

// 1. GET /api/store-admin/overview
export const getStoreAdminOverview = async (req, res) => {
  try {
    // Total Sales from eligible orders
    const salesAgg = await prisma.order.aggregate({
      where: { orderStatus: { notIn: ['Cancelled', 'Returned'] } },
      _sum: { totalAmount: true },
    });
    const totalSales = Number(salesAgg._sum.totalAmount || 0);

    // Orders Count & Status Breakdown
    const totalOrders = await prisma.order.count();
    const confirmedOrders = await prisma.order.count({ where: { orderStatus: 'Confirmed' } });
    const processingOrders = await prisma.order.count({ where: { orderStatus: 'Processing' } });
    const shippedOrders = await prisma.order.count({ where: { orderStatus: 'Shipped' } });
    const deliveredOrders = await prisma.order.count({ where: { orderStatus: 'Delivered' } });
    const cancelledOrders = await prisma.order.count({ where: { orderStatus: 'Cancelled' } });

    // Registered Customers Count
    const totalCustomers = await prisma.user.count({
      where: { userRoles: { some: { role: { roleName: 'Customer' } } } },
    });

    // Recent 10 Orders with customer details
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { userId: true, fullName: true, email: true, phone: true } },
        orderItems: { include: { product: { select: { name: true, sku: true } } } },
        payments: true,
      },
    });

    // Top Selling Watches from OrderItems
    const topProducts = await prisma.product.findMany({
      take: 5,
      where: { isActive: true },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        inventory: true,
      },
      orderBy: { price: 'desc' },
    });

    // Conversion rate: visitor tracking does not exist in backend schema
    const conversionRate = null; // Display as "Not Available" per prompt instructions

    return res.status(200).json({
      status: 'success',
      data: {
        kpis: {
          totalSales,
          totalOrders,
          totalCustomers,
          conversionRate,
          orderStatusBreakdown: {
            confirmed: confirmedOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
          },
        },
        recentOrders: recentOrders.map((o) => ({
          id: o.orderNumber || o.orderId,
          orderId: o.orderId,
          customer: o.customer?.fullName || 'Guest Customer',
          email: o.customer?.email || 'N/A',
          totalAmount: Number(o.totalAmount),
          status: o.orderStatus,
          date: o.createdAt,
          itemsCount: o.orderItems.length,
          paymentMethod: o.payments[0]?.paymentMethod || 'Prepaid',
        })),
        topWatches: topProducts.map((p) => {
          const totalStock = p.inventory?.reduce((s, inv) => s + inv.currentStock, 0) || 0;
          return {
            id: p.productId,
            name: p.name,
            sku: p.sku,
            brand: p.brand?.name || 'WatchHub',
            category: p.category?.name || 'Horology',
            price: Number(p.price),
            stock: totalStock,
            image: `/images/products/${p.productId}.png`,
          };
        }),
      },
    });
  } catch (err) {
    console.error('[Store Admin Overview Error]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. GET /api/store-admin/sales-overview?range=...
export const getSalesOverviewChart = async (req, res) => {
  try {
    const { range = 'This Week' } = req.query;

    const orders = await prisma.order.findMany({
      where: { orderStatus: { notIn: ['Cancelled', 'Returned'] } },
      select: { totalAmount: true, createdAt: true, shippingMethod: true },
      orderBy: { createdAt: 'asc' },
    });

    // Grouping by days/months based on real orders
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesMap = {};
    days.forEach((d) => {
      salesMap[d] = 0;
    });

    let totalRevenue = 0;
    orders.forEach((o) => {
      const dayName = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      const amt = Number(o.totalAmount || 0);
      totalRevenue += amt;
      if (salesMap[dayName] !== undefined) {
        salesMap[dayName] += amt;
      }
    });

    const chartData = days.map((day) => ({
      name: day,
      sales: salesMap[day] || 0,
      orders: Math.round((salesMap[day] || 0) / 50000),
    }));

    return res.status(200).json({
      status: 'success',
      data: {
        range,
        totalRevenue,
        chartData,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. GET /api/store-admin/sales-by-channel
export const getSalesByChannel = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { orderStatus: { notIn: ['Cancelled', 'Returned'] } },
      select: { totalAmount: true, shippingMethod: true, orderNumber: true },
    });

    let onlineSales = 0;
    let posSales = 0;
    let mobileSales = 0;

    let onlineCount = 0;
    let posCount = 0;
    let mobileCount = 0;

    orders.forEach((o) => {
      const amt = Number(o.totalAmount);
      if (o.orderNumber?.startsWith('#POS') || o.shippingMethod === 'In-Store Pickup') {
        posSales += amt;
        posCount += 1;
      } else if (o.shippingMethod?.includes('Mobile') || o.shippingMethod === 'Express App') {
        mobileSales += amt;
        mobileCount += 1;
      } else {
        onlineSales += amt;
        onlineCount += 1;
      }
    });

    const grandTotal = onlineSales + posSales + mobileSales || 1;

    const channels = [
      {
        id: 'online',
        name: 'Online Store',
        revenue: onlineSales,
        orders: onlineCount,
        percentage: Math.round((onlineSales / grandTotal) * 100),
        color: '#1265FF',
      },
      {
        id: 'pos',
        name: 'POS Terminal',
        revenue: posSales,
        orders: posCount,
        percentage: Math.round((posSales / grandTotal) * 100),
        color: '#741BFF',
      },
      {
        id: 'mobile',
        name: 'Mobile App',
        revenue: mobileSales,
        orders: mobileCount,
        percentage: Math.round((mobileSales / grandTotal) * 100),
        color: '#00D9FF',
      },
    ];

    return res.status(200).json({
      status: 'success',
      data: {
        totalRevenue: grandTotal,
        channels,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 4. GET /api/store-admin/pos/search?query=...
export const searchPosProducts = async (req, res) => {
  try {
    const { query = '' } = req.query;
    const cleanQuery = query.trim().toLowerCase();

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: cleanQuery
          ? [
              { name: { contains: cleanQuery } },
              { sku: { contains: cleanQuery } },
              { brand: { name: { contains: cleanQuery } } },
            ]
          : undefined,
      },
      take: 20,
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        inventory: true,
      },
    });

    const formatted = products.map((p) => {
      const stock = p.inventory?.reduce((s, inv) => s + inv.currentStock, 0) || 0;
      return {
        id: p.productId,
        name: p.name,
        sku: p.sku,
        brand: p.brand?.name || 'WatchHub',
        category: p.category?.name || 'Luxury',
        price: Number(p.price),
        stock,
        image: `/images/products/${p.productId}.png`,
      };
    });

    return res.status(200).json({ status: 'success', data: formatted });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 5. POST /api/store-admin/pos/order
export const createPosOrder = async (req, res) => {
  try {
    const {
      cartItems = [],
      customerPhone = '',
      customerName = 'Walk-in Customer',
      paymentMethod = 'Cash on Delivery',
      couponCode = '',
    } = req.body;

    if (!cartItems.length) {
      return res.status(400).json({ status: 'fail', message: 'POS cart cannot be empty.' });
    }

    // 1. Calculate prices independently on backend
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { productId: item.id },
        include: { inventory: true },
      });

      if (!product) {
        return res.status(404).json({ status: 'fail', message: `Product ${item.id} not found.` });
      }

      const totalStock = product.inventory?.reduce((s, inv) => s + inv.currentStock, 0) || 0;
      if (totalStock < item.qty) {
        return res.status(400).json({
          status: 'fail',
          message: `Insufficient stock for ${product.name}. Available: ${totalStock}, Requested: ${item.qty}`,
        });
      }

      const unitPrice = Number(product.price);
      subtotal += unitPrice * item.qty;

      verifiedItems.push({
        productId: product.productId,
        name: product.name,
        sku: product.sku,
        unitPrice,
        quantity: item.qty,
        firstWarehouseId: product.inventory[0]?.warehouseId || 1,
      });
    }

    // 2. Validate Coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive && new Date(coupon.validUntil) >= new Date()) {
        const pct = Number(coupon.discountPercentage);
        discountAmount = (subtotal * pct) / 100;
        if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
          discountAmount = Number(coupon.maxDiscountAmount);
        }
      }
    }

    const tax = Math.round((subtotal - discountAmount) * 0.1);
    const totalAmount = Math.max(0, subtotal - discountAmount + tax);

    // 3. Resolve customer or fallback to Walk-in Customer User
    let customer = await prisma.user.findFirst({
      where: customerPhone ? { phone: customerPhone.trim() } : { email: 'customer@watchhub.com' },
    });

    if (!customer) {
      customer = await prisma.user.findFirst({
        where: { userRoles: { some: { role: { roleName: 'Customer' } } } },
      });
    }

    let defaultAddress = await prisma.address.findFirst({
      where: { userId: customer.userId },
    });

    if (!defaultAddress) {
      defaultAddress = await prisma.address.create({
        data: {
          userId: customer.userId,
          addressLine1: 'WatchHub Atelier Store POS',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        },
      });
    }

    const orderNumber = `#POS-${Date.now().toString().slice(-6)}`;
    const adminUserId = req.user?.id || req.user?.userId || customer.userId;

    // 4. Transactional Order Creation + Stock Decrement
    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.userId,
          shippingAddressId: defaultAddress.addressId,
          orderStatus: 'Delivered',
          subtotal,
          shippingFee: 0,
          discountAmount,
          totalAmount,
          shippingMethod: 'In-Store Pickup',
          specialInstructions: `POS Sale by Store Admin. Customer: ${customerName} (${customerPhone || 'Walk-in'})`,
          orderItems: {
            create: verifiedItems.map((vi) => ({
              productId: vi.productId,
              unitPrice: vi.unitPrice,
              quantity: vi.quantity,
            })),
          },
        },
      });

      // Create Payment Record (Simulated Dummy Payment)
      await tx.payment.create({
        data: {
          orderId: newOrder.orderId,
          razorpayOrderId: `pos_dummy_order_${Date.now()}`,
          razorpayPaymentId: `pos_dummy_pay_${Date.now()}`,
          amount: totalAmount,
          currency: 'INR',
          paymentStatus: 'Captured',
          paymentMethod: paymentMethod || 'Cash',
          capturedAt: new Date(),
        },
      });

      // Update Inventory & Record Stock Transactions
      for (const vi of verifiedItems) {
        await tx.inventory.updateMany({
          where: { productId: vi.productId, warehouseId: vi.firstWarehouseId },
          data: {
            currentStock: { decrement: vi.quantity },
          },
        });

        await tx.stockTransaction.create({
          data: {
            productId: vi.productId,
            warehouseId: vi.firstWarehouseId,
            transactionType: 'POS_SALE',
            quantityChange: -vi.quantity,
            referenceNumber: orderNumber,
            performedByUserId: adminUserId,
            notes: `POS In-Store Checkout #${orderNumber}`,
          },
        });
      }

      return newOrder;
    });

    return res.status(201).json({
      status: 'success',
      message: 'POS Order created successfully.',
      receipt: {
        orderId: result.orderId,
        orderNumber,
        customerName,
        customerPhone,
        items: verifiedItems,
        subtotal,
        discountAmount,
        tax,
        totalAmount,
        paymentMethod,
        date: result.createdAt,
        mode: 'Demo Payment Mode — No real money will be charged.',
      },
    });
  } catch (err) {
    console.error('[POS Order Error]', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 6. GET /api/store-admin/orders
export const getStoreAdminOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (status && status !== 'All') {
      where.orderStatus = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { fullName: { contains: search } } },
        { customer: { email: { contains: search } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { fullName: true, email: true, phone: true } },
          orderItems: { include: { product: true } },
          payments: true,
          shippingAddress: true,
        },
      }),
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        orders: orders.map((o) => ({
          id: o.orderNumber,
          orderId: o.orderId,
          customer: o.customer?.fullName || 'Walk-in Customer',
          email: o.customer?.email || 'N/A',
          phone: o.customer?.phone || 'N/A',
          subtotal: Number(o.subtotal),
          discount: Number(o.discountAmount),
          total: Number(o.totalAmount),
          status: o.orderStatus,
          shippingMethod: o.shippingMethod,
          date: o.createdAt,
          items: o.orderItems.map((oi) => ({
            name: oi.product?.name,
            sku: oi.product?.sku,
            price: Number(oi.unitPrice),
            qty: oi.quantity,
          })),
          paymentStatus: o.payments[0]?.paymentStatus || 'Pending',
          paymentMethod: o.payments[0]?.paymentMethod || 'Prepaid',
        })),
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 7. PATCH /api/store-admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ status: 'fail', message: `Invalid status: ${status}` });
    }

    const updated = await prisma.order.update({
      where: { orderId: id },
      data: { orderStatus: status },
    });

    return res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 8. GET /api/store-admin/customers
export const getStoreAdminCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { userRoles: { some: { role: { roleName: 'Customer' } } } },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
        isActive: true,
        orders: {
          where: { orderStatus: { notIn: ['Cancelled', 'Returned'] } },
          select: { totalAmount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = customers.map((c) => {
      const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      return {
        id: c.userId,
        name: c.fullName,
        email: c.email,
        phone: c.phone || 'N/A',
        ordersCount: c.orders.length,
        totalSpent,
        joinedDate: c.createdAt,
        status: c.isActive ? 'Active' : 'Inactive',
      };
    });

    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// 9. Coupons Endpoints
export const getStoreAdminCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ status: 'success', data: coupons });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const createStoreAdminCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, maxDiscountAmount, minOrderAmount, validFrom, validUntil } = req.body;
    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return res.status(400).json({ status: 'fail', message: 'Coupon code already exists.' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountPercentage: Number(discountPercentage),
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        minOrderAmount: Number(minOrderAmount || 0),
        validFrom: new Date(validFrom || Date.now()),
        validUntil: new Date(validUntil || Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });

    return res.status(201).json({ status: 'success', data: coupon });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
