import { PrismaClient } from '@prisma/client';
import { ROLE_USER, ROLES } from '../constants/roles';
import { PERMISSIONS } from '../constants/permissions';
import { FriendshipStatuses } from '../constants/friendship';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const users = [
  {
    username: 'rustam2007',
    password: 'rustamx',
    shortlink: 'vidget',
    email: faker.internet.email(),
    name: faker.name.fullName(),
    role: {
      connect: { name: ROLE_USER },
    },
  },
  {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    shortlink: faker.word.verb(),
    email: faker.internet.email(),
    name: faker.name.fullName(),
    role: {
      connect: { name: ROLE_USER },
    },
  },
];

async function main() {
  for (const permission in PERMISSIONS) {
    await prisma.permission.create({
      data: {
        name: PERMISSIONS[permission],
      },
    });
  }
  for (const fs in FriendshipStatuses) {
    await prisma.friendshipStatuses.create({
      data: {
        name: fs,
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
  for (let key = 0; key < users.length; key++) {
    await prisma.user.create({
      data: {
        ...users[key],
      },
    });
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
