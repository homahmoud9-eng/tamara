const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const category = await prisma.category.findFirst();
    if (!category) {
      console.log('No categories found. Cannot create test product.');
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        nameEn: 'Test QA Product',
        nameAr: 'منتج تجريبي QA',
        categoryId: category.id,
        basePrice: 9.99,
        isActive: false, // hidden from public
      }
    });

    console.log('Successfully created test product:', newProduct.id, newProduct.nameEn);
  } catch (err) {
    console.error('Failed to create product:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
