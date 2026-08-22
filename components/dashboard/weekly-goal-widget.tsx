"use client";

import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

type Session = {
  durationMin: number;
  type: string;
  startTime: string | Date;
};

interface WeeklyGoalWidgetProps {
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

export function WeeklyGoalWidget({ sessions, isLoading }: WeeklyGoalWidgetProps) {
  const [goalHours, setGoalHours] = useState(10);

  useEffect(() => {
    const stored = localStorage.getItem("weeklyGoalHours");
    if (stored) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed) && parsed > 0) setGoalHours(parsed);
    }
  }, []);

  const weeklyMinutes = useMemo(() => {
    return sessions
      .filter((s) => s.type === "WORK")
      .reduce((sum, s) => sum + (s.durationMin || 0), 0);
  }, [sessions]);

  const goalMinutes = goalHours * 60;
  const progressPct = Math.min(100, Math.round((weeklyMinutes / goalMinutes) * 100));

  return (
    <Card className="bg-card border border-border rounded-2xl shadow-none">
      <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center gap-2 space-y-0">
        <Target className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-sm font-semibold text-card-foreground/80">
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-3">
        {isLoading ? (
          <div className="h-8 bg-muted rounded animate-pulse" />
        ) : (
          <>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-card-foreground">
                {formatHours(weeklyMinutes)}
              </span>
              <span className="text-xs text-muted-foreground mb-1">
                / {goalHours}h goal
              </span>
            </div>
            <Progress
              value={progressPct}
              className="h-2 bg-muted [&>div]:bg-primary rounded-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-muted-foreground">
                {progressPct}% complete
              </span>
              {progressPct >= 100 && (
                <span className="text-[11px] text-success font-medium">
                  Goal reached!
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}