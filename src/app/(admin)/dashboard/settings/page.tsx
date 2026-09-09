import { Save } from 'lucide-react';
import { getAdminLang } from '@/lib/i18n';

export default async function SettingsPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{lang === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}</h1>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <div className="admin-stat-card" style={{ marginBottom: '24px' }}>
          <h3 className="admin-stat-title" style={{ marginBottom: '16px', fontSize: '16px' }}>{lang === 'ar' ? 'معلومات عامة' : 'General Information'}</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>{lang === 'ar' ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)'}</label>
              <input type="text" className="admin-input" defaultValue="Tamara Kitchen" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>{lang === 'ar' ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}</label>
              <input type="text" className="admin-input" defaultValue="مطبخ تمارا" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>{lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}</label>
              <input type="text" className="admin-input" defaultValue="+971541744773" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)' }} />
            </div>
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} />
              {lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
