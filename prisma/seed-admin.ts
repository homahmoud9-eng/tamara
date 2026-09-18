import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create Super Admin role
  const role = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Has access to everything',
    },
  });

  // Create default admin user
  const hashedPassword = await bcrypt.hash('vision26', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@vision.com' },
    update: {
      password: hashedPassword,
      status: 'ACTIVE',
    },
    create: {
      email: 'admin@vision.com',
      password: hashedPassword,
      name: 'Vision Admin',
      roleId: role.id,
      status: 'ACTIVE',
    },
  });
  
  console.log('Admin user created/updated: admin@vision.com / vision26');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
