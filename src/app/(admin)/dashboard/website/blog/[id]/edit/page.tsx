import { prisma } from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import BlogForm from '../../BlogForm';
import { notFound } from 'next/navigation';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lang = await getAdminLang();
  const post = await prisma.blogPost.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!post) {
    notFound();
  }

  return <BlogForm lang={lang} initialData={post} />;
}
