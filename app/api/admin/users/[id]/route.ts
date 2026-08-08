import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    if (currentUser.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const user = await client.users.getUser(id);
    const email = user.emailAddresses?.[0]?.emailAddress ?? "";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email.split("@")[0];

    const sessions = await prisma.studySession.findMany({
      where: { userId: id },
      orderBy: { startTime: "desc" },
      take: 50,
    });

    const totalMinutes = await prisma.studySession.aggregate({
      where: { userId: id },
      _sum: { durationMin: true },
    });

    const completedCount = await prisma.studySession.count({
      where: { userId: id, completed: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name,
        email,
        avatar: user.imageUrl,
        role: (user.publicMetadata.role as string) ?? "free",
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
        totalMinutes: totalMinutes._sum.durationMin ?? 0,
        completedSessions: completedCount,
        totalSessions: sessions.length,
        recentSessions: sessions.map((s) => ({
          id: s.id,
          startTime: s.startTime,
          endTime: s.endTime,
          durationMin: s.durationMin,
          type: s.type,
          completed: s.completed,
        })),
      },
    });
  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    if (currentUser.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role } = body as { role?: string };

    if (!role || !["free", "premium", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be: free, premium, or admin" },
        { status: 400 }
      );
    }

    await client.users.updateUser(id, {
      publicMetadata: { role },
    });

    return NextResponse.json({ success: true, data: { id, role } });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
