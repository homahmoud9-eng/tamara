import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OfferForm from '../../OfferForm';
import { updateOffer } from '../../actions';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  const { id } = await params;
  
  const offer = await prisma.offer.findUnique({ where: { id } });
  if (!offer) {
    notFound();
  }

  const updateOfferWithId = updateOffer.bind(null, offer.id);

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/marketing/offers" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل العرض' : 'Edit Offer'}
            </h1>
          </div>
        </div>
      </div>

      <OfferForm lang={lang} action={updateOfferWithId} initialData={offer} />
    </div>
  );
}
