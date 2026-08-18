import { NextResponse } from "next/server";
import { getRecentSessions } from "@/db/actions";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const sessions = await getRecentSessions(userId, limit);
    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recent sessions" },
      { status: 500 }
    );
  }
}
