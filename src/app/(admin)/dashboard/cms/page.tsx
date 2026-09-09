import prisma from '@/lib/prisma';
import { LayoutTemplate, Image as ImageIcon } from 'lucide-react';
import { getAdminLang } from '@/lib/i18n';

export default async function CMSPage() {
  const lang = await getAdminLang();
  
  const sections = await prisma.homepageSection.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{lang === 'ar' ? 'إدارة المحتوى (CMS)' : 'Content Management System (CMS)'}</h1>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'أقسام الصفحة الرئيسية' : 'Homepage Sections'}</h3>
            <LayoutTemplate className="admin-stat-icon" size={20} />
          </div>
          <p className="admin-stat-value">{sections.length}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'ملفات الوسائط' : 'Media Files'}</h3>
            <ImageIcon className="admin-stat-icon" size={20} />
          </div>
          <p className="admin-stat-value">0</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'نوع القسم' : 'Section Type'}</th>
              <th>{lang === 'ar' ? 'العنوان' : 'Title'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الترتيب' : 'Order'}</th>
            </tr>
          </thead>
          <tbody>
            {sections.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                  {lang === 'ar' ? 'لا توجد أقسام معرفة.' : 'No homepage sections defined.'}
                </td>
              </tr>
            ) : (
              sections.map((section) => (
                <tr key={section.id}>
                  <td style={{ fontWeight: 600 }}>{section.type}</td>
                  <td>{lang === 'ar' ? section.titleAr : section.titleEn || '-'}</td>
                  <td>
                    <span className={`admin-badge ${section.isEnabled ? 'success' : 'neutral'}`}>
                      {section.isEnabled ? (lang === 'ar' ? 'مفعل' : 'Enabled') : (lang === 'ar' ? 'معطل' : 'Disabled')}
                    </span>
                  </td>
                  <td>{section.sortOrder}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
