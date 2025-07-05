"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, BarChart3 } from "lucide-react";

interface StudyStatsProps {
  totalMinutes: number;
}

export default function StudyStats({ totalMinutes }: StudyStatsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return { hours, minutes: mins };
  };

  const { hours, minutes } = formatTime(totalMinutes);
  const weeklyGoal = 600; // 10 hours in minutes
  const weeklyProgress = Math.min((totalMinutes / weeklyGoal) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-muted rounded-lg">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-bold">Study Statistics</CardTitle>
        </div>
        <CardDescription className="text-base font-medium">
          Your learning progress overview
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Total Time */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">
              Total Study Time
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              All time
            </span>
          </div>
          <div className="text-4xl font-bold">
            {hours > 0 ? `${hours}h ` : ""}
            {minutes}m
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">
              Weekly Goal
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              {Math.round(weeklyProgress)}%
            </span>
          </div>
          <Progress value={weeklyProgress} />
          <div className="text-sm text-muted-foreground font-medium">
            {Math.floor(totalMinutes / 60)}h / 10h target
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-6 pt-6 border-t">
          <div className="text-center space-y-2">
            <div className="p-2 bg-muted rounded-lg w-fit mx-auto">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground font-medium">
              Days streak
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="p-2 bg-muted rounded-lg w-fit mx-auto">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {Math.floor(totalMinutes / 25)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Pomodoros
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
