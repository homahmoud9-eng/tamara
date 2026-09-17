import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import AddonsManager from './AddonsManager';

export default async function ProductAddonsPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  
  const { id } = await params;
  
  if (!id) {
    redirect('/dashboard/catalog/products');
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      addonGroups: {
        orderBy: { sortOrder: 'asc' },
        include: {
          addons: { orderBy: { sortOrder: 'asc' } }
        }
      }
    }
  });

  if (!product) redirect('/dashboard/catalog/products');

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/products" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل منتج' : 'Edit Product'}: {lang === 'ar' ? product.nameAr : product.nameEn}
            </h1>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--admin-border)' }}>
        <Link href={`/dashboard/catalog/products/${product.id}/edit`} style={{ padding: '8px 16px', color: 'var(--admin-text-muted)', textDecoration: 'none' }}>
          {lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}
        </Link>
        <Link href={`/dashboard/catalog/products/${product.id}/addons`} style={{ padding: '8px 16px', borderBottom: '2px solid var(--admin-primary)', color: 'var(--admin-primary)', fontWeight: 600, textDecoration: 'none' }}>
          {lang === 'ar' ? 'الإضافات (Add-ons)' : 'Add-ons'}
        </Link>
      </div>

      <div className="admin-card">
        <AddonsManager product={product} lang={lang} />
      </div>
    </div>
  );
}
