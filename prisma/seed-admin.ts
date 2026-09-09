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
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@tamara.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@tamara.com',
      password: hashedPassword,
      name: 'Tamara Admin',
      roleId: role.id,
      status: 'ACTIVE',
    },
  });
  
  console.log('Admin user created: admin@tamara.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
