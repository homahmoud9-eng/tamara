import { Hero } from "@/components/sections/Hero/Hero";
import { OfferRail } from "@/components/sections/OfferRail/OfferRail";
import { QuickCategories } from "@/components/sections/QuickCategories/QuickCategories";
import { CuratedCategories } from "@/components/sections/CuratedCategories/CuratedCategories";
import { PackageStorytelling } from "@/components/sections/PackageStorytelling/PackageStorytelling";
import { FreezerSection } from "@/components/sections/FreezerSection/FreezerSection";
import { TrustReviews } from "@/components/sections/TrustReviews/TrustReviews";
import { getFrontendCategories, getFrontendProducts, getFrontendOffers, getFrontendReviews, getFrontendHeroSlides, getFrontendHomepageSections } from "@/lib/data-mapper";
import prisma from "@/lib/prisma";
import { JsonLd } from "@/components/seo/JsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tamara Kitchen | مطبخ تمارا",
  description: "طعم البيت المصري، أقرب مما تتخيل. أكل مصري بيتعمل بطعم البيت ويتوصل طازة في أبوظبي.",
  alternates: {
    canonical: '/',
  }
};

export default async function Home() {
  const categories = await getFrontendCategories();
  const products = await getFrontendProducts();
  const offers = await getFrontendOffers();
  const reviews = await getFrontendReviews();
  const heroSlides = await getFrontendHeroSlides();
  const sections = await getFrontendHomepageSections();
  
  const deliveryConfig = await prisma.deliveryConfig.findUnique({ where: { id: "1" } });
  const heroAnnouncement = {
    ar: deliveryConfig?.heroAnnouncementTextAr || (deliveryConfig?.freeThreshold ? `التوصيل مجاني للطلبات فوق ${deliveryConfig.freeThreshold} درهم` : 'التوصيل مجاني للطلبات فوق 500 درهم'),
    en: deliveryConfig?.heroAnnouncementTextEn || (deliveryConfig?.freeThreshold ? `Free delivery for orders over ${deliveryConfig.freeThreshold} AED` : 'Free delivery for orders over 500 AED')
  };
  
  const businessSetting = await prisma.businessSetting.findUnique({ where: { id: "1" } });

  const storytellingSection = sections.find(s => ['PACKAGES', 'storytelling', 'packages'].includes(s.type.toUpperCase()));
  const freezerSection = sections.find(s => ['FREEZER', 'frozen'].includes(s.type.toUpperCase()));
  
  // Custom sort order based on CMS, we'll implement a simple render mapping
  // We'll keep the core structure but conditionally render the CMS-controlled parts.

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": businessSetting?.nameAr || "مطبخ تمارا",
    "image": businessSetting?.logo ? `https://www.tamara-kitchen.com${businessSetting.logo}` : "https://www.tamara-kitchen.com/assets/images/logo.png",
    "@id": "https://www.tamara-kitchen.com",
    "url": "https://www.tamara-kitchen.com",
    "telephone": businessSetting?.phone || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessSetting?.addressAr || "",
      "addressCountry": "AE"
    },
    "servesCuisine": "Egyptian"
  };

  return (
    <>
      <JsonLd schema={restaurantSchema} />
      <Hero slides={heroSlides} heroAnnouncement={heroAnnouncement} />
      <OfferRail offers={offers} />
      <QuickCategories categories={categories} />
      <CuratedCategories categories={categories} products={products} />
      {(!storytellingSection || storytellingSection.isEnabled) && <PackageStorytelling section={storytellingSection} />}
      {(!freezerSection || freezerSection.isEnabled) && <FreezerSection section={freezerSection} />}
      {reviews && reviews.length > 0 && <TrustReviews reviews={reviews} />}
    </>
  );
}
