import prisma from "../lib/prisma";
import "dotenv/config";
import * as luxon from "luxon";

async function main() {
  const TZ = "Africa/Casablanca";
  const now = luxon.DateTime.now().setZone(TZ);
  const startToday = now.startOf("day").toUTC().toJSDate();
  const endToday = now.endOf("day").toUTC().toJSDate();
  const start7 = now.minus({ days: 6 }).startOf("day").toUTC().toJSDate();

  const users = await prisma.studySession.groupBy({
    by: ["userId"],
    _sum: { durationMin: true },
    _count: { id: true },
  });

  for (const u of users) {
    const todayAgg = await prisma.studySession.aggregate({
      where: { userId: u.userId, startTime: { gte: startToday, lte: endToday } },
      _sum: { durationMin: true },
      _count: { id: true },
    });
    const last7Agg = await prisma.studySession.aggregate({
      where: { userId: u.userId, startTime: { gte: start7, lte: endToday } },
      _sum: { durationMin: true },
      _count: { id: true },
    });
    console.log(`\n${u.userId}: total ${(u._sum.durationMin||0)/60}h in ${u._count.id} sessions`);
    console.log(`  today: ${(todayAgg._sum.durationMin||0)} mins (${((todayAgg._sum.durationMin||0)/60).toFixed(1)}h) in ${todayAgg._count.id} sessions`);
    console.log(`  last7: ${(last7Agg._sum.durationMin||0)} mins (${((last7Agg._sum.durationMin||0)/60).toFixed(1)}h) in ${last7Agg._count.id} sessions`);
  }

  // fetch clerk usernames for mapping
  const key = process.env.CLERK_SECRET_KEY!;
  const res = await fetch("https://api.clerk.com/v1/users?limit=100", { headers: { Authorization: `Bearer ${key}` }});
  const clerkUsers: any[] = await res.json();
  const map = new Map(clerkUsers.map((u:any)=>[u.id, u.username]));
  console.log("\n--- Clerk mapping ---");
  for (const u of users) {
    console.log(`${u.userId} -> username=${map.get(u.userId) || "unknown"}`);
  }

  await prisma.$disconnect();
}
main().catch(console.error);
