'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile } from 'fs/promises';
import path from 'path';

async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0 || !file.name) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const ext = file.name.split('.').pop() || 'png';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const filepath = path.join(process.cwd(), 'public/uploads/products', filename);
  
  await writeFile(filepath, buffer);
  return `/uploads/products/${filename}`;
}

export async function createProduct(formData: FormData) {
  const primaryImageFile = formData.get('primaryImage') as File | null;
  const primaryImage = await uploadImage(primaryImageFile);
  
  const galleryImages = formData.getAll('galleryImages') as File[];
  const uploadedGalleryPaths: string[] = [];
  for (const file of galleryImages) {
    const p = await uploadImage(file);
    if (p) uploadedGalleryPaths.push(p);
  }

  const data = {
    nameEn: formData.get('nameEn') as string,
    nameAr: formData.get('nameAr') as string,
    descriptionEn: formData.get('descriptionEn') as string || null,
    descriptionAr: formData.get('descriptionAr') as string || null,
    categoryId: formData.get('categoryId') as string,
    basePrice: parseFloat(formData.get('basePrice') as string) || 0,
    isActive: formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'on',
    isBestseller: formData.get('isBestseller') === 'on',
    availability: (formData.get('availability') as string) || 'AVAILABLE',
    prepTime: formData.get('prepTime') ? parseInt(formData.get('prepTime') as string) : null,
    primaryImage,
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    seoTitleEn: formData.get('seoTitleEn') as string || null,
    seoTitleAr: formData.get('seoTitleAr') as string || null,
    seoDescEn: formData.get('seoDescEn') as string || null,
    seoDescAr: formData.get('seoDescAr') as string || null,
    gallery: {
      create: uploadedGalleryPaths.map((image, index) => ({
        image,
        sortOrder: index
      }))
    }
  };

  await prisma.product.create({ data });
  revalidatePath('/dashboard/catalog/products');
  revalidatePath('/menu');
  redirect('/dashboard/catalog/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const primaryImageFile = formData.get('primaryImage') as File | null;
  const newPrimaryImage = await uploadImage(primaryImageFile);

  const removePrimary = formData.get('removePrimaryImage') === 'true';

  const data: any = {
    nameEn: formData.get('nameEn') as string,
    nameAr: formData.get('nameAr') as string,
    descriptionEn: formData.get('descriptionEn') as string || null,
    descriptionAr: formData.get('descriptionAr') as string || null,
    categoryId: formData.get('categoryId') as string,
    basePrice: parseFloat(formData.get('basePrice') as string) || 0,
    isActive: formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'on',
    isBestseller: formData.get('isBestseller') === 'on',
    availability: (formData.get('availability') as string) || 'AVAILABLE',
    prepTime: formData.get('prepTime') ? parseInt(formData.get('prepTime') as string) : null,
    sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    seoTitleEn: formData.get('seoTitleEn') as string || null,
    seoTitleAr: formData.get('seoTitleAr') as string || null,
    seoDescEn: formData.get('seoDescEn') as string || null,
    seoDescAr: formData.get('seoDescAr') as string || null,
  };

  if (newPrimaryImage) {
    data.primaryImage = newPrimaryImage;
  } else if (removePrimary) {
    data.primaryImage = null;
  }

  const galleryImages = formData.getAll('galleryImages') as File[];
  const uploadedGalleryPaths: string[] = [];
  for (const file of galleryImages) {
    const p = await uploadImage(file);
    if (p) uploadedGalleryPaths.push(p);
  }

  if (uploadedGalleryPaths.length > 0) {
    data.gallery = {
      create: uploadedGalleryPaths.map((image, index) => ({
        image,
        sortOrder: index
      }))
    };
  }

  await prisma.product.update({ where: { id }, data });
  revalidatePath('/dashboard/catalog/products');
  revalidatePath('/menu');
  redirect('/dashboard/catalog/products');
}

export async function deleteGalleryImage(id: string, productId: string) {
  await prisma.productGallery.delete({ where: { id } });
  revalidatePath('/dashboard/catalog/products');
  revalidatePath('/menu');
  redirect(`/dashboard/catalog/products/${productId}/edit`);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/dashboard/catalog/products');
  revalidatePath('/menu');
}

export async function toggleProductAvailability(id: string, availability: string) {
  await prisma.product.update({
    where: { id },
    data: { availability },
  });
  revalidatePath('/dashboard/catalog/products');
  revalidatePath('/menu');
}
