import { getAdminLang } from '@/lib/i18n';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { updateCategory } from '../../../actions';
import CategoryForm from '../../CategoryForm';
import { redirect } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();
  const { id } = await params;
  
  if (!id) {
    redirect('/dashboard/catalog/categories');
  }

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) redirect('/dashboard/catalog/categories');

  const updateCategoryWithId = updateCategory.bind(null, category.id);
  const plainCategory = {
    id: category.id,
    nameAr: category.nameAr,
    nameEn: category.nameEn,
    slug: category.slug,
    descriptionAr: category.descriptionAr,
    descriptionEn: category.descriptionEn,
    image: category.image,
    titleImage: category.titleImage,
    titleImageAr: category.titleImageAr,
    titleImageEn: category.titleImageEn,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    isFeatured: category.isFeatured,
  };

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/catalog?tab=categories" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'تعديل قسم' : 'Edit Category'}: {lang === 'ar' ? category.nameAr : category.nameEn}
            </h1>
          </div>
        </div>
      </div>

      <CategoryForm 
        mode="edit" 
        action={updateCategoryWithId} 
        lang={lang} 
        initialData={plainCategory}
      />
    </div>
  );
}
