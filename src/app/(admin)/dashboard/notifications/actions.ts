'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth';

export async function getNotifications(page = 1, limit = 20) {
  await requireAdminSession();

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(1, limit));

  const notifications = await prisma.adminNotification.findMany({
    orderBy: { createdAt: 'desc' },
    take: safeLimit,
    skip: (safePage - 1) * safeLimit,
  });

  const total = await prisma.adminNotification.count();
  const unreadCount = await prisma.adminNotification.count({ where: { isRead: false } });

  return {
    notifications,
    total,
    unreadCount,
    totalPages: Math.ceil(total / safeLimit),
  };
}

export async function getUnreadCount() {
  await requireAdminSession();
  return await prisma.adminNotification.count({ where: { isRead: false } });
}

export async function markAsRead(id: string) {
  await requireAdminSession();
  await prisma.adminNotification.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath('/dashboard/notifications');
}

export async function markAllAsRead() {
  await requireAdminSession();
  await prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  revalidatePath('/dashboard/notifications');
}
