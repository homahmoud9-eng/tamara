import { getAdminLang } from '@/lib/i18n';
import BlogForm from '../BlogForm';

export default async function NewBlogPostPage() {
  const lang = await getAdminLang();
  return <BlogForm lang={lang} />;
}
