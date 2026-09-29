'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth';

export async function createPage(formData: FormData) {
  await requireAdminSession();
  const status = (formData.get('status') as string) || 'DRAFT';
  
  await prisma.page.create({
    data: {
      titleAr: (formData.get('titleAr') as string)?.trim() || '',
      titleEn: (formData.get('titleEn') as string)?.trim() || '',
      contentAr: (formData.get('contentAr') as string)?.trim() || null,
      contentEn: (formData.get('contentEn') as string)?.trim() || null,
      slug: (formData.get('slug') as string)?.trim() || (formData.get('titleEn') as string)?.trim().toLowerCase().replace(/\s+/g, '-'),
      seoTitleAr: (formData.get('seoTitleAr') as string)?.trim() || null,
      seoTitleEn: (formData.get('seoTitleEn') as string)?.trim() || null,
      seoDescAr: (formData.get('seoDescAr') as string)?.trim() || null,
      seoDescEn: (formData.get('seoDescEn') as string)?.trim() || null,
      ogImage: (formData.get('ogImage') as string)?.trim() || null,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    }
  });

  revalidatePath('/', 'layout');
  redirect('/dashboard/content/pages');
}

export async function updatePage(id: string, formData: FormData) {
  await requireAdminSession();
  const status = (formData.get('status') as string) || 'DRAFT';
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
      titleAr: (formData.get('titleAr') as string)?.trim() || '',
      titleEn: (formData.get('titleEn') as string)?.trim() || '',
      contentAr: (formData.get('contentAr') as string)?.trim() || null,
      contentEn: (formData.get('contentEn') as string)?.trim() || null,
      slug: (formData.get('slug') as string)?.trim() || existing?.slug || '',
      seoTitleAr: (formData.get('seoTitleAr') as string)?.trim() || null,
      seoTitleEn: (formData.get('seoTitleEn') as string)?.trim() || null,
      seoDescAr: (formData.get('seoDescAr') as string)?.trim() || null,
      seoDescEn: (formData.get('seoDescEn') as string)?.trim() || null,
      ogImage: (formData.get('ogImage') as string)?.trim() || null,
      status,
      publishedAt,
    }
  });

  revalidatePath('/', 'layout');
  if (existing?.slug) {
    revalidatePath(`/${existing.slug}`);
  }
  redirect('/dashboard/content/pages');
}

export async function updatePageStatus(id: string, status: string) {
  await requireAdminSession();
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
  await requireAdminSession();
  const existing = await prisma.page.findUnique({ where: { id } });
  await prisma.page.delete({ where: { id } });
  revalidatePath('/', 'layout');
  if (existing?.slug) {
    revalidatePath(`/${existing.slug}`);
  }
}
