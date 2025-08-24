import { NextResponse } from "next/server";
import { getDailyPomodorosSessions } from "@/db/actions";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { timezone } = (await request.json()) as { timezone: string };

    const query = await getDailyPomodorosSessions(userId, { timezone });
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
