import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlogPostClient } from './BlogPostClient';
import { JsonLd } from "@/components/seo/JsonLd";

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

  const url = `https://www.tamara-kitchen.com/blog/${post.slug}`;
  const title = post.seoTitleAr || post.titleAr;
  const description = post.seoDescAr || post.excerptAr || '';

  return {
    title: `${title} | مدونة تمارا`,
    description: description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author] : [],
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

  const blogSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titleAr,
    "image": post.image ? [`https://www.tamara-kitchen.com${post.image}`] : undefined,
    "datePublished": post.createdAt.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author || "مطبخ تمارا"
    }
  };

  // Fetch 3 related products (featured or active products) for internal linking
  const relatedProducts = await prisma.product.findMany({
    where: { isActive: true, availability: 'AVAILABLE' },
    take: 3,
    orderBy: [
      { isFeatured: 'desc' },
      { isBestseller: 'desc' },
      { sortOrder: 'asc' },
    ],
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      basePrice: true,
      primaryImage: true,
      category: {
        select: {
          slug: true,
          nameAr: true,
          nameEn: true,
        }
      },
      variants: {
        where: { isActive: true },
        select: {
          id: true,
          price: true,
          nameAr: true,
        }
      }
    }
  });

  return (
    <>
      <JsonLd schema={blogSchema} />
      <BlogPostClient post={post} relatedProducts={relatedProducts} />
    </>
  );
}
