'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleBlogPost(id: string, isEnabled: boolean) {
  try {
    await prisma.blogPost.update({
      where: { id },
      data: { isActive: isEnabled },
    });
    revalidatePath('/', 'layout');
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Failed to toggle blog post:', error);
    throw new Error('Failed to toggle blog post');
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });
    revalidatePath('/', 'layout');
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    throw new Error('Failed to delete blog post');
  }
}
