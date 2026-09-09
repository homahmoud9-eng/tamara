import React from 'react';
import { Category } from '@prisma/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Language } from '@/lib/i18n';
import { deleteCategory } from '../actions';

export function CategoriesTab({ categories, lang }: { categories: Category[], lang: Language }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Link href="/dashboard/catalog/categories/new" className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} />
          {lang === 'ar' ? 'إضافة قسم' : 'Add Category'}
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'صورة' : 'Image'}</th>
              <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
              <th>{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                  {lang === 'ar' ? 'لم يتم العثور على أقسام.' : 'No categories found.'}
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.image ? (
                      <img src={category.image} alt={category.nameEn} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, backgroundColor: '#f3f4f6', borderRadius: 8 }} />
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lang === 'ar' ? category.nameAr : category.nameEn}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>/{category.slug}</div>
                  </td>
                  <td>{category.sortOrder}</td>
                  <td>
                    <span className={`admin-badge ${category.isActive ? 'success' : 'neutral'}`}>
                      {category.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions" style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/dashboard/catalog/categories/${category.id}/edit`} className="admin-icon-btn" aria-label="Edit" style={{ color: '#3b82f6' }}>
                        <Edit2 size={16} />
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteCategory(category.id);
                      }}>
                        <button type="submit" className="admin-icon-btn" aria-label="Delete" style={{ color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
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
