import { getFrontendProducts } from "@/lib/data-mapper";
import { PackagesClient } from "./PackagesClient";

export default async function PackagesPage() {
  const allProducts = await getFrontendProducts();
  const packageProducts = allProducts.filter(p => p.categoryId === 'cat-packages' && p.active);

  return <PackagesClient packageProducts={packageProducts} />;
}
