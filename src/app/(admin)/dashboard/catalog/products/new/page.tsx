import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createProduct } from '../actions';
import ProductForm from '../ProductForm';

export default async function NewProductPage() {
  const lang = await getAdminLang();
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  const plainCategories = categories.map(c => ({
    id: c.id,
    nameAr: c.nameAr,
    nameEn: c.nameEn,
  }));

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/products" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
            </h1>
          </div>
        </div>
      </div>

      <ProductForm 
        mode="create" 
        action={createProduct} 
        lang={lang} 
        categories={plainCategories} 
      />
    </div>
  );
}
