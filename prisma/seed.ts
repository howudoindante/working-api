import { PrismaClient } from '@prisma/client';
import { ROLES } from '../constants/roles';
import { PERMISSIONS } from '../constants/permissions';

// const friendshipStatusesList = [
//   'PENDING_FIRST_SECOND',
//   'PENDING_SECOND_FIRST',
//   'FRIENDS',
//   'BLOCK_FIRST_SECOND',
//   'BLOCK_SECOND_FIRST',
//   'BLOCK_BOTH',
// ];

const prisma = new PrismaClient();

async function main() {
  for (const permission in PERMISSIONS) {
    await prisma.permission.create({
      data: {
        name: PERMISSIONS[permission],
      },
    });
  }
  for (const role in ROLES) {
    const createdRole = await prisma.role.create({
      data: {
        name: role,
      },
    });

    for (let key = 0; key < ROLES[role].permissions.length; key++) {
      const pName = ROLES[role].permissions[key];
      const permission = await prisma.permission.findFirst({
        where: {
          name: pName,
        },
      });
      await prisma.rolesPermissions.create({
        data: {
          roleId: createdRole.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
