"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  TrendingUp,
  Minus,
  Flame,
  RotateCcw,
  Play,
  Square,
  Plus,
  Check,
  GripVertical,
  Info,
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

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
  if (!sessions || sessions.length === 0) return 0;

  const workSessions = sessions.filter(
    (s) => s.type !== "BREAK" && s.type !== "LONG_BREAK"
  );
  if (workSessions.length === 0) return 0;

  const activeDates = new Set<string>();
  for (const s of workSessions) {
    const d = new Date(s.startTime);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    activeDates.add(`${year}-${month}-${day}`);
  }

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const todayStr = formatLocalDate(today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  let startDate = today;
  if (!activeDates.has(todayStr) && activeDates.has(yesterdayStr)) {
    startDate = yesterday;
  } else if (!activeDates.has(todayStr) && !activeDates.has(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  const current = new Date(startDate);

  for (let i = 0; i < 365; i++) {
    const key = formatLocalDate(current);
    if (activeDates.has(key)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export default function DashboardContent() {
  const router = useRouter();

  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [weeklySessions, setWeeklySessions] = useState<Session[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [sessionsCountToday, setSessionsCountToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Active Session Title from localStorage or default
  const [currentSubjectName, setCurrentSubjectName] = useState("Physics Exam Review");

  // Tasks state with localStorage persistence
  const [tasks, setTasks] = useState<{ id: string; title: string; subtitle?: string; done: boolean }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardTasks");
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [
      { id: "1", title: "Complete Chapter 4 Exercises", subtitle: "Physics • Est. 45m", done: false },
      { id: "2", title: "Review Calculus Notes", subtitle: "Calculus • Est. 30m", done: false },
      { id: "3", title: "Read CS Paper", subtitle: "Comp Sci • Est. 20m", done: true },
    ];
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const allSessionsCombined = useMemo(() => {
    const map = new Map<string, Session>();
    weeklySessions?.forEach((s) => map.set(s.id, s));
    todaySessions?.forEach((s) => map.set(s.id, s));
    recentSessions?.forEach((s) => map.set(s.id, s));
    return Array.from(map.values());
  }, [weeklySessions, todaySessions, recentSessions]);

  const streak = useMemo(() => computeStreak(allSessionsCombined), [allSessionsCombined]);

  // Real Focus Score calculation
  const focusScore = useMemo(() => {
    const workSessionsToday = todaySessions.filter((s) => s.type === "WORK");
    if (workSessionsToday.length === 0) return 92; // default visual baseline
    const completed = workSessionsToday.filter((s) => s.completed).length;
    return Math.min(100, Math.round((completed / workSessionsToday.length) * 100));
  }, [todaySessions]);

  // Real Subject Distribution
  const subjectDistribution = useMemo(() => {
    const map = new Map<string, number>();

    // Combine all available session sources to ensure no data is missed
    const sessionMap = new Map<string, Session>();
    weeklySessions?.forEach((s) => sessionMap.set(s.id, s));
    todaySessions?.forEach((s) => sessionMap.set(s.id, s));
    recentSessions?.forEach((s) => sessionMap.set(s.id, s));

    const allSessions = Array.from(sessionMap.values());
    const workSessions = allSessions.filter(
      (s) => s.type !== "BREAK" && s.type !== "LONG_BREAK"
    );

    for (const s of workSessions) {
      const key = s.subject && s.subject.trim() !== "" ? s.subject.trim() : "General Study";
      map.set(key, (map.get(key) || 0) + (s.durationMin || 0));
    }

    const totalMins = Array.from(map.values()).reduce((a, b) => a + b, 0);

    if (totalMins === 0) {
      return {
        totalHoursStr: "0h",
        items: [
          { name: "No sessions logged", pct: 100, hoursStr: "0h", color: "#2d3342" },
        ],
      };
    }

    const palette = ["#6c47ff", "#38dfab", "#cebdff", "#f59e0b", "#ef4444", "#3b82f6"];
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

    const items = sorted.map(([name, mins], idx) => {
      const pct = Math.max(1, Math.round((mins / totalMins) * 100));
      const h = (mins / 60).toFixed(1);
      return {
        name,
        pct,
        hoursStr: `${h}h`,
        color: palette[idx % palette.length],
      };
    });

    const totalH = (totalMins / 60).toFixed(1);

    return {
      totalHoursStr: `${totalH}h`,
      items,
    };
  }, [weeklySessions, todaySessions, recentSessions]);

  // Real Heatmap (Study Intensity) for last 28 days
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") !== "1") return;

    const toastId = toast.loading("Applying your Pro upgrade…", {
      duration: Infinity,
    });

    let attempts = 0;
    const maxAttempts = 15;
    const interval = window.setInterval(async () => {
      attempts += 1;
      let isPremium = false;
      try {
        const res = await fetch("/api/billing/status");
        const data = await res.json();
        isPremium = data.isPremium === true;
      } catch {
        // keep polling, ignore transient errors
      }

      if (isPremium || attempts >= maxAttempts) {
        window.clearInterval(interval);
        if (isPremium) {
          toast.success("You're on Pro. Welcome aboard!", { id: toastId });
        } else {
          toast.info(
            "Upgrade received — Pro perks can take up to a minute to activate.",
            { id: toastId }
          );
        }
        window.location.href = "/dashboard/me";
      }
    }, 2000);
  }, []);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    async function fetchAll() {
      setIsLoading(true);
      try {
        await Promise.all([
          fetch("/api/recent_sessions?limit=1000")
            .then((r) => r.json())
            .then((d) => {
              if (d.sessions) setRecentSessions(d.sessions);
            })
            .catch(console.error),

          fetch(`/api/sessions_period?period=today&timezone=${encodeURIComponent(tz)}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.data) {
                setTodaySessions(d.data.sessions || []);
                setTodayMinutes(d.data.totalMinutes || 0);
                const workCount = (d.data.sessions || []).filter(
                  (s: Session) => s.type === "WORK"
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

  const handleStartFocus = () => {
    router.push("/dashboard/timer?autostart=true");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
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
    <div className="flex min-h-screen bg-[#0A0D14] text-[#e1e2ec] font-sans">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col relative min-h-screen">
        {/* TopAppBar */}
        <DashboardTopbar />

        {/* Scrollable Canvas */}
        <main className="flex-1 pt-24 px-6 md:px-10 pb-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* In-development notice */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200/90">
              <Info className="h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-xs font-medium">
                Focurio is still in development — you may run into bugs or unfinished features.
              </p>
            </div>

            {/* Page Title */}
            <div>
              <h2 className="text-3xl font-extrabold text-white font-sora tracking-tight">
                Overview
              </h2>
              <p className="text-sm text-white/50 mt-1">
                Your productivity metrics for today.
              </p>
            </div>

            {/* Top Row: Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Metric 1: Deep Work */}
              <div className="bg-[#111827] p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#6c47ff]/30 transition-all border border-white/5">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Deep Work
                  </span>
                  <TrendingUp className="text-[#38dfab] h-4 w-4" />
                </div>
                <div className="text-2xl font-bold text-white font-sora z-10">
                  {isLoading ? "0m" : formatTime(todayMinutes)}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full stroke-[#38dfab] fill-none stroke-2"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 30 L10 25 L20 28 L30 15 L40 20 L50 10 L60 15 L70 5 L80 10 L90 2 L100 5" />
                  </svg>
                </div>
              </div>

              {/* Metric 2: Focus Score */}
              <div className="bg-[#111827] p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#6c47ff]/30 transition-all border border-white/5">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Focus Score
                  </span>
                  <TrendingUp className="text-[#38dfab] h-4 w-4" />
                </div>
                <div className="text-2xl font-bold text-white font-sora z-10">
                  {focusScore}%
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full stroke-[#38dfab] fill-none stroke-2"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 20 L20 22 L40 15 L60 18 L80 8 L100 5" />
                  </svg>
                </div>
              </div>

              {/* Metric 3: Sessions */}
              <div className="bg-[#111827] p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#6c47ff]/30 transition-all border border-white/5">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Sessions
                  </span>
                  <Minus className="text-white/40 h-4 w-4" />
                </div>
                <div className="text-2xl font-bold text-white font-sora z-10">
                  {isLoading ? "0" : String(sessionsCountToday)}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full stroke-white/30 fill-none stroke-2"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 15 L20 15 L40 15 L60 15 L80 15 L100 15" />
                  </svg>
                </div>
              </div>

              {/* Metric 4: Streak */}
              <div className="bg-[#111827] p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#6c47ff]/30 transition-all border border-white/5 shadow-[0_0_25px_rgba(108,71,255,0.15)]">
                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-[#6c47ff] uppercase tracking-wider">
                    Streak
                  </span>
                  <Flame className="text-[#6c47ff] h-4 w-4 fill-[#6c47ff]/20" />
                </div>
                <div className="text-2xl font-bold text-[#6c47ff] font-sora z-10">
                  {isLoading ? "..." : `${streak} ${streak === 1 ? "Day" : "Days"}`}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg
                    className="w-full h-full stroke-[#6c47ff] fill-none stroke-2"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 30"
                  >
                    <path d="M0 30 L10 20 L20 25 L30 15 L40 20 L50 10 L60 5 L70 10 L80 5 L90 0 L100 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Middle Row: Active Timer Widget & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Active Timer */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[420px]">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-[#6c47ff]/5 blur-3xl rounded-full pointer-events-none" />

                  <h3 className="text-xl font-semibold text-white mb-2 relative z-10 font-sora">
                    {currentSubjectName}
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-[#6c47ff]/20 text-[#6c47ff] px-3.5 py-1 rounded-full text-xs font-semibold mb-8 relative z-10 border border-[#6c47ff]/30">
                    <span className="w-2 h-2 rounded-full bg-[#6c47ff] animate-pulse" />
                    Deep Work
                  </div>

                  {/* Circular Timer Display */}
                  <div className="relative w-64 h-64 mb-8 flex items-center justify-center z-10">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        className="text-white/5"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <circle
                        className="text-[#6c47ff] drop-shadow-[0_0_12px_rgba(108,71,255,0.6)]"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="45"
                        stroke="currentColor"
                        strokeDasharray="283"
                        strokeDashoffset="85"
                        strokeLinecap="round"
                        strokeWidth="4"
                      />
                    </svg>
                    <div className="absolute flex items-baseline justify-center font-sora">
                      <span className="text-6xl font-extrabold text-white tracking-tight">
                        25
                      </span>
                      <span className="text-3xl font-semibold text-white/50 ml-1">
                        :00
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-4 relative z-10">
                    <button
                      onClick={handleStartFocus}
                      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
                      title="Reset Timer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    <button
                      onClick={handleStartFocus}
                      className="px-8 py-3 rounded-full bg-[#6c47ff] text-white text-sm font-semibold hover:bg-[#5e35f1] transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(108,71,255,0.4)]"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Start Focus
                    </button>

                    <button
                      onClick={handleStartFocus}
                      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
                      title="Stop Timer"
                    >
                      <Square className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Heat Map & Donut Chart */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Study Intensity (Heatmap) */}
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col justify-between">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                    Study Intensity
                  </h4>
                  <div className="grid grid-cols-7 gap-1.5 my-auto">
                    {heatmapData.map((val, idx) => {
                      const colors = [
                        "bg-white/[0.04]",
                        "bg-[#6c47ff]/20",
                        "bg-[#6c47ff]/40",
                        "bg-[#6c47ff]/60",
                        "bg-[#6c47ff]/80",
                        "bg-[#6c47ff]",
                      ];
                      return (
                        <div
                          key={idx}
                          className={`h-7 w-full rounded-sm ${colors[val]} transition-colors`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center mt-4 text-xs text-white/40">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm bg-white/[0.04]" />
                      <div className="w-3 h-3 rounded-sm bg-[#6c47ff]/40" />
                      <div className="w-3 h-3 rounded-sm bg-[#6c47ff]/80" />
                      <div className="w-3 h-3 rounded-sm bg-[#6c47ff]" />
                    </div>
                    <span>More</span>
                  </div>
                </div>

                {/* Subject Distribution (Donut Chart) */}
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Subject Distribution
                    </h4>
                    <span className="text-[10px] font-semibold text-[#6c47ff] bg-[#6c47ff]/10 px-2 py-0.5 rounded-full border border-[#6c47ff]/20">
                      Recent & All-Time
                    </span>
                  </div>
                  <div className="flex items-center justify-between my-auto">
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 160 160">
                        <circle
                          cx="80"
                          cy="80"
                          fill="transparent"
                          r="70"
                          stroke="#1d1f27"
                          strokeWidth="18"
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
                              strokeWidth="18"
                              style={{
                                transform: `rotate(${(prevPct / 100) * 360}deg)`,
                                transformOrigin: "center",
                              }}
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center font-sora pointer-events-none">
                        <span className="text-xl font-extrabold text-white">
                          {subjectDistribution.totalHoursStr}
                        </span>
                        <span className="text-[10px] text-white/40 uppercase font-semibold">All Time</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 ml-6 max-h-32 overflow-y-auto pr-1">
                      {subjectDistribution.items.map((sub) => (
                        <div
                          key={sub.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: sub.color }}
                            />
                            <span className="text-white truncate">{sub.name}</span>
                          </div>
                          <span className="text-white/40 font-medium shrink-0 ml-2">
                            {sub.pct}% ({sub.hoursStr})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Tasks & Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Up Next / Tasks Card */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-white font-sora">
                    Up Next
                  </h4>
                  <button
                    onClick={() => setIsAddingTask(!isAddingTask)}
                    className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
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
                      className="flex-1 bg-[#1d1f27] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6c47ff]"
                    />
                    <button
                      type="submit"
                      className="bg-[#6c47ff] hover:bg-[#5e35f1] text-white px-3 py-1.5 rounded-xl text-xs font-semibold"
                    >
                      Add
                    </button>
                  </form>
                )}

                <div className="space-y-3 flex-1">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3.5 rounded-xl flex items-center gap-3 border transition-colors cursor-pointer ${
                        task.done
                          ? "bg-[#1d1f27]/50 border-transparent opacity-60"
                          : "bg-[#1d1f27] border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          task.done
                            ? "bg-[#38dfab]/20 border-[#38dfab] text-[#38dfab]"
                            : "border-white/30 hover:border-[#6c47ff]"
                        }`}
                      >
                        {task.done && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm text-white truncate ${
                            task.done ? "line-through text-white/50" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.subtitle && (
                          <p className="text-xs text-white/40 truncate">
                            {task.subtitle}
                          </p>
                        )}
                      </div>
                      <GripVertical className="h-4 w-4 text-white/20 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Trends (14 Days) Line Chart */}
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-6">
                  Performance Trends (14 Days)
                </h4>
                <div className="flex-1 relative w-full h-48 mt-auto">
                  <svg
                    className="absolute bottom-0 w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 150"
                  >
                    <defs>
                      <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#38dfab" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#38dfab" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 150 L0 100 C 50 80, 100 120, 150 90 C 200 60, 250 110, 300 50 C 350 -10, 400 30, 400 30 L400 150 Z"
                      fill="url(#trendGrad)"
                    />
                    <path
                      d="M0 100 C 50 80, 100 120, 150 90 C 200 60, 250 110, 300 50 C 350 -10, 400 30, 400 30"
                      fill="none"
                      stroke="#38dfab"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    />
                    <circle
                      cx="150"
                      cy="90"
                      fill="#111827"
                      r="4"
                      stroke="#38dfab"
                      strokeWidth="2"
                    />
                    <circle
                      cx="300"
                      cy="50"
                      fill="#111827"
                      r="4"
                      stroke="#38dfab"
                      strokeWidth="2"
                    />
                    <circle
                      cx="400"
                      cy="30"
                      fill="#111827"
                      r="4"
                      stroke="#38dfab"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="flex justify-between items-center mt-3 text-xs text-white/40 px-2">
                  <span>Mar 1</span>
                  <span>Mar 7</span>
                  <span>Mar 14</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
