import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import { revalidatePath } from 'next/cache';

async function saveAnnouncement(formData: FormData) {
  'use server';
  await prisma.announcementBar.upsert({
    where: { id: '1' },
    create: {
      id: '1',
      isEnabled: formData.get('isEnabled') === 'on',
      textAr: formData.get('textAr') as string,
      textEn: formData.get('textEn') as string,
      ctaTextAr: formData.get('ctaTextAr') as string || null,
      ctaTextEn: formData.get('ctaTextEn') as string || null,
      ctaLink: formData.get('ctaLink') as string || null,
      bgColor: formData.get('bgColor') as string || null,
      textColor: formData.get('textColor') as string || null,
      speed: parseInt(formData.get('speed') as string) || 20,
      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
    },
    update: {
      isEnabled: formData.get('isEnabled') === 'on',
      textAr: formData.get('textAr') as string,
      textEn: formData.get('textEn') as string,
      ctaTextAr: formData.get('ctaTextAr') as string || null,
      ctaTextEn: formData.get('ctaTextEn') as string || null,
      ctaLink: formData.get('ctaLink') as string || null,
      bgColor: formData.get('bgColor') as string || null,
      textColor: formData.get('textColor') as string || null,
      speed: parseInt(formData.get('speed') as string) || 20,
      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
    },
  });
  revalidatePath('/dashboard/website/announcement');
  revalidatePath('/');
}

export default async function AnnouncementPage() {
  const lang = await getAdminLang();
  const announcement = await prisma.announcementBar.findUnique({ where: { id: '1' } });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'شريط الإعلانات' : 'Announcement Bar'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'الشريط المتحرك أعلى الموقع' : 'The scrolling ticker at the top of the website'}</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 800 }}>
        <form action={saveAnnouncement} className="admin-form-grid">
          <div className="admin-checkbox-group">
            <input type="checkbox" name="isEnabled" defaultChecked={announcement?.isEnabled ?? true} className="admin-checkbox" id="isEnabled" />
            <label htmlFor="isEnabled" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'مفعّل' : 'Enabled'}</label>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'النص (عربي) *' : 'Text (Arabic) *'}</label>
              <input type="text" name="textAr" defaultValue={announcement?.textAr || ''} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'النص (إنجليزي) *' : 'Text (English) *'}</label>
              <input type="text" name="textEn" defaultValue={announcement?.textEn || ''} required className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'نص الزر (عربي)' : 'CTA (Arabic)'}</label>
              <input type="text" name="ctaTextAr" defaultValue={announcement?.ctaTextAr || ''} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'نص الزر (إنجليزي)' : 'CTA (English)'}</label>
              <input type="text" name="ctaTextEn" defaultValue={announcement?.ctaTextEn || ''} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'رابط الزر' : 'CTA Link'}</label>
            <input type="text" name="ctaLink" defaultValue={announcement?.ctaLink || ''} className="admin-input" placeholder="/menu" />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'لون الخلفية' : 'Background Color'}</label>
              <input type="color" name="bgColor" defaultValue={announcement?.bgColor || '#173F35'} style={{ width: '60px', height: '36px', border: 'none', cursor: 'pointer' }} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'لون النص' : 'Text Color'}</label>
              <input type="color" name="textColor" defaultValue={announcement?.textColor || '#F7F0E3'} style={{ width: '60px', height: '36px', border: 'none', cursor: 'pointer' }} />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'سرعة التمرير (ثانية)' : 'Scroll Speed (seconds)'}</label>
            <input type="number" name="speed" defaultValue={announcement?.speed || 20} className="admin-input" style={{ width: '120px' }} />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
              <input type="datetime-local" name="startDate" defaultValue={announcement?.startDate?.toISOString().slice(0, 16) || ''} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}</label>
              <input type="datetime-local" name="endDate" defaultValue={announcement?.endDate?.toISOString().slice(0, 16) || ''} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn-primary">
              {lang === 'ar' ? 'حفظ الإعلان' : 'Save Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
