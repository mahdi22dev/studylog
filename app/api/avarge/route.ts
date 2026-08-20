import { NextResponse } from "next/server";
import { getAvarage } from "@/db/actions";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get("timezone") || "UTC";

    // Cap at the allowed history window: 7 days for free, 30 for premium
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;
    const isPremium = role === "premium" || role === "admin";

    const requested = parseInt(searchParams.get("days") || "7", 10) || 7;
    const days = Math.min(Math.max(requested, 1), isPremium ? 30 : 7);

    const query = await getAvarage(userId, { timezone }, days);
    if (!query) {
      return NextResponse.json(
        { message: "error fetching data" },
        { status: 401 }
      );
    }
    return NextResponse.json({ message: query }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
