'use server';

import prisma from '@/lib/prisma';

export async function validateCoupon(code: string, subtotal: number) {
  try {
    if (!code || typeof code !== 'string' || typeof subtotal !== 'number' || isNaN(subtotal) || subtotal < 0) {
      return { error: 'invalid' };
    }

    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      return { error: 'invalid' };
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode }
    });

    if (!coupon) {
      return { error: 'invalid' };
    }

    if (!coupon.isActive) {
      return { error: 'inactive' };
    }

    const now = new Date();
    if (coupon.expiryDate && coupon.expiryDate < now) {
      return { error: 'expired' };
    }

    if (coupon.startDate && coupon.startDate > now) {
      return { error: 'invalid' };
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { error: 'min_order', minOrder: coupon.minOrder };
    }

    // Calculate discount securely
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'FIXED') {
      discountAmount = coupon.discountValue;
    }

    // Never discount more than subtotal
    discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

    return {
      success: true,
      coupon: {
        code: coupon.code,
        discountAmount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    };
  } catch (error) {
    console.error('Validate coupon error:', error);
    return { error: 'server_error' };
  }
}
