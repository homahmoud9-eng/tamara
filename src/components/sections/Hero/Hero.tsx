"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { Button } from '@/components/ui/Button/Button';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import Link from 'next/link';
import styles from './Hero.module.css';

export function Hero() {
  const { language } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    '/assets/images/tamara_hero_main.jpg',
    '/assets/images/tamara_hero_family_feast.jpg',
    '/assets/images/tamara_hero_grilled_centerpiece.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const content = {
    ar: {
      headline: 'طعم البيت المصري،\nأقرب مما تتخيل',
      subtitle: 'أكل مصري بيتعمل بحب وطعم البيت، متفرزن أو مطبوخ، بيوصلك طازة في أبوظبي.',
      primaryCta: 'اطلب الآن',
      secondaryCta: 'تصفح المنيو',
      badge: 'التوصيل مجاني للطلبات فوق ٥٠٠ درهم'
    },
    en: {
      headline: 'Authentic Egyptian Taste,\nCloser Than You Think',
      subtitle: 'Homemade Egyptian food made with love, frozen or cooked, delivered fresh in Abu Dhabi.',
      primaryCta: 'Order Now',
      secondaryCta: 'View Menu',
      badge: 'Free delivery for orders over 500 AED'
    }
  };

  const text = content[language];

  return (
    <section className={styles.hero}>
      <div className={styles.layoutWrapper}>
        
        {/* Visual Half (Single Image Rotation) */}
        <div className={styles.visualHalf}>
          <div className={styles.imageGallery}>
            {images.map((src, index) => (
              <div 
                key={src} 
                className={`${styles.heroImage} ${index === activeIndex ? styles.active : ''}`}
              >
                <SafeImage
                  src={src}
                  alt="Tamara Kitchen Hero"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.imageElement}
                />
              </div>
            ))}
          </div>
          <div className={styles.overlay}></div>
        </div>

        {/* Content Half */}
        <div className={`container ${styles.contentHalf}`}>
          <div className={styles.textContent}>
            <div className={styles.badge}>{text.badge}</div>
            <h1 className={styles.headline}>
              {text.headline.split('\n').map((line, i) => (
                <span key={i} className={styles.headlineLine}>{line}</span>
              ))}
            </h1>
            <p className={styles.subtitle}>{text.subtitle}</p>
            
            <div className={styles.actions}>
              <Link href="/menu">
                <Button size="lg" variant="primary" withSweep className={styles.primaryBtn}>
                  {text.primaryCta}
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline" className={styles.secondaryBtn}>
                  {text.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
