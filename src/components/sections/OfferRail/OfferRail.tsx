"use client";

import React, { useRef } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import Link from 'next/link';
import styles from './OfferRail.module.css';
import { Offer } from '@/models/types';

interface OfferRailProps {
  offers: Offer[];
}

export function OfferRail({ offers }: OfferRailProps) {
  const { language, direction, t } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      // In RTL, "left" implies moving forward (negative scroll left or increasing scroll value depending on browser), 
      // but standard scrollBy applies visually.
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!offers || offers.length === 0) return null;

  return (
    <section className={styles.offerSection}>
      <div className={`container ${styles.header}`}>
        <h2 className={styles.title}>{t('exclusive_offers')}</h2>
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={() => scroll(direction === 'rtl' ? 'right' : 'left')} aria-label="Scroll back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className={styles.controlBtn} onClick={() => scroll(direction === 'rtl' ? 'left' : 'right')} aria-label="Scroll forward">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.railWrapper}>
        <div className={styles.rail} ref={scrollRef}>
          {offers.map((offer) => (
            <Link href={offer.ctaLink} key={offer.id} className={styles.offerCard}>
              <div className={styles.badge}>
                {language === 'ar' ? (
                  <span>{t('discount')} {offer.discountValue}{offer.discountType === 'percentage' ? '%' : ' د.إ'}</span>
                ) : (
                  <span>{offer.discountValue}{offer.discountType === 'percentage' ? '%' : ' AED'} {t('discount')}</span>
                )}
              </div>
              <div className={styles.imageWrapper}>
                <SafeImage
                  src={offer.image}
                  alt={language === 'ar' ? offer.title.ar : offer.title.en}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={styles.overlay} />
              <div className={styles.content}>
                <div className={styles.header}>
                  <h3 className={styles.offerTitle}>
                    {language === 'ar' ? offer.title.ar : offer.title.en}
                  </h3>
                </div>
                <p className={styles.offerDesc}>
                  {language === 'ar' ? offer.subtitle.ar : offer.subtitle.en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
