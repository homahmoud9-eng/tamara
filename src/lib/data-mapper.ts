import prisma from './prisma';
import { Category, Product, ProductVariant } from '@/models/types';

export async function getFrontendHomepageSections() {
  const sections = await prisma.homepageSection.findMany({
    where: { isEnabled: true },
    orderBy: { sortOrder: 'asc' }
  });
  return sections;
}

export async function getFrontendHeroSlides() {
  const slides = await prisma.heroSlide.findMany({
    where: { 
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: new Date() } }
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } }
          ]
        }
      ]
    },
    orderBy: { sortOrder: 'asc' }
  });

  return slides.map(s => ({
    id: s.id,
    desktopImg: s.desktopImg,
    mobileImg: s.mobileImg,
    title: { ar: s.titleAr || '', en: s.titleEn || '' },
    subtitle: { ar: s.subtitleAr || '', en: s.subtitleEn || '' },
    ctaText: { ar: s.ctaTextAr || '', en: s.ctaTextEn || '' },
    ctaLink: s.ctaLink || ''
  }));
}

export async function getFrontendCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });

  return categories.map(c => ({
    id: c.id,
    name: { ar: c.nameAr, en: c.nameEn },
    slug: c.slug,
    image: c.image || '/assets/images/placeholder.png',
    titleImage: c.titleImage || undefined,
    titleImageAr: c.titleImageAr || undefined,
    titleImageEn: c.titleImageEn || undefined,
    sortOrder: c.sortOrder,
    active: c.isActive
  }));
}

export async function getFrontendProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      },
      addonGroups: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          addons: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      },
      gallery: {
        orderBy: { sortOrder: 'asc' }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  return products.map(p => {
    const defaultVariant = p.variants.find(v => v.isDefault) || p.variants[0];
    const price = defaultVariant ? defaultVariant.price : p.basePrice;
    const fallbackImage = p.primaryImage || '/assets/images/placeholder.png';
    const variantImage = defaultVariant?.image;

    return {
      id: p.id,
      categoryId: p.categoryId,
      name: { ar: p.nameAr, en: p.nameEn },
      description: { ar: p.descriptionAr || '', en: p.descriptionEn || '' },
      baseImage: fallbackImage,
      active: p.isActive,
      featured: p.isFeatured,
      bestseller: false, // Update later based on logic
      sortOrder: p.sortOrder,
      ratingAggregate: 0,
      reviewsCount: 0,
      price: price,
      image: variantImage || fallbackImage,
      gallery: p.gallery?.map(g => ({ id: g.id, image: g.image })) || [],
      variants: p.variants.map(v => ({
        id: v.id,
        productId: v.productId,
        name: { ar: v.nameAr, en: v.nameEn || v.nameAr },
        price: v.price,
        image: v.image || fallbackImage,
        active: v.isActive,
        available: v.availability === 'AVAILABLE',
        isDefault: v.isDefault,
        sortOrder: v.sortOrder,
        servingDescription: { ar: v.servingDescAr || '', en: v.servingDescEn || '' }
      })),
      addonGroups: p.addonGroups.map(g => ({
        id: g.id,
        productId: g.productId,
        name: { ar: g.nameAr, en: g.nameEn },
        required: g.isRequired,
        minSelect: g.minSelect,
        maxSelect: g.maxSelect,
        addons: g.addons.map(a => ({
          id: a.id,
          groupId: a.groupId,
          name: { ar: a.nameAr, en: a.nameEn },
          price: a.price
        }))
      }))
    };
  });
}

export async function getFrontendProduct(id: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({
    where: { id, isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      },
      addonGroups: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          addons: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      },
      gallery: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!p) return null;

  const defaultVariant = p.variants.find(v => v.isDefault) || p.variants[0];
  const price = defaultVariant ? defaultVariant.price : p.basePrice;
  const fallbackImage = p.primaryImage || '/assets/images/placeholder.png';
  const variantImage = defaultVariant?.image;

  return {
    id: p.id,
    categoryId: p.categoryId,
    name: { ar: p.nameAr, en: p.nameEn },
    description: { ar: p.descriptionAr || '', en: p.descriptionEn || '' },
    baseImage: fallbackImage,
    active: p.isActive,
    featured: p.isFeatured,
    bestseller: false, // Update later based on logic
    sortOrder: p.sortOrder,
    ratingAggregate: 0, 
    reviewsCount: 0, 
    price: price,
    image: variantImage || fallbackImage,
    gallery: p.gallery?.map(g => ({ id: g.id, image: g.image })) || [],
    variants: p.variants.map(v => ({
      id: v.id,
      productId: v.productId,
      name: { ar: v.nameAr, en: v.nameEn || v.nameAr },
      price: v.price,
      image: v.image || fallbackImage,
      active: v.isActive,
      available: v.availability === 'AVAILABLE',
      isDefault: v.isDefault,
      sortOrder: v.sortOrder,
      servingDescription: { ar: v.servingDescAr || '', en: v.servingDescEn || '' }
    })),
    addonGroups: p.addonGroups.map(g => ({
      id: g.id,
      productId: g.productId,
      name: { ar: g.nameAr, en: g.nameEn },
      required: g.isRequired,
      minSelect: g.minSelect,
      maxSelect: g.maxSelect,
      addons: g.addons.map(a => ({
        id: a.id,
        groupId: a.groupId,
        name: { ar: a.nameAr, en: a.nameEn },
        price: a.price
      }))
    }))
  };
}

export async function getFrontendOffers() {
  const offers = await prisma.offer.findMany({
    where: { isActive: true }
  });

  return offers.map(o => ({
    id: o.id,
    title: { ar: o.titleAr, en: o.titleEn },
    subtitle: { ar: o.descriptionAr || '', en: o.descriptionEn || '' },
    image: o.image || '/assets/images/placeholder.png',
    discountType: (o.discountType.toLowerCase() === 'percentage' ? 'percentage' : (o.discountType.toLowerCase() === 'fixed' ? 'fixed' : 'free_delivery')) as 'percentage' | 'fixed' | 'free_delivery',
    discountValue: o.discountValue,
    ctaText: { ar: o.ctaTextAr || 'تسوق الآن', en: o.ctaTextEn || 'Shop Now' },
    ctaLink: o.ctaLink || `/offers/${o.id}`,
    active: o.isActive
  }));
}

export async function getFrontendReviews() {
  const reviews = await prisma.review.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      customer: true
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return reviews.map(r => ({
    id: r.id,
    rating: r.rating,
    text: r.reviewText || '',
    author: r.customer?.name || 'مستخدم مجهول',
    date: r.createdAt.toLocaleDateString()
  }));
}
