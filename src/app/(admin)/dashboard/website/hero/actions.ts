'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createHeroSlide(formData: FormData) {
  await prisma.heroSlide.create({
    data: {
      desktopImg: formData.get('desktopImg') as string,
      mobileImg: formData.get('mobileImg') as string || formData.get('desktopImg') as string,
      titleAr: formData.get('titleAr') as string || null,
      titleEn: formData.get('titleEn') as string || null,
      subtitleAr: formData.get('subtitleAr') as string || null,
      subtitleEn: formData.get('subtitleEn') as string || null,
      ctaTextAr: formData.get('ctaTextAr') as string || null,
      ctaTextEn: formData.get('ctaTextEn') as string || null,
      ctaLink: formData.get('ctaLink') as string || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
    },
  });
  revalidatePath('/dashboard/website/hero');
  revalidatePath('/');
  redirect('/dashboard/website/hero');
}

export async function updateHeroSlide(id: string, formData: FormData) {
  await prisma.heroSlide.update({
    where: { id },
    data: {
      desktopImg: formData.get('desktopImg') as string,
      mobileImg: formData.get('mobileImg') as string || formData.get('desktopImg') as string,
      titleAr: formData.get('titleAr') as string || null,
      titleEn: formData.get('titleEn') as string || null,
      subtitleAr: formData.get('subtitleAr') as string || null,
      subtitleEn: formData.get('subtitleEn') as string || null,
      ctaTextAr: formData.get('ctaTextAr') as string || null,
      ctaTextEn: formData.get('ctaTextEn') as string || null,
      ctaLink: formData.get('ctaLink') as string || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string) : null,
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : null,
    },
  });
  revalidatePath('/dashboard/website/hero');
  revalidatePath('/');
  redirect('/dashboard/website/hero');
}

export async function deleteHeroSlide(id: string) {
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath('/dashboard/website/hero');
  revalidatePath('/');
}
