import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Generate a unique order number (e.g., ORD-timestamp-random)
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    
    // We expect a guest order or a logged-in user order
    // If guest, we create a customer profile based on phone number if not exists
    let customer = await prisma.customer.findUnique({
      where: { phone: body.customerPhone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: body.customerName,
          phone: body.customerPhone,
        }
      });
    }

    // Prepare Order Items
    const orderItems = body.items.map((item: any) => ({
      productId: item.productId || 'unknown',
      productNameAr: item.name?.ar || item.nameAr || 'غير معروف',
      productNameEn: item.name?.en || item.nameEn || 'Unknown',
      variantId: item.variantId || null,
      variantNameAr: item.variantName?.ar || item.variantNameAr || null,
      variantNameEn: item.variantName?.en || item.variantNameEn || null,
      unitPrice: item.price || item.totalPrice || 0,
      quantity: item.quantity,
      lineTotal: (item.price || item.totalPrice || 0) * item.quantity,
      itemNotes: item.notes || null,
    }));

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "RECEIVED",
        paymentMethod: body.paymentMethod === 'card' ? "CARD" : "CASH",
        paymentStatus: "PENDING",
        addressText: body.address,
        subtotal: body.subtotal,
        deliveryFee: body.deliveryFee,
        totalAmount: body.totalAmount,
        customerNotes: body.customerNotes,
        items: {
          create: orderItems
        }
      }
    });

    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
