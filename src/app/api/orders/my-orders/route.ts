import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ orders: [], message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    const userEmail = session.user?.email;

    let customer = null;

    if (userId) {
      customer = await prisma.customer.findUnique({
        where: { userId },
      });
    }

    if (!customer && userEmail) {
      customer = await prisma.customer.findUnique({
        where: { email: userEmail },
      });
    }

    if (!customer) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // Fetch orders belonging strictly to this authenticated customer
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error) {
    console.error("Fetch My Orders Error:", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
