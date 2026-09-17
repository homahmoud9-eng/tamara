import { getFrontendProduct, getFrontendProducts } from "@/lib/data-mapper";
import { ProductClient } from "./ProductClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getFrontendProduct(id);

  if (!product) {
    return { title: 'منتج غير موجود | مطبخ تمارا' };
  }

  const title = `${product.name.ar} | مطبخ تمارا`;
  const description = product.description.ar || `اطلب ${product.name.ar} الآن من مطبخ تمارا.`;
  const url = `https://www.tamara-kitchen.com/product/${product.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: product.baseImage ? [product.baseImage] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  
  const product = await getFrontendProduct(id);
  
  if (!product) {
    return notFound();
  }

  let mealProducts: any[] = [];
  
  if (product.categoryId === 'cat-packages') {
    const allProducts = await getFrontendProducts();
    mealProducts = allProducts.filter(p => p.categoryId === 'cat-meals');
  }

  // Construct safe Product Schema
  const productSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name.ar,
    "image": product.baseImage ? `https://www.tamara-kitchen.com${product.baseImage}` : undefined,
    "description": product.description.ar || product.name.ar,
  };

  // Only add Offers if price is available and non-zero (to prevent misleading Google)
  if (product.price && product.price > 0) {
    productSchema["offers"] = {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "AED",
      "availability": product.active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://www.tamara-kitchen.com/product/${product.id}`
    };
  }

  return (
    <>
      <JsonLd schema={productSchema} />
      <ProductClient product={product} mealProducts={mealProducts} />
    </>
  );
}
