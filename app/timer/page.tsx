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

  const createSession = async () => {
    try {
      setIsLoading(true);
      // Handle session creation here
      const response = await fetch("/api/add_session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user-id-placeholder",
          startTime: new Date(),
          type: "WORK",
        }),
      });

      if (!response.ok) {
        // Show error related to session creation
        toast.error("Failed to create study session. Please try again.");
        return;
      }

      const savedTime = localStorage.getItem("totalStudyTime");
      if (savedTime) {
        setTotalStudyTime(Number.parseInt(savedTime, 10));
      }
      const data = await response.json();
      currentSession.current = data.message;
      console.log("Study session created:", currentSession.current);
      // Optionally update UI or stats here
    } catch (error) {
      toast.error("Failed to create study session. Please try again.");
      throw new Error("Failed to create study session");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimer = async (minutes: number) => {
    try {
      // Handle incrementing study time here
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
          id: currentSession?.current?.id, // Replace with actual session ID
        }),
      });

      if (!response.ok) {
        // Show error related to incrementing study time
        console.error("Failed to increment study time");
        return;
      }

      const newTotal = totalStudyTime + minutes;
      setTotalStudyTime(newTotal);
      const data = await response.json();

      console.log("Study time incremented:", data);
      // Optionally update UI or stats here
    } catch (error) {
      console.error("Failed to increment study time");
      throw new Error("Failed to increment study time");
    }
  };

  const getTotalTime = () => {
    try {
    } catch (error) {}
  };
  useEffect(() => {
    createSession();
  }, []);

  const updateTotalStudyTime = (minutes: number) => {
    const newTotal = totalStudyTime + minutes;
    setTotalStudyTime(newTotal);
    localStorage.setItem("totalStudyTime", newTotal.toString());
    updateTimer(minutes);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-study-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 bg-mesh relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold gradient-text tracking-tight">
              Study Log
            </h1>
          </div>
          <p className="text-xl text-study-text-secondary font-medium max-w-2xl mx-auto leading-relaxed">
            Transform your learning journey with focused study sessions and
            intelligent progress tracking
          </p>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-study-text-secondary">
                Total Study Time
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-study-text mb-1">
                {formatTime(totalStudyTime)}
              </div>
              <p className="text-sm text-study-text-muted font-medium">
                All time progress
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-violet-50/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-study-text-secondary">
                Sessions Today
              </CardTitle>
              <div className="p-2 bg-violet-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-study-text mb-1">0</div>
              <p className="text-sm text-study-text-muted font-medium">
                Coming soon
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-study-text-secondary">
                Weekly Goal
              </CardTitle>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-study-text mb-1">10h</div>
              <p className="text-sm text-study-text-muted font-medium">
                Target
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-study-text-secondary">
                Streak
              </CardTitle>
              <div className="p-2 bg-pink-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-study-text mb-1">0</div>
              <p className="text-sm text-study-text-muted font-medium">Days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Streamlined */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Pomodoro Timer - Enhanced */}
          <div className="xl:col-span-2">
            <PomodoroTimer onStudyTimeUpdate={updateTotalStudyTime} />
          </div>

          {/* Study Stats - Enhanced */}
          <div className="space-y-6">
            <StudyStats totalMinutes={totalStudyTime} />
          </div>
        </div>
      </div>
    </div>
  );
}
