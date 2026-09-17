"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { language } = useApp();
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
      setProfileImage(session?.user?.image || null);
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        setFormData({
          name: data.profile.name || "",
          email: data.profile.email || "",
          phone: data.profile.phone || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: language === 'ar' ? 'الاسم لا يمكن أن يكون فارغاً' : 'Name cannot be empty' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: language === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Profile updated successfully' });
        // Update session to reflect new name in UI globally (like Header)
        await update({ name: formData.name });
      } else {
        setMessage({ type: 'error', text: data.message || (language === 'ar' ? 'حدث خطأ أثناء حفظ البيانات' : 'Failed to update profile') });
      }
    } catch (error) {
      console.error("Profile save error:", error);
      setMessage({ type: 'error', text: language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
    </div>;
  }

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
            {language === 'ar' ? 'تعديل المعلومات الشخصية' : 'Edit Personal Information'}
          </h1>
        </div>

        <div className={styles.avatarContainer}>
          <div 
            className={styles.avatar} 
            style={profileImage ? { backgroundImage: `url(${profileImage})`, color: 'transparent', backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {profileImage ? '' : (formData.name ? formData.name.charAt(0) : 'U')}
          </div>
        </div>

        {message && (
          <div style={{
            padding: '1rem', 
            marginBottom: '1.5rem', 
            borderRadius: '8px', 
            backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            color: message.type === 'success' ? '#4caf50' : '#f44336',
            border: `1px solid ${message.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`
          }}>
            {message.text}
          </div>
        )}

        <div className={styles.formContainer}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
          </h3>
          
          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
            <input 
              type="text" 
              className={styles.formInput} 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
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
              dir="ltr"
              style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
            />
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '2rem 0' }}></div>
          
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            {language === 'ar' ? 'معلومات تسجيل الدخول' : 'Login Information'}
          </h3>

          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <input 
              type="email" 
              className={styles.formInput} 
              value={formData.email} 
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', direction: 'ltr', textAlign: language === 'ar' ? 'right' : 'left' }}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              {language === 'ar' 
                ? 'لا يمكن تغيير البريد الإلكتروني لأنه مرتبط بحساب تسجيل الدخول.' 
                : 'The email address is linked to your login account and cannot be changed here.'}
            </p>
          </div>
          
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
              {isSaving 
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                : (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
              }
            </button>
            <Link href="/settings" className={styles.cancelBtn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
