import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch order by orderNumber or id
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: id },
          { id: id }
        ]
      },
      include: {
        items: {
          include: {
            addons: true
          }
        },
        customer: true,
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
