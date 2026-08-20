"use client";

import { useEffect, useRef, useState } from "react";
import type { ColumnDef } from "@/components/ui/shadcn-io/table";
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "@/components/ui/shadcn-io/table";
import { Clock, Calendar, TrendingUp, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { StudySession } from "@prisma/client";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UpgradeDialog } from "@/components/billing/upgrade-dialog";

interface DayStudyData {
  id: string;
  date: Date;
  sessions: number;
  totalMinutes: number;
  averageSessionMinutes: number;
}

export default function StudyHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [studyData, setStudyData] = useState<DayStudyData[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const ListOfDays = useRef(new Map<string, StudySession[]>());

  const historyDays = isPremium ? 30 : 7;

  const getAvarageSessions = async (days: number = 7) => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setIsLoading(true);
      const response = await fetch(
        `/api/avarge?timezone=${encodeURIComponent(timezone)}&days=${days}`
      );

      if (!response.ok) {
        toast.error("Unable to load study sessions. Please try again later.");
        return;
      }

      const resData = await response.json();
      const rawSessions: StudySession[] = Array.isArray(resData)
        ? resData
        : resData.message || [];

      // Initialize map with the last `days` (today down to days-1 ago)
      ListOfDays.current.clear();
      const weekData: DayStudyData[] = [];

      for (let i = 0; i < Math.min(days, 30); i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.toDateString();
        ListOfDays.current.set(dateKey, []);
      }

      // Group WORK sessions by date
      rawSessions.forEach((session) => {
        if (session.type && session.type !== "WORK") return;
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        const dateKey = sessionDate.toDateString();

        if (ListOfDays.current.has(dateKey)) {
          ListOfDays.current.get(dateKey)!.push(session);
        }
      });

      // Convert map to DayStudyData array
      ListOfDays.current.forEach((sessions, dateKey) => {
        const date = new Date(dateKey);
        const totalMinutes = sessions.reduce(
          (sum, session) => sum + (session.durationMin || 0),
          0
        );
        const sessionCount = sessions.length;
        const averageSessionMinutes =
          sessionCount > 0 ? Math.floor(totalMinutes / sessionCount) : 0;

        weekData.push({
          id: dateKey,
          date,
          sessions: sessionCount,
          totalMinutes,
          averageSessionMinutes,
        });
      });

      // Sort by date (most recent first)
      weekData.sort((a, b) => b.date.getTime() - a.date.getTime());
      setStudyData(weekData.slice(0, days));
    } catch (error) {
      console.error("Error fetching average sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/billing/status");
        const data = await res.json();
        if (cancelled) return;
        const premium = data.isPremium === true;
        setIsPremium(premium);
        await getAvarageSessions(premium ? 30 : 7);
      } catch {
        if (!cancelled) {
          setIsPremium(false);
          await getAvarageSessions(7);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalSessions = studyData.reduce((sum, day) => sum + day.sessions, 0);
  const totalMinutes = studyData.reduce(
    (sum, day) => sum + day.totalMinutes,
    0
  );
  
  // Calculate average hours/day across the 7 days
  const averageHoursPerDay =
    studyData.length > 0
      ? (totalMinutes / 60 / studyData.length).toFixed(1)
      : "0.0";
  const averageSessionMinutes =
    totalSessions > 0 ? Math.floor(totalMinutes / totalSessions) : 0;
  const averageMinutesPerDay =
    studyData.length > 0 ? totalMinutes / studyData.length : 0;

  const columns: ColumnDef<DayStudyData>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        const isToday = date.toDateString() === new Date().toDateString();
        const isYesterday =
          date.toDateString() ===
          new Date(Date.now() - 86400000).toDateString();

        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1d1f27] border border-white/5 text-white/40">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-white">
                {isToday
                  ? "Today"
                  : isYesterday
                  ? "Yesterday"
                  : date.toLocaleDateString("en-US", { weekday: "long" })}
              </span>
              <div className="text-xs text-white/40">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "sessions",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Sessions" />
      ),
      cell: ({ row }) => (
        <div className="flex items-baseline gap-1.5 font-sora">
          <span className="text-xl font-bold text-white">
            {row.original.sessions}
          </span>
          <span className="text-xs text-white/40 font-sans">sessions</span>
        </div>
      ),
    },
    {
      accessorKey: "totalMinutes",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Total Time" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-white font-medium">
          <Clock className="h-4 w-4 text-white/40" />
          <span>{formatTime(row.original.totalMinutes)}</span>
        </div>
      ),
    },
    {
      accessorKey: "averageSessionMinutes",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Avg Session" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-white/70">
          <TrendingUp className="h-4 w-4 text-white/30" />
          <span>{formatTime(row.original.averageSessionMinutes)}</span>
        </div>
      ),
    },
    {
      accessorKey: "comparison",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="vs Average" />
      ),
      cell: ({ row }) => {
        const dayMinutes = row.original.totalMinutes;
        const diff = dayMinutes - averageMinutesPerDay;
        const percentChange =
          averageMinutesPerDay > 0
            ? ((diff / averageMinutesPerDay) * 100).toFixed(0)
            : "0";

        const isPositive = diff > 0;
        const isNeutral = diff === 0;

        return (
          <div className="flex items-center gap-2 font-medium text-xs">
            {isNeutral ? (
              <span className="text-white/40">—</span>
            ) : (
              <span
                className={isPositive ? "text-[#38dfab]" : "text-red-400"}
              >
                {isPositive ? "+" : ""}
                {percentChange}%
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "dayOverDay",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="vs Previous Day" />
      ),
      cell: ({ row }) => {
        const currentIndex = studyData.findIndex(
          (day) => day.id === row.original.id
        );

        if (currentIndex === studyData.length - 1) {
          return <span className="text-xs text-white/40">—</span>;
        }

        const previousDay = studyData[currentIndex + 1];
        const currentMinutes = row.original.totalMinutes;
        const previousMinutes = previousDay.totalMinutes;
        const diff = currentMinutes - previousMinutes;

        let percentChange: string;
        if (previousMinutes === 0 && currentMinutes === 0) percentChange = "0";
        else if (previousMinutes === 0 && currentMinutes > 0) percentChange = "100";
        else if (currentMinutes === 0 && previousMinutes > 0) percentChange = "-100";
        else percentChange = ((diff / previousMinutes) * 100).toFixed(0);

        const isPositive = diff > 0;
        const isNeutral = diff === 0;

        return (
          <div className="flex items-center gap-2 text-xs">
            {isNeutral ? (
              <span className="text-white/40">—</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-semibold ${
                    isPositive ? "text-[#38dfab]" : "text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {percentChange}%
                </span>
                <span className="text-white/40">
                  ({isPositive ? "+" : ""}
                  {formatTime(Math.abs(diff))})
                </span>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-white/40">
        <div className="w-8 h-8 border-2 border-[#6c47ff] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium animate-pulse">
          Loading analytics history...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Real Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Hours / Day */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Average Hours/Day
            </span>
            <Clock className="h-4 w-4 text-[#6c47ff]" />
          </div>
          <div className="text-3xl font-extrabold text-white font-sora mb-1">
            {averageHoursPerDay}h
          </div>
          <p className="text-xs text-white/40">
            Recent {historyDays} days average
          </p>
        </div>

        {/* Average Session Length */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Average Session Length
            </span>
            <TrendingUp className="text-[#38dfab] h-4 w-4" />
          </div>
          <div className="text-3xl font-extrabold text-white font-sora mb-1">
            {formatTime(averageSessionMinutes)}
          </div>
          <p className="text-xs text-white/40">Across {totalSessions} sessions</p>
        </div>

        {/* Total Study Time (7 Days) */}
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Total Study Time
            </span>
            <Calendar className="h-4 w-4 text-[#cebdff]" />
          </div>
          <div className="text-3xl font-extrabold text-[#cebdff] font-sora mb-1">
            {formatTime(totalMinutes)}
          </div>
          <p className="text-xs text-white/40">
            Last {historyDays} days combined
          </p>
        </div>
      </div>

      {/* Main Table: Last 7 Days Real Data */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden relative">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white font-sora">
              Study History - Last {historyDays} Days
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              Daily study sessions and progress trends
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#6c47ff]/15 text-[#6c47ff] border border-[#6c47ff]/30 text-xs font-semibold">
            {isPremium ? "Pro Plan: 30 Days" : "Free Plan: 7 Days"}
          </span>
        </div>

        <div className="p-6">
          <TableProvider columns={columns} data={studyData}>
            <TableHeader>
              {({ headerGroup }) => (
                <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
                  {({ header }) => (
                    <TableHead
                      header={header}
                      key={header.id}
                      className="text-xs text-white/40 font-semibold uppercase tracking-wider pb-3"
                    />
                  )}
                </TableHeaderGroup>
              )}
            </TableHeader>
            <TableBody>
              {({ row }) => (
                <TableRow
                  key={row.id}
                  row={row}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {({ cell }) => (
                    <TableCell cell={cell} key={cell.id} className="py-4" />
                  )}
                </TableRow>
              )}
            </TableBody>
          </TableProvider>
        </div>

        {/* Blurred Paywall Overlay / Upgrade Call to Action (free plan only) */}
        {!isPremium && (
          <div className="relative border-t border-white/5 bg-gradient-to-b from-[#111827]/40 to-[#0d121f] p-8 text-center flex flex-col items-center justify-center overflow-hidden">
            {/* Background Blurred Row Mockups */}
            <div className="absolute inset-0 filter blur-[6px] opacity-20 pointer-events-none flex flex-col gap-3 p-6 select-none">
              <div className="h-8 bg-white/20 rounded-lg w-full" />
              <div className="h-8 bg-white/20 rounded-lg w-full" />
              <div className="h-8 bg-white/20 rounded-lg w-full" />
            </div>

            <div className="relative z-10 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#6c47ff]/20 border border-[#6c47ff]/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(108,71,255,0.4)]">
                <Sparkles className="h-6 w-6 text-[#6c47ff]" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white font-sora">
                  Unlock Your Full 30-Day Study History
                </h4>
                <p className="text-xs text-white/50 mt-1">
                  Upgrade to Focurio Pro to view the complete 30-day history
                  with day-over-day and average comparisons, instead of just
                  the last 7 days.
                </p>
              </div>

              <Button
                className="bg-[#6c47ff] hover:bg-[#5e35f1] text-white font-semibold text-sm px-8 py-3 rounded-full shadow-[0_0_25px_rgba(108,71,255,0.4)] transition-all cursor-pointer"
                onClick={() => setUpgradeOpen(true)}
              >
                <Zap className="h-4 w-4 mr-2 fill-current" />
                Upgrade to View More
              </Button>
            </div>
          </div>
        )}
      </div>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
