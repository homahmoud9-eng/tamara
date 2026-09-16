import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlogPostClient } from './BlogPostClient';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
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

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  });

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
