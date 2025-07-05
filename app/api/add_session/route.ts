import { NextResponse } from "next/server";
import { addNewTimerSession } from "@/db/actions";
import { StudySession } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("User ID:", userId);
    const data = (await request.json()) as StudySession;
    console.log("Received data:", data);
    if (!data) {
      console.log("Data is undefined or null");
      return NextResponse.json(
        { message: "No data provided" },
        { status: 400 }
      );
    }

    const session: StudySession = {
      ...data,
      userId: userId,
    };
    const query = await addNewTimerSession(session);
    if (!query) {
      return NextResponse.json(
        { message: "error getting data" },
        { status: 401 }
      );
    }
    return NextResponse.json({ message: query }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
