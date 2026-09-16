import { Metadata } from 'next';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage/SafeImage';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'المدونة | مطبخ تمارا - Tamara Kitchen Blog',
  description: 'اقرأ أحدث المقالات والوصفات وأخبار مطبخ تمارا. نصائح للطبخ، ووصفات مصرية أصيلة، والمزيد.',
  keywords: 'مدونة طبخ, أكل مصري, وصفات, مطبخ تمارا, مطاعم أبوظبي, مقالات طعام',
};

// Mock data for blog posts until a CMS or database is connected
const blogPosts = [
  {
    id: 1,
    titleAr: 'سر طشة الملوخية المصرية الأصلية',
    titleEn: 'The Secret of Authentic Egyptian Molokhia',
    excerptAr: 'تعرف على الطريقة الصحيحة لعمل طشة الملوخية التي تميز المطبخ المصري الأصيل.',
    excerptEn: 'Learn the correct way to make the Molokhia Tasha that distinguishes authentic Egyptian cuisine.',
    image: '/assets/images/molokhia.jpg',
    date: '2024-05-10',
    slug: 'secret-of-egyptian-molokhia',
  },
  {
    id: 2,
    titleAr: 'كيف تختار أفضل أنواع اللحوم للمشاوي',
    titleEn: 'How to Choose the Best Meat for Grilling',
    excerptAr: 'نصائح هامة من شيف تمارا لاختيار قطعيات اللحم المناسبة لكل نوع من أنواع المشاوي.',
    excerptEn: 'Important tips from Chef Tamara for choosing the right cuts of meat for every type of grill.',
    image: '/assets/images/grill.jpg',
    date: '2024-05-02',
    slug: 'choosing-best-meat-for-grilling',
  },
  {
    id: 3,
    titleAr: 'أشهر الحلويات الرمضانية وطريقة تحضيرها',
    titleEn: 'Famous Ramadan Desserts and How to Prepare Them',
    excerptAr: 'دليلك الشامل لتحضير الكنافة والبسبوسة والقطايف في المنزل بأسهل الطرق.',
    excerptEn: 'Your comprehensive guide to preparing Kunafa, Basbousa, and Qatayef at home in the easiest ways.',
    image: '/assets/images/desserts.jpg',
    date: '2024-04-15',
    slug: 'famous-ramadan-desserts',
  }
];

export default function BlogPage() {
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
                src={post.image}
                alt={post.titleAr}
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <time className={styles.date}>{new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <h2 className={styles.postTitle}>{post.titleAr}</h2>
              <p className={styles.excerpt}>{post.excerptAr}</p>
              {/* <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                اقرأ المزيد
              </Link> */}
              <button className={styles.readMore}>قريباً...</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
