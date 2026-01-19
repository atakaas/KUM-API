import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'admin@kum.com',
      password: 'hashed-password',
      firstName: 'Admin',
      lastName: 'KUM',
      role: UserRole.ADMIN,
    },
  });
}

main();
