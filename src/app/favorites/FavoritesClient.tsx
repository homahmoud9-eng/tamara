"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import styles from "./favorites.module.css";
import { Product } from "@/models/types";

interface FavoritesClientProps {
  allProducts: Product[];
}

export function FavoritesClient({ allProducts }: FavoritesClientProps) {
  const { language } = useApp();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const favoriteProducts = allProducts.filter(p => favoriteIds.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className={styles.favoritesContainer}>
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>{language === "ar" ? "المفضلة" : "Favorites"}</h1>
          </div>
        </header>
        <div className={`container ${styles.emptyState}`}>
          <div className={styles.emptyIcon}>❤️</div>
          <h2 className={styles.emptyTitle}>
            {language === "ar" ? "لا توجد أطباق مفضلة" : "No favorites yet"}
          </h2>
          <p style={{ marginBottom: '24px' }}>
            {language === "ar" 
              ? "اضغط على أيقونة القلب لحفظ أطباقك المفضلة هنا." 
              : "Tap the heart icon to save your favorite dishes here."}
          </p>
          <Link href="/menu" className={styles.browseBtn}>
            {language === "ar" ? "تصفح المنيو" : "Browse Menu"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesContainer}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{language === "ar" ? "المفضلة" : "Favorites"}</h1>
        </div>
      </header>

      <div className={`container ${styles.productGrid}`}>
        {favoriteProducts.map(product => (
          <div key={product.id} className={styles.productCard}>
            <button 
              className={styles.favBtn}
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(product.id);
              }}
              aria-label="Remove from favorites"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            
            <Link href={`/product/${product.id}`} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className={styles.imageWrapper}>
                <SafeImage
                  src={product.baseImage || product.image || ""}
                  alt={language === "ar" ? product.name.ar : product.name.en}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>
                  {language === "ar" ? product.name.ar : product.name.en}
                </h3>
                <p className={styles.productDesc}>
                  {language === "ar" ? product.description.ar : product.description.en}
                </p>
                <div className={styles.priceRow}>
                  <span className={styles.price}>
                    {product.price} {language === "ar" ? "درهم" : "AED"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
