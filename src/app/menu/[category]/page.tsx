import { getFrontendCategories, getFrontendProducts } from "@/lib/data-mapper";
import { CategoryClient } from "./CategoryClient";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  
  const categories = await getFrontendCategories();
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    return notFound();
  }

  const allProducts = await getFrontendProducts();
  const products = allProducts.filter(p => p.categoryId === category.id && p.active);

  return <CategoryClient categories={categories} category={category} products={products} />;
}
