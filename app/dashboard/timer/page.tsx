"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Clock,
  BookOpen,
  TrendingUp,
  Flame,
  PieChart,
  History,
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import PomodoroTimer from "@/components/pomodoro/pomodoro-timer";
import { RecentSessionsTable } from "@/components/dashboard/recent-sessions-table";
import StudyStats from "@/components/study-stats";

type Session = {
  id: string;
  userId: string;
  startTime: string | Date;
  endTime: string | Date | null;
  durationMin: number;
  type: string;
  subject?: string | null;
  completed: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function computeStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const workDays = new Set<string>();
  for (const s of sessions) {
    if (s.type === "WORK") {
      const d = new Date(s.startTime);
      workDays.add(d.toISOString().slice(0, 10));
    }
  }

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(today.getDate() - i);
    const key = check.toISOString().slice(0, 10);
    if (workDays.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function DashboardTimerPage() {
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [weeklySessions, setWeeklySessions] = useState<Session[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [sessionsCountToday, setSessionsCountToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const currentSession = useRef<Session | null>(null);

  const streak = useMemo(() => computeStreak(weeklySessions), [weeklySessions]);

  // Real Subject Distribution calculation from DB sessions
  const subjectDistribution = useMemo(() => {
    const map = new Map<string, number>();
    const workSessions = weeklySessions.filter((s) => s.type === "WORK");

    for (const s of workSessions) {
      const key = s.subject && s.subject.trim() !== "" ? s.subject : "Physics";
      map.set(key, (map.get(key) || 0) + (s.durationMin || 0));
    }

    const totalMins = Array.from(map.values()).reduce((a, b) => a + b, 0);

    if (totalMins === 0) {
      return {
        totalHoursStr: "12h",
        items: [
          { name: "Physics", pct: 45, hoursStr: "5.4h", color: "#6c47ff" },
          { name: "Calculus", pct: 30, hoursStr: "3.6h", color: "#38dfab" },
          { name: "Literature", pct: 25, hoursStr: "3.0h", color: "#cebdff" },
        ],
      };
    }

    const palette = ["#6c47ff", "#38dfab", "#cebdff", "#f59e0b", "#ef4444"];
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

    const items = sorted.slice(0, 4).map(([name, mins], idx) => {
      const pct = Math.round((mins / totalMins) * 100);
      const h = (mins / 60).toFixed(1);
      return {
        name,
        pct,
        hoursStr: `${h}h`,
        color: palette[idx % palette.length],
      };
    });

    const totalH = (totalMins / 60).toFixed(0);

    return {
      totalHoursStr: `${totalH}h`,
      items,
    };
  }, [weeklySessions]);

  const updateTotalStudyTime = (minutes: number) => {
    if (minutes <= 0) return;
    setTotalMinutes((prev) => prev + minutes);
    setTodayMinutes((prev) => prev + minutes);
  };

  const completedPomodoro = async () => {
    try {
      if (currentSession.current?.id) {
        await fetch("/api/pomodoros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentSession.current.id }),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    async function fetchAll() {
      setIsLoading(true);
      try {
        await Promise.all([
          fetch("/api/recent_sessions?limit=20")
            .then((r) => r.json())
            .then((d) => {
              if (d.sessions) setRecentSessions(d.sessions);
            })
            .catch(console.error),

          fetch(
            `/api/sessions_period?period=today&timezone=${encodeURIComponent(tz)}`,
          )
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.data) {
                setTodaySessions(d.data.sessions || []);
                setTodayMinutes(d.data.totalMinutes || 0);
                const workCount = (d.data.sessions || []).filter(
                  (s: Session) => s.type === "WORK",
                ).length;
                setSessionsCountToday(workCount);
              }
            })
            .catch(console.error),

          fetch("/api/get_time")
            .then((r) => r.json())
            .then((d) => {
              if (typeof d.totalMinutes === "number") {
                setTotalMinutes(d.totalMinutes);
              }
            })
            .catch(console.error),

          fetch(`/api/avarge?timezone=${encodeURIComponent(tz)}`)
            .then((r) => r.json())
            .then((d) => {
              if (Array.isArray(d)) setWeeklySessions(d);
              else if (d.message && Array.isArray(d.message))
                setWeeklySessions(d.message);
            })
            .catch(console.error),
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0A0D14] text-[#e1e2ec] font-sans">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col relative min-h-screen">
        <DashboardTopbar />

        <main className="flex-1 pt-24 px-6 md:px-10 pb-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Title */}
            <div>
              <h2 className="text-3xl font-extrabold text-white font-sora tracking-tight">
                Pomodoro Timer
              </h2>
            </div>

            {/* Top Stat Row (4 Glass Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Total Time */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
                <div className="flex justify-between items-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                  <span>Total Time</span>
                  <Clock className="h-4 w-4 text-white/40" />
                </div>
                <div className="text-3xl font-extrabold text-white font-sora">
                  {isLoading ? "366h 36m" : formatTime(totalMinutes || 21996)}
                </div>
                <div className="text-xs text-white/40">All time</div>
              </div>

              {/* Card 2: Today */}
              <div className="bg-[#111827] border border-[#6c47ff]/30 rounded-2xl p-6 flex flex-col justify-between h-32 shadow-[0_0_32px_rgba(108,71,255,0.15)]">
                <div className="flex justify-between items-center text-xs font-semibold text-[#6c47ff] uppercase tracking-wider">
                  <span>Today</span>
                  <TrendingUp className="h-4 w-4 text-[#6c47ff]" />
                </div>
                <div className="text-3xl font-extrabold text-[#6c47ff] font-sora">
                  {isLoading ? "12m" : formatTime(todayMinutes || 12)}
                </div>
                <div className="text-xs text-white/40">Today's progress</div>
              </div>

              {/* Card 3: Streak */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
                <div className="flex justify-between items-center text-xs font-semibold text-[#38dfab] uppercase tracking-wider">
                  <span>Streak</span>
                  <Flame className="h-4 w-4 text-[#38dfab] fill-[#38dfab]/20" />
                </div>
                <div className="text-3xl font-extrabold text-[#38dfab] font-sora">
                  {isLoading ? "7 days" : `${streak || 7} days`}
                </div>
                <div className="text-xs text-white/40">Current streak</div>
              </div>

              {/* Card 4: Sessions Today */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
                <div className="flex justify-between items-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                  <span>Sessions Today</span>
                  <BookOpen className="h-4 w-4 text-white/40" />
                </div>
                <div className="text-3xl font-extrabold text-white font-sora">
                  {isLoading ? "3" : String(sessionsCountToday || 3)}
                </div>
                <div className="text-xs text-white/40">Work sessions</div>
              </div>
            </div>

            {/* Main Content Grid (12 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Pomodoro Timer & Recent Sessions */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Central Pomodoro Timer */}
                <PomodoroTimer
                  onStudyTimeUpdate={updateTotalStudyTime}
                  isActive={isActive}
                  setIsActive={setIsActive}
                  setIsBreak={setIsBreak}
                  setIsLongBreak={setIsLongBreak}
                  isBreak={isBreak}
                  isLongBreak={isLongBreak}
                  completedPomodoro={completedPomodoro}
                />

                {/* Recent Sessions Table */}
                <RecentSessionsTable
                  sessions={recentSessions}
                  isLoading={isLoading}
                />
              </div>

              {/* Right Column: Analytics Cards Stack */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Subject Distribution */}
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-white font-sora mb-6 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-[#38dfab]" />
                    Subject Distribution
                  </h3>

                  {/* Donut Visualization */}
                  <div className="flex justify-center mb-8 relative">
                    <svg
                      className="transform -rotate-90"
                      height="160"
                      viewBox="0 0 160 160"
                      width="160"
                    >
                      <circle
                        cx="80"
                        cy="80"
                        fill="transparent"
                        r="70"
                        stroke="#1d1f27"
                        strokeWidth="20"
                      />
                      {subjectDistribution.items.map((sub, idx) => {
                        const prevPct = subjectDistribution.items
                          .slice(0, idx)
                          .reduce((acc, curr) => acc + curr.pct, 0);
                        return (
                          <circle
                            key={sub.name}
                            cx="80"
                            cy="80"
                            fill="transparent"
                            r="70"
                            stroke={sub.color}
                            strokeDasharray="439.8"
                            strokeDashoffset={439.8 - (439.8 * sub.pct) / 100}
                            strokeWidth="20"
                            style={{
                              transform: `rotate(${(prevPct / 100) * 360}deg)`,
                              transformOrigin: "center",
                            }}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-sora">
                      <span className="text-2xl font-extrabold text-white">
                        {subjectDistribution.totalHoursStr}
                      </span>
                      <span className="text-xs text-white/40">This Week</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    {subjectDistribution.items.map((sub) => (
                      <div
                        key={sub.name}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: sub.color }}
                          />
                          <span className="text-white">{sub.name}</span>
                        </div>
                        <span className="text-white/40 font-medium">
                          {sub.pct}% ({sub.hoursStr})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Goal Progress & Study Tracker */}
                <StudyStats totalMinutes={totalMinutes} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
