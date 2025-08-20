"use server";

import prisma from "@/lib/prisma";
import "dotenv/config";
import { StudySession } from "@prisma/client";

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

export async function addNewTimerSession(params: StudySession) {
  try {
    const { userId, startTime, endTime } = params;
    const result = await prisma.studySession.create({
      data: {
        userId,
        startTime,
        endTime,
        durationMin: 1,
        type: "WORK",
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
export async function getDailyPomodorosSessions(userId: string) {
  try {
    // Get the current time in UTC and subtract 24 hours
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const sessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: twentyFourHoursAgo, // Only sessions started in the last 24 hours (UTC)
        },
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
