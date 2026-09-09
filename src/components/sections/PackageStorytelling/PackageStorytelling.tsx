"use client";

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { Button } from '@/components/ui/Button/Button';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import styles from './PackageStorytelling.module.css';

export function PackageStorytelling() {
  const { language, direction } = useApp();

  const content = {
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
      cta: 'شاهد الباقات'
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
      cta: 'View Packages'
    }
  };

  const text = content[language];

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <span className={styles.tag}>{text.tag}</span>
            <h2 className={styles.title}>{text.title}</h2>
            <p className={styles.description}>{text.description}</p>
            
            <ul className={styles.featuresList}>
              {text.features.map((feature, idx) => (
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
            
            <Link href="/menu/packages" passHref legacyBehavior>
              <Button size="lg" variant="secondary" className={styles.ctaBtn}>
                {text.cta}
              </Button>
            </Link>
          </div>
          
          <div className={styles.imageContainer}>
            {/* The decorative elements behind the image */}
            <div className={styles.blob}></div>
            <div className={styles.imageWrapper}>
              <SafeImage 
                src="/assets/images/tamara_package_lunch_saver.jpg" 
                alt={text.title}
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Floating badge */}
            <div className={`${styles.floatingBadge} ${direction === 'rtl' ? styles.badgeRtl : styles.badgeLtr}`}>
              <span className={styles.badgeValue}>20%</span>
              <span className={styles.badgeLabel}>{language === 'ar' ? 'توفير' : 'Off'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
