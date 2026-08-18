"use server";

import prisma from "@/lib/prisma";
import "dotenv/config";
import { StudySession } from "@prisma/client";
import * as luxon from "luxon";

export async function increament(sessionId: string) {
  try {
    await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        durationMin: { increment: 1 },
        endTime: new Date(),
      },
    });
    return "Session tracked successfully: " + sessionId;
  } catch (error) {
    console.log(`Error adding data: ${error}`);
    throw new Error(`Failed to add data: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function addNewTimerSession(
  params: StudySession & { subject?: string | null }
) {
  try {
    const { userId, startTime, endTime, subject } = params;
    const result = await prisma.studySession.create({
      data: {
        userId,
        startTime,
        endTime,
        durationMin: 1,
        type: "WORK",
        subject: subject || null,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to add timer session: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}
export async function updateCompletedSession(params: { id: string }) {
  try {
    const { id } = params;
    const result = await prisma.studySession.update({
      where: { id },
      data: {
        completed: true,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to add timer session: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllCompletedSessions(userId: string) {
  try {
    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
        completed: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });
    return sessions;
  } catch (error) {
    console.log(`Error fetching completed sessions: ${error}`);
    throw new Error(`Failed to fetch completed sessions: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}
export async function getDailyPomodorosSessions(
  userId: string,
  timezone: { timezone: string }
) {
  try {
    let startOfDay: Date;
    let endOfDay: Date;

    if (timezone?.timezone) {
      // Compute start and end of today in user’s TZ, then convert to JS Date (UTC)
      startOfDay = luxon.DateTime.now()
        .setZone(timezone.timezone)
        .startOf("day")
        .toUTC()
        .toJSDate();

      endOfDay = luxon.DateTime.now()
        .setZone(timezone.timezone)
        .endOf("day")
        .toUTC()
        .toJSDate();

      console.log(
        `Timezone: ${timezone.timezone}\n` +
          `Start of Day: ${luxon.DateTime.fromJSDate(startOfDay).toFormat(
            "dd/MM/yyyy HH:mm:ss"
          )} UTC\n` +
          `End of Day:   ${luxon.DateTime.fromJSDate(endOfDay).toFormat(
            "dd/MM/yyyy HH:mm:ss"
          )} UTC`
      );
    } else {
      // Fallback → use last 24h from now (rolling window)
      const now = new Date();
      startOfDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      endOfDay = now;

      console.log("No timezone provided, using rolling 24h window");
    }

    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startTime: "desc" },
    });

    return sessions;
  } catch (error) {
    console.error(`Error fetching daily sessions: ${error}`);
    throw new Error(`Failed to fetch daily sessions: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTotalMinutes(userId: string) {
  try {
    const result = await prisma.studySession.aggregate({
      where: { userId },
      _sum: {
        durationMin: true,
      },
    });
    return result._sum.durationMin || 0;
  } catch (error) {
    console.log(`Error calculating total minutes: ${error}`);
    throw new Error(`Failed to calculate total minutes: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getSessionsByPeriod(
  userId: string,
  period: "today" | "yesterday",
  timezone: string
) {
  try {
    let startOfDay: Date;
    let endOfDay: Date;

    const now = luxon.DateTime.now().setZone(timezone);

    if (period === "today") {
      // Get today's sessions
      startOfDay = now.startOf("day").toUTC().toJSDate();
      endOfDay = now.endOf("day").toUTC().toJSDate();
    } else {
      // Get yesterday's sessions
      const yesterday = now.minus({ days: 1 });
      startOfDay = yesterday.startOf("day").toUTC().toJSDate();
      endOfDay = yesterday.endOf("day").toUTC().toJSDate();
    }

    console.log(
      `Fetching ${period} sessions for timezone: ${timezone}\n` +
        `Start: ${luxon.DateTime.fromJSDate(startOfDay).toFormat(
          "dd/MM/yyyy HH:mm:ss"
        )} UTC\n` +
        `End: ${luxon.DateTime.fromJSDate(endOfDay).toFormat(
          "dd/MM/yyyy HH:mm:ss"
        )} UTC`
    );

    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startTime: "desc" },
    });

    // Calculate total duration
    const totalMinutes = sessions.reduce(
      (sum, session) => sum + (session.durationMin || 0),
      0
    );

    return {
      sessions,
      totalMinutes,
      period,
      count: sessions.length,
    };
  } catch (error) {
    console.error(`Error fetching ${period} sessions: ${error}`);
    throw new Error(`Failed to fetch ${period} sessions: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function resetStudyData(userId: string) {
  try {
    const result = await prisma.studySession.deleteMany({
      where: { userId },
    });
    return result;
  } catch (error) {
    console.log(`Error resetting study data: ${error}`);
    throw new Error(`Failed to reset study data: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getRecentSessions(userId: string, limit: number = 10) {
  try {
    const sessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      take: limit,
    });
    return sessions;
  } catch (error) {
    console.error(`Error fetching recent sessions: ${error}`);
    throw new Error(`Failed to fetch recent sessions: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAvarage(
  userId: string,
  timezone: { timezone: string }
) {
  try {
    let startOfDay: Date;
    let endOfDay: Date;

    // Fallback → use last 24h from now (rolling window)
    const now = new Date();
    startOfDay = new Date(now.getTime() - 168 * 60 * 60 * 1000);
    endOfDay = now;

    console.log("No timezone provided, using rolling week window");

    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { startTime: "desc" },
    });

    return sessions;
  } catch (error) {
    console.error(`Error fetching daily sessions: ${error}`);
    throw new Error(`Failed to fetch daily sessions: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}
