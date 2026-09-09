"use client";

import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import { ProductCard } from "@/components/ui/ProductCard/ProductCard";
import styles from "./category.module.css";
import { Category, Product } from "@/models/types";

interface CategoryClientProps {
  categories: Category[];
  category: Category;
  products: Product[];
}

export function CategoryClient({ categories, category, products }: CategoryClientProps) {
  const { language } = useApp();

  return (
    <div className={styles.categoryContainer}>
      <header className={styles.hero}>
        <div className={styles.heroOverlay} />
        <SafeImage
          src={category.image}
          alt={language === "ar" ? category.name.ar : category.name.en}
          fill
          style={{ objectFit: "cover" }}
        />
        <div className={`container ${styles.heroContent}`}>
          {category.titleImage && language === 'ar' ? (
            <SafeImage
              src={category.titleImage}
              alt={category.name.ar}
              width={240}
              height={120}
              className={styles.titleImage}
            />
          ) : (
            <h1 className={styles.title}>
              {language === "ar" ? category.name.ar : category.name.en}
            </h1>
          )}
        </div>
      </header>

      <nav className={styles.stickyNav}>
        <div className={styles.navInner}>
          <Link href="/menu" className={styles.navPill}>
            {language === "ar" ? "الكل" : "All"}
          </Link>
          {categories.filter(c => c.active).map(cat => (
            <Link
              key={cat.id}
              href={`/menu/${cat.slug}`}
              className={`${styles.navPill} ${category.id === cat.id ? styles.navPillActive : ""}`}
            >
              {language === "ar" ? cat.name.ar : cat.name.en}
            </Link>
          ))}
        </div>
      </nav>

      <div className={`container ${styles.content}`}>
        <div className={styles.productGrid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
