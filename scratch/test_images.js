const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log(categories.map(c => ({ nameAr: c.nameAr, slug: c.slug, image: c.image, titleImage: c.titleImage })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
