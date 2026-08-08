import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
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

    const clerkUsers = await client.users.getUserList({ limit: 100 });

    const sessionCounts = await prisma.studySession.groupBy({
      by: ["userId"],
      _count: { id: true },
    });

    const countMap = new Map<string, number>(
      sessionCounts.map((s: { userId: string; _count: { id: number } }) => [s.userId, s._count.id])
    );

    const users = clerkUsers.data.map((user) => {
      const email = user.emailAddresses?.[0]?.emailAddress ?? "";
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email.split("@")[0];

      return {
        id: user.id,
        name,
        email,
        avatar: user.imageUrl,
        sessionCount: countMap.get(user.id) ?? 0,
        role: (user.publicMetadata.role as string) ?? "free",
        createdAt: user.createdAt,
      };
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
