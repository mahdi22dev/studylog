"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Play, Pause, RotateCcw, Coffee, Settings, Timer } from "lucide-react"

interface PomodoroTimerProps {
  onStudyTimeUpdate: (minutes: number) => void
}

interface TimerSettings {
  workDuration: number
  breakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
}

export default function PomodoroTimer({ onStudyTimeUpdate }: PomodoroTimerProps) {
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  })

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [isLongBreak, setIsLongBreak] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [minutesToAdd, setMinutesToAdd] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMinuteRef = useRef<number>(0)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      setTimeLeft(parsed.workDuration * 60)
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings))
  }, [settings])

  // Handle adding minutes to study time (separate from render cycle)
  useEffect(() => {
    if (minutesToAdd > 0) {
      console.log(`Adding ${minutesToAdd} minutes to study time`)
      onStudyTimeUpdate(minutesToAdd)
      setMinutesToAdd(0)
    }
  }, [minutesToAdd, onStudyTimeUpdate])

  // Main timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1

          // Only count study time (not break time)
          if (!isBreak && !isLongBreak && prev > 0) {
            const currentMinute = Math.floor(prev / 60)
            const newMinute = Math.floor(newTime / 60)

            // Check if we just completed a full minute
            if (currentMinute > newMinute && newTime >= 0) {
              // Schedule minute addition for next render cycle
              setMinutesToAdd(1)
            }
          }

          return Math.max(0, newTime)
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, isBreak, isLongBreak])

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      // Timer completed
      if (!isBreak && !isLongBreak) {
        // Work session completed
        const newCompletedCount = completedPomodoros + 1
        setCompletedPomodoros(newCompletedCount)

        console.log(`Session completed! Adding ${settings.workDuration} minutes`)

        // Check if it's time for a long break
        if (newCompletedCount % settings.sessionsUntilLongBreak === 0) {
          setIsLongBreak(true)
          setTimeLeft(settings.longBreakDuration * 60)
        } else {
          setIsBreak(true)
          setTimeLeft(settings.breakDuration * 60)
        }
      } else {
        // Break completed
        setIsBreak(false)
        setIsLongBreak(false)
        setTimeLeft(settings.workDuration * 60)
      }
      setIsActive(false)
    }
  }, [timeLeft, isActive, isBreak, isLongBreak, completedPomodoros, settings])

  const toggleTimer = useCallback(() => {
    if (!isActive) {
      setSessionStartTime(Date.now())
    }
    setIsActive(!isActive)
  }, [isActive])

  const resetTimer = useCallback(() => {
    setIsActive(false)
    setIsBreak(false)
    setIsLongBreak(false)
    setTimeLeft(settings.workDuration * 60)
    setSessionStartTime(null)
    setMinutesToAdd(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [settings.workDuration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    let totalTime: number
    if (isLongBreak) {
      totalTime = settings.longBreakDuration * 60
    } else if (isBreak) {
      totalTime = settings.breakDuration * 60
    } else {
      totalTime = settings.workDuration * 60
    }
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const getCurrentMode = () => {
    if (isLongBreak) return "Long Break"
    if (isBreak) return "Break"
    return "Focus"
  }

  const handleSettingsChange = (key: keyof TimerSettings, value: number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    // Reset timer if not active
    if (!isActive) {
      setIsBreak(false)
      setIsLongBreak(false)
      setTimeLeft(newSettings.workDuration * 60)
    }
  }

  return (
    <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white via-purple-50/30 to-violet-50/30 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5"></div>

      <CardHeader className="text-center relative z-10 pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
            <Timer className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold gradient-text">Pomodoro Timer</CardTitle>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2 hover:bg-purple-100">
                <Settings className="h-5 w-5 text-purple-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Timer Settings</DialogTitle>
                <DialogDescription>Customize your Pomodoro timer durations</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="work-duration" className="text-sm font-medium">
                    Work Duration (minutes)
                  </Label>
                  <Input
                    id="work-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.workDuration}
                    onChange={(e) => handleSettingsChange("workDuration", Number.parseInt(e.target.value) || 25)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-duration" className="text-sm font-medium">
                    Short Break (minutes)
                  </Label>
                  <Input
                    id="break-duration"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.breakDuration}
                    onChange={(e) => handleSettingsChange("breakDuration", Number.parseInt(e.target.value) || 5)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="long-break-duration" className="text-sm font-medium">
                    Long Break (minutes)
                  </Label>
                  <Input
                    id="long-break-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreakDuration}
                    onChange={(e) => handleSettingsChange("longBreakDuration", Number.parseInt(e.target.value) || 15)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessions-until-long-break" className="text-sm font-medium">
                    Sessions until Long Break
                  </Label>
                  <Input
                    id="sessions-until-long-break"
                    type="number"
                    min="2"
                    max="10"
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) =>
                      handleSettingsChange("sessionsUntilLongBreak", Number.parseInt(e.target.value) || 4)
                    }
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <Button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium"
                >
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          {isLongBreak ? (
            <Badge className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
              <Coffee className="h-4 w-4" />
              Long Break Time
            </Badge>
          ) : isBreak ? (
            <Badge className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
              <Coffee className="h-4 w-4" />
              Break Time
            </Badge>
          ) : (
            <Badge className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-lg">
              <Play className="h-4 w-4" />
              Focus Time
            </Badge>
          )}
        </div>

        <CardDescription className="text-lg text-study-text-secondary font-medium">
          {isLongBreak
            ? "Take a longer break and fully recharge your mind"
            : isBreak
              ? "Take a short break and recharge"
              : "Focus deeply on your studies without distractions"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 relative z-10">
        {/* Enhanced Timer Display */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="text-7xl font-mono font-bold gradient-text mb-6 tracking-wider">{formatTime(timeLeft)}</div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-2xl blur-xl"></div>
          </div>
          <div className="max-w-md mx-auto">
            <Progress value={getProgress()} className="w-full h-4 bg-purple-100" />
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isActive ? (
              <>
                <Pause className="h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Start
              </>
            )}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 bg-transparent"
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </Button>
        </div>

        {/* Enhanced Session Stats */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-purple-100">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{completedPomodoros}</div>
            <div className="text-sm text-study-text-muted font-medium">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{getCurrentMode()}</div>
            <div className="text-sm text-study-text-muted font-medium">Current Mode</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-1">
              {Math.ceil(completedPomodoros / settings.sessionsUntilLongBreak)}
            </div>
            <div className="text-sm text-study-text-muted font-medium">Cycles</div>
          </div>
        </div>

        {/* Settings Preview */}
        <div className="text-center text-sm text-study-text-muted font-medium bg-purple-50 rounded-lg p-3">
          {settings.workDuration}m work • {settings.breakDuration}m break • {settings.longBreakDuration}m long break
        </div>
      </CardContent>
    </Card>
  )
}
