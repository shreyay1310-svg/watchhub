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

function readSnapshotJson(filename) {
  const filePath = path.join(SNAPSHOT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Snapshot file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function seedRolesAndPermissions() {
  console.log('--- 1. Seeding Roles and Permissions ---');
  
  const rolesData = [
    { roleName: 'Super Admin', description: 'Unrestricted system-wide authority' },
    { roleName: 'Store Admin', description: 'Store operations, product catalog, orders & promotions' },
    { roleName: 'Inventory Manager', description: 'Stock, warehouse operations, procurement' },
    { roleName: 'Delivery Manager', description: 'Fulfillment, rider assignment, tracking' },
    { roleName: 'Customer Support Executive', description: 'Ticketing, customer resolutions, chat' },
    { roleName: 'Customer', description: 'Store customer, shopping, order history' },
    { roleName: 'Delivery Partner', description: 'Rider app access, delivery status, live location pings' }
  ];

  const roleMap = new Map();
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { roleName: r.roleName },
      update: { description: r.description },
      create: { roleName: r.roleName, description: r.description }
    });
    roleMap.set(r.roleName, role.roleId);
  }
  console.log(`Roles verified/created: ${roleMap.size}`);

  const permissionsData = [
    { code: 'all', module: 'System', desc: 'Full administrative access' },
    { code: 'manage_products', module: 'Catalog', desc: 'Create, update, delete products' },
    { code: 'manage_orders', module: 'Orders', desc: 'View and update customer orders' },
    { code: 'view_analytics', module: 'Analytics', desc: 'View revenue and business KPIs' },
    { code: 'manage_discounts', module: 'Marketing', desc: 'Configure promotional coupons' },
    { code: 'manage_stock', module: 'Inventory', desc: 'Adjust stock levels' },
    { code: 'receive_shipments', module: 'Inventory', desc: 'Receive inward consignments' },
    { code: 'update_low_stock', module: 'Inventory', desc: 'Update low stock alert thresholds' },
    { code: 'view_reports', module: 'Inventory', desc: 'Access inventory ledger reports' },
    { code: 'assign_courier', module: 'Delivery', desc: 'Assign riders to consignments' },
    { code: 'update_tracking', module: 'Delivery', desc: 'Update dispatch and shipment milestones' },
    { code: 'manage_returns', module: 'Delivery', desc: 'Process reverse logistics' },
    { code: 'confirm_dispatch', module: 'Delivery', desc: 'Confirm handover to courier' },
    { code: 'view_tickets', module: 'Support', desc: 'View customer support tickets' },
    { code: 'resolve_complaints', module: 'Support', desc: 'Resolve and close tickets' },
    { code: 'initiate_refund', module: 'Support', desc: 'Authorize payment refunds' },
    { code: 'live_chat', module: 'Support', desc: 'Engage in live support messaging' },
    { code: 'shop', module: 'Storefront', desc: 'Browse catalog and place orders' },
    { code: 'review', module: 'Storefront', desc: 'Submit product ratings and reviews' },
    { code: 'track_orders', module: 'Storefront', desc: 'View delivery tracking for own orders' },
    { code: 'wishlist', module: 'Storefront', desc: 'Maintain wishlist items' }
  ];

  const permMap = new Map();
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { permissionCode: p.code },
      update: { moduleName: p.module, description: p.desc },
      create: { permissionCode: p.code, moduleName: p.module, description: p.desc }
    });
    permMap.set(p.code, perm.permissionId);
  }
  console.log(`Permissions verified/created: ${permMap.size}`);

  const rolePermMappings = [
    { role: 'Super Admin', perms: ['all'] },
    { role: 'Store Admin', perms: ['manage_products', 'manage_orders', 'view_analytics', 'manage_discounts'] },
    { role: 'Inventory Manager', perms: ['manage_stock', 'receive_shipments', 'update_low_stock', 'view_reports'] },
    { role: 'Delivery Manager', perms: ['assign_courier', 'update_tracking', 'manage_returns', 'confirm_dispatch'] },
    { role: 'Customer Support Executive', perms: ['view_tickets', 'resolve_complaints', 'initiate_refund', 'live_chat'] },
    { role: 'Customer', perms: ['shop', 'review', 'track_orders', 'wishlist'] },
    { role: 'Delivery Partner', perms: ['update_tracking'] }
  ];

  for (const mapping of rolePermMappings) {
    const roleId = roleMap.get(mapping.role);
    for (const code of mapping.perms) {
      const permId = permMap.get(code);
      if (roleId && permId) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId, permissionId: permId } },
          update: {},
          create: { roleId, permissionId: permId }
        });
      }
    }
  }
  console.log('RolePermissions mapped.');
  return { roleMap, permMap };
}

async function seedUsers(roleMap) {
  console.log('--- 2. Seeding Users & UserRoles ---');
  const usersSnapshot = readSnapshotJson('users.json');

  for (const u of usersSnapshot) {
    const userId = u._id;
    const user = await prisma.user.upsert({
      where: { userId },
      update: {
        fullName: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash: u.password,
        avatarUrl: u.avatar || null,
        isActive: u.isActive !== undefined ? u.isActive : true,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date()
      },
      create: {
        userId,
        fullName: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash: u.password,
        avatarUrl: u.avatar || null,
        isActive: u.isActive !== undefined ? u.isActive : true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date()
      }
    });

    const roleName = u.role;
    const roleId = roleMap.get(roleName);
    if (roleId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId } },
        update: {},
        create: { userId, roleId }
      });
    }

    if (u.addresses && Array.isArray(u.addresses)) {
      for (const addr of u.addresses) {
        const existingAddr = await prisma.address.findFirst({
          where: { userId, street: addr.street, pincode: addr.pincode }
        });
        if (!existingAddr) {
          await prisma.address.create({
            data: {
              userId,
              fullName: addr.fullName || u.name,
              street: addr.street,
              city: addr.city,
              state: addr.state,
              pincode: addr.pincode,
              phone: addr.phone || u.phone,
              isDefault: addr.isDefault || false
            }
          });
        }
      }
    }
  }
  console.log(`Users seeded: ${usersSnapshot.length}`);
}

async function seedWarehouses() {
  console.log('--- 3. Seeding Warehouses ---');
  const warehousesSnapshot = readSnapshotJson('warehouses.json');
  const warehouseMap = new Map();

  for (const w of warehousesSnapshot) {
    const code = w.id.toUpperCase();
    const warehouse = await prisma.warehouse.upsert({
      where: { warehouseCode: code },
      update: {
        name: w.name,
        address: w.address,
        city: w.city,
        state: w.city.includes('Haryana') ? 'Haryana' : w.city.includes('Delhi') ? 'Delhi' : 'Maharashtra',
        contactPhone: w.managerContact || '+91 98000 00000',
        isActive: w.status === 'Operational'
      },
      create: {
        warehouseCode: code,
        name: w.name,
        address: w.address,
        city: w.city,
        state: w.city.includes('Haryana') ? 'Haryana' : w.city.includes('Delhi') ? 'Delhi' : 'Maharashtra',
        contactPhone: w.managerContact || '+91 98000 00000',
        isActive: w.status === 'Operational'
      }
    });
    warehouseMap.set(w.id, warehouse.warehouseId);
    warehouseMap.set(code, warehouse.warehouseId);
  }
  console.log(`Warehouses seeded: ${warehousesSnapshot.length}`);
  return warehouseMap;
}

async function seedCoupons() {
  console.log('--- 4. Seeding Coupons ---');
  const couponsSnapshot = readSnapshotJson('coupons.json');

  for (const c of couponsSnapshot) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {
        discountPercentage: c.discountPct,
        maxDiscountAmount: c.maxCap,
        minOrderAmount: c.minOrder,
        isActive: c.isActive
      },
      create: {
        code: c.code,
        discountPercentage: c.discountPct,
        maxDiscountAmount: c.maxCap,
        minOrderAmount: c.minOrder,
        validFrom: new Date('2026-01-01'),
        validUntil: new Date('2026-12-31'),
        usageLimit: 1000,
        timesUsed: 0,
        isActive: c.isActive
      }
    });
  }
  console.log(`Coupons seeded: ${couponsSnapshot.length}`);
}

async function seedBrandsAndCategories(products) {
  console.log('--- 5. Seeding Brands and Categories ---');
  const brandSet = new Set();
  const categorySet = new Set();

  for (const p of products) {
    if (p.brand) brandSet.add(p.brand.trim());
    if (p.category) categorySet.add(p.category.trim());
  }

  const brandMap = new Map();
  for (const brandName of brandSet) {
    const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: { name: brandName },
      create: {
        slug,
        name: brandName,
        originCountry: 'Switzerland',
        isLuxuryTier: true,
        isActive: true
      }
    });
    brandMap.set(brandName, brand.brandId);
  }
  console.log(`Brands seeded: ${brandMap.size}`);

  const categoryMap = new Map();
  for (const catName of categorySet) {
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cat = await prisma.category.upsert({
      where: { categorySlug: slug },
      update: { name: catName },
      create: {
        categorySlug: slug,
        name: catName,
        description: `${catName} luxury timepieces`,
        isActive: true
      }
    });
    categoryMap.set(catName, cat.categoryId);
  }
  console.log(`Categories seeded: ${categoryMap.size}`);

  return { brandMap, categoryMap };
}

async function seedProductsAndInventory(warehouseMap, brandMap, categoryMap) {
  console.log('--- 6. Seeding Products, Images, and Inventory ---');
  const products = readSnapshotJson('products.json');

  let defaultWarehouseId = warehouseMap.get('wh_main') || Array.from(warehouseMap.values())[0];

  for (const p of products) {
    const brandId = brandMap.get(p.brand) || Array.from(brandMap.values())[0];
    const categoryId = categoryMap.get(p.category) || Array.from(categoryMap.values())[0];
    const sku = `WH-${p.id.toUpperCase().replace(/[^A-Z0-9]/g, '-')}`;

    const product = await prisma.product.upsert({
      where: { sku },
      update: {
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || p.price,
        discountPercentage: p.discount || 0,
        gender: p.gender || 'Men',
        movementType: p.movement || 'Automatic Chronometer',
        caseMaterial: p.caseMaterial || 'Oystersteel / Sapphire',
        dialColor: p.dialColor || 'Black / Slate',
        strapMaterial: p.strapMaterial || 'Stainless Steel / Alligator Leather',
        waterResistance: p.waterproof || '100M Water Resistant',
        description: p.description || p.name,
        isFeatured: p.isTrending || false,
        isActive: true
      },
      create: {
        productId: p.id,
        sku,
        brandId,
        categoryId,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || p.price,
        discountPercentage: p.discount || 0,
        gender: p.gender || 'Men',
        movementType: p.movement || 'Automatic Chronometer',
        caseMaterial: p.caseMaterial || 'Oystersteel / Sapphire',
        dialColor: p.dialColor || 'Black / Slate',
        strapMaterial: p.strapMaterial || 'Stainless Steel / Alligator Leather',
        waterResistance: p.waterproof || '100M Water Resistant',
        description: p.description || p.name,
        isFeatured: p.isTrending || false,
        isActive: true
      }
    });

    if (p.image) {
      const existingImg = await prisma.productImage.findFirst({
        where: { productId: product.productId, imageUrl: p.image }
      });
      if (!existingImg) {
        await prisma.productImage.create({
          data: {
            productId: product.productId,
            imageUrl: p.image,
            displayOrder: 1,
            isPrimary: true
          }
        });
      }
    }

    if (defaultWarehouseId) {
      await prisma.inventory.upsert({
        where: {
          UQ_Product_Warehouse: {
            productId: product.productId,
            warehouseId: defaultWarehouseId
          }
        },
        update: {
          currentStock: p.stock !== undefined ? p.stock : 10
        },
        create: {
          productId: product.productId,
          warehouseId: defaultWarehouseId,
          currentStock: p.stock !== undefined ? p.stock : 10,
          reservedStock: 0,
          lastRestockedAt: new Date()
        }
      });
    }
  }
  console.log(`Products, Images and Initial Inventory seeded: ${products.length}`);
}

async function main() {
  console.log('=== STARTING IDEMPOTENT INITIAL MSSQL SEEDING (STAGE 2) ===\n');
  const startTime = Date.now();

  try {
    const { roleMap, permMap } = await seedRolesAndPermissions();
    await seedUsers(roleMap);
    const warehouseMap = await seedWarehouses();
    await seedCoupons();

    const products = readSnapshotJson('products.json');
    const { brandMap, categoryMap } = await seedBrandsAndCategories(products);
    await seedProductsAndInventory(warehouseMap, brandMap, categoryMap);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n=== STAGE 2 INITIAL SEEDING COMPLETED SUCCESSFULLY (${elapsed}s) ===`);
  } catch (error) {
    console.error('\n!!! SEEDING FAILED WITH ERROR !!!');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
