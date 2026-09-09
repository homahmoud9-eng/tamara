"use client";

import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const { language, setLanguage, theme, setTheme, userProfile } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const IconChevron = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {language === 'ar' ? 'الحساب' : 'Account'}
          </h1>
        </div>

        <div className={styles.profileSection}>
          <div 
            className={styles.avatar}
            style={userProfile.profileImage ? { backgroundImage: `url(${userProfile.profileImage})`, color: 'transparent', backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {userProfile.firstName.charAt(0)}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{userProfile.firstName} {userProfile.lastName}</div>
            <div className={styles.profileEmail}>{userProfile.email}</div>
          </div>
          <Link href="/settings/profile" className={styles.editBtn}>
            {language === 'ar' ? 'تعديل' : 'Edit'}
          </Link>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            {language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}
          </div>
          <div className={styles.list}>
            <button className={styles.listItem} onClick={toggleLanguage}>
              <div className={styles.itemLeft}>
                <div className={styles.itemIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <span>{language === 'ar' ? 'اللغة' : 'Language'}</span>
              </div>
              <div className={styles.itemRight}>
                <span className={styles.itemValue}>{language === 'ar' ? 'العربية' : 'English'}</span>
                <IconChevron />
              </div>
            </button>
            <button className={styles.listItem} onClick={toggleTheme}>
              <div className={styles.itemLeft}>
                <div className={styles.itemIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </div>
                <span>{language === 'ar' ? 'المظهر' : 'Theme'}</span>
              </div>
              <div className={styles.itemRight}>
                <span className={styles.itemValue}>
                  {theme === 'dark' 
                    ? (language === 'ar' ? 'داكن' : 'Dark') 
                    : (language === 'ar' ? 'فاتح' : 'Light')}
                </span>
                <IconChevron />
              </div>
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            {language === 'ar' ? 'معلوماتي' : 'My Information'}
          </div>
          <div className={styles.list}>
            <Link href="/settings/addresses" className={styles.listItem} style={{ display: 'flex' }}>
              <div className={styles.itemLeft}>
                <div className={styles.itemIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <span>{language === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses'}</span>
              </div>
              <div className={styles.itemRight}>
                <IconChevron />
              </div>
            </Link>
            <Link href="/settings/payment" className={styles.listItem} style={{ display: 'flex' }}>
              <div className={styles.itemLeft}>
                <div className={styles.itemIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <span>{language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}</span>
              </div>
              <div className={styles.itemRight}>
                <IconChevron />
              </div>
            </Link>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.list}>
            <button className={`${styles.listItem} ${styles.logoutBtn}`}>
              <div className={styles.itemLeft}>
                <div className={styles.itemIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
