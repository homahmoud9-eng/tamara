"use client";

import React from 'react';
import styles from './AnimatedBackground.module.css';
import { useApp } from '@/components/providers/AppProvider';

export function AnimatedBackground() {
  const { theme } = useApp();
  
  // We apply the ambient background globally.
  // The base color is handled within the CSS.
  return (
    <div className={styles.backgroundContainer} aria-hidden="true">
      <div className={`${styles.glowLayer} ${styles.primaryGold}`}></div>
      <div className={`${styles.glowLayer} ${styles.secondaryGold}`}></div>
      <div className={`${styles.glowLayer} ${styles.emeraldGlow}`}></div>
      <div className={`${styles.glowLayer} ${styles.warmBrown}`}></div>
    </div>
  );
}
