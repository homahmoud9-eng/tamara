"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import styles from "./addresses.module.css";

const initialAddresses: any[] = [];

export default function AddressesPage() {
  const { language } = useApp();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    details: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch('/api/addresses');
        const data = await res.json();
        if (data.success && data.addresses) {
          // Map DB format to UI format
          const mapped = data.addresses.map((a: any) => ({
            id: a.id,
            title: { ar: a.label, en: a.label },
            details: a.addressText,
            phone: '', // Address model doesn't have phone
            isDefault: a.isDefault
          }));
          setAddresses(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const setAsDefault = async (id: string | number) => {
    try {
      // Optimistic update
      setAddresses(addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      })));
      
      await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      });
    } catch (error) {
      console.error("Failed to set default:", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setAddresses(addresses.filter(a => a.id !== id));
      
      await fetch(`/api/addresses/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleEdit = (e: React.MouseEvent, address: any) => {
    e.stopPropagation();
    setFormData({
      titleAr: address.title.ar,
      titleEn: address.title.en,
      details: address.details,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData({ titleAr: '', titleEn: '', details: '', phone: '', isDefault: false });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.titleAr || !formData.details) return;

    try {
      if (editingId) {
        const res = await fetch(`/api/addresses/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        
        if (data.success) {
          setAddresses(addresses.map(a => 
            a.id === editingId 
              ? { ...a, title: { ar: data.address.label, en: data.address.label }, details: data.address.addressText, isDefault: data.address.isDefault }
              : (formData.isDefault ? { ...a, isDefault: false } : a)
          ));
        }
      } else {
        const res = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        
        if (data.success) {
          const newAddress = {
            id: data.address.id,
            title: { ar: data.address.label, en: data.address.label },
            details: data.address.addressText,
            phone: formData.phone,
            isDefault: data.address.isDefault
          };
          
          if (formData.isDefault) {
            setAddresses(addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress));
          } else {
            setAddresses([...addresses, newAddress]);
          }
        }
      }
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save address:", error);
    }
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
            {language === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses'}
          </h1>
        </div>

        {!showForm ? (
          <>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : (
              <div className={styles.addressesList}>
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`${styles.addressCard} ${address.isDefault ? styles.defaultAddress : ''}`}
                  onClick={() => setAsDefault(address.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.iconWrapper}>
                    {address.isDefault ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    )}
                  </div>
                  <div className={styles.addressInfo}>
                    <div className={styles.addressTitle}>
                      {language === 'ar' ? address.title.ar : address.title.en}
                      {address.isDefault && (
                        <span className={styles.defaultBadge}>
                          {language === 'ar' ? 'الافتراضي' : 'Default'}
                        </span>
                      )}
                    </div>
                    <div className={styles.addressDetails}>{address.details}</div>
                    <div className={styles.addressPhone}>{address.phone}</div>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} aria-label="Edit" onClick={(e) => handleEdit(e, address)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} aria-label="Delete" onClick={(e) => handleDelete(e, address.id)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}

            <button className={styles.addBtn} onClick={handleAddNew}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              {language === 'ar' ? 'إضافة عنوان جديد' : 'Add New Address'}
            </button>
          </>
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label>{language === 'ar' ? 'اسم العنوان (مثال: المنزل)' : 'Address Title (e.g. Home)'}</label>
              <input 
                type="text" 
                className={styles.formInput} 
                value={formData.titleAr} 
                onChange={e => setFormData({...formData, titleAr: e.target.value})}
                placeholder={language === 'ar' ? 'المنزل، العمل...' : 'Home, Work...'}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{language === 'ar' ? 'التفاصيل (الشارع، البناية، رقم الشقة)' : 'Details (Street, Building, Apt)'}</label>
              <textarea 
                className={styles.formInput} 
                rows={3}
                value={formData.details} 
                onChange={e => setFormData({...formData, details: e.target.value})}
                placeholder={language === 'ar' ? 'ادخل تفاصيل العنوان بالكامل' : 'Enter full address details'}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
              <input 
                type="tel" 
                className={styles.formInput} 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+971 5X XXX XXXX"
              />
            </div>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={formData.isDefault} 
                onChange={e => setFormData({...formData, isDefault: e.target.checked})}
              />
              {language === 'ar' ? 'تعيين كعنوان افتراضي' : 'Set as default address'}
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
