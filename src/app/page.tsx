import { Hero } from "@/components/sections/Hero/Hero";
import { OfferRail } from "@/components/sections/OfferRail/OfferRail";
import { QuickCategories } from "@/components/sections/QuickCategories/QuickCategories";
import { CuratedCategories } from "@/components/sections/CuratedCategories/CuratedCategories";
import { PackageStorytelling } from "@/components/sections/PackageStorytelling/PackageStorytelling";
import { FreezerSection } from "@/components/sections/FreezerSection/FreezerSection";
import { TrustReviews } from "@/components/sections/TrustReviews/TrustReviews";
import { getFrontendCategories, getFrontendProducts, getFrontendOffers, getFrontendReviews, getFrontendHeroSlides, getFrontendHomepageSections } from "@/lib/data-mapper";
import prisma from "@/lib/prisma";

export default async function Home() {
  const categories = await getFrontendCategories();
  const products = await getFrontendProducts();
  const offers = await getFrontendOffers();
  const reviews = await getFrontendReviews();
  const heroSlides = await getFrontendHeroSlides();
  const sections = await getFrontendHomepageSections();
  
  const deliveryConfig = await prisma.deliveryConfig.findUnique({ where: { id: "1" } });
  const freeThreshold = deliveryConfig?.freeThreshold ?? 500;

  const storytellingSection = sections.find(s => ['PACKAGES', 'storytelling', 'packages'].includes(s.type.toUpperCase()));
  const freezerSection = sections.find(s => ['FREEZER', 'frozen'].includes(s.type.toUpperCase()));
  
  // Custom sort order based on CMS, we'll implement a simple render mapping
  // We'll keep the core structure but conditionally render the CMS-controlled parts.

  return (
    <>
      <Hero slides={heroSlides} freeDeliveryThreshold={freeThreshold} />
      <OfferRail offers={offers} />
      <QuickCategories categories={categories} />
      <CuratedCategories categories={categories} products={products} />
      {(!storytellingSection || storytellingSection.isEnabled) && <PackageStorytelling section={storytellingSection} />}
      {(!freezerSection || freezerSection.isEnabled) && <FreezerSection section={freezerSection} />}
      {reviews && reviews.length > 0 && <TrustReviews reviews={reviews} />}
    </>
  );
}
