"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import styles from "./tracking.module.css";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { language } = useApp();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${resolvedParams.id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch order");
        }
        
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
    
    // Optional: Poll for updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className={styles.trackingContainer}>
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-primary)" }}>
          {language === "ar" ? "جاري تحميل الطلب..." : "Loading order..."}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.trackingContainer}>
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-error)" }}>
          {language === "ar" ? "تعذر العثور على الطلب" : "Order not found"}
        </div>
      </div>
    );
  }

  const getProgress = (status: string) => {
    switch (status) {
      case "RECEIVED":
      case "CONFIRMED": return 10;
      case "PREPARING": return 30;
      case "OUT_FOR_DELIVERY": return 75;
      case "DELIVERED": return 100;
      case "CANCELLED": return 0;
      default: return 10;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "RECEIVED": return language === "ar" ? "تم الاستلام" : "Received";
      case "CONFIRMED": return language === "ar" ? "مؤكد" : "Confirmed";
      case "PREPARING": return language === "ar" ? "قيد التحضير" : "Preparing";
      case "OUT_FOR_DELIVERY": return language === "ar" ? "في الطريق" : "On the Way";
      case "DELIVERED": return language === "ar" ? "تم التوصيل" : "Delivered";
      case "CANCELLED": return language === "ar" ? "ملغي" : "Cancelled";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RECEIVED":
      case "CONFIRMED": return "📝";
      case "PREPARING": return "👨‍🍳";
      case "OUT_FOR_DELIVERY": return "🛵";
      case "DELIVERED": return "✅";
      case "CANCELLED": return "❌";
      default: return "📦";
    }
  };

  const progress = getProgress(order.status);

  return (
    <div className={styles.trackingContainer}>
      <header className={styles.header}>
        <div className="container">
          <Link href="/orders" className={styles.backBtn}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {language === "ar" ? <polyline points="9 18 15 12 9 6"></polyline> : <polyline points="15 18 9 12 15 6"></polyline>}
            </svg>
          </Link>
          <h1 className={styles.title}>
            {language === "ar" ? `الطلب #${order.orderNumber}` : `Order #${order.orderNumber}`}
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
            <div className={styles.statusIcon}>{getStatusIcon(order.status)}</div>
            <div>
              <h2 className={styles.statusTitle}>{getStatusText(order.status)}</h2>
              <p className={styles.statusDesc}>
                {order.status === "DELIVERED" || order.status === "CANCELLED" 
                  ? "" 
                  : (language === "ar" ? "يتم تحديث الحالة من الإدارة" : "Status updated by admin")}
              </p>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%`, backgroundColor: order.status === "CANCELLED" ? "var(--color-error)" : "var(--primary)" }}
            ></div>
          </div>

          {order.status === "OUT_FOR_DELIVERY" && (
            <div className={styles.driverInfo}>
              <div className={styles.driverAvatar}>👤</div>
              <div className={styles.driverDetails}>
                <h3 className={styles.driverName}>{language === "ar" ? "مندوب التوصيل" : "Delivery Driver"}</h3>
                <p className={styles.driverMeta}>{language === "ar" ? "في طريقه إليك" : "On his way to you"}</p>
              </div>
              <a href="tel:+971541744773" className={styles.callBtn}>
                📞
              </a>
            </div>
          )}
        </div>

        <div className={styles.orderDetails}>
          <h3 className={styles.detailsTitle}>
            {language === "ar" ? "ملخص الطلب" : "Order Summary"}
          </h3>
          <div className={styles.summaryItem}>
            <span>{language === "ar" ? "المجموع الكلي" : "Total Amount"}</span>
            <span className={styles.summaryValue}>{order.totalAmount} {language === "ar" ? "درهم" : "AED"}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>{language === "ar" ? "طريقة الدفع" : "Payment"}</span>
            <span className={styles.summaryValue}>
              {order.paymentMethod === "CASH" 
                ? (language === "ar" ? "نقداً" : "Cash") 
                : (language === "ar" ? "بطاقة ائتمان" : "Card")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
