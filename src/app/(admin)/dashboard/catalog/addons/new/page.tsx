import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createAddonGroup } from '../actions';

export default async function NewAddonGroupPage() {
  const lang = await getAdminLang();
  const products = await prisma.product.findMany({ orderBy: { nameEn: 'asc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog/addons" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة مجموعة جديدة' : 'Add New Add-on Group'}</h1>
          </div>
        </div>
      </div>

      <form action={createAddonGroup} className="admin-form-grid" style={{ maxWidth: '800px' }}>
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'بيانات المجموعة' : 'Group Details'}</h3>
          <div className="admin-form-grid">
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'المنتج المرتبط *' : 'Linked Product *'}</label>
              <select name="productId" required className="admin-select">
                <option value="">{lang === 'ar' ? 'اختر المنتج' : 'Select Product'}</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{lang === 'ar' ? p.nameAr : p.nameEn}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المجموعة (عربي) *' : 'Group Name (Arabic) *'}</label>
                <input type="text" name="nameAr" required className="admin-input" placeholder="مثل: الإضافات" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'اسم المجموعة (إنجليزي) *' : 'Group Name (English) *'}</label>
                <input type="text" name="nameEn" required className="admin-input" placeholder="e.g. Extras" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى للاختيار' : 'Min Selection'}</label>
                <input type="number" name="minSelect" defaultValue="0" min="0" required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الحد الأقصى للاختيار' : 'Max Selection'}</label>
                <input type="number" name="maxSelect" defaultValue="1" min="1" required className="admin-input" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">{lang === 'ar' ? 'الترتيب' : 'Sort Order'}</label>
                <input type="number" name="sortOrder" defaultValue="0" className="admin-input" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isRequired" id="isRequired" className="admin-checkbox" />
                <label htmlFor="isRequired" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إجباري (يجب اختيار عنصر)' : 'Required (Must select)'}</label>
              </div>
              <div className="admin-checkbox-group">
                <input type="checkbox" name="isActive" id="isActive" defaultChecked className="admin-checkbox" />
                <label htmlFor="isActive" className="admin-form-label" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'نشط' : 'Active'}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'خيارات الإضافة' : 'Add-on Options'}</h3>
          <p className="admin-page-subtitle" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'يمكنك إضافة حتى 5 خيارات مبدئياً' : 'You can add up to 5 options initially'}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '12px', background: 'var(--admin-bg)', padding: '12px', borderRadius: 'var(--admin-radius-sm)' }}>
                <input type="text" name="addonNameAr" className="admin-input" placeholder={`${lang === 'ar' ? 'الاسم عربي' : 'Name AR'} ${num}`} />
                <input type="text" name="addonNameEn" className="admin-input" placeholder={`${lang === 'ar' ? 'الاسم إنجليزي' : 'Name EN'} ${num}`} />
                <input type="number" name="addonPrice" step="0.01" className="admin-input" placeholder={lang === 'ar' ? 'السعر' : 'Price'} />
              </div>
            ))}
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary">
            {lang === 'ar' ? 'حفظ المجموعة' : 'Save Group'}
          </button>
        </div>
      </form>
    </div>
  );
}
