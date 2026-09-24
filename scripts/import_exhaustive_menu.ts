import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface VariantData {
  nameAr: string;
  price: number | null;
}

interface ItemData {
  sourceDoc: string;
  page: number;
  category: string;
  nameAr: string;
  descriptionAr: string;
  price: number | null;
  variants?: VariantData[];
  type?: string;
}

async function slugify(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now().toString().slice(-4);
}

async function main() {
  const dataPath = path.join(__dirname, 'menu_data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const items: ItemData[] = JSON.parse(rawData);

  let totalSourceRecords = items.length;
  let importedCount = 0;
  let matchedCount = 0;
  let manualReviewCount = 0;
  let duplicateCount = 0; // if we find duplicates in the source json

  const reviewItems: any[] = [];
  const processedNames = new Set<string>();

  for (const item of items) {
    if (processedNames.has(item.nameAr)) {
      duplicateCount++;
      continue;
    }
    processedNames.add(item.nameAr);

    // Check for Manual Review conditions
    if (item.price === null && !item.variants?.every(v => v.price !== null)) {
      manualReviewCount++;
      reviewItems.push({
        sourceDoc: item.sourceDoc,
        page: item.page,
        extractedText: item.nameAr,
        reason: 'Missing price'
      });
      continue;
    }

    if (item.type === 'package') {
      const existing = await prisma.package.findFirst({ where: { nameAr: item.nameAr } });
      if (existing) {
        matchedCount++;
      } else {
        await prisma.package.create({
          data: {
            nameAr: item.nameAr,
            nameEn: '',
            descriptionAr: item.descriptionAr,
            packagePrice: item.price || 0,
            isActive: false, // hidden until reviewed
          }
        });
        importedCount++;
      }
    } else {
      // Find or create category
      let category = await prisma.category.findFirst({ where: { nameAr: item.category } });
      if (!category) {
        const slug = await slugify(item.category);
        category = await prisma.category.create({
          data: {
            nameAr: item.category,
            nameEn: item.category,
            slug: slug || `cat-${Date.now()}`
          }
        });
      }

      const existing = await prisma.product.findFirst({ where: { nameAr: item.nameAr } });
      if (existing) {
        matchedCount++;
      } else {
        const product = await prisma.product.create({
          data: {
            categoryId: category.id,
            nameAr: item.nameAr,
            nameEn: '',
            descriptionAr: item.descriptionAr,
            basePrice: item.price || (item.variants?.[0]?.price) || 0,
            isActive: false, // hidden until manually organized
          }
        });
        
        if (item.variants && item.variants.length > 0) {
          for (const [index, v] of item.variants.entries()) {
            await prisma.variant.create({
              data: {
                productId: product.id,
                nameAr: v.nameAr,
                nameEn: '',
                price: v.price || 0,
                sortOrder: index,
              }
            });
          }
        }
        importedCount++;
      }
    }
  }

  const report = `
# Exhaustive Menu Import Report

**TOTAL SOURCE RECORDS:** ${totalSourceRecords}
**TOTAL UNIQUE RECORDS:** ${processedNames.size}
**TOTAL DUPLICATES (in source):** ${duplicateCount}
**TOTAL IMPORTED:** ${importedCount}
**TOTAL MATCHED TO EXISTING:** ${matchedCount}
**TOTAL NEEDS REVIEW:** ${manualReviewCount}

## Items Needing Manual Review

${reviewItems.length === 0 ? 'None' : reviewItems.map(i => 
  `- **${i.extractedText}** (Source: ${i.sourceDoc}, Page: ${i.page}) - Reason: ${i.reason}`
).join('\\n')}
`;

  fs.writeFileSync(path.join(__dirname, '..', 'import_report.md'), report);
  console.log('Import complete. Report saved to import_report.md');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
