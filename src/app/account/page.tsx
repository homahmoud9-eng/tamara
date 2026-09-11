"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { signOut, useSession } from "next-auth/react";
import styles from "./account.module.css";

export default function AccountPage() {
  const { language } = useApp();
  const { data: session, status } = useSession();

  const menuItems = [
    {
      href: "/orders",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      labelAr: "طلباتي",
      labelEn: "My Orders",
    },
    {
      href: "/favorites",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      labelAr: "المفضلة",
      labelEn: "Favorites",
    },
    {
      href: "/notifications",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      labelAr: "الإشعارات",
      labelEn: "Notifications",
    },
    {
      href: "/settings",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
      labelAr: "الإعدادات",
      labelEn: "Settings",
    }
  ];

  if (status === "loading") {
    return <div className={styles.accountContainer}>Loading...</div>;
  }

  const userName = session?.user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className={styles.accountContainer}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{language === "ar" ? "حسابي" : "My Account"}</h1>
        </div>
      </header>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {session?.user?.image ? (
            <img src={session.user.image} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            userInitial
          )}
        </div>
        <div className={styles.profileInfo}>
          <h2>{userName}</h2>
          <p>{session?.user?.email}</p>
        </div>
      </div>

      <div className={styles.menuList}>
        {menuItems.map((item, idx) => (
          <Link key={idx} href={item.href} className={styles.menuItem}>
            <span className={styles.menuIcon}>{item.icon}</span>
            <span className={styles.menuLabel}>
              {language === "ar" ? item.labelAr : item.labelEn}
            </span>
            <svg className={styles.menuChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Link>
        ))}
        
        <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={() => signOut({ callbackUrl: "/login" })}>
          <span className={styles.menuIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span className={styles.menuLabel}>
            {language === "ar" ? "تسجيل الخروج" : "Log out"}
          </span>
        </button>
      </div>
    </div>
  );
}
