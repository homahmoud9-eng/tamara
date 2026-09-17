'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/upload';

export async function createOffer(prevState: any, formData: FormData) {
  try {
    const titleAr = formData.get('titleAr') as string;
    const titleEn = formData.get('titleEn') as string;
    if (!titleAr || !titleEn) {
      return { error: 'Titles are required' };
    }

    const minOrder = formData.get('minOrder') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    await prisma.offer.create({
      data: {
        titleAr,
        titleEn,
        descriptionAr: formData.get('descriptionAr') as string || null,
        descriptionEn: formData.get('descriptionEn') as string || null,
        discountType: formData.get('discountType') as string,
        discountValue: parseFloat(formData.get('discountValue') as string),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        image: await uploadImage(formData.get('image') as File | null),
        isActive: formData.get('isActive') === 'on',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });

  } catch (error) {
    return { error: 'Failed to create offer' };
  }
  
  revalidatePath('/', 'layout');
  redirect('/dashboard/marketing/offers');
}

export async function updateOffer(id: string, prevState: any, formData: FormData) {
  try {
    const titleAr = formData.get('titleAr') as string;
    const titleEn = formData.get('titleEn') as string;
    if (!titleAr || !titleEn) {
      return { error: 'Titles are required' };
    }

    const minOrder = formData.get('minOrder') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) return { error: 'Offer not found' };

    let image = existing.image;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      image = await uploadImage(file);
    }

    await prisma.offer.update({
      where: { id },
      data: {
        titleAr,
        titleEn,
        descriptionAr: formData.get('descriptionAr') as string || null,
        descriptionEn: formData.get('descriptionEn') as string || null,
        discountType: formData.get('discountType') as string,
        discountValue: parseFloat(formData.get('discountValue') as string),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        image,
        isActive: formData.get('isActive') === 'on',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });

  } catch (error) {
    return { error: 'Failed to update offer' };
  }
  
  revalidatePath('/', 'layout');
  redirect('/dashboard/marketing/offers');
}

export async function toggleOfferStatus(id: string, isActive: boolean) {
  await prisma.offer.update({
    where: { id },
    data: { isActive }
  });
  revalidatePath('/', 'layout');
}

export async function deleteOffer(id: string) {
  await prisma.offer.delete({ where: { id } });
  revalidatePath('/', 'layout');
}
