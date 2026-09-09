'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile } from 'fs/promises';
import path from 'path';

async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const ext = file.name.split('.').pop() || 'png';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const filepath = path.join(process.cwd(), 'public/uploads/products', filename);
  
  await writeFile(filepath, buffer);
  return `/uploads/products/${filename}`;
}

export async function createCategory(formData: FormData) {
  const nameEn = formData.get('nameEn') as string;
  const nameAr = formData.get('nameAr') as string;
  const slug = formData.get('slug') as string;
  const descriptionEn = formData.get('descriptionEn') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const isActive = formData.get('isActive') === 'on';
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  
  const imageFile = formData.get('image') as File | null;
  const image = await uploadImage(imageFile);

  const titleImageFile = formData.get('titleImage') as File | null;
  const titleImage = await uploadImage(titleImageFile);

  await prisma.category.create({
    data: {
      nameEn,
      nameAr,
      slug: slug || undefined, // use undefined if empty to let it auto-generate or something, wait Prisma expects string if slug is req.
      descriptionEn,
      descriptionAr,
      isActive,
      sortOrder,
      image,
      titleImage,
    }
  });

  revalidatePath('/dashboard/catalog');
  redirect('/dashboard/catalog?tab=categories');
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/dashboard/catalog');
}

export async function createProduct(formData: FormData) {
  const nameEn = formData.get('nameEn') as string;
  const nameAr = formData.get('nameAr') as string;

  const descriptionEn = formData.get('descriptionEn') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const categoryId = formData.get('categoryId') as string;
  
  const basePrice = parseFloat(formData.get('basePrice') as string) || 0;
  const isActive = formData.get('isActive') === 'on';
  const isFeatured = formData.get('isFeatured') === 'on';
  
  const primaryImageFile = formData.get('primaryImage') as File | null;
  const primaryImage = await uploadImage(primaryImageFile);

  // Handle gallery images
  const galleryImages = formData.getAll('galleryImages') as File[];
  const uploadedGalleryPaths: string[] = [];
  
  for (const file of galleryImages) {
    const path = await uploadImage(file);
    if (path) uploadedGalleryPaths.push(path);
  }

  await prisma.product.create({
    data: {
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      categoryId,
      basePrice,
      isActive,
      isFeatured,
      primaryImage,
      gallery: {
        create: uploadedGalleryPaths.map((image, index) => ({
          image,
          sortOrder: index
        }))
      }
    }
  });

  revalidatePath('/dashboard/catalog');
  redirect('/dashboard/catalog?tab=products');
}

export async function updateCategory(id: string, formData: FormData) {
  const nameEn = formData.get('nameEn') as string;
  const nameAr = formData.get('nameAr') as string;
  const slug = formData.get('slug') as string;
  const descriptionEn = formData.get('descriptionEn') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const isActive = formData.get('isActive') === 'on';
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  
  const dataToUpdate: any = {
    nameEn, nameAr, slug: slug || undefined, descriptionEn, descriptionAr,
    isActive, sortOrder,
  };

  const removeImage = formData.get('removeImage') === 'true';
  const imageFile = formData.get('image') as File | null;
  const newImage = await uploadImage(imageFile);

  if (removeImage) {
    dataToUpdate.image = null;
  } else if (newImage) {
    dataToUpdate.image = newImage;
  }

  const removeTitleImage = formData.get('removeTitleImage') === 'true';
  const titleImageFile = formData.get('titleImage') as File | null;
  const newTitleImage = await uploadImage(titleImageFile);

  if (removeTitleImage) {
    dataToUpdate.titleImage = null;
  } else if (newTitleImage) {
    dataToUpdate.titleImage = newTitleImage;
  }

  await prisma.category.update({
    where: { id },
    data: dataToUpdate
  });

  revalidatePath('/dashboard/catalog');
  redirect('/dashboard/catalog?tab=categories');
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/dashboard/catalog');
}

export async function updateProduct(id: string, formData: FormData) {
  const nameEn = formData.get('nameEn') as string;
  const nameAr = formData.get('nameAr') as string;

  const descriptionEn = formData.get('descriptionEn') as string;
  const descriptionAr = formData.get('descriptionAr') as string;
  const categoryId = formData.get('categoryId') as string;
  
  const basePrice = parseFloat(formData.get('basePrice') as string) || 0;
  const isActive = formData.get('isActive') === 'on';
  const isFeatured = formData.get('isFeatured') === 'on';
  
  const primaryImageFile = formData.get('primaryImage') as File | null;
  const newPrimaryImage = await uploadImage(primaryImageFile);

  const dataToUpdate: any = {
    nameEn, nameAr, descriptionEn, descriptionAr, categoryId,
    basePrice, isActive, isFeatured,
  };

  if (newPrimaryImage) {
    dataToUpdate.primaryImage = newPrimaryImage;
  }

  // Handle new gallery images
  const galleryImages = formData.getAll('galleryImages') as File[];
  const uploadedGalleryPaths: string[] = [];
  
  for (const file of galleryImages) {
    const path = await uploadImage(file);
    if (path) uploadedGalleryPaths.push(path);
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...dataToUpdate,
      ...(uploadedGalleryPaths.length > 0 && {
        gallery: {
          create: uploadedGalleryPaths.map((image, index) => ({
            image,
            sortOrder: index // You might want to get the max sortOrder first in a real app
          }))
        }
      })
    }
  });

  revalidatePath('/dashboard/catalog');
  redirect('/dashboard/catalog?tab=products');
}
