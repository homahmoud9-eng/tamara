import { 
  ShoppingBag, Users, DollarSign, Package, TrendingUp, Clock, 
  AlertCircle, CheckCircle, Truck, XCircle, ArrowUpRight 
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';

export default async function DashboardOverview() {
  const lang = await getAdminLang();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Parallel data fetching
  const [
    productsCount,
    customersCount,
    ordersCount,
    ordersToday,
    ordersByStatus,
    revenueToday,
    revenueWeek,
    revenueMonth,
    recentOrders,
    newCustomersToday,
    topProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.customer.count(),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: todayStart }, status: { not: 'CANCELLED' } },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: weekStart }, status: { not: 'CANCELLED' } },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: monthStart }, status: { not: 'CANCELLED' } },
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    }),
    prisma.customer.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.orderItem.groupBy({
      by: ['productNameEn', 'productNameAr'],
      _sum: { quantity: true, lineTotal: true },
      orderBy: { _sum: { lineTotal: 'desc' } },
      take: 5,
    }),
  ]);

  const statusMap = Object.fromEntries(ordersByStatus.map(s => [s.status, s._count]));
  const pendingOrders = (statusMap['RECEIVED'] || 0) + (statusMap['CONFIRMED'] || 0);
  const preparingOrders = statusMap['PREPARING'] || 0;
  const outForDelivery = statusMap['OUT_FOR_DELIVERY'] || 0;
  const completedOrders = statusMap['DELIVERED'] || 0;
  const cancelledOrders = statusMap['CANCELLED'] || 0;
  const avgOrderValue = ordersCount > 0 ? (revenueMonth._sum.totalAmount || 0) / ordersCount : 0;

  const formatCurrency = (val: number) => `AED ${val.toFixed(0)}`;

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; labelAr: string; labelEn: string }> = {
      RECEIVED: { class: 'info', labelAr: 'مستلم', labelEn: 'Received' },
      CONFIRMED: { class: 'info', labelAr: 'مؤكد', labelEn: 'Confirmed' },
      PREPARING: { class: 'warning', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
      OUT_FOR_DELIVERY: { class: 'primary', labelAr: 'في الطريق', labelEn: 'Out for Delivery' },
      DELIVERED: { class: 'success', labelAr: 'تم التوصيل', labelEn: 'Delivered' },
      CANCELLED: { class: 'danger', labelAr: 'ملغي', labelEn: 'Cancelled' },
    };
    const s = map[status] || { class: 'neutral', labelAr: status, labelEn: status };
    return <span className={`admin-badge ${s.class}`}>{lang === 'ar' ? s.labelAr : s.labelEn}</span>;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
            {lang === 'ar' ? 'نظرة عامة' : 'Dashboard Overview'}
          </h1>
          <p className="admin-page-subtitle">
            {lang === 'ar' ? `آخر تحديث: ${now.toLocaleString('ar-EG')}` : `Last updated: ${now.toLocaleString('en-US')}`}
          </p>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'إيرادات اليوم' : "Today's Revenue"}</h3>
            <DollarSign className="admin-stat-icon" size={18} />
          </div>
          <p className="admin-stat-value">{formatCurrency(revenueToday._sum.totalAmount || 0)}</p>
          <p className="admin-stat-trend">{ordersToday} {lang === 'ar' ? 'طلب' : 'orders'}</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'إيرادات الأسبوع' : 'Weekly Revenue'}</h3>
            <TrendingUp className="admin-stat-icon" size={18} />
          </div>
          <p className="admin-stat-value">{formatCurrency(revenueWeek._sum.totalAmount || 0)}</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'إيرادات الشهر' : 'Monthly Revenue'}</h3>
            <DollarSign className="admin-stat-icon" size={18} />
          </div>
          <p className="admin-stat-value">{formatCurrency(revenueMonth._sum.totalAmount || 0)}</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value'}</h3>
            <ShoppingBag className="admin-stat-icon" size={18} />
          </div>
          <p className="admin-stat-value">{formatCurrency(avgOrderValue)}</p>
        </div>
      </div>

      {/* Order Status Cards */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="admin-stat-card" style={{ borderLeft: '3px solid var(--admin-info)' }}>
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'قيد الانتظار' : 'Pending'}</h3><Clock size={16} style={{ color: 'var(--admin-info)' }} /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{pendingOrders}</p>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: '3px solid var(--admin-warning)' }}>
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'قيد التحضير' : 'Preparing'}</h3><AlertCircle size={16} style={{ color: 'var(--admin-warning)' }} /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{preparingOrders}</p>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: '3px solid #8B5CF6' }}>
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'في الطريق' : 'Delivering'}</h3><Truck size={16} style={{ color: '#8B5CF6' }} /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{outForDelivery}</p>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: '3px solid var(--admin-success)' }}>
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'مكتمل' : 'Completed'}</h3><CheckCircle size={16} style={{ color: 'var(--admin-success)' }} /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{completedOrders}</p>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: '3px solid var(--admin-error)' }}>
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'ملغي' : 'Cancelled'}</h3><XCircle size={16} style={{ color: 'var(--admin-error)' }} /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{cancelledOrders}</p>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: '3px solid var(--admin-primary)' }}>
          <div className="admin-stat-header"><h3 className="admin-stat-title">{lang === 'ar' ? 'عملاء جدد' : 'New Customers'}</h3><Users size={16} style={{ color: 'var(--admin-primary)' }} /></div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{newCustomersToday}</p>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders + Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">{lang === 'ar' ? 'أحدث الطلبات' : 'Recent Orders'}</h3>
            <Link href="/dashboard/orders" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
              {lang === 'ar' ? 'عرض الكل' : 'View All'} <ArrowUpRight size={14} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'رقم الطلب' : 'Order #'}</th>
                  <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="admin-table-empty">{lang === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}</td></tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <Link href={`/dashboard/orders/${order.id}`} style={{ color: 'var(--admin-primary)', fontWeight: 600, textDecoration: 'none' }}>
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td>{order.customer.name}</td>
                      <td style={{ fontWeight: 500 }}>AED {order.totalAmount.toFixed(2)}</td>
                      <td>{statusBadge(order.status)}</td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                        {order.createdAt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">{lang === 'ar' ? 'أكثر المنتجات مبيعاً' : 'Top Selling Products'}</h3>
          </div>
          {topProducts.length === 0 ? (
            <div className="admin-empty-state" style={{ padding: '32px 16px' }}>
              <p>{lang === 'ar' ? 'لا توجد بيانات بعد' : 'No data yet'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topProducts.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < topProducts.length - 1 ? '1px solid var(--admin-border-light)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--admin-primary-light)', color: 'var(--admin-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{i + 1}</span>
                    <span style={{ fontWeight: 500, fontSize: '13.5px' }}>{lang === 'ar' ? p.productNameAr : p.productNameEn}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>AED {(p._sum.lineTotal || 0).toFixed(0)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{p._sum.quantity} {lang === 'ar' ? 'وحدة' : 'sold'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="admin-stats-grid" style={{ marginTop: '16px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}</h3>
            <Package className="admin-stat-icon" size={18} />
          </div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{productsCount}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}</h3>
            <Users className="admin-stat-icon" size={18} />
          </div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{customersCount}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <h3 className="admin-stat-title">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</h3>
            <ShoppingBag className="admin-stat-icon" size={18} />
          </div>
          <p className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{ordersCount}</p>
        </div>
      </div>
    </div>
  );
}
