import { prisma } from '../src/config/prisma.js';

async function checkDatabase() {
  const users = await prisma.user.count();
  const customers = await prisma.user.count({
    where: { userRoles: { some: { role: { roleName: 'Customer' } } } },
  });
  const products = await prisma.product.count();
  const categories = await prisma.category.count();
  const brands = await prisma.brand.count();
  const orders = await prisma.order.count();
  const inventory = await prisma.inventory.count();
  const coupons = await prisma.coupon.count();

  console.log('--- DATABASE STATUS ---');
  console.log({ users, customers, products, categories, brands, orders, inventory, coupons });

  // Sample orders if any
  const sampleOrders = await prisma.order.findMany({
    take: 3,
    include: { orderItems: true, payments: true },
  });
  console.log('Sample Orders:', sampleOrders);

  // Sample products
  const sampleProducts = await prisma.product.findMany({
    take: 3,
    include: { inventory: true, category: true, brand: true },
  });
  console.log('Sample Products:', sampleProducts);

  process.exit(0);
}

checkDatabase().catch((e) => {
  console.error('Check failed:', e);
  process.exit(1);
});
