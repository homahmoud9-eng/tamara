'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData) {
  await prisma.category.create({
    data: {
      nameEn: formData.get('nameEn') as string,
      nameAr: formData.get('nameAr') as string,
      slug: (formData.get('slug') as string) || (formData.get('nameEn') as string).toLowerCase().replace(/\s+/g, '-'),
      descriptionEn: formData.get('descriptionEn') as string || null,
      descriptionAr: formData.get('descriptionAr') as string || null,
      image: formData.get('image') as string || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
    },
  });
  revalidatePath('/dashboard/catalog/categories');
  revalidatePath('/menu');
  redirect('/dashboard/catalog/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  await prisma.category.update({
    where: { id },
    data: {
      nameEn: formData.get('nameEn') as string,
      nameAr: formData.get('nameAr') as string,
      slug: formData.get('slug') as string,
      descriptionEn: formData.get('descriptionEn') as string || null,
      descriptionAr: formData.get('descriptionAr') as string || null,
      image: formData.get('image') as string || null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
    },
  });
  revalidatePath('/dashboard/catalog/categories');
  revalidatePath('/menu');
  redirect('/dashboard/catalog/categories');
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/dashboard/catalog/categories');
  revalidatePath('/menu');
}
