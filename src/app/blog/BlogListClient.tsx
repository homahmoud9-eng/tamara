'use client';

import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import styles from './blog.module.css';
import { useApp } from '@/components/providers/AppProvider';

interface BlogPost {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string | null;
  excerptAr: string | null;
  excerptEn: string | null;
  image: string | null;
  createdAt: Date;
  readTimeMin: number;
}

interface Props {
  blogPosts: BlogPost[];
}

export function BlogListClient({ blogPosts }: Props) {
  const { language } = useApp();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{language === 'ar' ? 'مدونة تمارا' : 'Tamara Blog'}</h1>
        <p className={styles.subtitle}>
          {language === 'ar' ? 'أحدث المقالات، الوصفات، وأخبار المطبخ' : 'Latest articles, recipes, and kitchen news'}
        </p>
      </header>

      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <article key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <SafeImage
                src={post.image || '/assets/tamara_logo_1788544990894.png'}
                alt={language === 'ar' ? post.titleAr : (post.titleEn || post.titleAr)}
                fill
                className={styles.image}
              />
            </div>
            
            <div className={styles.content}>
              <div className={styles.tag}>{language === 'ar' ? 'مقال جديد' : 'New Post'}</div>
              
              <h2 className={styles.postTitle}>{language === 'ar' ? post.titleAr : (post.titleEn || post.titleAr)}</h2>
              <hr className={styles.separator} />
              
              <p className={styles.excerpt}>{language === 'ar' ? post.excerptAr : (post.excerptEn || post.excerptAr)}</p>
              
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{new Date(post.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{language === 'ar' ? `المدة: ${post.readTimeMin} دقيقة` : `${post.readTimeMin} min read`}</span>
                </div>
              </div>

              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                {language === 'ar' ? 'اقرأ المقال' : 'Read More'}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
