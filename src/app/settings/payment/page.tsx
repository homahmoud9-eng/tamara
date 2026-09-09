"use client";

import React, { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import styles from "./payment.module.css";

const initialPayments = [
  {
    id: 1,
    type: 'visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true
  },
  {
    id: 2,
    type: 'mastercard',
    last4: '8888',
    expiry: '08/26',
    isDefault: false
  },
  {
    id: 3,
    type: 'applepay',
    last4: '',
    expiry: '',
    isDefault: false
  }
];

export default function PaymentMethodsPage() {
  const { language } = useApp();
  const [payments, setPayments] = useState(initialPayments);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    isDefault: false
  });

  const setAsDefault = (id: number) => {
    setPayments(payments.map(p => ({
      ...p,
      isDefault: p.id === id
    })));
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setPayments(payments.filter(p => p.id !== id));
  };

  const handleAddNew = () => {
    setFormData({ cardNumber: '', expiry: '', cvv: '', isDefault: false });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.cardNumber) return; 

    let updatedPayments = [...payments];
    const last4 = formData.cardNumber.slice(-4) || '1234';

    if (formData.isDefault) {
      updatedPayments = updatedPayments.map(p => ({ ...p, isDefault: false }));
    }

    updatedPayments.push({
      id: Date.now(),
      type: 'visa', // Defaulting to visa for mock purposes
      last4: last4,
      expiry: formData.expiry || '12/30',
      isDefault: formData.isDefault || updatedPayments.length === 0
    });

    setPayments(updatedPayments);
    setShowForm(false);
  };

  const renderIcon = (type: string) => {
    if (type === 'visa') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', color: '#1a1f71' }}>
          <text x="2" y="16" fontFamily="Arial" fontWeight="bold" fontSize="12" fill="currentColor">VISA</text>
        </svg>
      );
    }
    if (type === 'mastercard') {
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '28px' }}>
          <circle cx="9" cy="12" r="6" fill="#eb001b" opacity="0.8"/>
          <circle cx="15" cy="12" r="6" fill="#f79e1b" opacity="0.8"/>
        </svg>
      );
    }
    if (type === 'applepay') {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px' }}>
          <path d="M17.05 20.28c-.98.54-2.06.83-3.15.83-1.07 0-2.14-.28-3.11-.8l-1.09-.58c-.92-.49-1.92-.76-2.95-.76-.87 0-1.74.2-2.55.6l-.37.18c-1.39-2.34-2.14-5.06-2.14-7.85 0-3.37 1.25-6.57 3.52-8.98 1.93-2.04 4.62-3.21 7.46-3.21.6 0 1.2.06 1.78.19.82.18 1.62.48 2.37.89 1.13.62 2.12 1.48 2.91 2.51.52.68.94 1.43 1.23 2.22l.14.39-.37.16c-1.2.53-1.99 1.73-1.99 3.05 0 1.54.98 2.91 2.42 3.4l.38.13-.19.35c-.84 1.54-1.96 2.9-3.3 4-1 .82-2.14 1.5-3.36 2.02l-.63.27zM14.61 5.92c-.78-.42-1.66-.63-2.55-.63-1.63 0-3.18.66-4.33 1.87-1.33 1.41-2.07 3.3-2.07 5.29 0 2.12.58 4.2 1.67 5.99.3.5.64 1 .99 1.46.73-.3 1.49-.46 2.26-.46 1.16 0 2.29.32 3.32.92.83.48 1.78.74 2.75.74.9 0 1.79-.22 2.62-.64 1.14-.57 2.22-1.29 3.21-2.15.7-.6 1.34-1.27 1.91-2-.91-.56-1.52-1.52-1.52-2.6 0-1.4.9-2.65 2.21-3.22-.84-1.12-1.89-2.05-3.09-2.73-1.14-.64-2.43-.98-3.75-.98-.67 0-1.35.09-2 .27-.9.23-1.83.23-2.74 0-.41-.1-1.07-.37-1.07-.37l.38-.94c0 0 .62.24 1 .33.7.17 1.42.17 2.12 0 .52-.13 1.05-.2 1.58-.2 1.1 0 2.18.28 3.14.81.99.55 1.86 1.3 2.55 2.19l.86 1.1-1.18.62c-.93.49-1.53 1.45-1.53 2.5 0 1.13.66 2.13 1.66 2.65l1.1.58-.59 1.25c-.71 1.52-1.68 2.89-2.88 4.05-1.22 1.17-2.65 2.1-4.22 2.72-1.04.41-2.16.62-3.29.62-1.19 0-2.35-.25-3.44-.73-1.16-.51-2.41-.77-3.69-.77-.97 0-1.92.21-2.81.61l-1.02.45.6-1c.88-1.46 1.44-3.1 1.66-4.8.27-2.08-.22-4.17-1.37-5.91-.77-1.16-1.78-2.14-2.95-2.85l-1.07-.65 1.1-.47c1.47-.63 3.09-.95 4.74-.95 1.22 0 2.42.27 3.53.79.84.39 1.76.59 2.7.59.88 0 1.75-.18 2.57-.54.91-.4 1.88-.61 2.87-.61 1.86 0 3.66.6 5.16 1.73l1.1.82-.83-1.09z"></path>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px' }}>
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    );
  };

  const getPaymentName = (type: string) => {
    if (type === 'visa') return 'Visa';
    if (type === 'mastercard') return 'Mastercard';
    if (type === 'applepay') return 'Apple Pay';
    return 'Credit Card';
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/settings" className={styles.backBtn} aria-label="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Link>
          <h1 className={styles.title}>
            {language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}
          </h1>
        </div>

        {!showForm ? (
          <>
            <div className={styles.paymentList}>
              {payments.map((payment) => (
                <div 
                  key={payment.id} 
                  className={`${styles.paymentCard} ${payment.isDefault ? styles.defaultPayment : ''}`}
                  onClick={() => setAsDefault(payment.id)}
                >
                  <div className={styles.iconWrapper}>
                    {renderIcon(payment.type)}
                  </div>
                  <div className={styles.paymentInfo}>
                    <div className={styles.paymentTitle}>
                      {getPaymentName(payment.type)} {payment.last4 ? `•••• ${payment.last4}` : ''}
                      {payment.isDefault && (
                        <span className={styles.defaultBadge}>
                          {language === 'ar' ? 'الافتراضي' : 'Default'}
                        </span>
                      )}
                    </div>
                    {payment.expiry && (
                      <div className={styles.paymentDetails}>
                        {language === 'ar' ? 'تاريخ الانتهاء:' : 'Expires:'} {payment.expiry}
                      </div>
                    )}
                  </div>
                  <div className={styles.actions}>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} aria-label="Delete" onClick={(e) => handleDelete(e, payment.id)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.addBtn} onClick={handleAddNew}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {language === 'ar' ? 'إضافة بطاقة جديدة' : 'Add New Card'}
            </button>
          </>
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label>{language === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label>
              <input 
                type="text" 
                className={styles.formInput} 
                value={formData.cardNumber} 
                onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={formData.expiry} 
                  onChange={e => setFormData({...formData, expiry: e.target.value})}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div className={styles.formGroup}>
                <label>{language === 'ar' ? 'رمز الأمان (CVV)' : 'CVV'}</label>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={formData.cvv} 
                  onChange={e => setFormData({...formData, cvv: e.target.value})}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={formData.isDefault} 
                onChange={e => setFormData({...formData, isDefault: e.target.checked})}
              />
              {language === 'ar' ? 'تعيين كطريقة الدفع الافتراضية' : 'Set as default payment method'}
            </label>
            
            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={handleSave}>
                {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
