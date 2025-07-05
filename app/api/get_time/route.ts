import { NextResponse } from "next/server";
import { getTotalMinutes, increament } from "@/db/actions";
import { StudySession } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const query = await getTotalMinutes(userId);
    if (!query) {
      return NextResponse.json(
        { message: "error getting data" },
        { status: 401 }
      );
    }
    console.log("Total minutes:", query);
    return NextResponse.json({ totalMinutes: query }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
