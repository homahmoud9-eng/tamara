'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile } from 'fs/promises';
import path from 'path';

async function uploadImage(file: any): Promise<string | null> {
  if (!file || typeof file === 'string' || !file.arrayBuffer || typeof file.size !== 'number' || file.size === 0) return null;
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const ext = file.name ? file.name.split('.').pop() || 'png' : 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filepath = path.join(process.cwd(), 'public/uploads/products', filename);
    
    await writeFile(filepath, buffer);
    return `/uploads/products/${filename}`;
  } catch (err) {
    console.error('Image upload error:', err);
    return null;
  }
}

export async function createProduct(formData: FormData) {
  try {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const categoryId = formData.get('categoryId') as string;
    
    if (!nameEn || !nameAr || !categoryId) {
      return { success: false, error: 'Name and Category are required.' };
    }

    const primaryImage = await uploadImage(formData.get('primaryImage'));
    
    const galleryImages = formData.getAll('galleryImages');
    const uploadedGalleryPaths: string[] = [];
    for (const file of galleryImages) {
      const p = await uploadImage(file);
      if (p) uploadedGalleryPaths.push(p);
    }

    const data = {
      nameEn,
      nameAr,
      descriptionEn: formData.get('descriptionEn') as string || null,
      descriptionAr: formData.get('descriptionAr') as string || null,
      categoryId,
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
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Create Product Error:', err);
    return { success: false, error: err.message || 'Database error occurred' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const categoryId = formData.get('categoryId') as string;
    
    if (!nameEn || !nameAr || !categoryId) {
      return { success: false, error: 'Name and Category are required.' };
    }

    const newPrimaryImage = await uploadImage(formData.get('primaryImage'));
    const removePrimary = formData.get('removePrimaryImage') === 'true';

    const data: any = {
      nameEn,
      nameAr,
      descriptionEn: formData.get('descriptionEn') as string || null,
      descriptionAr: formData.get('descriptionAr') as string || null,
      categoryId,
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

    const galleryImages = formData.getAll('galleryImages');
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
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Update Product Error:', err);
    return { success: false, error: err.message || 'Database error occurred' };
  }
}

export async function deleteGalleryImage(id: string, productId: string) {
  await prisma.productGallery.delete({ where: { id } });
  revalidatePath('/', 'layout');
  revalidatePath('/', 'layout');
  redirect(`/dashboard/catalog/products/${productId}/edit`);
}

export async function deleteProduct(id: string) {
  const [orderItems, packageItems, reviews] = await Promise.all([
    prisma.orderItem.findFirst({ where: { productId: id } }),
    prisma.packageItem.findFirst({ where: { productId: id } }),
    prisma.review.findFirst({ where: { productId: id } })
  ]);

  if (orderItems || packageItems || reviews) {
    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { isActive: false, availability: 'OUT_OF_STOCK' }
    });
  } else {
    // Hard delete
    await prisma.product.delete({ where: { id } });
  }

  revalidatePath('/', 'layout');
}

export async function toggleProductAvailability(id: string, availability: string) {
  await prisma.product.update({
    where: { id },
    data: { availability },
  });
  revalidatePath('/', 'layout');
  revalidatePath('/', 'layout');
}
