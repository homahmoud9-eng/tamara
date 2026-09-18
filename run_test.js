const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const cat1 = await prisma.category.create({
      data: {
        nameEn: 'Test1',
        nameAr: 'Test1',
        slug: 'test-1'
      }
    });
    console.log('Cat 1 created:', cat1.id);
    
    const cat2 = await prisma.category.create({
      data: {
        nameEn: 'Test2',
        nameAr: 'Test2',
        slug: 'test-2'
      }
    });
    console.log('Cat 2 created:', cat2.id);
  } catch(e) {
    console.error('Prisma Error:', e);
  } finally {
    await prisma.category.deleteMany({
      where: { slug: { in: ['test-1', 'test-2'] } }
    }).catch(()=>{});
    await prisma.$disconnect();
  }
}
run();
