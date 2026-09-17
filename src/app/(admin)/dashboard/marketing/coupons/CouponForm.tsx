'use client';

import { useActionState } from 'react';
import Link from 'next/link';

export default function CouponForm({ 
  lang, 
  action,
  initialData = null 
}: { 
  lang: 'ar' | 'en'; 
  action: any;
  initialData?: any;
}) {
  const [state, formAction, isPending] = useActionState(action, null) as [any, (payload: FormData) => void, boolean];

  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  };

  return (
    <form action={formAction} className="admin-form-grid" style={{ maxWidth: '800px' }}>
      {state?.error && (
        <div className="admin-badge danger" style={{ padding: '12px', marginBottom: '16px', display: 'block', width: '100%' }}>
          {state.error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-form-grid">
          
          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'كود الخصم *' : 'Coupon Code *'}</label>
            <input 
              type="text" 
              name="code" 
              defaultValue={initialData?.code} 
              required 
              className="admin-input" 
              placeholder="e.g. SUMMER2024" 
              style={{ textTransform: 'uppercase' }} 
            />
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
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى للطلب (اختياري)' : 'Min Order Amount (Optional)'}</label>
              <input type="number" step="0.01" name="minOrder" defaultValue={initialData?.minOrder || ''} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الحد الأقصى للخصم (اختياري)' : 'Max Discount Amount (Optional)'}</label>
              <input type="number" step="0.01" name="maxDiscount" defaultValue={initialData?.maxDiscount || ''} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'حد الاستخدام الإجمالي (اختياري)' : 'Usage Limit (Optional)'}</label>
              <input type="number" name="usageLimit" defaultValue={initialData?.usageLimit || ''} className="admin-input" placeholder={lang === 'ar' ? 'عدد المرات الإجمالي' : 'Total times it can be used'} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
              <input type="datetime-local" name="expiryDate" defaultValue={formatDate(initialData?.expiryDate)} className="admin-input" />
            </div>
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
            <input type="datetime-local" name="startDate" defaultValue={formatDate(initialData?.startDate)} className="admin-input" />
          </div>

          <div className="admin-checkbox-group">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked={initialData ? initialData.isActive : true} className="admin-checkbox" />
            <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
          </div>

        </div>
      </div>

      <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Link href="/dashboard/marketing/coupons" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
        </Link>
        <button type="submit" className="admin-btn-primary" disabled={isPending}>
          {isPending ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الكوبون' : 'Save Coupon')}
        </button>
      </div>
    </form>
  );
}
