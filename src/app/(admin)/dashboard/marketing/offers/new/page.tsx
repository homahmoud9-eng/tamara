import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OfferForm from '../OfferForm';
import { createOffer } from '../actions';

export default async function NewOfferPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/marketing/offers" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة عرض جديد' : 'Add New Offer'}</h1>
          </div>
        </div>
      </div>

      <OfferForm lang={lang} action={createOffer} />
    </div>
  );
}
