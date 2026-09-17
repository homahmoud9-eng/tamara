import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    // Fetch user and customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { customer: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      profile: {
        name: user.customer?.name || user.name || "",
        email: user.email || "",
        phone: user.customer?.phone || ""
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

    // Update User name
    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() }
    });

    // Update Customer name and phone
    const customer = await prisma.customer.findUnique({
      where: { userId }
    });

    if (customer) {
      // Check phone uniqueness if phone is changing
      if (phone && phone !== customer.phone) {
        const existingPhone = await prisma.customer.findUnique({
          where: { phone: phone.trim() }
        });
        if (existingPhone && existingPhone.id !== customer.id) {
          return NextResponse.json({ success: false, message: "Phone number already exists" }, { status: 400 });
        }
      }

      await prisma.customer.update({
        where: { id: customer.id },
        data: { 
          name: name.trim(),
          phone: phone ? phone.trim() : customer.phone
        }
      });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
