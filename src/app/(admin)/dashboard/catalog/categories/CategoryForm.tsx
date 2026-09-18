'use client';

import React, { useState } from 'react';
import AdminForm from '@/components/admin/AdminForm';

interface CategoryFormProps {
  mode: 'create' | 'edit';
  action: any;
  lang: 'ar' | 'en';
  initialData?: any;
}

export default function CategoryForm({ mode, action, lang, initialData }: CategoryFormProps) {
  const [preview, setPreview] = useState({
    nameAr: initialData?.nameAr || '',
    nameEn: initialData?.nameEn || '',
    isActive: initialData?.isActive ?? true,
    sortOrder: initialData?.sortOrder || 0,
    image: initialData?.image || null,
    titleImage: initialData?.titleImage || null,
  });

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPreview(prev => ({ ...prev, [name]: checked }));
    } else {
      setPreview(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'titleImage') => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  return (
    <AdminForm 
      action={action} 
      lang={lang} 
      redirectUrl="/dashboard/catalog/categories"
      submitText={mode === 'create' ? "Save Category" : "Save Changes"}
      submitTextAr={mode === 'create' ? "حفظ القسم" : "حفظ التعديلات"}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}
    >
      <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Basic Information */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
          </h2>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم القسم (عربي) *' : 'Category Name (Arabic) *'}</label>
                <input type="text" name="nameAr" defaultValue={initialData?.nameAr} required className="admin-input" onChange={handlePreviewChange} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم القسم (إنجليزي) *' : 'Category Name (English) *'}</label>
                <input type="text" name="nameEn" defaultValue={initialData?.nameEn} required className="admin-input" onChange={handlePreviewChange} />
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الرابط (Slug)' : 'URL Slug'}</label>
                <input type="text" name="slug" defaultValue={initialData?.slug || ''} className="admin-input" placeholder={lang === 'ar' ? 'يُترك فارغاً للتوليد التلقائي' : 'Leave empty to auto-generate'} />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف القسم (عربي)' : 'Description (Arabic)'}</label>
                <textarea name="descriptionAr" defaultValue={initialData?.descriptionAr || ''} className="admin-textarea" rows={3}></textarea>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف القسم (إنجليزي)' : 'Description (English)'}</label>
                <textarea name="descriptionEn" defaultValue={initialData?.descriptionEn || ''} className="admin-textarea" rows={3}></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'صورة القسم' : 'Category Images'}
          </h2>
          
          {/* Main Image */}
          <div className="admin-form-group" style={{ marginBottom: '24px' }}>
            <label className="admin-form-label">{lang === 'ar' ? 'الصورة الرئيسية (اختياري)' : 'Primary Image (Optional)'}</label>
            <div style={{ border: '2px dashed var(--admin-border)', padding: '24px', textAlign: 'center', borderRadius: '8px', position: 'relative' }}>
              <input type="file" name="image" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleImageChange(e, 'image')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <div style={{ pointerEvents: 'none' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>{lang === 'ar' ? 'اسحب الصورة هنا أو اضغط لاختيار صورة' : 'Drag image here or click to select'}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>PNG, JPG, WEBP</p>
              </div>
            </div>
            {mode === 'edit' && initialData?.image && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="removeImage" id="removeImage" value="true" />
                <label htmlFor="removeImage" style={{ fontSize: '13px', color: 'red', cursor: 'pointer' }}>{lang === 'ar' ? 'حذف الصورة الحالية' : 'Remove current image'}</label>
              </div>
            )}
          </div>

          {/* Banner Image */}
          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'صورة العنوان / البانر (اختياري)' : 'Banner Image (Optional)'}</label>
            <div style={{ border: '2px dashed var(--admin-border)', padding: '24px', textAlign: 'center', borderRadius: '8px', position: 'relative' }}>
              <input type="file" name="titleImage" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleImageChange(e, 'titleImage')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <div style={{ pointerEvents: 'none' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>{lang === 'ar' ? 'اسحب الصورة هنا أو اضغط لاختيار صورة للبانر' : 'Drag banner image here or click to select'}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>PNG, JPG, WEBP (Wide format)</p>
              </div>
            </div>
            {mode === 'edit' && initialData?.titleImage && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="removeTitleImage" id="removeTitleImage" value="true" />
                <label htmlFor="removeTitleImage" style={{ fontSize: '13px', color: 'red', cursor: 'pointer' }}>{lang === 'ar' ? 'حذف صورة البانر الحالية' : 'Remove current banner image'}</label>
              </div>
            )}
          </div>
        </div>

      </div>

      <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Category Preview */}
        <div className="admin-card" style={{ position: 'sticky', top: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
            {lang === 'ar' ? 'معاينة القسم' : 'Category Preview'}
          </h2>
          <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '160px', backgroundColor: 'var(--admin-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {preview.image ? (
                <img src={preview.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'لا توجد صورة' : 'No image'}</span>
              )}
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{lang === 'ar' ? (preview.nameAr || 'اسم القسم') : (preview.nameEn || 'Category Name')}</h3>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {preview.isActive && <span className="admin-badge success" style={{ fontSize: '11px' }}>{lang === 'ar' ? 'نشط' : 'Active'}</span>}
                <span className="admin-badge default" style={{ fontSize: '11px' }}>
                  {lang === 'ar' ? 'الترتيب: ' : 'Order: '} {preview.sortOrder}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'إعدادات القسم' : 'Category Settings'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="admin-checkbox-group">
              <input type="checkbox" name="isActive" id="isActive" defaultChecked={preview.isActive} onChange={handlePreviewChange} className="admin-checkbox" />
              <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'القسم نشط' : 'Category Active'}</label>
            </div>
            <div className="admin-checkbox-group">
              <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={initialData?.isFeatured} className="admin-checkbox" />
              <label htmlFor="isFeatured" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'مميز' : 'Featured'}</label>
            </div>
            <div className="admin-form-group" style={{ marginTop: '8px' }}>
              <label className="admin-form-label">{lang === 'ar' ? 'ترتيب العرض' : 'Sort Order'}</label>
              <input type="number" name="sortOrder" defaultValue={preview.sortOrder} className="admin-input" onChange={handlePreviewChange} />
            </div>
          </div>
        </div>

      </div>
    </AdminForm>
  );
}
