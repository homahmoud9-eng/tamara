import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react';
import { toggleSection, deleteSection } from './actions';

const SECTION_TYPE_LABELS: Record<string, { ar: string; en: string; icon: string }> = {
  HERO: { ar: 'البانر الرئيسي', en: 'Hero Banner', icon: '🖼️' },
  CATEGORIES: { ar: 'الأقسام', en: 'Categories', icon: '📂' },
  OFFERS: { ar: 'العروض الحصرية', en: 'Exclusive Offers', icon: '🏷️' },
  FEATURED_MEALS: { ar: 'الوجبات المميزة', en: 'Featured Meals', icon: '⭐' },
  PACKAGES: { ar: 'الباقات', en: 'Packages', icon: '📦' },
  CATEGORY_PREVIEW: { ar: 'معاينة قسم', en: 'Category Preview', icon: '👀' },
  FREEZER: { ar: 'المجمدات', en: 'Freezer', icon: '❄️' },
  REVIEWS: { ar: 'التقييمات', en: 'Reviews', icon: '⭐' },
  CTA: { ar: 'دعوة للعمل', en: 'Call to Action', icon: '🔔' },
  APP_INSTALL: { ar: 'تحميل التطبيق', en: 'App Install', icon: '📱' },
  CUSTOM: { ar: 'محتوى مخصص', en: 'Custom Content', icon: '✏️' },
};

export default async function HomepagePage() {
  const lang = await getAdminLang();
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage Builder'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'أعد ترتيب أقسام الصفحة الرئيسية وتحكم في ظهورها' : 'Reorder homepage sections and control visibility'}</p>
        </div>
        <Link href="/dashboard/website/homepage/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة قسم' : 'Add Section'}
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sections.length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty-state">
              <p className="admin-empty-state-title">{lang === 'ar' ? 'لا توجد أقسام' : 'No sections'}</p>
              <p className="admin-empty-state-desc">{lang === 'ar' ? 'أضف أقسام الصفحة الرئيسية' : 'Add homepage sections to get started'}</p>
            </div>
          </div>
        ) : (
          sections.map((section, i) => {
            const typeLabel = SECTION_TYPE_LABELS[section.type] || { ar: section.type, en: section.type, icon: '📄' };
            return (
              <div key={section.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', opacity: section.isEnabled ? 1 : 0.5 }}>
                <GripVertical size={18} color="var(--admin-text-muted)" style={{ cursor: 'grab', flexShrink: 0 }} />
                
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{typeLabel.icon}</span>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    {lang === 'ar' ? typeLabel.ar : typeLabel.en}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                    {section.titleEn && <span>{lang === 'ar' ? section.titleAr : section.titleEn}</span>}
                    {section.displayLimit && <span>• {lang === 'ar' ? `عرض ${section.displayLimit}` : `Show ${section.displayLimit}`}</span>}
                  </div>
                </div>

                <span className="admin-badge neutral" style={{ fontSize: '11px' }}>#{section.sortOrder}</span>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <form action={async () => { 'use server'; await toggleSection(section.id, !section.isEnabled); }}>
                    <button type="submit" className="admin-icon-btn" title={section.isEnabled ? 'Hide' : 'Show'}>
                      {section.isEnabled ? <Eye size={16} color="var(--admin-success)" /> : <EyeOff size={16} />}
                    </button>
                  </form>
                  <Link href={`/dashboard/website/homepage/${section.id}/edit`} className="admin-icon-btn">
                    <Edit2 size={16} />
                  </Link>
                  <form action={async () => { 'use server'; await deleteSection(section.id); }}>
                    <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}><Trash2 size={16} /></button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
