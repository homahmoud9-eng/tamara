import { getFrontendCategories, getFrontendProducts } from "@/lib/data-mapper";
import { MenuClient } from "./MenuClient";

export default async function MenuPage() {
  const categories = await getFrontendCategories();
  const products = await getFrontendProducts();

  return <MenuClient categories={categories} products={products} />;
}
