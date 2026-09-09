import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createHeroSlide } from '../actions';

export default async function NewHeroPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/website/hero" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة شريحة بانر' : 'Add Hero Slide'}</h1>
          </div>
        </div>
      </div>

      <form action={createHeroSlide} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'صورة سطح المكتب (مستطيلة) *' : 'Desktop Image (Landscape) *'}</label>
                <input type="url" name="desktopImg" required className="admin-input" placeholder="https://..." />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'صورة الجوال (مربعة/طولية)' : 'Mobile Image (Square/Portrait)'}</label>
                <input type="url" name="mobileImg" className="admin-input" placeholder="leave blank to use desktop image" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                <input type="text" name="titleAr" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
                <input type="text" name="titleEn" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</label>
                <input type="text" name="subtitleAr" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</label>
                <input type="text" name="subtitleEn" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'نص الزر (عربي)' : 'CTA Text (Arabic)'}</label>
                <input type="text" name="ctaTextAr" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'نص الزر (إنجليزي)' : 'CTA Text (English)'}</label>
                <input type="text" name="ctaTextEn" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'رابط الزر' : 'CTA Link'}</label>
                <input type="text" name="ctaLink" className="admin-input" placeholder="/menu" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'تاريخ البدء (للعروض المؤقتة)' : 'Start Date (for scheduled banners)'}</label>
                <input type="datetime-local" name="startDate" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}</label>
                <input type="datetime-local" name="endDate" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</label>
                <input type="number" name="sortOrder" defaultValue="0" className="admin-input" />
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
            {lang === 'ar' ? 'حفظ الشريحة' : 'Save Slide'}
          </button>
        </div>
      </form>
    </div>
  );
}
