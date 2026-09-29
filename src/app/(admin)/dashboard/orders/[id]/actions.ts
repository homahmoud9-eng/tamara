'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import webpush from 'web-push';
import { requireAdminSession } from '@/lib/auth';

const ALLOWED_ORDER_STATUSES = [
  'RECEIVED',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
];

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:admin@tamara.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  } catch (e) {
    console.error('VAPID configuration error:', e);
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdminSession();

  if (!ALLOWED_ORDER_STATUSES.includes(status)) {
    throw new Error('Invalid order status');
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { customer: true }
  });

  revalidatePath('/', 'layout');

  // Try to send push notification and create DB notification
  if (order.customer?.userId) {
    try {
      const getStatusText = (s: string) => {
        switch (s) {
          case 'CONFIRMED': return 'تم تأكيد طلبك وجاري تحضيره';
          case 'PREPARING': return 'طلبك الآن في المطبخ للتحضير';
          case 'OUT_FOR_DELIVERY': return 'طلبك خرج للتوصيل وهو في الطريق إليك';
          case 'DELIVERED': return 'تم توصيل طلبك بنجاح، صحتين وعافية!';
          case 'CANCELLED': return 'تم إلغاء الطلب';
          default: return `تم تحديث حالة الطلب إلى ${s}`;
        }
      };
      
      const getStatusTextEn = (s: string) => {
        switch (s) {
          case 'CONFIRMED': return 'Your order is confirmed and being prepared';
          case 'PREPARING': return 'Your order is now in the kitchen being prepared';
          case 'OUT_FOR_DELIVERY': return 'Your order is out for delivery and on its way';
          case 'DELIVERED': return 'Your order has been delivered successfully, enjoy!';
          case 'CANCELLED': return 'Your order has been cancelled';
          default: return `Your order status has been updated to ${s}`;
        }
      };

      const titleAr = `تحديث طلب #${order.orderNumber}`;
      const titleEn = `Order Update #${order.orderNumber}`;
      const messageAr = getStatusText(status);
      const messageEn = getStatusTextEn(status);

      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: order.customer.userId,
          titleAr,
          titleEn,
          messageAr,
          messageEn,
          type: "ORDER",
          entityId: order.id,
        }
      });

      if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        const subscriptions = await prisma.pushSubscription.findMany({
          where: { userId: order.customer.userId }
        });

        const payload = JSON.stringify({
          title: titleAr,
          body: messageAr,
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
              await prisma.pushSubscription.delete({ where: { id: sub.id } });
            }
          }
        }
      }
    } catch (err) {
      console.error("Push Notification Error:", err);
    }
  }

  return { success: true };
}
