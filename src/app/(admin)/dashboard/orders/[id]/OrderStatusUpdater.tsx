'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from './actions';
import { Language } from '@/lib/i18n';

const STATUSES = [
  { value: 'RECEIVED', labelAr: 'مستلم', labelEn: 'Received' },
  { value: 'CONFIRMED', labelAr: 'مؤكد', labelEn: 'Confirmed' },
  { value: 'PREPARING', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
  { value: 'OUT_FOR_DELIVERY', labelAr: 'في الطريق', labelEn: 'Out for Delivery' },
  { value: 'DELIVERED', labelAr: 'تم التوصيل', labelEn: 'Delivered' },
  { value: 'CANCELLED', labelAr: 'ملغي', labelEn: 'Cancelled' },
];

export function OrderStatusUpdater({ orderId, currentStatus, lang }: { orderId: string; currentStatus: string; lang: Language }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    if (newStatus === currentStatus) return;
    if (newStatus === 'CANCELLED') {
      const confirmed = window.confirm(lang === 'ar' ? 'هل أنت متأكد من إلغاء هذا الطلب؟' : 'Are you sure you want to cancel this order?');
      if (!confirmed) return;
    }
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {STATUSES.map(s => (
        <button
          key={s.value}
          onClick={() => handleChange(s.value)}
          disabled={isPending || s.value === currentStatus}
          className={s.value === currentStatus ? 'admin-btn-primary' : s.value === 'CANCELLED' ? 'admin-btn-danger' : 'admin-btn-secondary'}
          style={{ opacity: isPending ? 0.5 : 1, fontSize: '12px', padding: '6px 12px' }}
        >
          {lang === 'ar' ? s.labelAr : s.labelEn}
        </button>
      ))}
    </div>
  );
}
