import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/account', '/checkout', '/cart', '/settings', '/api'],
    },
    sitemap: 'https://www.tamara-kitchen.com/sitemap.xml',
  };
}
