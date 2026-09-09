import { getFrontendProducts } from "@/lib/data-mapper";
import { SearchClient } from "./SearchClient";

export default async function SearchPage() {
  const allProducts = await getFrontendProducts();

  return <SearchClient allProducts={allProducts} />;
}
