"use client";

import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import styles from './notifications.module.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NotificationsPage() {
  const { language } = useApp();
  const router = useRouter();

  const { data, mutate } = useSWR('/api/notifications/unread', fetcher, { 
    refreshInterval: 10000 
  });
  
  const notifications = data?.notifications || [];

  // Mark all as read when opening the page
  useEffect(() => {
    if (notifications.length > 0) {
      const ids = notifications.map((n: any) => n.id);
      fetch('/api/notifications/unread', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: ids })
      }).then(() => mutate());
    }
  }, [notifications, mutate]);

  return (
    <div className={styles.notificationsContainer}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{language === "ar" ? "الإشعارات" : "Notifications"}</h1>
        </div>
      </header>

      <div className={styles.list}>
        {notifications.length > 0 ? (
          notifications.map((notif: any) => (
            <div 
              key={notif.id} 
              className={styles.notificationCard}
              onClick={() => {
                if (notif.entityId) {
                  router.push(`/orders/${notif.entityId}`);
                }
              }}
              style={{ cursor: notif.entityId ? 'pointer' : 'default' }}
            >
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <div className={styles.content}>
                <h3 className={styles.notifTitle}>
                  {language === "ar" ? notif.titleAr : notif.titleEn}
                </h3>
                <p className={styles.notifDesc}>
                  {language === "ar" ? notif.messageAr : notif.messageEn}
                </p>
                <span className={styles.notifTime}>
                  {new Date(notif.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-AE' : 'en-US', {
                    hour: '2-digit', minute: '2-digit'
                  })}
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
