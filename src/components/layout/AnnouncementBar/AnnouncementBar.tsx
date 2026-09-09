"use client";

import React from 'react';
import { useApp } from '@/components/providers/AppProvider';
import styles from './AnnouncementBar.module.css';

interface AnnouncementBarProps {
  messageAr: string;
  messageEn: string;
  ctaTextAr?: string;
  ctaTextEn?: string;
  ctaLink?: string;
  icon?: React.ReactNode;
}

export function AnnouncementBar({
  messageAr,
  messageEn,
  ctaTextAr,
  ctaTextEn,
  ctaLink,
  icon,
}: AnnouncementBarProps) {
  const { language, direction } = useApp();

  const text = language === 'ar' ? messageAr : messageEn;
  const cta = language === 'ar' ? ctaTextAr : ctaTextEn;

  // We repeat the content to create a seamless looping marquee
  const repeatedContent = Array(4).fill(null).map((_, i) => (
    <div key={i} className={styles.item}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{text}</span>
      {cta && ctaLink && (
        <a href={ctaLink} className={styles.cta}>
          {cta}
        </a>
      )}
    </div>
  ));

  return (
    <div className={styles.barContainer} dir={direction}>
      <div className={styles.marqueeTrack}>
        {repeatedContent}
        {repeatedContent}
      </div>
    </div>
  );
}
