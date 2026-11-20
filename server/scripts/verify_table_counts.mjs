import { prisma } from '../src/config/prisma.js';

async function main() {
  const models = [
    { name: 'User', key: 'user' },
    { name: 'Role', key: 'role' },
    { name: 'Permission', key: 'permission' },
    { name: 'RolePermission', key: 'rolePermission' },
    { name: 'UserRole', key: 'userRole' },
    { name: 'Address', key: 'address' },
    { name: 'Brand', key: 'brand' },
    { name: 'Category', key: 'category' },
    { name: 'Product', key: 'product' },
    { name: 'ProductImage', key: 'productImage' },
    { name: 'Warehouse', key: 'warehouse' },
    { name: 'Inventory', key: 'inventory' },
    { name: 'StockTransaction', key: 'stockTransaction' },
    { name: 'Coupon', key: 'coupon' },
    { name: 'Order', key: 'order' },
    { name: 'OrderItem', key: 'orderItem' },
    { name: 'Payment', key: 'payment' },
    { name: 'Delivery', key: 'delivery' },
    { name: 'DeliveryLocationPing', key: 'deliveryLocationPing' },
    { name: 'SupportTicket', key: 'supportTicket' },
    { name: 'SupportMessage', key: 'supportMessage' },
    { name: 'AuditLog', key: 'auditLog' },
    { name: 'OTPVerification', key: 'oTPVerification' },
  ];

  console.log('ModelName,Key,Count');
  let total = 0;
  for (const m of models) {
    const count = await prisma[m.key].count();
    console.log(`${m.name},${m.key},${count}`);
    total += count;
  }
  console.log(`TOTAL,,${total}`);

  // Also count migration history
  const migrations = await prisma.$queryRaw`SELECT COUNT(*) AS migrationCount FROM [_prisma_migrations];`;
  console.log(`_prisma_migrations,raw,${migrations[0].migrationCount}`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Count error:', err);
  process.exit(1);
});
