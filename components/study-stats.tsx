"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, BarChart3 } from "lucide-react"

interface StudyStatsProps {
  totalMinutes: number
}

export default function StudyStats({ totalMinutes }: StudyStatsProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return { hours, minutes: mins }
  }

  const { hours, minutes } = formatTime(totalMinutes)
  const weeklyGoal = 600 // 10 hours in minutes
  const weeklyProgress = Math.min((totalMinutes / weeklyGoal) * 100, 100)

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>

      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-xl font-bold gradient-text">Study Statistics</CardTitle>
        </div>
        <CardDescription className="text-base font-medium">Your learning progress overview</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 relative z-10">
        {/* Total Time */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-study-text-secondary">Total Study Time</span>
            <span className="text-sm text-study-text-muted font-medium">All time</span>
          </div>
          <div className="text-4xl font-bold gradient-text">
            {hours > 0 ? `${hours}h ` : ""}
            {minutes}m
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-study-text-secondary">Weekly Goal</span>
            <span className="text-sm text-study-text-muted font-medium">{Math.round(weeklyProgress)}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-3 bg-purple-100" />
          <div className="text-sm text-study-text-muted font-medium">{Math.floor(totalMinutes / 60)}h / 10h target</div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-purple-100">
          <div className="text-center space-y-2">
            <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold gradient-text">0</div>
            <div className="text-xs text-study-text-muted font-medium">Days streak</div>
          </div>
          <div className="text-center space-y-2">
            <div className="p-2 bg-indigo-100 rounded-lg w-fit mx-auto">
              <Target className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold gradient-text">{Math.floor(totalMinutes / 25)}</div>
            <div className="text-xs text-study-text-muted font-medium">Pomodoros</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
