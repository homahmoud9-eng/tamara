"use client";

import React from 'react';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { Button } from '@/components/ui/Button/Button';
import styles from './FreezerSection.module.css';

export function FreezerSection({ section }: { section?: any }) {
  const { language } = useApp();

  const fallbackContent = {
    ar: {
      title: 'من الفريزر لبيتك',
      subtitle: 'أكلات تمارا مجهزة ومجمدة، جاهزة على التسوية عشان توفر وقتك.',
      cta: 'تصفح المجمدات',
    },
    en: {
      title: 'From Freezer to Your Home',
      subtitle: 'Tamara\'s meals prepared and frozen, ready to cook to save your time.',
      cta: 'Browse Frozen',
    }
  };

  const text = section 
    ? {
        title: language === 'ar' ? (section.titleAr || fallbackContent.ar.title) : (section.titleEn || fallbackContent.en.title),
        subtitle: language === 'ar' ? (section.subtitleAr || fallbackContent.ar.subtitle) : (section.subtitleEn || fallbackContent.en.subtitle),
        cta: language === 'ar' ? (section.ctaTextAr || fallbackContent.ar.cta) : (section.ctaTextEn || fallbackContent.en.cta),
        image: section.image || "/assets/images/tamara_freezer_prepared.jpg",
        ctaLink: section.ctaLink || "/menu/frozen"
      }
    : {
        ...fallbackContent[language],
        image: "/assets/images/tamara_freezer_prepared.jpg",
        ctaLink: "/menu/frozen"
      };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <div className={styles.content}>
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h2 className={styles.title}>{text.title}</h2>
            <p className={styles.subtitle}>{text.subtitle}</p>
            <Link href={text.ctaLink} passHref legacyBehavior>
              <Button variant="glass" className={styles.ctaBtn}>
                {text.cta}
              </Button>
            </Link>
          </div>
          <div className={styles.imageWrapper}>
            <SafeImage 
              src={text.image} 
              alt={text.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className={styles.overlay}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
