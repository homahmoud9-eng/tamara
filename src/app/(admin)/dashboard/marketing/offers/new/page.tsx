import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/upload';

async function createOffer(formData: FormData) {
  'use server';
  await prisma.offer.create({
    data: {
      titleAr: formData.get('titleAr') as string,
      titleEn: formData.get('titleEn') as string,
      descriptionAr: formData.get('descriptionAr') as string || null,
      descriptionEn: formData.get('descriptionEn') as string || null,
      discountType: formData.get('discountType') as string,
      discountValue: parseFloat(formData.get('discountValue') as string),
      minOrder: formData.get('minOrder') ? parseFloat(formData.get('minOrder') as string) : null,
      image: await uploadImage(formData.get('image') as File | null),
      isActive: formData.get('isActive') === 'on',
      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
    }
  });
  revalidatePath('/dashboard/marketing/offers');
  redirect('/dashboard/marketing/offers');
}

export default async function NewOfferPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/marketing/offers" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة عرض جديد' : 'Add New Offer'}</h1>
          </div>
        </div>
      </div>

      <form action={createOffer} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'عنوان العرض (عربي) *' : 'Offer Title (Arabic) *'}</label>
                <input type="text" name="titleAr" required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'عنوان العرض (إنجليزي) *' : 'Offer Title (English) *'}</label>
                <input type="text" name="titleEn" required className="admin-input" />
              </div>
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
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى للطلب (اختياري)' : 'Min Order Amount (Optional)'}</label>
                <input type="number" step="0.01" name="minOrder" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
                <input type="datetime-local" name="startDate" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}</label>
                <input type="datetime-local" name="endDate" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'صورة العرض' : 'Offer Image'}</label>
              <input type="file" name="image" accept="image/*" className="admin-input" />
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 1200×600 بكسل' : 'Recommended size: 1200x600 px'}
              </span>
            </div>

            <div className="admin-checkbox-group">
              <input type="checkbox" name="isActive" id="isActive" defaultChecked className="admin-checkbox" />
              <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
            </div>

          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ العرض' : 'Save Offer'}
          </button>
        </div>
      </form>
    </div>
  );
}
