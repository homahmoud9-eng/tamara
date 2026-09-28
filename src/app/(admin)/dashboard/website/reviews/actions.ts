'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateReviewStatus(reviewId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: { status }
  });

  // If approved or rejected/reset, recalculate product rating & review count
  if (updatedReview) {
    const approvedReviews = await prisma.review.findMany({
      where: { productId: updatedReview.productId, status: 'APPROVED' }
    });
    const avg = approvedReviews.length 
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
      : 0;

    await prisma.product.update({
      where: { id: updatedReview.productId },
      data: {
        rating: parseFloat(avg.toFixed(1)),
        reviewCount: approvedReviews.length
      }
    });
  }

  revalidatePath('/dashboard/website/reviews');
  revalidatePath(`/product/${updatedReview.productId}`);
  revalidatePath('/');
}

export async function toggleFeaturedReview(reviewId: string, isFeatured: boolean) {
  await prisma.review.update({
    where: { id: reviewId },
    data: { isFeatured }
  });
  revalidatePath('/dashboard/website/reviews');
  revalidatePath('/');
}

export async function deleteReview(reviewId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return;

  await prisma.review.delete({
    where: { id: reviewId }
  });

  const approvedReviews = await prisma.review.findMany({
    where: { productId: review.productId, status: 'APPROVED' }
  });
  const avg = approvedReviews.length 
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
    : 0;

  await prisma.product.update({
    where: { id: review.productId },
    data: {
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: approvedReviews.length
    }
  });

  revalidatePath('/dashboard/website/reviews');
  revalidatePath(`/product/${review.productId}`);
  revalidatePath('/');
}
