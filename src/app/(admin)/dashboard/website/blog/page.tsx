import { prisma } from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toggleBlogPost, deleteBlogPost } from './actions';

export default async function BlogAdminPage() {
  const lang = await getAdminLang();
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{lang === 'ar' ? 'إدارة المدونة' : 'Blog Management'}</h1>
          <p className="admin-page-subtitle">{lang === 'ar' ? 'إدارة المقالات والأخبار' : 'Manage articles and news'}</p>
        </div>
        <Link href="/dashboard/website/blog/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> {lang === 'ar' ? 'إضافة مقال' : 'Add Post'}
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {posts.length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty-state">
              <p className="admin-empty-state-title">{lang === 'ar' ? 'لا توجد مقالات' : 'No posts'}</p>
              <p className="admin-empty-state-desc">{lang === 'ar' ? 'أضف مقالاتك لتظهر في صفحة المدونة' : 'Add posts to appear on the blog page'}</p>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', opacity: post.isActive ? 1 : 0.5 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {post.titleAr}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{lang === 'ar' ? `الكاتب: ${post.author || 'إدارة الموقع'}` : `Author: ${post.author || 'Admin'}`}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="admin-icon-btn" title="View">
                  <Eye size={16} />
                </a>
                <form action={async () => { 'use server'; await toggleBlogPost(post.id, !post.isActive); }}>
                  <button type="submit" className="admin-icon-btn" title={post.isActive ? 'Unpublish' : 'Publish'}>
                    {post.isActive ? <EyeOff size={16} color="var(--admin-success)" /> : <Eye size={16} />}
                  </button>
                </form>
                <Link href={`/dashboard/website/blog/${post.id}/edit`} className="admin-icon-btn" title="Edit">
                  <Edit2 size={16} />
                </Link>
                <form action={async () => { 'use server'; await deleteBlogPost(post.id); }}>
                  <button type="submit" className="admin-icon-btn" style={{ color: 'var(--admin-error)' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
