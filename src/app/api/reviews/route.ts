import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextauth";

// GET /api/reviews?productId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing productId" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: "APPROVED"
      },
      include: {
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
      }
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
    const { productId, rating, reviewText } = body;

    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "يرجى تحديد تقييم صالح بين 1 و 5 نجوم" },
        { status: 400 }
      );
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
        rating: Math.round(rating),
        reviewText: reviewText?.trim() || null,
        status: "PENDING" // Requires admin approval
      },
      include: {
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
