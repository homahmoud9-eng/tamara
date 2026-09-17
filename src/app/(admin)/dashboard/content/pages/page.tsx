import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Globe, EyeOff, Archive } from 'lucide-react';
import { updatePageStatus, deletePage } from './actions';

export default async function PagesCMSList() {
  const lang = await getAdminLang();
  const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الصفحات الإضافية' : 'Pages CMS'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${pages.length} صفحة` : `${pages.length} pages`}</p>
        </div>
        <Link href="/dashboard/content/pages/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة صفحة' : 'Add Page'}
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'العنوان' : 'Title'}</th>
              <th>{lang === 'ar' ? 'الرابط' : 'Slug'}</th>
              <th>{lang === 'ar' ? 'تاريخ النشر' : 'Published At'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr><td colSpan={5} className="admin-table-empty">{lang === 'ar' ? 'لا توجد صفحات' : 'No pages found'}</td></tr>
            ) : (
              pages.map(page => (
                <tr key={page.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lang === 'ar' ? page.titleAr : page.titleEn}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? page.titleEn : page.titleAr}</div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>/{page.slug}</td>
                  <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                    {page.publishedAt ? new Date(page.publishedAt).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    <span className={`admin-badge ${page.status === 'PUBLISHED' ? 'success' : page.status === 'DRAFT' ? 'neutral' : 'warning'}`}>
                      {page.status === 'PUBLISHED' ? (lang === 'ar' ? 'منشور' : 'Published') :
                       page.status === 'DRAFT' ? (lang === 'ar' ? 'مسودة' : 'Draft') : 
                       (lang === 'ar' ? 'مؤرشف' : 'Archived')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link href={`/dashboard/content/pages/${page.id}/edit`} className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}>
                        <Edit2 size={16} />
                      </Link>
                      
                      {page.status === 'PUBLISHED' ? (
                        <form action={async () => { 'use server'; await updatePageStatus(page.id, 'DRAFT'); }}>
                          <button type="submit" className="admin-icon-btn" title="Unpublish"><EyeOff size={16} /></button>
                        </form>
                      ) : (
                        <form action={async () => { 'use server'; await updatePageStatus(page.id, 'PUBLISHED'); }}>
                          <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-success)' }} title="Publish"><Globe size={16} /></button>
                        </form>
                      )}

                      <form action={async () => { 'use server'; await deletePage(page.id); }}>
                        <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}><Trash2 size={16} /></button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
