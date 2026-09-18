const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log(categories.map(c => ({ nameAr: c.nameAr, nameEn: c.nameEn, slug: c.slug })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
