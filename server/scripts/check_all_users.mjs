import { prisma } from '../src/config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const users = await prisma.user.findMany({
    include: { userRoles: { include: { role: true } } }
  });
  console.log(`Found ${users.length} users in DB:`);
  for (const u of users) {
    const roles = u.userRoles.map(ur => ur.role.roleName).join(', ');
    const isPassValid = await bcrypt.compare('Admin@123', u.passwordHash);
    console.log(`- Email: ${u.email} | Name: ${u.fullName} | Roles: [${roles}] | Active: ${u.isActive} | Admin@123: ${isPassValid}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
