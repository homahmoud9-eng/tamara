'use client';

import React, { useState, useRef, useActionState } from 'react';
import Link from 'next/link';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function OfferForm({ 
  lang, 
  action,
  initialData = null 
}: { 
  lang: 'ar' | 'en'; 
  action: any;
  initialData?: any;
}) {
  const [state, formAction, isPending] = useActionState(action, null) as [any, (payload: FormData) => void, boolean];

  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image || null);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      setIsRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setIsRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to format dates for datetime-local input
  const formatDate = (date: any) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  };

  return (
    <form encType="multipart/form-data" action={formAction} className="admin-form-grid" style={{ maxWidth: '850px' }}>
      {state?.error && (
        <div className="admin-badge danger" style={{ padding: '12px', marginBottom: '16px', display: 'block', width: '100%' }}>
          {state.error}
        </div>
      )}

      {isRemoved && (
        <input type="hidden" name="removeImage" value="true" />
      )}

      <div className="admin-card">
        <div className="admin-form-grid">
          
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'عنوان العرض (عربي) *' : 'Offer Title (Arabic) *'}</label>
              <input type="text" name="titleAr" defaultValue={initialData?.titleAr} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'عنوان العرض (إنجليزي) *' : 'Offer Title (English) *'}</label>
              <input type="text" name="titleEn" defaultValue={initialData?.titleEn} required className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
              <textarea name="descriptionAr" defaultValue={initialData?.descriptionAr || ''} className="admin-textarea" rows={3}></textarea>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
              <textarea name="descriptionEn" defaultValue={initialData?.descriptionEn || ''} className="admin-textarea" rows={3}></textarea>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'نوع الخصم *' : 'Discount Type *'}</label>
              <select name="discountType" required className="admin-select" defaultValue={initialData?.discountType || 'PERCENTAGE'}>
                <option value="PERCENTAGE">{lang === 'ar' ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                <option value="FIXED">{lang === 'ar' ? 'مبلغ ثابت (درهم)' : 'Fixed Amount (AED)'}</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'قيمة الخصم *' : 'Discount Value *'}</label>
              <input type="number" step="0.01" name="discountValue" defaultValue={initialData?.discountValue} required className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى للطلب (اختياري)' : 'Min Order Amount (Optional)'}</label>
              <input type="number" step="0.01" name="minOrder" defaultValue={initialData?.minOrder || ''} className="admin-input" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</label>
              <input type="datetime-local" name="startDate" defaultValue={formatDate(initialData?.startDate)} className="admin-input" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}</label>
              <input type="datetime-local" name="endDate" defaultValue={formatDate(initialData?.endDate)} className="admin-input" />
            </div>
          </div>

          {/* Offer Image Upload Component */}
          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'صورة العرض' : 'Offer Image'}</label>
            
            <div style={{
              border: '2px dashed var(--admin-border)',
              borderRadius: '12px',
              padding: '20px',
              background: 'var(--admin-bg)',
              textAlign: 'center',
              position: 'relative',
              transition: 'border-color 0.2s',
            }}>
              {previewUrl && !isRemoved ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    height: '210px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--admin-border)',
                    position: 'relative',
                    background: '#000',
                  }}>
                    <img 
                      src={previewUrl} 
                      alt="Offer preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="admin-btn-secondary"
                      style={{ fontSize: '13px', padding: '6px 12px' }}
                    >
                      <Upload size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                      {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="admin-btn-danger"
                      style={{ fontSize: '13px', padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                    >
                      <X size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                      {lang === 'ar' ? 'حذف الصورة' : 'Remove Image'}
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer', padding: '24px 12px' }}
                >
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'var(--admin-surface)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 12px auto' 
                  }}>
                    <ImageIcon size={24} color="var(--admin-text-muted)" />
                  </div>
                  <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
                    {lang === 'ar' ? 'اضغط لاختيار صورة العرض' : 'Click to select offer image'}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                    PNG, JPG, WEBP ({lang === 'ar' ? 'الحجم الموصى به: 1200×600 بكسل' : 'Recommended: 1200x600 px'})
                  </p>
                </div>
              )}

              <input 
                ref={fileInputRef}
                type="file" 
                name="image" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="admin-checkbox-group">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked={initialData ? initialData.isActive : true} className="admin-checkbox" />
            <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
          </div>

        </div>
      </div>

      <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
        <Link href="/dashboard/marketing/offers" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
        </Link>
        <button type="submit" className="admin-btn-primary" disabled={isPending}>
          {isPending ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ العرض' : 'Save Offer')}
        </button>
      </div>
    </form>
  );
}
