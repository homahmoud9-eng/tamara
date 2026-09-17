'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPage(formData: FormData) {
  const status = formData.get('status') as string || 'DRAFT';
  
  await prisma.page.create({
    data: {
      titleAr: formData.get('titleAr') as string,
      titleEn: formData.get('titleEn') as string,
      contentAr: formData.get('contentAr') as string || null,
      contentEn: formData.get('contentEn') as string || null,
      slug: (formData.get('slug') as string) || (formData.get('titleEn') as string).toLowerCase().replace(/\s+/g, '-'),
      seoTitleAr: formData.get('seoTitleAr') as string || null,
      seoTitleEn: formData.get('seoTitleEn') as string || null,
      seoDescAr: formData.get('seoDescAr') as string || null,
      seoDescEn: formData.get('seoDescEn') as string || null,
      ogImage: formData.get('ogImage') as string || null,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    }
  });

  revalidatePath('/', 'layout');
  redirect('/dashboard/content/pages');
}

export async function updatePage(id: string, formData: FormData) {
  const status = formData.get('status') as string || 'DRAFT';
  const existing = await prisma.page.findUnique({ where: { id } });
  
  let publishedAt = existing?.publishedAt;
  if (status === 'PUBLISHED' && !publishedAt) {
    publishedAt = new Date();
  } else if (status !== 'PUBLISHED') {
    publishedAt = null;
  }

  await prisma.page.update({
    where: { id },
    data: {
      titleAr: formData.get('titleAr') as string,
      titleEn: formData.get('titleEn') as string,
      contentAr: formData.get('contentAr') as string || null,
      contentEn: formData.get('contentEn') as string || null,
      slug: formData.get('slug') as string,
      seoTitleAr: formData.get('seoTitleAr') as string || null,
      seoTitleEn: formData.get('seoTitleEn') as string || null,
      seoDescAr: formData.get('seoDescAr') as string || null,
      seoDescEn: formData.get('seoDescEn') as string || null,
      ogImage: formData.get('ogImage') as string || null,
      status,
      publishedAt,
    }
  });

  revalidatePath('/', 'layout');
  revalidatePath(`/${existing?.slug}`);
  redirect('/dashboard/content/pages');
}

export async function updatePageStatus(id: string, status: string) {
  const existing = await prisma.page.findUnique({ where: { id } });
  let publishedAt = existing?.publishedAt;
  if (status === 'PUBLISHED' && !publishedAt) {
    publishedAt = new Date();
  } else if (status !== 'PUBLISHED') {
    publishedAt = null;
  }

  await prisma.page.update({
    where: { id },
    data: { status, publishedAt }
  });

  revalidatePath('/', 'layout');
  if (existing?.slug) {
    revalidatePath(`/${existing.slug}`);
  }
}

export async function deletePage(id: string) {
  const existing = await prisma.page.findUnique({ where: { id } });
  await prisma.page.delete({ where: { id } });
  revalidatePath('/', 'layout');
  if (existing?.slug) {
    revalidatePath(`/${existing.slug}`);
  }
}
