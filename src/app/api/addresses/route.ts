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
    const customer = await resolveCustomer(userId, user?.name, user?.email);

    const addresses = await prisma.address.findMany({
      where: { customerId: customer.id },
      orderBy: { isDefault: 'desc' }
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("Addresses GET Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { titleAr, details, isDefault } = body;

    if (!titleAr || !details) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const customer = await resolveCustomer(userId, user?.name, user?.email);

    // If this is set as default, remove default from others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { customerId: customer.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    // Check if this is the first address, make it default automatically
    const count = await prisma.address.count({ where: { customerId: customer.id } });
    const shouldBeDefault = count === 0 ? true : isDefault;

    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
        label: titleAr, // Using titleAr for label
        addressText: details,
        isDefault: shouldBeDefault,
      }
    });

    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (error) {
    console.error("Addresses POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
