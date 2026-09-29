'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth';

export async function toggleSection(id: string, isEnabled: boolean) {
  await requireAdminSession();
  await prisma.homepageSection.update({
    where: { id },
    data: { isEnabled },
  });
  revalidatePath('/', 'layout');
}

export async function deleteSection(id: string) {
  await requireAdminSession();
  await prisma.homepageSection.delete({ where: { id } });
  revalidatePath('/', 'layout');
}

export async function createSection(formData: FormData) {
  await requireAdminSession();
  await prisma.homepageSection.create({
    data: {
      type: (formData.get('type') as string)?.trim() || '',
      isEnabled: formData.get('isEnabled') === 'on',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      titleAr: (formData.get('titleAr') as string)?.trim() || null,
      titleEn: (formData.get('titleEn') as string)?.trim() || null,
      subtitleAr: (formData.get('subtitleAr') as string)?.trim() || null,
      subtitleEn: (formData.get('subtitleEn') as string)?.trim() || null,
      ctaTextAr: (formData.get('ctaTextAr') as string)?.trim() || null,
      ctaTextEn: (formData.get('ctaTextEn') as string)?.trim() || null,
      ctaLink: (formData.get('ctaLink') as string)?.trim() || null,
      image: (formData.get('image') as string)?.trim() || null,
      displayLimit: parseInt(formData.get('displayLimit') as string) || 6,
    },
  });
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/homepage');
}

export async function updateSection(id: string, formData: FormData) {
  await requireAdminSession();
  await prisma.homepageSection.update({
    where: { id },
    data: {
      type: (formData.get('type') as string)?.trim() || '',
      isEnabled: formData.get('isEnabled') === 'on',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      titleAr: (formData.get('titleAr') as string)?.trim() || null,
      titleEn: (formData.get('titleEn') as string)?.trim() || null,
      subtitleAr: (formData.get('subtitleAr') as string)?.trim() || null,
      subtitleEn: (formData.get('subtitleEn') as string)?.trim() || null,
      ctaTextAr: (formData.get('ctaTextAr') as string)?.trim() || null,
      ctaTextEn: (formData.get('ctaTextEn') as string)?.trim() || null,
      ctaLink: (formData.get('ctaLink') as string)?.trim() || null,
      image: (formData.get('image') as string)?.trim() || null,
      displayLimit: parseInt(formData.get('displayLimit') as string) || 6,
    },
  });
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/homepage');
}
