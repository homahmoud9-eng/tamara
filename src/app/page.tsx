import { Hero } from "@/components/sections/Hero/Hero";
import { OfferRail } from "@/components/sections/OfferRail/OfferRail";
import { QuickCategories } from "@/components/sections/QuickCategories/QuickCategories";
import { CuratedCategories } from "@/components/sections/CuratedCategories/CuratedCategories";
import { PackageStorytelling } from "@/components/sections/PackageStorytelling/PackageStorytelling";
import { FreezerSection } from "@/components/sections/FreezerSection/FreezerSection";
import { TrustReviews } from "@/components/sections/TrustReviews/TrustReviews";
import { getFrontendCategories, getFrontendProducts, getFrontendOffers, getFrontendReviews } from "@/lib/data-mapper";

export default async function Home() {
  const categories = await getFrontendCategories();
  const products = await getFrontendProducts();
  const offers = await getFrontendOffers();
  const reviews = await getFrontendReviews();

  return (
    <>
      <Hero />
      <OfferRail offers={offers} />
      <QuickCategories categories={categories} />
      <CuratedCategories categories={categories} products={products} />
      <PackageStorytelling />
      <FreezerSection />
      {reviews && reviews.length > 0 && <TrustReviews reviews={reviews} />}
    </>
  );
}
