import { PrismaClient } from '@prisma/client';
import { mockCategories, mockProducts, mockOffers, mockBanners } from '../src/models/mock/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Categories
  for (const cat of mockCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: cat.id,
        nameAr: cat.name.ar,
        nameEn: cat.name.en,
        slug: cat.slug,
        image: cat.image,
        titleImage: cat.titleImage,
        sortOrder: cat.sortOrder,
        isActive: cat.active,
      },
    });
  }
  console.log('Categories seeded.');

  // 2. Products & Variants
  for (const prod of mockProducts) {
    const createdProduct = await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: {
        id: prod.id,
        categoryId: prod.categoryId,
        nameAr: prod.name.ar,
        nameEn: prod.name.en,
        descriptionAr: prod.description?.ar,
        descriptionEn: prod.description?.en,
        primaryImage: prod.baseImage,
        isActive: prod.active,
        isFeatured: prod.featured || false,
        isBestseller: prod.bestseller || false,
        sortOrder: prod.sortOrder || 0,
        rating: prod.ratingAggregate || 0,
        reviewCount: prod.reviewsCount || 0,
      },
    });

    // Variants
    if (prod.variants) {
      for (const variant of prod.variants) {
        await prisma.variant.upsert({
          where: { id: variant.id },
          update: {},
          create: {
            id: variant.id,
            productId: createdProduct.id,
            nameAr: variant.name.ar,
            nameEn: variant.name.en,
            price: variant.price,
            image: variant.image,
            isDefault: variant.isDefault || false,
            isActive: variant.active !== false,
          },
        });
      }
    }
  }
  console.log('Products seeded.');

  // 3. Offers
  for (const offer of mockOffers) {
    await prisma.offer.upsert({
      where: { id: offer.id },
      update: {},
      create: {
        id: offer.id,
        titleAr: offer.title.ar,
        titleEn: offer.title.en,
        descriptionAr: offer.subtitle?.ar,
        descriptionEn: offer.subtitle?.en,
        image: offer.image,
        discountType: offer.discountType.toUpperCase(),
        discountValue: offer.discountValue,
        ctaTextAr: offer.ctaText?.ar,
        ctaTextEn: offer.ctaText?.en,
        ctaLink: offer.ctaLink,
        isActive: offer.active !== false,
      },
    });
  }
  console.log('Offers seeded.');

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
