import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createVariant } from '../actions';

export default async function NewVariantPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const lang = await getAdminLang();
  const products = await prisma.product.findMany({ orderBy: { nameEn: 'asc' } });
  const resolvedSearchParams = await searchParams;
  
  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/variants" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة متغير جديد' : 'Add New Variant'}</h1>
          </div>
        </div>
      </div>

      <form action={createVariant} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'المنتج *' : 'Product *'}</label>
              <select name="productId" required className="admin-select" defaultValue={resolvedSearchParams?.product || ''}>
                <option value="">{lang === 'ar' ? 'اختر المنتج' : 'Select Product'}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{lang === 'ar' ? p.nameAr : p.nameEn}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتغير (عربي) *' : 'Variant Name (Arabic) *'}</label>
                <input type="text" name="nameAr" required className="admin-input" placeholder="نص حبة، ربع حبة، كامل..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتغير (إنجليزي) *' : 'Variant Name (English) *'}</label>
                <input type="text" name="nameEn" required className="admin-input" placeholder="Half, Quarter, Whole..." />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف التقديم (عربي)' : 'Serving Desc (Arabic)'}</label>
                <input type="text" name="servingDescAr" className="admin-input" placeholder="يكفي لشخصين..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف التقديم (إنجليزي)' : 'Serving Desc (English)'}</label>
                <input type="text" name="servingDescEn" className="admin-input" placeholder="Serves 2 people..." />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'السعر *' : 'Price *'}</label>
                <input type="number" step="0.01" name="price" required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'التوفر' : 'Availability'}</label>
                <select name="availability" className="admin-select" defaultValue="AVAILABLE">
                  <option value="AVAILABLE">{lang === 'ar' ? 'متوفر' : 'Available'}</option>
                  <option value="OUT_OF_STOCK">{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'صورة مخصصة (اختياري)' : 'Custom Image (Optional)'}</label>
              <input type="file" name="image" accept="image/*" className="admin-input" />
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 500×500 بكسل (مربع)' : 'Recommended size: 500x500 px (Square)'}
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
                <input type="checkbox" name="isDefault" id="isDefault" className="admin-checkbox" />
                <label htmlFor="isDefault" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'افتراضي (محدد مسبقاً)' : 'Default Selection'}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ المتغير' : 'Save Variant'}
          </button>
        </div>
      </form>
    </div>
  );
}
