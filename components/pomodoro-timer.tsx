"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play, Pause, RotateCcw, Coffee, Settings, Timer } from "lucide-react";
import { clearInterval, setInterval } from "worker-timers";
interface PomodoroTimerProps {
  onStudyTimeUpdate: (minutes: number) => void;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isActive: boolean;
}

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export default function PomodoroTimer({
  onStudyTimeUpdate,
  setIsActive,
  isActive,
}: PomodoroTimerProps) {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    if (saved) {
      return JSON.parse(saved) as TimerSettings;
    } else {
      return {
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
      };
    }
  });

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);

  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [minutesToAdd, setMinutesToAdd] = useState(0);
  const firstMount = useRef<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const lastMinuteRef = useRef<number>(0);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings) as TimerSettings;
      setTimeLeft(parsed.workDuration * 60);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!firstMount.current) {
      firstMount.current = true;
    } else {
      localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    }
  }, [settings]);

  // Handle adding minutes to study time (separate from render cycle)
  useEffect(() => {
    if (minutesToAdd > 0) {
      console.log(`Adding ${minutesToAdd} minutes to study time`);
      onStudyTimeUpdate(minutesToAdd);
      setMinutesToAdd(0);
    }
  }, [minutesToAdd, onStudyTimeUpdate]);

  // Main timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          // Only count study time (not break time)
          if (!isBreak && !isLongBreak && prev > 0) {
            const currentMinute = Math.floor(prev / 60);
            const newMinute = Math.floor(newTime / 60);

            // Check if we just completed a full minute
            if (currentMinute > newMinute && newTime >= 0) {
              // Schedule minute addition for next render cycle
              setMinutesToAdd(1);
            }
          }

          return Math.max(0, newTime);
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, isBreak, isLongBreak]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      // Timer completed
      if (!isBreak && !isLongBreak) {
        // Work session completed
        const newCompletedCount = completedPomodoros + 1;
        setCompletedPomodoros(newCompletedCount);

        console.log(
          `Session completed! Adding ${settings.workDuration} minutes`
        );

        // Check if it's time for a long break
        if (newCompletedCount % settings.sessionsUntilLongBreak === 0) {
          setIsLongBreak(true);
          setTimeLeft(settings.longBreakDuration * 60);
        } else {
          setIsBreak(true);
          setTimeLeft(settings.breakDuration * 60);
        }
      } else {
        // Break completed
        setIsBreak(false);
        setIsLongBreak(false);
        setTimeLeft(settings.workDuration * 60);
      }
      setIsActive(false);
    }
  }, [timeLeft, isActive, isBreak, isLongBreak, completedPomodoros, settings]);

  const toggleTimer = useCallback(() => {
    if (!isActive) {
      setSessionStartTime(Date.now());
    }
    setIsActive(!isActive);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setTimeLeft(settings.workDuration * 60);
    setSessionStartTime(null);
    setMinutesToAdd(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [settings.workDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = () => {
    let totalTime: number;
    if (isLongBreak) {
      totalTime = settings.longBreakDuration * 60;
    } else if (isBreak) {
      totalTime = settings.breakDuration * 60;
    } else {
      totalTime = settings.workDuration * 60;
    }
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getCurrentMode = () => {
    if (isLongBreak) return "Long Break";
    if (isBreak) return "Break";
    return "Focus";
  };

  const handleSettingsChange = (key: keyof TimerSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Reset timer if not active
    if (!isActive) {
      setIsBreak(false);
      setIsLongBreak(false);
      setTimeLeft(newSettings.workDuration * 60);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-muted rounded-xl">
            <Timer className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Pomodoro Timer</CardTitle>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
                <DialogDescription>
                  Customize your Pomodoro timer durations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="work-duration">Work Duration (minutes)</Label>
                  <Input
                    id="work-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.workDuration}
                    onChange={(e) =>
                      handleSettingsChange(
                        "workDuration",
                        Number.parseInt(e.target.value) || 25
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-duration">Short Break (minutes)</Label>
                  <Input
                    id="break-duration"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.breakDuration}
                    onChange={(e) =>
                      handleSettingsChange(
                        "breakDuration",
                        Number.parseInt(e.target.value) || 5
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="long-break-duration">
                    Long Break (minutes)
                  </Label>
                  <Input
                    id="long-break-duration"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreakDuration}
                    onChange={(e) =>
                      handleSettingsChange(
                        "longBreakDuration",
                        Number.parseInt(e.target.value) || 15
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessions-until-long-break">
                    Sessions until Long Break
                  </Label>
                  <Input
                    id="sessions-until-long-break"
                    type="number"
                    min="2"
                    max="10"
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) =>
                      handleSettingsChange(
                        "sessionsUntilLongBreak",
                        Number.parseInt(e.target.value) || 4
                      )
                    }
                  />
                </div>
                <Button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full"
                >
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          {isLongBreak ? (
            <Badge
              variant="default"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Coffee className="h-4 w-4" />
              Long Break Time
            </Badge>
          ) : isBreak ? (
            <Badge
              variant="default"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Coffee className="h-4 w-4" />
              Break Time
            </Badge>
          ) : (
            <Badge
              variant="default"
              className="flex items-center gap-2 px-4 py-2"
            >
              <Play className="h-4 w-4" />
              Focus Time
            </Badge>
          )}
        </div>

        <CardDescription className="text-lg">
          {isLongBreak
            ? "Take a longer break and fully recharge your mind"
            : isBreak
            ? "Take a short break and recharge"
            : "Focus deeply on your studies without distractions"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="text-7xl font-mono font-bold mb-6 tracking-wider">
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="max-w-md mx-auto">
            <Progress value={getProgress()} />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold"
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
            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold"
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{completedPomodoros}</div>
            <div className="text-sm text-muted-foreground font-medium">
              Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{getCurrentMode()}</div>
            <div className="text-sm text-muted-foreground font-medium">
              Current Mode
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {Math.ceil(completedPomodoros / settings.sessionsUntilLongBreak)}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Cycles
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground font-medium rounded-lg p-3">
          {settings.workDuration}m work • {settings.breakDuration}m break •{" "}
          {settings.longBreakDuration}m long break
        </div>
      </CardContent>
    </Card>
  );
}
