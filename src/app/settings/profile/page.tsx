"use client";

import React, { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { language, userProfile, updateProfile } = useApp();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    phone: userProfile.phone
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(userProfile.profileImage);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      profileImage: profileImage
    });
    router.push('/settings');
  };

  const handlePhotoChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
            {language === 'ar' ? 'تعديل الحساب' : 'Edit Profile'}
          </h1>
        </div>

        <div className={styles.avatarContainer}>
          <div 
            className={styles.avatar} 
            style={profileImage ? { backgroundImage: `url(${profileImage})`, color: 'transparent', backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {formData.firstName.charAt(0)}
          </div>
          <button className={styles.changePhotoBtn} onClick={handlePhotoChangeClick}>
            {language === 'ar' ? 'تغيير الصورة الشخصية' : 'Change Profile Photo'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
            <input 
              type="text" 
              className={styles.formInput} 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'اسم العائلة' : 'Last Name'}</label>
            <input 
              type="text" 
              className={styles.formInput} 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <input 
              type="email" 
              className={styles.formInput} 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              disabled // Email is usually disabled or requires verification to change
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
            <input 
              type="tel" 
              className={styles.formInput} 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSave}>
              {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
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
