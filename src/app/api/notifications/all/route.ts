import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

// Fetch ALL notifications (read and unread) for history
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: (session!.user as any).id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit history to last 100 to prevent huge payloads
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching all notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
