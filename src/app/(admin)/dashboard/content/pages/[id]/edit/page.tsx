import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { updatePage } from '../../actions';
import { redirect } from 'next/navigation';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  const { id } = await params;

  if (!id) redirect('/dashboard/content/pages');

  const page = await prisma.page.findUnique({ where: { id } });

  if (!page) redirect('/dashboard/content/pages');

  const updatePageWithId = updatePage.bind(null, page.id);

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/content/pages" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل صفحة' : 'Edit Page'}: {lang === 'ar' ? page.titleAr : page.titleEn}
            </h1>
          </div>
        </div>
      </div>

      <form action={updatePageWithId} className="admin-form-grid" style={{ maxWidth: '900px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'العنوان (عربي) *' : 'Title (Arabic) *'}</label>
                <input type="text" name="titleAr" defaultValue={page.titleAr} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'العنوان (إنجليزي) *' : 'Title (English) *'}</label>
                <input type="text" name="titleEn" defaultValue={page.titleEn} required className="admin-input" />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الرابط (Slug) *' : 'Slug *'}</label>
              <input type="text" name="slug" defaultValue={page.slug} required className="admin-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'المحتوى (عربي)' : 'Content (Arabic)'}</label>
              <textarea name="contentAr" defaultValue={page.contentAr || ''} className="admin-input" rows={6}></textarea>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'المحتوى (إنجليزي)' : 'Content (English)'}</label>
              <textarea name="contentEn" defaultValue={page.contentEn || ''} className="admin-input" rows={6}></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الحالة' : 'Status'}</label>
              <select name="status" defaultValue={page.status} className="admin-input">
                <option value="DRAFT">{lang === 'ar' ? 'مسودة' : 'Draft'}</option>
                <option value="PUBLISHED">{lang === 'ar' ? 'منشور' : 'Published'}</option>
                <option value="ARCHIVED">{lang === 'ar' ? 'مؤرشف' : 'Archived'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>{lang === 'ar' ? 'تحسين محركات البحث (SEO)' : 'SEO Settings'}</h2>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'عنوان SEO (عربي)' : 'SEO Title (Arabic)'}</label>
                <input type="text" name="seoTitleAr" defaultValue={page.seoTitleAr || ''} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'عنوان SEO (إنجليزي)' : 'SEO Title (English)'}</label>
                <input type="text" name="seoTitleEn" defaultValue={page.seoTitleEn || ''} className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف SEO (عربي)' : 'SEO Description (Arabic)'}</label>
                <textarea name="seoDescAr" defaultValue={page.seoDescAr || ''} className="admin-input" rows={3}></textarea>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف SEO (إنجليزي)' : 'SEO Description (English)'}</label>
                <textarea name="seoDescEn" defaultValue={page.seoDescEn || ''} className="admin-input" rows={3}></textarea>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Link href="/dashboard/content/pages" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </Link>
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'تحديث الصفحة' : 'Update Page'}
          </button>
        </div>
      </form>
    </div>
  );
}
