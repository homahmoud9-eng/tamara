import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Eye, Mail, Search } from 'lucide-react';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const lang = await getAdminLang();
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || '1');
  const q = resolvedSearchParams?.q;
  const perPage = 20;

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [customers, totalCount] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.customer.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'العملاء' : 'Customers'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${totalCount} عميل` : `${totalCount} customers`}</p>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <form className="admin-table-search" action="/dashboard/customers" method="GET">
            <Search size={16} color="var(--admin-text-muted)" />
            <input type="text" name="q" placeholder={lang === 'ar' ? 'بحث بالاسم، الهاتف، البريد...' : 'Search by name, phone, email...'} defaultValue={q || ''} />
          </form>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
              <th>{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
              <th>{lang === 'ar' ? 'البريد' : 'Email'}</th>
              <th>{lang === 'ar' ? 'الطلبات' : 'Orders'}</th>
              <th>{lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}</th>
              <th>{lang === 'ar' ? 'آخر طلب' : 'Last Order'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={8} className="admin-table-empty">{lang === 'ar' ? 'لا يوجد عملاء' : 'No customers found'}</td></tr>
            ) : (
              customers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ direction: 'ltr', textAlign: 'left' }}>{c.phone}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.totalOrders}</td>
                  <td style={{ fontWeight: 500 }}>AED {c.totalSpent.toFixed(0)}</td>
                  <td style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                    {c.lastOrderAt ? c.lastOrderAt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : '—'}
                  </td>
                  <td>
                    <span className={`admin-badge ${c.status === 'ACTIVE' ? 'success' : 'neutral'}`}>
                      {c.status === 'ACTIVE' ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link href={`/dashboard/customers/${c.id}`} className="admin-icon-btn"><Eye size={16} /></Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-table-footer">
            <span>{lang === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}</span>
            <div className="admin-pagination">
              {page > 1 && <Link href={`/dashboard/customers?page=${page - 1}${q ? `&q=${q}` : ''}`}><button>{lang === 'ar' ? 'السابق' : 'Prev'}</button></Link>}
              {page < totalPages && <Link href={`/dashboard/customers?page=${page + 1}${q ? `&q=${q}` : ''}`}><button>{lang === 'ar' ? 'التالي' : 'Next'}</button></Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
