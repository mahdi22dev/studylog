import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const meta = user.publicMetadata as Record<string, unknown>;
    const role = (meta.role as string) ?? "free";
    const isPremium = role === "premium" || role === "admin";

    return NextResponse.json({
      isPremium,
      role,
      plan: (meta.plan as string) ?? null,
      planActive: meta.planActive === true,
      subscriptionEndsAt: (meta.subscriptionEndsAt as string) ?? null,
    });
  } catch (error) {
    console.error("Billing status error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}