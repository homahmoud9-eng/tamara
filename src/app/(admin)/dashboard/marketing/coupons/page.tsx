import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';

export default async function CouponsPage() {
  const lang = await getAdminLang();
  const coupons = await prisma.coupon.findMany({ orderBy: { expiryDate: 'desc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الكوبونات' : 'Coupons'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${coupons.length} كوبون` : `${coupons.length} coupons`}</p>
        </div>
        <Link href="/dashboard/marketing/coupons/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة كوبون' : 'Add Coupon'}
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'الكود' : 'Code'}</th>
              <th>{lang === 'ar' ? 'الخصم' : 'Discount'}</th>
              <th>{lang === 'ar' ? 'الحد الأدنى' : 'Min Order'}</th>
              <th>{lang === 'ar' ? 'الحد الأقصى' : 'Max Discount'}</th>
              <th>{lang === 'ar' ? 'الاستخدام' : 'Usage Limit'}</th>
              <th>{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan={8} className="admin-table-empty">{lang === 'ar' ? 'لا توجد كوبونات' : 'No coupons yet'}</td></tr>
            ) : (
              coupons.map(coupon => {
                const isExpired = coupon.expiryDate && coupon.expiryDate < new Date();
                return (
                  <tr key={coupon.id}>
                    <td>
                      <code style={{ background: 'var(--admin-primary-light)', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', color: 'var(--admin-primary)' }}>
                        {coupon.code}
                      </code>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `AED ${coupon.discountValue}`}
                    </td>
                    <td>{coupon.minOrder ? `AED ${coupon.minOrder}` : '—'}</td>
                    <td>{coupon.maxDiscount ? `AED ${coupon.maxDiscount}` : '—'}</td>
                    <td>{coupon.usageLimit || '∞'}</td>
                    <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                      {coupon.expiryDate?.toLocaleDateString() || '∞'}
                    </td>
                    <td>
                      {isExpired ? (
                        <span className="admin-badge danger">{lang === 'ar' ? 'منتهي' : 'Expired'}</span>
                      ) : coupon.isActive ? (
                        <span className="admin-badge success">{lang === 'ar' ? 'نشط' : 'Active'}</span>
                      ) : (
                        <span className="admin-badge neutral">{lang === 'ar' ? 'معطل' : 'Inactive'}</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link href={`/dashboard/marketing/coupons/${coupon.id}/edit`} className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}><Edit2 size={16} /></Link>
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
