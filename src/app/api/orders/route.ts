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

    // Server-side Coupon Validation
    let discountAmount = 0;
    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.couponCode.toUpperCase().replace(/\s+/g, '') }
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const isExpired = coupon.expiryDate && coupon.expiryDate < now;
        const isScheduled = coupon.startDate && coupon.startDate > now;
        const meetsMinOrder = !coupon.minOrder || body.subtotal >= coupon.minOrder;

        if (!isExpired && !isScheduled && meetsMinOrder) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (body.subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else if (coupon.discountType === 'FIXED') {
            discountAmount = coupon.discountValue;
          }
          // Never discount more than subtotal
          discountAmount = Math.min(discountAmount, body.subtotal);
        }
      }
    }

    const calculatedTotalAmount = body.subtotal + body.deliveryFee - discountAmount;

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
        discountAmount: discountAmount,
        deliveryFee: body.deliveryFee,
        totalAmount: calculatedTotalAmount,
        customerNotes: body.customerNotes,
        items: {
          create: orderItems
        }
      }
    });

    // Create an Admin Notification
    await prisma.adminNotification.create({
      data: {
        titleAr: `طلب جديد #${orderNumber}`,
        titleEn: `New Order #${orderNumber}`,
        messageAr: `تم إنشاء طلب جديد بواسطة ${customer.name || 'عميل'} بمبلغ ${calculatedTotalAmount} ج.م`,
        messageEn: `A new order has been placed by ${customer.name || 'Customer'} for ${calculatedTotalAmount} EGP`,
        type: 'ORDER',
        entityId: order.id,
      }
    });

    try {
      const webpush = require('web-push');
      webpush.setVapidDetails(
        'mailto:admin@tamara.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
        process.env.VAPID_PRIVATE_KEY || ''
      );

      // For the admin dashboard, we broadcast to all available subscriptions,
      // as currently the only consumers of the push API in this app are Admins in the dashboard.
      const subscriptions = await prisma.pushSubscription.findMany();

      if (subscriptions.length > 0) {
        const payload = JSON.stringify({
          title: `طلب جديد #${orderNumber}`,
          body: `مبلغ الطلب: ${calculatedTotalAmount} ج.م`,
          url: `/dashboard/orders/${order.id}`,
        });

        for (const sub of subscriptions) {
          try {
            await webpush.sendNotification({
              endpoint: sub.endpoint,
              keys: { auth: sub.auth, p256dh: sub.p256dh }
            }, payload);
          } catch (e: any) {
            if (e.statusCode === 410 || e.statusCode === 404) {
              await prisma.pushSubscription.delete({ where: { id: sub.id } });
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to send admin push notification:", err);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
