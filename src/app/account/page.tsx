import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { AccountClientWrapper } from "./AccountClientWrapper";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch the customer based on the userId
  const customer = await prisma.customer.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      addresses: {
        orderBy: { isDefault: 'desc' }
      }
    }
  });

  if (!customer) {
    // If the user doesn't have a linked customer profile, they shouldn't be able to view this page fully,
    // but we can show a minimal state or redirect them to complete their profile.
    // Assuming normal app flow creates a customer upon registration.
    redirect("/login");
  }

  // Calculate actual total spent from delivered/paid orders (or just delivered orders for now as requested)
  const deliveredOrders = await prisma.order.findMany({
    where: {
      customerId: customer.id,
      status: 'DELIVERED',
    },
    select: {
      totalAmount: true
    }
  });

  const realTotalOrders = deliveredOrders.length;
  const realTotalSpent = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Find the most recent active order (not DELIVERED, not CANCELLED)
  const activeOrderRaw = await prisma.order.findFirst({
    where: {
      customerId: customer.id,
      status: {
        notIn: ['DELIVERED', 'CANCELLED']
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Prepare safe serializable data
  const customerData = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt,
    totalOrders: realTotalOrders,
    totalSpent: realTotalSpent,
  };

  const activeOrder = activeOrderRaw ? {
    id: activeOrderRaw.id,
    orderNumber: activeOrderRaw.orderNumber,
    status: activeOrderRaw.status,
    totalAmount: activeOrderRaw.totalAmount,
    createdAt: activeOrderRaw.createdAt,
  } : null;

  const addresses = customer.addresses.map(addr => ({
    id: addr.id,
    label: addr.label,
    addressText: addr.addressText,
    isDefault: addr.isDefault,
  }));

  return (
    <AccountClientWrapper 
      customer={customerData} 
      activeOrder={activeOrder} 
      addresses={addresses} 
    />
  );
}
