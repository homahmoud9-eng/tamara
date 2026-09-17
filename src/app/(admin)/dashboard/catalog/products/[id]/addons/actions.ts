'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveAddonGroup(productId: string, groupId: string | null, data: any) {
  if (groupId) {
    await prisma.addonGroup.update({
      where: { id: groupId },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        isRequired: data.isRequired,
        minSelect: data.minSelect,
        maxSelect: data.maxSelect,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      }
    });
  } else {
    await prisma.addonGroup.create({
      data: {
        productId,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        isRequired: data.isRequired,
        minSelect: data.minSelect,
        maxSelect: data.maxSelect,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      }
    });
  }
  revalidatePath('/', 'layout');
}

export async function deleteAddonGroup(groupId: string) {
  await prisma.addonGroup.delete({ where: { id: groupId } });
  revalidatePath('/', 'layout');
}

export async function saveAddon(groupId: string, addonId: string | null, data: any) {
  if (addonId) {
    await prisma.addon.update({
      where: { id: addonId },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        price: data.price,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      }
    });
  } else {
    await prisma.addon.create({
      data: {
        groupId,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        price: data.price,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      }
    });
  }
  revalidatePath('/', 'layout');
}

export async function deleteAddon(addonId: string) {
  await prisma.addon.delete({ where: { id: addonId } });
  revalidatePath('/', 'layout');
}
