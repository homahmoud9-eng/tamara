'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createAddonGroup(formData: FormData) {
  const group = await prisma.addonGroup.create({
    data: {
      productId: formData.get('productId') as string,
      nameEn: formData.get('nameEn') as string,
      nameAr: formData.get('nameAr') as string,
      isRequired: formData.get('isRequired') === 'on',
      minSelect: parseInt(formData.get('minSelect') as string) || 0,
      maxSelect: parseInt(formData.get('maxSelect') as string) || 1,
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    },
  });

  // Create addons if any were provided
  const addonNames = formData.getAll('addonNameEn');
  for (let i = 0; i < addonNames.length; i++) {
    const nameEn = formData.getAll('addonNameEn')[i] as string;
    const nameAr = formData.getAll('addonNameAr')[i] as string;
    const price = parseFloat(formData.getAll('addonPrice')[i] as string) || 0;
    if (nameEn) {
      await prisma.addon.create({
        data: { groupId: group.id, nameEn, nameAr, price, sortOrder: i },
      });
    }
  }

  revalidatePath('/dashboard/catalog/addons');
  redirect('/dashboard/catalog/addons');
}

export async function deleteAddonGroup(id: string) {
  await prisma.addonGroup.delete({ where: { id } });
  revalidatePath('/dashboard/catalog/addons');
}

export async function deleteAddon(id: string) {
  await prisma.addon.delete({ where: { id } });
  revalidatePath('/dashboard/catalog/addons');
}
