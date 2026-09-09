import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function createCoupon(formData: FormData) {
  'use server';
  await prisma.coupon.create({
    data: {
      code: (formData.get('code') as string).toUpperCase().replace(/\s+/g, ''),
      discountType: formData.get('discountType') as string,
      discountValue: parseFloat(formData.get('discountValue') as string),
      minOrder: formData.get('minOrder') ? parseFloat(formData.get('minOrder') as string) : null,
      maxDiscount: formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount') as string) : null,
      usageLimit: formData.get('usageLimit') ? parseInt(formData.get('usageLimit') as string) : null,
      isActive: formData.get('isActive') === 'on',
      expiryDate: formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : null,
    }
  });
  revalidatePath('/dashboard/marketing/coupons');
  redirect('/dashboard/marketing/coupons');
}

export default async function NewCouponPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/marketing/coupons" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة كوبون جديد' : 'Add New Coupon'}</h1>
          </div>
        </div>
      </div>

      <form action={createCoupon} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'كود الخصم *' : 'Coupon Code *'}</label>
              <input type="text" name="code" required className="admin-input" placeholder="e.g. SUMMER2024" style={{ textTransform: 'uppercase' }} />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'نوع الخصم *' : 'Discount Type *'}</label>
                <select name="discountType" required className="admin-select" defaultValue="PERCENTAGE">
                  <option value="PERCENTAGE">{lang === 'ar' ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                  <option value="FIXED">{lang === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount'}</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'قيمة الخصم *' : 'Discount Value *'}</label>
                <input type="number" step="0.01" name="discountValue" required className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى للطلب (اختياري)' : 'Min Order Amount (Optional)'}</label>
                <input type="number" step="0.01" name="minOrder" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الحد الأقصى للخصم (اختياري)' : 'Max Discount Amount (Optional)'}</label>
                <input type="number" step="0.01" name="maxDiscount" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'حد الاستخدام (اختياري)' : 'Usage Limit (Optional)'}</label>
                <input type="number" name="usageLimit" className="admin-input" placeholder={lang === 'ar' ? 'عدد المرات الإجمالي' : 'Total times it can be used'} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                <input type="datetime-local" name="expiryDate" className="admin-input" />
              </div>
            </div>

            <div className="admin-checkbox-group">
              <input type="checkbox" name="isActive" id="isActive" defaultChecked className="admin-checkbox" />
              <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
            </div>

          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ الكوبون' : 'Save Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
}
