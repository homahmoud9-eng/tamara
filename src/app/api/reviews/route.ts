import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";
import { sanitizeText } from "@/lib/sanitize";

// GET /api/reviews?productId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ success: false, message: "Missing productId" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: "APPROVED"
      },
      select: {
        id: true,
        rating: true,
        reviewText: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 50,
    });

    return NextResponse.json({ success: true, reviews });
  } catch (err: any) {
    console.error("Error fetching reviews:", err);
    return NextResponse.json({ success: false, message: "Error fetching reviews" }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "يجب تسجيل الدخول لإضافة تقييم" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const productId = typeof body?.productId === 'string' ? body.productId.trim() : null;
    const rating = typeof body?.rating === 'number' ? Math.round(body.rating) : null;
    const rawReviewText = typeof body?.reviewText === 'string' ? body.reviewText : null;
    const cleanReviewText = rawReviewText ? sanitizeText(rawReviewText) : null;

    if (!productId || rating === null || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "يرجى تحديد تقييم صالح بين 1 و 5 نجوم" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "المنتج غير موجود" }, { status: 404 });
    }

    // Resolve Customer
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { customer: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود" }, { status: 404 });
    }

    let customer = user.customer;
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: user.name || "Customer",
          email: user.email,
          phone: `USER_${user.id.slice(0, 8)}`,
          userId: user.id
        }
      });
    }

    const newReview = await prisma.review.create({
      data: {
        customerId: customer.id,
        productId,
        rating,
        reviewText: cleanReviewText,
        status: "PENDING" // Requires admin approval
      },
      select: {
        id: true,
        rating: true,
        reviewText: true,
        createdAt: true,
        status: true,
        customer: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "تم إرسال تقييمك بنجاح وسيكون ظاهراً بعد مراجعته من الإدارة.",
      review: newReview
    });
  } catch (err: any) {
    console.error("Error submitting review:", err);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء حفظ التقييم" }, { status: 500 });
  }
}
