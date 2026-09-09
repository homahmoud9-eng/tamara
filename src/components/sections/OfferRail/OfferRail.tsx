"use client";

import React, { useRef } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import Link from 'next/link';
import styles from './OfferRail.module.css';

interface Offer {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  image: string;
  link: string;
}

interface OfferRailProps {
  offers: Offer[];
}

export function OfferRail({ offers }: OfferRailProps) {
  const { language, direction } = useApp();
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

  return (
    <section className={styles.offerSection}>
      <div className={`container ${styles.header}`}>
        <h2 className={styles.title}>{language === 'ar' ? 'عروض حصرية' : 'Exclusive Offers'}</h2>
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
                خصم {offer.discountValue}
                {offer.discountType === 'percentage' ? '%' : ' د.إ'}
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
