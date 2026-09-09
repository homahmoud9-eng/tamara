"use client";

import React, { useState, useEffect } from 'react';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import styles from './SplashScreen.module.css';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    // Keep splash very short so it doesn't block interactivity
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`${styles.splash} ${!isVisible ? styles.hidden : ''}`}>
      {!videoFailed ? (
        <video
          className={styles.video}
          autoPlay
          muted
          playsInline
          src="/assets/wh_logo_mt.mp4"
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div className={styles.fallback}>
          <SafeImage 
            src="/assets/tamara_logo_1788544990894.png" 
            alt="Tamara Kitchen" 
            width={180} 
            height={60} 
            priority
          />
        </div>
      )}
    </div>
  );
}
