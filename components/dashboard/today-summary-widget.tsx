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
    <Card className="bg-card border border-border rounded-2xl shadow-none">
      <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center gap-2 space-y-0">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-sm font-semibold text-card-foreground/80">
          Today&apos;s Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        ) : workSessions.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No work sessions today
          </p>
        ) : (
          <>
            <div className="flex h-3 rounded-full overflow-hidden gap-px">
              {bySubject.map(({ subject, minutes }, i) => {
                const pct = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
                return (
                  <div
                    key={subject}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))`,
                    }}
                    title={`${subject}: ${formatHours(minutes)}`}
                  />
                );
              })}
            </div>

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
                        backgroundColor: `hsl(var(--chart-${(i % 5) + 1}))`,
                      }}
                    />
                    <span className="text-muted-foreground truncate max-w-[120px]">
                      {subject}
                    </span>
                  </div>
                  <span className="text-muted-foreground/70 tabular-nums">
                    {formatHours(minutes)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total today</span>
              <span className="font-semibold text-card-foreground">
                {formatHours(totalMinutes)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}