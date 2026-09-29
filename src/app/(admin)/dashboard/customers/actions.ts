'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth';

export async function deactivateCustomer(id: string) {
  try {
    await requireAdminSession();
    await prisma.customer.update({
      where: { id },
      data: { status: 'DISABLED' },
    });
    revalidatePath('/dashboard/customers');
    revalidatePath(`/dashboard/customers/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to deactivate customer:', error);
    return { success: false, error: 'Failed to deactivate customer.' };
  }
}

export async function activateCustomer(id: string) {
  try {
    await requireAdminSession();
    await prisma.customer.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    revalidatePath('/dashboard/customers');
    revalidatePath(`/dashboard/customers/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to activate customer:', error);
    return { success: false, error: 'Failed to activate customer.' };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await requireAdminSession();
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: true, user: true },
    });

    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }

    if (customer.orders.length > 0) {
      return { 
        success: false, 
        error: 'Cannot permanently delete this customer because they have historical orders. Please deactivate them instead to preserve financial records.'
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({ where: { customerId: id } });
      const userId = customer.userId;
      await tx.customer.delete({ where: { id } });
      if (userId) {
        await tx.user.delete({ where: { id: userId } });
      }
    });

    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete customer:', error);
    return { success: false, error: 'Failed to delete customer.' };
  }
}
