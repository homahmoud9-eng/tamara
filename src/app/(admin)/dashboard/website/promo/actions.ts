'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/upload';
import { requireAdminSession } from '@/lib/auth';

export async function getPromoSection() {
  try {
    let promo = await prisma.promoSection.findUnique({
      where: { id: '1' }
    });

    if (!promo) {
      promo = await prisma.promoSection.create({
        data: {
          id: '1',
          isEnabled: true,
          badgeTextAr: 'جديد تمارا',
          badgeTextEn: 'New from Tamara',
          titleAr: 'باقات توفير الغداء',
          titleEn: 'Lunch Saver Packages',
          descriptionAr: 'اشترك في باقات تمارا للغداء ووفر وقتك ومجهودك. أكل بيتي صحي ومتنوع بيوصلك كل يوم في ميعاد غداك، وبأسعار أقل بكتير من الطلبات اليومية.',
          descriptionEn: "Subscribe to Tamara's lunch packages and save time and effort. Healthy, varied homemade food delivered every day at your lunch break, at much lower prices than daily orders.",
          featuresAr: [
            'توفير يصل إلى ٢٠٪',
            'توصيل مجاني يومياً',
            'تغيير الوجبات براحتك',
            'توقيف مؤقت للاشتراك'
          ],
          featuresEn: [
            'Save up to 20%',
            'Free daily delivery',
            'Change meals easily',
            'Pause subscription anytime'
          ],
          buttonTextAr: 'شاهد الباقات',
          buttonTextEn: 'View Packages',
          buttonLink: '/packages',
          imageUrl: '/assets/images/tamara_package_lunch_saver.jpg',
          floatingBadgeTextAr: '20% توفير',
          floatingBadgeTextEn: '20% Off'
        }
      });
    }

    return promo;
  } catch (error) {
    console.error('Failed to get promo section:', error);
    return null;
  }
}

export async function savePromoSection(prevState: any, formData: FormData) {
  try {
    await requireAdminSession();

    const titleAr = (formData.get('titleAr') as string)?.trim();
    const titleEn = (formData.get('titleEn') as string)?.trim();
    if (!titleAr || !titleEn) {
      return { error: 'العنوان مطلوب باللغتين العربية والإنجليزية / Title is required in both Arabic and English' };
    }

    const badgeTextAr = (formData.get('badgeTextAr') as string)?.trim() || null;
    const badgeTextEn = (formData.get('badgeTextEn') as string)?.trim() || null;
    const descriptionAr = (formData.get('descriptionAr') as string)?.trim() || '';
    const descriptionEn = (formData.get('descriptionEn') as string)?.trim() || '';
    const buttonTextAr = (formData.get('buttonTextAr') as string)?.trim() || 'شاهد الباقات';
    const buttonTextEn = (formData.get('buttonTextEn') as string)?.trim() || 'View Packages';
    const buttonLink = (formData.get('buttonLink') as string)?.trim() || '/packages';
    const floatingBadgeTextAr = (formData.get('floatingBadgeTextAr') as string)?.trim() || null;
    const floatingBadgeTextEn = (formData.get('floatingBadgeTextEn') as string)?.trim() || null;
    const isEnabled = formData.get('isEnabled') === 'on' || formData.get('isEnabled') === 'true';

    // Parse features
    let featuresAr: string[] = [];
    let featuresEn: string[] = [];
    try {
      const rawAr = formData.get('featuresAr');
      if (typeof rawAr === 'string') {
        featuresAr = JSON.parse(rawAr);
      }
    } catch {
      featuresAr = [];
    }
    try {
      const rawEn = formData.get('featuresEn');
      if (typeof rawEn === 'string') {
        featuresEn = JSON.parse(rawEn);
      }
    } catch {
      featuresEn = [];
    }

    // Filter out empty strings
    featuresAr = featuresAr.map(f => f.trim()).filter(Boolean);
    featuresEn = featuresEn.map(f => f.trim()).filter(Boolean);

    // Handle Image
    const imageFile = formData.get('image');
    const removeImage = formData.get('removeImage') === 'true';
    let imageUrlToUpdate: string | undefined = undefined;

    if (imageFile && (imageFile as any).size > 0) {
      const uploaded = await uploadImage(imageFile, 'promo');
      if (uploaded) {
        imageUrlToUpdate = uploaded;
      }
    } else if (removeImage) {
      imageUrlToUpdate = '/assets/images/tamara_package_lunch_saver.jpg';
    }

    await prisma.promoSection.upsert({
      where: { id: '1' },
      create: {
        id: '1',
        isEnabled,
        badgeTextAr,
        badgeTextEn,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        featuresAr,
        featuresEn,
        buttonTextAr,
        buttonTextEn,
        buttonLink,
        imageUrl: imageUrlToUpdate || '/assets/images/tamara_package_lunch_saver.jpg',
        floatingBadgeTextAr,
        floatingBadgeTextEn,
      },
      update: {
        isEnabled,
        badgeTextAr,
        badgeTextEn,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        featuresAr,
        featuresEn,
        buttonTextAr,
        buttonTextEn,
        buttonLink,
        ...(imageUrlToUpdate !== undefined ? { imageUrl: imageUrlToUpdate } : {}),
        floatingBadgeTextAr,
        floatingBadgeTextEn,
      }
    });

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard/website/promo');

    return { 
      success: true, 
      message: 'تم حفظ إعدادات القسم الترويجي بنجاح' 
    };
  } catch (error: any) {
    console.error('Failed to save promo section:', error);
    return { error: error?.message || 'حدث خطأ أثناء الحفظ / Failed to save promo section' };
  }
}
