import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Time periods for the schedule
export const TIME_PERIODS = [
  "08:00-10:00",
  "10:00-12:00",
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
  "20:00-22:00",
];

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// GET - Fetch user's schedule
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const schedule = await prisma.studySchedule.findUnique({
      where: { userId },
    });

    if (!schedule) {
      // Return empty schedule structure if none exists
      const emptySchedule = {
        userId,
        weekData: JSON.stringify(
          TIME_PERIODS.reduce((acc, period) => {
            acc[period] = WEEKDAYS.reduce((dayAcc, day) => {
              dayAcc[day] = "";
              return dayAcc;
            }, {} as Record<string, string>);
            return acc;
          }, {} as Record<string, Record<string, string>>)
        ),
      };

      return NextResponse.json({
        success: true,
        data: emptySchedule,
      });
    }

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

// POST - Create or update schedule
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { weekData } = body;

    if (!weekData) {
      return NextResponse.json(
        { success: false, error: "weekData is required" },
        { status: 400 }
      );
    }

    // Upsert the schedule (create if doesn't exist, update if exists)
    const schedule = await prisma.studySchedule.upsert({
      where: { userId },
      update: {
        weekData: JSON.stringify(weekData),
        updatedAt: new Date(),
      },
      create: {
        userId,
        weekData: JSON.stringify(weekData),
      },
    });

    return NextResponse.json({
      success: true,
      data: schedule,
      message: "Schedule saved successfully",
    });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save schedule" },
      { status: 500 }
    );
  }
}
