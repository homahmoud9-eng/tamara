const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function chk() {
  const p = await prisma.product.findFirst();
  console.log(p ? 'Has product: ' + p.nameEn : 'No products at all');
}
chk().finally(() => prisma.$disconnect());
