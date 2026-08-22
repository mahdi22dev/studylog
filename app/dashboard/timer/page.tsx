"use client";

import { useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TimerStats } from "@/components/dashboard/timer-stats";
import { SubjectDistribution } from "@/components/dashboard/subject-distribution";
import { RecentSessionsTable } from "@/components/dashboard/recent-sessions-table";
import StudyStats from "@/components/study-stats";
import PomodoroTimer from "@/components/pomodoro/pomodoro-timer";
import { useSessionsData } from "@/hooks/use-sessions-data";
import { usePomodoroSession } from "@/hooks/use-pomodoro-session";
import { computeStreak, computeSubjectDistribution, mergeSessions } from "@/lib/utils";

export default function DashboardTimerPage() {
  const {
    recentSessions,
    todaySessions,
    weeklySessions,
    totalMinutes,
    todayMinutes,
    sessionsCountToday,
    isLoading,
    setTotalMinutes,
    setTodayMinutes,
  } = useSessionsData();

  const {
    isActive,
    isBreak,
    isLongBreak,
    setIsActive,
    setIsBreak,
    setIsLongBreak,
    updateTotalStudyTime,
    completedPomodoro,
  } = usePomodoroSession(setTotalMinutes, setTodayMinutes);

  const allSessionsCombined = useMemo(
    () => mergeSessions(weeklySessions, todaySessions, recentSessions),
    [weeklySessions, todaySessions, recentSessions]
  );

  const streak = useMemo(() => computeStreak(allSessionsCombined), [allSessionsCombined]);

  const subjectDistribution = useMemo(
    () =>
      computeSubjectDistribution(
        mergeSessions(weeklySessions, recentSessions)
      ),
    [weeklySessions, recentSessions]
  );

  return (
    <div className="flex min-h-screen bg-[#0A0D14] text-[#e1e2ec] font-sans">
      <DashboardSidebar />

      <div className="flex-1 md:ml-64 flex flex-col relative min-h-screen">
        <DashboardTopbar />

        <main className="flex-1 pt-24 px-6 md:px-10 pb-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white font-sora tracking-tight">
                Pomodoro Timer
              </h2>
            </div>

            <TimerStats
              isLoading={isLoading}
              totalMinutes={totalMinutes}
              todayMinutes={todayMinutes}
              streak={streak}
              sessionsCountToday={sessionsCountToday}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <PomodoroTimer
                  onStudyTimeUpdate={updateTotalStudyTime}
                  isActive={isActive}
                  setIsActive={setIsActive}
                  setIsBreak={setIsBreak}
                  setIsLongBreak={setIsLongBreak}
                  isBreak={isBreak}
                  isLongBreak={isLongBreak}
                  completedPomodoro={completedPomodoro}
                />

                <RecentSessionsTable sessions={recentSessions} isLoading={isLoading} />
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6">
                <SubjectDistribution
                  items={subjectDistribution.items}
                  totalHoursStr={subjectDistribution.totalHoursStr}
                />

                <StudyStats totalMinutes={totalMinutes} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}