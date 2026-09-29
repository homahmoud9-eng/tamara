import { getAdminLang } from '@/lib/i18n';
import { requireAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PromoForm from './PromoForm';
import { getPromoSection, savePromoSection } from './actions';

export default async function PromoSectionDashboardPage() {
  try {
    await requireAdminSession();
  } catch {
    redirect('/vision-login');
  }

  const lang = await getAdminLang();
  const promoData = await getPromoSection();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(46, 125, 87, 0.12)',
            color: 'var(--color-primary, #2E7D32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'القسم الترويجي (الصفحة الرئيسية)' : 'Homepage Promo Section'}
            </h1>
            <p className="admin-page-subtitle">
              {lang === 'ar' 
                ? 'إدارة قسم باقات توفير الغداء، النصوص، الصور، النقاط والمميزات، ورابط زر التوجيه' 
                : 'Manage Lunch Saver packages section, texts, images, highlights, and CTA button link'}
            </p>
          </div>
        </div>

        <Link href="/" target="_blank" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
          {lang === 'ar' ? 'معاينة الموقع' : 'Preview Site'}
          {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </Link>
      </div>

      {/* Main Form */}
      <PromoForm
        lang={lang}
        action={savePromoSection}
        initialData={promoData}
      />
    </div>
  );
}
