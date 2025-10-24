"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Target, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatTime } from "@/lib/utils";

interface StudyStatsProps {
  totalMinutes: number;
}

export default function StudyStats({ totalMinutes }: StudyStatsProps) {
  const [weeklyGoal, setWeeklyGoal] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weeklyGoalHours");
      return saved ? parseInt(saved) : 10;
    }
    return 10;
  });
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [tempGoal, setTempGoal] = useState(weeklyGoal);

  useEffect(() => {
    localStorage.setItem("weeklyGoalHours", weeklyGoal.toString());
  }, [weeklyGoal]);

  const handleSaveGoal = () => {
    if (tempGoal <= 0) {
      toast.error("Weekly goal must be greater than 0");
      return;
    }
    if (tempGoal > 168) {
      toast.error("Weekly goal cannot exceed 168 hours");
      return;
    }
    setWeeklyGoal(tempGoal);
    setIsGoalDialogOpen(false);
    toast.success(`Weekly goal updated to ${tempGoal} hours`);
  };

  const weeklyGoalMinutes = weeklyGoal * 60;
  const weeklyProgress = Math.min(
    (totalMinutes / weeklyGoalMinutes) * 100,
    100
  );
  const remainingMinutes = Math.max(0, weeklyGoalMinutes - totalMinutes);

  // Calculate how many weekly goals have been completed lifetime
  const weeksCompleted = Math.floor(totalMinutes / weeklyGoalMinutes);
  const currentWeekProgress = totalMinutes % weeklyGoalMinutes;
  const weeksPercentage = (
    (currentWeekProgress / weeklyGoalMinutes) *
    100
  ).toFixed(0);

  return (
    <div className="flex flex-col gap-6">
      {/* Weekly Goal Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Weekly Goal Progress
          </CardTitle>
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={() => setTempGoal(weeklyGoal)}
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Set Weekly Goal</DialogTitle>
                <DialogDescription>
                  Set your target study hours for the week
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weekly-goal">Weekly Goal (hours)</Label>
                  <Input
                    id="weekly-goal"
                    type="number"
                    min="1"
                    max="168"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(Number(e.target.value) || 0)}
                    placeholder="Enter hours"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Current goal: {weeklyGoal} hours/week
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsGoalDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveGoal} className="flex-1">
                    Save Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">{formatTime(totalMinutes)}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime total study hours
          </p>
          <div className="space-y-3 pt-3 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Weekly Goals Completed
                </span>
                <span className="text-sm font-bold">{weeksCompleted}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTime(weeklyGoalMinutes)} per week target
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Current Progress
                </span>
                <span className="text-sm font-bold">{weeksPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all duration-300"
                  style={{ width: `${weeksPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTime(currentWeekProgress)} /{" "}
                {formatTime(weeklyGoalMinutes)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Tracker Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Study Tracker</CardTitle>
          <CardDescription>Days streak & Pomodoros completed</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center space-y-2">
              <div className="p-3 bg-muted rounded-lg w-fit mx-auto">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground font-medium">
                Days streak
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="p-3 bg-muted rounded-lg w-fit mx-auto">
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
    </div>
  );
}
