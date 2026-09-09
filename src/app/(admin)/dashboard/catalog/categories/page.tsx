import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { deleteCategory } from './actions';

export default async function CategoriesPage() {
  const lang = await getAdminLang();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الأقسام' : 'Categories'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${categories.length} قسم` : `${categories.length} categories`}</p>
        </div>
        <Link href="/dashboard/catalog/categories/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة قسم' : 'Add Category'}
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>{lang === 'ar' ? 'القسم' : 'Category'}</th>
              <th>{lang === 'ar' ? 'الرابط' : 'Slug'}</th>
              <th>{lang === 'ar' ? 'المنتجات' : 'Products'}</th>
              <th>{lang === 'ar' ? 'الترتيب' : 'Order'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={7} className="admin-table-empty">{lang === 'ar' ? 'لا توجد أقسام' : 'No categories found'}</td></tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    {cat.image ? (
                      <img src={cat.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, backgroundColor: 'var(--admin-surface-hover)', borderRadius: 8 }} />
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lang === 'ar' ? cat.nameAr : cat.nameEn}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? cat.nameEn : cat.nameAr}</div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>/{cat.slug}</td>
                  <td>{cat._count.products}</td>
                  <td>{cat.sortOrder}</td>
                  <td>
                    <span className={`admin-badge ${cat.isActive ? 'success' : 'neutral'}`}>
                      {cat.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link href={`/dashboard/catalog/categories/${cat.id}/edit`} className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}><Edit2 size={16} /></Link>
                      <form action={async () => { 'use server'; await deleteCategory(cat.id); }}>
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
