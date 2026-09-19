import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function saveSettings(formData: FormData) {
  'use server';
  
  await prisma.businessSetting.upsert({
    where: { id: "1" },
    update: {
      nameAr: formData.get('setting_storeNameAr') as string || '',
      nameEn: formData.get('setting_storeNameEn') as string || '',
      phone: formData.get('setting_phone') as string || '',
      email: formData.get('setting_email') as string || '',
      addressAr: formData.get('setting_address') as string || '',
      addressEn: formData.get('setting_address') as string || '',
    },
    create: {
      id: "1",
      nameAr: formData.get('setting_storeNameAr') as string || '',
      nameEn: formData.get('setting_storeNameEn') as string || '',
      phone: formData.get('setting_phone') as string || '',
      email: formData.get('setting_email') as string || '',
      addressAr: formData.get('setting_address') as string || '',
      addressEn: formData.get('setting_address') as string || '',
    }
  });

  const heroAnnouncementTextAr = (formData.get('setting_heroAnnouncementTextAr') as string)?.trim() || null;
  const heroAnnouncementTextEn = (formData.get('setting_heroAnnouncementTextEn') as string)?.trim() || null;

  await prisma.deliveryConfig.upsert({
    where: { id: "1" },
    update: {
      minOrder: parseFloat(formData.get('setting_minOrder') as string) || 0,
      heroAnnouncementTextAr,
      heroAnnouncementTextEn,
      baseFee: parseFloat(formData.get('setting_defaultDeliveryFee') as string) || 0,
    },
    create: {
      id: "1",
      minOrder: parseFloat(formData.get('setting_minOrder') as string) || 0,
      heroAnnouncementTextAr,
      heroAnnouncementTextEn,
      baseFee: parseFloat(formData.get('setting_defaultDeliveryFee') as string) || 0,
    }
  });

  revalidatePath('/', 'layout');
}

export default async function GeneralSettingsPage() {
  const lang = await getAdminLang();
  
  const [businessSettings, deliveryConfig] = await Promise.all([
    prisma.businessSetting.findUnique({ where: { id: "1" } }),
    prisma.deliveryConfig.findUnique({ where: { id: "1" } })
  ]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الإعدادات العامة' : 'General Settings'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'إعدادات المتجر الأساسية' : 'Core store settings'}</p>
        </div>
      </div>

      <form encType="multipart/form-data" action={saveSettings} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        {/* Business Info */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'معلومات المتجر' : 'Business Info'}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}</label>
                <input type="text" name="setting_storeNameAr" defaultValue={businessSettings?.nameAr || 'تمارا كيتشن'} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)'}</label>
                <input type="text" name="setting_storeNameEn" defaultValue={businessSettings?.nameEn || 'Tamara Kitchen'} className="admin-input" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الهاتف' : 'Phone'}</label>
              <input type="text" name="setting_phone" defaultValue={businessSettings?.phone || ''} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'البريد' : 'Email'}</label>
              <input type="email" name="setting_email" defaultValue={businessSettings?.email || ''} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'العنوان' : 'Address'}</label>
              <input type="text" name="setting_address" defaultValue={businessSettings?.addressAr || ''} className="admin-input" />
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
                <select name="setting_currency" className="admin-select" defaultValue="AED">
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}</label>
                <select name="setting_timezone" className="admin-select" defaultValue="Asia/Dubai">
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'رسالة "الحد الأدنى للطلب"' : 'Minimum Order Message'}</label>
              <input type="number" name="setting_minOrder" defaultValue={deliveryConfig?.minOrder ?? 50} className="admin-input" style={{ width: '200px' }} />
              <span className="admin-form-hint">{lang === 'ar' ? 'بالدرهم' : 'in AED'}</span>
            </div>
          </div>
        </div>

        {/* Hero Announcement Banner */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'نص شريط إعلان الهيرو' : 'Hero Announcement Banner'}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label className="admin-form-label">{lang === 'ar' ? 'نص شريط الإعلان (بالعربية)' : 'Hero Announcement Text (Arabic)'}</label>
                <input 
                  type="text" 
                  name="setting_heroAnnouncementTextAr" 
                  defaultValue={deliveryConfig?.heroAnnouncementTextAr ?? (deliveryConfig?.freeThreshold ? `التوصيل مجاني للطلبات فوق ${deliveryConfig.freeThreshold} درهم` : 'التوصيل مجاني للطلبات فوق 500 درهم')} 
                  className="admin-input" 
                  placeholder={lang === 'ar' ? 'مثال: التوصيل مجاني للطلبات فوق 500 درهم' : 'e.g. Free delivery for orders over 500 AED'}
                />
              </div>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label className="admin-form-label">{lang === 'ar' ? 'نص شريط الإعلان (بالإنجليزية)' : 'Hero Announcement Text (English)'}</label>
                <input 
                  type="text" 
                  name="setting_heroAnnouncementTextEn" 
                  defaultValue={deliveryConfig?.heroAnnouncementTextEn ?? (deliveryConfig?.freeThreshold ? `Free delivery for orders over ${deliveryConfig.freeThreshold} AED` : 'Free delivery for orders over 500 AED')} 
                  className="admin-input" 
                  placeholder="e.g. Free delivery for orders over 500 AED"
                />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'رسوم التوصيل الافتراضية' : 'Default Delivery Fee'}</label>
                <input type="number" name="setting_defaultDeliveryFee" defaultValue={deliveryConfig?.baseFee ?? 25} className="admin-input" style={{ width: '200px' }} />
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
