import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import { Trash2, CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';
import { updateReviewStatus, toggleFeaturedReview, deleteReview } from './actions';

export default async function AdminReviewsPage() {
  const lang = await getAdminLang();

  const reviews = await prisma.review.findMany({
    include: {
      customer: true,
      product: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  const pendingCount = reviews.filter(r => r.status === 'PENDING').length;
  const approvedCount = reviews.filter(r => r.status === 'APPROVED').length;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
            {lang === 'ar' ? 'إدارة تقييمات المنتجات' : 'Product Reviews'}
          </h1>
          <p className="admin-page-subtitle">
            {lang === 'ar' 
              ? `${reviews.length} تقييم إجمالي (${pendingCount} بانتظار المراجعة، ${approvedCount} معتمد)`
              : `${reviews.length} total reviews (${pendingCount} pending, ${approvedCount} approved)`}
          </p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
              <th>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
              <th>{lang === 'ar' ? 'التقييم' : 'Rating'}</th>
              <th>{lang === 'ar' ? 'التعليق' : 'Comment'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'مميز' : 'Featured'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-table-empty">
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ margin: 0 }}>{lang === 'ar' ? 'لا توجد تقييمات حتى الآن' : 'No reviews found'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rev.customer?.name || '—'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{rev.customer?.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lang === 'ar' ? rev.product.nameAr : rev.product.nameEn}</div>
                  </td>
                  <td>
                    <span style={{ color: '#E4A853', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '13px', lineHeight: '1.4' }}>
                    {rev.reviewText || <span style={{ color: 'var(--admin-text-muted)' }}>—</span>}
                  </td>
                  <td>
                    {rev.status === 'APPROVED' && <span className="admin-badge success">{lang === 'ar' ? 'معتمد' : 'Approved'}</span>}
                    {rev.status === 'PENDING' && <span className="admin-badge warning">{lang === 'ar' ? 'بانتظار المراجعة' : 'Pending'}</span>}
                    {rev.status === 'REJECTED' && <span className="admin-badge danger">{lang === 'ar' ? 'مرفوض' : 'Rejected'}</span>}
                  </td>
                  <td>
                    <form action={toggleFeaturedReview.bind(null, rev.id, !rev.isFeatured)}>
                      <button 
                        type="submit" 
                        className="admin-icon-btn" 
                        style={{ color: rev.isFeatured ? '#E4A853' : 'var(--admin-text-muted)' }}
                        title={lang === 'ar' ? 'تثبيت في الصفحة الرئيسية' : 'Toggle Featured'}
                      >
                        <Star size={16} fill={rev.isFeatured ? '#E4A853' : 'none'} />
                      </button>
                    </form>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      {rev.status !== 'APPROVED' && (
                        <form action={updateReviewStatus.bind(null, rev.id, 'APPROVED')}>
                          <button 
                            type="submit" 
                            className="admin-icon-btn" 
                            style={{ color: 'var(--admin-success)' }}
                            title={lang === 'ar' ? 'موافقة واعتماد' : 'Approve'}
                          >
                            <CheckCircle size={16} />
                          </button>
                        </form>
                      )}
                      
                      {rev.status !== 'REJECTED' && (
                        <form action={updateReviewStatus.bind(null, rev.id, 'REJECTED')}>
                          <button 
                            type="submit" 
                            className="admin-icon-btn" 
                            style={{ color: 'var(--admin-warning)' }}
                            title={lang === 'ar' ? 'رفض' : 'Reject'}
                          >
                            <XCircle size={16} />
                          </button>
                        </form>
                      )}

                      <form action={deleteReview.bind(null, rev.id)}>
                        <button 
                          type="submit" 
                          className="admin-icon-btn" 
                          style={{ color: 'var(--admin-error)' }}
                          title={lang === 'ar' ? 'حذف نهائي' : 'Delete'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
