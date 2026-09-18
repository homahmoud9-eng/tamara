'use client';

import { useActionState } from 'react';
import Link from 'next/link';

export default function OfferForm({ 
  lang, 
  action,
  initialData = null 
}: { 
  lang: 'ar' | 'en'; 
  action: any;
  initialData?: any;
}) {
  const [state, formAction, isPending] = useActionState(action, null) as [any, (payload: FormData) => void, boolean];

  // Helper to format dates for datetime-local input
  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  };

  return (
    <form encType="multipart/form-data" action={formAction} className="admin-form-grid" style={{ maxWidth: '800px' }}>
      {state?.error && (
        <div className="admin-badge danger" style={{ padding: '12px', marginBottom: '16px', display: 'block', width: '100%' }}>
          {state.error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-form-grid">
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'عنوان العرض (عربي) *' : 'Offer Title (Arabic) *'}</label>
              <input type="text" name="titleAr" defaultValue={initialData?.titleAr} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'عنوان العرض (إنجليزي) *' : 'Offer Title (English) *'}</label>
              <input type="text" name="titleEn" defaultValue={initialData?.titleEn} required className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
              <textarea name="descriptionAr" defaultValue={initialData?.descriptionAr || ''} className="admin-textarea" rows={3}></textarea>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
              <textarea name="descriptionEn" defaultValue={initialData?.descriptionEn || ''} className="admin-textarea" rows={3}></textarea>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'نوع الخصم *' : 'Discount Type *'}</label>
              <select name="discountType" required className="admin-select" defaultValue={initialData?.discountType || 'PERCENTAGE'}>
                <option value="PERCENTAGE">{lang === 'ar' ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                <option value="FIXED">{lang === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount'}</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'قيمة الخصم *' : 'Discount Value *'}</label>
              <input type="number" step="0.01" name="discountValue" defaultValue={initialData?.discountValue} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى للطلب (اختياري)' : 'Min Order Amount (Optional)'}</label>
              <input type="number" step="0.01" name="minOrder" defaultValue={initialData?.minOrder || ''} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
              <input type="datetime-local" name="startDate" defaultValue={formatDate(initialData?.startDate)} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}</label>
              <input type="datetime-local" name="endDate" defaultValue={formatDate(initialData?.endDate)} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'صورة العرض' : 'Offer Image'}</label>
            <input type="file" name="image" accept="image/*" className="admin-input" />
            {initialData?.image && (
              <img src={initialData.image} alt="" style={{ height: '64px', borderRadius: '4px', marginTop: '8px' }} />
            )}
            <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
              {lang === 'ar' ? 'الحجم الموصى به: 1200×600 بكسل' : 'Recommended size: 1200x600 px'}
            </span>
          </div>

          <div className="admin-checkbox-group">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked={initialData ? initialData.isActive : true} className="admin-checkbox" />
            <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
          </div>

        </div>
      </div>

      <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Link href="/dashboard/marketing/offers" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
        </Link>
        <button type="submit" className="admin-btn-primary" disabled={isPending}>
          {isPending ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ العرض' : 'Save Offer')}
        </button>
      </div>
    </form>
  );
}
