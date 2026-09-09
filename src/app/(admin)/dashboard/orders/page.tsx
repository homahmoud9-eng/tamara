import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Eye, MessageCircle, Search } from 'lucide-react';

const STATUS_CONFIG: Record<string, { class: string; labelAr: string; labelEn: string }> = {
  RECEIVED: { class: 'info', labelAr: 'مستلم', labelEn: 'Received' },
  CONFIRMED: { class: 'info', labelAr: 'مؤكد', labelEn: 'Confirmed' },
  PREPARING: { class: 'warning', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
  OUT_FOR_DELIVERY: { class: 'primary', labelAr: 'في الطريق', labelEn: 'Out for Delivery' },
  DELIVERED: { class: 'success', labelAr: 'تم التوصيل', labelEn: 'Delivered' },
  CANCELLED: { class: 'danger', labelAr: 'ملغي', labelEn: 'Cancelled' },
};

const PAYMENT_CONFIG: Record<string, { labelAr: string; labelEn: string }> = {
  CASH: { labelAr: 'كاش', labelEn: 'Cash' },
  CARD: { labelAr: 'بطاقة', labelEn: 'Card' },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  const lang = await getAdminLang();
  const resolvedSearchParams = await searchParams;
  const status = resolvedSearchParams?.status;
  const page = parseInt(resolvedSearchParams?.page || '1');
  const q = resolvedSearchParams?.q;
  const perPage = 20;

  const where: any = {};
  if (status && status !== 'ALL') where.status = status;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: 'insensitive' } },
      { customer: { name: { contains: q, mode: 'insensitive' } } },
      { customer: { phone: { contains: q } } },
    ];
  }

  const [orders, totalCount, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { customer: true, items: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);
  const statusCountMap = Object.fromEntries(statusCounts.map(s => [s.status, s._count]));
  const allCount = statusCounts.reduce((sum, s) => sum + s._count, 0);

  const statuses = ['ALL', 'RECEIVED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الطلبات' : 'Orders'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${totalCount} طلب` : `${totalCount} total orders`}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="admin-tabs">
        {statuses.map(s => {
          const count = s === 'ALL' ? allCount : (statusCountMap[s] || 0);
          const cfg = STATUS_CONFIG[s];
          const label = s === 'ALL' 
            ? (lang === 'ar' ? 'الكل' : 'All')
            : (lang === 'ar' ? cfg?.labelAr : cfg?.labelEn) || s;
          const isActive = (status || 'ALL') === s;
          return (
            <Link
              key={s}
              href={`/dashboard/orders${s !== 'ALL' ? `?status=${s}` : ''}`}
              className={`admin-tab ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              {label} ({count})
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <form className="admin-table-search" action="/dashboard/orders" method="GET">
            {status && <input type="hidden" name="status" value={status} />}
            <Search size={16} color="var(--admin-text-muted)" />
            <input
              type="text"
              name="q"
              placeholder={lang === 'ar' ? 'بحث بالاسم، الهاتف، رقم الطلب...' : 'Search by name, phone, order #...'}
              defaultValue={q || ''}
            />
          </form>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'رقم الطلب' : 'Order #'}</th>
              <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
              <th>{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
              <th>{lang === 'ar' ? 'العناصر' : 'Items'}</th>
              <th>{lang === 'ar' ? 'المبلغ' : 'Total'}</th>
              <th>{lang === 'ar' ? 'الدفع' : 'Payment'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={9} className="admin-table-empty">{lang === 'ar' ? 'لا توجد طلبات' : 'No orders found'}</td></tr>
            ) : (
              orders.map(order => {
                const sc = STATUS_CONFIG[order.status] || { class: 'neutral', labelAr: order.status, labelEn: order.status };
                const pc = PAYMENT_CONFIG[order.paymentMethod] || { labelAr: order.paymentMethod, labelEn: order.paymentMethod };
                return (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/dashboard/orders/${order.id}`} style={{ color: 'var(--admin-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 500 }}>{order.customer.name}</td>
                    <td style={{ direction: 'ltr', textAlign: 'left' }}>{order.customer.phone}</td>
                    <td>{order.items.length} {lang === 'ar' ? 'عنصر' : 'items'}</td>
                    <td style={{ fontWeight: 600 }}>AED {order.totalAmount.toFixed(2)}</td>
                    <td>{lang === 'ar' ? pc.labelAr : pc.labelEn}</td>
                    <td><span className={`admin-badge ${sc.class}`}>{lang === 'ar' ? sc.labelAr : sc.labelEn}</span></td>
                    <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                      {order.createdAt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link href={`/dashboard/orders/${order.id}`} className="admin-icon-btn" title={lang === 'ar' ? 'عرض' : 'View'}>
                          <Eye size={16} />
                        </Link>
                        {order.customer.phone && (
                          <a href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Order #${order.orderNumber}`)}`} target="_blank" rel="noopener" className="admin-icon-btn" title="WhatsApp" style={{ color: '#25D366' }}>
                            <MessageCircle size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-table-footer">
            <span>{lang === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}</span>
            <div className="admin-pagination">
              {page > 1 && (
                <Link href={`/dashboard/orders?page=${page - 1}${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}>
                  <button>{lang === 'ar' ? 'السابق' : 'Previous'}</button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/dashboard/orders?page=${page + 1}${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}>
                  <button>{lang === 'ar' ? 'التالي' : 'Next'}</button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
