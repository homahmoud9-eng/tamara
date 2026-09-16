import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BlogListClient } from './BlogListClient';

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

  return <BlogListClient blogPosts={blogPosts} />;
}
