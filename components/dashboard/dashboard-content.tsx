"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  TrendingUp,
  Minus,
  Flame,
  Plus,
  Check,
  GripVertical,
  Info,
  BarChart3,
  BookOpen,
  Calculator,
  Library,
  Crown,
  ArrowRight,
  Clock,
  ChevronRight,
  Zap,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionsData } from "@/hooks/use-sessions-data";
import {
  computeStreak,
  computeSubjectDistribution,
  formatMinutes,
  formatTime,
  mergeSessions,
} from "@/lib/utils";
import { GENERAL_STUDY } from "@/lib/constants";

export default function DashboardContent() {
  const router = useRouter();
  const { user } = useUser();
  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  const isPremium = role === "premium" || role === "admin";

  const {
    recentSessions,
    todaySessions,
    weeklySessions,
    totalMinutes,
    todayMinutes,
    sessionsCountToday,
    isLoading,
  } = useSessionsData();

  const [currentSubjectName, setCurrentSubjectName] =
    useState("Normal session");

  const [tasks, setTasks] = useState<
    { id: string; title: string; subtitle?: string; done: boolean }[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardTasks");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [
      {
        id: "1",
        title: "Complete Chapter 4 Exercises",
        subtitle: "Physics • Est. 45m",
        done: false,
      },
      {
        id: "2",
        title: "Review Calculus Notes",
        subtitle: "Calculus • Est. 30m",
        done: false,
      },
      {
        id: "3",
        title: "Read CS Paper",
        subtitle: "Comp Sci • Est. 20m",
        done: true,
      },
    ];
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const allSessionsCombined = useMemo(
    () => mergeSessions(weeklySessions, todaySessions, recentSessions),
    [weeklySessions, todaySessions, recentSessions],
  );

  const streak = useMemo(
    () => computeStreak(allSessionsCombined),
    [allSessionsCombined],
  );

  const focusScore = useMemo(() => {
    const workSessionsToday = todaySessions.filter((s) => s.type === "WORK");
    if (workSessionsToday.length === 0) return 92;
    const completed = workSessionsToday.filter((s) => s.completed).length;
    return Math.min(
      100,
      Math.round((completed / workSessionsToday.length) * 100),
    );
  }, [todaySessions]);

  const subjectDistribution = useMemo(
    () => computeSubjectDistribution(allSessionsCombined),
    [allSessionsCombined],
  );

  const heatmapData = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of weeklySessions) {
      if (s.type === "WORK") {
        const d = new Date(s.startTime).toISOString().slice(0, 10);
        map.set(d, (map.get(d) || 0) + (s.durationMin || 0));
      }
    }
    const tiles = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const mins = map.get(key) || 0;
      let level = 0;
      if (mins > 0 && mins < 30) level = 1;
      else if (mins >= 30 && mins < 60) level = 2;
      else if (mins >= 60 && mins < 120) level = 3;
      else if (mins >= 120 && mins < 180) level = 4;
      else if (mins >= 180) level = 5;
      tiles.push(level);
    }
    return tiles;
  }, [weeklySessions]);

  // ── Focus Intensity weekly data ──
  const focusIntensity = useMemo(() => {
    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
    const now = new Date();
    const todayIdx = now.getDay(); // 0 Sun
    // start of this week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - todayIdx);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);

    const toKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const dailyMap = new Map<string, number>();
    for (const s of allSessionsCombined) {
      if (s.type === "WORK" || s.type === "WORK".toLowerCase()) {
        // also count any work session
      }
      if (s.type !== "WORK" && s.type !== "BREAK" && s.type !== "LONG_BREAK") {
        // still count if no type? filter only WORK ideally
        if (s.type !== "WORK") continue;
      }
      // Strict: only WORK
      if (s.type !== "WORK") continue;
      const d = new Date(s.startTime);
      const k = toKey(d);
      dailyMap.set(k, (dailyMap.get(k) || 0) + (s.durationMin || 0));
    }
    // fallback: if we filtered too strictly and have no data, count all non-break
    if (dailyMap.size === 0) {
      for (const s of allSessionsCombined) {
        if (s.type === "BREAK" || s.type === "LONG_BREAK") continue;
        const d = new Date(s.startTime);
        const k = toKey(d);
        dailyMap.set(k, (dailyMap.get(k) || 0) + (s.durationMin || 0));
      }
    }

    const thisWeekDaily: number[] = [];
    const lastWeekDaily: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      thisWeekDaily.push(dailyMap.get(toKey(d)) || 0);
      const ld = new Date(startOfLastWeek);
      ld.setDate(startOfLastWeek.getDate() + i);
      lastWeekDaily.push(dailyMap.get(toKey(ld)) || 0);
    }

    const thisWeekTotal = thisWeekDaily.reduce((a, b) => a + b, 0);
    const lastWeekTotal = lastWeekDaily.reduce((a, b) => a + b, 0);

    let pctChange = 0;
    if (lastWeekTotal === 0) {
      pctChange = thisWeekTotal > 0 ? 100 : 0;
    } else {
      pctChange = Math.round(
        ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100,
      );
    }

    const maxMins = Math.max(...thisWeekDaily, 30);

    return {
      dayLabels,
      thisWeekDaily,
      todayIdx,
      thisWeekTotal,
      lastWeekTotal,
      pctChange,
      maxMins,
    };
  }, [allSessionsCombined]);

  // ── Recent Subjects (unique by subject, most recent first) ──
  const recentSubjects = useMemo(() => {
    const map = new Map<string, (typeof recentSessions)[number]>();
    const sorted = [...recentSessions].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
    for (const s of sorted) {
      const subj = (s.subject && s.subject.trim()) || GENERAL_STUDY;
      if (!map.has(subj)) map.set(subj, s);
      if (map.size >= 3) break;
    }
    return Array.from(map.entries()).map(([subject, session]) => {
      const lower = subject.toLowerCase();
      let icon: typeof BookOpen = BookOpen;
      let iconBg = "bg-muted";
      let iconColor = "text-muted-foreground";
      if (lower.includes("phys")) {
        icon = BookOpen;
        iconBg = "bg-secondary/15";
        iconColor = "text-secondary";
      } else if (lower.includes("calc") || lower.includes("math")) {
        icon = Calculator;
        iconBg = "bg-primary/10";
        iconColor = "text-primary";
      } else if (lower.includes("liter") || lower.includes("history") || lower.includes("english")) {
        icon = Library;
        iconBg = "bg-success/10";
        iconColor = "text-success";
      } else if (lower.includes("code") || lower.includes("cs") || lower.includes("comp")) {
        icon = Zap;
        iconBg = "bg-secondary/15";
        iconColor = "text-secondary";
      }

      // status heuristic
      let status: "Active" | "Paused" | "Completed" = "Completed";
      let statusClass = "bg-success/15 text-success border-success/20";
      if (!session.completed) {
        status = "Active";
        statusClass = "bg-primary/10 text-primary border-primary/20";
      } else if ((session.durationMin || 0) < 25) {
        // short completed could be paused? keep Completed for simplicity
        status = "Completed";
      }

      // randomize a tag for demo if none
      const tags: string[] = [];
      if (subject.toLowerCase().includes("phys")) tags.push("Deep Focus", "Morning");
      else if (subject.toLowerCase().includes("calc")) tags.push("Problem Set");
      else tags.push("Reading");

      return {
        subject,
        durationMin: session.durationMin || 25,
        icon,
        iconBg,
        iconColor,
        status,
        statusClass,
        tags,
      };
    });
  }, [recentSessions]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("currentSessionName");
      if (savedName) setCurrentSubjectName(savedName);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardTasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleStartFocus = () => {
    router.push("/dashboard/timer?autostart=true");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: newTaskTitle.trim(),
        subtitle: `${currentSubjectName} • Est. 25m`,
        done: false,
      },
    ]);
    setNewTaskTitle("");
    setIsAddingTask(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <div className="flex-1 flex flex-col relative min-h-screen">
        <DashboardTopbar />

        <main className="flex-1 pt-20 px-6 md:px-10 pb-10">
          <div className="max-w-[1440px] mx-auto space-y-8">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border">
              <Info className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">
                Focurio is still in development — you may run into bugs or
                unfinished features.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-foreground font-sora tracking-tight">
                Overview
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your productivity metrics for today.
              </p>
            </div>

            {/* Top Row: Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/30 transition-all border border-border">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Deep Work
                  </span>
                  <TrendingUp className="text-success h-4 w-4" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-20 rounded-lg" />
                ) : (
                  <div className="text-2xl font-bold text-card-foreground font-sora z-10">
                    {formatTime(todayMinutes)}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full fill-none stroke-2"
                    style={{ stroke: "hsl(var(--success))" }}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 30 L10 25 L20 28 L30 15 L40 20 L50 10 L60 15 L70 5 L80 10 L90 2 L100 5" />
                  </svg>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/30 transition-all border border-border">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Focus Score
                  </span>
                  <TrendingUp className="text-success h-4 w-4" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-14 rounded-lg" />
                ) : (
                  <div className="text-2xl font-bold text-card-foreground font-sora z-10">
                    {focusScore}%
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full fill-none stroke-2"
                    style={{ stroke: "hsl(var(--success))" }}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 20 L20 22 L40 15 L60 18 L80 8 L100 5" />
                  </svg>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/30 transition-all border border-border">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sessions
                  </span>
                  <Minus className="text-muted-foreground h-4 w-4" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-10 rounded-lg" />
                ) : (
                  <div className="text-2xl font-bold text-card-foreground font-sora z-10">
                    {String(sessionsCountToday)}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full fill-none stroke-2"
                    style={{ stroke: "hsl(var(--muted-foreground))" }}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 15 L20 15 L40 15 L60 15 L80 15 L100 15" />
                  </svg>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/30 transition-all border border-border glow-primary">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Streak
                  </span>
                  <Flame className="text-primary h-4 w-4 fill-primary/20" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 rounded-lg" />
                ) : (
                  <div className="text-2xl font-bold text-primary font-sora z-10">
                    {`${streak} ${streak === 1 ? "Day" : "Days"}`}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full fill-none stroke-2"
                    style={{ stroke: "hsl(var(--primary))" }}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 30 L10 20 L20 25 L30 15 L40 20 L50 10 L60 5 L70 10 L80 5 L90 0 L100 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ── Bento Grid (Stitch) ── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
              {/* Focus Intensity — 8 cols */}
              <div className="md:col-span-8 bg-card border border-border rounded-xl p-8 flex flex-col gap-6 min-h-[400px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <h2 className="font-sora text-lg font-semibold text-foreground">
                        Focus Intensity
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Track changes in focus time and access detailed data on
                      each study session
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-muted px-4 py-2 rounded-full text-sm font-medium text-foreground border border-border">
                    Week
                    <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex-grow flex items-end justify-between relative mt-2 pb-12">
                    <div className="absolute left-0 bottom-12 space-y-2">
                      <Skeleton className="h-12 w-28 rounded-lg" />
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-4 w-28 rounded" />
                    </div>
                    <div className="w-full h-48 flex items-end justify-end gap-2 md:gap-3 pr-2">
                      {Array.from({ length: 7 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2 h-full justify-end w-10 md:w-12"
                        >
                          <Skeleton className="w-2 rounded-full" style={{ height: `${30 + idx * 7}%` }} />
                          <Skeleton className="w-8 h-8 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex items-end justify-between relative mt-2 pb-12">
                    <div className="absolute left-0 bottom-12">
                      <div className="font-sora text-[48px] font-extrabold tracking-tight text-foreground leading-none mb-1">
                        {focusIntensity.pctChange > 0 ? `+${focusIntensity.pctChange}%` : `${focusIntensity.pctChange}%`}
                      </div>
                      <p className="text-sm text-muted-foreground max-w-[140px] leading-snug">
                        This week&apos;s focus is {focusIntensity.pctChange >= 0 ? "higher" : "lower"} than last week&apos;s
                      </p>
                    </div>

                    <div className="w-full h-48 flex items-end justify-end gap-2 md:gap-3 pr-2">
                      {focusIntensity.dayLabels.map((label, idx) => {
                        const mins = focusIntensity.thisWeekDaily[idx] ?? 0;
                        const isToday = idx === focusIntensity.todayIdx;
                        const hPct = focusIntensity.maxMins > 0
                          ? Math.max(12, (mins / focusIntensity.maxMins) * 85)
                          : 12;
                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-2 group h-full justify-end w-10 md:w-12 relative"
                          >
                            {isToday && mins > 0 && (
                              <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-popover border border-border text-foreground text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md">
                                {formatMinutes(mins)}
                              </div>
                            )}
                            {isToday && (
                              <div className="w-12 h-full bg-primary/10 rounded-t-full absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none" />
                            )}
                            <div
                              className={`w-2 rounded-full transition-colors relative ${isToday ? "bg-primary" : "bg-muted group-hover:bg-primary/60"}`}
                              style={{ height: `${hPct}%` }}
                            >
                              <div
                                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary ${isToday ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                              />
                            </div>
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${isToday ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}
                            >
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Your Recent Subjects — 4 cols */}
              <div className="md:col-span-4 bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-sora text-base font-semibold text-foreground">
                    Your Recent Subjects
                  </h3>
                  <Link
                    href="/notes"
                    className="text-muted-foreground hover:text-primary text-xs font-medium border-b border-border pb-0.5 transition-colors"
                  >
                    See all
                  </Link>
                </div>

                <div className="flex flex-col gap-4">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-muted border border-border animate-pulse h-[88px]"
                      />
                    ))
                  ) : recentSubjects.length === 0 ? (
                    <div className="p-6 rounded-lg bg-muted border border-border text-center">
                      <p className="text-sm text-muted-foreground">
                        No sessions yet. Start a focus session to see subjects here.
                      </p>
                      <button
                        onClick={handleStartFocus}
                        className="mt-3 text-xs font-semibold text-primary hover:underline"
                      >
                        Start Focus →
                      </button>
                    </div>
                  ) : (
                    recentSubjects.map((item) => (
                      <div
                        key={item.subject}
                        className="p-4 rounded-lg bg-muted border border-border hover:bg-accent transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconBg} ${item.iconColor}`}
                            >
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">
                                {item.subject}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {item.durationMin}m session
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${item.statusClass}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        {item.tags.length > 0 && (
                          <div className="flex gap-2">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className="bg-card px-3 py-1 rounded-full text-[11px] font-medium text-muted-foreground border border-border"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Unlock Premium / Pro Momentum — 6 cols (was 4, expanded since Study Buddies skipped) */}
              {isLoading ? (
                <div className="md:col-span-6 bg-card border border-border rounded-xl p-6 flex flex-col justify-between min-h-[260px]">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-64 rounded" />
                    <div className="grid grid-cols-3 gap-3 mt-5">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-muted rounded-xl p-3 border border-border">
                          <Skeleton className="h-6 w-10 mx-auto rounded mb-2" />
                          <Skeleton className="h-3 w-16 mx-auto rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-11 w-full rounded-full mt-6" />
                </div>
              ) : isPremium ? (
                <div className="md:col-span-6 bg-card border border-primary/30 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px] glow-active">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 80% 100%, hsl(var(--primary)) 0%, transparent 55%)` }} />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 bg-success/15 text-success px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-success/20 mb-3">
                      <Crown className="h-3 w-3" />
                      Pro Active
                    </div>
                    <h3 className="font-sora text-lg font-bold text-foreground mb-1">
                      Your momentum is strong
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
                      Unlimited history, advanced analytics & streak insights — all unlocked.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-5">
                      <div className="bg-muted rounded-xl p-3 text-center border border-border">
                        <div className="text-lg font-extrabold text-primary font-sora">{streak}</div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Day streak</div>
                      </div>
                      <div className="bg-muted rounded-xl p-3 text-center border border-border">
                        <div className="text-lg font-extrabold text-foreground font-sora">{subjectDistribution.totalHoursStr}</div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Total focus</div>
                      </div>
                      <div className="bg-muted rounded-xl p-3 text-center border border-border">
                        <div className="text-lg font-extrabold text-success font-sora">{todaySessions.filter((s) => s.type === "WORK").length}</div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Today</div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/analytics"
                    className="relative z-10 mt-6 w-full bg-primary text-primary-foreground text-sm font-semibold py-3 px-4 rounded-full flex items-center justify-between hover:bg-primary/90 transition-colors glow-primary"
                  >
                    View advanced analytics
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="md:col-span-6 bg-card border border-border rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 100% 100%, hsl(var(--primary)) 0%, transparent 60%)` }} />
                    <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <pattern height="10" id="dots-premium" patternUnits="userSpaceOnUse" width="10">
                        <circle cx="2" cy="2" fill="hsl(var(--primary))" r="1" />
                      </pattern>
                      <rect fill="url(#dots-premium)" height="100%" width="100%" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-sora text-lg font-semibold text-foreground mb-2">
                      Unlock Premium Features
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
                      Get access to exclusive benefits and expand your focus capabilities
                    </p>
                  </div>
                  <Link
                    href="/#pricing"
                    className="relative z-10 w-full mt-6 bg-primary text-primary-foreground text-sm font-semibold py-3 px-4 rounded-full flex items-center justify-between hover:bg-primary/90 transition-colors glow-primary"
                  >
                    Upgrade now
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

              {/* Subject Distribution — 6 cols */}
              <div className="md:col-span-6 bg-card border border-border rounded-xl p-6 flex flex-col min-h-[260px]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-sora text-base font-semibold text-foreground">
                    Subject Distribution
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <span className="text-sm leading-none">⋮</span>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-4 gap-4">
                    <Skeleton className="w-36 h-36 rounded-full" />
                    <div className="grid grid-cols-3 gap-4 w-full mt-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <Skeleton className="h-3 w-16 rounded" />
                          <Skeleton className="h-4 w-10 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : subjectDistribution.items.length === 0 || subjectDistribution.totalHoursStr === "0h" ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center mb-3">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No distribution yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Start studying to see breakdown</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex items-center justify-center relative py-2">
                      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="hsl(var(--muted))" strokeWidth="3.2" />
                        {(() => {
                          let offset = 0;
                          return subjectDistribution.items.slice(0, 5).map((item) => {
                            const dash = `${item.pct} ${100 - item.pct}`;
                            const el = (
                              <circle
                                key={item.name}
                                cx="18"
                                cy="18"
                                fill="transparent"
                                r="15.915"
                                stroke={item.color}
                                strokeWidth="3.2"
                                strokeDasharray={dash}
                                strokeDashoffset={String(-offset)}
                                strokeLinecap="round"
                              />
                            );
                            offset += item.pct;
                            return el;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-sora text-lg font-extrabold text-foreground">
                          100%
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Total
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {subjectDistribution.items.slice(0, 3).map((item) => (
                        <div key={item.name} className="flex flex-col items-center text-center">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-medium text-foreground truncate max-w-[60px]">{item.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                    {subjectDistribution.items.length > 3 && (
                      <p className="text-center text-xs text-muted-foreground mt-2">
                        +{subjectDistribution.items.length - 3} more subjects
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Study Intensity & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Study Intensity
                </h4>
                {isLoading ? (
                  <div className="grid grid-cols-7 gap-1.5 my-auto">
                    {Array.from({ length: 28 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-7 w-full rounded-sm" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1.5 my-auto">
                    {heatmapData.map((val, idx) => {
                      const colors = [
                        "bg-muted",
                        "bg-primary/20",
                        "bg-primary/40",
                        "bg-primary/60",
                        "bg-primary/80",
                        "bg-primary",
                      ];
                      return (
                        <div
                          key={idx}
                          className={`h-7 w-full rounded-sm ${colors[val]} transition-colors`}
                        />
                      );
                    })}
                  </div>
                )}
                <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted" />
                    <div className="w-3 h-3 rounded-sm bg-primary/40" />
                    <div className="w-3 h-3 rounded-sm bg-primary/80" />
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                  </div>
                  <span>More</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-center">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Today&apos;s Progress
                </h4>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <Skeleton className="h-8 w-20 rounded-lg" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-foreground font-sora">
                        {formatMinutes(todayMinutes)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {formatMinutes(totalMinutes)} total
                      </span>
                    </div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, totalMinutes > 0 ? (todayMinutes / Math.max(totalMinutes, 1)) * 100 : 0)}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Row: Tasks & Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-card-foreground font-sora">
                    Up Next
                  </h4>
                  <button
                    onClick={() => setIsAddingTask(!isAddingTask)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-accent"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                {isAddingTask && (
                  <form onSubmit={addTask} className="mb-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      autoFocus
                      className="flex-1 bg-input border border-border rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-xl text-xs font-semibold"
                    >
                      Add
                    </button>
                  </form>
                )}

                <div className="space-y-3 flex-1">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl flex items-center gap-3 border border-border bg-accent"
                      >
                        <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 rounded" />
                          <Skeleton className="h-3 w-1/2 rounded" />
                        </div>
                        <Skeleton className="h-4 w-4 rounded" />
                      </div>
                    ))
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-3.5 rounded-xl flex items-center gap-3 border transition-colors cursor-pointer ${
                          task.done
                            ? "bg-muted/50 border-transparent opacity-60"
                            : "bg-accent border-border hover:border-primary/30"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            task.done
                              ? "bg-success/20 border-success text-success"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {task.done && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm text-card-foreground truncate ${
                              task.done
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.subtitle && (
                            <p className="text-xs text-muted-foreground truncate">
                              {task.subtitle}
                            </p>
                          )}
                        </div>
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col relative overflow-hidden">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                  Performance Trends (14 Days)
                </h4>
                {isLoading ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <Skeleton className="w-full h-48 rounded-xl" />
                    <div className="flex justify-between px-2">
                      <Skeleton className="h-3 w-10 rounded" />
                      <Skeleton className="h-3 w-10 rounded" />
                      <Skeleton className="h-3 w-10 rounded" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 relative w-full h-48 mt-auto">
                      <svg
                        className="absolute bottom-0 w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 150"
                      >
                        <defs>
                          <linearGradient
                            id="trendGrad"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--success))"
                              stopOpacity="0.3"
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--success))"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 150 L0 100 C 50 80, 100 120, 150 90 C 200 60, 250 110, 300 50 C 350 -10, 400 30, 400 30 L400 150 Z"
                          fill="url(#trendGrad)"
                        />
                        <path
                          d="M0 100 C 50 80, 100 120, 150 90 C 200 60, 250 110, 300 50 C 350 -10, 400 30, 400 30"
                          fill="none"
                          stroke="hsl(var(--success))"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                        />
                        <circle
                          cx="150"
                          cy="90"
                          fill="hsl(var(--card))"
                          r="4"
                          stroke="hsl(var(--success))"
                          strokeWidth="2"
                        />
                        <circle
                          cx="300"
                          cy="50"
                          fill="hsl(var(--card))"
                          r="4"
                          stroke="hsl(var(--success))"
                          strokeWidth="2"
                        />
                        <circle
                          cx="400"
                          cy="30"
                          fill="hsl(var(--card))"
                          r="4"
                          stroke="hsl(var(--success))"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground px-2">
                      <span>Mar 1</span>
                      <span>Mar 7</span>
                      <span>Mar 14</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
