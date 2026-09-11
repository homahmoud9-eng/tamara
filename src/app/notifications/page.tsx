"use client";

import { useApp } from "@/components/providers/AppProvider";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const { language } = useApp();

  const notifications: any[] = [];

  return (
    <div className={styles.notificationsContainer}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{language === "ar" ? "الإشعارات" : "Notifications"}</h1>
        </div>
      </header>

      <div className={styles.list}>
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div key={notif.id} className={`${styles.notificationCard} ${notif.unread ? styles.unread : ''}`}>
              <div className={styles.iconWrapper}>
                {notif.icon}
              </div>
              <div className={styles.content}>
                <h3 className={styles.notifTitle}>
                  {language === "ar" ? notif.titleAr : notif.titleEn}
                </h3>
                <p className={styles.notifDesc}>
                  {language === "ar" ? notif.descAr : notif.descEn}
                </p>
                <span className={styles.notifTime}>
                  {language === "ar" ? notif.timeAr : notif.timeEn}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <h3>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</h3>
            <p>{language === 'ar' ? 'ستظهر هنا جميع الإشعارات الخاصة بحسابك' : 'All your account notifications will appear here'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
