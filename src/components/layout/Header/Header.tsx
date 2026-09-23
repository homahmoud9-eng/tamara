"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import { useApp } from '@/components/providers/AppProvider';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar/AnnouncementBar';
import styles from './Header.module.css';

import { useCart } from '@/components/providers/CartProvider';

const LOGO_WHITE = '/assets/images/blog/logo_T-png_RGB_W.png';
const LOGO_DEFAULT = '/assets/tamara_logo_1788544990894.png';

export function Header({ announcement }: { announcement?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, theme, setTheme } = useApp();
  const { items } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: notificationData, mutate: mutateNotifications } = useSWR('/api/notifications/unread', fetcher, { 
    refreshInterval: 10000 
  });
  const unreadNotifications = notificationData?.notifications || [];
  const unreadCount = unreadNotifications.length;

  const previousCountRef = useRef(0);
  useEffect(() => {
    if (unreadCount > previousCountRef.current) {
      const newNotif = unreadNotifications[0];
      if (newNotif) {
        toast.success(language === 'ar' ? newNotif.titleAr : newNotif.titleEn, {
          icon: '🔔',
          duration: 4000
        });
      }
    }
    previousCountRef.current = unreadCount;
  }, [unreadCount, unreadNotifications, language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (ids: string[], redirectUrl?: string) => {
    try {
      await fetch('/api/notifications/unread', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: ids })
      });
      mutateNotifications();
      if (redirectUrl) router.push(redirectUrl);
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  // Route detection: Only the homepage gets the large hero header variant
  const cleanPath = pathname?.replace(/\/$/, '') || '';
  const isHomePage = !pathname || cleanPath === '' || cleanPath === '/index' || cleanPath === 'index';

  // Scroll logic: Strictly for homepage only
  // Deterministic initialization: Homepage starts at top (false) unless scrolled.
  // Internal pages NEVER participate in scroll-to-compact logic.
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(false);
      return;
    }

    const checkScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 60);
    };

    // Immediate check to synchronize state deterministically without waiting for a scroll event
    checkScroll();

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [isHomePage, pathname]);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Dynamic logo: on homepage, white at top and colored when scrolled; on internal pages, always colored brand logo
  const headerLogo = isHomePage ? (isScrolled ? LOGO_DEFAULT : LOGO_WHITE) : LOGO_DEFAULT;

  const positionClass = styles.headerFixed;

  // Variant and scrolled classes:
  // - Homepage: variantHero. If scrolled > 60px, also receives scrolled class for compact transition.
  // - Internal pages: ALWAYS variantCompact. NEVER receives scrolled class.
  const isHeroVariant = isHomePage;
  const showCompactHome = isHomePage && isScrolled;
  const headerClassName = `${styles.header} ${isHeroVariant ? styles.variantHero : styles.variantCompact} ${positionClass} ${showCompactHome ? styles.scrolled : ''}`;

  return (
    <>
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
      <header className={headerClassName}>
        <div className={styles.headerContainer}>
        <div className={`container ${styles.headerInner}`}>
          
          {/* Mobile Left: Actions (Notifications) */}
        <div className={styles.mobileNav}>
          <Link href="/notifications" className={styles.iconButton} aria-label="Notifications" style={{ position: 'relative' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && <span className={styles.notificationBadge}></span>}
          </Link>
        </div>

        {/* Desktop Links (Start) */}
        <nav className={styles.desktopNavStart}>
          <Link href="/" className={styles.logoLink}>
            <SafeImage 
              src={headerLogo} 
              alt="Tamara Kitchen Logo" 
              width={200} 
              height={68} 
              className={styles.logoImage} 
              priority
            />
          </Link>
          <Link href="/" className={styles.navLink}>{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <Link href="/menu" className={styles.navLink}>{language === 'ar' ? 'المنيو' : 'Menu'}</Link>
          <Link href="/offers" className={styles.navLink}>{language === 'ar' ? 'العروض' : 'Offers'}</Link>
          <Link href="/packages" className={styles.navLink}>{language === 'ar' ? 'الباقات' : 'Packages'}</Link>
          <Link href="/blog" className={styles.navLink}>{language === 'ar' ? 'المدونة' : 'Blog'}</Link>
        </nav>

        {/* Mobile Center: Logo */}
        <div className={styles.mobileLogo}>
          <Link href="/" className={styles.logoLink}>
             <SafeImage 
              src={headerLogo} 
              alt="Tamara Kitchen Logo" 
              width={160} 
              height={52} 
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

          {/* Desktop Notification Bell */}
          <div className={styles.iconButton} style={{ position: 'relative', cursor: 'pointer' }} ref={notificationDropdownRef}>
            <div onClick={() => setIsNotificationOpen(!isNotificationOpen)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadCount > 0 && <span className={styles.notificationBadge}></span>}
            </div>

            {isNotificationOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <span>{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>
                  {unreadCount > 0 && (
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--color-gold)', cursor: 'pointer', fontSize: '12px' }}
                      onClick={(e) => { e.stopPropagation(); markAsRead(unreadNotifications.map((n: any) => n.id)); }}
                    >
                      {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                    </button>
                  )}
                </div>
                <div className={styles.notificationList}>
                  {unreadCount === 0 ? (
                    <div className={styles.emptyNotifications}>
                      {language === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                    </div>
                  ) : (
                    unreadNotifications.map((notif: any) => (
                      <div 
                        key={notif.id} 
                        className={styles.notificationItem} 
                        onClick={() => {
                          setIsNotificationOpen(false);
                          markAsRead([notif.id], notif.entityId ? `/orders/${notif.entityId}` : '/orders');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.notificationTitle}>{language === 'ar' ? notif.titleAr : notif.titleEn}</div>
                        <div className={styles.notificationMessage}>{language === 'ar' ? notif.messageAr : notif.messageEn}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Link href="/account" className={styles.iconButton} aria-label="Account">
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
          {!isMobileMenuOpen && (
            <button className={styles.iconButton} aria-label="Menu" onClick={() => setIsMobileMenuOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        </div>
      </div>

      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuClose} onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className={styles.mobileMenuDrawer}>
            <div className={styles.mobileMenuHeader}>
              <SafeImage src="/assets/tamara_logo_1788544990894.png" alt="Logo" width={160} height={52} className={styles.logoImage} />
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
              <Link href="/blog" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{language === 'ar' ? 'المدونة' : 'Blog'}</Link>
              <div className={styles.mobileMenuActionsDrawer}>
                <button className={styles.mobileMenuActionBtn} onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}>
                  {language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
