import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CouponForm from '../CouponForm';
import { createCoupon } from '../actions';

export default async function NewCouponPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/marketing/coupons" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة كوبون جديد' : 'Add New Coupon'}</h1>
          </div>
        </div>
      </div>

      <CouponForm lang={lang} action={createCoupon} />
    </div>
  );
}
