'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';

async function uploadImage(file: any, folder: string = 'media'): Promise<string | null> {
  if (!file || typeof file === 'string' || !file.arrayBuffer || typeof file.size !== 'number' || file.size === 0) return null;
  
  try {
    const ext = file.name ? file.name.split('.').pop() || 'png' : 'png';
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    
    const blob = await put(filename, file, { access: 'public' });
    return blob.url;
  } catch (err) {
    console.error('Image upload error:', err);
    return null;
  }
}

export async function createCategory(formData: FormData) {
  try {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    if (!nameEn || !nameAr) return { success: false, error: 'Category names are required.' };

    const slug = formData.get('slug') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const isActive = formData.get('isActive') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    
    const image = await uploadImage(formData.get('image'), 'categories');
    const titleImage = await uploadImage(formData.get('titleImage'), 'categories');

    await prisma.category.create({
      data: {
        nameEn,
        nameAr,
        slug: slug ? slug.trim() : (nameEn ? nameEn.trim().toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`),
        descriptionEn,
        descriptionAr,
        isActive,
        isFeatured,
        sortOrder,
        image,
        titleImage,
      }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Create Category Error:', err);
    return { success: false, error: err.message || 'Database error occurred' };
  }
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/', 'layout');
}

export async function createProduct(formData: FormData) {
  try {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const categoryId = formData.get('categoryId') as string;
    
    if (!nameEn || !nameAr || !categoryId) {
      return { success: false, error: 'Name and Category are required.' };
    }

    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    
    const basePrice = parseFloat(formData.get('basePrice') as string) || 0;
    const isActive = formData.get('isActive') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';
    const isBestseller = formData.get('isBestseller') === 'on';
    const availability = (formData.get('availability') as string) || 'AVAILABLE';
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    const prepTimeStr = formData.get('prepTime') as string;
    const prepTime = prepTimeStr ? parseInt(prepTimeStr) : null;
    
    const primaryImage = await uploadImage(formData.get('primaryImage'), 'products');

    // Handle gallery images
    const galleryImages = formData.getAll('galleryImages');
    const uploadedGalleryPaths: string[] = [];
    
    for (const file of galleryImages) {
      const path = await uploadImage(file, 'products');
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
        isBestseller,
        availability,
        sortOrder,
        prepTime,
        primaryImage,
        gallery: {
          create: uploadedGalleryPaths.map((image, index) => ({
            image,
            sortOrder: index
          }))
        }
      }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Create Product Error:', err);
    return { success: false, error: err.message || 'Database error occurred' };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    if (!nameEn || !nameAr) return { success: false, error: 'Category names are required.' };

    const slug = formData.get('slug') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const isActive = formData.get('isActive') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    
    const dataToUpdate: any = {
      nameEn, nameAr, slug: slug ? slug.trim() : undefined, descriptionEn, descriptionAr,
      isActive, isFeatured, sortOrder,
    };

    const removeImage = formData.get('removeImage') === 'true';
    const newImage = await uploadImage(formData.get('image'), 'categories');

    if (removeImage) {
      dataToUpdate.image = null;
    } else if (newImage) {
      dataToUpdate.image = newImage;
    }

    const removeTitleImage = formData.get('removeTitleImage') === 'true';
    const newTitleImage = await uploadImage(formData.get('titleImage'), 'categories');

    if (removeTitleImage) {
      dataToUpdate.titleImage = null;
    } else if (newTitleImage) {
      dataToUpdate.titleImage = newTitleImage;
    }

    await prisma.category.update({
      where: { id },
      data: dataToUpdate
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Update Category Error:', err);
    return { success: false, error: err.message || 'Database error occurred' };
  }
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/', 'layout');
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const nameEn = formData.get('nameEn') as string;
    const nameAr = formData.get('nameAr') as string;
    const categoryId = formData.get('categoryId') as string;
    
    if (!nameEn || !nameAr || !categoryId) {
      return { success: false, error: 'Name and Category are required.' };
    }

    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    
    const basePrice = parseFloat(formData.get('basePrice') as string) || 0;
    const isActive = formData.get('isActive') === 'on';
    const isFeatured = formData.get('isFeatured') === 'on';
    const isBestseller = formData.get('isBestseller') === 'on';
    const availability = (formData.get('availability') as string) || 'AVAILABLE';
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
    const prepTimeStr = formData.get('prepTime') as string;
    const prepTime = prepTimeStr ? parseInt(prepTimeStr) : null;
    
    const newPrimaryImage = await uploadImage(formData.get('primaryImage'), 'products');

    const dataToUpdate: any = {
      nameEn, nameAr, descriptionEn, descriptionAr, categoryId,
      basePrice, isActive, isFeatured, isBestseller, availability, sortOrder, prepTime
    };

    if (newPrimaryImage) {
      dataToUpdate.primaryImage = newPrimaryImage;
    }

    // Handle new gallery images
    const galleryImages = formData.getAll('galleryImages');
    const uploadedGalleryPaths: string[] = [];
    
    for (const file of galleryImages) {
      const path = await uploadImage(file, 'products');
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

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Update Product Error:', err);
    return { success: false, error: err.message || 'Database error occurred' };
  }
}
