import prisma from '@/lib/prisma';
import { getLang } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  const lang = await getLang();

  if (!page || page.status !== 'PUBLISHED') {
    return { title: 'Not Found' };
  }

  const title = lang === 'ar' ? (page.seoTitleAr || page.titleAr) : (page.seoTitleEn || page.titleEn);
  const description = lang === 'ar' ? page.seoDescAr : page.seoDescEn;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description || '',
      images: page.ogImage ? [page.ogImage] : [],
    },
  };
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page || page.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '40px 16px', minHeight: '60vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)' }}>
          {lang === 'ar' ? page.titleAr : page.titleEn}
        </h1>
        <div 
          className="page-content" 
          style={{ lineHeight: '1.8', fontSize: '16px', color: 'var(--text-muted)' }}
          dangerouslySetInnerHTML={{ __html: (lang === 'ar' ? page.contentAr : page.contentEn) || '' }} 
        />
      </div>
    </div>
  );
}
