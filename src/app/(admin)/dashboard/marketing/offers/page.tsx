import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default async function OffersPage() {
  const lang = await getAdminLang();
  const offers = await prisma.offer.findMany({ orderBy: { startDate: 'desc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'العروض' : 'Offers'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${offers.length} عرض` : `${offers.length} offers`}</p>
        </div>
        <Link href="/dashboard/marketing/offers/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة عرض' : 'Add Offer'}
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'صورة' : 'Image'}</th>
              <th>{lang === 'ar' ? 'العرض' : 'Offer'}</th>
              <th>{lang === 'ar' ? 'الخصم' : 'Discount'}</th>
              <th>{lang === 'ar' ? 'الحد الأدنى' : 'Min Order'}</th>
              <th>{lang === 'ar' ? 'الفترة' : 'Period'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 ? (
              <tr><td colSpan={7} className="admin-table-empty">{lang === 'ar' ? 'لا توجد عروض' : 'No offers yet'}</td></tr>
            ) : (
              offers.map(offer => {
                const now = new Date();
                const isExpired = offer.endDate && offer.endDate < now;
                const isScheduled = offer.startDate && offer.startDate > now;
                return (
                  <tr key={offer.id}>
                    <td>
                      {offer.image ? (
                        <img src={offer.image} alt="" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                      ) : <div style={{ width: 48, height: 32, background: 'var(--admin-surface-hover)', borderRadius: 6 }} />}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lang === 'ar' ? offer.titleAr : offer.titleEn}</div>
                      {offer.descriptionEn && <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? offer.descriptionAr : offer.descriptionEn}</div>}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}%` : `AED ${offer.discountValue}`}
                    </td>
                    <td>{offer.minOrder ? `AED ${offer.minOrder}` : '—'}</td>
                    <td style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                      {offer.startDate?.toLocaleDateString() || '—'} → {offer.endDate?.toLocaleDateString() || '∞'}
                    </td>
                    <td>
                      {isExpired ? (
                        <span className="admin-badge danger">{lang === 'ar' ? 'منتهي' : 'Expired'}</span>
                      ) : isScheduled ? (
                        <span className="admin-badge info">{lang === 'ar' ? 'مجدول' : 'Scheduled'}</span>
                      ) : offer.isActive ? (
                        <span className="admin-badge success">{lang === 'ar' ? 'نشط' : 'Active'}</span>
                      ) : (
                        <span className="admin-badge neutral">{lang === 'ar' ? 'معطل' : 'Inactive'}</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link href={`/dashboard/marketing/offers/${offer.id}/edit`} className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}><Edit2 size={16} /></Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
