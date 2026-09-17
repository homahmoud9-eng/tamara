'use server';

import prisma from '@/lib/prisma';

export async function validateCoupon(code: string, subtotal: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().replace(/\s+/g, '') }
    });

    if (!coupon) {
      return { error: 'invalid' }; // Invalid or not found
    }

    if (!coupon.isActive) {
      return { error: 'inactive' };
    }

    const now = new Date();
    if (coupon.expiryDate && coupon.expiryDate < now) {
      return { error: 'expired' };
    }

    if (coupon.startDate && coupon.startDate > now) {
      return { error: 'invalid' }; // Not started yet
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { error: 'min_order', minOrder: coupon.minOrder };
    }

    // TODO: usage limit check would require tracking usage, which might not be fully implemented yet.
    // If we have usage limits, we'd need to check total uses.
    // For now, if usageLimit exists, we just allow it unless we had a mechanism to count. 
    // Wait, the spec says "view usage" but we don't have an order<->coupon relationship established yet. We'll do that in Order Integration.

    // Calculate discount
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
    discountAmount = Math.min(discountAmount, subtotal);

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
