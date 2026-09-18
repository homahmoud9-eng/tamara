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
    id: c.id,
    nameAr: c.nameAr,
    nameEn: c.nameEn,
  }));

  const plainProduct = {
    id: product.id,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    descriptionAr: product.descriptionAr,
    descriptionEn: product.descriptionEn,
    basePrice: Number(product.basePrice),
    categoryId: product.categoryId,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isBestseller: product.isBestseller,
    availability: product.availability,
    prepTime: product.prepTime,
    primaryImage: product.primaryImage,
    sortOrder: product.sortOrder,
    seoTitleAr: product.seoTitleAr,
    seoTitleEn: product.seoTitleEn,
    seoDescAr: product.seoDescAr,
    seoDescEn: product.seoDescEn,
    gallery: product.gallery?.map(g => ({
      id: g.id,
      image: g.image,
      sortOrder: g.sortOrder,
    })) || [],
    variants: product.variants?.map(v => ({
      id: v.id,
      nameAr: v.nameAr,
      nameEn: v.nameEn,
      price: Number(v.price),
      isDefault: v.isDefault,
    })) || [],
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
