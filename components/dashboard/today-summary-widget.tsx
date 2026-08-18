"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

type Session = {
  durationMin: number;
  type: string;
  subject?: string | null;
};

interface TodaySummaryWidgetProps {
  sessions: Session[];
  isLoading?: boolean;
}

// A small palette of accent colors for subject groupings
const SUBJECT_COLORS = [
  "#7C5CFF", // purple
  "#38dfab", // teal
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#ec4899", // pink
];

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function TodaySummaryWidget({
  sessions,
  isLoading,
}: TodaySummaryWidgetProps) {
  const workSessions = useMemo(
    () => sessions.filter((s) => s.type === "WORK"),
    [sessions]
  );

  const totalMinutes = useMemo(
    () => workSessions.reduce((sum, s) => sum + (s.durationMin || 0), 0),
    [workSessions]
  );

  // Group by subject (null → "Unlabeled")
  const bySubject = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of workSessions) {
      const key = s.subject || "Unlabeled";
      map.set(key, (map.get(key) || 0) + s.durationMin);
    }
    return Array.from(map.entries())
      .map(([subject, minutes]) => ({ subject, minutes }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [workSessions]);

  return (
    <Card className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-none">
      <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center gap-2 space-y-0">
        <BarChart3 className="h-4 w-4 text-white/40" />
        <CardTitle className="text-sm font-semibold text-white/80">
          Today&apos;s Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
          </div>
        ) : workSessions.length === 0 ? (
          <p className="text-xs text-white/30 text-center py-4">
            No work sessions today
          </p>
        ) : (
          <>
            {/* Stacked bar */}
            <div className="flex h-3 rounded-full overflow-hidden gap-px">
              {bySubject.map(({ subject, minutes }, i) => {
                const pct = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
                return (
                  <div
                    key={subject}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
                    }}
                    title={`${subject}: ${formatHours(minutes)}`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2">
              {bySubject.map(({ subject, minutes }, i) => (
                <div
                  key={subject}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm flex-shrink-0"
                      style={{
                        backgroundColor: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
                      }}
                    />
                    <span className="text-white/60 truncate max-w-[120px]">
                      {subject}
                    </span>
                  </div>
                  <span className="text-white/40 tabular-nums">
                    {formatHours(minutes)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-white/5 pt-2 flex items-center justify-between text-xs">
              <span className="text-white/40">Total today</span>
              <span className="font-semibold text-white">
                {formatHours(totalMinutes)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
