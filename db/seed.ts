import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker";

function generateChartData(): string {
  const data = Array.from({ length: 7 }, () =>
    faker.number.int({ min: 100, max: 1000 })
  );
  return JSON.stringify(data); // store as string for SQLite compatibility
}

async function main() {
  for (let i = 0; i < 100; i++) {
    console.log("study session id " + i);
    await prisma.studySession.create({
      data: {
        startTime: new Date(),
        durationMin: faker.number.int(),
        completed: false,
        type: "WORK",
      },
    });
  }
}

main()
  .then(() => console.log("✅ Seeding complete"))
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
