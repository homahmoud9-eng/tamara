"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import { useApp } from '@/components/providers/AppProvider';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar/AnnouncementBar';
import styles from './Header.module.css';

import { useCart } from '@/components/providers/CartProvider';

export function Header({ announcement }: { announcement?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, theme, setTheme } = useApp();
  const { items } = useCart();
  const pathname = usePathname();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    if (theme === 'system' || theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const isMenuPage = pathname?.startsWith('/menu');
  const isOffersPage = pathname?.startsWith('/offers');
  const isPackagesPage = pathname?.startsWith('/packages');
  const isSettingsPage = pathname?.startsWith('/settings');
  const isOrdersPage = pathname?.startsWith('/orders');
  const isProductPage = pathname?.startsWith('/product/');
  const positionClass = (isMenuPage || isOffersPage || isPackagesPage || isSettingsPage || isOrdersPage) ? styles.headerStatic : styles.headerFixed;

  if (isProductPage) {
    return null;
  }

  return (
    <header className={`${styles.header} ${positionClass} ${isScrolled ? styles.scrolled : ''}`}>
      {announcement?.isEnabled && (
        <div style={{ backgroundColor: announcement.bgColor || '#173F35', color: announcement.textColor || '#F7F0E3', width: '100%' }}>
          <AnnouncementBar 
            messageAr={announcement.textAr} 
            messageEn={announcement.textEn}
            ctaTextAr={announcement.ctaTextAr}
            ctaTextEn={announcement.ctaTextEn}
            ctaLink={announcement.ctaLink}
          />
        </div>
      )}
      <div className={styles.headerContainer}>
        <div className={`container ${styles.headerInner}`}>
          
          {/* Mobile Left: Actions (Notifications) */}
        <div className={styles.mobileNav}>
          <Link href="/notifications" className={styles.iconButton} aria-label="Notifications" style={{ position: 'relative' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className={styles.notificationBadge}></span>
          </Link>
        </div>

        {/* Desktop Links (Start) */}
        <nav className={styles.desktopNavStart}>
          <Link href="/" className={styles.logoLink}>
            <SafeImage 
              src="/assets/tamara_logo_1788544990894.png" 
              alt="Tamara Kitchen Logo" 
              width={180} 
              height={60} 
              className={styles.logoImage} 
              priority
            />
          </Link>
          <Link href="/" className={styles.navLink}>{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <Link href="/menu" className={styles.navLink}>{language === 'ar' ? 'المنيو' : 'Menu'}</Link>
          <Link href="/offers" className={styles.navLink}>{language === 'ar' ? 'العروض' : 'Offers'}</Link>
          <Link href="/packages" className={styles.navLink}>{language === 'ar' ? 'الباقات' : 'Packages'}</Link>
        </nav>

        {/* Mobile Center: Logo */}
        <div className={styles.mobileLogo}>
          <Link href="/">
             <SafeImage 
              src="/assets/tamara_logo_1788544990894.png" 
              alt="Tamara Kitchen Logo" 
              width={150} 
              height={48} 
              className={styles.logoImage} 
              priority
            />
          </Link>
        </div>

        {/* Desktop Links & Actions (End) */}
        <div className={styles.desktopNavEnd}>
          <button className={styles.textButton} onClick={toggleLanguage}>
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? (
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <circle cx="12" cy="12" r="5"></circle>
                 <line x1="12" y1="1" x2="12" y2="3"></line>
                 <line x1="12" y1="21" x2="12" y2="23"></line>
                 <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                 <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                 <line x1="1" y1="12" x2="3" y2="12"></line>
                 <line x1="21" y1="12" x2="23" y2="12"></line>
                 <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                 <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
               </svg>
            ) : (
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
               </svg>
            )}
          </button>
          
          <Link href="/settings" className={styles.iconButton} aria-label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          <Link href="/cart" className={styles.cartButton} aria-label="Cart" style={{ zIndex: 10 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className={styles.cartBadge} style={{ pointerEvents: 'none' }}>{cartItemCount}</span>
          </Link>
        </div>

        {/* Mobile Right: Menu */}
        <div className={styles.mobileActions}>
          <button className={styles.iconButton} aria-label="Menu" onClick={() => setIsMobileMenuOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuClose} onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className={styles.mobileMenuDrawer}>
            <div className={styles.mobileMenuHeader}>
              <SafeImage src="/assets/tamara_logo_1788544990894.png" alt="Logo" width={150} height={48} className={styles.logoImage} />
              <button className={styles.iconButton} onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <nav className={styles.mobileMenuNav}>
              <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
              <Link href="/menu" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{language === 'ar' ? 'المنيو' : 'Menu'}</Link>
              <Link href="/offers" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{language === 'ar' ? 'العروض' : 'Offers'}</Link>
              <Link href="/packages" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{language === 'ar' ? 'الباقات' : 'Packages'}</Link>
            </nav>
            <div className={styles.mobileMenuActionsDrawer}>
              <button className={styles.mobileMenuActionBtn} onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}>
                {language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
              </button>
              <button className={styles.mobileMenuActionBtn} onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}>
                {language === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
