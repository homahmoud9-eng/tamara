'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function toggleSection(id: string, isEnabled: boolean) {
  await prisma.homepageSection.update({
    where: { id },
    data: { isEnabled },
  });
  revalidatePath('/dashboard/website/homepage');
  revalidatePath('/');
}

export async function deleteSection(id: string) {
  await prisma.homepageSection.delete({ where: { id } });
  revalidatePath('/dashboard/website/homepage');
  revalidatePath('/');
}

export async function createSection(formData: FormData) {
  await prisma.homepageSection.create({
    data: {
      type: formData.get('type') as string,
      isEnabled: formData.get('isEnabled') === 'on',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      titleAr: formData.get('titleAr') as string || null,
      titleEn: formData.get('titleEn') as string || null,
      subtitleAr: formData.get('subtitleAr') as string || null,
      subtitleEn: formData.get('subtitleEn') as string || null,
      ctaTextAr: formData.get('ctaTextAr') as string || null,
      ctaTextEn: formData.get('ctaTextEn') as string || null,
      ctaLink: formData.get('ctaLink') as string || null,
      image: formData.get('image') as string || null,
      displayLimit: parseInt(formData.get('displayLimit') as string) || 6,
    },
  });
  revalidatePath('/dashboard/website/homepage');
  revalidatePath('/');
  redirect('/dashboard/website/homepage');
}

export async function updateSection(id: string, formData: FormData) {
  await prisma.homepageSection.update({
    where: { id },
    data: {
      type: formData.get('type') as string,
      isEnabled: formData.get('isEnabled') === 'on',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      titleAr: formData.get('titleAr') as string || null,
      titleEn: formData.get('titleEn') as string || null,
      subtitleAr: formData.get('subtitleAr') as string || null,
      subtitleEn: formData.get('subtitleEn') as string || null,
      ctaTextAr: formData.get('ctaTextAr') as string || null,
      ctaTextEn: formData.get('ctaTextEn') as string || null,
      ctaLink: formData.get('ctaLink') as string || null,
      image: formData.get('image') as string || null,
      displayLimit: parseInt(formData.get('displayLimit') as string) || 6,
    },
  });
  revalidatePath('/dashboard/website/homepage');
  revalidatePath('/');
  redirect('/dashboard/website/homepage');
}
