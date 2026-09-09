import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { deleteAddonGroup, deleteAddon } from './actions';

export default async function AddonsPage() {
  const lang = await getAdminLang();

  const addonGroups = await prisma.addonGroup.findMany({
    orderBy: [{ sortOrder: 'asc' }],
    include: {
      product: { select: { nameAr: true, nameEn: true } },
      addons: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'الإضافات' : 'Add-ons'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'مجموعات الإضافات وخياراتها' : 'Add-on groups and their options'}</p>
        </div>
        <Link href="/dashboard/catalog/addons/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة مجموعة' : 'Add Group'}
        </Link>
      </div>

      {addonGroups.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty-state">
            <p className="admin-empty-state-title">{lang === 'ar' ? 'لا توجد مجموعات إضافات' : 'No add-on groups'}</p>
            <p className="admin-empty-state-desc">{lang === 'ar' ? 'أنشئ مجموعة إضافات أولاً' : 'Create an add-on group to get started'}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {addonGroups.map(group => (
            <div key={group.id} className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title" style={{ marginBottom: '4px' }}>
                    {lang === 'ar' ? group.nameAr : group.nameEn}
                    <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--admin-text-muted)', marginLeft: '8px' }}>
                      → {lang === 'ar' ? group.product.nameAr : group.product.nameEn}
                    </span>
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                    <span className={`admin-badge ${group.isRequired ? 'warning' : 'neutral'}`}>
                      {group.isRequired ? (lang === 'ar' ? 'مطلوب' : 'Required') : (lang === 'ar' ? 'اختياري' : 'Optional')}
                    </span>
                    <span className="admin-badge neutral">
                      {lang === 'ar' ? `اختر ${group.minSelect}-${group.maxSelect}` : `Select ${group.minSelect}-${group.maxSelect}`}
                    </span>
                    <span className={`admin-badge ${group.isActive ? 'success' : 'neutral'}`}>
                      {group.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                  </div>
                </div>
                <div className="admin-table-actions">
                  <Link href={`/dashboard/catalog/addons/${group.id}/edit`} className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}><Edit2 size={16} /></Link>
                  <form action={async () => { 'use server'; await deleteAddonGroup(group.id); }}>
                    <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}><Trash2 size={16} /></button>
                  </form>
                </div>
              </div>

              {/* Addon Options */}
              {group.addons.length > 0 && (
                <table className="admin-table" style={{ marginTop: '12px' }}>
                  <thead>
                    <tr>
                      <th>{lang === 'ar' ? 'الخيار' : 'Option'}</th>
                      <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                      <th>{lang === 'ar' ? 'الترتيب' : 'Order'}</th>
                      <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.addons.map(addon => (
                      <tr key={addon.id}>
                        <td>
                          <span style={{ fontWeight: 500 }}>{lang === 'ar' ? addon.nameAr : addon.nameEn}</span>
                          <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginLeft: '8px' }}>
                            {lang === 'ar' ? addon.nameEn : addon.nameAr}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{addon.price > 0 ? `AED ${addon.price.toFixed(2)}` : (lang === 'ar' ? 'مجاني' : 'Free')}</td>
                        <td>{addon.sortOrder}</td>
                        <td>
                          <span className={`admin-badge ${addon.isActive ? 'success' : 'neutral'}`}>
                            {addon.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                          </span>
                        </td>
                        <td>
                          <form action={async () => { 'use server'; await deleteAddon(addon.id); }} style={{ display: 'inline' }}>
                            <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}><Trash2 size={14} /></button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
