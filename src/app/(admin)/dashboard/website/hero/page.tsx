import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { deleteHeroSlide } from './actions';

export default async function HeroPage() {
  const lang = await getAdminLang();
  const heroSlides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'البانر الرئيسي' : 'Hero Manager'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'إدارة شرائح البانر الرئيسي للموقع' : 'Manage hero banner slides for the website'}</p>
        </div>
        <Link href="/dashboard/website/hero/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة شريحة' : 'Add Slide'}
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {heroSlides.length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty-state">
              <p className="admin-empty-state-title">{lang === 'ar' ? 'لا توجد شرائح' : 'No hero slides'}</p>
              <p className="admin-empty-state-desc">{lang === 'ar' ? 'أنشئ شريحة بانر أولى' : 'Create your first hero banner slide'}</p>
            </div>
          </div>
        ) : (
          heroSlides.map((slide, index) => (
            <div key={slide.id} className="admin-card" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: '16px', alignItems: 'center', opacity: slide.isActive ? 1 : 0.6 }}>
              {/* Preview Image */}
              <div style={{ position: 'relative', borderRadius: 'var(--admin-radius)', overflow: 'hidden', aspectRatio: '16/9' }}>
                <img src={slide.desktopImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {!slide.isActive && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EyeOff size={20} color="#fff" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                  {lang === 'ar' ? (slide.titleAr || 'بدون عنوان') : (slide.titleEn || 'Untitled')}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>
                  {slide.subtitleEn && (lang === 'ar' ? slide.subtitleAr : slide.subtitleEn)}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="admin-badge neutral">{lang === 'ar' ? `ترتيب: ${slide.sortOrder}` : `Order: ${slide.sortOrder}`}</span>
                  {slide.ctaLink && <span className="admin-badge info">{lang === 'ar' ? slide.ctaTextAr || 'CTA' : slide.ctaTextEn || 'CTA'} → {slide.ctaLink}</span>}
                  {slide.startDate && <span className="admin-badge neutral">{lang === 'ar' ? 'مجدول' : 'Scheduled'}: {slide.startDate.toLocaleDateString()}</span>}
                  <span className={`admin-badge ${slide.isActive ? 'success' : 'danger'}`}>
                    {slide.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'مخفي' : 'Hidden')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Link href={`/dashboard/website/hero/${slide.id}/edit`} className="admin-btn-secondary" style={{ textDecoration: 'none', fontSize: '12px' }}>
                  <Edit2 size={14} /> {lang === 'ar' ? 'تعديل' : 'Edit'}
                </Link>
                <form action={async () => { 'use server'; await deleteHeroSlide(slide.id); }}>
                  <button type="submit" className="admin-btn-ghost" style={{ color: 'var(--admin-error)', fontSize: '12px', width: '100%' }}>
                    <Trash2 size={14} /> {lang === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
