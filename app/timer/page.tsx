"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, Target, TrendingUp, Sparkles } from "lucide-react";
import PomodoroTimer from "@/components/pomodoro-timer";
import StudyStats from "@/components/study-stats";
import { toast } from "sonner";

type StudySession = {
  id: string;
  userId: string | null;
  startTime: Date;
  endTime: Date | null;
  durationMin: number;
  type: ["WORK" | "BREAK", "LONG_BREAK"];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function StudyLog() {
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const currentSession = useRef<StudySession>(null);
  const [isActive, setIsActive] = useState(false);

  const createSession = async () => {
    try {
      const response = await fetch("/api/add_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startTime: new Date(),
          type: "WORK",
        }),
      });

      if (!response.ok) {
        toast.error("Failed to create study session. Please try again.");
        return;
      }

      const data = await response.json();
      currentSession.current = data.message;
      console.log("Study session created:", currentSession.current);
    } catch (error) {
      toast.error("Failed to create study session. Please try again.");
      throw new Error("Failed to create study session");
    }
  };

  const updateTimer = async (minutes: number) => {
    try {
      if (minutes <= 0) {
        return;
      }
      if (!currentSession) {
        console.error("No current session to update");
        return;
      }
      const response = await fetch("/api/increament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentSession?.current?.id,
        }),
      });

      if (!response.ok) {
        console.error("Failed to increment study time");
        return;
      }

      const newTotal = totalStudyTime + minutes;
      setTotalStudyTime(newTotal);
      await response.json();
    } catch (error) {
      console.error("Failed to increment study time");
      throw new Error("Failed to increment study time");
    }
  };

  const getTotalTime = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/get_time", {});
      if (!response.ok) {
        toast.error("Failed to fetch total study time. Please try again.");
        return;
      }

      const data = await response.json();
      if (typeof data.totalMinutes === "number") {
        setTotalStudyTime(data.totalMinutes);
      }
    } catch (error) {
      toast.error("Failed to fetch total study time. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTotalTime();
  }, []);
  useEffect(() => {
    if (isActive) {
      if (!currentSession.current) {
        createSession();
      }
    }
    return () => {
      currentSession.current = null;
    };
  }, [isActive]);

  const updateTotalStudyTime = (minutes: number) => {
    const newTotal = totalStudyTime + minutes;
    setTotalStudyTime(newTotal);
    updateTimer(minutes);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-b-transparent animate-spin"></div>
        </div>
        <div className="text-lg font-medium animate-pulse">
          Loading your study data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-muted rounded-2xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Study Log</h1>
          </div>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Transform your learning journey with focused study sessions and
            intelligent progress tracking
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total Study Time
              </CardTitle>
              <div className="p-2 bg-muted rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {formatTime(totalStudyTime)}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                All time progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Sessions Today
              </CardTitle>
              <div className="p-2 bg-muted rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">0</div>
              <p className="text-sm text-muted-foreground font-medium">
                Coming soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Weekly Goal
              </CardTitle>
              <div className="p-2 bg-muted rounded-lg">
                <Target className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">10h</div>
              <p className="text-sm text-muted-foreground font-medium">
                Target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Streak
              </CardTitle>
              <div className="p-2 bg-muted rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">0</div>
              <p className="text-sm text-muted-foreground font-medium">Days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <PomodoroTimer
              onStudyTimeUpdate={updateTotalStudyTime}
              isActive={isActive}
              setIsActive={setIsActive}
            />
          </div>
          <div className="space-y-6">
            <StudyStats totalMinutes={totalStudyTime} />
          </div>
        </div>
      </div>
    </div>
  );
}
