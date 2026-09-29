'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';
import { requireAdminSession } from '@/lib/auth';

async function uploadImage(file: any): Promise<string | null> {
  if (!file || typeof file === 'string' || !file.arrayBuffer || typeof file.size !== 'number' || file.size === 0) return null;
  
  try {
    const rawExt = file.name ? file.name.split('.').pop() || 'png' : 'png';
    const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    
    const blob = await put(filename, file, { access: 'public' });
    return blob.url;
  } catch (err: any) {
    console.error('Image upload error:', err);
    throw new Error('Image upload failed');
  }
}

export async function createProduct(formData: FormData) {
  try {
    await requireAdminSession();

    const nameEn = (formData.get('nameEn') as string)?.trim();
    const nameAr = (formData.get('nameAr') as string)?.trim();
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

    const variantsJson = formData.get('variantsJson') as string;
    let parsedVariants: any[] = [];
    if (variantsJson) {
      try {
        parsedVariants = JSON.parse(variantsJson);
      } catch (e) {
        console.error('Failed to parse variantsJson', e);
      }
    }

    const validVariants = parsedVariants.filter(
      (v: any) => v && typeof v.nameAr === 'string' && v.nameAr.trim() !== '' && !isNaN(parseFloat(v.price))
    );

    const basePriceInput = parseFloat(formData.get('basePrice') as string) || 0;
    const basePrice = (basePriceInput === 0 && validVariants.length > 0)
      ? parseFloat(validVariants[0].price) || 0
      : basePriceInput;

    const data: any = {
      nameEn,
      nameAr,
      descriptionEn: (formData.get('descriptionEn') as string)?.trim() || null,
      descriptionAr: (formData.get('descriptionAr') as string)?.trim() || null,
      categoryId,
      basePrice,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      isBestseller: formData.get('isBestseller') === 'on',
      availability: (formData.get('availability') as string) || 'AVAILABLE',
      prepTime: formData.get('prepTime') ? parseInt(formData.get('prepTime') as string) : null,
      primaryImage,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      seoTitleEn: (formData.get('seoTitleEn') as string)?.trim() || null,
      seoTitleAr: (formData.get('seoTitleAr') as string)?.trim() || null,
      seoDescEn: (formData.get('seoDescEn') as string)?.trim() || null,
      seoDescAr: (formData.get('seoDescAr') as string)?.trim() || null,
      gallery: {
        create: uploadedGalleryPaths.map((image, index) => ({
          image,
          sortOrder: index
        }))
      }
    };

    if (validVariants.length > 0) {
      data.variants = {
        create: validVariants.map((v: any, index: number) => ({
          nameAr: v.nameAr.trim(),
          nameEn: (v.nameEn && v.nameEn.trim()) || v.nameAr.trim(),
          price: parseFloat(v.price) || 0,
          isDefault: index === 0 || !!v.isDefault,
          sortOrder: index
        }))
      };
    }

    await prisma.product.create({ data });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Create Product Error:', err);
    return { success: false, error: 'Database error occurred' };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await requireAdminSession();

    const nameEn = (formData.get('nameEn') as string)?.trim();
    const nameAr = (formData.get('nameAr') as string)?.trim();
    const categoryId = formData.get('categoryId') as string;
    
    if (!nameEn || !nameAr || !categoryId) {
      return { success: false, error: 'Name and Category are required.' };
    }

    const primaryImageFile = formData.get('primaryImage');
    const newPrimaryImage = await uploadImage(primaryImageFile);
    const removePrimary = formData.get('removePrimaryImage') === 'true';

    const variantsJson = formData.get('variantsJson') as string;
    let validVariants: any[] = [];
    let variantsProvided = false;

    if (variantsJson !== null && variantsJson !== undefined) {
      variantsProvided = true;
      try {
        const parsed = JSON.parse(variantsJson);
        if (Array.isArray(parsed)) {
          validVariants = parsed.filter(
            (v: any) => v && typeof v.nameAr === 'string' && v.nameAr.trim() !== '' && !isNaN(parseFloat(v.price))
          );
        }
      } catch (e) {
        console.error('Failed to parse variantsJson in updateProduct', e);
      }
    }

    const basePriceInput = parseFloat(formData.get('basePrice') as string) || 0;
    const basePrice = (basePriceInput === 0 && validVariants.length > 0)
      ? parseFloat(validVariants[0].price) || 0
      : basePriceInput;

    const data: any = {
      nameEn,
      nameAr,
      descriptionEn: (formData.get('descriptionEn') as string)?.trim() || null,
      descriptionAr: (formData.get('descriptionAr') as string)?.trim() || null,
      categoryId,
      basePrice,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      isBestseller: formData.get('isBestseller') === 'on',
      availability: (formData.get('availability') as string) || 'AVAILABLE',
      prepTime: formData.get('prepTime') ? parseInt(formData.get('prepTime') as string) : null,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      seoTitleEn: (formData.get('seoTitleEn') as string)?.trim() || null,
      seoTitleAr: (formData.get('seoTitleAr') as string)?.trim() || null,
      seoDescEn: (formData.get('seoDescEn') as string)?.trim() || null,
      seoDescAr: (formData.get('seoDescAr') as string)?.trim() || null,
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
    
    const deletedGalleryIdsStr = formData.get('deletedGalleryIds') as string;
    if (deletedGalleryIdsStr) {
      try {
        const deletedIds = JSON.parse(deletedGalleryIdsStr);
        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          await prisma.productGallery.deleteMany({
            where: { id: { in: deletedIds }, productId: id }
          });
        }
      } catch (e) {
        console.error("Failed to parse deletedGalleryIds", e);
      }
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

    if (variantsProvided) {
      await prisma.variant.deleteMany({ where: { productId: id } });
      if (validVariants.length > 0) {
        await prisma.variant.createMany({
          data: validVariants.map((v: any, index: number) => ({
            productId: id,
            nameAr: v.nameAr.trim(),
            nameEn: (v.nameEn && v.nameEn.trim()) || v.nameAr.trim(),
            price: parseFloat(v.price) || 0,
            isDefault: index === 0 || !!v.isDefault,
            sortOrder: index
          }))
        });
      }
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('Update Product Error:', err);
    return { success: false, error: 'Database error occurred' };
  }
}

export async function deleteGalleryImage(id: string, productId: string) {
  await requireAdminSession();
  await prisma.productGallery.delete({ where: { id } });
  revalidatePath('/', 'layout');
  redirect(`/dashboard/catalog/products/${productId}/edit`);
}

export async function deleteProduct(id: string) {
  await requireAdminSession();
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
  await requireAdminSession();
  await prisma.product.update({
    where: { id },
    data: { availability },
  });
  revalidatePath('/', 'layout');
}
