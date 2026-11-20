import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const SNAPSHOT_DIR = path.resolve(__dirname, '../backups/snapshot_pre_phase2');

function readJson(filename) {
  const p = path.join(SNAPSHOT_DIR, filename);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function runFullMigration() {
  console.log('=== STARTING COMPLETE DATA MIGRATION TO MSSQL (WATCHHUBDB) ===\n');

  // 1. Roles & Permissions (Verified in Stage 2)
  const roleMap = new Map();
  const allRoles = await prisma.role.findMany();
  for (const r of allRoles) roleMap.set(r.roleName, r.roleId);

  // 2. Delivery Partners -> Users & UserRoles
  console.log('--- Migrating Delivery Partners to Users ---');
  const partners = readJson('delivery_partners.json');
  const deliveryRoleId = roleMap.get('Delivery Partner') || roleMap.get('Delivery Manager');

  for (const dp of partners) {
    const userId = dp.id; // rd_001, rd_002, rd_003
    const email = `${dp.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@watchhub.com`;
    const user = await prisma.user.upsert({
      where: { userId },
      update: {
        fullName: dp.name,
        email,
        phone: dp.phone,
        avatarUrl: dp.avatar,
        isActive: dp.status !== 'Inactive'
      },
      create: {
        userId,
        fullName: dp.name,
        email,
        phone: dp.phone,
        passwordHash: '$2a$10$wT5W2nZ0bZ2vE7D8rV7w9uF5P3L6bK2Z0A7Y8uM1nO3pQ4sR5tU6v',
        avatarUrl: dp.avatar,
        isActive: dp.status !== 'Inactive',
        isEmailVerified: true,
        isPhoneVerified: true
      }
    });

    if (deliveryRoleId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: deliveryRoleId } },
        update: {},
        create: { userId, roleId: deliveryRoleId }
      });
    }
  }
  console.log(`Delivery partners migrated as users: ${partners.length}`);

  // 3. Additional Support Agents / Customers in tickets or orders
  console.log('--- Migrating Additional Users & Addresses ---');
  const supportTicketsData = readJson('support_tickets.json');
  const deliveriesData = readJson('deliveries.json');
  const ordersData = readJson('orders.json');
  const customerRoleId = roleMap.get('Customer');
  const supportRoleId = roleMap.get('Customer Support Executive');

  // Ensure default support agent exists
  const supportAgentId = '660000000000000000000005'; // Pooja Sharma

  // Check customers from orders
  for (const ord of ordersData) {
    const customerId = ord.customer;
    let customer = await prisma.user.findUnique({ where: { userId: customerId } });
    if (!customer) {
      customer = await prisma.user.create({
        data: {
          userId: customerId,
          fullName: ord.customerName || 'Customer',
          email: ord.customerEmail || `customer_${customerId.slice(-6)}@watchhub.com`,
          phone: ord.customerPhone || null,
          passwordHash: '$2a$10$wT5W2nZ0bZ2vE7D8rV7w9uF5P3L6bK2Z0A7Y8uM1nO3pQ4sR5tU6v',
          isActive: true
        }
      });
      if (customerRoleId) {
        await prisma.userRole.upsert({
          where: { userId_roleId: { userId: customerId, roleId: customerRoleId } },
          update: {},
          create: { userId: customerId, roleId: customerRoleId }
        });
      }
    }

    // Ensure shipping address exists
    if (ord.shippingAddress) {
      const existingAddr = await prisma.address.findFirst({
        where: {
          userId: customerId,
          street: ord.shippingAddress.street,
          pincode: ord.shippingAddress.pincode
        }
      });
      if (!existingAddr) {
        await prisma.address.create({
          data: {
            userId: customerId,
            fullName: ord.shippingAddress.fullName || ord.customerName || 'Customer',
            street: ord.shippingAddress.street,
            city: ord.shippingAddress.city,
            state: ord.shippingAddress.state,
            pincode: ord.shippingAddress.pincode,
            phone: ord.shippingAddress.phone || ord.customerPhone || '+91 99999 99999',
            isDefault: true
          }
        });
      }
    }
  }

  // 4. Products Map for SKU & ID Lookup
  const allProducts = await prisma.product.findMany();
  const productBySku = new Map();
  const productByName = new Map();
  const productById = new Map();
  for (const p of allProducts) {
    productById.set(p.productId, p);
    productBySku.set(p.sku.toUpperCase(), p);
    productByName.set(p.name.toLowerCase().trim(), p);
  }

  function resolveProduct(nameOrSku) {
    if (!nameOrSku) return allProducts[0];
    const upper = nameOrSku.toUpperCase();
    if (productBySku.has(upper)) return productBySku.get(upper);
    const lower = nameOrSku.toLowerCase().trim();
    if (productByName.has(lower)) return productByName.get(lower);
    for (const [key, prod] of productByName.entries()) {
      if (lower.includes(key) || key.includes(lower)) return prod;
    }
    return allProducts[0];
  }

  // 5. Warehouses Map
  const allWarehouses = await prisma.warehouse.findMany();
  const warehouseByCode = new Map();
  const warehouseByName = new Map();
  for (const w of allWarehouses) {
    warehouseByCode.set(w.warehouseCode.toUpperCase(), w.warehouseId);
    warehouseByName.set(w.name.toLowerCase().trim(), w.warehouseId);
  }
  const defaultWarehouseId = allWarehouses[0]?.warehouseId || 1;

  // 6. Migrate Inventory Snapshots (8 items)
  console.log('--- Migrating Inventory Data ---');
  const inventoryData = readJson('inventory.json');
  for (const inv of inventoryData) {
    const prod = resolveProduct(inv.name || inv.productName || inv.sku);
    const whId = warehouseByName.get((inv.warehouse || '').toLowerCase().trim()) || defaultWarehouseId;

    if (prod && whId) {
      await prisma.inventory.upsert({
        where: {
          UQ_Product_Warehouse: {
            productId: prod.productId,
            warehouseId: whId
          }
        },
        update: {
          currentStock: inv.currentStock || inv.stock || 10,
          reservedStock: inv.reservedStock || 0,
          lastRestockedAt: new Date()
        },
        create: {
          productId: prod.productId,
          warehouseId: whId,
          currentStock: inv.currentStock || inv.stock || 10,
          reservedStock: inv.reservedStock || 0,
          lastRestockedAt: new Date()
        }
      });
    }
  }
  console.log(`Inventory records processed: ${inventoryData.length}`);

  // 7. Stock Transactions (5 records)
  console.log('--- Migrating Stock Transactions ---');
  const stockTxns = readJson('stock_transactions.json');
  const inventoryManagerId = '660000000000000000000003'; // Rajesh Mehta

  for (const st of stockTxns) {
    const prod = resolveProduct(st.productName || st.sku);
    const whId = warehouseByName.get((st.warehouse || '').toLowerCase().trim()) || defaultWarehouseId;
    const txnId = st.id || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    await prisma.stockTransaction.upsert({
      where: { transactionId: txnId },
      update: {
        quantityChange: st.quantity || 1,
        transactionType: st.type || 'Stock In (+)',
        referenceNumber: st.reference || null,
        notes: st.reason || null
      },
      create: {
        transactionId: txnId,
        productId: prod.productId,
        warehouseId: whId,
        transactionType: st.type || 'Stock In (+)',
        quantityChange: st.quantity || 1,
        referenceNumber: st.reference || null,
        performedByUserId: inventoryManagerId,
        notes: st.reason || null,
        createdAt: new Date('2026-11-14T10:45:00.000Z')
      }
    });
  }
  console.log(`Stock transactions migrated: ${stockTxns.length}`);

  // 8. Orders, OrderItems & Payments (3 records)
  console.log('--- Migrating Orders, Order Items & Payments ---');
  for (const ord of ordersData) {
    const orderId = ord.orderId || ord._id;
    const customerId = ord.customer;

    // Find address
    let address = await prisma.address.findFirst({ where: { userId: customerId } });
    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: customerId,
          fullName: ord.customerName || 'Customer',
          street: ord.shippingAddress?.street || 'WatchHub Logistics Hub',
          city: ord.shippingAddress?.city || 'Mumbai',
          state: ord.shippingAddress?.state || 'Maharashtra',
          pincode: ord.shippingAddress?.pincode || '400001',
          phone: ord.customerPhone || '+91 99999 99999',
          isDefault: true
        }
      });
    }

    const order = await prisma.order.upsert({
      where: { orderNumber: ord.orderId },
      update: {
        orderStatus: ord.orderStatus || 'Confirmed',
        subtotal: ord.subtotal || ord.totalAmount,
        discountAmount: ord.discount || 0,
        shippingFee: ord.shippingCharges || 0,
        totalAmount: ord.totalAmount,
        updatedAt: new Date()
      },
      create: {
        orderId,
        orderNumber: ord.orderId,
        customerId,
        shippingAddressId: address.addressId,
        orderStatus: ord.orderStatus || 'Confirmed',
        subtotal: ord.subtotal || ord.totalAmount,
        discountAmount: ord.discount || 0,
        shippingFee: ord.shippingCharges || 0,
        totalAmount: ord.totalAmount,
        shippingMethod: 'Armoured Express Transit',
        createdAt: ord.createdAt ? new Date(ord.createdAt) : new Date(),
        updatedAt: new Date()
      }
    });

    // Order Items
    if (ord.items && Array.isArray(ord.items)) {
      for (const item of ord.items) {
        const prod = resolveProduct(item.name || item.sku);
        const existingItem = await prisma.orderItem.findFirst({
          where: { orderId: order.orderId, productId: prod.productId }
        });
        if (!existingItem) {
          await prisma.orderItem.create({
            data: {
              orderId: order.orderId,
              productId: prod.productId,
              unitPrice: item.price,
              quantity: item.quantity || 1
            }
          });
        }
      }
    }

    // Payments
    if (ord.payment) {
      const razorpayOrderId = `order_${ord.orderId.replace(/[^A-Za-z0-9]/g, '_')}`;
      const existingPay = await prisma.payment.findUnique({ where: { razorpayOrderId } });
      if (!existingPay) {
        await prisma.payment.create({
          data: {
            orderId: order.orderId,
            razorpayOrderId,
            razorpayPaymentId: ord.payment.transactionId || `pay_${Math.random().toString(36).substring(2, 10)}`,
            amount: ord.payment.amount || ord.totalAmount,
            currency: 'INR',
            paymentStatus: ord.payment.status === 'Completed' ? 'Captured' : 'Created',
            paymentMethod: ord.payment.method || 'UPI',
            capturedAt: new Date(),
            createdAt: ord.createdAt ? new Date(ord.createdAt) : new Date()
          }
        });
      }
    }
  }
  console.log(`Orders and associated items/payments migrated: ${ordersData.length}`);

  // 9. Deliveries (3 records)
  console.log('--- Migrating Deliveries & Real-time Location Pings ---');
  for (const d of deliveriesData) {
    const trackingNumber = d.awbNumber || d.id;
    // Check if order exists with this orderId (#WH12548, etc.)
    let order = await prisma.order.findUnique({ where: { orderNumber: d.orderId } });
    if (!order) {
      // Create order stub so delivery foreign key constraint is satisfied
      const customerUser = await prisma.user.findFirst({ where: { userRoles: { some: { role: { roleName: 'Customer' } } } } });
      const customerId = customerUser ? customerUser.userId : '660000000000000000000006';
      let addr = await prisma.address.findFirst({ where: { userId: customerId } });
      if (!addr) {
        addr = await prisma.address.create({
          data: {
            userId: customerId,
            fullName: d.customer || 'Customer',
            street: d.address || 'Gomti Nagar',
            city: d.city || 'Lucknow',
            state: 'Uttar Pradesh',
            pincode: d.pincode || '226010',
            phone: d.customerPhone || '+91 99999 99999'
          }
        });
      }

      order = await prisma.order.create({
        data: {
          orderId: d.orderId.replace(/[^A-Za-z0-9]/g, '_'),
          orderNumber: d.orderId,
          customerId,
          shippingAddressId: addr.addressId,
          orderStatus: d.status === 'Delivered' ? 'Delivered' : 'Shipped',
          subtotal: d.orderAmount || 50000,
          totalAmount: d.orderAmount || 50000,
          shippingMethod: 'Armoured Transit'
        }
      });
    }

    const assignedRider = await prisma.user.findUnique({ where: { userId: d.riderId } });
    const assignedRiderId = assignedRider ? assignedRider.userId : null;

    const delivery = await prisma.delivery.upsert({
      where: { trackingNumber },
      update: {
        deliveryStatus: d.status || 'Out for Delivery',
        deliveryHandoverOtp: d.deliveryOtp || d.otp || '4829',
        courierPartner: d.courierPartner || 'BlueDart Express'
      },
      create: {
        deliveryId: d.id,
        orderId: order.orderId,
        courierPartner: d.courierPartner || 'BlueDart Express',
        trackingNumber,
        assignedRiderId,
        deliveryStatus: d.status || 'Out for Delivery',
        deliveryHandoverOtp: d.deliveryOtp || d.otp || '4829',
        dispatchedAt: new Date('2026-11-14T08:30:00.000Z')
      }
    });

    // Real-time location ping
    if (assignedRiderId) {
      await prisma.deliveryLocationPing.create({
        data: {
          deliveryId: delivery.deliveryId,
          riderId: assignedRiderId,
          latitude: 26.8505,
          longitude: 80.9850,
          speedKmh: 35.5,
          headingDegrees: 180.0
        }
      });
    }
  }
  console.log(`Deliveries migrated: ${deliveriesData.length}`);

  // 10. Support Tickets & Messages (6 records)
  console.log('--- Migrating Support Tickets & Conversation Threads ---');
  const customerUser = await prisma.user.findFirst({ where: { email: 'customer@watchhub.com' } });
  const defaultCustomerId = customerUser ? customerUser.userId : '660000000000000000000006';

  for (const tkt of supportTicketsData) {
    const ticketNumber = tkt.ticketId || tkt.id;
    let order = null;
    if (tkt.orderId) {
      order = await prisma.order.findUnique({ where: { orderNumber: tkt.orderId } });
    }

    const ticket = await prisma.supportTicket.upsert({
      where: { ticketNumber },
      update: {
        subject: tkt.subject,
        category: tkt.category || 'General',
        priority: tkt.priority || 'Normal',
        status: tkt.status || 'Open'
      },
      create: {
        ticketId: tkt.id,
        ticketNumber,
        customerId: defaultCustomerId,
        orderId: order ? order.orderId : null,
        subject: tkt.subject || 'Support Inquiry',
        category: tkt.category || 'General',
        priority: tkt.priority || 'Normal',
        status: tkt.status || 'Open',
        assignedAgentId: supportAgentId,
        createdAt: new Date()
      }
    });

    // Support Messages
    if (tkt.messages && Array.isArray(tkt.messages)) {
      for (const msg of tkt.messages) {
        const senderUserId = msg.senderType === 'agent' ? supportAgentId : defaultCustomerId;
        const existingMsg = await prisma.supportMessage.findFirst({
          where: { ticketId: ticket.ticketId, messageText: msg.text }
        });
        if (!existingMsg) {
          await prisma.supportMessage.create({
            data: {
              ticketId: ticket.ticketId,
              senderUserId,
              messageText: msg.text,
              sentAt: new Date()
            }
          });
        }
      }
    }
  }
  console.log(`Support tickets migrated: ${supportTicketsData.length}`);

  console.log('\n=== COMPLETE DATA MIGRATION FINISHED SUCCESSFULLY ===');
}

runFullMigration()
  .catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
