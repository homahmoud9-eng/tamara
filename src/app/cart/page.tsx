import { getFrontendProducts } from "@/lib/data-mapper";
import { CartClient } from "./CartClient";

export default async function CartPage() {
  const allProducts = await getFrontendProducts();

  return <CartClient allProducts={allProducts} />;
}
