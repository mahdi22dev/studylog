"use client";

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
import { Calendar, Target, Settings, Sparkles } from "lucide-react";
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
  const weeksCompleted = Math.floor(totalMinutes / weeklyGoalMinutes);
  const currentWeekProgress = totalMinutes % weeklyGoalMinutes;
  const weeksPercentage = Math.min(
    100,
    Math.round((currentWeekProgress / weeklyGoalMinutes) * 100)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Weekly Goal Progress Card */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-white/70 font-sora">
            Weekly Goal Progress
          </h3>
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
                onClick={() => setTempGoal(weeklyGoal)}
              >
                <Settings className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#111827] border border-white/10 text-white rounded-2xl p-6 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold font-sora text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#38dfab]" />
                  Set Weekly Goal
                </DialogTitle>
                <DialogDescription className="text-xs text-white/40">
                  Set your target study hours for each week
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="weekly-goal" className="text-xs text-white/60">
                    Weekly Goal (hours)
                  </Label>
                  <Input
                    id="weekly-goal"
                    type="number"
                    min="1"
                    max="168"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(Number(e.target.value) || 0)}
                    className="bg-[#1d1f27] border-white/10 text-white rounded-xl focus:border-[#38dfab]"
                  />
                </div>
                <p className="text-xs text-white/40">
                  Current target: {weeklyGoal} hours/week
                </p>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsGoalDialogOpen(false)}
                    className="w-1/2 bg-transparent border-white/10 text-white/60 hover:text-white rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveGoal}
                    className="w-1/2 bg-[#38dfab] hover:bg-[#2fc495] text-black font-semibold rounded-full"
                  >
                    Save Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-3xl font-extrabold text-white font-sora tracking-tight">
              {formatTime(totalMinutes)}
            </div>
            <p className="text-xs text-white/40 mt-1">Lifetime total study hours</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60 font-medium">
                Weekly Goals Completed
              </span>
              <span className="text-sm font-bold text-white font-sora">
                {weeksCompleted}
              </span>
            </div>
            <div className="text-xs text-white/40">
              {weeklyGoal}h 0m per week target
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60 font-medium">Current Progress</span>
                <span className="font-bold text-white">{weeksPercentage}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#38dfab] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${weeksPercentage}%` }}
                />
              </div>
              <p className="text-xs text-white/40">
                {formatTime(currentWeekProgress)} / {weeklyGoal}h 0m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Tracker Card */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white font-sora">Study Tracker</h3>
          <p className="text-xs text-white/40 mt-0.5">
            Days streak & Pomodoros completed
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center space-y-2">
            <div className="p-3 bg-[#1d1f27] rounded-xl w-fit mx-auto border border-white/5">
              <Calendar className="h-5 w-5 text-white/60" />
            </div>
            <div className="text-2xl font-bold text-white font-sora">0</div>
            <div className="text-xs text-white/40 font-medium">Days streak</div>
          </div>

          <div className="text-center space-y-2">
            <div className="p-3 bg-[#1d1f27] rounded-xl w-fit mx-auto border border-white/5">
              <Target className="h-5 w-5 text-white/60" />
            </div>
            <div className="text-2xl font-bold text-white font-sora">
              {Math.floor(totalMinutes / 25)}
            </div>
            <div className="text-xs text-white/40 font-medium">Pomodoros</div>
          </div>
        </div>
      </div>
    </div>
  );
}
