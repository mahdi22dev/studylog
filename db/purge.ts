import prisma from "@/lib/prisma";

async function purgeDatabase() {
  try {
    await prisma.studySession.deleteMany({});

    console.log("Database purged successfully.");
  } catch (error) {
    console.error("Error purging database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

purgeDatabase();
