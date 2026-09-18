'use client';

import React, { useState, useEffect } from 'react';
import AdminForm from '@/components/admin/AdminForm';
import Link from 'next/link';
import DeleteGalleryImageButton from '@/components/admin/DeleteGalleryImageButton';
import { deleteGalleryImage } from './actions';

interface ProductFormProps {
  mode: 'create' | 'edit';
  action: any;
  lang: 'ar' | 'en';
  categories: any[];
  initialData?: any;
}

export default function ProductForm({ mode, action, lang, categories, initialData }: ProductFormProps) {
  const [preview, setPreview] = useState({
    nameAr: initialData?.nameAr || '',
    nameEn: initialData?.nameEn || '',
    price: initialData?.basePrice || 0,
    categoryId: initialData?.categoryId || '',
    isActive: initialData?.isActive ?? true,
    primaryImage: initialData?.primaryImage || null,
    availability: initialData?.availability || 'AVAILABLE'
  });

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPreview(prev => ({ ...prev, [name]: checked }));
    } else {
      setPreview(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(prev => ({ ...prev, primaryImage: URL.createObjectURL(file) }));
    }
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? (lang === 'ar' ? cat.nameAr : cat.nameEn) : '---';
  };

  return (
    <AdminForm 
      action={action} 
      lang={lang} 
      redirectUrl="/dashboard/catalog?tab=products"
      submitText={mode === 'create' ? "Save Product" : "Save Changes"}
      submitTextAr={mode === 'create' ? "حفظ المنتج" : "حفظ التعديلات"}
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
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المنتج (عربي) *' : 'Product Name (Arabic) *'}</label>
                <input type="text" name="nameAr" defaultValue={initialData?.nameAr} required className="admin-input" onChange={handlePreviewChange} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المنتج (إنجليزي) *' : 'Product Name (English) *'}</label>
                <input type="text" name="nameEn" defaultValue={initialData?.nameEn} required className="admin-input" onChange={handlePreviewChange} />
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف المنتج (عربي)' : 'Description (Arabic)'}</label>
                <textarea name="descriptionAr" defaultValue={initialData?.descriptionAr || ''} className="admin-textarea" rows={3}></textarea>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف المنتج (إنجليزي)' : 'Description (English)'}</label>
                <textarea name="descriptionEn" defaultValue={initialData?.descriptionEn || ''} className="admin-textarea" rows={3}></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Classification */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'السعر والتصنيف' : 'Pricing & Classification'}
          </h2>
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'السعر الأساسي *' : 'Base Price *'}</label>
                <input type="number" step="0.01" name="basePrice" defaultValue={initialData?.basePrice} required className="admin-input" onChange={handlePreviewChange} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'القسم *' : 'Category *'}</label>
                <select name="categoryId" required className="admin-select" defaultValue={initialData?.categoryId} onChange={handlePreviewChange}>
                  <option value="">{lang === 'ar' ? 'اختر القسم' : 'Select Category'}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وقت التحضير (دقيقة)' : 'Prep Time (minutes)'}</label>
                <input type="number" name="prepTime" defaultValue={initialData?.prepTime || ''} className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'التوفر' : 'Availability'}</label>
                <select name="availability" className="admin-select" defaultValue={initialData?.availability || 'AVAILABLE'} onChange={handlePreviewChange}>
                  <option value="AVAILABLE">{lang === 'ar' ? 'متوفر' : 'Available'}</option>
                  <option value="OUT_OF_STOCK">{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'صور المنتج' : 'Product Images'}
          </h2>
          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'الصورة الرئيسية (اختياري)' : 'Primary Image (Optional)'}</label>
            <div style={{ border: '2px dashed var(--admin-border)', padding: '24px', textAlign: 'center', borderRadius: '8px', position: 'relative' }}>
              <input type="file" name="primaryImage" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <div style={{ pointerEvents: 'none' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>{lang === 'ar' ? 'اسحب الصورة هنا أو اضغط لاختيار صورة' : 'Drag image here or click to select'}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>PNG, JPG, WEBP (800x800 px)</p>
              </div>
            </div>
            {mode === 'edit' && initialData?.primaryImage && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="removePrimaryImage" id="removePrimaryImage" value="true" />
                <label htmlFor="removePrimaryImage" style={{ fontSize: '13px', color: 'red', cursor: 'pointer' }}>{lang === 'ar' ? 'حذف الصورة الحالية' : 'Remove current image'}</label>
              </div>
            )}
          </div>

          <div className="admin-form-group" style={{ marginTop: '24px' }}>
            <label className="admin-form-label">{lang === 'ar' ? 'معرض الصور (صور إضافية)' : 'Gallery Images (Additional)'}</label>
            <input type="file" name="galleryImages" accept="image/png, image/jpeg, image/webp" multiple className="admin-input" />
            
            {mode === 'edit' && initialData?.gallery && initialData.gallery.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                {initialData.gallery.map((img: any) => (
                  <div key={img.id} style={{ position: 'relative' }}>
                    <img src={img.image} alt="Gallery" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-border)' }} />
                    <DeleteGalleryImageButton 
                      imageId={img.id}
                      productId={initialData.id}
                      lang={lang}
                      action={deleteGalleryImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add-ons */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'إضافات المنتج' : 'Product Add-ons'}
          </h2>
          
          {mode === 'create' ? (
            <div style={{ padding: '16px', backgroundColor: 'var(--admin-bg-alt)', borderRadius: '6px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              {lang === 'ar' ? 'احفظ المنتج أولًا حتى تتمكن من إضافة الإضافات.' : 'Save the product first to manage add-ons.'}
            </div>
          ) : (
            <div>
              {initialData?.addonGroups && initialData.addonGroups.length > 0 ? (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ marginBottom: '12px', fontWeight: 500 }}>
                    {lang === 'ar' ? `${initialData.addonGroups.length} مجموعات مفعلة:` : `${initialData.addonGroups.length} Active groups:`}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {initialData.addonGroups.map((g: any) => (
                      <li key={g.id} style={{ padding: '8px 12px', border: '1px solid var(--admin-border)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{lang === 'ar' ? g.nameAr : g.nameEn}</span>
                        <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                          {g.addons?.length || 0} {lang === 'ar' ? 'إضافات' : 'items'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={{ marginBottom: '16px', color: 'var(--admin-text-muted)' }}>
                  {lang === 'ar' ? 'لا توجد إضافات لهذا المنتج.' : 'No add-ons for this product.'}
                </p>
              )}
              <Link href={`/dashboard/catalog/products/${initialData.id}/addons`} className="admin-btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                {lang === 'ar' ? 'إدارة الإضافات' : 'Manage Add-ons'}
              </Link>
            </div>
          )}
        </div>

      </div>

      <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Product Preview */}
        <div className="admin-card" style={{ position: 'sticky', top: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
            {lang === 'ar' ? 'معاينة المنتج' : 'Product Preview'}
          </h2>
          <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--admin-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {preview.primaryImage ? (
                <img src={preview.primaryImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'لا توجد صورة' : 'No image'}</span>
              )}
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{lang === 'ar' ? (preview.nameAr || 'اسم المنتج') : (preview.nameEn || 'Product Name')}</h3>
                <span style={{ fontWeight: 600, color: 'var(--primary-color, #10b981)' }}>{preview.price} EGP</span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--admin-text-muted)' }}>{getCategoryName(preview.categoryId)}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {preview.isActive && <span className="admin-badge success" style={{ fontSize: '11px' }}>{lang === 'ar' ? 'نشط' : 'Active'}</span>}
                {preview.availability === 'OUT_OF_STOCK' && <span className="admin-badge danger" style={{ fontSize: '11px' }}>{lang === 'ar' ? 'غير متوفر' : 'Out of stock'}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'إعدادات المنتج' : 'Product Settings'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="admin-checkbox-group">
              <input type="checkbox" name="isActive" id="isActive" defaultChecked={preview.isActive} onChange={handlePreviewChange} className="admin-checkbox" />
              <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'المنتج نشط' : 'Product Active'}</label>
            </div>
            <div className="admin-checkbox-group">
              <input type="checkbox" name="isBestseller" id="isBestseller" defaultChecked={initialData?.isBestseller} className="admin-checkbox" />
              <label htmlFor="isBestseller" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الأكثر مبيعًا' : 'Bestseller'}</label>
            </div>
            <div className="admin-checkbox-group">
              <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={initialData?.isFeatured} className="admin-checkbox" />
              <label htmlFor="isFeatured" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'مميز' : 'Featured'}</label>
            </div>
            <div className="admin-form-group" style={{ marginTop: '8px' }}>
              <label className="admin-form-label">{lang === 'ar' ? 'ترتيب العرض' : 'Sort Order'}</label>
              <input type="number" name="sortOrder" defaultValue={initialData?.sortOrder || 0} className="admin-input" />
            </div>
          </div>
        </div>

        {/* Note: The Save button is rendered internally by AdminForm at the bottom. 
            We are using a flex-wrap layout so it will appear below everything. 
            AdminForm appends <div className="admin-form-actions">...</div> automatically. */}

      </div>
    </AdminForm>
  );
}
