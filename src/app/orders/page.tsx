"use client";

import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./orders.module.css";

export default function OrdersPage() {
  const { language } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        let url = '/api/orders/my-orders';
        if (typeof window !== 'undefined') {
          const guestPhone = localStorage.getItem('guestPhone');
          if (guestPhone) {
            url += `?phone=${encodeURIComponent(guestPhone)}`;
          }
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RECEIVED': return language === 'ar' ? 'مستلم جديد' : 'Received';
      case 'CONFIRMED': return language === 'ar' ? 'مؤكد' : 'Confirmed';
      case 'PREPARING': return language === 'ar' ? 'جاري التجهيز' : 'Preparing';
      case 'OUT_FOR_DELIVERY': return language === 'ar' ? 'في الطريق' : 'Out for Delivery';
      case 'DELIVERED': return language === 'ar' ? 'مكتمل' : 'Completed';
      case 'CANCELLED': return language === 'ar' ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PREPARING': return styles.statusProcessing;
      case 'OUT_FOR_DELIVERY': return styles.statusProcessing;
      case 'DELIVERED': return styles.statusCompleted;
      case 'CANCELLED': return styles.statusCancelled;
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
        ) : orders.length > 0 ? (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <div className={styles.orderId}>#{order.orderNumber}</div>
                    <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
                  </div>
                  <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
                <div className={styles.orderDetails}>
                  <div className={styles.orderItems}>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx}>
                        {item.quantity}x {language === 'ar' ? item.productNameAr : item.productNameEn}
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderTotal}>
                    {order.totalAmount} {language === 'ar' ? 'درهم' : 'AED'}
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
