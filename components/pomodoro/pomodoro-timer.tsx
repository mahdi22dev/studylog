"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  SetStateAction,
  Dispatch,
} from "react";
import Link from "next/link";
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
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Timer,
  Fullscreen,
  VolumeX,
  Volume2,
  LucideFullscreen,
  Minimize2,
  Calendar,
} from "lucide-react";
import { clearInterval, setInterval } from "worker-timers";
import { useSettingsDialog } from "@/contexts/settingsDialogContext";
// @ts-expect-error: No type definitions for 'howler'
import { Howl } from "howler";
import TimerSettings from "./pomodoro-timer-dialog";
import { cn } from "@/lib/utils";

interface PomodoroTimerProps {
  onStudyTimeUpdate: (minutes: number) => void;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isActive: boolean;
  setIsBreak: Dispatch<SetStateAction<boolean>>;
  setIsLongBreak: Dispatch<SetStateAction<boolean>>;
  isBreak: boolean;
  isLongBreak: boolean;
  completedPomodoro: () => void;
}

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  setAudioDisabled: Boolean;
  skipBreaks: boolean;
}

export default function PomodoroTimer({
  onStudyTimeUpdate,
  setIsActive,
  isActive,
  setIsBreak,
  setIsLongBreak,
  isBreak,
  isLongBreak,
  completedPomodoro,
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
        setAudioDisabled: false,
        skipBreaks: false,
      };
    }
  });

  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [minutesToAdd, setMinutesToAdd] = useState(0);
  const firstMount = useRef<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const { isOpen, setIsOpen } = useSettingsDialog();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [sessionName, setSessionName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("currentSessionName") || "Study Session";
    }
    return "Study Session";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [currentQuote, setCurrentQuote] = useState(
    "Focus deeply on your studies without distractions"
  );

  // Fetch motivational quote from API
  const fetchQuote = async () => {
    try {
      const response = await fetch("/api/quote");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.quote) {
          setCurrentQuote(data.quote);
        }
      }
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      // Keep default quote if fetch fails
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      boxRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings) as TimerSettings;
      setTimeLeft(parsed.workDuration * 60);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === boxRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Fetch motivational quote on mount
    fetchQuote();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Save session name to localStorage
  useEffect(() => {
    if (sessionName) {
      localStorage.setItem("currentSessionName", sessionName);
    }
  }, [sessionName]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!firstMount.current) {
      firstMount.current = true;
    } else {
      localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
    }
  }, [settings]);

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

  const pomodorCompletedNoti = () => {
    const sound = new Howl({
      src: ["/bell.mp3"],
      volume: 4,
    });
    sound.play();
  };
  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      if (!settings.setAudioDisabled) {
        pomodorCompletedNoti();
      }
      // Timer completed
      if (!isBreak && !isLongBreak) {
        // Work session completed
        const newCompletedCount = completedPomodoros + 1;
        setCompletedPomodoros(newCompletedCount);
        completedPomodoro();
        console.log(
          `Session completed! Adding ${settings.workDuration} minutes`
        );

        // Check if breaks should be skipped
        if (settings.skipBreaks) {
          // Skip break, start new work session immediately
          setIsBreak(false);
          setIsLongBreak(false);
          setTimeLeft(settings.workDuration * 60);
          // Keep timer running when skipping breaks
          // setIsActive remains true, so no need to set it
        } else {
          // Check if it's time for a long break
          if (newCompletedCount % settings.sessionsUntilLongBreak === 0) {
            setIsLongBreak(true);
            setTimeLeft(settings.longBreakDuration * 60);
          } else {
            setIsBreak(true);
            setTimeLeft(settings.breakDuration * 60);
          }
          // Stop timer so user can manually start the break
          setIsActive(false);
        }
      } else {
        // Break completed - start new work session
        setIsBreak(false);
        setIsLongBreak(false);
        setTimeLeft(settings.workDuration * 60);
        setIsActive(false);
      }
    }
  }, [timeLeft, isActive, isBreak, isLongBreak, completedPomodoros, settings]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setTimeLeft(settings.workDuration * 60);
    setMinutesToAdd(0);
    setCompletedPomodoros(0); // Reset completed sessions count for new timer session
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

  const toggleTimer = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);

  const handleSettingsChange = <K extends keyof TimerSettings>(
    key: K,
    value: TimerSettings[K]
  ) => {
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
    <Card
      className={cn(
        "w-full",
        isFullscreen && "flex justify-center items-center flex-col"
      )}
      ref={boxRef}
    >
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-between mb-4 w-full">
          {/* Left and Center Group */}
          <div className="flex items-center gap-3 mx-auto">
            <div className="p-3 bg-muted rounded-xl">
              <Timer className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold">Pomodoro Timer</CardTitle>
            <TimerSettings
              isOpen={isOpen}
              setIsActive={setIsActive}
              setIsOpen={setIsOpen}
              settings={settings}
              setSettings={setSettings}
              setTimeLeft={setTimeLeft}
              setIsBreak={setIsBreak}
              setIsLongBreak={setIsLongBreak}
              handleSettingsChange={handleSettingsChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">View Schedule</span>
            </Link>
            <button onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Fullscreen className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() =>
                handleSettingsChange(
                  "setAudioDisabled",
                  !settings.setAudioDisabled
                )
              }
            >
              {settings.setAudioDisabled ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {/* Session Name - Only show during focus time */}

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
        {!isBreak && !isLongBreak && (
          <div className="flex items-center justify-center mb-2">
            {!isEditingName && (
              <p className="text-lg font-medium text-center text-primary">
                📝 Session Title :
              </p>
            )}

            {isEditingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingName(false);
                  }
                }}
                className="text-lg font-medium text-center bg-transparent border-b-2 border-primary focus:outline-none px-2 py-1"
                maxLength={50}
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
              >
                {sessionName}
              </button>
            )}
          </div>
        )}
        <CardDescription className="flex gap-2 items-center justify-center mb-2 ">
          <p className="text-lg font-medium text-center text-primary">
            💡 Today Quota :
          </p>
          <p className="text-base font-medium"> "{currentQuote}"</p>
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
            <div className="text-sm text-muted-foreground font-medium">
              Current Mode
            </div>
            <div className="text-3xl font-bold mb-1">{getCurrentMode()}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {Math.floor(completedPomodoros / settings.sessionsUntilLongBreak)}
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
