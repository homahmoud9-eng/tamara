'use client';

import React, { useState, useEffect } from 'react';
import AdminForm from '@/components/admin/AdminForm';
import Link from 'next/link';
import DeleteGalleryImageButton from '@/components/admin/DeleteGalleryImageButton';
import { deleteGalleryImage } from './actions';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface VariantItem {
  id?: string;
  nameAr: string;
  nameEn: string;
  price: number | string;
  isDefault: boolean;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  action: any;
  lang: 'ar' | 'en';
  categories: any[];
  initialData?: any;
  product?: any;
}

export default function ProductForm({ mode, action, lang, categories, initialData: propInitialData, product }: ProductFormProps) {
  const initialData = propInitialData || product;
  const [preview, setPreview] = useState({
    nameAr: initialData?.nameAr || '',
    nameEn: initialData?.nameEn || '',
    price: initialData?.basePrice || 0,
    categoryId: initialData?.categoryId || '',
    isActive: initialData?.isActive ?? true,
    primaryImage: initialData?.primaryImage || null,
    availability: initialData?.availability || 'AVAILABLE'
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [variants, setVariants] = useState<VariantItem[]>(() => {
    if (initialData?.variants && initialData.variants.length > 0) {
      return initialData.variants.map((v: any) => ({
        id: v.id,
        nameAr: v.nameAr || '',
        nameEn: v.nameEn || '',
        price: v.price ?? '',
        isDefault: v.isDefault ?? false,
      }));
    }
    return [];
  });

  const handleAddVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        nameAr: '',
        nameEn: '',
        price: '',
        isDefault: prev.length === 0
      }
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof VariantItem, value: any) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(v => v.isDefault)) {
        updated[0].isDefault = true;
      }
      return updated;
    });
  };

  const handleSetDefaultVariant = (index: number) => {
    setVariants(prev => prev.map((v, i) => ({
      ...v,
      isDefault: i === index
    })));
  };

  const handleMoveVariant = (index: number, direction: 'up' | 'down') => {
    setVariants(prev => {
      const updated = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPreview(prev => ({ ...prev, [name]: checked }));
    } else {
      setPreview(prev => ({ ...prev, [name]: value }));
    }
  };

  const primaryImageInputRef = React.useRef<HTMLInputElement>(null);

  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (preview.primaryImage && preview.primaryImage.startsWith('blob:')) {
      URL.revokeObjectURL(preview.primaryImage);
    }
    
    if (file) {
      setPreview(prev => ({ ...prev, primaryImage: URL.createObjectURL(file) }));
    } else {
      setPreview(prev => ({ ...prev, primaryImage: null }));
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Revoke old blob URLs
    galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(newPreviews);
  };


  const handleRemovePrimaryImage = () => {
    if (preview.primaryImage && preview.primaryImage.startsWith('blob:')) {
      URL.revokeObjectURL(preview.primaryImage);
    }
    setPreview(prev => ({ ...prev, primaryImage: null }));
    if (primaryImageInputRef.current) {
      primaryImageInputRef.current.value = '';
    }
  };

  const handleAction = async (formData: FormData) => {
    console.log('--- CLIENT SUBMIT ---');
    console.log('Name:', formData.get('nameEn'));
    const primaryImg = formData.get('primaryImage') as File;
    console.log('primaryImage in FormData:', primaryImg ? `${primaryImg.name} (${primaryImg.size} bytes)` : 'null');
    console.log('removePrimaryImage:', formData.get('removePrimaryImage'));
    console.log('variantsJson:', formData.get('variantsJson'));
    console.log('---------------------');
    
    return action(formData);
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? (lang === 'ar' ? cat.nameAr : cat.nameEn) : '---';
  };

  return (
    <AdminForm 
      action={handleAction} 
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

        {/* Sizes & Variants */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                {lang === 'ar' ? 'الأحجام والأسعار (Sizes & Variants)' : 'Sizes & Variants'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' 
                  ? 'أضف أحجاماً مختلفة بأسعار مخصصة (مثل: صغير، وسط، كبير). في حال عدم إضافة أحجام، سيتم اعتماد السعر الأساسي.' 
                  : 'Add different sizes with specific prices (e.g. Small, Medium, Large). If none added, the Base Price will be used.'}
              </p>
            </div>
            <button 
              type="button" 
              onClick={handleAddVariant} 
              className="admin-btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 12px' }}
            >
              <Plus size={16} />
              {lang === 'ar' ? 'إضافة حجم / سعر' : 'Add Size'}
            </button>
          </div>

          <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />

          {variants.length === 0 ? (
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--admin-border)', borderRadius: '8px', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
              {lang === 'ar' 
                ? 'لا توجد أحجام مضافة حالياً. المنتج يعمل بسعر أساسي موحد. اضغط على "إضافة حجم / سعر" لتفعيل الأحجام المتعددة.' 
                : 'No sizes added yet. Product uses a single Base Price. Click "Add Size" to enable multiple sizes.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {variants.map((v, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    padding: '12px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--admin-border)', 
                    borderRadius: '8px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                      type="button" 
                      onClick={() => handleMoveVariant(idx, 'up')}
                      disabled={idx === 0}
                      style={{ background: 'none', border: 'none', color: idx === 0 ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: idx === 0 ? 'default' : 'pointer', padding: 0 }}
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleMoveVariant(idx, 'down')}
                      disabled={idx === variants.length - 1}
                      style={{ background: 'none', border: 'none', color: idx === variants.length - 1 ? 'var(--admin-text-muted)' : 'var(--admin-text)', cursor: idx === variants.length - 1 ? 'default' : 'pointer', padding: 0 }}
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
                      {lang === 'ar' ? 'اسم الحجم (عربي) *' : 'Size Name (Arabic) *'}
                    </label>
                    <input 
                      type="text" 
                      value={v.nameAr} 
                      placeholder={lang === 'ar' ? 'مثال: كبير / عائلي' : 'e.g. Large'} 
                      required 
                      className="admin-input" 
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      onChange={(e) => handleUpdateVariant(idx, 'nameAr', e.target.value)} 
                    />
                  </div>

                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
                      {lang === 'ar' ? 'اسم الحجم (إنجليزي)' : 'Size Name (English)'}
                    </label>
                    <input 
                      type="text" 
                      value={v.nameEn} 
                      placeholder="e.g. Large" 
                      className="admin-input" 
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      onChange={(e) => handleUpdateVariant(idx, 'nameEn', e.target.value)} 
                    />
                  </div>

                  <div style={{ width: '120px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)', marginBottom: '4px' }}>
                      {lang === 'ar' ? 'السعر (درهم) *' : 'Price (AED) *'}
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={v.price} 
                      placeholder="0.00" 
                      required 
                      className="admin-input" 
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      onChange={(e) => handleUpdateVariant(idx, 'price', e.target.value)} 
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '16px' }}>
                    <input 
                      type="radio" 
                      name="defaultVariantRadio" 
                      id={`defaultVariant_${idx}`} 
                      checked={v.isDefault} 
                      onChange={() => handleSetDefaultVariant(idx)} 
                      style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor={`defaultVariant_${idx}`} style={{ fontSize: '12px', cursor: 'pointer', color: v.isDefault ? '#fbbf24' : 'var(--admin-text-muted)' }}>
                      {lang === 'ar' ? 'الافتراضي' : 'Default'}
                    </label>
                  </div>

                  <div style={{ paddingTop: '16px' }}>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveVariant(idx)} 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      title={lang === 'ar' ? 'حذف هذا الحجم' : 'Remove size'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {lang === 'ar' ? 'صور المنتج' : 'Product Images'}
          </h2>
          <div className="admin-form-group">
            <label className="admin-form-label">{lang === 'ar' ? 'الصورة الرئيسية (اختياري)' : 'Primary Image (Optional)'}</label>
            <div style={{ border: '2px dashed var(--admin-border)', padding: '24px', textAlign: 'center', borderRadius: '8px', position: 'relative' }}>
              <input 
                type="file" 
                name="primaryImage" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleImageChange} 
                ref={primaryImageInputRef}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
              />
              <div style={{ pointerEvents: 'none' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>{lang === 'ar' ? 'اسحب الصورة هنا أو اضغط لاختيار صورة' : 'Drag image here or click to select'}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-muted)' }}>PNG, JPG, WEBP (800x800 px)</p>
              </div>
            </div>
            {preview.primaryImage && preview.primaryImage.startsWith('blob:') && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button type="button" onClick={handleRemovePrimaryImage} style={{ fontSize: '13px', color: 'red', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
                  {lang === 'ar' ? 'إلغاء الصورة المحددة' : 'Remove selected image'}
                </button>
              </div>
            )}
            {mode === 'edit' && initialData?.primaryImage && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="removePrimaryImage" id="removePrimaryImage" value="true" />
                <label htmlFor="removePrimaryImage" style={{ fontSize: '13px', color: 'red', cursor: 'pointer' }}>{lang === 'ar' ? 'حذف الصورة الحالية' : 'Remove current image'}</label>
              </div>
            )}
          </div>

          <div className="admin-form-group" style={{ marginTop: '24px' }}>
            <label className="admin-form-label">{lang === 'ar' ? 'معرض الصور (صور إضافية)' : 'Gallery Images (Additional)'}</label>
            <input type="file" name="galleryImages" accept="image/png, image/jpeg, image/webp" multiple onChange={handleGalleryImagesChange} className="admin-input" />
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              {/* Existing Server Images */}
              {mode === 'edit' && initialData?.gallery && initialData.gallery.length > 0 && initialData.gallery.map((img: any) => (
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
              
              {/* Local Previews for New Images (with Hydration Guard) */}
              {isMounted && galleryPreviews.map((url, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={url} alt={`New Gallery ${idx}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '2px solid var(--brand-primary)', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--brand-primary)', color: 'white', borderRadius: '10px', fontSize: '10px', padding: '2px 6px' }}>New</div>
                </div>
              ))}
            </div>
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
              {isMounted && preview.primaryImage && typeof preview.primaryImage === 'string' && preview.primaryImage.length > 0 ? (
                <img src={preview.primaryImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--admin-text-muted)' }}>
                  {!isMounted ? '...' : (lang === 'ar' ? 'لا توجد صورة' : 'No image')}
                </span>
              )}
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{lang === 'ar' ? (preview.nameAr || 'اسم المنتج') : (preview.nameEn || 'Product Name')}</h3>
                <span style={{ fontWeight: 600, color: 'var(--primary-color, #10b981)' }}>
                  {variants.length > 0 
                    ? (variants.find(v => v.isDefault)?.price || variants[0]?.price || preview.price)
                    : preview.price} {lang === 'ar' ? 'درهم' : 'AED'}
                </span>
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

      <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />
    </AdminForm>
  );
}
