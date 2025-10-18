import { NextResponse } from "next/server";
import { getSessionsByPeriod } from "@/db/actions";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") as "today" | "yesterday" | null;
    const timezone = searchParams.get("timezone") || "UTC";

    // Validate period parameter
    if (!period || (period !== "today" && period !== "yesterday")) {
      return NextResponse.json(
        {
          error:
            'Invalid period parameter. Must be either "today" or "yesterday"',
        },
        { status: 400 }
      );
    }

    const data = await getSessionsByPeriod(userId, period, timezone);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sessions by period:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch sessions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
