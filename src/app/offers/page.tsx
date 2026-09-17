import { getFrontendOffers, getFrontendProducts } from "@/lib/data-mapper";
import { OffersClient } from "./OffersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "العروض | مطبخ تمارا",
  description: "أفضل عروض مطبخ تمارا على الوجبات المصرية والباقات. اطلب الآن واستفد من التخفيضات الحصرية.",
  alternates: {
    canonical: '/offers',
  }
};

export default async function OffersPage() {
  const allProducts = await getFrontendProducts();
  const offerProducts = allProducts.filter(p => p.categoryId === 'cat-offers' && p.active);
  const offers = await getFrontendOffers();

  return <OffersClient offerProducts={offerProducts} offers={offers} />;
}
