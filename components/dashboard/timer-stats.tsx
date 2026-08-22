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
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-center text-xs font-semibold text-white/40 uppercase tracking-wider">
          <span>Total Time</span>
          <Clock className="h-4 w-4 text-white/40" />
        </div>
        <div className="text-3xl font-extrabold text-white font-sora">
          {isLoading ? "0m" : formatMinutes(totalMinutes)}
        </div>
        <div className="text-xs text-white/40">All time</div>
      </div>

      <div className="bg-[#111827] border border-[#6c47ff]/30 rounded-2xl p-6 flex flex-col justify-between h-32 shadow-[0_0_32px_rgba(108,71,255,0.15)]">
        <div className="flex justify-between items-center text-xs font-semibold text-[#6c47ff] uppercase tracking-wider">
          <span>Today</span>
          <TrendingUp className="h-4 w-4 text-[#6c47ff]" />
        </div>
        <div className="text-3xl font-extrabold text-[#6c47ff] font-sora">
          {isLoading ? "0m" : formatMinutes(todayMinutes)}
        </div>
        <div className="text-xs text-white/40">Today's progress</div>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-center text-xs font-semibold text-[#38dfab] uppercase tracking-wider">
          <span>Streak</span>
          <Flame className="h-4 w-4 text-[#38dfab] fill-[#38dfab]/20" />
        </div>
        <div className="text-3xl font-extrabold text-[#38dfab] font-sora">
          {isLoading ? "..." : `${streak} ${streak === 1 ? "day" : "days"}`}
        </div>
        <div className="text-xs text-white/40">Current streak</div>
      </div>

      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-center text-xs font-semibold text-white/40 uppercase tracking-wider">
          <span>Sessions Today</span>
          <BookOpen className="h-4 w-4 text-white/40" />
        </div>
        <div className="text-3xl font-extrabold text-white font-sora">
          {isLoading ? "0" : String(sessionsCountToday)}
        </div>
        <div className="text-xs text-white/40">Work sessions</div>
      </div>
    </div>
  );
}