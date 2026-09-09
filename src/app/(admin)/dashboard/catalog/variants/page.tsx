import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { deleteVariant } from './actions';

export default async function VariantsPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const lang = await getAdminLang();
  const resolvedSearchParams = await searchParams;
  const productFilter = resolvedSearchParams?.product;

  const where: any = {};
  if (productFilter) where.productId = productFilter;

  const [variants, products] = await Promise.all([
    prisma.variant.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }],
      include: { product: true },
    }),
    prisma.product.findMany({
      orderBy: { nameEn: 'asc' },
      select: { id: true, nameAr: true, nameEn: true },
    }),
  ]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'المتغيرات' : 'Variants'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'أحجام وخيارات المنتجات (ربع، نص، كامل)' : 'Product sizes & options (Quarter, Half, Whole)'}</p>
        </div>
        <Link href="/dashboard/catalog/variants/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة متغير' : 'Add Variant'}
        </Link>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <form className="admin-table-search" action="/dashboard/catalog/variants" method="GET">
            <Search size={16} color="var(--admin-text-muted)" />
            <input type="text" name="q" placeholder={lang === 'ar' ? 'بحث...' : 'Search...'} />
          </form>
          <div className="admin-table-filters">
            <form action="/dashboard/catalog/variants" method="GET" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select name="product" className="admin-select" style={{ width: '200px' }} defaultValue={productFilter || ''}>
                <option value="">{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {lang === 'ar' ? p.nameAr : p.nameEn}
                  </option>
                ))}
              </select>
              <button type="submit" className="admin-btn-ghost" style={{ padding: '8px' }}>
                {lang === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            </form>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>{lang === 'ar' ? 'المتغير' : 'Variant'}</th>
              <th>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
              <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
              <th>{lang === 'ar' ? 'التقديم' : 'Serving'}</th>
              <th>{lang === 'ar' ? 'الترتيب' : 'Order'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'افتراضي' : 'Default'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 ? (
              <tr><td colSpan={9} className="admin-table-empty">{lang === 'ar' ? 'لا توجد متغيرات' : 'No variants found'}</td></tr>
            ) : (
              variants.map(v => (
                <tr key={v.id}>
                  <td>
                    {v.image ? (
                      <img src={v.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, backgroundColor: 'var(--admin-surface-hover)', borderRadius: 8 }} />
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lang === 'ar' ? v.nameAr : v.nameEn}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? v.nameEn : v.nameAr}</div>
                  </td>
                  <td>
                    <Link href={`/dashboard/catalog/products/${v.productId}`} style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontSize: '13px' }}>
                      {lang === 'ar' ? v.product.nameAr : v.product.nameEn}
                    </Link>
                  </td>
                  <td style={{ fontWeight: 600 }}>AED {v.price.toFixed(2)}</td>
                  <td style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                    {(lang === 'ar' ? v.servingDescAr : v.servingDescEn) || '—'}
                  </td>
                  <td>{v.sortOrder}</td>
                  <td>
                    <span className={`admin-badge ${v.isActive ? 'success' : 'neutral'}`}>
                      {v.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    {v.isDefault && <span className="admin-badge primary">{lang === 'ar' ? 'افتراضي' : 'Default'}</span>}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link href={`/dashboard/catalog/variants/${v.id}/edit`} className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}><Edit2 size={16} /></Link>
                      <form action={async () => { 'use server'; await deleteVariant(v.id); }}>
                        <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}><Trash2 size={16} /></button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
