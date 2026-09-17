'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { saveAddonGroup, deleteAddonGroup, saveAddon, deleteAddon } from './actions';

export default function AddonsManager({ product, lang }: { product: any, lang: string }) {
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [editingAddon, setEditingAddon] = useState<any>(null);

  // Group Form State
  const [groupForm, setGroupForm] = useState({ nameAr: '', nameEn: '', isRequired: false, minSelect: 0, maxSelect: 1, sortOrder: 0, isActive: true });
  // Addon Form State
  const [addonForm, setAddonForm] = useState({ nameAr: '', nameEn: '', price: 0, sortOrder: 0, isActive: true });
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  async function handleSaveGroup(e: React.FormEvent) {
    e.preventDefault();
    await saveAddonGroup(product.id, editingGroup?.id || null, groupForm);
    setEditingGroup(null);
  }

  async function handleSaveAddon(e: React.FormEvent) {
    e.preventDefault();
    if (!activeGroupId) return;
    await saveAddon(activeGroupId, editingAddon?.id || null, addonForm);
    setEditingAddon(null);
    setActiveGroupId(null);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{lang === 'ar' ? 'مجموعات الإضافات' : 'Add-on Groups'}</h2>
        <button 
          onClick={() => {
            setEditingGroup({ id: null });
            setGroupForm({ nameAr: '', nameEn: '', isRequired: false, minSelect: 0, maxSelect: 1, sortOrder: 0, isActive: true });
          }}
          className="admin-btn-primary"
        >
          <Plus size={16} /> {lang === 'ar' ? 'إضافة مجموعة' : 'Add Group'}
        </button>
      </div>

      {editingGroup && (
        <div style={{ backgroundColor: 'var(--admin-surface-hover)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            {editingGroup.id ? (lang === 'ar' ? 'تعديل مجموعة' : 'Edit Group') : (lang === 'ar' ? 'مجموعة جديدة' : 'New Group')}
          </h3>
          <form onSubmit={handleSaveGroup} className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الاسم (عربي) *' : 'Name (Arabic) *'}</label>
              <input type="text" required className="admin-input" value={groupForm.nameAr} onChange={e => setGroupForm({...groupForm, nameAr: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الاسم (إنجليزي) *' : 'Name (English) *'}</label>
              <input type="text" required className="admin-input" value={groupForm.nameEn} onChange={e => setGroupForm({...groupForm, nameEn: e.target.value})} />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'مطلوب؟' : 'Is Required?'}</label>
              <label className="admin-toggle">
                <input type="checkbox" checked={groupForm.isRequired} onChange={e => setGroupForm({...groupForm, isRequired: e.target.checked})} />
                <span className="admin-toggle-slider"></span>
              </label>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'نشط؟' : 'Is Active?'}</label>
              <label className="admin-toggle">
                <input type="checkbox" checked={groupForm.isActive} onChange={e => setGroupForm({...groupForm, isActive: e.target.checked})} />
                <span className="admin-toggle-slider"></span>
              </label>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الحد الأدنى' : 'Min Selections'}</label>
              <input type="number" min="0" className="admin-input" value={groupForm.minSelect} onChange={e => setGroupForm({...groupForm, minSelect: parseInt(e.target.value)})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">{lang === 'ar' ? 'الحد الأقصى' : 'Max Selections'}</label>
              <input type="number" min="1" className="admin-input" value={groupForm.maxSelect} onChange={e => setGroupForm({...groupForm, maxSelect: parseInt(e.target.value)})} />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={() => setEditingGroup(null)} className="admin-btn-secondary">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" className="admin-btn-primary">{lang === 'ar' ? 'حفظ المجموعة' : 'Save Group'}</button>
            </div>
          </form>
        </div>
      )}

      {product.addonGroups.map((group: any) => (
        <div key={group.id} style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--admin-surface-hover)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                {lang === 'ar' ? group.nameAr : group.nameEn}
                {!group.isActive && <span className="admin-badge neutral" style={{ marginLeft: '8px', fontSize: '11px' }}>{lang === 'ar' ? 'معطل' : 'Inactive'}</span>}
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)', marginTop: '4px' }}>
                {group.isRequired ? (lang === 'ar' ? 'مطلوب إجباري' : 'Required') : (lang === 'ar' ? 'اختياري' : 'Optional')} • 
                Min: {group.minSelect} • Max: {group.maxSelect}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => {
                  setEditingGroup(group);
                  setGroupForm({ nameAr: group.nameAr, nameEn: group.nameEn, isRequired: group.isRequired, minSelect: group.minSelect, maxSelect: group.maxSelect, sortOrder: group.sortOrder, isActive: group.isActive });
                }}
                className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}
              ><Edit2 size={16} /></button>
              <button onClick={() => { if(confirm('Are you sure?')) deleteAddonGroup(group.id); }} className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div style={{ padding: '16px' }}>
            <table className="admin-table" style={{ marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'اسم الإضافة' : 'Add-on Name'}</th>
                  <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {group.addons.map((addon: any) => (
                  <tr key={addon.id}>
                    <td style={{ fontWeight: 500 }}>{lang === 'ar' ? addon.nameAr : addon.nameEn}</td>
                    <td>+{addon.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</td>
                    <td>
                      <span className={`admin-badge ${addon.isActive ? 'success' : 'neutral'}`}>
                        {addon.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Inactive')}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button 
                          onClick={() => {
                            setActiveGroupId(group.id);
                            setEditingAddon(addon);
                            setAddonForm({ nameAr: addon.nameAr, nameEn: addon.nameEn, price: addon.price, sortOrder: addon.sortOrder, isActive: addon.isActive });
                          }}
                          className="admin-icon-btn" style={{ color: 'var(--admin-primary)' }}
                        ><Edit2 size={14} /></button>
                        <button onClick={() => { if(confirm('Are you sure?')) deleteAddon(addon.id); }} className="admin-icon-btn" style={{ color: 'var(--admin-error)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {group.addons.length === 0 && (
                  <tr><td colSpan={4} className="admin-table-empty" style={{ padding: '24px' }}>{lang === 'ar' ? 'لا توجد إضافات في هذه المجموعة' : 'No addons in this group'}</td></tr>
                )}
              </tbody>
            </table>

            {editingAddon && activeGroupId === group.id ? (
              <div style={{ backgroundColor: 'var(--admin-background)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--admin-border)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                  {editingAddon.id ? (lang === 'ar' ? 'تعديل إضافة' : 'Edit Add-on') : (lang === 'ar' ? 'إضافة جديدة' : 'New Add-on')}
                </h4>
                <form onSubmit={handleSaveAddon} className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}>
                  <div className="admin-form-group">
                    <input type="text" required placeholder={lang === 'ar' ? 'الاسم عربي' : 'Name Ar'} className="admin-input" value={addonForm.nameAr} onChange={e => setAddonForm({...addonForm, nameAr: e.target.value})} />
                  </div>
                  <div className="admin-form-group">
                    <input type="text" required placeholder={lang === 'ar' ? 'الاسم إنجليزي' : 'Name En'} className="admin-input" value={addonForm.nameEn} onChange={e => setAddonForm({...addonForm, nameEn: e.target.value})} />
                  </div>
                  <div className="admin-form-group">
                    <input type="number" required min="0" step="0.01" placeholder={lang === 'ar' ? 'السعر' : 'Price'} className="admin-input" value={addonForm.price} onChange={e => setAddonForm({...addonForm, price: parseFloat(e.target.value)})} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '8px' }}>
                    <button type="button" onClick={() => { setEditingAddon(null); setActiveGroupId(null); }} className="admin-btn-secondary" style={{ padding: '8px' }}><X size={16} /></button>
                    <button type="submit" className="admin-btn-primary" style={{ padding: '8px' }}><Check size={16} /></button>
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: '1 / -1', marginTop: '-8px' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                       <input type="checkbox" checked={addonForm.isActive} onChange={e => setAddonForm({...addonForm, isActive: e.target.checked})} />
                       {lang === 'ar' ? 'نشط' : 'Active'}
                     </label>
                  </div>
                </form>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setActiveGroupId(group.id);
                  setEditingAddon({ id: null });
                  setAddonForm({ nameAr: '', nameEn: '', price: 0, sortOrder: 0, isActive: true });
                }}
                className="admin-btn-secondary" style={{ width: '100%' }}
              >
                <Plus size={16} /> {lang === 'ar' ? 'إضافة صنف جديد للمجموعة' : 'Add new item to group'}
              </button>
            )}
          </div>
        </div>
      ))}

      {product.addonGroups.length === 0 && !editingGroup && (
        <div style={{ padding: '48px', textAlign: 'center', border: '1px dashed var(--admin-border)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--admin-text-muted)', marginBottom: '16px' }}>{lang === 'ar' ? 'لم يتم إضافة أي مجموعات إضافات لهذا المنتج بعد.' : 'No add-on groups have been added to this product yet.'}</p>
          <button 
            onClick={() => {
              setEditingGroup({ id: null });
              setGroupForm({ nameAr: '', nameEn: '', isRequired: false, minSelect: 0, maxSelect: 1, sortOrder: 0, isActive: true });
            }}
            className="admin-btn-primary" style={{ margin: '0 auto' }}
          >
            <Plus size={16} /> {lang === 'ar' ? 'إضافة أول مجموعة' : 'Add First Group'}
          </button>
        </div>
      )}
    </div>
  );
}
