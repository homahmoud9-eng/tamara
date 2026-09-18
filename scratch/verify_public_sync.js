const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSync() {
  const product = await prisma.product.findFirst();
  if (!product) {
    console.log("No product found.");
    return;
  }
  
  console.log(`Original Name: ${product.nameEn}`);
  
  // Temporary modify
  await prisma.product.update({
    where: { id: product.id },
    data: { nameEn: product.nameEn + ' (Updated via Sync Test)' }
  });
  
  console.log(`Updated in PostgreSQL. Attempting to fetch from frontend...`);
  
  try {
    const res = await fetch(`http://localhost:3001/api/profile`); // Or another public route that hits DB
    // actually, let's just hit the menu page since it's publicly accessible
    const res2 = await fetch(`http://localhost:3001/menu`);
    if (res2.ok) {
        const html = await res2.text();
        if (html.includes('(Updated via Sync Test)')) {
            console.log("✅ Cache invalidated and frontend synchronized.");
        } else {
            console.log("❌ Frontend did NOT synchronize. Cache invalidation might have failed or not implemented correctly via revalidatePath.");
        }
    }
  } catch (err) {
    console.log("Fetch failed", err.message);
  }

  // Restore
  await prisma.product.update({
    where: { id: product.id },
    data: { nameEn: product.nameEn }
  });
  console.log("Restored original product state.");
}

testSync().finally(() => prisma.$disconnect());
