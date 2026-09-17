import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { resolveCustomer } from "@/lib/customer-resolver";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const customer = await resolveCustomer(userId, user.name, user.email);

    return NextResponse.json({ 
      success: true, 
      profile: {
        name: customer.name || user.name || "",
        email: user.email || "",
        phone: customer.phone.startsWith('USER_') ? '' : customer.phone
      }
    });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name, phone } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, message: "Name cannot be empty" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    // Update User name
    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() }
    });

    const customer = await resolveCustomer(userId, user.name, user.email);

    // Check phone uniqueness if phone is changing
    let finalPhone = phone ? phone.trim() : null;
    if (finalPhone && finalPhone !== customer.phone) {
      const existingPhone = await prisma.customer.findUnique({
        where: { phone: finalPhone }
      });
      if (existingPhone && existingPhone.id !== customer.id) {
        return NextResponse.json({ success: false, message: "Phone number already exists" }, { status: 400 });
      }
    } else if (!finalPhone) {
       finalPhone = customer.phone; // Preserve existing
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: { 
        name: name.trim(),
        phone: finalPhone
      }
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
