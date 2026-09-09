"use client";

import React, { useRef } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import styles from './TrustReviews.module.css';

interface Review {
  id: string;
  rating: number;
  text: string;
  author: string;
  date: string;
}

export function TrustReviews({ reviews }: { reviews: Review[] }) {
  const { language } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={`container ${styles.header}`}>
        <h2 className={styles.title}>{language === 'ar' ? 'رأي عملائنا' : 'What Our Customers Say'}</h2>
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={() => scroll('left')} aria-label="Scroll left">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
             </svg>
          </button>
          <button className={styles.controlBtn} onClick={() => scroll('right')} aria-label="Scroll right">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
             </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel} ref={scrollRef}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <p className={styles.reviewText}>&quot;{review.text}&quot;</p>
              <div className={styles.authorRow}>
                <div className={styles.avatar}>
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className={styles.authorName}>{review.author}</div>
                  <div className={styles.date}>{review.date}</div>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.spacer}></div>
        </div>
      </div>
    </section>
  );
}
