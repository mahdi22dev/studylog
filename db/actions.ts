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
    const { userId, startTime, endTime, durationMin } = params;
    const result = await prisma.studySession.create({
      data: {
        startTime,
        endTime,
        durationMin,
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

// export async function getWebsites(take: number) {
//   try {
//     const websites = await prisma.website.findMany({ take: take });
//     return websites;
//   } catch (error) {
//     console.log(`Error adding data: ${error}`);
//     throw new Error(`Failed to add data: ${error}`);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
