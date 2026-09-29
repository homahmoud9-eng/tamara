'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth';

export async function createBlogPost(formData: FormData) {
  await requireAdminSession();
  const isActive = formData.get('status') === 'PUBLISHED';
  
  await prisma.blogPost.create({
    data: {
      titleAr: (formData.get('titleAr') as string)?.trim() || '',
      titleEn: (formData.get('titleEn') as string)?.trim() || null,
      slug: (formData.get('slug') as string)?.trim() || (formData.get('titleEn') as string)?.trim().toLowerCase().replace(/\s+/g, '-'),
      contentAr: (formData.get('contentAr') as string)?.trim() || '',
      contentEn: (formData.get('contentEn') as string)?.trim() || null,
      excerptAr: (formData.get('excerptAr') as string)?.trim() || null,
      excerptEn: (formData.get('excerptEn') as string)?.trim() || null,
      image: (formData.get('image') as string)?.trim() || null,
      author: (formData.get('author') as string)?.trim() || 'Tamara Kitchen',
      isActive,
      seoTitleAr: (formData.get('seoTitleAr') as string)?.trim() || null,
      seoTitleEn: (formData.get('seoTitleEn') as string)?.trim() || null,
      seoDescAr: (formData.get('seoDescAr') as string)?.trim() || null,
      seoDescEn: (formData.get('seoDescEn') as string)?.trim() || null,
    },
  });

  revalidatePath('/blog');
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/blog');
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdminSession();
  const isActive = formData.get('status') === 'PUBLISHED';
  
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      titleAr: (formData.get('titleAr') as string)?.trim() || '',
      titleEn: (formData.get('titleEn') as string)?.trim() || null,
      slug: (formData.get('slug') as string)?.trim(),
      contentAr: (formData.get('contentAr') as string)?.trim() || '',
      contentEn: (formData.get('contentEn') as string)?.trim() || null,
      excerptAr: (formData.get('excerptAr') as string)?.trim() || null,
      excerptEn: (formData.get('excerptEn') as string)?.trim() || null,
      image: (formData.get('image') as string)?.trim() || null,
      author: (formData.get('author') as string)?.trim() || 'Tamara Kitchen',
      isActive,
      seoTitleAr: (formData.get('seoTitleAr') as string)?.trim() || null,
      seoTitleEn: (formData.get('seoTitleEn') as string)?.trim() || null,
      seoDescAr: (formData.get('seoDescAr') as string)?.trim() || null,
      seoDescEn: (formData.get('seoDescEn') as string)?.trim() || null,
    },
  });

  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/blog');
}

export async function toggleBlogPost(id: string, isEnabled: boolean) {
  try {
    await requireAdminSession();
    const post = await prisma.blogPost.update({
      where: { id },
      data: { isActive: isEnabled },
    });
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Failed to toggle blog post:', error);
    throw new Error('Failed to toggle blog post');
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await requireAdminSession();
    const existing = await prisma.blogPost.findUnique({ where: { id }});
    await prisma.blogPost.delete({
      where: { id },
    });
    revalidatePath('/blog');
    if (existing?.slug) {
      revalidatePath(`/blog/${existing.slug}`);
    }
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    throw new Error('Failed to delete blog post');
  }
}
