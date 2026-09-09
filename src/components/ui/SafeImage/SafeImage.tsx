"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import styles from './SafeImage.module.css';

export type SafeImageProps = Omit<ImageProps, 'onError'>;

export function SafeImage({ alt, className, src, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${styles.fallbackContainer} ${className || ''}`}>
        <div className={styles.fallbackInner}>
          <Image
            src="/assets/tamara_logo_1788544990894.png"
            alt="Tamara Kitchen Logo"
            width={120}
            height={40}
            className={styles.fallbackLogo}
          />
        </div>
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      src={src}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
