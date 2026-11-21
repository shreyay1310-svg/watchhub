import { prisma } from '../src/config/prisma.js';

async function discoverRoles() {
  const roles = await prisma.role.findMany({
    include: {
      userRoles: {
        include: {
          user: {
            select: { userId: true, fullName: true, email: true, isActive: true }
          }
        }
      },
      rolePermissions: {
        include: {
          permission: true
        }
      }
    }
  });

  console.log('=== DISCOVERED ROLES IN SQL SERVER (WatchHubDB) ===\n');
  for (const r of roles) {
    console.log(`Role: "${r.roleName}" (ID: ${r.roleId}) | Description: ${r.description}`);
    console.log(`  Assigned Users Count: ${r.userRoles.length}`);
    for (const ur of r.userRoles) {
      console.log(`    - ${ur.user.email} (${ur.user.fullName}) [Active: ${ur.user.isActive}]`);
    }
    const perms = r.rolePermissions.map(rp => rp.permission.permissionCode);
    console.log(`  Permissions (${perms.length}): ${perms.join(', ')}\n`);
  }
}

discoverRoles()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
