import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { updateProduct, deleteGalleryImage } from '../../actions';
import { redirect } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  
  const { id } = await params;
  
  if (!id) {
    redirect('/dashboard/catalog/products');
  }

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ 
      where: { id },
      include: { gallery: { orderBy: { sortOrder: 'asc' } } }
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  if (!product) redirect('/dashboard/catalog/products');

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/products" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل منتج' : 'Edit Product'}: {lang === 'ar' ? product.nameAr : product.nameEn}
            </h1>
          </div>
        </div>
      </div>

      <form action={updateProductWithId} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <div className="admin-form-grid">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المنتج (عربي) *' : 'Product Name (Arabic) *'}</label>
                <input type="text" name="nameAr" defaultValue={product.nameAr} required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المنتج (إنجليزي) *' : 'Product Name (English) *'}</label>
                <input type="text" name="nameEn" defaultValue={product.nameEn} required className="admin-input" />
              </div>
            </div>



            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف المنتج (عربي)' : 'Description (Arabic)'}</label>
                <textarea name="descriptionAr" defaultValue={product.descriptionAr || ''} className="admin-textarea" rows={3}></textarea>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وصف المنتج (إنجليزي)' : 'Description (English)'}</label>
                <textarea name="descriptionEn" defaultValue={product.descriptionEn || ''} className="admin-textarea" rows={3}></textarea>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'القسم *' : 'Category *'}</label>
                <select name="categoryId" defaultValue={product.categoryId} required className="admin-select">
                  <option value="">{lang === 'ar' ? 'اختر القسم' : 'Select Category'}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'السعر الأساسي *' : 'Base Price *'}</label>
                <input type="number" step="0.01" name="basePrice" defaultValue={product.basePrice} required className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'التوفر' : 'Availability'}</label>
                <select name="availability" defaultValue={product.availability} className="admin-select">
                  <option value="AVAILABLE">{lang === 'ar' ? 'متوفر' : 'Available'}</option>
                  <option value="OUT_OF_STOCK">{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'وقت التحضير (دقائق)' : 'Prep Time (mins)'}</label>
                <input type="number" name="prepTime" defaultValue={product.prepTime || ''} className="admin-input" />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'تحديث الصورة الأساسية' : 'Update Primary Image'}</label>
              <input type="file" name="primaryImage" accept="image/*" className="admin-input" />
              {product.primaryImage && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <img src={product.primaryImage} alt="Current primary" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" name="removePrimaryImage" id="removePrimaryImage" value="true" />
                    <label htmlFor="removePrimaryImage" style={{ fontSize: '13px', color: 'red', cursor: 'pointer' }}>{lang === 'ar' ? 'حذف الصورة' : 'Remove Image'}</label>
                  </div>
                </div>
              )}
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 800×800 بكسل (مربع). اترك الحقل فارغاً للاحتفاظ بالصورة الحالية.' : 'Recommended size: 800x800 px (Square). Leave empty to keep current image.'}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'معرض الصور (إضافة المزيد)' : 'Gallery Images (Add More)'}</label>
              <input type="file" name="galleryImages" accept="image/*" multiple className="admin-input" />
              <span className="admin-form-hint" style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'الحجم الموصى به: 800×800 بكسل (مربع). يمكنك اختيار عدة صور.' : 'Recommended size: 800x800 px (Square). You can select multiple images.'}
              </span>

              {/* Display existing gallery images */}
              {product.gallery && product.gallery.length > 0 && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {product.gallery.map((img) => (
                    <div key={img.id} style={{ position: 'relative' }}>
                      <img src={img.image} alt="Gallery" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                      <button 
                        type="submit" 
                        formAction={deleteGalleryImage.bind(null, img.id, product.id)}
                        title={lang === 'ar' ? 'حذف الصورة' : 'Delete Image'}
                        style={{ 
                          position: 'absolute', top: '-6px', right: '-6px', background: 'red', color: 'white', 
                          border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</label>
              <input type="number" name="sortOrder" defaultValue={product.sortOrder} className="admin-input" style={{ width: '100px' }} />
            </div>

            <div className="admin-form-row">
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked={product.isActive} className="admin-checkbox" />
                <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isFeatured" id="isFeatured" defaultChecked={product.isFeatured} className="admin-checkbox" />
                <label htmlFor="isFeatured" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'مميز' : 'Featured'}</label>
              </div>
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isBestseller" id="isBestseller" defaultChecked={product.isBestseller} className="admin-checkbox" />
                <label htmlFor="isBestseller" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الأكثر مبيعاً' : 'Bestseller'}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
