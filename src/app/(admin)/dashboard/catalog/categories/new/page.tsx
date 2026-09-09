import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createCategory } from '../actions';

export default async function NewCategoryPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/categories" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة قسم جديد' : 'Add New Category'}</h1>
          </div>
        </div>
      </div>

      <form action={createCategory} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم القسم (عربي) *' : 'Category Name (Arabic) *'}</label>
                <input type="text" name="nameAr" required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم القسم (إنجليزي) *' : 'Category Name (English) *'}</label>
                <input type="text" name="nameEn" required className="admin-input" />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الرابط (Slug)' : 'Slug'}</label>
              <input type="text" name="slug" className="admin-input" placeholder="leave blank to auto-generate" />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                <textarea name="descriptionAr" className="admin-textarea" rows={3}></textarea>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
                <textarea name="descriptionEn" className="admin-textarea" rows={3}></textarea>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الصورة' : 'Image'}</label>
              <input type="file" name="image" accept="image/*" className="admin-input" />
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 500×500 بكسل (مربع)' : 'Recommended size: 500x500 px (Square)'}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'صورة العنوان (البانر)' : 'Title Image (Banner)'}</label>
              <input type="file" name="titleImage" accept="image/*" className="admin-input" />
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 1200×400 بكسل (مستطيل)' : 'Recommended size: 1200x400 px (Landscape)'}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</label>
              <input type="number" name="sortOrder" defaultValue="0" className="admin-input" style={{ width: '100px' }} />
            </div>

            <div className="admin-form-row">
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked className="admin-checkbox" />
                <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isFeatured" id="isFeatured" className="admin-checkbox" />
                <label htmlFor="isFeatured" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'مميز' : 'Featured'}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ القسم' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
