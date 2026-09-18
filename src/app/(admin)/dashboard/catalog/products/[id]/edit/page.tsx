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
        categories={categories}
        initialData={product}
      />
    </div>
  );
}
