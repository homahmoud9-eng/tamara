import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const userId = (session.user as any).id;

    // Find the customer linked to this user
    const customer = await prisma.customer.findUnique({
      where: { userId: userId },
    });

    if (!customer) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // Fetch orders for this customer
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error) {
    console.error("Fetch My Orders Error:", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
