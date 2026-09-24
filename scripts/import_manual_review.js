const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function slugify(text) {
  return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now().toString().slice(-4);
}

async function main() {
  const items = JSON.parse(fs.readFileSync('./scripts/menu_data.json', 'utf-8'));
  let inserted = 0;
  for (const item of items) {
    if (item.price === null && !(item.variants && item.variants.every(v => v.price !== null))) {
      // It's a manual review item
      let category = await prisma.category.findFirst({ where: { nameAr: item.category } });
      if (!category) {
        category = await prisma.category.create({
          data: {
            nameAr: item.category,
            nameEn: item.category,
            slug: await slugify(item.category)
          }
        });
      }

      const existing = await prisma.product.findFirst({ where: { nameAr: item.nameAr } });
      if (!existing) {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            nameAr: item.nameAr,
            nameEn: '',
            descriptionAr: item.descriptionAr || '',
            basePrice: 0,
            isActive: false,
          }
        });
        
        if (item.variants && item.variants.length > 0) {
          for (let i = 0; i < item.variants.length; i++) {
            const v = item.variants[i];
            await prisma.variant.create({
              data: {
                productId: product.id,
                nameAr: v.nameAr,
                nameEn: '',
                price: 0,
                sortOrder: i,
              }
            });
          }
        }
        inserted++;
      }
    }
  }
  console.log(`Inserted ${inserted} manual review items into DB.`);
}

main().finally(() => prisma.$disconnect());
