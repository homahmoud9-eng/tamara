"use client";

import React from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import { Product } from '@/models/types';
import styles from './SignatureMeals.module.css';

interface SignatureMealsProps {
  products: Product[];
}

export function SignatureMeals({ products }: SignatureMealsProps) {
  const { language } = useApp();

  return (
    <section className={styles.section}>
      <div className={`container ${styles.header}`}>
        <h2 className={styles.title}>{language === 'ar' ? 'الأطباق المميزة' : 'Signature Meals'}</h2>
        <a href="#menu" className={styles.viewAll}>
          {language === 'ar' ? 'عرض الكل' : 'View All'}
        </a>
      </div>

      <div className={`container ${styles.grid}`}>
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <SafeImage
                src={product.image || product.baseImage}
                alt={language === 'ar' ? product.name.ar : product.name.en}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <button className={styles.quickAdd} aria-label="Add to cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <div className={styles.content}>
              <div className={styles.contentHeader}>
                <h3 className={styles.productName}>{language === 'ar' ? product.name.ar : product.name.en}</h3>
                <span className={styles.rating}>
                  ★ {product.rating || 5.0}
                </span>
              </div>
              <p className={styles.productDesc}>{language === 'ar' ? product.description.ar : product.description.en}</p>
              <div className={styles.priceRow}>
                <span className={styles.price}>{product.price} {language === 'ar' ? 'درهم' : 'AED'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
