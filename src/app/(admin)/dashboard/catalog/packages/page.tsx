import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const lang = await getAdminLang();
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams?.status;

  const where: any = {};
  if (statusFilter === 'active') where.isActive = true;
  if (statusFilter === 'inactive') where.isActive = false;

  const packages = await prisma.package.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الباقات' : 'Packages'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? `${packages.length} باقة` : `${packages.length} packages`}</p>
        </div>
        <button className="admin-btn-primary" disabled style={{ opacity: 0.5 }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة باقة (قريباً)' : 'Add Package (Soon)'}
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div className="admin-table-filters">
            <form action="/dashboard/catalog/packages" method="GET" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select name="status" className="admin-select" style={{ width: '150px' }} defaultValue={statusFilter || ''}>
                <option value="">{lang === 'ar' ? 'كل الحالات' : 'All Status'}</option>
                <option value="active">{lang === 'ar' ? 'نشط' : 'Active'}</option>
                <option value="inactive">{lang === 'ar' ? 'معطل (للمراجعة)' : 'Inactive (Review)'}</option>
              </select>
              <button type="submit" className="admin-btn-ghost" style={{ padding: '8px' }}>
                {lang === 'ar' ? 'تطبيق' : 'Apply'}
              </button>
            </form>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>{lang === 'ar' ? 'الباقة' : 'Package'}</th>
              <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr><td colSpan={5} className="admin-table-empty">{lang === 'ar' ? 'لا توجد باقات' : 'No packages found'}</td></tr>
            ) : (
              packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>
                    {pkg.image ? (
                      <img src={pkg.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, backgroundColor: 'var(--admin-surface-hover)', borderRadius: 8 }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{lang === 'ar' ? pkg.nameAr : pkg.nameEn}</td>
                  <td style={{ fontWeight: 600 }}>AED {pkg.packagePrice.toFixed(2)}</td>
                  <td>
                    <span className={`admin-badge ${pkg.isActive ? 'success' : 'neutral'}`}>
                      {pkg.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل (للمراجعة)' : 'Inactive (Review)')}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      {/* Basic view action to satisfy requirement */}
                      <button disabled className="admin-icon-btn" style={{ opacity: 0.5 }}><Eye size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
