import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    // 1. Resolve Customer Identity
    let customer = null;
    let authUser = null;

    if (session?.user?.email) {
      authUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { customer: true }
      });
      if (authUser?.customer) {
        customer = authUser.customer;
      }
    }

    // Guest checkout fallback
    if (!customer) {
      if (!body.customerPhone || !body.customerName) {
        return NextResponse.json({ success: false, message: "Name and phone are required for guest checkout" }, { status: 400 });
      }
      customer = await prisma.customer.findUnique({
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
    }

    // 2. Validate Address
    let finalAddressText = "";
    if (body.addressId) {
      const address = await prisma.address.findUnique({ where: { id: body.addressId } });
      if (!address || address.customerId !== customer.id) {
        return NextResponse.json({ success: false, message: "Invalid address" }, { status: 403 });
      }
      finalAddressText = `${address.addressText}${address.building ? `, Bldg ${address.building}` : ''}${address.apartment ? `, Apt ${address.apartment}` : ''}`;
    } else if (body.addressText) {
      finalAddressText = body.addressText;
    } else {
      return NextResponse.json({ success: false, message: "Address is required" }, { status: 400 });
    }

    // 3. Server-side Cart Validation
    let subtotal = 0;
    const finalOrderItems: any[] = [];
    const cartConflicts = [];

    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || !product.isActive || product.availability !== 'AVAILABLE') {
        cartConflicts.push({ id: item.id, type: 'PRODUCT_UNAVAILABLE', name: product?.nameEn || 'Unknown' });
        continue;
      }

      let unitPrice = product.basePrice;
      let variantNameAr = null;
      let variantNameEn = null;

      if (item.variantId) {
        const variant = await prisma.variant.findUnique({
          where: { id: item.variantId }
        });
        if (!variant || variant.productId !== product.id || !variant.isActive || variant.availability !== 'AVAILABLE') {
          cartConflicts.push({ id: item.id, type: 'VARIANT_UNAVAILABLE', name: product.nameEn });
          continue;
        }
        unitPrice = variant.price;
        variantNameAr = variant.nameAr;
        variantNameEn = variant.nameEn;
      }

      const finalAddons = [];
      let addonTotal = 0;

      if (item.addons) {
        for (const [groupId, addonIds] of Object.entries(item.addons)) {
          const group = await prisma.addonGroup.findUnique({
            where: { id: groupId },
            include: { addons: true }
          });

          if (!group || group.productId !== product.id || !group.isActive) {
            cartConflicts.push({ id: item.id, type: 'ADDON_GROUP_UNAVAILABLE', name: product.nameEn });
            continue;
          }

          const selectedAddonIds = addonIds as string[];
          for (const addonId of selectedAddonIds) {
            const addon = group.addons.find(a => a.id === addonId);
            if (!addon || !addon.isActive) {
              cartConflicts.push({ id: item.id, type: 'ADDON_UNAVAILABLE', name: product.nameEn });
              continue;
            }
            addonTotal += addon.price;
            finalAddons.push({
              addonNameAr: addon.nameAr,
              addonNameEn: addon.nameEn,
              price: addon.price
            });
          }
        }
      }

      const itemTotalPrice = (unitPrice + addonTotal) * item.quantity;
      subtotal += itemTotalPrice;

      // Check if browser price matches server price (stale cart protection)
      if (Math.abs(itemTotalPrice - (item.totalPrice * item.quantity)) > 0.01) {
         cartConflicts.push({ id: item.id, type: 'PRICE_CHANGED', name: product.nameEn, newPrice: (unitPrice + addonTotal) });
      }

      finalOrderItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productNameAr: product.nameAr,
        productNameEn: product.nameEn,
        variantNameAr: variantNameAr,
        variantNameEn: variantNameEn,
        unitPrice: unitPrice + addonTotal,
        quantity: item.quantity,
        lineTotal: itemTotalPrice,
        itemNotes: item.notes || null,
        addons: finalAddons
      });
    }

    if (cartConflicts.length > 0) {
      return NextResponse.json({ 
        success: false, 
        code: 'CART_UPDATED', 
        message: "Some items in your cart have changed price or availability. Please review your cart.", 
        conflicts: cartConflicts 
      }, { status: 400 });
    }

    // 4. Validate Coupon
    let discountAmount = 0;
    let appliedCouponCode = null;

    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.couponCode.toUpperCase().replace(/\s+/g, '') }
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const isExpired = coupon.expiryDate && coupon.expiryDate < now;
        const isScheduled = coupon.startDate && coupon.startDate > now;
        const meetsMinOrder = !coupon.minOrder || subtotal >= coupon.minOrder;

        if (!isExpired && !isScheduled && meetsMinOrder) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else if (coupon.discountType === 'FIXED') {
            discountAmount = coupon.discountValue;
          }
          discountAmount = Math.min(discountAmount, subtotal);
          appliedCouponCode = coupon.code;
        } else {
           return NextResponse.json({ success: false, code: 'COUPON_INVALID', message: "The applied coupon is invalid or expired." }, { status: 400 });
        }
      } else {
        return NextResponse.json({ success: false, code: 'COUPON_INVALID', message: "The applied coupon is invalid or expired." }, { status: 400 });
      }
    }

    const calculatedTotalAmount = subtotal - discountAmount;
    const deliveryFee = 0; // Explicitly 0, determined via WhatsApp
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // 5. Transaction: Create Order
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          status: "RECEIVED",
          paymentMethod: body.paymentMethod === 'card' ? "CARD" : "CASH",
          paymentStatus: "PENDING",
          addressText: finalAddressText,
          subtotal: subtotal,
          discountAmount: discountAmount,
          deliveryFee: deliveryFee,
          totalAmount: calculatedTotalAmount,
          customerNotes: body.customerNotes,
          items: {
            create: finalOrderItems.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              productNameAr: item.productNameAr,
              productNameEn: item.productNameEn,
              variantNameAr: item.variantNameAr,
              variantNameEn: item.variantNameEn,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
              itemNotes: item.itemNotes,
              addons: {
                create: item.addons.map((a: any) => ({
                  addonNameAr: a.addonNameAr,
                  addonNameEn: a.addonNameEn,
                  price: a.price
                }))
              }
            }))
          }
        },
        include: { items: { include: { addons: true } } }
      });

      // Update coupon usage if implemented in DB (usage limit check isn't fully robust here without relation, but safe to skip for now)
      if (appliedCouponCode) {
        // if we needed to update usage limit
      }

      return newOrder;
    });

    // 6. Notifications
    try {
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

      const webpush = require('web-push');
      if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        webpush.setVapidDetails(
          'mailto:admin@tamara.com',
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          process.env.VAPID_PRIVATE_KEY
        );
        const subscriptions = await prisma.pushSubscription.findMany();
        if (subscriptions.length > 0) {
          const payload = JSON.stringify({
            title: `طلب جديد #${orderNumber}`,
            body: `مبلغ الطلب: ${calculatedTotalAmount} ج.م`,
            url: `/dashboard/orders/${order.id}`,
          });
          for (const sub of subscriptions) {
            try {
              await webpush.sendNotification({ endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } }, payload);
            } catch (e: any) {
              if (e.statusCode === 410 || e.statusCode === 404) {
                await prisma.pushSubscription.delete({ where: { id: sub.id } });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Notification Error:", e);
    }

    // 7. Generate WhatsApp Message
    const businessSettings = await prisma.businessSetting.findFirst();
    const whatsappNumber = businessSettings?.whatsapp || "201000000000";

    let msg = `*Tamara Kitchen*\n\n`;
    msg += `طلب جديد #${order.orderNumber}\n\n`;
    msg += `العميل:\n${customer.name}\n\n`;
    msg += `الهاتف:\n${customer.phone}\n\n`;
    msg += `العنوان:\n${finalAddressText}\n\n`;
    msg += `--------------------------------\n\nالطلبات:\n\n`;

    for (const item of order.items) {
      const vName = item.variantNameAr ? ` (${item.variantNameAr})` : '';
      msg += `${item.productNameAr}${vName} × ${item.quantity}\n`;
      msg += `${item.lineTotal} درهم\n`;
      if (item.addons && item.addons.length > 0) {
        msg += `الإضافات:\n`;
        for (const addon of item.addons) {
          msg += `- ${addon.addonNameAr} (+${addon.price})\n`;
        }
      }
      if (item.itemNotes) {
        msg += `ملاحظة: ${item.itemNotes}\n`;
      }
      msg += `\n`;
    }

    if (order.customerNotes) {
      msg += `ملاحظات الطلب: ${order.customerNotes}\n\n`;
    }

    msg += `--------------------------------\n\n`;
    msg += `الإجمالي الفرعي:\n${order.subtotal} درهم\n\n`;

    if (appliedCouponCode) {
      msg += `كوبون الخصم:\n${appliedCouponCode}\n\n`;
      msg += `الخصم:\n-${order.discountAmount} درهم\n\n`;
    }

    msg += `الإجمالي بعد الخصم:\n${order.totalAmount} درهم\n\n`;
    msg += `الشحن:\nسيتم تحديد تكلفة الشحن وتأكيدها عبر واتساب.\n`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    return NextResponse.json({ success: true, order, whatsappUrl }, { status: 201 });

  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
