import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createProduct } from '../actions';

export default async function NewProductPage() {
  const lang = await getAdminLang();
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/products" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</h1>
          </div>
        </div>
      </div>

      <form action={createProduct} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المنتج (عربي) *' : 'Product Name (Arabic) *'}</label>
                <input type="text" name="nameAr" required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المنتج (إنجليزي) *' : 'Product Name (English) *'}</label>
                <input type="text" name="nameEn" required className="admin-input" />
              </div>
            </div>



            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف المنتج (عربي)' : 'Description (Arabic)'}</label>
                <textarea name="descriptionAr" className="admin-textarea" rows={3}></textarea>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف المنتج (إنجليزي)' : 'Description (English)'}</label>
                <textarea name="descriptionEn" className="admin-textarea" rows={3}></textarea>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'القسم *' : 'Category *'}</label>
                <select name="categoryId" required className="admin-select">
                  <option value="">{lang === 'ar' ? 'اختر القسم' : 'Select Category'}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'السعر الأساسي *' : 'Base Price *'}</label>
                <input type="number" step="0.01" name="basePrice" required className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'التوفر' : 'Availability'}</label>
                <select name="availability" className="admin-select" defaultValue="AVAILABLE">
                  <option value="AVAILABLE">{lang === 'ar' ? 'متوفر' : 'Available'}</option>
                  <option value="OUT_OF_STOCK">{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وقت التحضير (دقائق)' : 'Prep Time (mins)'}</label>
                <input type="number" name="prepTime" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الصورة الأساسية' : 'Primary Image'}</label>
              <input type="file" name="primaryImage" accept="image/*" className="admin-input" />
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 800×800 بكسل (مربع)' : 'Recommended size: 800x800 px (Square)'}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'معرض الصور (صور إضافية)' : 'Gallery Images (Additional)'}</label>
              <input type="file" name="galleryImages" accept="image/*" multiple className="admin-input" />
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 800×800 بكسل (مربع). يمكنك اختيار عدة صور.' : 'Recommended size: 800x800 px (Square). You can select multiple images.'}
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
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isBestseller" id="isBestseller" className="admin-checkbox" />
                <label htmlFor="isBestseller" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الأكثر مبيعاً' : 'Bestseller'}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ المنتج' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
