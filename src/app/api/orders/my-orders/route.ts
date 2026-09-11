import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    let customer = null;

    if (session && session.user && (session.user as any).id) {
      const userId = (session.user as any).id;
      customer = await prisma.customer.findUnique({
        where: { userId: userId },
      });
    } else if (phone) {
      // Fallback for guest users tracking by phone
      customer = await prisma.customer.findUnique({
        where: { phone: phone },
      });
    }

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
