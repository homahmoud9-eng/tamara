'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth';

export async function createAddonGroup(formData: FormData) {
  await requireAdminSession();

  const group = await prisma.addonGroup.create({
    data: {
      productId: formData.get('productId') as string,
      nameEn: (formData.get('nameEn') as string)?.trim() || '',
      nameAr: (formData.get('nameAr') as string)?.trim() || '',
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
    const nameEn = (formData.getAll('addonNameEn')[i] as string)?.trim();
    const nameAr = (formData.getAll('addonNameAr')[i] as string)?.trim();
    const price = parseFloat(formData.getAll('addonPrice')[i] as string) || 0;
    if (nameEn) {
      await prisma.addon.create({
        data: { groupId: group.id, nameEn, nameAr, price, sortOrder: i },
      });
    }
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard/catalog/addons');
}

export async function deleteAddonGroup(id: string) {
  await requireAdminSession();
  await prisma.addonGroup.delete({ where: { id } });
  revalidatePath('/', 'layout');
}

export async function deleteAddon(id: string) {
  await requireAdminSession();
  await prisma.addon.delete({ where: { id } });
  revalidatePath('/', 'layout');
}
