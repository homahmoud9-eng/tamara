"use client";

import { useApp } from "@/components/providers/AppProvider";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import styles from "./packages.module.css";
import { Product } from "@/models/types";

interface PackagesClientProps {
  packageProducts: Product[];
}

export function PackagesClient({ packageProducts }: PackagesClientProps) {
  const { language } = useApp();
  
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <SafeImage
          src="/assets/images/tamara_package_lunch_saver.jpg"
          alt="Packages Hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {language === 'ar' ? 'باقات الاشتراكات' : 'Subscription Packages'}
          </h1>
          <p className={styles.subtitle}>
            {language === 'ar' 
              ? 'وفر أكثر مع باقات تمارا الأسبوعية والشهرية المصممة خصيصاً لك' 
              : 'Save more with Tamara weekly and monthly packages designed specially for you'}
          </p>
        </div>
      </section>

      <div className={styles.content}>
        {/* Package Products Grid */}
        {packageProducts.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>
              <span style={{ position: 'relative', zIndex: 1 }}>
                {language === 'ar' ? 'اختر باقتك المفضلة' : 'Choose Your Package'}
                <div className={styles.zayniGradient} />
              </span>
            </h2>
            <div className={styles.grid}>
              {packageProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
