import { Hero } from "@/components/sections/Hero/Hero";
import { OfferRail } from "@/components/sections/OfferRail/OfferRail";
import { QuickCategories } from "@/components/sections/QuickCategories/QuickCategories";
import { CuratedCategories } from "@/components/sections/CuratedCategories/CuratedCategories";
import { PackageStorytelling } from "@/components/sections/PackageStorytelling/PackageStorytelling";
import { FreezerSection } from "@/components/sections/FreezerSection/FreezerSection";
import { TrustReviews } from "@/components/sections/TrustReviews/TrustReviews";
import { getFrontendCategories, getFrontendProducts, getFrontendOffers, getFrontendReviews } from "@/lib/data-mapper";
import prisma from "@/lib/prisma";

export default async function Home() {
  const categories = await getFrontendCategories();
  const products = await getFrontendProducts();
  const offers = await getFrontendOffers();
  const reviews = await getFrontendReviews();
  
  const deliveryConfig = await prisma.deliveryConfig.findUnique({ where: { id: "1" } });
  const freeThreshold = deliveryConfig?.freeThreshold ?? 500;

  return (
    <>
      <Hero freeDeliveryThreshold={freeThreshold} />
      <OfferRail offers={offers} />
      <QuickCategories categories={categories} />
      <CuratedCategories categories={categories} products={products} />
      <PackageStorytelling />
      <FreezerSection />
      {reviews && reviews.length > 0 && <TrustReviews reviews={reviews} />}
    </>
  );
}
