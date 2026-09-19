"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { Button } from '@/components/ui/Button/Button';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import Link from 'next/link';
import styles from './Hero.module.css';

export function Hero({ slides = [], freeDeliveryThreshold = 500 }: { slides?: any[], freeDeliveryThreshold?: number }) {
  const { language } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  const fallbackImages = [
    '/assets/images/tamara_hero_main.jpg',
    '/assets/images/tamara_hero_family_feast.jpg',
    '/assets/images/tamara_hero_grilled_centerpiece.jpg'
  ];

  const hasSlides = slides && slides.length > 0;
  const slideCount = hasSlides ? slides.length : fallbackImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideCount]);

  const activeSlide = hasSlides ? slides[activeIndex] : null;

  const fallbackContent = {
    ar: {
      headline: 'مطبخ تمارا',
      subtitle: 'تمارا....طعم يقرب المسافة',
      primaryCta: 'اطلب الآن',
      secondaryCta: 'تصفح المنيو',
      badge: `التوصيل مجاني للطلبات فوق ${freeDeliveryThreshold} درهم`
    },
    en: {
      headline: 'Tamara Kitchen',
      subtitle: 'Tamara.... A taste that brings us closer',
      primaryCta: 'Order Now',
      secondaryCta: 'View Menu',
      badge: `Free delivery for orders over ${freeDeliveryThreshold} AED`
    }
  };

  const text = hasSlides 
    ? {
        headline: activeSlide.title[language] || fallbackContent[language].headline,
        subtitle: activeSlide.subtitle[language] || fallbackContent[language].subtitle,
        primaryCta: activeSlide.ctaText[language] || fallbackContent[language].primaryCta,
        secondaryCta: fallbackContent[language].secondaryCta, // Keeping secondary CTA static for now
        badge: fallbackContent[language].badge
      }
    : fallbackContent[language];

  return (
    <section className={styles.hero}>
      <div className={styles.layoutWrapper}>
        
        {/* Visual Half (Single Image Rotation) */}
        <div className={styles.visualHalf}>
          <div className={styles.imageGallery}>
            {(hasSlides ? slides : fallbackImages.map((src, i) => ({ desktopImg: src, id: i }))).map((slide, index) => (
              <div 
                key={slide.id} 
                className={`${styles.heroImage} ${index === activeIndex ? styles.active : ''}`}
              >
                <SafeImage
                  src={slide.desktopImg}
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
              {text.headline.split('\n').map((line: string, i: number) => (
                <span key={i} className={styles.headlineLine}>{line}</span>
              ))}
            </h1>
            <p className={styles.subtitle}>{text.subtitle}</p>
            
            <div className={styles.actions}>
              <Link href={hasSlides && activeSlide.ctaLink ? activeSlide.ctaLink : "/menu"}>
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
