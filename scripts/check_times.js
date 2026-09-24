const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const items = JSON.parse(fs.readFileSync('./scripts/menu_data.json', 'utf-8'));
  let earliest = new Date('2030-01-01');
  let latest = new Date('2000-01-01');
  let found = 0;
  for (const item of items) {
    if (item.price === null && !(item.variants && item.variants.every(v => v.price !== null))) continue;
    
    let dbRecord = item.type === 'package' 
      ? await prisma.package.findFirst({ where: { nameAr: item.nameAr } })
      : await prisma.product.findFirst({ where: { nameAr: item.nameAr } });
      
    if (dbRecord && dbRecord.createdAt) {
      found++;
      if (dbRecord.createdAt < earliest) earliest = dbRecord.createdAt;
      if (dbRecord.createdAt > latest) latest = dbRecord.createdAt;
    }
  }
  console.log(`Found ${found} records with createdAt.`);
  console.log(`Earliest: ${earliest.toISOString()}`);
  console.log(`Latest: ${latest.toISOString()}`);
}
main().finally(() => prisma.$disconnect());
