import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import styles from './blog-post.module.css';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isActive: true },
  });

  if (!post) {
    return { title: 'مقال غير موجود | مطبخ تمارا' };
  }

  return {
    title: `${post.titleAr} | مدونة تمارا`,
    description: post.excerptAr || '',
    openGraph: {
      title: post.titleAr,
      description: post.excerptAr || '',
      images: post.image ? [post.image] : [],
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isActive: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/blog" className={styles.backButton}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        العودة للمدونة
      </Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.tag}>مقال</div>
          <h1 className={styles.title}>{post.titleAr}</h1>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{post.author || 'شيف تمارا'}</span>
            </div>
            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{new Date(post.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{post.readTimeMin} دقائق قراءة</span>
            </div>
          </div>
        </header>

        {post.image && (
          <div className={styles.heroImageWrapper}>
            <SafeImage
              src={post.image}
              alt={post.titleAr}
              fill
              className={styles.heroImage}
              priority
            />
          </div>
        )}

        <div className={styles.content}>
          <p className={styles.lead}>{post.excerptAr}</p>
          <hr className={styles.separator} />
          <div 
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: post.contentAr.replace(/\n/g, '<br/>') }}
          />
        </div>
      </article>
    </div>
  );
}
