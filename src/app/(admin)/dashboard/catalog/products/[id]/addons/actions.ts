'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth';

export async function saveAddonGroup(productId: string, groupId: string | null, data: any) {
  await requireAdminSession();

  if (groupId) {
    await prisma.addonGroup.update({
      where: { id: groupId },
      data: {
        nameAr: data.nameAr?.trim() || '',
        nameEn: data.nameEn?.trim() || '',
        isRequired: !!data.isRequired,
        minSelect: parseInt(data.minSelect) || 0,
        maxSelect: parseInt(data.maxSelect) || 1,
        sortOrder: parseInt(data.sortOrder) || 0,
        isActive: !!data.isActive,
      }
    });
  } else {
    await prisma.addonGroup.create({
      data: {
        productId,
        nameAr: data.nameAr?.trim() || '',
        nameEn: data.nameEn?.trim() || '',
        isRequired: !!data.isRequired,
        minSelect: parseInt(data.minSelect) || 0,
        maxSelect: parseInt(data.maxSelect) || 1,
        sortOrder: parseInt(data.sortOrder) || 0,
        isActive: !!data.isActive,
      }
    });
  }
  revalidatePath('/', 'layout');
}

export async function deleteAddonGroup(groupId: string) {
  await requireAdminSession();
  await prisma.addonGroup.delete({ where: { id: groupId } });
  revalidatePath('/', 'layout');
}

export async function saveAddon(groupId: string, addonId: string | null, data: any) {
  await requireAdminSession();

  if (addonId) {
    await prisma.addon.update({
      where: { id: addonId },
      data: {
        nameAr: data.nameAr?.trim() || '',
        nameEn: data.nameEn?.trim() || '',
        price: parseFloat(data.price) || 0,
        sortOrder: parseInt(data.sortOrder) || 0,
        isActive: !!data.isActive,
      }
    });
  } else {
    await prisma.addon.create({
      data: {
        groupId,
        nameAr: data.nameAr?.trim() || '',
        nameEn: data.nameEn?.trim() || '',
        price: parseFloat(data.price) || 0,
        sortOrder: parseInt(data.sortOrder) || 0,
        isActive: !!data.isActive,
      }
    });
  }
  revalidatePath('/', 'layout');
}

export async function deleteAddon(addonId: string) {
  await requireAdminSession();
  await prisma.addon.delete({ where: { id: addonId } });
  revalidatePath('/', 'layout');
}
