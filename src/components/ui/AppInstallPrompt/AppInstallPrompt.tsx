"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import styles from './AppInstallPrompt.module.css';

export function AppInstallPrompt() {
  const { language } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if the tooltip has been shown in this session
    const hasShownTooltip = sessionStorage.getItem('appInstallTooltipShown');
    
    if (!hasShownTooltip) {
      // Show tooltip after 5 seconds
      const timer = setTimeout(() => {
        setShowTooltip(true);
        sessionStorage.setItem('appInstallTooltipShown', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // If the user closed it completely, don't show the floating button
  if (isHidden) return null;

  return (
    <>
      {/* Floating Action Buttons Wrapper */}
      <div className={styles.fabWrapper}>
        {/* App Install Button & Tooltip */}
        <div className={styles.floatingContainer}>
          <div 
            className={styles.floatingBtn} 
            onClick={() => { setIsModalOpen(true); setShowIosInstructions(false); }}
            aria-label="Download App"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          
          {showTooltip && (
            <div 
              className={styles.tooltip}
              onClick={() => { setIsModalOpen(true); setShowIosInstructions(false); setShowTooltip(false); }}
            >
              {language === 'ar' ? 'حمل التطبيق واحصل على خصم 5%' : 'Download the app & get 5% off'}
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/971541744773" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.whatsappBtn}
          aria-label="Contact us on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.closeBtn} 
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {!showIosInstructions ? (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.discountBadge}>
                    {language === 'ar' ? 'خصم ٥٪ على أول طلب! 🎉' : '5% Off Your First Order! 🎉'}
                  </div>
                  <h3 className={styles.title}>
                    {language === 'ar' ? 'حمل تطبيق مطبخ تمارا' : 'Download Tamara Kitchen App'}
                  </h3>
                  <p className={styles.subtitle}>
                    {language === 'ar' 
                      ? 'اطلب أسرع، تتبع طلبك، واستمتع بعروض حصرية للموبايل.' 
                      : 'Order faster, track your delivery, and enjoy exclusive mobile offers.'}
                  </p>
                </div>

                <div className={styles.downloadOptions}>
                  {/* Android APK Link (Coming Soon) */}
                  <button onClick={() => alert(language === 'ar' ? 'التطبيق قريباً!' : 'App Coming Soon!')} className={styles.downloadBtn}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A2 2 0 0 1 6.6 1H17.4a2 2 0 0 1 1.89 1.16l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94z"></path>
                    </svg>
                    {language === 'ar' ? 'تحميل مباشر للأندرويد' : 'Direct Download (Android)'}
                  </button>

                  {/* iOS Button (Triggers Instructions) */}
                  <button className={styles.downloadBtn} onClick={() => setShowIosInstructions(true)} style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', border: '2px solid var(--border-color)', width: '100%' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                      <path d="M10 2c1 .5 2 2 2 5h-2c0-3-1-4-2-5Z"></path>
                    </svg>
                    {language === 'ar' ? 'تثبيت للآيفون' : 'Install on iPhone'}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.iosInstructions}>
                <h3 className={styles.title} style={{ marginBottom: '24px' }}>
                  {language === 'ar' ? 'طريقة التثبيت للآيفون' : 'iPhone Installation'}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', textAlign: 'right' }}>
                  <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '50%' }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#007AFF' }}>
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div>
                    <strong>{language === 'ar' ? '١. اضغط على زر المشاركة' : '1. Tap the Share button'}</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {language === 'ar' ? 'موجود في أسفل متصفح سفاري' : 'Located at the bottom of Safari'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', textAlign: 'right' }}>
                  <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '50%' }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <div>
                    <strong>{language === 'ar' ? '٢. اختر "إضافة للشاشة الرئيسية"' : '2. Select "Add to Home Screen"'}</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {language === 'ar' ? 'لإضافة التطبيق لجهازك مباشرة' : 'To add the app directly to your device'}
                    </p>
                  </div>
                </div>

                <button className={styles.downloadBtn} onClick={() => setShowIosInstructions(false)} style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', width: '100%', fontSize: '14px', padding: '12px' }}>
                  {language === 'ar' ? 'رجوع' : 'Back'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
