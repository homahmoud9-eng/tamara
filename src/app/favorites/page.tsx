import { getFrontendProducts } from "@/lib/data-mapper";
import { FavoritesClient } from "./FavoritesClient";

export default async function FavoritesPage() {
  const allProducts = await getFrontendProducts();
  
  return <FavoritesClient allProducts={allProducts} />;
}
