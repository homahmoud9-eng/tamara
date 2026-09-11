'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@tamara.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { customer: true }
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard');

  // Try to send push notification
  if (order.customer?.userId) {
    try {
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId: order.customer.userId }
      });

      const getStatusText = (status: string) => {
        switch (status) {
          case 'CONFIRMED': return 'تم تأكيد طلبك وجاري تحضيره';
          case 'PREPARING': return 'طلبك الآن في المطبخ للتحضير';
          case 'OUT_FOR_DELIVERY': return 'طلبك خرج للتوصيل وهو في الطريق إليك';
          case 'DELIVERED': return 'تم توصيل طلبك بنجاح، صحتين وعافية!';
          case 'CANCELLED': return 'تم إلغاء الطلب';
          default: return `تم تحديث حالة الطلب إلى ${status}`;
        }
      };

      const payload = JSON.stringify({
        title: `تحديث طلب #${order.orderNumber}`,
        body: getStatusText(status),
        url: `/orders/${order.id}`,
      });

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification({
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth,
              p256dh: sub.p256dh
            }
          }, payload);
        } catch (e: any) {
          if (e.statusCode === 410 || e.statusCode === 404) {
            // Subscription expired or invalid
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
          } else {
            console.error("Failed to send push:", e);
          }
        }
      }
    } catch (err) {
      console.error("Push Notification Error:", err);
    }
  }
}
