'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getNotifications(page = 1, limit = 20) {
  const notifications = await prisma.adminNotification.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const total = await prisma.adminNotification.count();
  const unreadCount = await prisma.adminNotification.count({ where: { isRead: false } });

  return {
    notifications,
    total,
    unreadCount,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUnreadCount() {
  return await prisma.adminNotification.count({ where: { isRead: false } });
}

export async function markAsRead(id: string) {
  await prisma.adminNotification.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath('/dashboard/notifications');
}

export async function markAllAsRead() {
  await prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  revalidatePath('/dashboard/notifications');
}
