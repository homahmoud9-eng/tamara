"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/components/providers/AppProvider';
import { Category } from '@/models/types';
import styles from './QuickCategories.module.css';

interface QuickCategoriesProps {
  categories: Category[];
}

export function QuickCategories({ categories }: QuickCategoriesProps) {
  const { language } = useApp();

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <h2 className={styles.title}>{language === 'ar' ? 'تصفح المنيو' : 'Browse Menu'}</h2>
        
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link href={`/menu#${category.slug}`} key={category.id} className={styles.categoryCard}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={category.image} 
                  alt={language === 'ar' ? category.name.ar : category.name.en}
                  fill
                  className={styles.image}
                  sizes="120px"
                />
              </div>
              <span className={styles.name}>
                {language === 'ar' ? category.name.ar : category.name.en}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
