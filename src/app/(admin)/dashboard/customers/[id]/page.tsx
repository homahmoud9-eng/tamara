import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, ShoppingBag, DollarSign, Calendar, Star } from 'lucide-react';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  const { id } = await params;
  
  if (!id) {
    redirect('/dashboard/customers');
  }

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: { orderBy: { createdAt: 'desc' }, take: 20 },
      reviews: { include: { product: true }, orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  if (!customer) redirect('/dashboard/customers');

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; ar: string; en: string }> = {
      RECEIVED: { class: 'info', ar: 'مستلم', en: 'Received' },
      CONFIRMED: { class: 'info', ar: 'مؤكد', en: 'Confirmed' },
      PREPARING: { class: 'warning', ar: 'قيد التحضير', en: 'Preparing' },
      OUT_FOR_DELIVERY: { class: 'primary', ar: 'في الطريق', en: 'Out for Delivery' },
      DELIVERED: { class: 'success', ar: 'تم التوصيل', en: 'Delivered' },
      CANCELLED: { class: 'danger', ar: 'ملغي', en: 'Cancelled' },
    };
    const s = map[status] || { class: 'neutral', ar: status, en: status };
    return <span className={`admin-badge ${s.class}`}>{lang === 'ar' ? s.ar : s.en}</span>;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/customers" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{customer.name}</h1>
            <p className="admin-page-subtitle">{lang === 'ar' ? 'ملف العميل' : 'Customer Profile'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '16px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</h3><ShoppingBag size={16} className="admin-stat-icon" /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{customer.totalOrders}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}</h3><DollarSign size={16} className="admin-stat-icon" /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>AED {customer.totalSpent.toFixed(0)}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'أول طلب' : 'First Order'}</h3><Calendar size={16} className="admin-stat-icon" /></div>
          <p className="admin-stat-value" style={{ fontSize: '1rem' }}>{customer.firstOrderAt?.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') || '—'}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'آخر طلب' : 'Last Order'}</h3><Calendar size={16} className="admin-stat-icon" /></div>
          <p className="admin-stat-value" style={{ fontSize: '1rem' }}>{customer.lastOrderAt?.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') || '—'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
        {/* Left: Contact Info + Addresses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'بيانات التواصل' : 'Contact Info'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> <span style={{ direction: 'ltr' }}>{customer.phone}</span></div>
              {customer.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {customer.email}</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`admin-badge ${customer.status === 'ACTIVE' ? 'success' : 'neutral'}`}>
                  {customer.status === 'ACTIVE' ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {lang === 'ar' ? 'انضم:' : 'Joined:'} {customer.createdAt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'العناوين' : 'Addresses'} ({customer.addresses.length})</h3>
            {customer.addresses.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'لا توجد عناوين' : 'No addresses saved'}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {customer.addresses.map(addr => (
                  <div key={addr.id} style={{ padding: '10px', background: 'var(--admin-bg)', borderRadius: 'var(--admin-radius-sm)', fontSize: '13px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{addr.label} {addr.isDefault && <span className="admin-badge primary" style={{ fontSize: '10px' }}>{lang === 'ar' ? 'افتراضي' : 'Default'}</span>}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{addr.addressText}</span>
                    </div>
                    {addr.building && <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>{lang === 'ar' ? 'المبنى:' : 'Building:'} {addr.building} {addr.floor && `| ${lang === 'ar' ? 'الطابق:' : 'Floor:'} ${addr.floor}`} {addr.apartment && `| ${lang === 'ar' ? 'الشقة:' : 'Apt:'} ${addr.apartment}`}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Orders + Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'سجل الطلبات' : 'Order History'}</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'رقم الطلب' : 'Order #'}</th>
                  <th>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {customer.orders.length === 0 ? (
                  <tr><td colSpan={4} className="admin-table-empty">{lang === 'ar' ? 'لا توجد طلبات' : 'No orders'}</td></tr>
                ) : (
                  customer.orders.map(order => (
                    <tr key={order.id}>
                      <td><Link href={`/dashboard/orders/${order.id}`} style={{ color: 'var(--admin-primary)', fontWeight: 600, textDecoration: 'none' }}>#{order.orderNumber}</Link></td>
                      <td style={{ fontWeight: 500 }}>AED {order.totalAmount.toFixed(2)}</td>
                      <td>{statusBadge(order.status)}</td>
                      <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>{order.createdAt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Reviews */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'التقييمات' : 'Reviews'} ({customer.reviews.length})</h3>
            {customer.reviews.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'لا توجد تقييمات' : 'No reviews'}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {customer.reviews.map(review => (
                  <div key={review.id} style={{ padding: '10px', background: 'var(--admin-bg)', borderRadius: 'var(--admin-radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{lang === 'ar' ? review.product.nameAr : review.product.nameEn}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? '#eab308' : 'none'} color={i < review.rating ? '#eab308' : 'var(--admin-text-muted)'} />
                        ))}
                      </div>
                    </div>
                    {review.reviewText && <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{review.reviewText}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
