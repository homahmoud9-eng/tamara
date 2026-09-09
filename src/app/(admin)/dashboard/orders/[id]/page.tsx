import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle, Mic, FileText } from 'lucide-react';
import { OrderStatusUpdater } from './OrderStatusUpdater';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getAdminLang();

  const { id } = await params;
  
  if (!id) {
    redirect('/dashboard/orders');
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { include: { addresses: true } },
      items: { include: { addons: true } },
    },
  });

  if (!order) redirect('/dashboard/orders');

  const statusSteps = ['RECEIVED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  const statusLabels: Record<string, { ar: string; en: string }> = {
    RECEIVED: { ar: 'مستلم', en: 'Received' },
    CONFIRMED: { ar: 'مؤكد', en: 'Confirmed' },
    PREPARING: { ar: 'قيد التحضير', en: 'Preparing' },
    OUT_FOR_DELIVERY: { ar: 'في الطريق', en: 'Out for Delivery' },
    DELIVERED: { ar: 'تم التوصيل', en: 'Delivered' },
    CANCELLED: { ar: 'ملغي', en: 'Cancelled' },
  };

  const paymentLabels: Record<string, { ar: string; en: string }> = {
    CASH: { ar: 'كاش', en: 'Cash' },
    CARD: { ar: 'بطاقة', en: 'Card' },
    PENDING: { ar: 'معلق', en: 'Pending' },
    PAID: { ar: 'مدفوع', en: 'Paid' },
    FAILED: { ar: 'فشل', en: 'Failed' },
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard/orders" className="admin-btn-ghost" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
              {lang === 'ar' ? 'طلب' : 'Order'} #{order.orderNumber}
            </h1>
            <p className="admin-page-subtitle">
              {order.createdAt.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
            </p>
          </div>
        </div>
        <div className="admin-page-actions">
          {order.customer.phone && (
            <a
              href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Order #${order.orderNumber}`)}`}
              target="_blank" rel="noopener"
              className="admin-btn-secondary"
              style={{ textDecoration: 'none', color: '#25D366' }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Status Progress */}
      {!isCancelled && (
        <div className="admin-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            {/* Progress line */}
            <div style={{ position: 'absolute', top: '14px', left: '24px', right: '24px', height: '3px', background: 'var(--admin-border)', borderRadius: '2px', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '14px', left: '24px', height: '3px', background: 'var(--admin-primary)', borderRadius: '2px', zIndex: 1, width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`, transition: 'width 0.3s' }} />

            {statusSteps.map((step, i) => {
              const done = i <= currentStepIndex;
              const label = statusLabels[step];
              return (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, position: 'relative' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: done ? 'var(--admin-primary)' : 'var(--admin-surface)',
                    border: done ? 'none' : '2px solid var(--admin-border)',
                    color: done ? '#fff' : 'var(--admin-text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: done ? 600 : 400, color: done ? 'var(--admin-text)' : 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                    {lang === 'ar' ? label.ar : label.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="admin-card" style={{ marginBottom: '16px', borderColor: 'var(--admin-error)', background: 'rgba(239,68,68,0.04)' }}>
          <p style={{ color: 'var(--admin-error)', fontWeight: 600, textAlign: 'center' }}>
            {lang === 'ar' ? 'هذا الطلب ملغي' : 'This order has been cancelled'}
          </p>
        </div>
      )}

      {/* Status Update */}
      <div className="admin-card" style={{ marginBottom: '16px' }}>
        <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'تحديث الحالة' : 'Update Status'}</h3>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} lang={lang} />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Left Column: Items */}
        <div>
          {/* Order Items */}
          <div className="admin-card" style={{ marginBottom: '16px' }}>
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>{lang === 'ar' ? 'عناصر الطلب' : 'Order Items'}</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th>{lang === 'ar' ? 'المتغير' : 'Variant'}</th>
                  <th>{lang === 'ar' ? 'الإضافات' : 'Add-ons'}</th>
                  <th>{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                  <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                  <th>{lang === 'ar' ? 'المجموع' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lang === 'ar' ? item.productNameAr : item.productNameEn}</div>
                      {item.itemNotes && (
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={12} /> {item.itemNotes}
                        </div>
                      )}
                    </td>
                    <td>
                      {item.variantNameEn ? (
                        <span className="admin-badge neutral">
                          {lang === 'ar' ? item.variantNameAr : item.variantNameEn}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      {item.addons.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {item.addons.map(addon => (
                            <span key={addon.id} style={{ fontSize: '12px' }}>
                              + {lang === 'ar' ? addon.addonNameAr : addon.addonNameEn} 
                              {addon.price > 0 && <span style={{ color: 'var(--admin-text-muted)' }}> (AED {addon.price.toFixed(2)})</span>}
                            </span>
                          ))}
                        </div>
                      ) : '—'}
                    </td>
                    <td>{item.quantity}</td>
                    <td>AED {item.unitPrice.toFixed(2)}</td>
                    <td style={{ fontWeight: 600 }}>AED {item.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'الملخص المالي' : 'Financial Summary'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>AED {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-success)' }}>
                  <span>{lang === 'ar' ? 'الخصم' : 'Discount'}</span>
                  <span>- AED {order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span>{order.deliveryFee > 0 ? `AED ${order.deliveryFee.toFixed(2)}` : (lang === 'ar' ? 'مجاني' : 'Free')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--admin-border)', paddingTop: '8px', fontWeight: 700, fontSize: '16px' }}>
                <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span>AED {order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer + Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer Info */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'معلومات العميل' : 'Customer Info'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{order.customer.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                <Phone size={14} /> <span style={{ direction: 'ltr' }}>{order.customer.phone}</span>
              </div>
              {order.customer.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                  <Mail size={14} /> {order.customer.email}
                </div>
              )}
              <Link href={`/dashboard/customers/${order.customer.id}`} className="admin-btn-ghost" style={{ textDecoration: 'none', marginTop: '4px', fontSize: '13px' }}>
                {lang === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'} →
              </Link>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'معلومات التوصيل' : 'Delivery Info'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '13px' }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{order.addressText}</span>
              </div>
              {(order.latitude && order.longitude) && (
                <a
                  href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                  target="_blank" rel="noopener"
                  className="admin-btn-ghost" style={{ textDecoration: 'none', fontSize: '12px', color: 'var(--admin-info)' }}
                >
                  <MapPin size={12} /> {lang === 'ar' ? 'فتح في الخريطة' : 'Open in Maps'}
                </a>
              )}
              {order.deliveryTime && (
                <div style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                  {lang === 'ar' ? 'وقت التوصيل:' : 'Delivery time:'} {order.deliveryTime.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'الدفع' : 'Payment'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'طريقة الدفع' : 'Method'}</span>
                <span>{lang === 'ar' ? paymentLabels[order.paymentMethod]?.ar : paymentLabels[order.paymentMethod]?.en}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-muted)' }}>{lang === 'ar' ? 'حالة الدفع' : 'Status'}</span>
                <span className={`admin-badge ${order.paymentStatus === 'PAID' ? 'success' : order.paymentStatus === 'FAILED' ? 'danger' : 'warning'}`}>
                  {lang === 'ar' ? paymentLabels[order.paymentStatus]?.ar : paymentLabels[order.paymentStatus]?.en}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(order.customerNotes || order.voiceNoteRef) && (
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'ملاحظات' : 'Notes'}</h3>
              {order.customerNotes && (
                <div style={{ fontSize: '13px', padding: '8px 12px', background: 'var(--admin-bg)', borderRadius: 'var(--admin-radius-sm)', marginBottom: '8px' }}>
                  <FileText size={12} style={{ marginBottom: '-2px' }} /> {order.customerNotes}
                </div>
              )}
              {order.voiceNoteRef && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--admin-info)' }}>
                  <Mic size={14} />
                  <span>{lang === 'ar' ? 'ملاحظة صوتية مرفقة' : 'Voice note attached'}</span>
                  <span className="admin-badge info" style={{ fontSize: '10px' }}>{lang === 'ar' ? 'معلق' : 'Pending storage'}</span>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>{lang === 'ar' ? 'البيانات الوصفية' : 'Metadata'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
              <div><strong>ID:</strong> {order.id}</div>
              <div><strong>{lang === 'ar' ? 'تم الإنشاء:' : 'Created:'}</strong> {order.createdAt.toLocaleString()}</div>
              <div><strong>{lang === 'ar' ? 'آخر تحديث:' : 'Updated:'}</strong> {order.updatedAt.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
