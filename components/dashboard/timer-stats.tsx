"use client";

import { Clock, BookOpen, TrendingUp, Flame } from "lucide-react";
import { formatMinutes } from "@/lib/utils";

interface TimerStatsProps {
  isLoading: boolean;
  totalMinutes: number;
  todayMinutes: number;
  streak: number;
  sessionsCountToday: number;
}

export function TimerStats({
  isLoading,
  totalMinutes,
  todayMinutes,
  streak,
  sessionsCountToday,
}: TimerStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Time */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Total Time</span>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-3xl font-extrabold text-card-foreground font-sora">
          {isLoading ? "0m" : formatMinutes(totalMinutes)}
        </div>
        <div className="text-xs text-muted-foreground">All time</div>
      </div>

      {/* Today */}
      <div className="bg-card border border-primary/30 rounded-2xl p-6 flex flex-col justify-between h-32 glow-active">
        <div className="flex justify-between items-center text-xs font-semibold text-primary uppercase tracking-wider">
          <span>Today</span>
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="text-3xl font-extrabold text-primary font-sora">
          {isLoading ? "0m" : formatMinutes(todayMinutes)}
        </div>
        <div className="text-xs text-muted-foreground">Today's progress</div>
      </div>

      {/* Streak */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-center text-xs font-semibold text-success uppercase tracking-wider">
          <span>Streak</span>
          <Flame className="h-4 w-4 text-success fill-success/20" />
        </div>
        <div className="text-3xl font-extrabold text-success font-sora">
          {isLoading ? "..." : `${streak} ${streak === 1 ? "day" : "days"}`}
        </div>
        <div className="text-xs text-muted-foreground">Current streak</div>
      </div>

      {/* Sessions Today */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Sessions Today</span>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-3xl font-extrabold text-card-foreground font-sora">
          {isLoading ? "0" : String(sessionsCountToday)}
        </div>
        <div className="text-xs text-muted-foreground">Work sessions</div>
      </div>
    </div>
  );
}

