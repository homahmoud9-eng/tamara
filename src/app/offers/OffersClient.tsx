"use client";

import { useApp } from "@/components/providers/AppProvider";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import Link from "next/link";
import styles from "./offers.module.css";
import { Product, Offer } from "@/models/types";

interface OffersClientProps {
  offerProducts: Product[];
  offers: Offer[];
}

export function OffersClient({ offerProducts, offers }: OffersClientProps) {
  const { language } = useApp();
  
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <SafeImage
          src="/assets/images/tamara_offer_weekly_saver.jpg"
          alt="Offers Hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {language === 'ar' ? 'عروض حصرية' : 'Exclusive Offers'}
          </h1>
          <p className={styles.subtitle}>
            {language === 'ar' 
              ? 'أفضل العروض والخصومات على الوجبات الشاملة وباقات التوفير' 
              : 'The best deals and discounts on complete meals and saver packages'}
          </p>
        </div>
      </section>

      <div className={styles.content}>
        {/* Banner Promos */}
        {offers.length > 0 && (
          <div className={styles.promos}>
            {offers.filter(o => o.active).map(offer => (
              <Link href={offer.ctaLink || "#"} key={offer.id} className={styles.promoCard}>
                <SafeImage
                  src={offer.image}
                  alt={language === 'ar' ? offer.title.ar : offer.title.en}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.promoOverlay} />
                <div className={styles.promoContent}>
                  <h3 className={styles.promoTitle}>
                    {language === 'ar' ? offer.title.ar : offer.title.en}
                  </h3>
                  <p className={styles.promoSubtitle}>
                    {language === 'ar' ? offer.subtitle.ar : offer.subtitle.en}
                  </p>
                  <span className={styles.promoBtn}>
                    {language === 'ar' ? offer.ctaText.ar : offer.ctaText.en}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Offer Products Grid */}
        {offerProducts.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>
              <span style={{ position: 'relative', zIndex: 1 }}>
                {language === 'ar' ? 'العزومات والوجبات العائلية' : 'Feasts & Family Meals'}
                <div className={styles.zayniGradient} />
              </span>
            </h2>
            <div className={styles.grid}>
              {offerProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
