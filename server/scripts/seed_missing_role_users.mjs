import { prisma } from '../src/config/prisma.js';
import bcrypt from 'bcryptjs';

async function seedRoleAccounts() {
  console.log('[Seed] Ensuring all demo role accounts exist and have Admin@123 password...');

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  // 1. Ensure all Roles exist
  const rolesNeeded = [
    { name: 'Super Admin', desc: 'Full atelier system control' },
    { name: 'Store Admin', desc: 'Product, catalog and orders manager' },
    { name: 'Inventory Manager', desc: 'Warehouse and inventory control' },
    { name: 'Delivery Manager', desc: 'Logistics and delivery fleet manager' },
    { name: 'Delivery Partner', desc: 'Field delivery rider' },
    { name: 'Customer Support Executive', desc: 'Customer support tickets' },
    { name: 'Customer', desc: 'Retail client account' },
  ];

  const roleMap = {};
  for (const r of rolesNeeded) {
    let role = await prisma.role.findUnique({ where: { roleName: r.name } });
    if (!role) {
      role = await prisma.role.create({
        data: { roleName: r.name, description: r.desc },
      });
      console.log(`[Seed] Created role: ${r.name}`);
    }
    roleMap[r.name] = role.roleId;
  }

  // 2. Ensure all Role Users exist with correct role and password
  const accounts = [
    { email: 'superadmin@watchhub.com', name: 'Vikram Malhotra', role: 'Super Admin' },
    { email: 'admin@watchhub.com', name: 'Aanya Singhania', role: 'Store Admin' },
    { email: 'inventory@watchhub.com', name: 'Rajesh Mehta', role: 'Inventory Manager' },
    { email: 'delivery@watchhub.com', name: 'Karan Verma', role: 'Delivery Manager' },
    { email: 'rider@watchhub.com', name: 'Rohan Singh', role: 'Delivery Partner' },
    { email: 'rohan.singh@watchhub.com', name: 'Rohan Singh', role: 'Delivery Partner' },
    { email: 'support@watchhub.com', name: 'Pooja Sharma', role: 'Customer Support Executive' },
    { email: 'customer@watchhub.com', name: 'Arjun Kapoor', role: 'Customer' },
  ];

  for (const acc of accounts) {
    let user = await prisma.user.findUnique({
      where: { email: acc.email },
      include: { userRoles: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: acc.email,
          fullName: acc.name,
          passwordHash,
          isActive: true,
          isEmailVerified: true,
        },
      });
      console.log(`[Seed] Created user: ${acc.email}`);
    } else {
      // Update password hash to Admin@123 and ensure active
      await prisma.user.update({
        where: { email: acc.email },
        data: { passwordHash, isActive: true, isEmailVerified: true },
      });
      console.log(`[Seed] Updated password for: ${acc.email}`);
    }

    const targetRoleId = roleMap[acc.role];
    const hasRole = user.userRoles?.some((ur) => ur.roleId === targetRoleId);
    if (!hasRole && targetRoleId) {
      await prisma.userRole.create({
        data: {
          userId: user.userId,
          roleId: targetRoleId,
        },
      });
      console.log(`[Seed] Assigned role ${acc.role} to ${acc.email}`);
    }
  }

  console.log('[Seed] All role accounts successfully synced and ready!');
}

seedRoleAccounts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
