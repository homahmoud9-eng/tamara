import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!email || !password || !name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

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
            phone: phone || "0000000000",
          }
        }
      },
    });

    return Response.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
