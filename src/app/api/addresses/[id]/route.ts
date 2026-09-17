import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { resolveCustomer } from "@/lib/customer-resolver";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const customer = await resolveCustomer(userId, user?.name, user?.email);

    // Verify ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.customerId !== customer.id) {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
    }

    const body = await req.json();
    const { titleAr, details, isDefault } = body;

    // If making default, remove default from others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { customerId: customer.id, isDefault: true, id: { not: id } },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        label: titleAr !== undefined ? titleAr : existing.label,
        addressText: details !== undefined ? details : existing.addressText,
        isDefault: isDefault !== undefined ? isDefault : existing.isDefault,
      }
    });

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Address PUT Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const customer = await resolveCustomer(userId, user?.name, user?.email);

    // Verify ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.customerId !== customer.id) {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
