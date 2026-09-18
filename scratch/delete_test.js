const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function del() {
  const p = await prisma.product.findUnique({
    where: { id: 'cmu6ojfuk0001t4tp0he76cvo' }
  });
  console.log('Found:', p?.nameEn);
  
  if (p && p.nameEn === 'Test QA Product') {
    await prisma.product.delete({
      where: { id: p.id }
    });
    console.log('Deleted successfully.');
  } else {
    console.log('Not found or name does not match.');
  }
}

del().finally(() => prisma.$disconnect());
