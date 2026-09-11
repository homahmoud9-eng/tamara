"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { language } = useApp();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "" // Phone is not part of standard NextAuth user yet
      });
      setProfileImage(session.user.image || null);
    }
  }, [session, status, router]);

  const handleSave = () => {
    // Requires API integration to update user profile in database
    alert(language === 'ar' ? 'جاري العمل على تحديث البيانات' : 'Update profile feature coming soon');
    router.push('/settings');
  };

  if (status === "loading") {
    return <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>Loading...</div>;
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
            {language === 'ar' ? 'تعديل الحساب' : 'Edit Profile'}
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

        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'الاسم' : 'Name'}</label>
            <input 
              type="text" 
              className={styles.formInput} 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <input 
              type="email" 
              className={styles.formInput} 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
          
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSave}>
              {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
            </button>
            <Link href="/settings" className={styles.cancelBtn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
