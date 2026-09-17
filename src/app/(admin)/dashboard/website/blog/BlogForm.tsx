'use client';

import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createBlogPost, updateBlogPost } from './actions';
import { useFormStatus } from 'react-dom';

function SubmitButton({ lang }: { lang: 'ar' | 'en' }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="admin-btn-primary" disabled={pending}>
      {pending ? (
        lang === 'ar' ? 'جاري الحفظ...' : 'Saving...'
      ) : (
        <>
          <Save size={16} /> {lang === 'ar' ? 'حفظ المقال' : 'Save Post'}
        </>
      )}
    </button>
  );
}

export default function BlogForm({ lang, initialData }: { lang: 'ar' | 'en'; initialData?: any }) {
  const action = initialData ? updateBlogPost.bind(null, initialData.id) : createBlogPost;
  const isArabic = lang === 'ar';

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/dashboard/website/blog" className="admin-icon-btn">
            <ArrowLeft size={20} style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {initialData 
                ? (isArabic ? 'تعديل المقال' : 'Edit Post') 
                : (isArabic ? 'إضافة مقال جديد' : 'Add New Post')}
            </h1>
          </div>
        </div>
      </div>

      <form action={action} className="admin-form-grid" style={{ marginTop: '24px' }}>
        <div className="admin-card">
          <h2 className="admin-card-title">{isArabic ? 'المعلومات الأساسية' : 'Basic Info'}</h2>
          
          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'عنوان المقال (عربي) *' : 'Title (Arabic) *'}</label>
            <input type="text" name="titleAr" className="admin-input" required defaultValue={initialData?.titleAr} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'عنوان المقال (إنجليزي)' : 'Title (English)'}</label>
            <input type="text" name="titleEn" className="admin-input" defaultValue={initialData?.titleEn} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'الرابط المختصر (Slug)' : 'Slug'}</label>
            <input type="text" name="slug" className="admin-input" defaultValue={initialData?.slug} placeholder="my-blog-post" />
            <p className="admin-help-text">{isArabic ? 'يُستخدم في الرابط. اترك فارغاً ليتم توليده تلقائياً.' : 'Used in the URL. Leave empty to auto-generate.'}</p>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'اسم الكاتب' : 'Author'}</label>
            <input type="text" name="author" className="admin-input" defaultValue={initialData?.author || 'Tamara Kitchen'} />
          </div>
          
          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'صورة الغلاف (رابط)' : 'Cover Image (URL)'}</label>
            <input type="url" name="image" className="admin-input" defaultValue={initialData?.image} />
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title">{isArabic ? 'المحتوى' : 'Content'}</h2>

          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'مقدمة المقال (عربي)' : 'Excerpt (Arabic)'}</label>
            <textarea name="excerptAr" className="admin-input" rows={3} defaultValue={initialData?.excerptAr} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'المحتوى (عربي) *' : 'Content (Arabic) *'}</label>
            <textarea name="contentAr" className="admin-input" rows={10} required defaultValue={initialData?.contentAr} />
          </div>

          <hr style={{ margin: '24px 0', borderColor: 'var(--admin-border)', borderBottom: 'none' }} />

          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'مقدمة المقال (إنجليزي)' : 'Excerpt (English)'}</label>
            <textarea name="excerptEn" className="admin-input" rows={3} defaultValue={initialData?.excerptEn} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'المحتوى (إنجليزي)' : 'Content (English)'}</label>
            <textarea name="contentEn" className="admin-input" rows={10} defaultValue={initialData?.contentEn} />
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title">{isArabic ? 'السيو (SEO)' : 'SEO Metadata'}</h2>
          
          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'عنوان السيو (عربي)' : 'SEO Title (Arabic)'}</label>
            <input type="text" name="seoTitleAr" className="admin-input" defaultValue={initialData?.seoTitleAr} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'وصف السيو (عربي)' : 'SEO Description (Arabic)'}</label>
            <textarea name="seoDescAr" className="admin-input" rows={3} defaultValue={initialData?.seoDescAr} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'عنوان السيو (إنجليزي)' : 'SEO Title (English)'}</label>
            <input type="text" name="seoTitleEn" className="admin-input" defaultValue={initialData?.seoTitleEn} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'وصف السيو (إنجليزي)' : 'SEO Description (English)'}</label>
            <textarea name="seoDescEn" className="admin-input" rows={3} defaultValue={initialData?.seoDescEn} />
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title">{isArabic ? 'حالة النشر' : 'Publishing Status'}</h2>
          <div className="admin-form-group">
            <label className="admin-label">{isArabic ? 'الحالة' : 'Status'}</label>
            <select name="status" className="admin-input" defaultValue={initialData?.isActive ? 'PUBLISHED' : 'DRAFT'}>
              <option value="DRAFT">{isArabic ? 'مسودة' : 'Draft'}</option>
              <option value="PUBLISHED">{isArabic ? 'منشور' : 'Published'}</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Link href="/dashboard/website/blog" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Link>
          <SubmitButton lang={lang} />
        </div>
      </form>
    </div>
  );
}
