"use client";

import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import { useApp } from '@/components/providers/AppProvider';
import styles from './Footer.module.css';

export function Footer() {
  const { language } = useApp();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <SafeImage 
              src="/assets/tamara_logo_1788544990894.png" 
              alt="Tamara Kitchen Logo" 
              width={140} 
              height={46} 
              className={styles.logoImage}
            />
            <p className={styles.description}>
              {language === 'ar' 
                ? 'طعم البيت المصري الأصيل، أقرب مما تتخيل. بنقدملك أكل بيتي مطبوخ بحب ويوصلك طازة كل يوم في أبوظبي.' 
                : 'Authentic Egyptian homemade taste, closer than you think. We offer homemade food cooked with love, delivered fresh every day in Abu Dhabi.'}
            </p>
          </div>

          <div className={styles.linksWrapper}>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
              <Link href="/menu" className={styles.link}>{language === 'ar' ? 'المنيو' : 'Menu'}</Link>
              <Link href="/packages" className={styles.link}>{language === 'ar' ? 'الباقات' : 'Packages'}</Link>
              <Link href="/offers" className={styles.link}>{language === 'ar' ? 'العروض' : 'Offers'}</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>{language === 'ar' ? 'المساعدة' : 'Help'}</h4>
              <Link href="/contact" className={styles.link}>{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</Link>
              <Link href="/faq" className={styles.link}>{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</Link>
              <Link href="/terms" className={styles.link}>{language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyrightArea}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} {language === 'ar' ? 'مطبخ تمارا. جميع الحقوق محفوظة.' : 'Tamara Kitchen. All rights reserved.'}
            </p>
            <div className={styles.poweredBy}>
              Powered by{' '}
              <a href="https://www.facebook.com/vision.media.agency" target="_blank" rel="noopener noreferrer" className={styles.visionMediaLink}>
                Vision Media
              </a>
            </div>
          </div>
          
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v11a7 7 0 1 1-7-7v3a4 4 0 0 0 4 4z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
