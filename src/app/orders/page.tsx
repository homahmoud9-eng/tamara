"use client";

import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import styles from "./orders.module.css";

// Mock orders for the UI
const mockOrders = [
  {
    id: "ORD-9823",
    date: "2023-10-15T14:30:00Z",
    status: "processing", // processing, completed, cancelled
    items: [
      { name: { ar: "دجاج محشي", en: "Stuffed Chicken" }, quantity: 1 },
      { name: { ar: "باقة الغداء", en: "Lunch Saver" }, quantity: 1 }
    ],
    total: 350
  },
  {
    id: "ORD-9750",
    date: "2023-10-10T11:20:00Z",
    status: "completed",
    items: [
      { name: { ar: "طاجن بامية باللحم", en: "Okra Meat Tagine" }, quantity: 2 },
      { name: { ar: "مكرونة بالبشاميل", en: "Macaroni Bechamel" }, quantity: 1 }
    ],
    total: 420
  },
  {
    id: "ORD-9610",
    date: "2023-09-28T18:45:00Z",
    status: "cancelled",
    items: [
      { name: { ar: "باقة التوفير الشهرية", en: "Monthly Saver Package" }, quantity: 1 }
    ],
    total: 1200
  }
];

export default function OrdersPage() {
  const { language } = useApp();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return language === 'ar' ? 'جاري التجهيز' : 'Processing';
      case 'completed': return language === 'ar' ? 'مكتمل' : 'Completed';
      case 'cancelled': return language === 'ar' ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'processing': return styles.statusProcessing;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      default: return '';
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {language === 'ar' ? 'طلباتي' : 'My Orders'}
        </h1>

        {mockOrders.length > 0 ? (
          <div className={styles.orderList}>
            {mockOrders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <div className={styles.orderId}>#{order.id}</div>
                    <div className={styles.orderDate}>{formatDate(order.date)}</div>
                  </div>
                  <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
                <div className={styles.orderDetails}>
                  <div className={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.quantity}x {language === 'ar' ? item.name.ar : item.name.en}
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderTotal}>
                    {order.total} {language === 'ar' ? 'درهم' : 'AED'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h2 className={styles.emptyTitle}>
              {language === 'ar' ? 'لا توجد طلبات سابقة' : 'No previous orders'}
            </h2>
            <p className={styles.emptySubtitle}>
              {language === 'ar' ? 'اكتشف المنيو واطلب وجبتك المفضلة الآن' : 'Explore our menu and order your favorite meal now'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
