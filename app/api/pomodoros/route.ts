import { NextResponse } from "next/server";
import { getAllCompletedSessions, updateCompletedSession } from "@/db/actions";
import { StudySession } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const data = (await request.json()) as { id: string };
    if (!data) {
      return NextResponse.json(
        { message: "No data provided" },
        { status: 400 }
      );
    }

    const query = await updateCompletedSession(data);
    if (!query) {
      return NextResponse.json(
        { message: "error updating data" },
        { status: 401 }
      );
    }
    return NextResponse.json({ message: query }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const query = await getAllCompletedSessions(userId);
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
