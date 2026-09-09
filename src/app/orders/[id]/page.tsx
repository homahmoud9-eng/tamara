"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import styles from "./tracking.module.css";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { language } = useApp();
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const getStatusText = () => {
    if (progress < 25) return language === "ar" ? "قيد التحضير" : "Preparing";
    if (progress < 75) return language === "ar" ? "في الطريق" : "On the Way";
    return language === "ar" ? "تم التوصيل" : "Delivered";
  };

  const getStatusIcon = () => {
    if (progress < 25) return "👨‍🍳";
    if (progress < 75) return "🛵";
    return "✅";
  };

  return (
    <div className={styles.trackingContainer}>
      <header className={styles.header}>
        <div className="container">
          <Link href="/" className={styles.backBtn}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {language === "ar" ? <polyline points="9 18 15 12 9 6"></polyline> : <polyline points="15 18 9 12 15 6"></polyline>}
            </svg>
          </Link>
          <h1 className={styles.title}>
            {language === "ar" ? `الطلب #${resolvedParams.id}` : `Order #${resolvedParams.id}`}
          </h1>
        </div>
      </header>

      <div className={styles.mapPlaceholder}>
        <div className={styles.mapContent}>
          <span className={styles.mapIcon}>🗺️</span>
          <p>{language === "ar" ? "الخريطة المباشرة متوفرة قريباً" : "Live Map Coming Soon"}</p>
        </div>
      </div>

      <div className={`container ${styles.statusSection}`}>
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <div className={styles.statusIcon}>{getStatusIcon()}</div>
            <div>
              <h2 className={styles.statusTitle}>{getStatusText()}</h2>
              <p className={styles.statusDesc}>
                {language === "ar" ? "الوقت المتوقع: ١٥ دقيقة" : "ETA: 15 minutes"}
              </p>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>

          <div className={styles.driverInfo}>
            <div className={styles.driverAvatar}>👤</div>
            <div className={styles.driverDetails}>
              <h3 className={styles.driverName}>{language === "ar" ? "أحمد مصطفى" : "Ahmed Mostafa"}</h3>
              <p className={styles.driverMeta}>{language === "ar" ? "تويوتا يارس - ABC 123" : "Toyota Yaris - ABC 123"}</p>
            </div>
            <a href="tel:+971541744773" className={styles.callBtn}>
              📞
            </a>
          </div>
        </div>

        <div className={styles.orderDetails}>
          <h3 className={styles.detailsTitle}>
            {language === "ar" ? "ملخص الطلب" : "Order Summary"}
          </h3>
          <div className={styles.summaryItem}>
            <span>{language === "ar" ? "المجموع الكلي" : "Total Amount"}</span>
            <span className={styles.summaryValue}>235 {language === "ar" ? "درهم" : "AED"}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>{language === "ar" ? "طريقة الدفع" : "Payment"}</span>
            <span className={styles.summaryValue}>{language === "ar" ? "نقداً" : "Cash"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
