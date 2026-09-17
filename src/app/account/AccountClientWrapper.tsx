"use client";

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { signOut } from 'next-auth/react';
import styles from './account.module.css';

interface CustomerData {
  name: string;
  email: string | null;
  phone: string;
  createdAt: Date;
  totalOrders: number;
  totalSpent: number;
}

interface ActiveOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
}

interface AddressData {
  id: string;
  label: string;
  addressText: string;
  isDefault: boolean;
}

interface AccountClientWrapperProps {
  customer: CustomerData;
  activeOrder: ActiveOrder | null;
  addresses: AddressData[];
}

export function AccountClientWrapper({ customer, activeOrder, addresses }: AccountClientWrapperProps) {
  const { language, setLanguage } = useApp();
  const isAr = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(isAr ? 'en' : 'ar');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(isAr ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isAr ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getOrderStatusLabel = (status: string) => {
    const statusMap: Record<string, { ar: string, en: string }> = {
      RECEIVED: { ar: 'تم الاستلام', en: 'Received' },
      CONFIRMED: { ar: 'مؤكد', en: 'Confirmed' },
      PREPARING: { ar: 'قيد التجهيز', en: 'Preparing' },
      OUT_FOR_DELIVERY: { ar: 'في الطريق', en: 'Out for Delivery' }
    };
    return statusMap[status] ? (isAr ? statusMap[status].ar : statusMap[status].en) : status;
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountInner}>
        <header className={styles.header}>
          <h1 className={styles.title}>{isAr ? "حسابي" : "My Account"}</h1>
        </header>

        <div className={styles.gridContainer}>
          {/* LEFT SIDEBAR (Desktop) / TOP (Mobile) */}
          <div className={styles.sidebar}>
            {/* Profile Card */}
            <div className={styles.card}>
              <div className={styles.profileCard}>
                <div className={styles.avatar}>
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                  <h2>{customer.name}</h2>
                  <p>{customer.email || customer.phone}</p>
                </div>
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{customer.totalOrders}</span>
                    <span className={styles.statLabel}>{isAr ? 'طلب' : 'Orders'}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{formatCurrency(customer.totalSpent)}</span>
                    <span className={styles.statLabel}>{isAr ? 'إجمالي الصرف' : 'Total Spent'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Settings Menu */}
            <div className={styles.card}>
              <div className={styles.menuList}>
                <Link href="/orders" className={styles.menuItem}>
                  <span className={styles.menuIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </span>
                  <span className={styles.menuLabel}>{isAr ? "جميع الطلبات" : "All Orders"}</span>
                  <svg className={styles.menuChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </Link>

                <button onClick={toggleLanguage} className={styles.menuItem}>
                  <span className={styles.menuIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </span>
                  <span className={styles.menuLabel}>{isAr ? "لغة التطبيق" : "App Language"}</span>
                  <span className={styles.menuValue}>{isAr ? "العربية" : "English"}</span>
                  <svg className={styles.menuChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>

                <button onClick={() => signOut({ callbackUrl: "/login" })} className={`${styles.menuItem} ${styles.logoutBtn}`}>
                  <span className={styles.menuIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </span>
                  <span className={styles.menuLabel}>{isAr ? "تسجيل الخروج" : "Log out"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className={styles.mainContent}>
            
            {/* Active Order Card */}
            <div className={`${styles.card} ${activeOrder ? styles.activeOrderCard : ''}`}>
              <div className={`${styles.cardHeader} ${activeOrder ? styles.activeOrderHeader : ''}`}>
                <h3 className={styles.cardTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {isAr ? "الطلب الحالي" : "Active Order"}
                </h3>
              </div>
              <div className={styles.cardBody}>
                {activeOrder ? (
                  <div className={styles.activeOrderDetails}>
                    <div className={styles.orderRow}>
                      <div>
                        <div className={styles.infoLabel}>{isAr ? 'رقم الطلب' : 'Order #'}</div>
                        <div className={styles.infoValue}>{activeOrder.orderNumber}</div>
                      </div>
                      <div className={styles.orderStatus}>
                        {getOrderStatusLabel(activeOrder.status)}
                      </div>
                    </div>
                    <div className={styles.orderRow}>
                      <div>
                        <div className={styles.infoLabel}>{isAr ? 'الإجمالي' : 'Total'}</div>
                        <div className={styles.infoValue}>{formatCurrency(activeOrder.totalAmount)}</div>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>{isAr ? 'الوقت' : 'Time'}</div>
                        <div className={styles.infoValue}>{formatDate(activeOrder.createdAt)}</div>
                      </div>
                    </div>
                    <Link href={`/orders/${activeOrder.id}`} className={styles.emptyStateLink} style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}>
                      {isAr ? 'تتبع الطلب' : 'Track Order'}
                    </Link>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <svg className={styles.emptyStateIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <div>{isAr ? "لا توجد طلبات قيد التنفيذ حاليًا" : "No active orders right now"}</div>
                    <Link href="/menu" className={styles.emptyStateLink}>
                      {isAr ? 'تصفح المنيو' : 'Browse Menu'}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {isAr ? "المعلومات الشخصية" : "Personal Information"}
                </h3>
                <Link href="/settings/profile" className={styles.actionLink}>
                  {isAr ? "تعديل" : "Edit"}
                </Link>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{isAr ? 'الاسم الكامل' : 'Full Name'}</span>
                    <span className={styles.infoValue}>{customer.name}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{isAr ? 'رقم الجوال' : 'Phone Number'}</span>
                    <span className={styles.infoValue} dir="ltr">{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                      <span className={styles.infoValue}>{customer.email}</span>
                    </div>
                  )}
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>{isAr ? 'تاريخ الانضمام' : 'Joined'}</span>
                    <span className={styles.infoValue}>{formatDate(customer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses and Payment */}
            <div className={styles.infoGrid}>
              
              {/* Addresses */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {isAr ? "العناوين" : "Addresses"}
                  </h3>
                  <Link href="/settings/addresses" className={styles.actionLink}>
                    {isAr ? "إدارة" : "Manage"}
                  </Link>
                </div>
                <div className={styles.cardBody}>
                  {addresses.length > 0 ? (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>{addresses[0].label}</span>
                      <span className={styles.infoValue}>{addresses[0].addressText}</span>
                    </div>
                  ) : (
                    <div className={styles.emptyState} style={{ padding: '24px 0' }}>
                      <p style={{ fontSize: '14px' }}>{isAr ? "أضف عنوان توصيل لتسريع طلباتك القادمة" : "Add a delivery address to speed up your next orders"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    {isAr ? "طرق الدفع" : "Payment Methods"}
                  </h3>
                  <Link href="/settings/payment" className={styles.actionLink}>
                    {isAr ? "إدارة" : "Manage"}
                  </Link>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.emptyState} style={{ padding: '24px 0' }}>
                    <p style={{ fontSize: '14px' }}>{isAr ? "إدارة بطاقاتك المحفوظة" : "Manage your saved cards"}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
