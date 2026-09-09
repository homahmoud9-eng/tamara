import prisma from '@/lib/prisma';
import { CategoriesTab } from './components/CategoriesTab';
import { ProductsTab } from './components/ProductsTab';
import { getAdminLang } from '@/lib/i18n';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const lang = await getAdminLang();
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab || 'categories';

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">{lang === 'ar' ? 'إدارة الكاتالوج' : 'Catalog Management'}</h1>
      </div>

      <div className="admin-tabs">
        <a href="?tab=categories" className={`admin-tab ${tab === 'categories' ? 'active' : ''}`}>
          {lang === 'ar' ? 'الأقسام' : 'Categories'} ({categories.length})
        </a>
        <a href="?tab=products" className={`admin-tab ${tab === 'products' ? 'active' : ''}`}>
          {lang === 'ar' ? 'المنتجات' : 'Products'} ({products.length})
        </a>
      </div>

      <div className="admin-tab-content">
        {tab === 'categories' && <CategoriesTab categories={categories} lang={lang} />}
        {tab === 'products' && <ProductsTab products={products} categories={categories} lang={lang} />}
      </div>
    </div>
  );
}
