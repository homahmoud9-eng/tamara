import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createSection } from '../actions';

export default async function NewSectionPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/website/homepage" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة قسم جديد للرئيسية' : 'Add New Homepage Section'}</h1>
          </div>
        </div>
      </div>

      <form action={createSection} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'نوع القسم *' : 'Section Type *'}</label>
              <select name="type" required className="admin-select">
                <option value="HERO">{lang === 'ar' ? 'البانر الرئيسي (من إدارة البانر)' : 'Hero Banner (Managed in Hero Manager)'}</option>
                <option value="CATEGORIES">{lang === 'ar' ? 'شبكة الأقسام' : 'Categories Grid'}</option>
                <option value="OFFERS">{lang === 'ar' ? 'العروض الحصرية' : 'Exclusive Offers'}</option>
                <option value="FEATURED_MEALS">{lang === 'ar' ? 'الوجبات المميزة (تمرير أفقي)' : 'Featured Meals (Carousel)'}</option>
                <option value="PACKAGES">{lang === 'ar' ? 'باقات الاشتراك' : 'Subscription Packages'}</option>
                <option value="CATEGORY_PREVIEW">{lang === 'ar' ? 'معاينة منتجات قسم معين' : 'Category Preview (Specific Category)'}</option>
                <option value="FREEZER">{lang === 'ar' ? 'قسم المجمدات' : 'Freezer Section'}</option>
                <option value="REVIEWS">{lang === 'ar' ? 'آراء العملاء' : 'Customer Reviews'}</option>
                <option value="APP_INSTALL">{lang === 'ar' ? 'بانر تحميل التطبيق' : 'App Install Banner'}</option>
                <option value="CTA">{lang === 'ar' ? 'دعوة للعمل (CTA)' : 'Call to Action Banner'}</option>
                <option value="CUSTOM">{lang === 'ar' ? 'محتوى مخصص (HTML/صورة)' : 'Custom Content (HTML/Image)'}</option>
              </select>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'عنوان القسم (عربي)' : 'Section Title (Arabic)'}</label>
                <input type="text" name="titleAr" className="admin-input" placeholder="مثال: الأكثر مبيعاً" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'عنوان القسم (إنجليزي)' : 'Section Title (English)'}</label>
                <input type="text" name="titleEn" className="admin-input" placeholder="e.g. Best Sellers" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الوصف الفرعي (عربي)' : 'Subtitle (Arabic)'}</label>
                <input type="text" name="subtitleAr" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الوصف الفرعي (إنجليزي)' : 'Subtitle (English)'}</label>
                <input type="text" name="subtitleEn" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'حد العرض (للمنتجات/الأقسام)' : 'Display Limit (for products/cats)'}</label>
                <input type="number" name="displayLimit" defaultValue="6" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</label>
                <input type="number" name="sortOrder" defaultValue="0" className="admin-input" />
              </div>
            </div>

            {/* Custom fields for CTA/App Install/Custom types */}
            <div style={{ padding: '16px', background: 'var(--admin-bg)', borderRadius: 'var(--admin-radius)' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 600 }}>{lang === 'ar' ? 'إعدادات إضافية (لأقسام CTA / مخصص)' : 'Additional Settings (for CTA / Custom sections)'}</h4>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">{lang === 'ar' ? 'نص الزر (عربي)' : 'CTA Text (Arabic)'}</label>
                  <input type="text" name="ctaTextAr" className="admin-input" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">{lang === 'ar' ? 'نص الزر (إنجليزي)' : 'CTA Text (English)'}</label>
                  <input type="text" name="ctaTextEn" className="admin-input" />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'رابط الزر' : 'CTA Link'}</label>
                <input type="text" name="ctaLink" className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'صورة خلفية (أو صورة للقسم المخصص)' : 'Background Image (or custom section image)'}</label>
                <input type="url" name="image" className="admin-input" />
              </div>
            </div>

            <div className="admin-checkbox-group">
              <input type="checkbox" name="isEnabled" id="isEnabled" defaultChecked className="admin-checkbox" />
              <label htmlFor="isEnabled" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'مرئي (مفعّل)' : 'Visible (Enabled)'}</label>
            </div>

          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ القسم' : 'Save Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
