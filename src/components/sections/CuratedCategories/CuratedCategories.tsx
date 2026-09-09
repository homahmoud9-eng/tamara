"use client";

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { Category, Product } from '@/models/types';
import { ProductCard } from '@/components/ui/ProductCard/ProductCard';
import styles from './CuratedCategories.module.css';

interface CuratedCategoriesProps {
  categories: Category[];
  products: Product[];
}

export function CuratedCategories({ categories, products }: CuratedCategoriesProps) {
  const { language } = useApp();

  // Filter out categories that don't have products or are meant to be handled separately like offers/packages
  const displayCategories = categories.filter(cat => 
    !['offers', 'packages'].includes(cat.slug)
  );

  return (
    <div className={styles.curatedWrapper}>
      {displayCategories.map(category => {
        const categoryProducts = products.filter(p => p.categoryId === category.id).slice(0, 3);
        
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} className={styles.section}>
            <div className={`container ${styles.container}`}>
              <div className={styles.header}>
                <h2 className={styles.title}>
                  {language === 'ar' ? category.name.ar : category.name.en}
                </h2>
                <Link href={`/menu/${category.slug}`} className={styles.browseAllBtn}>
                  {language === 'ar' ? 'تصفح الكل' : 'Browse All'}
                </Link>
              </div>
              
              <div className={styles.grid}>
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Mobile CTA */}
              <div className={styles.mobileActions}>
                <Link href={`/menu/${category.slug}`} className={styles.mobileBrowseAllBtn}>
                  {language === 'ar' ? 'تصفح الكل' : 'Browse All'}
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
