import { getFrontendProduct, getFrontendProducts } from "@/lib/data-mapper";
import { ProductClient } from "./ProductClient";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await getFrontendProduct(id);
  
  if (!product) {
    return notFound();
  }

  const allProducts = await getFrontendProducts();
  const mealProducts = allProducts.filter(p => p.categoryId === 'cat-meals');

  return <ProductClient product={product} mealProducts={mealProducts} />;
}
