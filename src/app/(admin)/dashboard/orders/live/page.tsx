import prisma from '@/lib/prisma';
import { getAdminLang } from '@/lib/i18n';
import LiveOrdersClient from './LiveOrdersClient';

export default async function LiveOrdersPage() {
  const lang = await getAdminLang();

  // Fetch active orders
  const activeOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ['RECEIVED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY']
      }
    },
    orderBy: { createdAt: 'asc' }, // Oldest first for kitchen
    include: {
      customer: true,
      items: true
    }
  });

  return <LiveOrdersClient initialOrders={activeOrders} lang={lang} />;
}
