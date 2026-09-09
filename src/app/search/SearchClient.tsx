"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { SafeImage } from "@/components/ui/SafeImage/SafeImage";
import styles from "./search.module.css";
import { Product } from "@/models/types";

interface SearchClientProps {
  allProducts: Product[];
}

export function SearchClient({ allProducts }: SearchClientProps) {
  const { language } = useApp();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    return allProducts.filter(product => {
      if (!product.active) return false;

      const searchableText = [
        product.name.ar,
        product.name.en,
        product.description.ar,
        product.description.en
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [query, allProducts]);

  return (
    <div className={styles.searchContainer}>
      <header className={styles.searchHeader}>
        <div className="container">
          <div className={styles.searchInputWrapper}>
            <svg 
              className={styles.searchIcon}
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={language === "ar" ? "ابحث عن الأطباق..." : "Search for dishes..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className={styles.clearBtn} onClick={() => setQuery("")} aria-label="Clear">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className={`container ${styles.resultsArea}`}>
        {query && (
          <div className={styles.resultsMeta}>
            {language === "ar" 
              ? `${results.length} نتائج للبحث عن "${query}"`
              : `${results.length} results for "${query}"`
            }
          </div>
        )}

        {results.length > 0 ? (
          <div className={styles.productGrid}>
            {results.map(product => (
              <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard}>
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
                    <button className={styles.addBtn} aria-label="Add to cart">
                      +
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h2 className={styles.emptyTitle}>
              {language === "ar" ? "لا توجد نتائج" : "No results found"}
            </h2>
            <p>
              {language === "ar" 
                ? "جرب البحث بكلمات مختلفة"
                : "Try searching with different keywords"
              }
            </p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🍽️</div>
            <h2 className={styles.emptyTitle}>
              {language === "ar" ? "ماذا تشتهي اليوم؟" : "What are you craving today?"}
            </h2>
            <p>
              {language === "ar" 
                ? "ابحث عن الملوخية، المحاشي، أو أي من أطباقنا المميزة"
                : "Search for Molokhia, Mahashi, or any of our signature dishes"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
