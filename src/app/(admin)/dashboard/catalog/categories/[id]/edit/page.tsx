import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { updateCategory } from '../../actions';
import { redirect } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  const { id } = await params;
  
  if (!id) {
    redirect('/dashboard/catalog/categories');
  }

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) redirect('/dashboard/catalog/categories');

  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/categories" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل قسم' : 'Edit Category'}: {lang === 'ar' ? category.nameAr : category.nameEn}
            </h1>
          </div>
        </div>
      </div>

      <form action={updateCategoryWithId} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم القسم (عربي) *' : 'Category Name (Arabic) *'}</label>
                <input type="text" name="nameAr" defaultValue={category.nameAr} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم القسم (إنجليزي) *' : 'Category Name (English) *'}</label>
                <input type="text" name="nameEn" defaultValue={category.nameEn} required className="admin-input" />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الرابط (Slug)' : 'Slug'}</label>
              <input type="text" name="slug" defaultValue={category.slug || ''} required className="admin-input" />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                <textarea name="descriptionAr" defaultValue={category.descriptionAr || ''} className="admin-textarea" rows={3}></textarea>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
                <textarea name="descriptionEn" defaultValue={category.descriptionEn || ''} className="admin-textarea" rows={3}></textarea>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تحديث الصورة' : 'Update Image'}</label>
              <input type="file" name="image" accept="image/*" className="admin-input" />
              {category.image && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <img src={category.image} alt="Current image" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" name="removeImage" id="removeImage" value="true" />
                    <label htmlFor="removeImage" style={{ fontSize: '13px', color: 'red', cursor: 'pointer' }}>{lang === 'ar' ? 'حذف الصورة' : 'Remove Image'}</label>
                  </div>
                </div>
              )}
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 500×500 بكسل (مربع). اترك الحقل فارغاً للاحتفاظ بالصورة الحالية.' : 'Recommended size: 500x500 px (Square). Leave empty to keep current image.'}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تحديث صورة العنوان (البانر)' : 'Update Title Image (Banner)'}</label>
              <input type="file" name="titleImage" accept="image/*" className="admin-input" />
              {category.titleImage && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <img src={category.titleImage} alt="Current banner" style={{ width: '160px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" name="removeTitleImage" id="removeTitleImage" value="true" />
                    <label htmlFor="removeTitleImage" style={{ fontSize: '13px', color: 'red', cursor: 'pointer' }}>{lang === 'ar' ? 'حذف الصورة' : 'Remove Image'}</label>
                  </div>
                </div>
              )}
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 1200×400 بكسل (مستطيل). اترك الحقل فارغاً للاحتفاظ بالصورة الحالية.' : 'Recommended size: 1200x400 px (Landscape). Leave empty to keep current image.'}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</label>
              <input type="number" name="sortOrder" defaultValue={category.sortOrder} className="admin-input" style={{ width: '100px' }} />
            </div>

            <div className="admin-form-row">
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked={category.isActive} className="admin-checkbox" />
                <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={category.isFeatured} className="admin-checkbox" />
                <label htmlFor="isFeatured" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'مميز' : 'Featured'}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
