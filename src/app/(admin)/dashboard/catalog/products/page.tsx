import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Star, Search, Eye } from 'lucide-react';
import { deleteProduct } from './actions';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string; page?: string }> }) {
  const lang = await getAdminLang();
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q;
  const catFilter = resolvedSearchParams?.cat;
  const page = parseInt(resolvedSearchParams?.page || '1');
  const perPage = 20;

  const where: any = {};
  if (q) {
    where.OR = [
      { nameEn: { contains: q, mode: 'insensitive' } },
      { nameAr: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (catFilter) where.categoryId = catFilter;

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { category: true, variants: { take: 1 } },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'المنتجات' : 'Products'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${totalCount} منتج` : `${totalCount} products`}</p>
        </div>
        <Link href="/dashboard/catalog/products/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة منتج' : 'Add Product'}
        </Link>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <form className="admin-table-search" action="/dashboard/catalog/products" method="GET">
            <Search size={16} color="var(--admin-text-muted)" />
            <input type="text" name="q" placeholder={lang === 'ar' ? 'بحث عن منتجات...' : 'Search products...'} defaultValue={q || ''} />
          </form>
          <div className="admin-table-filters">
            <form action="/dashboard/catalog/products" method="GET" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select name="cat" className="admin-select" style={{ width: '180px' }} defaultValue={catFilter || ''}>
                <option value="">{lang === 'ar' ? 'جميع الأقسام' : 'All Categories'}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {lang === 'ar' ? c.nameAr : c.nameEn}
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
              <th>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
              <th>{lang === 'ar' ? 'القسم' : 'Category'}</th>
              <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
              <th>{lang === 'ar' ? 'المتغيرات' : 'Variants'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'التوفر' : 'Availability'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={8} className="admin-table-empty">{lang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.primaryImage ? (
                      <img src={product.primaryImage} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, backgroundColor: 'var(--admin-surface-hover)', borderRadius: 8 }} />
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600 }}>{lang === 'ar' ? product.nameAr : product.nameEn}</span>
                      {product.isFeatured && <Star size={14} color="#eab308" fill="#eab308" />}
                    </div>

                  </td>
                  <td><span className="admin-badge neutral">{lang === 'ar' ? product.category.nameAr : product.category.nameEn}</span></td>
                  <td style={{ fontWeight: 600 }}>AED {product.basePrice.toFixed(2)}</td>
                  <td>{product.variants.length}</td>
                  <td>
                    <span className={`admin-badge ${product.isActive ? 'success' : 'neutral'}`}>
                      {product.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${product.availability === 'AVAILABLE' ? 'success' : 'danger'}`}>
                      {product.availability === 'AVAILABLE' ? (lang === 'ar' ? 'متوفر' : 'Available') : (lang === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link href={`/dashboard/catalog/products/${product.id}`} className="admin-icon-btn" style={{ color: 'var(--admin-info)' }}><Eye size={16} /></Link>
                      <Link href={`/dashboard/catalog/products/${product.id}/edit`} className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}><Edit2 size={16} /></Link>
                      <form action={async () => { 'use server'; await deleteProduct(product.id); }}>
                        <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}><Trash2 size={16} /></button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-table-footer">
            <span>{lang === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}</span>
            <div className="admin-pagination">
              {page > 1 && <Link href={`/dashboard/catalog/products?page=${page - 1}${q ? `&q=${q}` : ''}${catFilter ? `&cat=${catFilter}` : ''}`}><button>{lang === 'ar' ? 'السابق' : 'Prev'}</button></Link>}
              {page < totalPages && <Link href={`/dashboard/catalog/products?page=${page + 1}${q ? `&q=${q}` : ''}${catFilter ? `&cat=${catFilter}` : ''}`}><button>{lang === 'ar' ? 'التالي' : 'Next'}</button></Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
