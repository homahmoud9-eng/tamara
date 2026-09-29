"use client";

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { Button } from '@/components/ui/Button/Button';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import styles from './PackageStorytelling.module.css';

export interface PromoSectionData {
  id?: string;
  isEnabled?: boolean;
  badgeTextAr?: string | null;
  badgeTextEn?: string | null;
  titleAr?: string | null;
  titleEn?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  featuresAr?: any;
  featuresEn?: any;
  buttonTextAr?: string | null;
  buttonTextEn?: string | null;
  buttonLink?: string | null;
  imageUrl?: string | null;
  floatingBadgeTextAr?: string | null;
  floatingBadgeTextEn?: string | null;
}

export function PackageStorytelling({ 
  section, 
  promoData 
}: { 
  section?: any; 
  promoData?: PromoSectionData | null;
}) {
  const { language, direction } = useApp();
  const isAr = language === 'ar';

  // If promoData explicitly has isEnabled = false, do not render
  if (promoData && promoData.isEnabled === false) {
    return null;
  }

  const fallbackContent = {
    ar: {
      tag: 'جديد تمارا',
      title: 'باقات توفير الغداء',
      description: 'اشترك في باقات تمارا للغداء ووفر وقتك ومجهودك. أكل بيتي صحي ومتنوع بيوصلك كل يوم في ميعاد غداك، وبأسعار أقل بكتير من الطلبات اليومية.',
      features: [
        'توفير يصل إلى ٢٠٪',
        'توصيل مجاني يومياً',
        'تغيير الوجبات براحتك',
        'توقيف مؤقت للاشتراك'
      ],
      cta: 'شاهد الباقات',
      floatingBadgeText: '20% توفير'
    },
    en: {
      tag: 'New from Tamara',
      title: 'Lunch Saver Packages',
      description: 'Subscribe to Tamara\'s lunch packages and save time and effort. Healthy, varied homemade food delivered every day at your lunch break, at much lower prices than daily orders.',
      features: [
        'Save up to 20%',
        'Free daily delivery',
        'Change meals easily',
        'Pause subscription anytime'
      ],
      cta: 'View Packages',
      floatingBadgeText: '20% Off'
    }
  };

  let tag = isAr ? fallbackContent.ar.tag : fallbackContent.en.tag;
  let title = isAr ? fallbackContent.ar.title : fallbackContent.en.title;
  let description = isAr ? fallbackContent.ar.description : fallbackContent.en.description;
  let features = isAr ? fallbackContent.ar.features : fallbackContent.en.features;
  let cta = isAr ? fallbackContent.ar.cta : fallbackContent.en.cta;
  let ctaLink = '/packages';
  let image = '/assets/images/tamara_package_lunch_saver.jpg';
  let floatingBadgeText = isAr ? fallbackContent.ar.floatingBadgeText : fallbackContent.en.floatingBadgeText;

  if (promoData) {
    if (isAr) {
      if (promoData.badgeTextAr) tag = promoData.badgeTextAr;
      if (promoData.titleAr) title = promoData.titleAr;
      if (promoData.descriptionAr) description = promoData.descriptionAr;
      if (Array.isArray(promoData.featuresAr) && promoData.featuresAr.length > 0) {
        features = promoData.featuresAr;
      }
      if (promoData.buttonTextAr) cta = promoData.buttonTextAr;
      if (promoData.floatingBadgeTextAr) floatingBadgeText = promoData.floatingBadgeTextAr;
    } else {
      if (promoData.badgeTextEn) tag = promoData.badgeTextEn;
      if (promoData.titleEn) title = promoData.titleEn;
      if (promoData.descriptionEn) description = promoData.descriptionEn;
      if (Array.isArray(promoData.featuresEn) && promoData.featuresEn.length > 0) {
        features = promoData.featuresEn;
      }
      if (promoData.buttonTextEn) cta = promoData.buttonTextEn;
      if (promoData.floatingBadgeTextEn) floatingBadgeText = promoData.floatingBadgeTextEn;
    }

    if (promoData.buttonLink) ctaLink = promoData.buttonLink;
    if (promoData.imageUrl) image = promoData.imageUrl;
  } else if (section) {
    if (section.titleAr && isAr) title = section.titleAr;
    if (section.titleEn && !isAr) title = section.titleEn;
    if (section.subtitleAr && isAr) description = section.subtitleAr;
    if (section.subtitleEn && !isAr) description = section.subtitleEn;
    if (section.ctaTextAr && isAr) cta = section.ctaTextAr;
    if (section.ctaTextEn && !isAr) cta = section.ctaTextEn;
    if (section.ctaLink) ctaLink = section.ctaLink;
    if (section.image) image = section.image;
  }

  // Parse floating badge text into value and label if applicable (e.g. "20% توفير" -> "20%" and "توفير")
  const badgeParts = floatingBadgeText ? floatingBadgeText.trim().split(/\s+/) : [];
  const badgeValue = badgeParts.length > 1 ? badgeParts[0] : (floatingBadgeText || '');
  const badgeLabel = badgeParts.length > 1 ? badgeParts.slice(1).join(' ') : '';

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            {tag && <span className={styles.tag}>{tag}</span>}
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
            
            {features && features.length > 0 && (
              <ul className={styles.featuresList}>
                {features.map((feature: string, idx: number) => (
                  <li key={idx} className={styles.featureItem}>
                    <div className={styles.checkIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            
            <Link href={ctaLink} passHref legacyBehavior>
              <Button size="lg" variant="secondary" className={styles.ctaBtn}>
                {cta}
              </Button>
            </Link>
          </div>
          
          <div className={styles.imageContainer}>
            {/* The decorative elements behind the image */}
            <div className={styles.blob}></div>
            <div className={styles.imageWrapper}>
              <SafeImage 
                src={image} 
                alt={title}
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Floating badge */}
            {floatingBadgeText && (
              <div className={`${styles.floatingBadge} ${direction === 'rtl' ? styles.badgeRtl : styles.badgeLtr}`}>
                <span className={styles.badgeValue}>{badgeValue}</span>
                {badgeLabel && <span className={styles.badgeLabel}>{badgeLabel}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
