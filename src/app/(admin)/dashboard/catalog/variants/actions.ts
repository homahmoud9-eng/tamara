'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { uploadImage } from '@/lib/upload';

export async function createVariant(formData: FormData) {
  const imageFile = formData.get('image') as File | null;
  const image = await uploadImage(imageFile);
  await prisma.variant.create({
    data: {
      productId: formData.get('productId') as string,
      nameEn: formData.get('nameEn') as string,
      nameAr: formData.get('nameAr') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      image: image,
      servingDescEn: formData.get('servingDescEn') as string || null,
      servingDescAr: formData.get('servingDescAr') as string || null,
      isDefault: formData.get('isDefault') === 'on',
      isActive: formData.get('isActive') === 'on',
      availability: (formData.get('availability') as string) || 'AVAILABLE',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    },
  });
  revalidatePath('/dashboard/catalog/variants');
  revalidatePath('/menu');
  redirect('/dashboard/catalog/variants');
}

export async function updateVariant(id: string, formData: FormData) {
  const dataToUpdate: any = {
      productId: formData.get('productId') as string,
      nameEn: formData.get('nameEn') as string,
      nameAr: formData.get('nameAr') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      servingDescEn: formData.get('servingDescEn') as string || null,
      servingDescAr: formData.get('servingDescAr') as string || null,
      isDefault: formData.get('isDefault') === 'on',
      isActive: formData.get('isActive') === 'on',
      availability: (formData.get('availability') as string) || 'AVAILABLE',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
  };

  const removeImage = formData.get('removeImage') === 'true';
  const imageFile = formData.get('image') as File | null;
  const newImage = await uploadImage(imageFile);

  if (removeImage) {
    dataToUpdate.image = null;
  } else if (newImage) {
    dataToUpdate.image = newImage;
  }

  await prisma.variant.update({
    where: { id },
    data: dataToUpdate,
  });
  revalidatePath('/dashboard/catalog/variants');
  revalidatePath('/menu');
  redirect('/dashboard/catalog/variants');
}

export async function deleteVariant(id: string) {
  await prisma.variant.delete({ where: { id } });
  revalidatePath('/dashboard/catalog/variants');
  revalidatePath('/menu');
}
