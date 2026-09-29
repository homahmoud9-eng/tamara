'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth';

export async function createHeroSlide(formData: FormData) {
  await requireAdminSession();

  await prisma.heroSlide.create({
    data: {
      desktopImg: (formData.get('desktopImg') as string)?.trim() || '',
      mobileImg: (formData.get('mobileImg') as string)?.trim() || (formData.get('desktopImg') as string)?.trim() || '',
      titleAr: (formData.get('titleAr') as string)?.trim() || null,
      titleEn: (formData.get('titleEn') as string)?.trim() || null,
      subtitleAr: (formData.get('subtitleAr') as string)?.trim() || null,
      subtitleEn: (formData.get('subtitleEn') as string)?.trim() || null,
      ctaTextAr: (formData.get('ctaTextAr') as string)?.trim() || null,
      ctaTextEn: (formData.get('ctaTextEn') as string)?.trim() || null,
      ctaLink: (formData.get('ctaLink') as string)?.trim() || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
    },
  });
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/hero');
}

export async function updateHeroSlide(id: string, formData: FormData) {
  await requireAdminSession();

  await prisma.heroSlide.update({
    where: { id },
    data: {
      desktopImg: (formData.get('desktopImg') as string)?.trim() || '',
      mobileImg: (formData.get('mobileImg') as string)?.trim() || (formData.get('desktopImg') as string)?.trim() || '',
      titleAr: (formData.get('titleAr') as string)?.trim() || null,
      titleEn: (formData.get('titleEn') as string)?.trim() || null,
      subtitleAr: (formData.get('subtitleAr') as string)?.trim() || null,
      subtitleEn: (formData.get('subtitleEn') as string)?.trim() || null,
      ctaTextAr: (formData.get('ctaTextAr') as string)?.trim() || null,
      ctaTextEn: (formData.get('ctaTextEn') as string)?.trim() || null,
      ctaLink: (formData.get('ctaLink') as string)?.trim() || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
    },
  });
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/hero');
}

export async function deleteHeroSlide(id: string) {
  await requireAdminSession();
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath('/', 'layout');
}
