'use client';

import React, { useState, useRef, useActionState } from 'react';
import Link from 'next/link';
import { Upload, X, Image as ImageIcon, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PromoFormProps {
  lang: 'ar' | 'en';
  action: any;
  initialData?: any;
}

export default function PromoForm({ lang, action, initialData = null }: PromoFormProps) {
  const [state, formAction, isPending] = useActionState(action, null) as [
    any,
    (payload: FormData) => void,
    boolean
  ];

  // Image state
  const defaultImage = initialData?.imageUrl || '/assets/images/tamara_package_lunch_saver.jpg';
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Features list state
  const initialFeaturesAr: string[] = Array.isArray(initialData?.featuresAr) && initialData.featuresAr.length > 0
    ? initialData.featuresAr
    : ['توفير يصل إلى ٢٠٪', 'توصيل مجاني يومياً', 'تغيير الوجبات براحتك', 'توقيف مؤقت للاشتراك'];

  const initialFeaturesEn: string[] = Array.isArray(initialData?.featuresEn) && initialData.featuresEn.length > 0
    ? initialData.featuresEn
    : ['Save up to 20%', 'Free daily delivery', 'Change meals easily', 'Pause subscription anytime'];

  const [featuresAr, setFeaturesAr] = useState<string[]>(initialFeaturesAr);
  const [featuresEn, setFeaturesEn] = useState<string[]>(initialFeaturesEn);

  // Language tab for bilingual fields
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');

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
    setPreviewUrl('/assets/images/tamara_package_lunch_saver.jpg');
    setIsRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add / remove features
  const addFeatureAr = () => setFeaturesAr(prev => [...prev, '']);
  const updateFeatureAr = (index: number, val: string) => {
    setFeaturesAr(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };
  const removeFeatureAr = (index: number) => {
    setFeaturesAr(prev => prev.filter((_, i) => i !== index));
  };

  const addFeatureEn = () => setFeaturesEn(prev => [...prev, '']);
  const updateFeatureEn = (index: number, val: string) => {
    setFeaturesEn(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };
  const removeFeatureEn = (index: number) => {
    setFeaturesEn(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form encType="multipart/form-data" action={formAction} className="admin-form-grid" style={{ maxWidth: '960px' }}>
      {/* Hidden inputs for features and image removal */}
      <input type="hidden" name="featuresAr" value={JSON.stringify(featuresAr)} />
      <input type="hidden" name="featuresEn" value={JSON.stringify(featuresEn)} />
      {isRemoved && <input type="hidden" name="removeImage" value="true" />}

      {/* Alerts */}
      {state?.error && (
        <div className="admin-badge danger" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', width: '100%' }}>
          <AlertCircle size={18} />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div className="admin-badge success" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', width: '100%' }}>
          <CheckCircle2 size={18} />
          <span>{state.message}</span>
        </div>
      )}

      {/* Section Activation Status */}
      <div className="admin-card" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
            {lang === 'ar' ? 'حالة ظهور القسم الترويجي' : 'Promo Section Visibility'}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
            {lang === 'ar' ? 'تفعيل أو إخفاء القسم بالكامل من الصفحة الرئيسية' : 'Enable or hide this section completely from the homepage'}
          </p>
        </div>
        <label className="admin-toggle" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="isEnabled"
            defaultChecked={initialData ? initialData.isEnabled : true}
            className="admin-checkbox"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>
            {lang === 'ar' ? 'مفعل على الموقع' : 'Active on site'}
          </span>
        </label>
      </div>

      {/* Language Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('ar')}
          style={{
            padding: '8px 20px',
            border: 'none',
            borderBottom: activeTab === 'ar' ? '3px solid var(--admin-primary, #2E7D32)' : '3px solid transparent',
            background: 'none',
            fontWeight: activeTab === 'ar' ? 700 : 500,
            color: activeTab === 'ar' ? 'var(--admin-primary, #2E7D32)' : 'var(--admin-text-muted)',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          🇸🇦 {lang === 'ar' ? 'المحتوى بالعربية (الأساسي)' : 'Arabic Content (Primary)'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          style={{
            padding: '8px 20px',
            border: 'none',
            borderBottom: activeTab === 'en' ? '3px solid var(--admin-primary, #2E7D32)' : '3px solid transparent',
            background: 'none',
            fontWeight: activeTab === 'en' ? 700 : 500,
            color: activeTab === 'en' ? 'var(--admin-primary, #2E7D32)' : 'var(--admin-text-muted)',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          🇬🇧 {lang === 'ar' ? 'المحتوى بالإنجليزية' : 'English Content'}
        </button>
      </div>

      {/* Texts Content Card */}
      <div className="admin-card" style={{ padding: '24px' }}>
        {/* ARABIC CONTENT */}
        <div style={{ display: activeTab === 'ar' ? 'flex' : 'none', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">
                {lang === 'ar' ? 'نص البادج العلوي (badgeText)' : 'Top Badge Text (badgeText)'}
              </label>
              <input
                type="text"
                name="badgeTextAr"
                defaultValue={initialData?.badgeTextAr || 'جديد تمارا'}
                placeholder="مثال: جديد تمارا"
                className="admin-input"
              />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">
                {lang === 'ar' ? 'نص البادج العائم على الصورة (floatingBadgeText)' : 'Floating Image Badge (floatingBadgeText)'}
              </label>
              <input
                type="text"
                name="floatingBadgeTextAr"
                defaultValue={initialData?.floatingBadgeTextAr || '20% توفير'}
                placeholder="مثال: 20% توفير"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              {lang === 'ar' ? 'العنوان الرئيسي (titleAr) *' : 'Main Title (Arabic) *'}
            </label>
            <input
              type="text"
              name="titleAr"
              defaultValue={initialData?.titleAr || 'باقات توفير الغداء'}
              required
              placeholder="مثال: باقات توفير الغداء"
              className="admin-input"
              style={{ fontSize: '16px', fontWeight: 600 }}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              {lang === 'ar' ? 'الوصف الترويجي (descriptionAr)' : 'Promo Description (Arabic)'}
            </label>
            <textarea
              name="descriptionAr"
              defaultValue={initialData?.descriptionAr || 'اشترك في باقات تمارا للغداء ووفر وقتك ومجهودك. أكل بيتي صحي ومتنوع بيوصلك كل يوم في ميعاد غداك، وبأسعار أقل بكتير من الطلبات اليومية.'}
              rows={3}
              className="admin-textarea"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              {lang === 'ar' ? 'نص الزر (buttonTextAr)' : 'Button Text (Arabic)'}
            </label>
            <input
              type="text"
              name="buttonTextAr"
              defaultValue={initialData?.buttonTextAr || 'شاهد الباقات'}
              placeholder="مثال: شاهد الباقات"
              className="admin-input"
            />
          </div>

          {/* ARABIC FEATURES LIST */}
          <div style={{ marginTop: '12px', borderTop: '1px dashed var(--admin-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <label className="admin-form-label" style={{ marginBottom: 0, fontSize: '15px', fontWeight: 600 }}>
                  {lang === 'ar' ? 'قائمة المميزات والنقاط (Features List - عربي)' : 'Features & Highlights (Arabic)'}
                </label>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                  {lang === 'ar' ? 'النقاط التي تظهر بعلامة الصح الخضراء بجوار النص' : 'Bullet points displayed with checkmarks next to description'}
                </p>
              </div>
              <button
                type="button"
                onClick={addFeatureAr}
                className="admin-btn-secondary"
                style={{ fontSize: '13px', padding: '6px 12px' }}
              >
                <Plus size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                {lang === 'ar' ? 'إضافة ميزة' : 'Add Feature'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {featuresAr.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', width: '20px', textAlign: 'center' }}>
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeatureAr(idx, e.target.value)}
                    placeholder={`ميزة ${idx + 1}`}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureAr(idx)}
                    className="admin-icon-btn"
                    style={{ color: 'var(--admin-error, #dc2626)', padding: '6px' }}
                    title={lang === 'ar' ? 'حذف الميزة' : 'Delete Feature'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {featuresAr.length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: '4px 0' }}>
                  {lang === 'ar' ? 'لا توجد مميزات مضافة. اضغط "إضافة ميزة" لإضافة نقاط.' : 'No features added. Click "Add Feature" to add bullets.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ENGLISH CONTENT */}
        <div style={{ display: activeTab === 'en' ? 'flex' : 'none', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">
                {lang === 'ar' ? 'نص البادج العلوي بالإنجليزي (badgeTextEn)' : 'Top Badge Text (English)'}
              </label>
              <input
                type="text"
                name="badgeTextEn"
                defaultValue={initialData?.badgeTextEn || 'New from Tamara'}
                placeholder="e.g. New from Tamara"
                className="admin-input"
              />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label className="admin-form-label">
                {lang === 'ar' ? 'نص البادج العائم بالإنجليزي (floatingBadgeTextEn)' : 'Floating Image Badge (English)'}
              </label>
              <input
                type="text"
                name="floatingBadgeTextEn"
                defaultValue={initialData?.floatingBadgeTextEn || '20% Off'}
                placeholder="e.g. 20% Off"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              {lang === 'ar' ? 'العنوان الرئيسي بالإنجليزي (titleEn) *' : 'Main Title (English) *'}
            </label>
            <input
              type="text"
              name="titleEn"
              defaultValue={initialData?.titleEn || 'Lunch Saver Packages'}
              required
              placeholder="e.g. Lunch Saver Packages"
              className="admin-input"
              style={{ fontSize: '16px', fontWeight: 600 }}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              {lang === 'ar' ? 'الوصف الترويجي بالإنجليزي (descriptionEn)' : 'Promo Description (English)'}
            </label>
            <textarea
              name="descriptionEn"
              defaultValue={initialData?.descriptionEn || "Subscribe to Tamara's lunch packages and save time and effort. Healthy, varied homemade food delivered every day at your lunch break, at much lower prices than daily orders."}
              rows={3}
              className="admin-textarea"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              {lang === 'ar' ? 'نص الزر بالإنجليزي (buttonTextEn)' : 'Button Text (English)'}
            </label>
            <input
              type="text"
              name="buttonTextEn"
              defaultValue={initialData?.buttonTextEn || 'View Packages'}
              placeholder="e.g. View Packages"
              className="admin-input"
            />
          </div>

          {/* ENGLISH FEATURES LIST */}
          <div style={{ marginTop: '12px', borderTop: '1px dashed var(--admin-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <label className="admin-form-label" style={{ marginBottom: 0, fontSize: '15px', fontWeight: 600 }}>
                  {lang === 'ar' ? 'قائمة المميزات بالإنجليزي (Features List - English)' : 'Features & Highlights (English)'}
                </label>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                  {lang === 'ar' ? 'النقاط الإنجليزية المعروضة بجوار النص' : 'English bullet points displayed next to description'}
                </p>
              </div>
              <button
                type="button"
                onClick={addFeatureEn}
                className="admin-btn-secondary"
                style={{ fontSize: '13px', padding: '6px 12px' }}
              >
                <Plus size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                {lang === 'ar' ? 'إضافة ميزة' : 'Add Feature'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {featuresEn.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', width: '20px', textAlign: 'center' }}>
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeatureEn(idx, e.target.value)}
                    placeholder={`Feature ${idx + 1}`}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureEn(idx)}
                    className="admin-icon-btn"
                    style={{ color: 'var(--admin-error, #dc2626)', padding: '6px' }}
                    title={lang === 'ar' ? 'حذف الميزة' : 'Delete Feature'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {featuresEn.length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: '4px 0' }}>
                  {lang === 'ar' ? 'لا توجد مميزات مضافة.' : 'No features added.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Button Link & Image Upload Card */}
      <div className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="admin-form-group">
          <label className="admin-form-label">
            {lang === 'ar' ? 'رابط توجيه الزر (buttonLink) *' : 'Button Target Link (buttonLink) *'}
          </label>
          <input
            type="text"
            name="buttonLink"
            defaultValue={initialData?.buttonLink || '/packages'}
            required
            placeholder={lang === 'ar' ? 'مثال: /packages أو /menu أو /offers' : 'e.g. /packages, /menu, or /offers'}
            className="admin-input"
          />
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
            {lang === 'ar' ? 'الرابط الذي يتم فتح الصفحة المقصودة عنده عند الضغط على زر التوجيه الرئيسي' : 'Target URL opened when customer clicks the main CTA button'}
          </p>
        </div>

        {/* Promo Image Upload Component */}
        <div className="admin-form-group">
          <label className="admin-form-label">
            {lang === 'ar' ? 'الصورة الرئيسية للقسم (imageUrl)' : 'Main Section Image (imageUrl)'}
          </label>

          <div
            style={{
              border: '2px dashed var(--admin-border)',
              borderRadius: '12px',
              padding: '20px',
              background: 'var(--admin-bg)',
              textAlign: 'center',
              position: 'relative',
              transition: 'border-color 0.2s',
            }}
          >
            {previewUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '360px',
                    height: '240px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--admin-border)',
                    position: 'relative',
                    background: '#000',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Promo section preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="admin-btn-secondary"
                    style={{ fontSize: '13px', padding: '6px 14px' }}
                  >
                    <Upload size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                    {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="admin-btn-danger"
                    style={{
                      fontSize: '13px',
                      padding: '6px 14px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                    }}
                  >
                    <X size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                    {lang === 'ar' ? 'استعادة الصورة الافتراضية' : 'Reset to Default'}
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', padding: '24px 12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--admin-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                  }}
                >
                  <ImageIcon size={24} color="var(--admin-text-muted)" />
                </div>
                <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
                  {lang === 'ar' ? 'اضغط لاختيار صورة القسم' : 'Click to select section image'}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                  PNG, JPG, WEBP ({lang === 'ar' ? 'الأبعاد الموصى بها: 800×1000 بكسل' : 'Recommended: 800x1000 px'})
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
      </div>

      {/* Action Buttons */}
      <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <Link href="/dashboard" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
        </Link>
        <button type="submit" className="admin-btn-primary" disabled={isPending} style={{ minWidth: '160px' }}>
          {isPending
            ? lang === 'ar' ? 'جاري الحفظ...' : 'Saving...'
            : lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
