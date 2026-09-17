'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBlogPost(formData: FormData) {
  const isActive = formData.get('status') === 'PUBLISHED';
  
  const post = await prisma.blogPost.create({
    data: {
      titleAr: formData.get('titleAr') as string,
      titleEn: formData.get('titleEn') as string || null,
      slug: (formData.get('slug') as string) || (formData.get('titleEn') as string).toLowerCase().replace(/\s+/g, '-'),
      contentAr: formData.get('contentAr') as string,
      contentEn: formData.get('contentEn') as string || null,
      excerptAr: formData.get('excerptAr') as string || null,
      excerptEn: formData.get('excerptEn') as string || null,
      image: formData.get('image') as string || null,
      author: formData.get('author') as string || 'Tamara Kitchen',
      isActive,
      seoTitleAr: formData.get('seoTitleAr') as string || null,
      seoTitleEn: formData.get('seoTitleEn') as string || null,
      seoDescAr: formData.get('seoDescAr') as string || null,
      seoDescEn: formData.get('seoDescEn') as string || null,
    },
  });

  revalidatePath('/blog');
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/blog');
}

export async function updateBlogPost(id: string, formData: FormData) {
  const isActive = formData.get('status') === 'PUBLISHED';
  
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      titleAr: formData.get('titleAr') as string,
      titleEn: formData.get('titleEn') as string || null,
      slug: formData.get('slug') as string,
      contentAr: formData.get('contentAr') as string,
      contentEn: formData.get('contentEn') as string || null,
      excerptAr: formData.get('excerptAr') as string || null,
      excerptEn: formData.get('excerptEn') as string || null,
      image: formData.get('image') as string || null,
      author: formData.get('author') as string || 'Tamara Kitchen',
      isActive,
      seoTitleAr: formData.get('seoTitleAr') as string || null,
      seoTitleEn: formData.get('seoTitleEn') as string || null,
      seoDescAr: formData.get('seoDescAr') as string || null,
      seoDescEn: formData.get('seoDescEn') as string || null,
    },
  });

  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/', 'layout');
  redirect('/dashboard/website/blog');
}

export async function toggleBlogPost(id: string, isEnabled: boolean) {
  try {
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
