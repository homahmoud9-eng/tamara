import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { getSession as getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    // 1. Authenticate Requester (Admin or Customer)
    const [adminSession, customerSession] = await Promise.all([
      getAdminSession(),
      getServerSession(authOptions),
    ]);

    const isAdmin = !!adminSession?.adminId;
    const customerUserId = (customerSession?.user as any)?.id;
    const customerEmail = customerSession?.user?.email;

    if (!isAdmin && !customerUserId && !customerEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch order
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
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userId: true,
          }
        },
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. IDOR Protection: Verify ownership if not an admin
    if (!isAdmin) {
      const isOwner =
        (customerUserId && order.customer?.userId === customerUserId) ||
        (customerEmail && order.customer?.email?.toLowerCase() === customerEmail.toLowerCase());

      if (!isOwner) {
        // Return 404 to avoid ID enumeration
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    }

    // 4. Sanitize customer profile in response
    const sanitizedOrder = {
      ...order,
      customer: order.customer ? {
        id: order.customer.id,
        name: order.customer.name,
        phone: order.customer.phone.startsWith('USER_') ? '' : order.customer.phone,
      } : null,
    };

    return NextResponse.json(sanitizedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
