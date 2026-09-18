const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const res = await prisma.product.create({
      data: {
        nameEn: 'Test',
        nameAr: 'Test',
        descriptionEn: 'Test',
        descriptionAr: 'Test',
        categoryId: 'test', // invalid category ID!
        basePrice: 10,
        isActive: true,
        isFeatured: false,
        primaryImage: null,
        gallery: {
          create: []
        }
      }
    });
    console.log("Success:", res);
  } catch (err) {
    console.error("Prisma Error:", err.message);
  }
}
test();
