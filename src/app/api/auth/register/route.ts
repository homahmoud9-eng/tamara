import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isValidEmail, sanitizeText } from "@/lib/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email ? String(body.email).trim().toLowerCase() : "";
    const password = body?.password ? String(body.password) : "";
    const name = sanitizeText(body?.name);
    const phone = sanitizeText(body?.phone) || "0000000000";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم صحيح لا يقل عن حرفين" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "يرجى إدخال بريد إلكتروني صالح" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مسجل بالفعل" },
        { status: 400 }
      );
    }

    // Hash the password with 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the User and linked Customer
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        customer: {
          create: {
            name,
            email,
            phone,
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." }, { status: 500 });
  }
}
