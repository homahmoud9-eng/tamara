import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createCategory } from '../../actions';
import CategoryForm from '../CategoryForm';

export default async function NewCategoryPage() {
  const lang = await getAdminLang();

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog?tab=categories" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إضافة قسم جديد' : 'Add New Category'}</h1>
          </div>
        </div>
      </div>

      <CategoryForm 
        mode="create" 
        action={createCategory} 
        lang={lang} 
      />
    </div>
  );
}
