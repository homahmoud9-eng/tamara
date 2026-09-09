import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import { revalidatePath } from 'next/cache';

async function saveSettings(formData: FormData) {
  'use server';
  // TODO: Fix this to use BusinessSetting or proper Key-Value Setting model
  // Currently setting model does not exist in Prisma schema
  revalidatePath('/dashboard/settings/general');
  revalidatePath('/');
}

export default async function GeneralSettingsPage() {
  const lang = await getAdminLang();
  
  // TODO: Fetch from actual BusinessSetting table
  const settingsMap: Record<string, string> = {};

  const getSetting = (key: string, defaultValue = '') => settingsMap[key] || defaultValue;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الإعدادات العامة' : 'General Settings'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'إعدادات المتجر الأساسية' : 'Core store settings'}</p>
        </div>
      </div>

      <form action={saveSettings} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        {/* Business Info */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'معلومات المتجر' : 'Business Info'}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}</label>
                <input type="text" name="setting_storeNameAr" defaultValue={getSetting('storeNameAr', 'تمارا كيتشن')} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)'}</label>
                <input type="text" name="setting_storeNameEn" defaultValue={getSetting('storeNameEn', 'Tamara Kitchen')} className="admin-input" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الهاتف' : 'Phone'}</label>
              <input type="text" name="setting_phone" defaultValue={getSetting('phone')} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'البريد' : 'Email'}</label>
              <input type="email" name="setting_email" defaultValue={getSetting('email')} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'العنوان' : 'Address'}</label>
              <input type="text" name="setting_address" defaultValue={getSetting('address')} className="admin-input" />
            </div>
          </div>
        </div>

        {/* Currency & Region */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'العملة والمنطقة' : 'Currency & Region'}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'العملة' : 'Currency'}</label>
                <select name="setting_currency" className="admin-select" defaultValue={getSetting('currency', 'AED')}>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}</label>
                <select name="setting_timezone" className="admin-select" defaultValue={getSetting('timezone', 'Asia/Dubai')}>
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'رسالة "الحد الأدنى للطلب"' : 'Minimum Order Message'}</label>
              <input type="number" name="setting_minOrder" defaultValue={getSetting('minOrder', '50')} className="admin-input" style={{ width: '200px' }} />
              <span className="admin-form-hint">{lang === 'ar' ? 'بالدرهم' : 'in AED'}</span>
            </div>
          </div>
        </div>

        {/* Free Delivery Threshold */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'حد التوصيل المجاني' : 'Free Delivery Threshold'}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى للتوصيل المجاني' : 'Free Delivery Above'}</label>
                <input type="number" name="setting_freeDeliveryThreshold" defaultValue={getSetting('freeDeliveryThreshold', '500')} className="admin-input" style={{ width: '200px' }} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'رسوم التوصيل الافتراضية' : 'Default Delivery Fee'}</label>
                <input type="number" name="setting_defaultDeliveryFee" defaultValue={getSetting('defaultDeliveryFee', '25')} className="admin-input" style={{ width: '200px' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
