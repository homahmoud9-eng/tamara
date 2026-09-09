import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@tamara.com';
  const password = 'password123';
  
  // Create Super Admin role if not exists
  let role = await prisma.role.findFirst({
    where: { name: 'SUPER_ADMIN' }
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'Super Administrator with full access'
      }
    });
    console.log('Created SUPER_ADMIN role');
  }

  // Check if admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    console.log(`Admin ${email} already exists.`);
    
    // Ensure password is correct
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword, roleId: role.id, status: 'ACTIVE' }
    });
    console.log(`Updated existing admin password and role.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      name: 'Super Admin',
      email,
      password: hashedPassword,
      roleId: role.id,
      status: 'ACTIVE'
    }
  });

  console.log(`Successfully created admin user: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
