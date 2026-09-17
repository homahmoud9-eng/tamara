'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deactivateCustomer(id: string) {
  try {
    await prisma.customer.update({
      where: { id },
      data: { status: 'DISABLED' },
    });
    revalidatePath('/dashboard/customers');
    revalidatePath(`/dashboard/customers/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to deactivate customer:', error);
    return { success: false, error: error.message };
  }
}

export async function activateCustomer(id: string) {
  try {
    await prisma.customer.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    revalidatePath('/dashboard/customers');
    revalidatePath(`/dashboard/customers/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to activate customer:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCustomer(id: string) {
  try {
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

    // Safe to delete. We use transaction to delete associated user account if it exists.
    await prisma.$transaction(async (tx) => {
      // Address cascade deletes because of onDelete: Cascade in schema
      // Reviews don't cascade, so we must delete them
      await tx.review.deleteMany({ where: { customerId: id } });
      
      const userId = customer.userId;
      
      // Delete customer
      await tx.customer.delete({ where: { id } });
      
      // Delete user if linked
      if (userId) {
        await tx.user.delete({ where: { id: userId } });
      }
    });

    revalidatePath('/dashboard/customers');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete customer:', error);
    return { success: false, error: error.message };
  }
}
