import { getFrontendOffers, getFrontendProducts } from "@/lib/data-mapper";
import { OffersClient } from "./OffersClient";

export default async function OffersPage() {
  const allProducts = await getFrontendProducts();
  const offerProducts = allProducts.filter(p => p.categoryId === 'cat-offers' && p.active);
  const offers = await getFrontendOffers();

  return <OffersClient offerProducts={offerProducts} offers={offers} />;
}
