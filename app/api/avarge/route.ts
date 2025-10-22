import { NextResponse } from "next/server";
import { getAvarage } from "@/db/actions";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get("timezone") || "UTC";
    const query = await getAvarage(userId, { timezone });
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
