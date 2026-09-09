import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { updateVariant } from '../../actions';
import { redirect } from 'next/navigation';

export default async function EditVariantPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  
  const { id } = await params;
  
  if (!id) {
    redirect('/dashboard/catalog/variants');
  }

  const [variant, products] = await Promise.all([
    prisma.variant.findUnique({ where: { id } }),
    prisma.product.findMany({ orderBy: { nameEn: 'asc' } }),
  ]);

  if (!variant) redirect('/dashboard/catalog/variants');

  const updateVariantWithId = updateVariant.bind(null, variant.id);

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/variants" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل متغير' : 'Edit Variant'}: {lang === 'ar' ? variant.nameAr : variant.nameEn}
            </h1>
          </div>
        </div>
      </div>

      <form action={updateVariantWithId} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'المنتج *' : 'Product *'}</label>
              <select name="productId" required className="admin-select" defaultValue={variant.productId}>
                <option value="">{lang === 'ar' ? 'اختر المنتج' : 'Select Product'}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{lang === 'ar' ? p.nameAr : p.nameEn}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتغير (عربي) *' : 'Variant Name (Arabic) *'}</label>
                <input type="text" name="nameAr" defaultValue={variant.nameAr} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتغير (إنجليزي) *' : 'Variant Name (English) *'}</label>
                <input type="text" name="nameEn" defaultValue={variant.nameEn} required className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف التقديم (عربي)' : 'Serving Desc (Arabic)'}</label>
                <input type="text" name="servingDescAr" defaultValue={variant.servingDescAr || ''} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف التقديم (إنجليزي)' : 'Serving Desc (English)'}</label>
                <input type="text" name="servingDescEn" defaultValue={variant.servingDescEn || ''} className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'السعر *' : 'Price *'}</label>
                <input type="number" step="0.01" name="price" defaultValue={variant.price} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'التوفر' : 'Availability'}</label>
                <select name="availability" defaultValue={variant.availability} className="admin-select">
                  <option value="AVAILABLE">{lang === 'ar' ? 'متوفر' : 'Available'}</option>
                  <option value="OUT_OF_STOCK">{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تحديث الصورة (اختياري)' : 'Update Image (Optional)'}</label>
              <input type="file" name="image" accept="image/*" className="admin-input" />
              {variant.image && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <img src={variant.image} alt="Current image" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
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
              <label className="admin-form-label">{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</label>
              <input type="number" name="sortOrder" defaultValue={variant.sortOrder} className="admin-input" style={{ width: '100px' }} />
            </div>

            <div className="admin-form-row">
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked={variant.isActive} className="admin-checkbox" />
                <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isDefault" id="isDefault" defaultChecked={variant.isDefault} className="admin-checkbox" />
                <label htmlFor="isDefault" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'افتراضي (محدد مسبقاً)' : 'Default Selection'}</label>
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
