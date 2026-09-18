import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { updateProduct } from '../../actions';
import { redirect } from 'next/navigation';
import ProductForm from '../../ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  const { id } = await params;

  if (!id) redirect('/dashboard/catalog/products');

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      gallery: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
      addonGroups: {
        include: { addons: true }
      }
    }
  });

  if (!product) redirect('/dashboard/catalog/products');

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  const updateProductWithId = updateProduct.bind(null, product.id);

  const plainCategories = categories.map(c => ({
    id: c.id ?? null,
    nameAr: c.nameAr ?? null,
    nameEn: c.nameEn ?? null,
  }));

  const plainProduct = {
    id: product.id ?? null,
    nameAr: product.nameAr ?? null,
    nameEn: product.nameEn ?? null,
    descriptionAr: product.descriptionAr ?? null,
    descriptionEn: product.descriptionEn ?? null,
    basePrice: product.basePrice ? Number(product.basePrice) : 0,
    categoryId: product.categoryId ?? null,
    isActive: product.isActive ?? false,
    isFeatured: product.isFeatured ?? false,
    isBestseller: product.isBestseller ?? false,
    availability: product.availability ?? 'AVAILABLE',
    prepTime: product.prepTime ?? null,
    primaryImage: product.primaryImage ?? null,
    sortOrder: product.sortOrder ?? 0,
    seoTitleAr: product.seoTitleAr ?? null,
    seoTitleEn: product.seoTitleEn ?? null,
    seoDescAr: product.seoDescAr ?? null,
    seoDescEn: product.seoDescEn ?? null,
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    gallery: (product.gallery || []).map(g => ({
      id: g.id ?? null,
      productId: g.productId ?? null,
      image: g.image ?? null,
      sortOrder: g.sortOrder ?? 0,
    })),
    variants: (product.variants || []).map(v => ({
      id: v.id ?? null,
      productId: v.productId ?? null,
      nameAr: v.nameAr ?? null,
      nameEn: v.nameEn ?? null,
      price: v.price ? Number(v.price) : 0,
      image: v.image ?? null,
      servingDescAr: v.servingDescAr ?? null,
      servingDescEn: v.servingDescEn ?? null,
      isDefault: v.isDefault ?? false,
      isActive: v.isActive ?? true,
      availability: v.availability ?? 'AVAILABLE',
      sortOrder: v.sortOrder ?? 0,
    })),
    addonGroups: (product.addonGroups || []).map(ag => ({
      id: ag.id ?? null,
      productId: ag.productId ?? null,
      nameAr: ag.nameAr ?? null,
      nameEn: ag.nameEn ?? null,
      isRequired: ag.isRequired ?? false,
      minSelect: ag.minSelect ?? 0,
      maxSelect: ag.maxSelect ?? 1,
      sortOrder: ag.sortOrder ?? 0,
      isActive: ag.isActive ?? true,
      addons: (ag.addons || []).map((a: any) => ({
        id: a.id ?? null,
        groupId: a.groupId ?? null,
        nameAr: a.nameAr ?? null,
        nameEn: a.nameEn ?? null,
        price: a.price ? Number(a.price) : 0,
        isActive: a.isActive ?? true,
        sortOrder: a.sortOrder ?? 0,
      })),
    })),
  };

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/products" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل المنتج' : 'Edit Product'}: {lang === 'ar' ? product.nameAr : product.nameEn}
            </h1>
          </div>
        </div>
      </div>

      <ProductForm 
        mode="edit" 
        action={updateProductWithId} 
        lang={lang} 
        categories={plainCategories}
        initialData={plainProduct}
        product={plainProduct}
      />
    </div>
  );
}
