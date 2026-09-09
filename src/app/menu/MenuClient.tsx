"use client";

import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import styles from "./menu.module.css";
import { Category, Product } from "@/models/types";

interface MenuClientProps {
  categories: Category[];
  products: Product[];
}

export function MenuClient({ categories, products: allProducts }: MenuClientProps) {
  const { language } = useApp();
  const visibleCategories = categories.filter(c => c.active);

  return (
    <div className={styles.menuContainer}>
      <header className={styles.hero}>
        <div className={styles.videoBackground}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
            poster="/assets/hero-poster.jpg"
          >
            {/* The user can replace this file later: */}
            <source src="/assets/menu-hero.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.title}>
            {language === "ar" ? (
              <SafeImage src="/assets/menu_word_logo.png" alt="المنيو" width={280} height={120} className={styles.menuWordLogo} />
            ) : "Our Menu"}
          </h1>
          <p className={styles.subtitle}>
            {language === "ar"
              ? "اكتشف أشهى الأطباق المصرية المحضرة بكل حب"
              : "Discover delicious Egyptian dishes made with love"}
          </p>
        </div>
      </header>

      <nav className={styles.stickyNav}>
        <div className={styles.navInner}>
          <Link
            href="/menu"
            className={`${styles.navPill} ${styles.navPillActive}`}
          >
            {language === "ar" ? "الكل" : "All"}
          </Link>
          {visibleCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/menu/${cat.slug}`}
              className={styles.navPill}
            >
              {language === "ar" ? cat.name.ar : cat.name.en}
            </Link>
          ))}
        </div>
      </nav>

      <div className={`container ${styles.content}`}>
        {visibleCategories.map(category => {
          const products = allProducts.filter(p => p.categoryId === category.id && p.active);
          
          if (products.length === 0) return null;

          return (
            <section key={category.id} id={`category-${category.id}`} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>
                {language === "ar" ? category.name.ar : category.name.en}
              </h2>
                <div className={styles.productGrid}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
