"use client";

import { useApp } from "@/components/providers/AppProvider";
import styles from "./notifications.module.css";

export default function NotificationsPage() {
  const { language } = useApp();

  const notifications = [
    {
      id: "1",
      titleAr: "طلبك في الطريق!",
      titleEn: "Your order is on the way!",
      descAr: "مندوب التوصيل في طريقه إليك. تتبع طلبك الآن.",
      descEn: "The delivery driver is on the way. Track your order now.",
      timeAr: "منذ ١٠ دقائق",
      timeEn: "10 minutes ago",
      unread: true,
      icon: "🚚"
    },
    {
      id: "2",
      titleAr: "خصم ٣٠٪ بانتظارك",
      titleEn: "30% discount waiting for you",
      descAr: "استخدم الكود TAMARA30 للحصول على خصم ٣٠٪ على طلبك القادم.",
      descEn: "Use code TAMARA30 to get 30% off your next order.",
      timeAr: "أمس",
      timeEn: "Yesterday",
      unread: false,
      icon: "🎁"
    }
  ];

  return (
    <div className={styles.notificationsContainer}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>{language === "ar" ? "الإشعارات" : "Notifications"}</h1>
        </div>
      </header>

      <div className={styles.list}>
        {notifications.map(notif => (
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
        ))}
      </div>
    </div>
  );
}
