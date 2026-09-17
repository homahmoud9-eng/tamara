import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CouponForm from '../../CouponForm';
import { updateCoupon } from '../../actions';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  const { id } = await params;
  
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    notFound();
  }

  const updateCouponWithId = updateCoupon.bind(null, coupon.id);

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/marketing/coupons" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل الكوبون' : 'Edit Coupon'}
            </h1>
          </div>
        </div>
      </div>

      <CouponForm lang={lang} action={updateCouponWithId} initialData={coupon} />
    </div>
  );
}
