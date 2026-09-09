"use client";

import React from 'react';
import styles from './AnimatedBackground.module.css';
import { useApp } from '@/components/providers/AppProvider';

export function AnimatedBackground() {
  const { theme } = useApp();
  
  return (
    <div className={styles.backgroundContainer} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orb1}`}></div>
      <div className={`${styles.orb} ${styles.orb2}`}></div>
      <div className={`${styles.orb} ${styles.orb3}`}></div>
    </div>
  );
}
