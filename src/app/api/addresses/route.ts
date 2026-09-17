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

    const customer = await prisma.customer.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!customer) {
      return NextResponse.json({ success: true, addresses: [] });
    }

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
    const { titleAr, titleEn, details, phone, isDefault } = body;

    if (!titleAr || !details) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer profile not found" }, { status: 404 });
    }

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
        // Since the UI passes phone, maybe we should save it? Address model doesn't have phone. 
        // Wait, Address model has `label`, `addressText`, `latitude`, `longitude`, `building`, `floor`, `apartment`, `landmark`, `isDefault`
      }
    });

    // The UI uses a specific format, let's adapt it to return what the UI expects or update the UI
    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (error) {
    console.error("Addresses POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
