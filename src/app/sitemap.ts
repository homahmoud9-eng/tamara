import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tamara-kitchen.com';

  // Static routes
  const routes = [
    '',
    '/menu',
    '/offers',
    '/blog',
    '/contact',
    '/faq',
    '/terms'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch dynamic routes
  const [products, posts, pages] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.page.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
  ]);

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const pageRoutes = pages.map((page) => ({
    url: `${baseUrl}/p/${page.slug}`,
    lastModified: page.publishedAt || page.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...productRoutes, ...postRoutes, ...pageRoutes];
}
