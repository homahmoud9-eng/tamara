import { Metadata } from 'next';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import styles from './blog.module.css';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'المدونة | مطبخ تمارا - Tamara Kitchen Blog',
  description: 'اقرأ أحدث المقالات والوصفات وأخبار مطبخ تمارا. نصائح للطبخ، ووصفات مصرية أصيلة، والمزيد.',
  keywords: 'مدونة طبخ, أكل مصري, وصفات, مطبخ تمارا, مطاعم أبوظبي, مقالات طعام',
};

// Next.js config for caching and revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  // Fetch blog posts from database
  const blogPosts = await prisma.blogPost.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>مدونة تمارا</h1>
        <p className={styles.subtitle}>أحدث المقالات، الوصفات، وأخبار المطبخ</p>
      </header>

      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <article key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <SafeImage
                src={post.image || '/assets/tamara_logo_1788544990894.png'}
                alt={post.titleAr}
                fill
                className={styles.image}
              />
            </div>
            
            <div className={styles.content}>
              <div className={styles.tag}>مقال جديد</div>
              
              <h2 className={styles.postTitle}>{post.titleAr}</h2>
              <hr className={styles.separator} />
              
              <p className={styles.excerpt}>{post.excerptAr}</p>
              
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{new Date(post.createdAt).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>المدة: {post.readTimeMin} دقيقة</span>
                </div>
              </div>

              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                اقرأ المقال
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
