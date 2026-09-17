'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCoupon(prevState: any, formData: FormData) {
  try {
    const code = (formData.get('code') as string)?.toUpperCase().replace(/\s+/g, '');
    if (!code) {
      return { error: 'Coupon code is required' };
    }

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return { error: 'A coupon with this code already exists' };
    }

    const minOrder = formData.get('minOrder') as string;
    const maxDiscount = formData.get('maxDiscount') as string;
    const usageLimit = formData.get('usageLimit') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const startDate = formData.get('startDate') as string;

    await prisma.coupon.create({
      data: {
        code,
        discountType: formData.get('discountType') as string,
        discountValue: parseFloat(formData.get('discountValue') as string),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: formData.get('isActive') === 'on',
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      }
    });

  } catch (error) {
    return { error: 'Failed to create coupon' };
  }
  
  revalidatePath('/', 'layout');
  redirect('/dashboard/marketing/coupons');
}

export async function updateCoupon(id: string, prevState: any, formData: FormData) {
  try {
    const code = (formData.get('code') as string)?.toUpperCase().replace(/\s+/g, '');
    if (!code) {
      return { error: 'Coupon code is required' };
    }

    const existingCode = await prisma.coupon.findUnique({ where: { code } });
    if (existingCode && existingCode.id !== id) {
      return { error: 'A coupon with this code already exists' };
    }

    const minOrder = formData.get('minOrder') as string;
    const maxDiscount = formData.get('maxDiscount') as string;
    const usageLimit = formData.get('usageLimit') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const startDate = formData.get('startDate') as string;

    await prisma.coupon.update({
      where: { id },
      data: {
        code,
        discountType: formData.get('discountType') as string,
        discountValue: parseFloat(formData.get('discountValue') as string),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: formData.get('isActive') === 'on',
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      }
    });

  } catch (error) {
    return { error: 'Failed to update coupon' };
  }
  
  revalidatePath('/', 'layout');
  redirect('/dashboard/marketing/coupons');
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  await prisma.coupon.update({
    where: { id },
    data: { isActive }
  });
  revalidatePath('/', 'layout');
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath('/', 'layout');
}
