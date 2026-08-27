import prisma from "../lib/prisma";
import "dotenv/config";
import * as luxon from "luxon";

// Target: 1000h = 60000 mins total, 5h = 300 mins today
const TARGET_TOTAL_MINS = 60000;
const TARGET_TODAY_MINS = 300;

const SUBJECTS = ["Physics", "Calculus", "Literature", "Coding", "Math", "History", "Biology", "Chemistry", "General Study"];
const TZ = "Africa/Casablanca";

// Helper to find target user
async function findTargetUserId(): Promise<string> {
  const clerkKey = process.env.CLERK_SECRET_KEY!;
  // 1. try literal "username"
  try {
    const res = await fetch("https://api.clerk.com/v1/users?limit=100", {
      headers: { Authorization: `Bearer ${clerkKey}` },
    });
    const users = await res.json();
    if (Array.isArray(users)) {
      const literal = users.find((u: any) => u.username === "username");
      if (literal) {
        console.log(`Found literal username="username" -> ${literal.id} (${literal.username})`);
        return literal.id;
      }
      // 2. find current account = most recently active with sessions OR admin
      // Prefer admin user (mahdi22dev) which has most data
      const admin = users.find((u: any) => u.public_metadata?.role === "admin");
      if (admin) {
        console.log(`Using admin user -> ${admin.id} (${admin.username})`);
        return admin.id;
      }
      // 3. most recently active
      const sorted = [...users].sort((a: any, b: any) => (b.last_active_at || 0) - (a.last_active_at || 0));
      if (sorted[0]) {
        console.log(`Using most recent active -> ${sorted[0].id} (${sorted[0].username})`);
        return sorted[0].id;
      }
    }
  } catch (e) {
    console.warn("Clerk fetch failed, fallback to D1 max user", e);
  }

  // fallback: D1 user with max total
  const grouped = await prisma.studySession.groupBy({
    by: ["userId"],
    _sum: { durationMin: true },
  });
  if (grouped.length === 0) throw new Error("No users in DB");
  grouped.sort((a, b) => (b._sum.durationMin || 0) - (a._sum.durationMin || 0));
  console.log(`Fallback D1 max user -> ${grouped[0].userId} (${grouped[0]._sum.durationMin} mins)`);
  return grouped[0].userId;
}

async function getTotals(userId: string) {
  const totalAgg = await prisma.studySession.aggregate({
    where: { userId },
    _sum: { durationMin: true },
    _count: { id: true },
  });
  const totalMins = totalAgg._sum.durationMin || 0;
  const count = totalAgg._count.id;

  const now = luxon.DateTime.now().setZone(TZ);
  const start = now.startOf("day").toUTC().toJSDate();
  const end = now.endOf("day").toUTC().toJSDate();
  const todaySessions = await prisma.studySession.findMany({
    where: { userId, startTime: { gte: start, lte: end } },
  });
  const todayMins = todaySessions.reduce((a, s) => a + (s.durationMin || 0), 0);

  return { totalMins, count, todayMins, todayCount: todaySessions.length, start, end };
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateInPast(daysAgoMin: number, daysAgoMax: number, tz: string): Date {
  const now = luxon.DateTime.now().setZone(tz);
  const daysAgo = randomInt(daysAgoMin, daysAgoMax);
  const hours = randomInt(8, 22);
  const mins = randomInt(0, 59);
  const d = now.minus({ days: daysAgo }).set({ hour: hours, minute: mins, second: 0, millisecond: 0 });
  return d.toUTC().toJSDate();
}

async function main() {
  const targetUserId = await findTargetUserId();
  console.log(`\nTarget userId: ${targetUserId}\n`);

  let { totalMins, count, todayMins, todayCount } = await getTotals(targetUserId);
  console.log(`Before: total ${totalMins} mins (${(totalMins/60).toFixed(1)}h) in ${count} sessions`);
  console.log(`Before: today ${todayMins} mins (${(todayMins/60).toFixed(1)}h) in ${todayCount} sessions`);

  const needTotal = Math.max(0, TARGET_TOTAL_MINS - totalMins);
  const needToday = Math.max(0, TARGET_TODAY_MINS - todayMins);

  console.log(`Need: total +${needTotal} mins (${(needTotal/60).toFixed(1)}h), today +${needToday} mins (${(needToday/60).toFixed(1)}h)`);

  // Seed today first
  let seededToday = 0;
  if (needToday > 0) {
    // Create sessions today with varied times
    const sessionsToday = Math.ceil(needToday / 50); // avg 50 mins per session
    let remaining = needToday;
    console.log(`\nSeeding ${sessionsToday} sessions for TODAY (${TZ})...`);
    for (let i = 0; i < sessionsToday; i++) {
      const duration = i === sessionsToday - 1 ? remaining : Math.min(remaining - (sessionsToday - i - 1) * 25, randomInt(25, 90));
      remaining -= duration;
      const subject = SUBJECTS[randomInt(0, SUBJECTS.length - 1)];
      // Random time today between 06:00 and 22:00 Casablanca
      const now = luxon.DateTime.now().setZone(TZ);
      const hour = randomInt(6, 22);
      const minute = randomInt(0, 55);
      const start = now.set({ hour, minute, second: 0, millisecond: 0 }).toUTC().toJSDate();
      const end = new Date(start.getTime() + duration * 60000);
      await prisma.studySession.create({
        data: {
          userId: targetUserId,
          startTime: start,
          endTime: end,
          durationMin: duration,
          type: "WORK",
          subject,
          completed: true,
        },
      });
      seededToday += duration;
      if (remaining <= 0) break;
    }
    console.log(`Seeded today: ${seededToday} mins`);
  }

  // Recompute after today seeding for total need
  const afterToday = await getTotals(targetUserId);
  const needTotalAfterToday = Math.max(0, TARGET_TOTAL_MINS - afterToday.totalMins);
  console.log(`\nAfter today seeding: total ${afterToday.totalMins} mins (${(afterToday.totalMins/60).toFixed(1)}h)`);
  console.log(`Still need total: ${needTotalAfterToday} mins`);

  let seededTotal = 0;
  if (needTotalAfterToday > 0) {
    // Spread across past 365 days, exclude today (already seeded)
    const avgDuration = 45;
    const sessionsNeeded = Math.ceil(needTotalAfterToday / avgDuration);
    console.log(`Seeding ${sessionsNeeded} historical sessions across past year to reach 1k hours...`);
    let remaining = needTotalAfterToday;
    const batchSize = 50;
    let batch: any[] = [];
    for (let i = 0; i < sessionsNeeded; i++) {
      const isLast = i === sessionsNeeded - 1;
      const duration = isLast ? remaining : Math.min(remaining - (sessionsNeeded - i - 1) * 20, randomInt(20, 90));
      remaining -= duration;
      const subject = SUBJECTS[randomInt(0, SUBJECTS.length - 1)];
      // Random date between 1 and 365 days ago
      const start = randomDateInPast(1, 365, TZ);
      const end = new Date(start.getTime() + duration * 60000);
      const typeRoll = Math.random();
      let type: "WORK" | "BREAK" | "LONG_BREAK" = "WORK";
      // 90% WORK, 7% BREAK, 3% LONG_BREAK for variety
      if (typeRoll > 0.9 && typeRoll <= 0.97) type = "BREAK";
      else if (typeRoll > 0.97) type = "LONG_BREAK";

      batch.push({
        userId: targetUserId,
        startTime: start,
        endTime: end,
        durationMin: duration,
        type,
        subject: type === "WORK" ? subject : null,
        completed: true,
      });
      seededTotal += duration;

      if (batch.length >= batchSize || i === sessionsNeeded - 1) {
        // Use createMany if available, fallback to sequential
        try {
          await prisma.studySession.createMany({ data: batch });
          console.log(`  batch ${Math.floor(i/batchSize)+1}: ${batch.length} sessions, total seeded ${seededTotal} mins`);
        } catch (e) {
          // fallback sequential
          for (const data of batch) {
            await prisma.studySession.create({ data });
          }
          console.log(`  batch sequential ${batch.length} done`);
        }
        batch = [];
      }
      if (remaining <= 0) break;
    }
    console.log(`Seeded historical: ${seededTotal} mins`);
  }

  // Final verification
  const final = await getTotals(targetUserId);
  console.log(`\n=== FINAL for ${targetUserId} ===`);
  console.log(`Total: ${final.totalMins} mins = ${(final.totalMins/60).toFixed(1)}h in ${final.count} sessions (target 60000)`);
  console.log(`Today (${TZ} ${final.start.toISOString().slice(0,10)}): ${final.todayMins} mins = ${(final.todayMins/60).toFixed(1)}h in ${final.todayCount} sessions (target 300)`);

  // Also show groupBy for all users to confirm "at least 1k hours on deff sessions"
  const allGrouped = await prisma.studySession.groupBy({
    by: ["userId"],
    _sum: { durationMin: true },
    _count: { id: true },
  });
  console.log(`\n=== All users groupBy ===`);
  for (const g of allGrouped) {
    console.log(`  ${g.userId}: ${(g._sum.durationMin||0)/60}h in ${g._count.id} sessions`);
  }

  // Query with username if exists
  const clerkKey = process.env.CLERK_SECRET_KEY!;
  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${targetUserId}`, {
      headers: { Authorization: `Bearer ${clerkKey}` },
    });
    const clerkUser = await res.json();
    console.log(`\nClerk user for target: username=${clerkUser.username} email=${clerkUser.email_addresses?.[0]?.email_address} role=${clerkUser.public_metadata?.role}`);
  } catch {}

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
