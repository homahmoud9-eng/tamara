'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/upload';
import { requireAdminSession } from '@/lib/auth';

export async function createOffer(prevState: any, formData: FormData) {
  try {
    await requireAdminSession();

    const titleAr = (formData.get('titleAr') as string)?.trim();
    const titleEn = (formData.get('titleEn') as string)?.trim();
    if (!titleAr || !titleEn) {
      return { error: 'Titles are required' };
    }

    const minOrder = formData.get('minOrder') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const imageFile = formData.get('image');

    const imageUrl = await uploadImage(imageFile, 'offers');

    await prisma.offer.create({
      data: {
        titleAr,
        titleEn,
        descriptionAr: (formData.get('descriptionAr') as string)?.trim() || null,
        descriptionEn: (formData.get('descriptionEn') as string)?.trim() || null,
        discountType: (formData.get('discountType') as string) || 'PERCENTAGE',
        discountValue: parseFloat(formData.get('discountValue') as string) || 0,
        minOrder: minOrder ? parseFloat(minOrder) : null,
        image: imageUrl,
        isActive: formData.get('isActive') === 'on',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });

  } catch (error) {
    console.error('Failed to create offer:', error);
    return { error: 'Failed to create offer' };
  }
  
  revalidatePath('/', 'layout');
  revalidatePath('/offers');
  redirect('/dashboard/marketing/offers');
}

export async function updateOffer(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdminSession();

    const titleAr = (formData.get('titleAr') as string)?.trim();
    const titleEn = (formData.get('titleEn') as string)?.trim();
    if (!titleAr || !titleEn) {
      return { error: 'Titles are required' };
    }

    const minOrder = formData.get('minOrder') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    const existing = await prisma.offer.findUnique({ where: { id } });
    if (!existing) return { error: 'Offer not found' };

    let image = existing.image;
    const removeImage = formData.get('removeImage') === 'true';

    if (removeImage) {
      image = null;
    } else {
      const file = formData.get('image');
      if (file && typeof file !== 'string' && (file as any).size > 0) {
        const uploaded = await uploadImage(file, 'offers');
        if (uploaded) {
          image = uploaded;
        }
      }
    }

    await prisma.offer.update({
      where: { id },
      data: {
        titleAr,
        titleEn,
        descriptionAr: (formData.get('descriptionAr') as string)?.trim() || null,
        descriptionEn: (formData.get('descriptionEn') as string)?.trim() || null,
        discountType: (formData.get('discountType') as string) || 'PERCENTAGE',
        discountValue: parseFloat(formData.get('discountValue') as string) || 0,
        minOrder: minOrder ? parseFloat(minOrder) : null,
        image,
        isActive: formData.get('isActive') === 'on',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });

  } catch (error) {
    console.error('Failed to update offer:', error);
    return { error: 'Failed to update offer' };
  }
  
  revalidatePath('/', 'layout');
  revalidatePath('/offers');
  redirect('/dashboard/marketing/offers');
}

export async function toggleOfferStatus(id: string, isActive: boolean) {
  await requireAdminSession();
  await prisma.offer.update({
    where: { id },
    data: { isActive }
  });
  revalidatePath('/', 'layout');
  revalidatePath('/offers');
}

export async function deleteOffer(id: string) {
  await requireAdminSession();
  await prisma.offer.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidatePath('/offers');
}
